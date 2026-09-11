import { createRuntime, type Runtime, type RuntimeDiagnostic, type RuntimeEvent } from '@minoo/engine/runtime';
import { validateSceneV2, type InvestigativeContent, type SceneV2 } from '@minoo/engine/scene-v2';
import {
  S01_SCENE_REVISION,
  createNewsroomSession,
  restoreNewsroomSession,
  type NewsroomAction,
  type NewsroomDiagnostic,
  type NewsroomEvent,
  type NewsroomSession,
  type NewsroomState,
  type NotebookEntry,
} from './session.ts';
import s02Data from '../data/s02.json' with { type: 'json' };
import s03Data from '../data/s03.json' with { type: 'json' };

export const EPISODE_SAVE_VERSION = 1;
export const S02_SCENE_REVISION = 'ford-frenzy-s02-v2-city-hall-2026-09-11';
export const S03_SCENE_REVISION = 'ford-frenzy-s03-v2-deadline-desk-2026-09-11';
export const EPISODE_ACTION_LIMIT = 3000;

export type EpisodeSceneId = 'S01' | 'S02' | 'S03';

type S01SubAction = Exclude<NewsroomAction, { type: 'reset' }>;
const S01_ACTION_TYPES: readonly S01SubAction['type'][] = ['select', 'hint', 'check-source', 'pair-recorder', 'submit-draft'];

export type S02Action =
  | { type: 'select'; objectId: string }
  | { type: 'hint' }
  | { type: 'order-timeline'; first: 'S02.O3' | 'S02.O6'; second: 'S02.O3' | 'S02.O6' }
  | { type: 'submit-timeline'; interpretation: 'order-of-reports' | 'proof-of-allegation' };
const S02_ACTION_TYPES: readonly S02Action['type'][] = ['select', 'hint', 'order-timeline', 'submit-timeline'];

export type S03Action =
  | { type: 'select'; objectId: string }
  | { type: 'hint' }
  | { type: 'choose-emphasis'; branch: 'splash-first' | 'lawyer-voice' }
  | { type: 'submit-account'; support: 'attributed-and-denied' | 'exclusive-video-claim' };
const S03_ACTION_TYPES: readonly S03Action['type'][] = ['select', 'hint', 'choose-emphasis', 'submit-account'];

export type EpisodeAction =
  | S01SubAction
  | S02Action
  | S03Action
  | { type: 'enter-scene'; scene: 'S02' | 'S03' }
  | { type: 'import-s01-save'; save: unknown }
  | { type: 'reset'; scope: 'scene' | 'episode' };

export interface EpisodeSceneProgress {
  readonly foundIds: readonly string[];
  readonly hintsUsed: number;
  readonly hintBudget: number;
  readonly searchCompleted: boolean;
  readonly hintedObjectId: string | null;
}

export interface S02State extends EpisodeSceneProgress {
  readonly timelineOrder: readonly string[];
  readonly k02Awarded: boolean;
  readonly transitionS03: 'locked' | 'unlocked';
}

export interface S03State extends EpisodeSceneProgress {
  readonly chosenEmphasis: 'splash-first' | 'lawyer-voice' | null;
  readonly k03Awarded: boolean;
}

export interface EpisodeState {
  readonly currentScene: EpisodeSceneId;
  readonly s01: NewsroomState;
  readonly s02: S02State;
  readonly s03: S03State;
  readonly notebook: readonly NotebookEntry[];
  readonly branch: 'splash-first' | 'lawyer-voice' | null;
  readonly episodeCompleted: boolean;
  readonly lastMessage: string;
}

export interface EpisodeDiagnostic {
  readonly code:
    | 'EPISODE_INVALID_ACTION'
    | 'EPISODE_SCENE_LOCKED'
    | 'EPISODE_SCENE_ORDER'
    | 'EPISODE_SCENE_RESET_LOCKED'
    | 'EPISODE_PROGRESSION_LOCKED'
    | 'EPISODE_PREREQUISITE'
    | 'EPISODE_IMPORT_NOT_FIRST'
    | 'EPISODE_INVALID_SAVE'
    | 'EPISODE_UNSUPPORTED_SAVE'
    | 'EPISODE_ACTION_LIMIT';
  readonly pointer: string;
  readonly requirement: string;
  readonly message: string;
}

