import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseScene, type Scene } from '@minoo/engine/scene';
import {
  createRuntime,
  type Runtime,
  type RuntimeEvent,
  type RuntimeState,
  type RuntimeStepResult,
} from '@minoo/engine/runtime';

const fixtureRoot = new URL('../fixtures/scenes/', import.meta.url);

async function sceneFixture(name = 'valid.json'): Promise<Scene> {
  const source = await readFile(new URL(name, fixtureRoot), 'utf8');
  const result = parseScene(source);
  assert.equal(result.ok, true, `${name} should be a valid scene fixture`);
  return structuredClone(result.scene);
}

function runtime(scene: Scene, hintBudget = 3): Runtime {
  const created = createRuntime(scene, { hintBudget });
  assert.equal(created.ok, true);
  return created.runtime;
}

function step(runtime: Runtime, action: unknown): RuntimeStepResult {
  return runtime.step(action);
}

function okStep(runtime: Runtime, action: unknown) {
  const result = step(runtime, action);
  assert.equal(result.ok, true, JSON.stringify(result));
  return result;
}

function failStep(runtime: Runtime, action: unknown, code: string, pointer?: string) {
  const result = step(runtime, action);
  assert.equal(result.ok, false);
  const diagnostic = result.errors.find(error => error.code === code && (pointer === undefined || error.pointer === pointer));
  assert.ok(diagnostic, `expected ${code}${pointer ? ` at ${pointer}` : ''}`);
  return result;
}

function collectEvents(runtime: Runtime, actions: unknown[]): RuntimeEvent[] {
  const events: RuntimeEvent[] = [];
  for (const action of actions) {
    const result = step(runtime, action);
    assert.equal(result.ok, true, JSON.stringify(result));
    events.push(...result.events);
  }
  return events;
}

test('RTN-SELECT-001: select finds unique objects and ignores duplicate score changes', async () => {
  const scene = await sceneFixture();
  const session = runtime(scene);
  const first = okStep(session, { type: 'select', objectId: 'tree' });
  assert.deepEqual(first.events, [{ type: 'found', objectId: 'tree' }]);
  assert.deepEqual(first.state.foundIds, ['tree']);
  assert.equal(first.state.score, 1);

  const duplicate = okStep(session, { type: 'select', objectId: 'tree' });
  assert.deepEqual(duplicate.events, [{ type: 'duplicate', objectId: 'tree' }]);
  assert.deepEqual(duplicate.state.foundIds, ['tree']);
  assert.equal(duplicate.state.score, 1);
});

test('RTN-HINT-001: hints target the first remaining required ID and never find objects', async () => {
  const scene = await sceneFixture();
  scene.completion.requiredIds = ['tree', 'rock', 'water'];
  const session = runtime(scene, 2);

  const firstHint = okStep(session, { type: 'hint' });
  assert.deepEqual(firstHint.events, [{ type: 'hint', objectId: 'tree' }]);
  assert.equal(firstHint.state.score, 0);
  assert.equal(firstHint.state.hintsUsed, 1);

  okStep(session, { type: 'select', objectId: 'rock' });
  const secondHint = okStep(session, { type: 'hint' });
  assert.deepEqual(secondHint.events, [{ type: 'hint', objectId: 'tree' }]);
  assert.equal(secondHint.state.score, 1);

  failStep(session, { type: 'hint' }, 'RUNTIME_HINT_EXHAUSTED', '/hintBudget');
});

test('RTN-COMPLETE-001: final required find auto-completes once and explicit complete is idempotent', async () => {
  const scene = await sceneFixture();
  scene.completion.requiredIds = ['tree', 'rock'];
  const session = runtime(scene);

  okStep(session, { type: 'select', objectId: 'tree' });
  const finish = okStep(session, { type: 'select', objectId: 'rock' });
  assert.deepEqual(finish.events, [
    { type: 'found', objectId: 'rock' },
    { type: 'completed' },
  ]);
  assert.equal(finish.state.completed, true);

  const again = okStep(session, { type: 'complete' });
  assert.deepEqual(again.events, []);
  assert.equal(again.state.completed, true);
});

