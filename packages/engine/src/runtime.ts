import { validateAnyScene, type AnyScene, type SceneDiagnostic } from './scene.ts';

export type RuntimeSelectAction = { type: 'select'; objectId: string };
export type RuntimeHintAction = { type: 'hint' };
export type RuntimeResetAction = { type: 'reset' };
export type RuntimeCompleteAction = { type: 'complete' };
export type RuntimeAction = RuntimeSelectAction | RuntimeHintAction | RuntimeResetAction | RuntimeCompleteAction;

export type RuntimeFoundEvent = { readonly type: 'found'; readonly objectId: string };
export type RuntimeDuplicateEvent = { readonly type: 'duplicate'; readonly objectId: string };
export type RuntimeHintEvent = { readonly type: 'hint'; readonly objectId: string };
export type RuntimeCompletedEvent = { readonly type: 'completed' };
export type RuntimeResetEvent = { readonly type: 'reset' };
export type RuntimeEvent = RuntimeFoundEvent | RuntimeDuplicateEvent | RuntimeHintEvent | RuntimeCompletedEvent | RuntimeResetEvent;

export interface RuntimeState {
  readonly sceneId: string;
  readonly foundIds: readonly string[];
  readonly score: number;
  readonly hintsUsed: number;
  readonly hintBudget: number;
  readonly completed: boolean;
}

export interface RuntimeOptions {
  hintBudget: number;
}

export interface RuntimeDiagnostic {
  code:
    | 'RUNTIME_INVALID_OPTIONS'
    | 'RUNTIME_INVALID_ACTION'
    | 'RUNTIME_UNKNOWN_OBJECT'
    | 'RUNTIME_HINT_EXHAUSTED'
    | 'RUNTIME_NO_HINT_TARGET'
    | 'RUNTIME_INCOMPLETE';
  pointer: string;
  requirement: string;
  message: string;
}

export type RuntimeCreateResult =
  | { ok: true; runtime: Runtime }
  | { ok: false; errors: readonly (SceneDiagnostic | RuntimeDiagnostic)[] };

export type RuntimeStepResult =
  | { ok: true; state: RuntimeState; events: readonly RuntimeEvent[] }
  | { ok: false; state: RuntimeState; errors: readonly RuntimeDiagnostic[]; events: readonly RuntimeEvent[] };

export interface Runtime {
  getState(): RuntimeState;
  step(action: unknown): RuntimeStepResult;
}

interface InternalState {
  found: string[];
  hintsUsed: number;
  completed: boolean;
}

const freeze = <T>(value: T): T => {
  if (value !== null && typeof value === 'object') {
    for (const child of Object.values(value)) freeze(child);
    Object.freeze(value);
  }
  return value;
};

const deepClone = <T>(value: T): T => structuredClone(value);

const sortedDiagnostics = (errors: RuntimeDiagnostic[]) =>
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

function validateOptions(options: unknown): RuntimeDiagnostic[] {
  const errors: RuntimeDiagnostic[] = [];
  if (!isDataRecord(options) || Object.keys(options).some(key => key !== 'hintBudget')) {
    errors.push({
      code: 'RUNTIME_INVALID_OPTIONS',
      pointer: '',
      requirement: 'RTN-OPTIONS-001',
      message: 'Runtime options must be an object with a nonnegative safe-integer hintBudget.',
    });
    return errors;
  }
  const { hintBudget } = options;
  if (typeof hintBudget !== 'number' || !Number.isSafeInteger(hintBudget) || hintBudget < 0) {
    errors.push({
      code: 'RUNTIME_INVALID_OPTIONS',
      pointer: '/hintBudget',
      requirement: 'RTN-OPTIONS-001',
      message: 'hintBudget must be a nonnegative safe integer.',
    });
  }
  return errors;
}

function parseAction(input: unknown): { ok: true; action: RuntimeAction } | { ok: false; errors: RuntimeDiagnostic[] } {
  if (!isDataRecord(input)) {
    return {
      ok: false,
      errors: [{
        code: 'RUNTIME_INVALID_ACTION',
        pointer: '',
        requirement: 'RTN-ACTION-001',
        message: 'Action must be a structured object with a supported type field.',
      }],
    };
  }
  const record = input as Record<string, unknown>;
  const allowed = record.type === 'select' ? ['type', 'objectId'] : ['type'];
  const extra = Object.keys(record).find(key => !allowed.includes(key));
  if (extra !== undefined) return {
    ok: false,
    errors: [{ code: 'RUNTIME_INVALID_ACTION',
      pointer: '/' + extra.replaceAll('~', '~0').replaceAll('/', '~1'),
      requirement: 'RTN-ACTION-001', message: 'Unknown action property.' }],
  };
  if (record.type === 'select') {
    if (typeof record.objectId !== 'string') {
      return {
        ok: false,
        errors: [{
          code: 'RUNTIME_INVALID_ACTION',
          pointer: '/objectId',
          requirement: 'RTN-ACTION-001',
          message: 'select actions require a string objectId.',
        }],
      };
    }
    return { ok: true, action: { type: 'select', objectId: record.objectId } };
  }
  if (record.type === 'hint') return { ok: true, action: { type: 'hint' } };
  if (record.type === 'reset') return { ok: true, action: { type: 'reset' } };
  if (record.type === 'complete') return { ok: true, action: { type: 'complete' } };
  return {
    ok: false,
    errors: [{
      code: 'RUNTIME_INVALID_ACTION',
      pointer: '/type',
      requirement: 'RTN-ACTION-001',
      message: typeof record.type === 'string'
        ? `Unsupported action type "${record.type}".`
        : 'Action type must be one of select, hint, reset or complete.',
    }],
  };
}

