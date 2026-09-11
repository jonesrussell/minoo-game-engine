import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateSceneV2 } from '@minoo/engine/scene-v2';
import { createNewsroomSession, type NewsroomAction } from '../../games/ford-frenzy/src/session.ts';
import {
  EPISODE_ACTION_LIMIT,
  EPISODE_SAVE_VERSION,
  S02_SCENE_REVISION,
  S03_SCENE_REVISION,
  createEpisodeSession,
  restoreEpisodeSession,
  type EpisodeAction,
  type EpisodeSession,
} from '../../games/ford-frenzy/src/episode.ts';

const PRIOR_S02_SCENE_REVISION = 'ford-frenzy-s02-v2-city-hall-2026-09-11';
const PRIOR_S03_SCENE_REVISION = 'ford-frenzy-s03-v2-deadline-desk-2026-09-11';

const s01Finds: EpisodeAction[] = Array.from({ length: 6 }, (_, index) => ({ type: 'select', objectId: `S01.O${index + 1}` }));
const s02Finds: EpisodeAction[] = Array.from({ length: 6 }, (_, index) => ({ type: 'select', objectId: `S02.O${index + 1}` }));
const s03Finds: EpisodeAction[] = Array.from({ length: 6 }, (_, index) => ({ type: 'select', objectId: `S03.O${index + 1}` }));

function apply(session: EpisodeSession, actions: readonly EpisodeAction[]) {
  for (const action of actions) {
    const result = session.step(action);
    assert.equal(result.ok, true, JSON.stringify({ action, result }));
  }
}

const completeS01: EpisodeAction[] = [
  ...s01Finds,
  { type: 'pair-recorder', connector: 'recorder' },
  { type: 'check-source', contentId: 'S01.C5', reading: 'reported-account' },
  { type: 'submit-draft', basis: 'published-report' },
];

const enterS02: EpisodeAction = { type: 'enter-scene', scene: 'S02' };

const stackKitCorrect: EpisodeAction = { type: 'stack-kit', first: 'S02.O1', second: 'S02.O2' };

const completeS02: EpisodeAction[] = [
  { type: 'enter-scene', scene: 'S02' },
  ...s02Finds,
  stackKitCorrect,
  { type: 'order-timeline', first: 'S02.O6', second: 'S02.O3' },
  { type: 'submit-timeline', interpretation: 'order-of-reports' },
];

const enterS03: EpisodeAction = { type: 'enter-scene', scene: 'S03' };

const assembleLayoutCorrect: EpisodeAction = { type: 'assemble-layout', pairing: 'report-and-denial' };
const stampUncertaintyCorrect: EpisodeAction = { type: 'stamp-uncertainty', target: 'video-claim' };
const resolvePunCorrect: EpisodeAction = { type: 'resolve-pun', decision: 'discard' };

const completeS03: EpisodeAction[] = [
  { type: 'enter-scene', scene: 'S03' },
  ...s03Finds,
  assembleLayoutCorrect,
  stampUncertaintyCorrect,
  resolvePunCorrect,
  { type: 'choose-emphasis', branch: 'splash-first' },
  { type: 'submit-account', support: 'attributed-and-denied' },
];

function completeEpisode(session: EpisodeSession) {
  apply(session, [...completeS01, ...completeS02, ...completeS03]);
}

test('bundled S02/S03 v2 data uses canonical IDs and fictional content only', async () => {
  for (const [file, id] of [['s02.json', 'S02'], ['s03.json', 'S03']] as const) {
    const scene = JSON.parse(await readFile(`games/ford-frenzy/data/${file}`, 'utf8'));
    const result = validateSceneV2(scene);
    assert.equal(result.ok, true, JSON.stringify(!result.ok && result.errors));
    assert.equal(scene.id, id);
    assert.deepEqual(scene.completion.requiredIds, Array.from({ length: 6 }, (_, index) => `${id}.O${index + 1}`));
    assert.ok(scene.contents.every((content: { classification: string }) => content.classification === 'fiction'));
    assert.ok(scene.contents.every((content: { rights: { status: string } }) => content.rights.status === 'unresolved'));
    assert.deepEqual(scene.sources, []);
    assert.doesNotMatch(JSON.stringify(scene), /Toronto Star|thestar\.com|Doolittle|Donovan/);
  }
});