test('RTN-COMPLETE-001: explicit complete fails while required targets remain', async () => {
  const scene = await sceneFixture();
  scene.completion.requiredIds = ['tree', 'rock'];
  const session = runtime(scene);
  okStep(session, { type: 'select', objectId: 'tree' });
  failStep(session, { type: 'complete' }, 'RUNTIME_INCOMPLETE', '/completion/requiredIds');
});

test('RTN-RESET-001: reset starts a fresh run with cleared score and completion', async () => {
  const scene = await sceneFixture();
  scene.completion.requiredIds = ['tree'];
  const session = runtime(scene, 1);

  okStep(session, { type: 'hint' });
  okStep(session, { type: 'select', objectId: 'tree' });
  const reset = okStep(session, { type: 'reset' });
  assert.deepEqual(reset.events, [{ type: 'reset' }]);
  assert.deepEqual(reset.state, {
    sceneId: 'clearing',
    foundIds: [],
    score: 0,
    hintsUsed: 0,
    hintBudget: 1,
    completed: false,
  });

  const replayed = okStep(session, { type: 'select', objectId: 'tree' });
  assert.deepEqual(replayed.events, [
    { type: 'found', objectId: 'tree' },
    { type: 'completed' },
  ]);
});

test('RTN-REPLAY-001: identical scene, options and actions yield identical state and events', async () => {
  const scene = await sceneFixture();
  scene.completion.requiredIds = ['tree', 'rock'];
  const actions = [
    { type: 'hint' },
    { type: 'select', objectId: 'rock' },
    { type: 'select', objectId: 'tree' },
    { type: 'select', objectId: 'tree' },
    { type: 'complete' },
  ];

  const run = () => {
    const session = runtime(scene, 3);
    const events = collectEvents(session, actions);
    return { state: session.getState(), events };
  };

  const left = run();
  const right = run();
  assert.deepEqual(left, right);
});

test('RTN-ACTION-001: invalid actions return stable diagnostics without changing state', async () => {
  const scene = await sceneFixture();
  const session = runtime(scene);
  const before = session.getState();

  for (const action of [null, [], { type: 'inspect' }, { type: 'select' }, { type: 'select', objectId: 1 }]) {
    const result = step(session, action);
    assert.equal(result.ok, false);
    assert.equal(result.errors[0]?.code, 'RUNTIME_INVALID_ACTION');
    assert.deepEqual(session.getState(), before);
    assert.deepEqual(result.events, []);
  }

  failStep(session, { type: 'select', objectId: 'missing' }, 'RUNTIME_UNKNOWN_OBJECT', '/objectId');
  assert.deepEqual(session.getState(), before);
});

