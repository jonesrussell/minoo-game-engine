import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseScene, type Scene } from '@minoo/engine/scene';
import { captureReplay, replayLog } from '@minoo/engine/replay';

function failure<T extends { ok: boolean }>(result: T): Extract<T, { ok: false }> {
  assert.equal(result.ok, false);
  return result as Extract<T, { ok: false }>;
}

const fixtureRoot = new URL('../fixtures/', import.meta.url);

async function sceneFixture(name = 'scenes/valid.json'): Promise<Scene> {
  const source = await readFile(new URL(name, fixtureRoot), 'utf8');
  const result = parseScene(source);
  assert.equal(result.ok, true, `${name} should be a valid scene fixture`);
  return structuredClone(result.scene);
}

async function journeyLog(): Promise<unknown> {
  return JSON.parse(await readFile(new URL('replay/journey.json', fixtureRoot), 'utf8'));
}

test('RPL-DETERMINISM-001: identical replay logs yield identical canonical state and events', async () => {
  const log = await journeyLog();
  const left = replayLog(log);
  const right = replayLog(log);
  assert.equal(left.ok, true);
  assert.equal(right.ok, true);
  if (!left.ok || !right.ok) return;
  assert.equal(left.canonicalState, right.canonicalState);
  assert.deepEqual(left.events, right.events);
  assert.deepEqual(left.state, right.state);
});

test('RPL-SNAPSHOT-001: journey fixture preserves embedded scene snapshot and nonrelease provenance', async () => {
  const log = await journeyLog() as {
    content: { revision: string; scene: Scene };
    inputs: { seed: null; time: null };
  };
  assert.equal(log.content.revision, 'journey-engineering-fixture-2026-09-07');
  assert.equal(log.content.scene.version, 1);
  assert.equal(log.content.scene.objects.length, 6);
  assert.ok(log.content.scene.vocabulary.every(record => record.approval.status === 'fixture'));
  assert.deepEqual(log.inputs, { seed: null, time: null });
});

test('RPL-VERSION-001: unsupported envelope and input versions are rejected with actionIndex null', async () => {
  const base = await journeyLog() as Record<string, unknown>;
  for (const [field, value] of [
    ['version', 2],
    ['runtimeVersion', 2],
    ['actionVersion', 2],
  ] as const) {
    const result = replayLog({ ...structuredClone(base), [field]: value });
    assert.equal(result.ok, false);
    assert.equal(result.actionIndex, null);
    assert.equal(result.errors[0]?.code, 'REPLAY_UNSUPPORTED_VERSION');
    assert.equal(result.errors[0]?.pointer, `/${field}`);
  }

  for (const inputs of [
    { seed: 1, time: null },
    { seed: null, time: 0 },
    { seed: 'x', time: null },
  ]) {
    const result = replayLog({ ...structuredClone(base), inputs });
    assert.equal(result.ok, false);
    assert.equal(result.actionIndex, null);
    assert.equal(result.errors[0]?.code, 'REPLAY_INVALID_INPUTS');
  }
});

test('RPL-VERSION-001: malformed envelope headers reject extra, missing and wrong-shaped fields', async () => {
  const base = await journeyLog() as Record<string, unknown>;
  assert.equal(failure(replayLog(null)).errors[0]?.code, 'REPLAY_INVALID_LOG');
  assert.equal(failure(replayLog({ ...structuredClone(base), extra: true })).errors[0]?.pointer, '/extra');
  assert.equal(failure(replayLog({ ...structuredClone(base), actions: 'nope' })).errors[0]?.code, 'REPLAY_INVALID_ACTIONS');

  const missingContent = structuredClone(base);
  delete (missingContent as { content?: unknown }).content;
  assert.equal(failure(replayLog(missingContent)).errors[0]?.pointer, '/content');

  const badRevision = structuredClone(base) as { content: { revision: string; scene: unknown } };
  badRevision.content.revision = '   ';
  assert.equal(failure(replayLog(badRevision)).errors[0]?.code, 'REPLAY_INVALID_CONTENT');

  const badOptions = structuredClone(base) as { options: Record<string, unknown> };
  badOptions.options.typo = true;
  assert.equal(failure(replayLog(badOptions)).errors[0]?.pointer, '/options/typo');
});

test('RPL-FAILURE-001: replay stops at the first failing action with zero-based actionIndex', async () => {
  const base = await journeyLog() as { actions: unknown[] };
  const semantic = structuredClone(base);
  semantic.actions = [
    { type: 'select', objectId: 'missing' },
    { type: 'inspect' },
  ];
  const semanticResult = replayLog(semantic);
  assert.equal(semanticResult.ok, false);
  assert.equal(semanticResult.actionIndex, 0);
  assert.equal(semanticResult.errors[0]?.code, 'RUNTIME_UNKNOWN_OBJECT');

  const malformed = structuredClone(base);
  malformed.actions = [
    { type: 'select', objectId: 'tree' },
    { type: 'inspect' },
  ];
  const malformedResult = replayLog(malformed);
  assert.equal(malformedResult.ok, false);
  assert.equal(malformedResult.actionIndex, 1);
  assert.equal(malformedResult.errors[0]?.code, 'RUNTIME_INVALID_ACTION');
});

