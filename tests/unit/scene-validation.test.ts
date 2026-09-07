import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { compileFromFile } from 'json-schema-to-typescript';
import { parseScene, validateScene, type Scene } from '@minoo/engine/scene';

const fixtureRoot = new URL('../fixtures/scenes/', import.meta.url);

async function fixture(name = 'valid.json'): Promise<Scene> {
  const source = await readFile(new URL(name, fixtureRoot), 'utf8');
  const result = parseScene(source);
  assert.equal(result.ok, true, `${name} should be a valid scene fixture`);
  return structuredClone(result.scene);
}

function invalid(result: ReturnType<typeof validateScene>, code: string, pointer: string, requirement?: string) {
  assert.equal(result.ok, false);
  const diagnostic = result.errors.find(error => error.code === code && error.pointer === pointer);
  assert.ok(diagnostic, `expected ${code} at ${pointer}`);
  if (requirement) assert.equal(diagnostic.requirement, requirement);
}

test('valid scene passes without mutating Unicode or provenance data', async () => {
  const scene = await fixture();
  scene.vocabulary[0].text = 'Tree e\u0301 🌲'; // Synthetic text, not a translation.
  const before = structuredClone(scene);
  const result = validateScene(scene);
  assert.deepEqual(result, { ok: true, scene });
  assert.deepEqual(scene, before);
  assert.equal(scene.vocabulary[0].dialect, 'not-applicable-fixture');
  assert.equal(scene.vocabulary[0].source, 'original-engineering-fixture');
  assert.equal(scene.vocabulary[0].attribution, 'Minoo engineering fixture');
  assert.equal(scene.vocabulary[0].permittedUse, 'engineering-tests-only');
});

test('checked-in invalid fixtures produce actionable diagnostics', async () => {
  const cases: Array<[string, string, string, string]> = [
    ['invalid-version.json', 'SCENE_VERSION', '/version', 'SCN-VERSION-001'],
    ['invalid-duplicate.json', 'SCENE_DUPLICATE_ID', '/objects/1/id', 'SCN-IDENTITY-001'],
    ['invalid-bounds.json', 'SCENE_BOUNDS', '/objects/0/width', 'SCN-BOUNDS-001'],
    ['invalid-reference.json', 'SCENE_REFERENCE', '/objects/0/vocabularyId', 'SCN-VOCAB-001'],
  ];
  for (const [name, code, pointer, requirement] of cases) {
    const source = await readFile(new URL(name, fixtureRoot), 'utf8');
    const result = parseScene(source);
    invalid(result, code, pointer, requirement);
  }
});

test('scene JSON parsing reports syntax errors at the document root', () => {
  const result = parseScene('{"version": 1,');
  invalid(result, 'SCENE_INVALID_JSON', '', 'SCN-STRUCTURE-001');
});

test('exact-boundary objects and subset completion targets are valid', async () => {
  const scene = await fixture();
  scene.objects[0].x = scene.width - scene.objects[0].width;
  scene.objects[0].y = scene.height - scene.objects[0].height;
  scene.completion.requiredIds = [scene.objects[0].id];
  const result = validateScene(scene);
  assert.equal(result.ok, true);
});

test('semantic validation reports duplicate vocabulary IDs', async () => {
  const scene = await fixture();
  scene.vocabulary[1].id = scene.vocabulary[0].id;
  const result = validateScene(scene);
  invalid(result, 'SCENE_DUPLICATE_ID', '/vocabulary/1/id', 'SCN-VOCAB-001');
});

test('approved content requires reviewer and review date metadata', async () => {
  const scene = await fixture();
  scene.vocabulary[0].approval = { status: 'approved' };
  const result = validateScene(scene);
  invalid(result, 'SCENE_STRUCTURE', '/vocabulary/0/approval/reviewedBy', 'SCN-VOCAB-001');
});

test('review dates must be actual YYYY-MM-DD calendar dates', async () => {
  const scene = await fixture();
  scene.vocabulary[0].approval = { status: 'draft', reviewedOn: '2024-02-30' };
  const result = validateScene(scene);
  invalid(result, 'SCENE_REVIEW_DATE', '/vocabulary/0/approval/reviewedOn', 'SCN-VOCAB-001');
});

