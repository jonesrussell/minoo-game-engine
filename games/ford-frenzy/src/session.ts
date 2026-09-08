import { createRuntime, type Runtime, type RuntimeDiagnostic, type RuntimeEvent } from '@minoo/engine/runtime';
import { validateSceneV2, type InvestigativeContent, type SceneV2 } from '@minoo/engine/scene-v2';
import sceneData from '../data/s01.json' with { type: 'json' };

export const NEWSROOM_SAVE_VERSION = 1;
export const S01_SCENE_REVISION = 'ford-frenzy-s01-v2-embedded-clipping-2026-09-07';
export const NEWSROOM_ACTION_LIMIT = 1000;

export type NewsroomAction =
  | { type: 'select'; objectId: string }
  | { type: 'hint' }
  | { type: 'check-source'; contentId: string; reading: 'reported-account' | 'proven-claim' }
  | { type: 'pair-recorder'; connector: 'recorder' | 'phone' }
  | { type: 'submit-draft'; basis: 'published-report' | 'office-rumour' }
  | { type: 'reset'; scope: 'scene' | 'session' };

export interface NotebookEntry {
  readonly id: string;
  readonly label: string;
  readonly classification: 'fact' | 'allegation' | 'fiction';
  readonly sourceRefs: readonly string[];
  readonly checked?: boolean;
}

export interface NewsroomState {
  readonly foundIds: readonly string[];
  readonly hintsUsed: number;
  readonly hintBudget: number;
  readonly searchCompleted: boolean;
  readonly sourceChecks: readonly string[];
  readonly chargerPaired: null | 'recorder' | 'phone';
  readonly editorialAccepted: boolean;
  readonly k01Awarded: boolean;
  readonly transitionS02: 'locked' | 'unlocked';
  readonly notebook: readonly NotebookEntry[];
  readonly lastMessage: string;
  readonly hintedObjectId: string | null;
}

export interface NewsroomDiagnostic {
  readonly code:
    | 'NEWSROOM_INVALID_ACTION'
    | 'NEWSROOM_PREREQUISITE'
    | 'NEWSROOM_PROGRESSION_LOCKED'
    | 'NEWSROOM_SCENE_RESET_LOCKED'
    | 'NEWSROOM_INVALID_SAVE'
    | 'NEWSROOM_UNSUPPORTED_SAVE'
    | 'NEWSROOM_ACTION_LIMIT';
  readonly pointer: string;
  readonly requirement: string;
  readonly message: string;
}

export type NewsroomEvent = RuntimeEvent
  | { readonly type: 'source-checked'; readonly contentId: string }
  | { readonly type: 'recorder-paired'; readonly connector: 'recorder' | 'phone' }
  | { readonly type: 'editorial-retry'; readonly reasons: readonly string[] }
  | { readonly type: 'k01-awarded' }
  | { readonly type: 'scene-reset' }
  | { readonly type: 'session-reset' };

export type NewsroomStepResult =
  | { readonly ok: true; readonly state: NewsroomState; readonly events: readonly NewsroomEvent[] }
  | { readonly ok: false; readonly state: NewsroomState; readonly errors: readonly (NewsroomDiagnostic | RuntimeDiagnostic)[]; readonly events: readonly [] };

export interface NewsroomSaveV1 {
  readonly version: 1;
  readonly sceneRevision: typeof S01_SCENE_REVISION;
  readonly actions: readonly NewsroomAction[];
}

export interface NewsroomSession {
  getState(): NewsroomState;
  getActions(): readonly NewsroomAction[];
  step(action: unknown): NewsroomStepResult;
  exportSave(): NewsroomSaveV1;
}

export type NewsroomRestoreResult =
  | { readonly ok: true; readonly session: NewsroomSession }
  | { readonly ok: false; readonly errors: readonly NewsroomDiagnostic[] };

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

function diagnostic(code: NewsroomDiagnostic['code'], pointer: string, requirement: string, message: string): NewsroomDiagnostic {
  return { code, pointer, requirement, message };
}

