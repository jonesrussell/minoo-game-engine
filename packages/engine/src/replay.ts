import { validateScene, type SceneDiagnostic } from './scene.ts';
import {
  createRuntime,
  type RuntimeDiagnostic,
  type RuntimeEvent,
  type RuntimeState,
} from './runtime.ts';
import type { Scene } from './contracts/scene.generated.d.ts';

export const REPLAY_ENVELOPE_VERSION = 1;
export const REPLAY_RUNTIME_VERSION = 1;
export const REPLAY_ACTION_VERSION = 1;

export interface ReplayLogV1 {
  readonly version: 1;
  readonly runtimeVersion: 1;
  readonly actionVersion: 1;
  readonly content: {
    readonly revision: string;
    readonly scene: Scene;
  };
  readonly options: {
    readonly hintBudget: number;
  };
  readonly inputs: {
    readonly seed: null;
    readonly time: null;
  };
  readonly actions: readonly unknown[];
}

export interface ReplayDiagnostic {
  code:
    | 'REPLAY_INVALID_LOG'
    | 'REPLAY_UNSUPPORTED_VERSION'
    | 'REPLAY_INVALID_CONTENT'
    | 'REPLAY_INVALID_INPUTS'
    | 'REPLAY_INVALID_ACTIONS';
  pointer: string;
  requirement: string;
  message: string;
}

export type ReplayCaptureResult =
  | { ok: true; log: ReplayLogV1 }
  | { ok: false; actionIndex: number | null; errors: readonly (SceneDiagnostic | RuntimeDiagnostic | ReplayDiagnostic)[] };

export type ReplayRunResult =
  | { ok: true; state: RuntimeState; events: readonly RuntimeEvent[]; canonicalState: string }
  | {
      ok: false;
      actionIndex: number | null;
      errors: readonly (SceneDiagnostic | RuntimeDiagnostic | ReplayDiagnostic)[];
    };

const freeze = <T>(value: T): T => {
  if (value !== null && typeof value === 'object') {
    for (const child of Object.values(value)) freeze(child);
    Object.freeze(value);
  }
  return value;
};

const deepClone = <T>(value: T): T => structuredClone(value);

const sortedDiagnostics = <T extends { pointer: string; code: string; message: string }>(errors: T[]) =>
  errors.sort((a, b) => {
    const left = a.pointer + '\0' + a.code + '\0' + a.message;
    const right = b.pointer + '\0' + b.code + '\0' + b.message;
    return left < right ? -1 : left > right ? 1 : 0;
  });

function isDataRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return (prototype === Object.prototype || prototype === null)
    && Reflect.ownKeys(value).every(key => typeof key === 'string'
      && Object.getOwnPropertyDescriptor(value, key)?.enumerable
      && Object.hasOwn(Object.getOwnPropertyDescriptor(value, key)!, 'value'));
}

function replayDiagnostic(
  code: ReplayDiagnostic['code'],
  pointer: string,
  requirement: string,
  message: string,
): ReplayDiagnostic {
  return { code, pointer, requirement, message };
}

function extraKeyPointer(base: string, key: string): string {
  return `${base}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`;
}

function rejectExtraKeys(
  record: Record<string, unknown>,
  allowed: readonly string[],
  base: string,
  requirement: string,
): ReplayDiagnostic[] {
  const extra = Object.keys(record).find(key => !allowed.includes(key));
  return extra === undefined ? [] : [replayDiagnostic(
    'REPLAY_INVALID_LOG',
    extraKeyPointer(base, extra),
    requirement,
    'Unknown replay property.',
  )];
}

function nonblankRevision(value: unknown): { ok: true; revision: string } | { ok: false; errors: ReplayDiagnostic[] } {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return {
      ok: false,
      errors: [replayDiagnostic(
        'REPLAY_INVALID_CONTENT',
        '/content/revision',
        'RPL-SNAPSHOT-001',
        'content.revision must be a nonblank string.',
      )],
    };
  }
  return { ok: true, revision: value };
}