test('S02 and S03 are unreachable before the prior scene’s single award', () => {
  const session = createEpisodeSession();
  const early = session.step(enterS02);
  assert.equal(early.ok, false);
  if (!early.ok) assert.equal(early.errors[0].code, 'EPISODE_SCENE_ORDER');
  assert.equal(session.getState().currentScene, 'S01');

  apply(session, completeS01);
  const skipToS03 = session.step(enterS03);
  assert.equal(skipToS03.ok, false);
  if (!skipToS03.ok) assert.equal(skipToS03.errors[0].code, 'EPISODE_SCENE_ORDER');

  apply(session, [enterS02]);
  const reenter = session.step(enterS02);
  assert.equal(reenter.ok, false);
  if (!reenter.ok) assert.equal(reenter.errors[0].code, 'EPISODE_SCENE_ORDER');

  const early03 = session.step(enterS03);
  assert.equal(early03.ok, false);
  if (!early03.ok) assert.equal(early03.errors[0].code, 'EPISODE_SCENE_ORDER');
});

test('actions are locked to their owning scene', () => {
  const session = createEpisodeSession();
  const wrongScene = session.step({ type: 'order-timeline', first: 'S02.O6', second: 'S02.O3' });
  assert.equal(wrongScene.ok, false);
  if (!wrongScene.ok) assert.equal(wrongScene.errors[0].code, 'EPISODE_SCENE_LOCKED');

  apply(session, [...completeS01, enterS02]);
  const s01ActionInS02 = session.step({ type: 'check-source', contentId: 'S01.C5', reading: 'reported-account' });
  assert.equal(s01ActionInS02.ok, false);
  if (!s01ActionInS02.ok) assert.equal(s01ActionInS02.errors[0].code, 'EPISODE_SCENE_LOCKED');
  const s03ActionInS02 = session.step({ type: 'choose-emphasis', branch: 'splash-first' });
  assert.equal(s03ActionInS02.ok, false);
  if (!s03ActionInS02.ok) assert.equal(s03ActionInS02.errors[0].code, 'EPISODE_SCENE_LOCKED');
  const s03LayoutInS02 = session.step({ type: 'assemble-layout', pairing: 'report-and-denial' });
  assert.equal(s03LayoutInS02.ok, false);
  if (!s03LayoutInS02.ok) assert.equal(s03LayoutInS02.errors[0].code, 'EPISODE_SCENE_LOCKED');
});

test('the full supported path awards K01, K02, K03 once each and completes the episode', () => {
  const session = createEpisodeSession();
  completeEpisode(session);
  const state = session.getState();
  assert.equal(state.s01.k01Awarded, true);
  assert.equal(state.s02.k02Awarded, true);
  assert.equal(state.s03.k03Awarded, true);
  assert.equal(state.episodeCompleted, true);
  assert.equal(state.branch, 'splash-first');
  assert.equal(state.currentScene, 'S03');
  assert.equal(state.notebook.filter(entry => entry.id === 'K01').length, 1);
  assert.equal(state.notebook.filter(entry => entry.id === 'K02').length, 1);
  assert.equal(state.notebook.filter(entry => entry.id === 'K03').length, 1);
  assert.ok(state.notebook.findIndex(entry => entry.id === 'K01') < state.notebook.findIndex(entry => entry.id === 'K02'));
  assert.ok(state.notebook.findIndex(entry => entry.id === 'K02') < state.notebook.findIndex(entry => entry.id === 'K03'));
});

