import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { compileFromFile } from 'json-schema-to-typescript';
import s01 from '../../games/ford-frenzy/data/s01-presentation.json' with { type: 'json' };
import reuseFixture from '../../games/ford-frenzy/data/presentation-reuse.fixture.json' with { type: 'json' };
import { createNewsroomSession } from '../../games/ford-frenzy/src/session.ts';
import { conversationView, createDialogueController, renderConversation, validatePresentation } from '../../games/ford-frenzy/src/presentation.ts';
import { reactionsForTransition, renderHud } from '../../games/ford-frenzy/src/hud.ts';
import scene from '../../games/ford-frenzy/data/s01.json' with { type: 'json' };
import type { SceneV2 } from '@minoo/engine/scene-v2';

test('validates S01 and reuses the same conversation layout for the fixture', () => {
  const first = validatePresentation(s01);
  const second = validatePresentation(reuseFixture);
  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  if (!first.ok || !second.ok) return;
  assert.equal(conversationView(first.presentation, 's01-opening', 0).beat.speaker, 'elliot');
  assert.equal(conversationView(first.presentation, 's01-opening', 1).beat.expression, 'annoyed');
  const annoyedMarkup = renderConversation(first.presentation, 's01-opening', 1, (id: string, text: string) => `<button id="${id}">${text}</button>`);
  assert.match(annoyedMarkup, /dialogue-alex-annoyed\.png/);
  assert.match(annoyedMarkup, /data-expression="neutral"[^>]+src="\.\/assets\/dialogue-elliot\.png"/);
  assert.match(renderConversation(second.presentation, 'fixture-conversation', 0, (id: string, text: string) => `<button id="${id}">${text}</button>`), /same conversation layout/);
});

test('missing optional expression mapping falls back to neutral art', () => {
  const fixture = structuredClone(reuseFixture) as { characters: Array<{ id: string; expressions: Record<string, string> }>; conversations: Array<{ beats: Array<{ expression: string }> }> };
  fixture.conversations[0]!.beats[0]!.expression = 'amused';
  const result = validatePresentation(fixture);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  const markup = renderConversation(result.presentation, 'fixture-conversation', 0, (id: string, text: string) => `<button id="${id}">${text}</button>`);
  assert.match(markup, /dialogue-alex\.png/);
  assert.doesNotMatch(markup, /dialogue-alex-amused\.png/);
  const unknown = structuredClone(reuseFixture) as { conversations: Array<{ beats: Array<{ expression: string }> }> };
  unknown.conversations[0]!.beats[0]!.expression = 'confused';
  assert.equal(validatePresentation(unknown).ok, false);
});

test('named dialogue controller bounds beat navigation and return destinations', () => {
  const validation = validatePresentation(s01);
  assert.equal(validation.ok, true);
  if (!validation.ok) return;
  const controller = createDialogueController(validation.presentation, 's01-closing', 'receipt', true);
  assert.equal(controller.view().beat.id, 's01-closing-01');
  assert.deepEqual(controller.back().index, 0);
  assert.equal(controller.next().view?.beat.id, 's01-closing-02');
  assert.equal(controller.next().view?.beat.id, 's01-closing-03');
  const done = controller.next();
  assert.deepEqual(done, { done: true, returnTo: 'receipt' });
  assert.deepEqual(controller.skip(), { done: true, returnTo: 'receipt' });
});

test('named conversation and beat IDs must remain unique', () => {
  const duplicate = structuredClone(s01) as { conversations: Array<{ id: string; beats: Array<{ id: string }> }> };
  duplicate.conversations[1]!.id = duplicate.conversations[0]!.id;
  duplicate.conversations[1]!.beats[0]!.id = duplicate.conversations[0]!.beats[0]!.id;
  const result = validatePresentation(duplicate);
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.errors.some(error => error.code === 'PRESENTATION_DUPLICATE_ID' && error.path.includes('/conversations')), true);
});