function canonicalize(value: unknown): string {
  const sortKeys = (input: unknown): unknown => {
    if (Array.isArray(input)) return input.map(sortKeys);
    if (input !== null && typeof input === 'object') {
      const record = input as Record<string, unknown>;
      const sorted: Record<string, unknown> = {};
      for (const key of Object.keys(record).sort()) {
        sorted[key] = sortKeys(record[key]);
      }
      return sorted;
    }
    return input;
  };
  return JSON.stringify(sortKeys(value));
}

type ParsedEnvelope =
  | { ok: true; log: Omit<ReplayLogV1, 'content'> & { content: { revision: string; scene: unknown } } }
  | { ok: false; errors: ReplayDiagnostic[] };

function parseEnvelope(input: unknown): ParsedEnvelope {
  if (!isDataRecord(input)) {
    return {
      ok: false,
      errors: [replayDiagnostic('REPLAY_INVALID_LOG', '', 'RPL-VERSION-001', 'Replay log must be a structured object.')],
    };
  }

  const topExtra = rejectExtraKeys(
    input,
    ['version', 'runtimeVersion', 'actionVersion', 'content', 'options', 'inputs', 'actions'],
    '',
    'RPL-VERSION-001',
  );
  if (topExtra.length) return { ok: false, errors: topExtra };

  const versions: Array<{ key: 'version' | 'runtimeVersion' | 'actionVersion'; expected: number }> = [
    { key: 'version', expected: REPLAY_ENVELOPE_VERSION },
    { key: 'runtimeVersion', expected: REPLAY_RUNTIME_VERSION },
    { key: 'actionVersion', expected: REPLAY_ACTION_VERSION },
  ];
  for (const { key, expected } of versions) {
    if (input[key] !== expected) {
      return {
        ok: false,
        errors: [replayDiagnostic(
          'REPLAY_UNSUPPORTED_VERSION',
          `/${key}`,
          'RPL-VERSION-001',
          `Unsupported ${key}; expected ${expected}.`,
        )],
      };
    }
  }

  if (!isDataRecord(input.content)) {
    return {
      ok: false,
      errors: [replayDiagnostic('REPLAY_INVALID_CONTENT', '/content', 'RPL-SNAPSHOT-001', 'content must be an object.')],
    };
  }
  const contentExtra = rejectExtraKeys(input.content, ['revision', 'scene'], '/content', 'RPL-SNAPSHOT-001');
  if (contentExtra.length) return { ok: false, errors: contentExtra };

  const revision = nonblankRevision(input.content.revision);
  if (!revision.ok) return { ok: false, errors: revision.errors };
  if (!isDataRecord(input.content.scene)) {
    return {
      ok: false,
      errors: [replayDiagnostic('REPLAY_INVALID_CONTENT', '/content/scene', 'RPL-SNAPSHOT-001', 'content.scene must be an object.')],
    };
  }

  if (!isDataRecord(input.options)) {
    return {
      ok: false,
      errors: [replayDiagnostic('REPLAY_INVALID_LOG', '/options', 'RPL-VERSION-001', 'options must be an object.')],
    };
  }
  const optionsExtra = rejectExtraKeys(input.options, ['hintBudget'], '/options', 'RPL-VERSION-001');
  if (optionsExtra.length) return { ok: false, errors: optionsExtra };
  if (typeof input.options.hintBudget !== 'number') {
    return {
      ok: false,
      errors: [replayDiagnostic('REPLAY_INVALID_LOG', '/options/hintBudget', 'RPL-VERSION-001', 'options.hintBudget must be a number.')],
    };
  }

  if (!isDataRecord(input.inputs)) {
    return {
      ok: false,
      errors: [replayDiagnostic('REPLAY_INVALID_INPUTS', '/inputs', 'RPL-VERSION-001', 'inputs must be an object.')],
    };
  }
  const inputsExtra = rejectExtraKeys(input.inputs, ['seed', 'time'], '/inputs', 'RPL-VERSION-001');
  if (inputsExtra.length) return { ok: false, errors: inputsExtra };
  if (input.inputs.seed !== null) {
    return {
      ok: false,
      errors: [replayDiagnostic('REPLAY_INVALID_INPUTS', '/inputs/seed', 'RPL-VERSION-001', 'inputs.seed must be null.')],
    };
  }
  if (input.inputs.time !== null) {
    return {
      ok: false,
      errors: [replayDiagnostic('REPLAY_INVALID_INPUTS', '/inputs/time', 'RPL-VERSION-001', 'inputs.time must be null.')],
    };
  }

  if (!Array.isArray(input.actions)) {
    return {
      ok: false,
      errors: [replayDiagnostic('REPLAY_INVALID_ACTIONS', '/actions', 'RPL-VERSION-001', 'actions must be an array.')],
    };
  }

  return {
    ok: true,
    log: {
      version: 1,
      runtimeVersion: 1,
      actionVersion: 1,
      content: {
        revision: revision.revision,
        scene: input.content.scene,
      },
      options: { hintBudget: input.options.hintBudget },
      inputs: { seed: null, time: null },
      actions: input.actions,
    },
  };
}