test('RTN-OPTIONS-001: runtime creation validates hint budget options', async () => {
  const scene = await sceneFixture();
  for (const hintBudget of [-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
    const created = createRuntime(scene, { hintBudget });
    assert.equal(created.ok, false);
    assert.equal(created.errors[0]?.code, 'RUNTIME_INVALID_OPTIONS');
  }
  assert.equal(createRuntime(scene, { hintBudget: 0 }).ok, true);
});

test('RTN-IMMUTABLE-001: scene snapshot and returned state resist caller mutation', async () => {
  const scene = await sceneFixture();
  scene.completion.requiredIds = ['tree'];
  const created = createRuntime(scene, { hintBudget: 1 });
  assert.equal(created.ok, true);

  scene.completion.requiredIds.push('rock');
  scene.objects.push({
    id: 'extra',
    x: 0,
    y: 0,
    width: 10,
    height: 10,
    vocabularyId: 'tree',
  });

  const session = created.runtime;
  failStep(session, { type: 'select', objectId: 'extra' }, 'RUNTIME_UNKNOWN_OBJECT', '/objectId');

  const found = okStep(session, { type: 'select', objectId: 'tree' });
  assert.throws(() => {
    (found.state.foundIds as string[]).push('rock');
  }, /Cannot add property|object is not extensible/);
  assert.deepEqual(session.getState().foundIds, ['tree']);
});

test('RTN-COMPLETE-001: subset completion targets are supported', async () => {
  const scene = await sceneFixture();
  scene.completion.requiredIds = ['tree'];
  const session = runtime(scene);

  okStep(session, { type: 'select', objectId: 'rock' });
  assert.equal(session.getState().score, 1);
  assert.equal(session.getState().completed, false);

  const done = okStep(session, { type: 'select', objectId: 'tree' });
  assert.equal(done.state.completed, true);
  assert.equal(done.state.score, 2);
});

test('RTN-HINT-001: post-completion hint requests fail without changing state', async () => {
  const scene = await sceneFixture();
  scene.completion.requiredIds = ['tree'];
  const session = runtime(scene, 2);
  okStep(session, { type: 'select', objectId: 'tree' });
  const before = session.getState();
  failStep(session, { type: 'hint' }, 'RUNTIME_NO_HINT_TARGET', '/completion/requiredIds');
  assert.deepEqual(session.getState(), before);
});

test('RTN-SELECT-001: post-completion selects remain allowed without re-emitting completion', async () => {
  const scene = await sceneFixture();
  scene.completion.requiredIds = ['tree'];
  const session = runtime(scene);
  okStep(session, { type: 'select', objectId: 'tree' });

  const extra = okStep(session, { type: 'select', objectId: 'rock' });
  assert.deepEqual(extra.events, [{ type: 'found', objectId: 'rock' }]);
  assert.equal(extra.state.completed, true);

  const duplicate = okStep(session, { type: 'select', objectId: 'rock' });
  assert.deepEqual(duplicate.events, [{ type: 'duplicate', objectId: 'rock' }]);
});

test('createRuntime rejects invalid external scenes using scene validation', async () => {
  const scene = await sceneFixture();
  scene.completion.requiredIds = ['missing'];
  const created = createRuntime(scene, { hintBudget: 3 });
  assert.equal(created.ok, false);
  assert.equal(created.errors[0]?.code, 'SCENE_REFERENCE');
});

test('RTN-ACTION-001: reject extra, inherited and accessor action fields', async () => {
  const session = runtime(await sceneFixture());
  const before = session.getState();
  for (const action of [
    { type: 'hint', typo: true }, { type: 'select', objectId: 'tree', score: 99 },
    Object.create({ type: 'reset' }), { get type() { throw new Error('must not run'); } },
  ]) {
    failStep(session, action, 'RUNTIME_INVALID_ACTION');
    assert.deepEqual(session.getState(), before);
  }
  failStep(session, { type: 'hint', 'a/b~': true }, 'RUNTIME_INVALID_ACTION', '/a~1b~0');
});

test('RTN-OPTIONS-001: unknown option ingress fails without coercion', async () => {
  const scene = await sceneFixture();
  for (const options of [null, [], {}, { hintBudget: '3' }, { hintBudget: 3, typo: true },
    { hintBudget: Number.MAX_SAFE_INTEGER + 1 }, Object.create({ hintBudget: 3 })]) {
    const result = createRuntime(scene, options);
    assert.equal(result.ok, false);
    assert.equal(result.errors[0]?.code, 'RUNTIME_INVALID_OPTIONS');
  }
});

test('RTN-IMMUTABLE-001: event payloads, diagnostics and session internals cannot be rewritten', async () => {
  const session = runtime(await sceneFixture());
  const selected = okStep(session, { type: 'select', objectId: 'tree' });
  assert.ok(Object.isFrozen(selected.events[0]));
  assert.throws(() => Object.assign(selected.events[0]!, { objectId: 'rock' }), TypeError);
  const invalid = failStep(session, null, 'RUNTIME_INVALID_ACTION');
  assert.ok(Object.isFrozen(invalid.errors[0]));
  assert.deepEqual(Object.keys(session), []);
  assert.throws(() => Object.assign(session, { internal: { found: ['rock'] } }), TypeError);
  assert.deepEqual(session.getState().foundIds, ['tree']);
});

test('RTN-HINT-001: exhausted budget takes precedence when completion also leaves no target', async () => {
  const scene = await sceneFixture();
  scene.completion.requiredIds = ['tree'];
  const session = runtime(scene, 1);
  okStep(session, { type: 'hint' });
  okStep(session, { type: 'select', objectId: 'tree' });
  failStep(session, { type: 'hint' }, 'RUNTIME_HINT_EXHAUSTED');
});