test('rejects unknown references before activation', () => {
  const invalid = structuredClone(s01) as { characters: Array<{ id: string; name: string; assetId: string }>; conversations: Array<{ beats: Array<{ id: string; speaker: string; line: string }> }> };
  invalid.characters[0]!.assetId = 'missing-portrait';
  invalid.conversations[0]!.beats[0]!.speaker = 'missing-character';
  const result = validatePresentation(invalid);
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.errors.some(error => error.code === 'PRESENTATION_REFERENCE' && error.path.includes('assetId')), true);
  assert.equal(result.errors.some(error => error.code === 'PRESENTATION_REFERENCE' && error.path.includes('speaker')), true);
  const unsafe = structuredClone(s01) as { assets: Array<{ id: string; url: string; required: boolean }> };
  unsafe.assets[0]!.url = 'https://example.invalid/remote.png';
  const unsafeResult = validatePresentation(unsafe);
  assert.equal(unsafeResult.ok, false);
  const unknown = structuredClone(s01) as Record<string, unknown>;
  unknown.unexpected = true;
  assert.equal(validatePresentation(unknown).ok, false);
});

test('generated presentation declarations stay derived from the canonical schema', async () => {
  const expected = await compileFromFile('games/ford-frenzy/data/presentation.schema.json', { cwd: process.cwd() });
  const actual = await readFile('games/ford-frenzy/src/presentation.generated.ts', 'utf8');
  assert.equal(actual, expected);
});

test('state reactions only describe accepted transitions and duplicate finds', () => {
  const session = createNewsroomSession();
  const before = session.getState();
  const accepted = session.step({ type: 'select', objectId: 'S01.O1' });
  assert.equal(accepted.ok, true);
  if (!accepted.ok) return;
  assert.deepEqual(reactionsForTransition(before, accepted), [{ type: 'sound', cue: 'find' }]);
  const duplicate = session.step({ type: 'select', objectId: 'S01.O1' });
  assert.equal(duplicate.ok, true);
  if (!duplicate.ok) return;
  assert.deepEqual(reactionsForTransition(accepted.state, duplicate), [{ type: 'status', key: 'duplicate' }]);
  const rejected = session.step({ type: 'select', objectId: 'missing-object' });
  assert.equal(rejected.ok, false);
  assert.deepEqual(reactionsForTransition(duplicate.state, rejected), []);
  assert.deepEqual(rejected.state.foundIds, ['S01.O1']);
});

test('HUD output is a deterministic view of state and restored saves', () => {
  const validation = validatePresentation(s01);
  assert.equal(validation.ok, true);
  if (!validation.ok) return;
  const button = (id: string, text: string) => `<button id="${id}">${text}</button>`;
  const session = createNewsroomSession();
  const typedScene = scene as unknown as SceneV2;
  const initial = renderHud(validation.presentation, typedScene, session.getState(), button);
  session.step({ type: 'select', objectId: 'S01.O1' });
  const progressed = renderHud(validation.presentation, typedScene, session.getState(), button);
  assert.match(initial, /0<small> \/ 6/);
  assert.match(progressed, /1<small> \/ 6/);
  assert.match(progressed, /class="found"/);
  const restored = session.exportSave();
  const restoredSession = createNewsroomSession();
  restoredSession.step(restored.actions[0]!);
  assert.equal(renderHud(validation.presentation, typedScene, restoredSession.getState(), button), progressed);
});


test('target references, local asset paths and input types reject before activation without mutation', () => {
  const ids = scene.objects.map(object => object.id);
  assert.equal(validatePresentation(s01, ids).ok, true);
  for (const candidate of [
    {...s01, targetLabels: s01.targetLabels.map((label,index) => index ? label : {...label,objectId:'unknown'})},
    {...s01, assets: s01.assets.map(asset => ({...asset,url:'./assets/../outside.png'}))},
    {...s01, version:'1'},
  ]) {
    const before = structuredClone(candidate);
    assert.equal(validatePresentation(candidate, ids).ok, false);
    assert.deepEqual(candidate, before);
  }
});

test('expression references must resolve to catalogued optional assets', () => {
  const ids = scene.objects.map(object => object.id);
  const brokenExpression = structuredClone(s01) as { characters: Array<{ expressions: Record<string, string> }> };
  brokenExpression.characters[0]!.expressions.annoyed = 'missing-expression-asset';
  assert.equal(validatePresentation(brokenExpression, ids).ok, false);
});