test('S02 requires the press-kit stacked in order, found before it can be stacked', () => {
  const session = createEpisodeSession();
  apply(session, [...completeS01, enterS02]);

  const tooEarly = session.step(stackKitCorrect);
  assert.equal(tooEarly.ok, false);
  if (!tooEarly.ok) assert.equal(tooEarly.errors[0].code, 'EPISODE_PREREQUISITE');

  apply(session, s02Finds);
  const wrongStack = session.step({ type: 'stack-kit', first: 'S02.O2', second: 'S02.O1' });
  assert.equal(wrongStack.ok, true);
  const submitWithBadStack = session.step({ type: 'submit-timeline', interpretation: 'order-of-reports' });
  assert.equal(submitWithBadStack.ok, true);
  assert.equal(session.getState().s02.k02Awarded, false);
  assert.deepEqual(session.getState().s02.foundIds, s02Finds.map(action => 'objectId' in action ? action.objectId : ''));

  const rightStack = session.step(stackKitCorrect);
  assert.equal(rightStack.ok, true);
  const orderTimeline = session.step({ type: 'order-timeline', first: 'S02.O6', second: 'S02.O3' });
  assert.equal(orderTimeline.ok, true);
  const correct = session.step({ type: 'submit-timeline', interpretation: 'order-of-reports' });
  assert.equal(correct.ok, true);
  assert.equal(session.getState().s02.k02Awarded, true);
});

test('S02 wrong timeline order or interpretation preserves finds and allows retry', () => {
  const session = createEpisodeSession();
  apply(session, [...completeS01, enterS02, ...s02Finds]);

  const wrongOrder = session.step({ type: 'order-timeline', first: 'S02.O3', second: 'S02.O6' });
  assert.equal(wrongOrder.ok, true);
  const wrongOrderSubmit = session.step({ type: 'submit-timeline', interpretation: 'order-of-reports' });
  assert.equal(wrongOrderSubmit.ok, true);
  assert.equal(session.getState().s02.k02Awarded, false);
  assert.deepEqual(session.getState().s02.foundIds, s02Finds.map(action => 'objectId' in action ? action.objectId : ''));

  const rightOrder = session.step({ type: 'order-timeline', first: 'S02.O6', second: 'S02.O3' });
  assert.equal(rightOrder.ok, true);
  const wrongInterpretation = session.step({ type: 'submit-timeline', interpretation: 'proof-of-allegation' });
  assert.equal(wrongInterpretation.ok, true);
  assert.equal(session.getState().s02.k02Awarded, false);
  assert.deepEqual(session.getState().s02.foundIds, s02Finds.map(action => 'objectId' in action ? action.objectId : ''));

  // Correct timeline and interpretation still do not award K02 while the
  // press-kit pages remain unstacked (or stacked in the wrong order).
  const stillNoKit = session.step({ type: 'submit-timeline', interpretation: 'order-of-reports' });
  assert.equal(stillNoKit.ok, true);
  assert.equal(session.getState().s02.k02Awarded, false);

  apply(session, [stackKitCorrect]);
  const correct = session.step({ type: 'submit-timeline', interpretation: 'order-of-reports' });
  assert.equal(correct.ok, true);
  assert.equal(session.getState().s02.k02Awarded, true);
});

test('S02 submit-timeline rejects before all six finds', () => {
  const session = createEpisodeSession();
  apply(session, [...completeS01, enterS02]);
  const early = session.step({ type: 'submit-timeline', interpretation: 'order-of-reports' });
  assert.equal(early.ok, false);
  if (!early.ok) assert.equal(early.errors[0].code, 'EPISODE_PREREQUISITE');
});

