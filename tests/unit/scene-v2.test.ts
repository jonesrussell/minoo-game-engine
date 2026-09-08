import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { compileFromFile } from 'json-schema-to-typescript';
import { validateAnyScene, validateScene, type AnyScene } from '@minoo/engine/scene';
import { parseSceneV2, validateSceneV2, type SceneV2 } from '@minoo/engine/scene-v2';
import { createRuntime } from '@minoo/engine/runtime';
import { captureReplay, replayLog } from '@minoo/engine/replay';

function fixture(): SceneV2 {
  return {
    version: 2,
    id: 'TEST.Scene-2',
    width: 100,
    height: 80,
    objects: [
      { id: 'S01.O1', x: 5, y: 10, width: 20, height: 15, contentId: 'S01.Content-1' },
      { id: 'S01.O2', x: 50, y: 40, width: 10, height: 10, contentId: 'S01.Content-2' },
    ],
    contents: [
      {
        id: 'S01.Content-1', label: 'Synthetic published notice', clueId: 'S01.Clue-1', classification: 'fact',
        sourceRefs: ['Source.1'], editorial: { status: 'fixture' },
        rights: { status: 'fixture', basis: 'Original engineering fixture' },
      },
      {
        id: 'S01.Content-2', label: 'Synthetic newsroom prop', clueId: 'S01.Clue-2', classification: 'fiction',
        sourceRefs: [], editorial: { status: 'fixture' },
        rights: { status: 'fixture', basis: 'Original engineering fixture' },
      },
    ],
    sources: [{ id: 'Source.1', title: 'Synthetic source', url: 'https://example.test/source-1', publishedOn: '2024-02-29' }],
    completion: { type: 'find-all', requiredIds: ['S01.O1', 'S01.O2'] },
  };
}

function invalid(result: ReturnType<typeof validateSceneV2>, code: string, pointer: string) {
  assert.equal(result.ok, false);
  assert.ok(result.errors.some(error => error.code === code && error.pointer === pointer), `expected ${code} at ${pointer}`);
}

test('version 2 accepts investigative references and uppercase dotted stable IDs without mutation', () => {
  const scene = fixture();
  const before = structuredClone(scene);
  assert.deepEqual(validateSceneV2(scene), { ok: true, scene });
  assert.deepEqual(validateAnyScene(scene), { ok: true, scene });
  assert.deepEqual(scene, before);
  assert.equal(parseSceneV2(JSON.stringify(scene)).ok, true);
});

test('version-specific APIs do not silently migrate scenes', () => {
  const v2 = fixture();
  assert.equal(validateScene(v2).ok, false);
  const wrongVersion = { ...v2, version: 1 };
  assert.equal(validateSceneV2(wrongVersion).ok, false);
  assert.equal(validateAnyScene(wrongVersion).ok, false);
});

test('v2 diagnostics identify duplicate and dangling content, clue, source and completion IDs', () => {
  const scene = fixture();
  scene.objects[0].contentId = 'Missing.Content';
  scene.contents[1].clueId = scene.contents[0].clueId;
  scene.contents[0].sourceRefs = ['Missing.Source'];
  scene.completion.requiredIds = ['Missing.Object'];
  const result = validateSceneV2(scene);
  invalid(result, 'SCENE_REFERENCE', '/objects/0/contentId');
  invalid(result, 'SCENE_DUPLICATE_ID', '/contents/1/clueId');
  invalid(result, 'SCENE_REFERENCE', '/contents/0/sourceRefs/0');
  invalid(result, 'SCENE_REFERENCE', '/completion/requiredIds/0');
});

test('v2 diagnostics reject bounds, impossible dates, invalid URLs and incomplete review metadata', () => {
  const scene = fixture();
  scene.objects[0].x = 95;
  scene.sources[0].publishedOn = '2024-02-30';
  const result = validateSceneV2(scene);
  invalid(result, 'SCENE_BOUNDS', '/objects/0/width');
  invalid(result, 'SCENE_REVIEW_DATE', '/sources/0/publishedOn');

  const invalidUrl = fixture();
  invalidUrl.sources[0].url = 'https://';
  invalid(validateSceneV2(invalidUrl), 'SCENE_STRUCTURE', '/sources/0/url');

  const incompleteReview = fixture();
  incompleteReview.contents[0].editorial = { status: 'approved' };
  invalid(validateSceneV2(incompleteReview), 'SCENE_STRUCTURE', '/contents/0/editorial/reviewedBy');
});

test('generic runtime finds and hints v2 objects while replay embeds the explicit v2 snapshot', () => {
  const scene = fixture();
  const created = createRuntime(scene, { hintBudget: 1 });
  assert.equal(created.ok, true);
  if (!created.ok) return;
  assert.deepEqual(created.runtime.step({ type: 'hint' }).events, [{ type: 'hint', objectId: 'S01.O1' }]);

  const captured = captureReplay(scene, { hintBudget: 1 }, 'synthetic-v2-revision', [
    { type: 'select', objectId: 'S01.O1' }, { type: 'select', objectId: 'S01.O2' },
  ]);
  assert.equal(captured.ok, true);
  if (!captured.ok) return;
  assert.equal(captured.log.content.scene.version, 2);
  assert.equal(replayLog(captured.log).ok, true);
});

test('generated v2 declarations remain derived from the canonical schema', async () => {
  const expected = await compileFromFile('packages/engine/src/contracts/scene-v2.schema.json', { cwd: process.cwd() });
  const actual = await readFile('packages/engine/src/contracts/scene-v2.generated.d.ts', 'utf8');
  assert.equal(actual, expected);
});

const publicTypeProof: AnyScene = fixture();
assert.equal(publicTypeProof.version, 2);