export type EpisodeEvent =
  | RuntimeEvent
  | NewsroomEvent
  | { readonly type: 'scene-entered'; readonly scene: 'S02' | 'S03' }
  | { readonly type: 'timeline-retry'; readonly reasons: readonly string[] }
  | { readonly type: 'k02-awarded' }
  | { readonly type: 'account-retry'; readonly reasons: readonly string[] }
  | { readonly type: 'k03-awarded' }
  | { readonly type: 'episode-completed' }
  | { readonly type: 'scene-reset'; readonly scene: EpisodeSceneId }
  | { readonly type: 'episode-reset' }
  | { readonly type: 's01-save-imported' };

export type EpisodeStepResult =
  | { readonly ok: true; readonly state: EpisodeState; readonly events: readonly EpisodeEvent[] }
  | { readonly ok: false; readonly state: EpisodeState; readonly errors: readonly (EpisodeDiagnostic | NewsroomDiagnostic | RuntimeDiagnostic)[]; readonly events: readonly [] };

export interface EpisodeSaveV1 {
  readonly version: 1;
  readonly sceneRevisions: {
    readonly s01: typeof S01_SCENE_REVISION;
    readonly s02: typeof S02_SCENE_REVISION;
    readonly s03: typeof S03_SCENE_REVISION;
  };
  readonly actions: readonly EpisodeAction[];
}

export interface EpisodeSession {
  getState(): EpisodeState;
  getActions(): readonly EpisodeAction[];
  step(action: unknown): EpisodeStepResult;
  exportSave(): EpisodeSaveV1;
}

export type EpisodeRestoreResult =
  | { readonly ok: true; readonly session: EpisodeSession }
  | { readonly ok: false; readonly errors: readonly EpisodeDiagnostic[] };

const freeze = <T>(value: T): T => {
  if (value !== null && typeof value === 'object') {
    for (const child of Object.values(value)) freeze(child);
    Object.freeze(value);
  }
  return value;
};

const cloneFreeze = <T>(value: T): T => freeze(structuredClone(value));

function dataRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return (prototype === Object.prototype || prototype === null)
    && Reflect.ownKeys(value).every(key => typeof key === 'string'
      && Object.getOwnPropertyDescriptor(value, key)?.enumerable
      && Object.hasOwn(Object.getOwnPropertyDescriptor(value, key)!, 'value'));
}

function diagnostic(code: EpisodeDiagnostic['code'], pointer: string, requirement: string, message: string): EpisodeDiagnostic {
  return { code, pointer, requirement, message };
}

function canonicalS02Scene(): SceneV2 {
  const result = validateSceneV2(s02Data);
  if (!result.ok) throw new Error(`Bundled S02 scene is invalid: ${result.errors.map(error => `${error.pointer} ${error.message}`).join('; ')}`);
  return result.scene;
}

function canonicalS03Scene(): SceneV2 {
  const result = validateSceneV2(s03Data);
  if (!result.ok) throw new Error(`Bundled S03 scene is invalid: ${result.errors.map(error => `${error.pointer} ${error.message}`).join('; ')}`);
  return result.scene;
}