test('S03 layout, stamp and pun sub-choices gate K03; each requires its object found first', () => {
  const session = createEpisodeSession();
  apply(session, [...completeS01, ...completeS02, enterS03]);

  const layoutTooEarly = session.step(assembleLayoutCorrect);
  assert.equal(layoutTooEarly.ok, false);
  if (!layoutTooEarly.ok) assert.equal(layoutTooEarly.errors[0].code, 'EPISODE_PREREQUISITE');
  const stampTooEarly = session.step(stampUncertaintyCorrect);
  assert.equal(stampTooEarly.ok, false);
  if (!stampTooEarly.ok) assert.equal(stampTooEarly.errors[0].code, 'EPISODE_PREREQUISITE');
  const punTooEarly = session.step(resolvePunCorrect);
  assert.equal(punTooEarly.ok, false);
  if (!punTooEarly.ok) assert.equal(punTooEarly.errors[0].code, 'EPISODE_PREREQUISITE');

  apply(session, s03Finds);

  // Omitting the denial is a distinct, explicit wrong choice; it must retry, not silently pass.
  const omitDenial = session.step({ type: 'assemble-layout', pairing: 'report-only' });
  assert.equal(omitDenial.ok, true);
  const wrongStampTarget = session.step({ type: 'stamp-uncertainty', target: 'sourced-report' });
  assert.equal(wrongStampTarget.ok, true);
  const keepPun = session.step({ type: 'resolve-pun', decision: 'keep' });
  assert.equal(keepPun.ok, true);
  apply(session, [{ type: 'choose-emphasis', branch: 'lawyer-voice' }]);
  const submitWithWrongSubChoices = session.step({ type: 'submit-account', support: 'attributed-and-denied' });
  assert.equal(submitWithWrongSubChoices.ok, true);
  assert.equal(session.getState().s03.k03Awarded, false);
  assert.equal(session.getState().branch, null);
  assert.deepEqual(session.getState().s03.foundIds, s03Finds.map(action => 'objectId' in action ? action.objectId : ''));

  apply(session, [
    { type: 'assemble-layout', pairing: 'report-and-denial' },
    { type: 'stamp-uncertainty', target: 'video-claim' },
    { type: 'resolve-pun', decision: 'discard' },
  ]);
  const correct = session.step({ type: 'submit-account', support: 'attributed-and-denied' });
  assert.equal(correct.ok, true);
  assert.equal(session.getState().s03.k03Awarded, true);
  assert.equal(session.getState().branch, 'lawyer-voice');
});

test('S03 wrong account or missing emphasis preserves finds and allows retry', () => {
  const session = createEpisodeSession();
  apply(session, [...completeS01, ...completeS02, enterS03, ...s03Finds,
    assembleLayoutCorrect, stampUncertaintyCorrect, resolvePunCorrect]);

  const missingEmphasis = session.step({ type: 'submit-account', support: 'attributed-and-denied' });
  assert.equal(missingEmphasis.ok, true);
  assert.equal(session.getState().s03.k03Awarded, false);
  assert.deepEqual(session.getState().s03.foundIds, s03Finds.map(action => 'objectId' in action ? action.objectId : ''));

  apply(session, [{ type: 'choose-emphasis', branch: 'lawyer-voice' }]);
  const wrongAccount = session.step({ type: 'submit-account', support: 'exclusive-video-claim' });
  assert.equal(wrongAccount.ok, true);
  assert.equal(session.getState().s03.k03Awarded, false);
  assert.equal(session.getState().branch, null);
  assert.deepEqual(session.getState().s03.foundIds, s03Finds.map(action => 'objectId' in action ? action.objectId : ''));

  const correct = session.step({ type: 'submit-account', support: 'attributed-and-denied' });
  assert.equal(correct.ok, true);
  assert.equal(session.getState().s03.k03Awarded, true);
  assert.equal(session.getState().branch, 'lawyer-voice');
  assert.equal(session.getState().episodeCompleted, true);
});