function firstRemainingRequired(requiredIds: readonly string[], found: ReadonlySet<string>): string | undefined {
  for (const id of requiredIds) {
    if (!found.has(id)) return id;
  }
  return undefined;
}

function allRequiredFound(requiredIds: readonly string[], found: ReadonlySet<string>): boolean {
  return requiredIds.every(id => found.has(id));
}

function publicState(sceneId: string, internal: InternalState, hintBudget: number): RuntimeState {
  const foundIds = Object.freeze([...internal.found]);
  return freeze({
    sceneId,
    foundIds,
    score: foundIds.length,
    hintsUsed: internal.hintsUsed,
    hintBudget,
    completed: internal.completed,
  });
}

function failStep(state: RuntimeState, errors: RuntimeDiagnostic[]): RuntimeStepResult {
  return freeze({ ok: false, state, errors: sortedDiagnostics(errors), events: [] });
}

class RuntimeSession implements Runtime {
  readonly #sceneId: string;
  readonly #objectIds: ReadonlySet<string>;
  readonly #requiredIds: readonly string[];
  readonly #hintBudget: number;
  #internal: InternalState;

  constructor(scene: AnyScene, hintBudget: number) {
    this.#sceneId = scene.id;
    this.#objectIds = new Set(scene.objects.map(object => object.id));
    this.#requiredIds = Object.freeze([...scene.completion.requiredIds]);
    this.#hintBudget = hintBudget;
    this.#internal = { found: [], hintsUsed: 0, completed: false };
  }

  getState(): RuntimeState {
    return publicState(this.#sceneId, this.#internal, this.#hintBudget);
  }

  step(input: unknown): RuntimeStepResult {
    const before = this.getState();
    const parsed = parseAction(input);
    if (!parsed.ok) return failStep(before, parsed.errors);

    const action = parsed.action;
    const events: RuntimeEvent[] = [];
    const foundSet = () => new Set(this.#internal.found);

    switch (action.type) {
      case 'select': {
        if (!this.#objectIds.has(action.objectId)) {
          return failStep(before, [{
            code: 'RUNTIME_UNKNOWN_OBJECT',
            pointer: '/objectId',
            requirement: 'RTN-SELECT-001',
            message: `Object "${action.objectId}" is not defined in the scene.`,
          }]);
        }
        if (foundSet().has(action.objectId)) {
          events.push({ type: 'duplicate', objectId: action.objectId });
        } else {
          this.#internal.found.push(action.objectId);
          events.push({ type: 'found', objectId: action.objectId });
          if (!this.#internal.completed && allRequiredFound(this.#requiredIds, foundSet())) {
            this.#internal.completed = true;
            events.push({ type: 'completed' });
          }
        }
        break;
      }
      case 'hint': {
        if (this.#internal.hintsUsed >= this.#hintBudget) {
          return failStep(before, [{
            code: 'RUNTIME_HINT_EXHAUSTED',
            pointer: '/hintBudget',
            requirement: 'RTN-HINT-001',
            message: 'Hint budget is exhausted for this run.',
          }]);
        }
        const target = firstRemainingRequired(this.#requiredIds, foundSet());
        if (target === undefined) {
          return failStep(before, [{
            code: 'RUNTIME_NO_HINT_TARGET',
            pointer: '/completion/requiredIds',
            requirement: 'RTN-HINT-001',
            message: 'No remaining required object is available to hint.',
          }]);
        }
        this.#internal.hintsUsed += 1;
        events.push({ type: 'hint', objectId: target });
        break;
      }
      case 'complete': {
        if (this.#internal.completed) break;
        if (!allRequiredFound(this.#requiredIds, foundSet())) {
          return failStep(before, [{
            code: 'RUNTIME_INCOMPLETE',
            pointer: '/completion/requiredIds',
            requirement: 'RTN-COMPLETE-001',
            message: 'Complete every required object before requesting completion.',
          }]);
        }
        this.#internal.completed = true;
        events.push({ type: 'completed' });
        break;
      }
      case 'reset': {
        this.#internal = { found: [], hintsUsed: 0, completed: false };
        events.push({ type: 'reset' });
        break;
      }
    }

    return freeze({ ok: true, state: this.getState(), events });
  }
}

/** Create a headless runtime session from external scene data. */
export function createRuntime(scene: unknown, options: unknown): RuntimeCreateResult {
  const optionErrors = validateOptions(options);
  if (optionErrors.length) {
    return freeze({ ok: false, errors: sortedDiagnostics(optionErrors) });
  }

  const validation = validateAnyScene(scene);
  if (!validation.ok) return freeze({ ok: false, errors: [...validation.errors] });

  const snapshot = freeze(deepClone(validation.scene));
  return { ok: true, runtime: Object.freeze(new RuntimeSession(snapshot, (options as RuntimeOptions).hintBudget)) };
}