function parseAction(input: unknown): { ok: true; action: EpisodeAction } | { ok: false; errors: EpisodeDiagnostic[] } {
  if (!dataRecord(input) || typeof input.type !== 'string') return { ok: false, errors: [diagnostic('EPISODE_INVALID_ACTION', '', 'EPI-ACTION-001', 'Action must be a plain object with a supported type.')] };
  const shapes: Record<string, readonly string[]> = {
    select: ['type', 'objectId'], hint: ['type'], 'check-source': ['type', 'contentId', 'reading'],
    'pair-recorder': ['type', 'connector'], 'submit-draft': ['type', 'basis'],
    'order-timeline': ['type', 'first', 'second'], 'submit-timeline': ['type', 'interpretation'],
    'choose-emphasis': ['type', 'branch'], 'submit-account': ['type', 'support'],
    'enter-scene': ['type', 'scene'], 'import-s01-save': ['type', 'save'], reset: ['type', 'scope'],
  };
  const allowed = shapes[input.type];
  if (!allowed) return { ok: false, errors: [diagnostic('EPISODE_INVALID_ACTION', '/type', 'EPI-ACTION-001', `Unsupported action type "${input.type}".`)] };
  const extra = Object.keys(input).find(key => !allowed.includes(key));
  if (extra) return { ok: false, errors: [diagnostic('EPISODE_INVALID_ACTION', `/${extra.replaceAll('~', '~0').replaceAll('/', '~1')}`, 'EPI-ACTION-001', 'Unknown action property.')] };
  if (Object.keys(input).length !== allowed.length) {
    const missing = allowed.find(key => !Object.hasOwn(input, key)) ?? '';
    return { ok: false, errors: [diagnostic('EPISODE_INVALID_ACTION', `/${missing}`, 'EPI-ACTION-001', `Action requires ${missing}.`)] };
  }
  switch (input.type) {
    case 'select':
      if (typeof input.objectId === 'string') return { ok: true, action: { type: 'select', objectId: input.objectId } };
      break;
    case 'hint':
      return { ok: true, action: { type: 'hint' } };
    case 'check-source':
      if (typeof input.contentId === 'string' && (input.reading === 'reported-account' || input.reading === 'proven-claim'))
        return { ok: true, action: { type: 'check-source', contentId: input.contentId, reading: input.reading } };
      break;
    case 'pair-recorder':
      if (input.connector === 'recorder' || input.connector === 'phone') return { ok: true, action: { type: 'pair-recorder', connector: input.connector } };
      break;
    case 'submit-draft':
      if (input.basis === 'published-report' || input.basis === 'office-rumour') return { ok: true, action: { type: 'submit-draft', basis: input.basis } };
      break;
    case 'order-timeline':
      if ((input.first === 'S02.O3' || input.first === 'S02.O6') && (input.second === 'S02.O3' || input.second === 'S02.O6')) {
        if (input.first === input.second) return { ok: false, errors: [diagnostic('EPISODE_INVALID_ACTION', '/second', 'EPI-ACTION-001', 'The timeline order must name two distinct objects.')] };
        return { ok: true, action: { type: 'order-timeline', first: input.first, second: input.second } };
      }
      break;
    case 'submit-timeline':
      if (input.interpretation === 'order-of-reports' || input.interpretation === 'proof-of-allegation')
        return { ok: true, action: { type: 'submit-timeline', interpretation: input.interpretation } };
      break;
    case 'choose-emphasis':
      if (input.branch === 'splash-first' || input.branch === 'lawyer-voice') return { ok: true, action: { type: 'choose-emphasis', branch: input.branch } };
      break;
    case 'submit-account':
      if (input.support === 'attributed-and-denied' || input.support === 'exclusive-video-claim')
        return { ok: true, action: { type: 'submit-account', support: input.support } };
      break;
    case 'enter-scene':
      if (input.scene === 'S02' || input.scene === 'S03') return { ok: true, action: { type: 'enter-scene', scene: input.scene } };
      break;
    case 'import-s01-save':
      return { ok: true, action: { type: 'import-s01-save', save: input.save } };
    case 'reset':
      if (input.scope === 'scene' || input.scope === 'episode') return { ok: true, action: { type: 'reset', scope: input.scope } };
      break;
  }
  const field = allowed[1] ?? 'type';
  return { ok: false, errors: [diagnostic('EPISODE_INVALID_ACTION', `/${field}`, 'EPI-ACTION-001', `Invalid ${input.type} action payload.`)] };
}

class SceneRuntime {
  readonly scene: SceneV2;
  readonly runtime: Runtime;
  readonly recordedContentIds: string[] = [];
  hintedObjectId: string | null = null;

  constructor(scene: SceneV2) {
    this.scene = scene;
    const created = createRuntime(scene, { hintBudget: 3 });
    if (!created.ok) throw new Error(`Bundled scene ${scene.id} could not create a runtime.`);
    this.runtime = created.runtime;
  }