test('post-award choices cannot contradict the committed K02/K03 outcome, and duplicates add no reward', () => {
  const s02Session = createEpisodeSession();
  apply(s02Session, [...completeS01, ...completeS02]);
  const wrongStack = s02Session.step({ type: 'stack-kit', first: 'S02.O2', second: 'S02.O1' });
  assert.equal(wrongStack.ok, false);
  if (!wrongStack.ok) assert.equal(wrongStack.errors[0].code, 'EPISODE_PROGRESSION_LOCKED');
  const wrongOrder = s02Session.step({ type: 'order-timeline', first: 'S02.O3', second: 'S02.O6' });
  assert.equal(wrongOrder.ok, false);
  if (!wrongOrder.ok) assert.equal(wrongOrder.errors[0].code, 'EPISODE_PROGRESSION_LOCKED');
  const wrongSubmit = s02Session.step({ type: 'submit-timeline', interpretation: 'proof-of-allegation' });
  assert.equal(wrongSubmit.ok, false);
  if (!wrongSubmit.ok) assert.equal(wrongSubmit.errors[0].code, 'EPISODE_PROGRESSION_LOCKED');
  const repeatStack = s02Session.step(stackKitCorrect);
  assert.equal(repeatStack.ok, true);
  const repeatOrder = s02Session.step({ type: 'order-timeline', first: 'S02.O6', second: 'S02.O3' });
  assert.equal(repeatOrder.ok, true);
  const repeatTimeline = s02Session.step({ type: 'submit-timeline', interpretation: 'order-of-reports' });
  assert.equal(repeatTimeline.ok, true);
  assert.deepEqual(repeatTimeline.events, []);
  assert.equal(s02Session.getState().notebook.filter(entry => entry.id === 'K02').length, 1);

  const session = createEpisodeSession();
  completeEpisode(session);

  const wrongLayout = session.step({ type: 'assemble-layout', pairing: 'report-only' });
  assert.equal(wrongLayout.ok, false);
  if (!wrongLayout.ok) assert.equal(wrongLayout.errors[0].code, 'EPISODE_PROGRESSION_LOCKED');
  const wrongStamp = session.step({ type: 'stamp-uncertainty', target: 'sourced-report' });
  assert.equal(wrongStamp.ok, false);
  if (!wrongStamp.ok) assert.equal(wrongStamp.errors[0].code, 'EPISODE_PROGRESSION_LOCKED');
  const wrongPun = session.step({ type: 'resolve-pun', decision: 'keep' });
  assert.equal(wrongPun.ok, false);
  if (!wrongPun.ok) assert.equal(wrongPun.errors[0].code, 'EPISODE_PROGRESSION_LOCKED');
  const wrongBranch = session.step({ type: 'choose-emphasis', branch: 'lawyer-voice' });
  assert.equal(wrongBranch.ok, false);
  if (!wrongBranch.ok) assert.equal(wrongBranch.errors[0].code, 'EPISODE_PROGRESSION_LOCKED');
  const wrongSupport = session.step({ type: 'submit-account', support: 'exclusive-video-claim' });
  assert.equal(wrongSupport.ok, false);
  if (!wrongSupport.ok) assert.equal(wrongSupport.errors[0].code, 'EPISODE_PROGRESSION_LOCKED');

  const repeatSubmit = session.step({ type: 'submit-account', support: 'attributed-and-denied' });
  assert.equal(repeatSubmit.ok, true);
  assert.deepEqual(repeatSubmit.events, []);
  assert.equal(session.getState().notebook.filter(entry => entry.id === 'K03').length, 1);
  assert.equal(session.getState().branch, 'splash-first');

  const duplicateFind = session.step({ type: 'select', objectId: 'S03.O1' });
  assert.equal(duplicateFind.ok, true);
  assert.equal(session.getState().notebook.filter(entry => entry.id === 'S03.C1').length, 1);
});

test('exact replay: identical initial session and action list yields identical final state', () => {
  const actions = [...completeS01, ...completeS02, ...completeS03];
  const a = createEpisodeSession();
  const b = createEpisodeSession();
  apply(a, actions);
  apply(b, actions);
  assert.deepEqual(a.getState(), b.getState());
  assert.deepEqual(a.getActions(), b.getActions());
});

test('canonical episode export/restore round-trips exactly', () => {
  const session = createEpisodeSession();
  apply(session, [...completeS01, enterS02, ...s02Finds,
    { type: 'stack-kit', first: 'S02.O2', second: 'S02.O1' },
    { type: 'order-timeline', first: 'S02.O3', second: 'S02.O6' },
    { type: 'submit-timeline', interpretation: 'proof-of-allegation' },
    stackKitCorrect,
    { type: 'order-timeline', first: 'S02.O6', second: 'S02.O3' },
    { type: 'submit-timeline', interpretation: 'order-of-reports' }, ...completeS03]);
  const save = session.exportSave();
  assert.equal(save.version, EPISODE_SAVE_VERSION);
  const restored = restoreEpisodeSession(save);
  assert.equal(restored.ok, true);
  if (!restored.ok) return;
  assert.deepEqual(restored.session.getState(), session.getState());
  assert.deepEqual(restored.session.getActions(), session.getActions());
  assert.deepEqual(restored.session.exportSave(), save);
});