function parseAction(input: unknown): { ok: true; action: NewsroomAction } | { ok: false; errors: NewsroomDiagnostic[] } {
  if (!dataRecord(input) || typeof input.type !== 'string') return { ok: false, errors: [diagnostic('NEWSROOM_INVALID_ACTION', '', 'LOOP-ACTION-001', 'Action must be a plain object with a supported type.')] };
  const shapes: Record<string, readonly string[]> = {
    select: ['type', 'objectId'], hint: ['type'], 'check-source': ['type', 'contentId', 'reading'],
    'pair-recorder': ['type', 'connector'], 'submit-draft': ['type', 'basis'], reset: ['type', 'scope'],
  };
  const allowed = shapes[input.type];
  if (!allowed) return { ok: false, errors: [diagnostic('NEWSROOM_INVALID_ACTION', '/type', 'LOOP-ACTION-001', `Unsupported action type "${input.type}".`)] };
  const extra = Object.keys(input).find(key => !allowed.includes(key));
  if (extra) return { ok: false, errors: [diagnostic('NEWSROOM_INVALID_ACTION', `/${extra.replaceAll('~', '~0').replaceAll('/', '~1')}`, 'LOOP-ACTION-001', 'Unknown action property.')] };
  if (Object.keys(input).length !== allowed.length) {
    const missing = allowed.find(key => !Object.hasOwn(input, key)) ?? '';
    return { ok: false, errors: [diagnostic('NEWSROOM_INVALID_ACTION', `/${missing}`, 'LOOP-ACTION-001', `Action requires ${missing}.`)] };
  }
  if (input.type === 'select' && typeof input.objectId === 'string') return { ok: true, action: { type: 'select', objectId: input.objectId } };
  if (input.type === 'hint') return { ok: true, action: { type: 'hint' } };
  if (input.type === 'check-source' && typeof input.contentId === 'string' && (input.reading === 'reported-account' || input.reading === 'proven-claim')) return { ok: true, action: { type: 'check-source', contentId: input.contentId, reading: input.reading } };
  if (input.type === 'pair-recorder' && (input.connector === 'recorder' || input.connector === 'phone')) return { ok: true, action: { type: 'pair-recorder', connector: input.connector } };
  if (input.type === 'submit-draft' && (input.basis === 'published-report' || input.basis === 'office-rumour')) return { ok: true, action: { type: 'submit-draft', basis: input.basis } };
  if (input.type === 'reset' && (input.scope === 'scene' || input.scope === 'session')) return { ok: true, action: { type: 'reset', scope: input.scope } };
  const field = allowed[1] ?? 'type';
  return { ok: false, errors: [diagnostic('NEWSROOM_INVALID_ACTION', `/${field}`, 'LOOP-ACTION-001', `Invalid ${input.type} action payload.`)] };
}

function canonicalScene(): SceneV2 {
  const result = validateSceneV2(sceneData);
  if (!result.ok) throw new Error(`Bundled S01 scene is invalid: ${result.errors.map(error => `${error.pointer} ${error.message}`).join('; ')}`);
  return result.scene;
}

class S01Session implements NewsroomSession {
  readonly #scene: SceneV2;
  #runtime: Runtime;
  #sourceChecks: string[] = [];
  #chargerPaired: null | 'recorder' | 'phone' = null;
  #editorialAccepted = false;
  #k01Awarded = false;
  #transitionS02: 'locked' | 'unlocked' = 'locked';
  #recordedContentIds: string[] = [];
  #actions: NewsroomAction[] = [];
  #lastMessage = 'Find six newsroom objects, read the clipping, get the recorder working and file your draft.';
  #hintedObjectId: string | null = null;

  constructor(scene: SceneV2) {
    this.#scene = cloneFreeze(scene);
    this.#runtime = this.#newRuntime();
  }

  #newRuntime(): Runtime {
    const created = createRuntime(this.#scene, { hintBudget: 3 });
    if (!created.ok) throw new Error('Bundled S01 scene could not create a runtime.');
    return created.runtime;
  }