test('RPL-FAILURE-001: header and runtime creation failures expose no successful partial state', async () => {
  const base = await journeyLog() as {
    content: { revision: string; scene: Scene };
    options: { hintBudget: number };
  };
  const invalidScene = structuredClone(base);
  invalidScene.content.scene.completion.requiredIds = ['missing'];
  const sceneFailure = replayLog(invalidScene);
  assert.equal(sceneFailure.ok, false);
  assert.equal(sceneFailure.actionIndex, null);
  assert.ok(!('state' in sceneFailure));

  const invalidOptions = structuredClone(base);
  invalidOptions.options = { hintBudget: -1 };
  const optionFailure = replayLog(invalidOptions);
  assert.equal(optionFailure.ok, false);
  assert.equal(optionFailure.actionIndex, null);
});

test('captureReplay validates ingress, freezes the log and resists later mutation', async () => {
  const scene = await sceneFixture();
  const options = { hintBudget: 2 };
  const actions = [
    { type: 'hint' },
    { type: 'select', objectId: 'tree' },
    { type: 'select', objectId: 'rock' },
    { type: 'select', objectId: 'water' },
    { type: 'select', objectId: 'path' },
    { type: 'select', objectId: 'leaf' },
    { type: 'select', objectId: 'flower' },
  ];
  scene.completion.requiredIds = ['tree', 'rock', 'water', 'path', 'leaf', 'flower'];

  const captured = captureReplay(scene, options, 'capture-fixture-revision', actions);
  assert.equal(captured.ok, true);
  if (!captured.ok) return;

  scene.completion.requiredIds.push('extra');
  actions.push({ type: 'reset' });
  options.hintBudget = 99;

  assert.equal(captured.log.content.revision, 'capture-fixture-revision');
  assert.equal(captured.log.actions.length, 7);
  assert.equal(captured.log.options.hintBudget, 2);
  assert.throws(() => {
    (captured.log.actions as unknown[]).push({ type: 'reset' });
  }, /Cannot add property|object is not extensible/);

  const replayed = replayLog(captured.log);
  assert.equal(replayed.ok, true);
});

test('captureReplay rejects invalid revision, options and failing action sequences', async () => {
  const scene = await sceneFixture();
  assert.equal(captureReplay(scene, { hintBudget: 3 }, '', []).ok, false);
  assert.equal(failure(captureReplay(scene, { hintBudget: 3 }, 'rev', null)).errors[0]?.code, 'REPLAY_INVALID_ACTIONS');
  assert.equal(failure(captureReplay(scene, { hintBudget: -1 }, 'rev', [])).errors[0]?.code, 'RUNTIME_INVALID_OPTIONS');
  assert.equal(
    failure(captureReplay(scene, { hintBudget: 3 }, 'rev', [{ type: 'select', objectId: 'missing' }])).errors[0]?.code,
    'RUNTIME_UNKNOWN_OBJECT',
  );
});

test('RPL-DETERMINISM-001: canonical state sorts keys while retaining first-find order', async () => {
  const captured = captureReplay(await sceneFixture(), { hintBudget: 3 }, 'rev', [
    { type: 'select', objectId: 'rock' }, { type: 'select', objectId: 'tree' },
  ]);
  assert.equal(captured.ok, true);
  const result = replayLog(captured.log);
  assert.equal(result.ok, true);
  assert.equal(result.canonicalState,
    '{"completed":false,"foundIds":["rock","tree"],"hintBudget":3,"hintsUsed":0,"sceneId":"clearing","score":2}');
  assert.ok(Object.isFrozen(result.state));
  assert.ok(Object.isFrozen(result.events[0]));
});

test('RPL-VERSION-001: scene versions and every missing top-level field fail before actions', async () => {
  const base = await journeyLog() as Record<string, unknown>;
  for (const key of Object.keys(base)) {
    const missing = structuredClone(base);
    delete missing[key];
    assert.equal(failure(replayLog(missing)).actionIndex, null);
  }
  const unsupported = structuredClone(base) as { content: { scene: { version: number } } };
  unsupported.content.scene.version = 2;
  const result = failure(replayLog(unsupported));
  assert.equal(result.actionIndex, null);
  assert.ok(result.errors.some(error => error.code === 'SCENE_VERSION'));
});

test('RPL-FAILURE-001: capture also reports the earliest rejected action index', async () => {
  const result = failure(captureReplay(await sceneFixture(), { hintBudget: 0 }, 'rev', [
    { type: 'select', objectId: 'tree' }, { type: 'hint' }, { type: 'bad' },
  ]));
  assert.equal(result.actionIndex, 1);
  assert.equal(result.errors[0]?.code, 'RUNTIME_HINT_EXHAUSTED');
  assert.ok(!('log' in result));
});