test('restore rejects wrong version, tampered scene revisions, invalid actions and oversized journals transactionally', () => {
  const valid = createEpisodeSession().exportSave();
  assert.equal(restoreEpisodeSession({ ...valid, version: 2 }).ok, false);
  assert.equal(restoreEpisodeSession({ ...valid, sceneRevisions: { ...valid.sceneRevisions, s02: 'stale' } }).ok, false);
  assert.equal(restoreEpisodeSession({ ...valid, sceneRevisions: { s01: valid.sceneRevisions.s01, s02: valid.sceneRevisions.s02 } }).ok, false);
  assert.equal(restoreEpisodeSession({ ...valid, sceneRevisions: { ...valid.sceneRevisions, extra: true } }).ok, false);
  assert.equal(restoreEpisodeSession({ ...valid, actions: [{ type: 'enter-scene', scene: 'S02' }] }).ok, false);
  assert.equal(restoreEpisodeSession({ ...valid, actions: Array.from({ length: EPISODE_ACTION_LIMIT + 1 }, () => ({ type: 'hint' })) }).ok, false);
  assert.equal(restoreEpisodeSession({ ...valid, extra: true }).ok, false);
  assert.equal(restoreEpisodeSession('not-an-object').ok, false);
  assert.equal(restoreEpisodeSession(null).ok, false);
  assert.equal(S02_SCENE_REVISION.length > 0 && S03_SCENE_REVISION.length > 0, true);
});

test('a development save recorded under the prior S02/S03 rules is rejected, not silently replayed', () => {
  const valid = createEpisodeSession().exportSave();
  assert.notEqual(S02_SCENE_REVISION, PRIOR_S02_SCENE_REVISION);
  assert.notEqual(S03_SCENE_REVISION, PRIOR_S03_SCENE_REVISION);

  const staleS02 = restoreEpisodeSession({ ...valid, sceneRevisions: { ...valid.sceneRevisions, s02: PRIOR_S02_SCENE_REVISION } });
  assert.equal(staleS02.ok, false);
  if (!staleS02.ok) assert.equal(staleS02.errors[0].code, 'EPISODE_UNSUPPORTED_SAVE');

  const staleS03 = restoreEpisodeSession({ ...valid, sceneRevisions: { ...valid.sceneRevisions, s03: PRIOR_S03_SCENE_REVISION } });
  assert.equal(staleS03.ok, false);
  if (!staleS03.ok) assert.equal(staleS03.errors[0].code, 'EPISODE_UNSUPPORTED_SAVE');
});

test('invalid shapes and scene-order failures do not mutate state or enter the journal', () => {
  const session = createEpisodeSession();
  const before = session.getState();
  for (const action of [null, { type: 'select' }, { type: 'hint', extra: true }, { type: 'unknown' },
    { type: 'reset', scope: 'all' }, { type: 'order-timeline', first: 'S02.O6', second: 'S02.O6' },
    { type: 'stack-kit', first: 'S02.O1', second: 'S02.O1' }, { type: 'assemble-layout', pairing: 'invalid' },
    { type: 'stamp-uncertainty', target: 'invalid' }, { type: 'resolve-pun', decision: 'invalid' },
    { type: 'enter-scene', scene: 'S99' }]) {
    assert.equal(session.step(action).ok, false);
  }
  let accessed = false;
  const accessor = Object.defineProperty({}, 'type', { enumerable: true, get() { accessed = true; return 'hint'; } });
  assert.equal(session.step(accessor).ok, false);
  assert.equal(accessed, false);
  assert.deepEqual(session.getState(), before);
  assert.deepEqual(session.getActions(), []);
});