  #contentForObject(objectId: string): InvestigativeContent | undefined {
    const contentId = this.#scene.objects.find(object => object.id === objectId)?.contentId;
    return this.#scene.contents.find(content => content.id === contentId);
  }

  #notebook(): NotebookEntry[] {
    const entries = this.#recordedContentIds.map(id => {
      const content = this.#scene.contents.find(candidate => candidate.id === id)!;
      return {
        id: content.id, label: content.label, classification: content.classification,
        sourceRefs: [...content.sourceRefs], ...(content.id === 'S01.C5' ? { checked: this.#sourceChecks.includes(content.id) } : {}),
      };
    });
    if (this.#k01Awarded) entries.push({ id: 'K01', label: 'Gear and report triage complete', classification: 'fiction', sourceRefs: [], checked: true });
    return entries;
  }

  getState(): NewsroomState {
    const engine = this.#runtime.getState();
    return cloneFreeze({
      foundIds: [...engine.foundIds], hintsUsed: engine.hintsUsed, hintBudget: engine.hintBudget,
      searchCompleted: engine.completed, sourceChecks: [...this.#sourceChecks], chargerPaired: this.#chargerPaired,
      editorialAccepted: this.#editorialAccepted, k01Awarded: this.#k01Awarded, transitionS02: this.#transitionS02,
      notebook: this.#notebook(), lastMessage: this.#lastMessage, hintedObjectId: this.#hintedObjectId,
    });
  }

  getActions(): readonly NewsroomAction[] {
    return cloneFreeze(this.#actions);
  }

  exportSave(): NewsroomSaveV1 {
    return cloneFreeze({ version: 1 as const, sceneRevision: S01_SCENE_REVISION, actions: this.#actions });
  }

  #fail(error: NewsroomDiagnostic | RuntimeDiagnostic): NewsroomStepResult {
    return freeze({ ok: false, state: this.getState(), errors: [cloneFreeze(error)], events: [] });
  }

  #accept(action: NewsroomAction, events: NewsroomEvent[]): NewsroomStepResult {
    this.#actions.push(cloneFreeze(action));
    return freeze({ ok: true, state: this.getState(), events: cloneFreeze(events) });
  }

  step(input: unknown): NewsroomStepResult {
    const parsed = parseAction(input);
    if (!parsed.ok) return this.#fail(parsed.errors[0]);
    if (this.#actions.length >= NEWSROOM_ACTION_LIMIT) return this.#fail(diagnostic('NEWSROOM_ACTION_LIMIT', '/actions', 'LOOP-SAVE-001', `A session accepts at most ${NEWSROOM_ACTION_LIMIT} actions.`));
    const action = parsed.action;

    if (this.#k01Awarded) {
      if (action.type === 'pair-recorder') {
        if (action.connector === 'recorder') return this.#accept(action, []);
        return this.#fail(diagnostic('NEWSROOM_PROGRESSION_LOCKED', '/connector', 'LOOP-NOTEBOOK-001', 'K01 is already awarded; the completed recorder choice cannot be changed.'));
      }
      if (action.type === 'submit-draft') {
        if (action.basis === 'published-report') return this.#accept(action, []);
        return this.#fail(diagnostic('NEWSROOM_PROGRESSION_LOCKED', '/basis', 'LOOP-NOTEBOOK-001', 'K01 is already awarded; the accepted draft basis cannot be replaced with office rumour.'));
      }
      if (action.type === 'check-source') {
        if (this.#sourceChecks.includes(action.contentId) && action.reading === 'reported-account') return this.#accept(action, []);
        return this.#fail(diagnostic('NEWSROOM_PROGRESSION_LOCKED', '/contentId', 'LOOP-NOTEBOOK-001', 'K01 is already awarded; source-check progression is closed for S01.'));
      }
    }

    if (action.type === 'select' || action.type === 'hint') {
      const result = this.#runtime.step(action);
      if (!result.ok) return this.#fail(result.errors[0]);
      if (action.type === 'select') {
        const content = this.#contentForObject(action.objectId);
        if (content && !this.#recordedContentIds.includes(content.id)) this.#recordedContentIds.push(content.id);
        this.#lastMessage = result.events.some(event => event.type === 'duplicate') ? 'Already recorded; no extra find or reward.' : `Recorded ${content?.label ?? action.objectId}.`;
        this.#hintedObjectId = null;
      } else {
        this.#hintedObjectId = result.events.find(event => event.type === 'hint')?.objectId ?? null;
        this.#lastMessage = this.#hintedObjectId ? `Hint points to ${this.#hintedObjectId}.` : 'No hint target remains.';
      }
      return this.#accept(action, [...result.events]);
    }

    if (action.type === 'check-source') {
      const object = this.#scene.objects.find(candidate => candidate.contentId === action.contentId);
      if (!object || !this.#runtime.getState().foundIds.includes(object.id)) return this.#fail(diagnostic('NEWSROOM_PREREQUISITE', '/contentId', 'LOOP-SOURCE-001', `Find the object linked to "${action.contentId}" before checking its source.`));
      if (action.contentId !== 'S01.C5') return this.#fail(diagnostic('NEWSROOM_INVALID_ACTION', '/contentId', 'LOOP-SOURCE-001', 'Only the newsroom clipping has a reading choice.'));
      if (action.reading === 'proven-claim') {
        this.#lastMessage = 'Easy, headline cowboy. The Howler reports what its reporters say they saw. We still have a lead to follow, not proof.';
        return this.#accept(action, []);
      }
      if (!this.#sourceChecks.includes(action.contentId)) this.#sourceChecks.push(action.contentId);
      this.#lastMessage = 'Clipping checked. The Howler gives us a lead to follow.';
      return this.#accept(action, [{ type: 'source-checked', contentId: action.contentId }]);
    }

    if (action.type === 'pair-recorder') {
      if (!this.#runtime.getState().foundIds.includes('S01.O6')) return this.#fail(diagnostic('NEWSROOM_PREREQUISITE', '/connector', 'LOOP-S01-GATE-001', 'Find the digital recorder before choosing its connector.'));
      this.#chargerPaired = action.connector;
      this.#editorialAccepted = false;
      this.#lastMessage = action.connector === 'recorder' ? 'Recorder connector matched.' : 'That connector belongs to the phone; try the recorder connector.';
      return this.#accept(action, [{ type: 'recorder-paired', connector: action.connector }]);
    }

    if (action.type === 'submit-draft') {
      if (!this.#runtime.getState().completed) return this.#fail(diagnostic('NEWSROOM_PREREQUISITE', '/basis', 'LOOP-S01-GATE-001', 'Find all six scene objects before submitting the draft.'));
      const reasons: string[] = [];
      if (this.#chargerPaired !== 'recorder') reasons.push(this.#chargerPaired === 'phone' ? 'The phone connector does not fit the recorder.' : 'Match the recorder connector first.');
      if (action.basis !== 'published-report') reasons.push('Office rumour cannot be filed as a published-report basis.');
      if (!this.#sourceChecks.includes('S01.C5')) reasons.push('Read the Howler clipping and decide what it actually tells us.');
      if (reasons.length) {
        this.#editorialAccepted = false;
        this.#lastMessage = reasons.join(' ');
        return this.#accept(action, [{ type: 'editorial-retry', reasons }]);
      }
      this.#editorialAccepted = true;
      this.#transitionS02 = 'unlocked';
      this.#lastMessage = 'K01 awarded. S02 is unlocked; its session is not implemented here.';
      const events: NewsroomEvent[] = [];
      if (!this.#k01Awarded) {
        this.#k01Awarded = true;
        events.push({ type: 'k01-awarded' });
      }
      return this.#accept(action, events);
    }

    if (action.scope === 'scene') {
      if (this.#k01Awarded) return this.#fail(diagnostic('NEWSROOM_SCENE_RESET_LOCKED', '/scope', 'LOOP-RESET-001', 'S01 is complete; use a confirmed session reset to start a new game.'));
      const result = this.#runtime.step({ type: 'reset' });
      if (!result.ok) return this.#fail(result.errors[0]);
      this.#sourceChecks = [];
      this.#chargerPaired = null;
      this.#editorialAccepted = false;
      this.#hintedObjectId = null;
      this.#lastMessage = 'S01 search and working checks reset; recorded notebook entries remain.';
      return this.#accept(action, [{ type: 'scene-reset' }]);
    }

    this.#runtime = this.#newRuntime();
    this.#sourceChecks = [];
    this.#chargerPaired = null;
    this.#editorialAccepted = false;
    this.#k01Awarded = false;
    this.#transitionS02 = 'locked';
    this.#recordedContentIds = [];
    this.#hintedObjectId = null;
    this.#lastMessage = 'New session started.';
    return this.#accept(action, [{ type: 'session-reset' }]);
  }
}

export function createNewsroomSession(): NewsroomSession {
  return Object.freeze(new S01Session(canonicalScene()));
}

export function restoreNewsroomSession(input: unknown): NewsroomRestoreResult {
  if (!dataRecord(input)) return freeze({ ok: false, errors: [diagnostic('NEWSROOM_INVALID_SAVE', '', 'LOOP-SAVE-001', 'Save must be a plain versioned object.')] });
  const extra = Object.keys(input).find(key => !['version', 'sceneRevision', 'actions'].includes(key));
  if (extra) return freeze({ ok: false, errors: [diagnostic('NEWSROOM_INVALID_SAVE', `/${extra}`, 'LOOP-SAVE-001', 'Unknown save property.')] });
  if (input.version !== NEWSROOM_SAVE_VERSION) return freeze({ ok: false, errors: [diagnostic('NEWSROOM_UNSUPPORTED_SAVE', '/version', 'LOOP-SAVE-001', `Unsupported save version; expected ${NEWSROOM_SAVE_VERSION}.`)] });
  if (input.sceneRevision !== S01_SCENE_REVISION) return freeze({ ok: false, errors: [diagnostic('NEWSROOM_UNSUPPORTED_SAVE', '/sceneRevision', 'LOOP-SAVE-001', 'Save scene revision does not match bundled S01 content.')] });
  if (!Array.isArray(input.actions)) return freeze({ ok: false, errors: [diagnostic('NEWSROOM_INVALID_SAVE', '/actions', 'LOOP-SAVE-001', 'Save actions must be an array.')] });
  if (input.actions.length > NEWSROOM_ACTION_LIMIT) return freeze({ ok: false, errors: [diagnostic('NEWSROOM_ACTION_LIMIT', '/actions', 'LOOP-SAVE-001', `Save exceeds the ${NEWSROOM_ACTION_LIMIT}-action limit.`)] });
  const session = createNewsroomSession();
  for (let i = 0; i < input.actions.length; i++) {
    const result = session.step(input.actions[i]);
    if (!result.ok) return freeze({ ok: false, errors: [diagnostic('NEWSROOM_INVALID_SAVE', `/actions/${i}`, 'LOOP-REPLAY-001', `Action ${i} cannot be replayed: ${result.errors[0].message}`)] });
  }
  return freeze({ ok: true, session });
}
