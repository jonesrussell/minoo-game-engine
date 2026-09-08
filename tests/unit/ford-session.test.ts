import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateSceneV2 } from '@minoo/engine/scene-v2';
import {
  NEWSROOM_ACTION_LIMIT,
  S01_SCENE_REVISION,
  createNewsroomSession,
  restoreNewsroomSession,
  type NewsroomAction,
  type NewsroomSession,
} from '../../games/ford-frenzy/src/session.ts';

const finds: NewsroomAction[] = Array.from({ length: 6 }, (_, index) => ({ type: 'select', objectId: `S01.O${index + 1}` }));

function apply(session: NewsroomSession, actions: readonly NewsroomAction[]) {
  for (const action of actions) {
    const result = session.step(action);
    assert.equal(result.ok, true, JSON.stringify(result));
  }
}

function complete(session: NewsroomSession) {
  apply(session, [
    ...finds,
    { type: 'pair-recorder', connector: 'recorder' },
    { type: 'check-source', contentId: 'S01.C5', reading: 'reported-account' },
    { type: 'submit-draft', basis: 'published-report' },
  ]);
}

test('bundled S01 v2 data uses canonical IDs, Toronto presentation bounds and fictional embedded content', async () => {
  const scene = JSON.parse(await readFile('games/ford-frenzy/data/s01.json', 'utf8'));
  assert.equal(validateSceneV2(scene).ok, true);
  assert.deepEqual(scene.completion.requiredIds, ['S01.O1', 'S01.O2', 'S01.O3', 'S01.O4', 'S01.O5', 'S01.O6']);
  assert.deepEqual(scene.objects.map((object: { id: string; contentId: string }) => [object.id, object.contentId]),
    Array.from({ length: 6 }, (_, index) => [`S01.O${index + 1}`, `S01.C${index + 1}`]));
  assert.deepEqual(scene.objects[0], { id: 'S01.O1', x: 550, y: 780, width: 190, height: 126.667, contentId: 'S01.C1' });
  assert.deepEqual(scene.objects[5], { id: 'S01.O6', x: 1530, y: 595, width: 185, height: 123.333, contentId: 'S01.C6' });
  assert.equal(scene.contents[2].classification, 'fiction');
  assert.ok(scene.contents.filter((content: { classification: string }) => content.classification === 'fiction')
    .every((content: { rights: { status: string; basis: string } }) => content.rights.status === 'unresolved' && /draft/i.test(content.rights.basis)));
  assert.equal(scene.contents[4].classification, 'fiction');
  assert.deepEqual(scene.contents[4].sourceRefs, []);
  assert.deepEqual(scene.sources, []);
  assert.doesNotMatch(JSON.stringify(scene), /Toronto Star|thestar\.com|Doolittle|Donovan/);
});

test('six finds complete search but never check a source or award K01', () => {
  const session = createNewsroomSession();
  apply(session, finds);
  const state = session.getState();
  assert.equal(state.searchCompleted, true);
  assert.deepEqual(state.foundIds, finds.map(action => 'objectId' in action ? action.objectId : ''));
  assert.deepEqual(state.sourceChecks, []);
  assert.equal(state.editorialAccepted, false);
  assert.equal(state.k01Awarded, false);
  assert.equal(state.transitionS02, 'locked');
});

test('source checks require the linked find and are idempotent', () => {
  const session = createNewsroomSession();
  const early = session.step({ type: 'check-source', contentId: 'S01.C5', reading: 'reported-account' });
  assert.equal(early.ok, false);
  assert.deepEqual(session.getActions(), []);
  apply(session, [{ type: 'select', objectId: 'S01.O5' }, { type: 'check-source', contentId: 'S01.C5', reading: 'reported-account' }, { type: 'check-source', contentId: 'S01.C5', reading: 'reported-account' }]);
  assert.deepEqual(session.getState().sourceChecks, ['S01.C5']);
  assert.equal(session.getState().notebook.find(entry => entry.id === 'S01.C5')?.checked, true);
});

test('recorder pairing is available after O6 and wrong choices remain replayable feedback', () => {
  const session = createNewsroomSession();
  assert.equal(session.step({ type: 'pair-recorder', connector: 'recorder' }).ok, false);
  apply(session, [{ type: 'select', objectId: 'S01.O6' }, { type: 'pair-recorder', connector: 'phone' }]);
  assert.equal(session.getState().chargerPaired, 'phone');
  assert.match(session.getState().lastMessage, /phone/i);
  assert.equal(session.getActions().length, 2);
});