/** Capture a version-1 replay log from external scene, options and actions. */
export function captureReplay(
  scene: unknown,
  options: unknown,
  revision: unknown,
  actions: unknown,
): ReplayCaptureResult {
  const revisionResult = nonblankRevision(revision);
  if (!revisionResult.ok) return freeze({ ok: false, actionIndex: null, errors: revisionResult.errors });

  if (!Array.isArray(actions)) {
    return freeze({
      ok: false,
      actionIndex: null,
      errors: [replayDiagnostic('REPLAY_INVALID_ACTIONS', '/actions', 'RPL-VERSION-001', 'actions must be an array.')],
    });
  }

  const sceneValidation = validateScene(scene);
  if (!sceneValidation.ok) return freeze({ ok: false, actionIndex: null, errors: [...sceneValidation.errors] });

  const created = createRuntime(scene, options);
  if (!created.ok) return freeze({ ok: false, actionIndex: null, errors: [...created.errors] });

  for (let actionIndex = 0; actionIndex < actions.length; actionIndex++) {
    const result = created.runtime.step(actions[actionIndex]);
    if (!result.ok) return freeze({ ok: false, actionIndex, errors: [...result.errors] });
  }

  const log = freeze({
    version: 1 as const,
    runtimeVersion: 1 as const,
    actionVersion: 1 as const,
    content: {
      revision: revisionResult.revision,
      scene: deepClone(sceneValidation.scene),
    },
    options: { hintBudget: created.runtime.getState().hintBudget },
    inputs: { seed: null, time: null },
    actions: deepClone(actions),
  } satisfies ReplayLogV1);

  return freeze({ ok: true, log });
}

/** Replay a version-1 log and return the final state, events and canonical state JSON. */
export function replayLog(input: unknown): ReplayRunResult {
  const parsed = parseEnvelope(input);
  if (!parsed.ok) {
    return freeze({ ok: false, actionIndex: null, errors: sortedDiagnostics(parsed.errors) });
  }

  const created = createRuntime(parsed.log.content.scene, parsed.log.options);
  if (!created.ok) {
    return freeze({ ok: false, actionIndex: null, errors: sortedDiagnostics([...created.errors]) });
  }

  const events: RuntimeEvent[] = [];
  for (let index = 0; index < parsed.log.actions.length; index++) {
    const result = created.runtime.step(parsed.log.actions[index]);
    if (!result.ok) {
      return freeze({
        ok: false,
        actionIndex: index,
        errors: sortedDiagnostics([...result.errors]),
      });
    }
    events.push(...result.events);
  }

  const state = created.runtime.getState();
  return freeze({
    ok: true,
    state,
    events: Object.freeze(events),
    canonicalState: canonicalize(state),
  });
}
