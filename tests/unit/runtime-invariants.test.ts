import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import fc from 'fast-check';
import { parseScene, type Scene } from '@minoo/engine/scene';
import { createRuntime, type RuntimeEvent, type RuntimeState } from '@minoo/engine/runtime';
type Action = {
    type: 'select';
    objectId: string;
} | {
    type: 'hint';
} | {
    type: 'reset';
} | {
    type: 'complete';
};
type Input = Action | null | unknown[] | Record<string, unknown>;
type Model = {
    foundIds: string[];
    hintsUsed: number;
};
type Expected = {
    ok: boolean;
    state: RuntimeState;
    events: RuntimeEvent[];
    code?: string;
};
type SavedFailure = {
    fastCheckVersion: string;
    seed: number;
    path: string;
    actions: Action[];
};
const fixtureRoot = new URL('../fixtures/scenes/', import.meta.url);
const ids = ['tree', 'rock', 'water', 'path', 'leaf', 'flower'] as const;
const syntheticFaultSeed = 39073907;
const syntheticFaultPath = '0:1:0:0';
async function fixture(): Promise<Scene> {
    const result = parseScene(await readFile(new URL('valid.json', fixtureRoot), 'utf8'));
    assert.equal(result.ok, true);
    return structuredClone(result.scene);
}
function isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}
function isAction(value: unknown): value is Action {
    if (!isRecord(value))
        return false;
    if (value.type === 'select')
        return typeof value.objectId === 'string' && Object.keys(value).length === 2;
    return (value.type === 'hint' || value.type === 'reset' || value.type === 'complete') && Object.keys(value).length === 1;
}
function state(model: Model, requiredIds: readonly string[], hintBudget: number): RuntimeState {
    return { sceneId: 'clearing', foundIds: [...model.foundIds], score: model.foundIds.length, hintsUsed: model.hintsUsed, hintBudget, completed: requiredIds.every(id => model.foundIds.includes(id)) };
}
function derive(history: readonly Input[], requiredIds: readonly string[], objectIds: readonly string[], hintBudget: number): Model {
    const lastReset = history.reduce((index, input, i) => isAction(input) && input.type === 'reset' ? i : index, -1);
    const model: Model = { foundIds: [], hintsUsed: 0 };
    for (const input of history.slice(lastReset + 1)) {
        if (!isAction(input))
            continue;
        if (input.type === 'select' && objectIds.includes(input.objectId) && !model.foundIds.includes(input.objectId))
            model.foundIds.push(input.objectId);
        else if (input.type === 'hint' && model.hintsUsed < hintBudget && requiredIds.some(id => !model.foundIds.includes(id)))
            model.hintsUsed += 1;
    }
    return model;
}
function expected(history: readonly Input[], requiredIds: readonly string[], objectIds: readonly string[], hintBudget: number): Expected {
    const previous = derive(history.slice(0, -1), requiredIds, objectIds, hintBudget);
    const before = state(previous, requiredIds, hintBudget);
    const input = history.at(-1);
    if (!isAction(input))
        return { ok: false, state: before, events: [], code: 'RUNTIME_INVALID_ACTION' };
    if (input.type === 'reset')
        return { ok: true, state: state({ foundIds: [], hintsUsed: 0 }, requiredIds, hintBudget), events: [{ type: 'reset' }] };
    if (input.type === 'select') {
        if (!objectIds.includes(input.objectId))
            return { ok: false, state: before, events: [], code: 'RUNTIME_UNKNOWN_OBJECT' };
        if (previous.foundIds.includes(input.objectId))
            return { ok: true, state: before, events: [{ type: 'duplicate', objectId: input.objectId }] };
        const after = derive(history, requiredIds, objectIds, hintBudget);
        const events: RuntimeEvent[] = [{ type: 'found', objectId: input.objectId }];
        if (!before.completed && state(after, requiredIds, hintBudget).completed)
            events.push({ type: 'completed' });
        return { ok: true, state: state(after, requiredIds, hintBudget), events };
    }
    if (input.type === 'hint') {
        if (previous.hintsUsed >= hintBudget)
            return { ok: false, state: before, events: [], code: 'RUNTIME_HINT_EXHAUSTED' };
        const target = requiredIds.find(id => !previous.foundIds.includes(id));
        if (target === undefined)
            return { ok: false, state: before, events: [], code: 'RUNTIME_NO_HINT_TARGET' };
        const after = derive(history, requiredIds, objectIds, hintBudget);
        return { ok: true, state: state(after, requiredIds, hintBudget), events: [{ type: 'hint', objectId: target }] };
    }
    if (before.completed)
        return { ok: true, state: before, events: [] };
    return { ok: false, state: before, events: [], code: 'RUNTIME_INCOMPLETE' };
}
const validAction = fc.oneof(fc.constantFrom(...ids, 'missing').map(objectId => ({ type: 'select', objectId } as Action)), fc.constantFrom({ type: 'hint' } as const, { type: 'reset' } as const, { type: 'complete' } as const));
const malformedAction = fc.constantFrom<Input>(null, [], {}, { type: 'inspect' }, { type: 'select' }, { type: 'select', objectId: 1 }, { type: 'hint', extra: true });
test('generated histories match an independent history-derived oracle', async () => {
    const original = await fixture();
    const requiredArbitrary = fc.uniqueArray(fc.constantFrom(...ids), { minLength: 1, maxLength: ids.length });
    fc.assert(fc.property(fc.record({ requiredIds: requiredArbitrary, hintBudget: fc.integer({ min: 0, max: 5 }), actions: fc.array(fc.oneof(validAction, malformedAction), { maxLength: 45 }) }), ({ requiredIds, hintBudget, actions }) => {
        const scene = structuredClone(original);
        scene.completion.requiredIds = [...requiredIds] as [
            string,
            ...string[]
        ];
        const created = createRuntime(scene, { hintBudget });
        assert.equal(created.ok, true);
        const inputs: Input[] = [];
        let completionEvents = 0;
        const requiredFinds: Action[] = requiredIds.map(objectId => ({ type: 'select', objectId }));
        const exercisedActions = [...actions, ...requiredFinds, { type: 'complete' }, { type: 'reset' }, ...requiredFinds];
        for (const action of exercisedActions) {
            inputs.push(action);
            const want = expected(inputs, requiredIds, ids, hintBudget);
            const got = created.runtime.step(action);
            assert.equal(got.ok, want.ok, JSON.stringify({ action, got, want }));
            assert.deepEqual(got.state, want.state);
            assert.deepEqual(got.events, want.events);
            if (!got.ok) {
                assert.equal(got.ok, false);
                assert.equal(got.errors[0]?.code, want.code);
            }
            if (isAction(action) && action.type === 'reset')
                completionEvents = 0;
            completionEvents += got.events.filter(event => event.type === 'completed').length;
            assert.equal(got.state.score, new Set(got.state.foundIds).size);
            assert.ok(got.state.hintsUsed >= 0 && got.state.hintsUsed <= hintBudget);
            assert.equal(got.state.completed, requiredIds.every(id => got.state.foundIds.includes(id)));
            assert.ok(completionEvents <= 1);
        }
    }), { numRuns: 250, seed: 3907 });
});
test('guaranteed completion, idempotent complete and reset are exercised', async () => {
    const scene = await fixture();
    scene.completion.requiredIds = ['tree', 'rock', 'water'];
    const created = createRuntime(scene, { hintBudget: 2 });
    assert.equal(created.ok, true);
    for (const objectId of ['tree', 'rock', 'water'])
        assert.equal(created.runtime.step({ type: 'select', objectId }).ok, true);
    assert.equal(created.runtime.getState().completed, true);
    assert.deepEqual(created.runtime.step({ type: 'complete' }).events, []);
    assert.deepEqual(created.runtime.step({ type: 'complete' }).events, []);
    assert.deepEqual(created.runtime.step({ type: 'reset' }).events, [{ type: 'reset' }]);
    for (const objectId of ['tree', 'rock'])
        assert.equal(created.runtime.step({ type: 'select', objectId }).ok, true);
    assert.deepEqual(created.runtime.step({ type: 'select', objectId: 'water' }).events, [{ type: 'found', objectId: 'water' }, { type: 'completed' }]);
});
test('synthetic duplicate-score shrink and persisted replay are reproducible', async () => {
    const saved = JSON.parse(await readFile(new URL('../fixtures/runtime/minimized-duplicate.json', import.meta.url), 'utf8')) as SavedFailure;
    assert.equal(saved.fastCheckVersion, '4.9.0');
    assert.deepEqual(saved.actions, [{ type: 'select', objectId: 'tree' }, { type: 'select', objectId: 'tree' }]);
    assert.equal(saved.seed, syntheticFaultSeed);
    assert.equal(saved.path, syntheticFaultPath);
    // Synthetic fault: award one point for every selection, including duplicates.
    // Generate and shrink afresh, then reproduce from the checked-in coordinates.
    const faultProperty = fc.property(fc.array(fc.constantFrom('tree', 'rock'), { minLength: 1, maxLength: 8 }), history => assert.equal(history.length, new Set(history).size));
    const shrunk = fc.check(faultProperty, { seed: saved.seed, numRuns: 100 });
    assert.equal(shrunk.failed, true);
    assert.ok(shrunk.numShrinks > 0);
    assert.equal(shrunk.counterexamplePath, saved.path);
    assert.deepEqual(shrunk.counterexample?.[0].map(objectId => ({ type: 'select', objectId })), saved.actions);
    // Neither one-element subsequence exposes the duplicate-counting fault.
    for (const action of saved.actions)
        assert.equal(new Set([action]).size, 1);
    const faulty = fc.check(faultProperty, { seed: saved.seed, path: saved.path, numRuns: 1 });
    assert.equal(faulty.failed, true);
    assert.deepEqual(faulty.counterexample, [['tree', 'tree']]);
    const scene = await fixture();
    const replay = createRuntime(scene, { hintBudget: 3 });
    assert.equal(replay.ok, true);
    for (const action of saved.actions)
        assert.equal(replay.runtime.step(action).ok, true);
    assert.deepEqual(replay.runtime.getState().foundIds, ['tree']);
    assert.equal(replay.runtime.getState().score, 1);
});