test('wrong choices and unread clipping preserve finds for retry', () => {
  const session = createNewsroomSession();
  apply(session, [...finds, { type: 'pair-recorder', connector: 'phone' }]);
  const first = session.step({ type: 'submit-draft', basis: 'office-rumour' });
  assert.equal(first.ok, true);
  assert.match(first.state.lastMessage, /phone/i);
  assert.match(first.state.lastMessage, /rumour/i);
  assert.deepEqual(first.state.foundIds, finds.map(action => 'objectId' in action ? action.objectId : ''));
  assert.equal(first.state.k01Awarded, false);

  apply(session, [{ type: 'pair-recorder', connector: 'recorder' }]);
  const unchecked = session.step({ type: 'submit-draft', basis: 'published-report' });
  assert.equal(unchecked.ok, true);
  assert.deepEqual(unchecked.state.sourceChecks, []);
  assert.equal(unchecked.state.k01Awarded, false);
  const wrong = session.step({type:'check-source',contentId:'S01.C5',reading:'proven-claim'});
  assert.equal(wrong.ok,true);
  assert.deepEqual(wrong.state.sourceChecks,[]);
  assert.match(wrong.state.lastMessage,/headline cowboy/);
  apply(session,[{type:'check-source',contentId:'S01.C5',reading:'reported-account'},{type:'submit-draft',basis:'published-report'}]);
  assert.equal(session.getState().k01Awarded,true);
  const restored = restoreNewsroomSession(session.exportSave());
  assert.equal(restored.ok, true);
  if (restored.ok) assert.deepEqual(restored.session.getState(), session.getState());
});

test('the complete supported path awards K01 once and only unlocks S02', () => {
  const session = createNewsroomSession();
  complete(session);
  const awarded = session.getState();
  assert.equal(awarded.editorialAccepted, true);
  assert.equal(awarded.k01Awarded, true);
  assert.equal(awarded.transitionS02, 'unlocked');
  assert.equal(awarded.notebook.filter(entry => entry.id === 'K01').length, 1);
  const repeated = session.step({ type: 'submit-draft', basis: 'published-report' });
  assert.equal(repeated.ok, true);
  assert.deepEqual(repeated.events, []);
  assert.equal(repeated.state.notebook.filter(entry => entry.id === 'K01').length, 1);
});

test('post-K01 choices cannot contradict the awarded progression state', () => {
  const session = createNewsroomSession();
  complete(session);
  const actionCount = session.getActions().length;
  const wrongConnector = session.step({ type: 'pair-recorder', connector: 'phone' });
  const wrongBasis = session.step({ type: 'submit-draft', basis: 'office-rumour' });
  const newCheck = session.step({ type: 'check-source', contentId: 'S01.C1', reading: 'reported-account' });
  assert.equal(wrongConnector.ok, false);
  assert.equal(wrongBasis.ok, false);
  assert.equal(newCheck.ok, false);
  assert.ok([wrongConnector, wrongBasis, newCheck].every(result => !result.ok && result.errors[0].code === 'NEWSROOM_PROGRESSION_LOCKED'));
  assert.equal(session.getActions().length, actionCount);
  assert.equal(session.getState().chargerPaired, 'recorder');
  assert.equal(session.getState().editorialAccepted, true);
  assert.equal(session.getState().k01Awarded, true);
  assert.equal(session.getState().transitionS02, 'unlocked');

  assert.equal(session.step({ type: 'pair-recorder', connector: 'recorder' }).ok, true);
  assert.equal(session.step({ type: 'check-source', contentId: 'S01.C5', reading: 'reported-account' }).ok, true);
  assert.equal(session.step({ type: 'submit-draft', basis: 'published-report' }).ok, true);
  assert.equal(session.getState().notebook.filter(entry => entry.id === 'K01').length, 1);
});

test('duplicates do not add finds or notebook rewards and three hints are bounded', () => {
  const session = createNewsroomSession();
  apply(session, [{ type: 'select', objectId: 'S01.O1' }, { type: 'select', objectId: 'S01.O1' }]);
  assert.deepEqual(session.getState().foundIds, ['S01.O1']);
  assert.equal(session.getState().notebook.filter(entry => entry.id === 'S01.C1').length, 1);
  apply(session, [{ type: 'hint' }, { type: 'hint' }, { type: 'hint' }]);
  assert.equal(session.getState().hintsUsed, 3);
  assert.ok(session.getState().hintedObjectId);
  const exhausted = session.step({ type: 'hint' });
  assert.equal(exhausted.ok, false);
  assert.equal(exhausted.errors[0].code, 'RUNTIME_HINT_EXHAUSTED');
  assert.equal(session.getActions().length, 5);
});

test('snapshots, action logs, saves, notebook entries and events are readonly copies', () => {
  const session = createNewsroomSession();
  const result = session.step({ type: 'select', objectId: 'S01.O1' });
  assert.equal(result.ok, true);
  assert.ok(Object.isFrozen(result.state));
  assert.ok(Object.isFrozen(result.state.foundIds));
  assert.ok(Object.isFrozen(result.state.notebook[0]));
  assert.ok(Object.isFrozen(result.events[0]));
  assert.ok(Object.isFrozen(session.getActions()));
  assert.ok(Object.isFrozen(session.exportSave()));
  assert.throws(() => (session.getState().foundIds as string[]).push('S01.O2'));
  assert.deepEqual(session.getState().foundIds, ['S01.O1']);
});