test('a valid public S01 v1 save imports as the first action and later scenes proceed normally', () => {
  const s01 = createNewsroomSession();
  for (const action of [{ type: 'select', objectId: 'S01.O6' } satisfies NewsroomAction, { type: 'pair-recorder', connector: 'recorder' } satisfies NewsroomAction]) {
    assert.equal(s01.step(action).ok, true);
  }
  const publicSave = s01.exportSave();

  const session = createEpisodeSession();
  const imported = session.step({ type: 'import-s01-save', save: publicSave });
  assert.equal(imported.ok, true);
  assert.deepEqual(session.getState().s01.foundIds, ['S01.O6']);
  assert.equal(session.getState().s01.chargerPaired, 'recorder');

  apply(session, [{ type: 'select', objectId: 'S01.O1' }, { type: 'select', objectId: 'S01.O2' }, { type: 'select', objectId: 'S01.O3' },
    { type: 'select', objectId: 'S01.O4' }, { type: 'select', objectId: 'S01.O5' },
    { type: 'check-source', contentId: 'S01.C5', reading: 'reported-account' }, { type: 'submit-draft', basis: 'published-report' },
    enterS02, ...s02Finds, stackKitCorrect, { type: 'order-timeline', first: 'S02.O6', second: 'S02.O3' },
    { type: 'submit-timeline', interpretation: 'order-of-reports' }]);
  assert.equal(session.getState().s02.k02Awarded, true);

  const restored = restoreEpisodeSession(session.exportSave());
  assert.equal(restored.ok, true);
  if (restored.ok) assert.deepEqual(restored.session.getState(), session.getState());
});

test('import-s01-save is rejected once the episode journal already has actions', () => {
  const session = createEpisodeSession();
  session.step({ type: 'select', objectId: 'S01.O1' });
  const late = session.step({ type: 'import-s01-save', save: createNewsroomSession().exportSave() });
  assert.equal(late.ok, false);
  if (!late.ok) assert.equal(late.errors[0].code, 'EPISODE_IMPORT_NOT_FIRST');
  assert.deepEqual(session.getState().s01.foundIds, ['S01.O1']);
});

test('malformed public save arrays reject before state or journal mutation', () => {
  const s01 = createNewsroomSession();
  for (const action of completeS01) assert.equal(s01.step(action).ok, true);
  for (const extra of [() => 1, 'unwanted metadata']) {
    const save = structuredClone(s01.exportSave());
    Object.assign(save.actions, { extra });
    const session = createEpisodeSession();
    const before = session.getState();
    const result = session.step({ type: 'import-s01-save', save });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.errors[0].code, 'EPISODE_INVALID_SAVE');
    assert.deepEqual(session.getState(), before);
    assert.deepEqual(session.getActions(), []);
    assert.equal(session.step(enterS02).ok, false);
    assert.equal(restoreEpisodeSession(session.exportSave()).ok, true);
  }
  const save = structuredClone(s01.exportSave());
  Object.defineProperty(save.actions, '0', { get() { throw Error('must not execute'); }, enumerable: true });
  assert.equal(createEpisodeSession().step({ type: 'import-s01-save', save }).ok, false);
});