test('unknown audio-like fields are rejected by the structural contract', async () => {
  const scene = await fixture();
  (scene.vocabulary[0] as Scene['vocabulary'][number] & { audio?: unknown }).audio = { src: 'fixture.ogg' };
  const result = validateScene(scene);
  invalid(result, 'SCENE_STRUCTURE', '/vocabulary/0/audio', 'SCN-VOCAB-001');
});

test('validation does not mutate malformed JavaScript ingress values', async () => {
  const scene = await fixture();
  scene.width = Number.POSITIVE_INFINITY;
  const before = structuredClone(scene);
  const result = validateScene(scene);
  assert.equal(result.ok, false);
  assert.deepEqual(scene, before);
});

test('generated declarations remain byte-for-byte derived from the canonical schema', async () => {
  const expected = await compileFromFile('packages/engine/src/contracts/scene.schema.json', { cwd: process.cwd() });
  const actual = await readFile('packages/engine/src/contracts/scene.generated.d.ts', 'utf8');
  assert.equal(actual, expected);
});

test('completion targets must be unique and resolve to objects', async () => {
  const scene = await fixture();
  scene.completion.requiredIds = ['tree', 'tree'];
  invalid(validateScene(scene), 'SCENE_STRUCTURE', '/completion/requiredIds', 'SCN-COMPLETE-001');
  scene.completion.requiredIds = ['missing'];
  invalid(validateScene(scene), 'SCENE_REFERENCE', '/completion/requiredIds/0', 'SCN-COMPLETE-001');
});

test('structural failures reject missing fields, coercion and invalid scalar bounds', async () => {
  const original = await fixture();
  for (const width of ['960', 0, -1, NaN, Infinity]) {
    invalid(validateScene({ ...original, width }), 'SCENE_STRUCTURE', '/width', 'SCN-BOUNDS-001');
  }
  const { id: _omitted, ...missing } = original;
  invalid(validateScene(missing), 'SCENE_STRUCTURE', '/id', 'SCN-IDENTITY-001');
  invalid(validateScene({ ...original, id: '' }), 'SCENE_STRUCTURE', '/id', 'SCN-IDENTITY-001');
  invalid(validateScene({ ...original, 'unexpected/~field': true }), 'SCENE_STRUCTURE', '/unexpected~1~0field');
  assert.equal(validateScene(null).ok, false);
  assert.equal(validateScene(Object.create(original)).ok, false, 'inherited fields are not JSON document fields');
});

test('Unicode surrogates are rejected rather than silently replaced', async () => {
  for (const text of ['\ud800', '\udc00', 'x\ud800y']) {
    const scene = await fixture(); scene.vocabulary[0].text = text;
    invalid(validateScene(scene), 'SCENE_TEXT', '/vocabulary/0/text', 'SCN-VOCAB-001');
    assert.equal(scene.vocabulary[0].text, text);
  }
});

test('authoring accepts drafts and complete review metadata without claiming cultural approval', async () => {
  const scene = await fixture();
  scene.vocabulary[0].approval = { status: 'draft' };
  assert.equal(validateScene(scene).ok, true);
  scene.vocabulary[0].approval = { status: 'approved', reviewedBy: 'Synthetic engineering test reviewer', reviewedOn: '2024-02-29' };
  assert.equal(validateScene(scene).ok, true);
});

test('semantic errors have deterministic paths and do not leak across validation calls', async () => {
  const scene = await fixture();
  scene.objects[0].y = scene.height;
  scene.objects[0].vocabularyId = 'missing';
  const first = validateScene(scene);
  invalid(first, 'SCENE_BOUNDS', '/objects/0/height', 'SCN-BOUNDS-001');
  invalid(first, 'SCENE_REFERENCE', '/objects/0/vocabularyId', 'SCN-VOCAB-001');
  assert.deepEqual(validateScene(scene), first);
  assert.equal(validateScene(await fixture()).ok, true);
  assert.deepEqual(validateScene(scene), first);
});