test('scene reset works before completion, retains notebook, and is rejected after K01', () => {
  const session = createNewsroomSession();
  apply(session, [{ type: 'select', objectId: 'S01.O5' }, { type: 'check-source', contentId: 'S01.C5', reading: 'reported-account' }, { type: 'reset', scope: 'scene' }]);
  const reset = session.getState();
  assert.deepEqual(reset.foundIds, []);
  assert.deepEqual(reset.sourceChecks, []);
  assert.equal(reset.notebook.some(entry => entry.id === 'S01.C5'), true);
  assert.equal(reset.notebook.find(entry => entry.id === 'S01.C5')?.checked, false);

  const completed = createNewsroomSession();
  complete(completed);
  const rejected = completed.step({ type: 'reset', scope: 'scene' });
  assert.equal(rejected.ok, false);
  assert.equal(rejected.errors[0].code, 'NEWSROOM_SCENE_RESET_LOCKED');
  assert.equal(completed.getState().k01Awarded, true);
});

test('session reset clears all progression and remains part of deterministic history', () => {
  const session = createNewsroomSession();
  complete(session);
  const result = session.step({ type: 'reset', scope: 'session' });
  assert.equal(result.ok, true);
  assert.deepEqual(result.state.foundIds, []);
  assert.deepEqual(result.state.notebook, []);
  assert.equal(result.state.k01Awarded, false);
  assert.equal(result.state.transitionS02, 'locked');
  assert.equal(session.getActions().at(-1)?.type, 'reset');
});

test('valid save restoration reproduces state and accepted action journal exactly', () => {
  const session = createNewsroomSession();
  apply(session, [...finds, { type: 'pair-recorder', connector: 'phone' }, { type: 'submit-draft', basis: 'office-rumour' },
    { type: 'pair-recorder', connector: 'recorder' }, { type: 'check-source', contentId: 'S01.C5', reading: 'reported-account' }, { type: 'submit-draft', basis: 'published-report' }]);
  const save = session.exportSave();
  const restored = restoreNewsroomSession(save);
  assert.equal(restored.ok, true);
  if (!restored.ok) return;
  assert.deepEqual(restored.session.getState(), session.getState());
  assert.deepEqual(restored.session.getActions(), session.getActions());
  assert.deepEqual(restored.session.exportSave(), save);
});

test('restore rejects wrong versions, revisions, invalid actions and oversized journals without partial session', () => {
  const valid = { version: 1, sceneRevision: S01_SCENE_REVISION, actions: [] };
  assert.equal(restoreNewsroomSession({ ...valid, version: 2 }).ok, false);
  assert.equal(restoreNewsroomSession({ ...valid, sceneRevision: 'stale' }).ok, false);
  assert.equal(restoreNewsroomSession({ ...valid, actions: [{ type: 'select', objectId: 'missing' }] }).ok, false);
  assert.equal(restoreNewsroomSession({ ...valid, actions: Array.from({ length: NEWSROOM_ACTION_LIMIT + 1 }, () => ({ type: 'hint' })) }).ok, false);
  assert.equal(restoreNewsroomSession({ ...valid, extra: true }).ok, false);
});

test('invalid shapes and failed prerequisites do not mutate state or enter the journal', () => {
  const session = createNewsroomSession();
  const before = session.getState();
  for (const action of [null, { type: 'select' }, { type: 'hint', extra: true }, { type: 'unknown' }, { type: 'reset', scope: 'all' }]) {
    assert.equal(session.step(action).ok, false);
  }
  let accessed = false;
  const accessor = Object.defineProperty({}, 'type', { enumerable: true, get() { accessed = true; return 'hint'; } });
  assert.equal(session.step(accessor).ok, false);
  assert.equal(accessed, false);
  assert.deepEqual(session.getState(), before);
  assert.deepEqual(session.getActions(), []);
});


test('pre-composition object-ID saves restore unchanged progress after prop relocation', () => {
  const savedBeforeComposition = {
    version: 1,
    sceneRevision: 'ford-frenzy-s01-v2-embedded-clipping-2026-09-07',
    actions: [
      { type: 'select', objectId: 'S01.O6' },
      { type: 'pair-recorder', connector: 'recorder' },
      { type: 'select', objectId: 'S01.O5' },
      { type: 'check-source', contentId: 'S01.C5', reading: 'reported-account' },
      { type: 'hint' },
    ],
  };
  const restored = restoreNewsroomSession(savedBeforeComposition);
  assert.equal(restored.ok, true);
  if (!restored.ok) return;
  const state = restored.session.getState();
  assert.deepEqual(state.foundIds, ['S01.O6', 'S01.O5']);
  assert.equal(state.chargerPaired, 'recorder');
  assert.deepEqual(state.sourceChecks, ['S01.C5']);
  assert.equal(state.hintsUsed, 1);
  assert.equal(state.k01Awarded, false);
  assert.deepEqual(restored.session.exportSave(), savedBeforeComposition);
});