test('scene reset clears only the current unfinished scene and preserves prior scene outputs', () => {
  const session = createEpisodeSession();
  apply(session, [...completeS01, enterS02, { type: 'select', objectId: 'S02.O1' }, { type: 'select', objectId: 'S02.O2' },
    stackKitCorrect, { type: 'order-timeline', first: 'S02.O6', second: 'S02.O3' }]);
  const beforeReset = session.getState();
  assert.equal(beforeReset.notebook.some(entry => entry.id === 'K01'), true);

  const reset = session.step({ type: 'reset', scope: 'scene' });
  assert.equal(reset.ok, true);
  const afterReset = session.getState();
  assert.deepEqual(afterReset.s02.foundIds, []);
  assert.deepEqual(afterReset.s02.kitOrder, []);
  assert.deepEqual(afterReset.s02.timelineOrder, []);
  assert.equal(afterReset.notebook.some(entry => entry.id === 'K01'), true);
  assert.equal(afterReset.notebook.some(entry => entry.id === 'S02.C1'), true);
  assert.equal(afterReset.s01.k01Awarded, true);

  const rejectedS01 = createEpisodeSession();
  apply(rejectedS01, completeS01);
  const rejectAfterK01 = rejectedS01.step({ type: 'reset', scope: 'scene' });
  assert.equal(rejectAfterK01.ok, false);
  if (!rejectAfterK01.ok) assert.equal(rejectAfterK01.errors[0].code, 'NEWSROOM_SCENE_RESET_LOCKED');

  const completedSession = createEpisodeSession();
  apply(completedSession, [...completeS01, ...completeS02]);
  const rejectedS02 = completedSession.step({ type: 'reset', scope: 'scene' });
  assert.equal(rejectedS02.ok, false);
  if (!rejectedS02.ok) assert.equal(rejectedS02.errors[0].code, 'EPISODE_SCENE_RESET_LOCKED');
});

test('S03 scene reset clears the unfinished layout/stamp/pun sub-choices and preserves prior scene outputs', () => {
  const session = createEpisodeSession();
  apply(session, [...completeS01, ...completeS02, enterS03, ...s03Finds, assembleLayoutCorrect, stampUncertaintyCorrect, resolvePunCorrect]);
  const beforeReset = session.getState();
  assert.equal(beforeReset.notebook.some(entry => entry.id === 'K02'), true);

  const reset = session.step({ type: 'reset', scope: 'scene' });
  assert.equal(reset.ok, true);
  const afterReset = session.getState();
  assert.deepEqual(afterReset.s03.foundIds, []);
  assert.equal(afterReset.s03.layoutPairing, null);
  assert.equal(afterReset.s03.uncertaintyStamp, null);
  assert.equal(afterReset.s03.punResolution, null);
  assert.equal(afterReset.notebook.some(entry => entry.id === 'K02'), true);
  assert.equal(afterReset.s02.k02Awarded, true);

  const completedSession = createEpisodeSession();
  completeEpisode(completedSession);
  const rejectedS03 = completedSession.step({ type: 'reset', scope: 'scene' });
  assert.equal(rejectedS03.ok, false);
  if (!rejectedS03.ok) assert.equal(rejectedS03.errors[0].code, 'EPISODE_SCENE_RESET_LOCKED');
});

test('episode reset clears all scenes, notebook, branch and completion', () => {
  const session = createEpisodeSession();
  completeEpisode(session);
  const result = session.step({ type: 'reset', scope: 'episode' });
  assert.equal(result.ok, true);
  const state = session.getState();
  assert.equal(state.currentScene, 'S01');
  assert.deepEqual(state.notebook, []);
  assert.equal(state.s01.k01Awarded, false);
  assert.equal(state.s02.k02Awarded, false);
  assert.deepEqual(state.s02.kitOrder, []);
  assert.equal(state.s03.k03Awarded, false);
  assert.equal(state.s03.layoutPairing, null);
  assert.equal(state.s03.uncertaintyStamp, null);
  assert.equal(state.s03.punResolution, null);
  assert.equal(state.branch, null);
  assert.equal(state.episodeCompleted, false);
  assert.equal(session.getActions().at(-1)?.type, 'reset');
});

test('snapshots, action logs and saves are frozen and independent of caller mutation', () => {
  const session = createEpisodeSession();
  const result = session.step({ type: 'select', objectId: 'S01.O1' });
  assert.equal(result.ok, true);
  assert.ok(Object.isFrozen(result.state));
  assert.ok(Object.isFrozen(result.state.notebook));
  assert.ok(Object.isFrozen(result.state.notebook[0]));
  assert.ok(Object.isFrozen(result.events[0]));
  assert.ok(Object.isFrozen(session.getActions()));
  assert.ok(Object.isFrozen(session.exportSave()));
  assert.throws(() => (session.getState().s01.foundIds as string[]).push('S01.O2'));
  assert.deepEqual(session.getState().s01.foundIds, ['S01.O1']);
});