  contentForObject(objectId: string): InvestigativeContent | undefined {
    const contentId = this.scene.objects.find(object => object.id === objectId)?.contentId;
    return this.scene.contents.find(content => content.id === contentId);
  }

  notebook(): NotebookEntry[] {
    return this.recordedContentIds.map(id => {
      const content = this.scene.contents.find(candidate => candidate.id === id)!;
      return { id: content.id, label: content.label, classification: content.classification, sourceRefs: [...content.sourceRefs] };
    });
  }
}

class FordEpisodeSession implements EpisodeSession {
  #s01Session: NewsroomSession;
  #s02: SceneRuntime | undefined;
  #s03: SceneRuntime | undefined;
  #currentScene: EpisodeSceneId = 'S01';
  #s02TimelineOrder: readonly string[] = [];
  #k02Awarded = false;
  #s03ChosenEmphasis: 'splash-first' | 'lawyer-voice' | null = null;
  #k03Awarded = false;
  #branch: 'splash-first' | 'lawyer-voice' | null = null;
  #episodeCompleted = false;
  #actions: EpisodeAction[] = [];
  #lastMessage = 'Start the assignment at the Haps.';

  constructor() {
    this.#s01Session = createNewsroomSession();
  }

  getState(): EpisodeState {
    return cloneFreeze({
      currentScene: this.#currentScene,
      s01: this.#s01Session.getState(),
      s02: {
        foundIds: [...(this.#s02?.runtime.getState().foundIds ?? [])],
        hintsUsed: this.#s02?.runtime.getState().hintsUsed ?? 0,
        hintBudget: 3,
        searchCompleted: this.#s02?.runtime.getState().completed ?? false,
        hintedObjectId: this.#s02?.hintedObjectId ?? null,
        timelineOrder: [...this.#s02TimelineOrder],
        k02Awarded: this.#k02Awarded,
        transitionS03: this.#k02Awarded ? 'unlocked' : 'locked',
      },
      s03: {
        foundIds: [...(this.#s03?.runtime.getState().foundIds ?? [])],
        hintsUsed: this.#s03?.runtime.getState().hintsUsed ?? 0,
        hintBudget: 3,
        searchCompleted: this.#s03?.runtime.getState().completed ?? false,
        hintedObjectId: this.#s03?.hintedObjectId ?? null,
        chosenEmphasis: this.#s03ChosenEmphasis,
        k03Awarded: this.#k03Awarded,
      },
      notebook: [
        ...this.#s01Session.getState().notebook,
        ...(this.#s02?.notebook() ?? []),
        ...(this.#k02Awarded ? [{ id: 'K02', label: 'May 16/17 public timeline filed', classification: 'fiction', sourceRefs: [] } as const] : []),
        ...(this.#s03?.notebook() ?? []),
        ...(this.#k03Awarded ? [{ id: 'K03', label: 'First filed Haps piece, layout committed', classification: 'fiction', sourceRefs: [] } as const] : []),
      ],
      branch: this.#branch,
      episodeCompleted: this.#episodeCompleted,
      lastMessage: this.#lastMessage,
    });
  }

  getActions(): readonly EpisodeAction[] {
    return cloneFreeze(this.#actions);
  }

  exportSave(): EpisodeSaveV1 {
    return cloneFreeze({
      version: 1 as const,
      sceneRevisions: { s01: S01_SCENE_REVISION, s02: S02_SCENE_REVISION, s03: S03_SCENE_REVISION },
      actions: this.#actions,
    });
  }

  #fail(error: EpisodeDiagnostic | NewsroomDiagnostic | RuntimeDiagnostic): EpisodeStepResult {
    return freeze({ ok: false, state: this.getState(), errors: [cloneFreeze(error)], events: [] });
  }

  #accept(action: EpisodeAction, events: EpisodeEvent[]): EpisodeStepResult {
    this.#actions.push(cloneFreeze(action));
    return freeze({ ok: true, state: this.getState(), events: cloneFreeze(events) });
  }

  step(input: unknown): EpisodeStepResult {
    const parsed = parseAction(input);
    if (!parsed.ok) return this.#fail(parsed.errors[0]);
    if (this.#actions.length >= EPISODE_ACTION_LIMIT) return this.#fail(diagnostic('EPISODE_ACTION_LIMIT', '/actions', 'EPI-IMMUTABLE-001', `An episode accepts at most ${EPISODE_ACTION_LIMIT} actions.`));
    const action = parsed.action;

    if (action.type === 'import-s01-save') return this.#importS01Save(action);
    if (action.type === 'enter-scene') return this.#enterScene(action);
    if (action.type === 'reset') return this.#reset(action);

    if (this.#currentScene === 'S01') {
      if (!(S01_ACTION_TYPES as readonly string[]).includes(action.type)) return this.#fail(diagnostic('EPISODE_SCENE_LOCKED', '/type', 'EPI-SCENE-LOCKED-001', `"${action.type}" is not an S01 action.`));
      return this.#stepS01(action as S01SubAction);
    }
    if (this.#currentScene === 'S02') {
      if (!(S02_ACTION_TYPES as readonly string[]).includes(action.type)) return this.#fail(diagnostic('EPISODE_SCENE_LOCKED', '/type', 'EPI-SCENE-LOCKED-001', `"${action.type}" is not an S02 action.`));
      return this.#stepS02(action as S02Action);
    }
    if (!(S03_ACTION_TYPES as readonly string[]).includes(action.type)) return this.#fail(diagnostic('EPISODE_SCENE_LOCKED', '/type', 'EPI-SCENE-LOCKED-001', `"${action.type}" is not an S03 action.`));
    return this.#stepS03(action as S03Action);
  }

  #importS01Save(action: { type: 'import-s01-save'; save: unknown }): EpisodeStepResult {
    if (this.#actions.length > 0) return this.#fail(diagnostic('EPISODE_IMPORT_NOT_FIRST', '', 'EPI-S01-IMPORT-001', 'A public S01 save can only be imported as the first episode action.'));
    // Only dense data arrays may cross the import boundary. Array extras or
    // accessors are not JSON journal entries and must fail before state changes.
    if (dataRecord(action.save) && Array.isArray(action.save.actions)) {
      const actions = action.save.actions;
      const keys = Reflect.ownKeys(actions);
      if (keys.length !== actions.length + 1 || keys.some(key => {
        if (key === 'length') return false;
        if (typeof key !== 'string' || !/^(0|[1-9][0-9]*)$/.test(key) || Number(key) >= actions.length) return true;
        return !Object.hasOwn(Object.getOwnPropertyDescriptor(actions, key)!, 'value');
      })) return this.#fail(diagnostic('EPISODE_INVALID_SAVE', '/save/actions', 'EPI-S01-IMPORT-001', 'Imported actions must be a dense JSON data array without extra properties.'));
    }
    const restored = restoreNewsroomSession(action.save);
    if (!restored.ok) return this.#fail(restored.errors[0]);
    const canonicalAction: EpisodeAction = { type: 'import-s01-save', save: restored.session.exportSave() };
    this.#s01Session = restored.session;
    this.#lastMessage = 'Imported an existing S01 save.';
    return this.#accept(canonicalAction, [{ type: 's01-save-imported' }]);
  }

  #enterScene(action: { type: 'enter-scene'; scene: 'S02' | 'S03' }): EpisodeStepResult {
    if (action.scene === 'S02') {
      if (this.#currentScene !== 'S01') return this.#fail(diagnostic('EPISODE_SCENE_ORDER', '/scene', 'EPI-SCENE-ORDER-001', 'S02 is only reachable directly from S01.'));
      if (!this.#s01Session.getState().k01Awarded) return this.#fail(diagnostic('EPISODE_SCENE_ORDER', '/scene', 'EPI-SCENE-ORDER-001', 'Award K01 before entering S02.'));
      this.#currentScene = 'S02';
      this.#s02 = new SceneRuntime(canonicalS02Scene());
      this.#lastMessage = 'City Hall corridor. Unjam the public kit and order May 16 before May 17.';
      return this.#accept(action, [{ type: 'scene-entered', scene: 'S02' }]);
    }
    if (this.#currentScene !== 'S02') return this.#fail(diagnostic('EPISODE_SCENE_ORDER', '/scene', 'EPI-SCENE-ORDER-001', 'S03 is only reachable directly from S02.'));
    if (!this.#k02Awarded) return this.#fail(diagnostic('EPISODE_SCENE_ORDER', '/scene', 'EPI-SCENE-ORDER-001', 'Award K02 before entering S03.'));
    this.#currentScene = 'S03';
    this.#s03 = new SceneRuntime(canonicalS03Scene());
    this.#lastMessage = 'Deadline desk. Build the headline; keep the denial and the unverified video honest.';
    return this.#accept(action, [{ type: 'scene-entered', scene: 'S03' }]);
  }

  #stepS01(action: S01SubAction): EpisodeStepResult {
    const result = this.#s01Session.step(action);
    if (!result.ok) return this.#fail(result.errors[0]);
    this.#lastMessage = result.state.lastMessage;
    return this.#accept(action, [...result.events]);
  }

  #stepS02(action: S02Action): EpisodeStepResult {
    const s02 = this.#s02!;
    if (this.#k02Awarded) {
      if (action.type === 'select' || action.type === 'hint') return this.#applySceneRuntimeAction(s02, action);
      if (action.type === 'order-timeline') {
        if (action.first === 'S02.O6' && action.second === 'S02.O3') return this.#accept(action, []);
        return this.#fail(diagnostic('EPISODE_PROGRESSION_LOCKED', '/first', 'EPI-DUPLICATE-001', 'K02 is already awarded; the timeline order cannot be changed.'));
      }
      if (action.interpretation === 'order-of-reports') return this.#accept(action, []);
      return this.#fail(diagnostic('EPISODE_PROGRESSION_LOCKED', '/interpretation', 'EPI-DUPLICATE-001', 'K02 is already awarded; the filed interpretation cannot be changed.'));
    }

    if (action.type === 'select' || action.type === 'hint') return this.#applySceneRuntimeAction(s02, action);

    if (action.type === 'order-timeline') {
      this.#s02TimelineOrder = [action.first, action.second];
      this.#lastMessage = action.first === 'S02.O6' && action.second === 'S02.O3' ? 'May 16 before May 17.' : 'That order does not match the public record; try again.';
      return this.#accept(action, []);
    }

    if (!s02.runtime.getState().completed) return this.#fail(diagnostic('EPISODE_PREREQUISITE', '/interpretation', 'EPI-S02-GATE-001', 'Find all six City Hall objects before filing the timeline.'));
    const reasons: string[] = [];
    if (this.#s02TimelineOrder[0] !== 'S02.O6' || this.#s02TimelineOrder[1] !== 'S02.O3') reasons.push('Order the May 16 report before the May 17 denial on the timeline strip.');
    if (action.interpretation !== 'order-of-reports') reasons.push('These public materials show order of reports and response, not private proof.');
    if (reasons.length) {
      this.#lastMessage = reasons.join(' ');
      return this.#accept(action, [{ type: 'timeline-retry', reasons }]);
    }
    this.#k02Awarded = true;
    this.#lastMessage = 'K02 awarded. S03 is unlocked.';
    return this.#accept(action, [{ type: 'k02-awarded' }]);
  }

  #stepS03(action: S03Action): EpisodeStepResult {
    const s03 = this.#s03!;
    if (this.#k03Awarded) {
      if (action.type === 'select' || action.type === 'hint') return this.#applySceneRuntimeAction(s03, action);
      if (action.type === 'choose-emphasis') {
        if (action.branch === this.#branch) return this.#accept(action, []);
        return this.#fail(diagnostic('EPISODE_PROGRESSION_LOCKED', '/branch', 'EPI-DUPLICATE-001', 'K03 is already awarded; the committed emphasis cannot change.'));
      }
      if (action.support === 'attributed-and-denied') return this.#accept(action, []);
      return this.#fail(diagnostic('EPISODE_PROGRESSION_LOCKED', '/support', 'EPI-DUPLICATE-001', 'K03 is already awarded; the accepted account cannot change.'));
    }

    if (action.type === 'select' || action.type === 'hint') return this.#applySceneRuntimeAction(s03, action);

    if (action.type === 'choose-emphasis') {
      this.#s03ChosenEmphasis = action.branch;
      this.#lastMessage = action.branch === 'splash-first' ? 'Splash First emphasis chosen.' : 'Lawyer Voice emphasis chosen.';
      return this.#accept(action, []);
    }

    if (!s03.runtime.getState().completed) return this.#fail(diagnostic('EPISODE_PREREQUISITE', '/support', 'EPI-S03-GATE-001', 'Find all six deadline-desk objects before filing the lede.'));
    const reasons: string[] = [];
    if (this.#s03ChosenEmphasis === null) reasons.push('Choose Splash First or Lawyer Voice before filing.');
    if (action.support !== 'attributed-and-denied') reasons.push('We do not have the video. Keep the lede attributed and on-record denied.');
    if (reasons.length) {
      this.#lastMessage = reasons.join(' ');
      return this.#accept(action, [{ type: 'account-retry', reasons }]);
    }
    this.#k03Awarded = true;
    this.#branch = this.#s03ChosenEmphasis;
    this.#episodeCompleted = true;
    this.#lastMessage = 'K03 filed. Episode complete.';
    return this.#accept(action, [{ type: 'k03-awarded' }, { type: 'episode-completed' }]);
  }

  #applySceneRuntimeAction(scene: SceneRuntime, action: { type: 'select'; objectId: string } | { type: 'hint' }): EpisodeStepResult {
    const result = scene.runtime.step(action);
    if (!result.ok) return this.#fail(result.errors[0]);
    if (action.type === 'select') {
      const content = scene.contentForObject(action.objectId);
      if (content && !scene.recordedContentIds.includes(content.id)) scene.recordedContentIds.push(content.id);
      this.#lastMessage = result.events.some(event => event.type === 'duplicate') ? 'Already recorded; no extra find or reward.' : `Recorded ${content?.label ?? action.objectId}.`;
      scene.hintedObjectId = null;
    } else {
      scene.hintedObjectId = result.events.find(event => event.type === 'hint')?.objectId ?? null;
      this.#lastMessage = scene.hintedObjectId ? `Hint points to ${scene.hintedObjectId}.` : 'No hint target remains.';
    }
    return this.#accept(action, [...result.events]);
  }

  #reset(action: { type: 'reset'; scope: 'scene' | 'episode' }): EpisodeStepResult {
    if (action.scope === 'episode') {
      this.#s01Session = createNewsroomSession();
      this.#s02 = undefined;
      this.#s03 = undefined;
      this.#currentScene = 'S01';
      this.#s02TimelineOrder = [];
      this.#k02Awarded = false;
      this.#s03ChosenEmphasis = null;
      this.#k03Awarded = false;
      this.#branch = null;
      this.#episodeCompleted = false;
      this.#lastMessage = 'New episode started.';
      return this.#accept(action, [{ type: 'episode-reset' }]);
    }

    if (this.#currentScene === 'S01') {
      const result = this.#s01Session.step({ type: 'reset', scope: 'scene' });
      if (!result.ok) return this.#fail(result.errors[0]);
      this.#lastMessage = 'S01 working checks reset.';
      return this.#accept(action, [{ type: 'scene-reset', scene: 'S01' }]);
    }
    if (this.#currentScene === 'S02') {
      if (this.#k02Awarded) return this.#fail(diagnostic('EPISODE_SCENE_RESET_LOCKED', '/scope', 'EPI-RESET-001', 'S02 is complete; use a confirmed episode reset to start over.'));
      const result = this.#s02!.runtime.step({ type: 'reset' });
      if (!result.ok) return this.#fail(result.errors[0]);
      this.#s02TimelineOrder = [];
      this.#s02!.hintedObjectId = null;
      this.#lastMessage = 'S02 search and timeline attempt reset; recorded notebook entries remain.';
      return this.#accept(action, [{ type: 'scene-reset', scene: 'S02' }]);
    }
    if (this.#k03Awarded) return this.#fail(diagnostic('EPISODE_SCENE_RESET_LOCKED', '/scope', 'EPI-RESET-001', 'S03 is complete; use a confirmed episode reset to start over.'));
    const result = this.#s03!.runtime.step({ type: 'reset' });
    if (!result.ok) return this.#fail(result.errors[0]);
    this.#s03ChosenEmphasis = null;
    this.#s03!.hintedObjectId = null;
    this.#lastMessage = 'S03 search and emphasis choice reset; recorded notebook entries remain.';
    return this.#accept(action, [{ type: 'scene-reset', scene: 'S03' }]);
  }
}

export function createEpisodeSession(): EpisodeSession {
  return Object.freeze(new FordEpisodeSession());
}

export function restoreEpisodeSession(input: unknown): EpisodeRestoreResult {
  if (!dataRecord(input)) return freeze({ ok: false, errors: [diagnostic('EPISODE_INVALID_SAVE', '', 'EPI-SAVE-001', 'Save must be a plain versioned object.')] });
  const extra = Object.keys(input).find(key => !['version', 'sceneRevisions', 'actions'].includes(key));
  if (extra) return freeze({ ok: false, errors: [diagnostic('EPISODE_INVALID_SAVE', `/${extra}`, 'EPI-SAVE-001', 'Unknown save property.')] });
  if (input.version !== EPISODE_SAVE_VERSION) return freeze({ ok: false, errors: [diagnostic('EPISODE_UNSUPPORTED_SAVE', '/version', 'EPI-SAVE-001', `Unsupported save version; expected ${EPISODE_SAVE_VERSION}.`)] });
  if (!dataRecord(input.sceneRevisions)) return freeze({ ok: false, errors: [diagnostic('EPISODE_INVALID_SAVE', '/sceneRevisions', 'EPI-SAVE-001', 'Save sceneRevisions must be a plain object.')] });
  const revisionKeys = Object.keys(input.sceneRevisions);
  const revisionExtra = revisionKeys.find(key => !['s01', 's02', 's03'].includes(key));
  if (revisionExtra || revisionKeys.length !== 3) return freeze({ ok: false, errors: [diagnostic('EPISODE_INVALID_SAVE', '/sceneRevisions', 'EPI-SAVE-001', 'Save sceneRevisions must declare exactly s01, s02 and s03.')] });
  const revisions = input.sceneRevisions as Record<string, unknown>;
  if (revisions.s01 !== S01_SCENE_REVISION) return freeze({ ok: false, errors: [diagnostic('EPISODE_UNSUPPORTED_SAVE', '/sceneRevisions/s01', 'EPI-SAVE-001', 'Save S01 scene revision does not match bundled content.')] });
  if (revisions.s02 !== S02_SCENE_REVISION) return freeze({ ok: false, errors: [diagnostic('EPISODE_UNSUPPORTED_SAVE', '/sceneRevisions/s02', 'EPI-SAVE-001', 'Save S02 scene revision does not match bundled content.')] });
  if (revisions.s03 !== S03_SCENE_REVISION) return freeze({ ok: false, errors: [diagnostic('EPISODE_UNSUPPORTED_SAVE', '/sceneRevisions/s03', 'EPI-SAVE-001', 'Save S03 scene revision does not match bundled content.')] });
  if (!Array.isArray(input.actions)) return freeze({ ok: false, errors: [diagnostic('EPISODE_INVALID_SAVE', '/actions', 'EPI-SAVE-001', 'Save actions must be an array.')] });
  if (input.actions.length > EPISODE_ACTION_LIMIT) return freeze({ ok: false, errors: [diagnostic('EPISODE_ACTION_LIMIT', '/actions', 'EPI-SAVE-001', `Save exceeds the ${EPISODE_ACTION_LIMIT}-action limit.`)] });
  const session = createEpisodeSession();
  for (let i = 0; i < input.actions.length; i++) {
    const result = session.step(input.actions[i]);
    if (!result.ok) return freeze({ ok: false, errors: [diagnostic('EPISODE_INVALID_SAVE', `/actions/${i}`, 'EPI-SAVE-001', `Action ${i} cannot be replayed: ${result.errors[0].message}`)] });
  }
  return freeze({ ok: true, session });
}
