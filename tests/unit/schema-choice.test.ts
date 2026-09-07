import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { compileFromFile } from 'json-schema-to-typescript';
import Ajv from 'ajv';
import { z } from 'zod';
import { fixture, semanticProblems, validateJson, validateExport, zodScene } from '../../experiments/schema-choice/pilot.ts';

const structuralCases: [string, (scene: any) => void, boolean][] = [
  ['six English fixtures', () => {}, true],
  ['Unicode text preserved', scene => { scene.vocabulary[0].text = 'Tree 🌲'; }, true],
  ['unsupported version', scene => { scene.version = 2; }, false],
  ['unknown property', scene => { scene.extra = true; }, false],
  ['numeric string', scene => { scene.width = '960'; }, false],
  ['zero width', scene => { scene.width = 0; }, false],
  ['nonfinite width at JS ingress', scene => { scene.width = Infinity; }, false],
  ['empty ID', scene => { scene.objects[0].id = ''; }, false],
  ['missing provenance', scene => { delete scene.vocabulary[0].source; }, false],
  ['negative extent', scene => { scene.objects[0].width = -1; }, false],
];
for (const [name, mutate, expected] of structuralCases) {
  test(`schema comparison: ${name}`, () => {
    const value = fixture(); mutate(value); const before = structuredClone(value);
    assert.equal(validateJson(value), expected, 'canonical JSON Schema/Ajv');
    assert.equal(zodScene.safeParse(value).success, expected, 'Zod native');
    assert.equal(validateExport(value), expected, 'Zod exported Draft-07/Ajv');
    assert.deepEqual(value, before, 'validation must not coerce, strip or default input');
  });
}

const semanticCases: [string, (scene: ReturnType<typeof fixture>) => void][] = [
  ['duplicate-object-id', scene => { scene.objects[1].id = scene.objects[0].id; }],
  ['duplicate-vocabulary-id', scene => { scene.vocabulary[1].id = scene.vocabulary[0].id; }],
  ['out-of-bounds', scene => { scene.objects[0].x = 950; }],
  ['missing-vocabulary', scene => { scene.objects[0].vocabularyId = 'missing'; }],
  ['missing-completion-id', scene => { scene.completion.requiredIds[0] = 'missing'; }],
  ['duplicate-completion-id', scene => { scene.completion.requiredIds[1] = scene.completion.requiredIds[0]; }],
];
for (const [problem, mutate] of semanticCases) {
  test(`portable schemas require semantic validation: ${problem}`, () => {
    const value = fixture(); mutate(value);
    assert(validateJson(value)); assert(zodScene.safeParse(value).success); assert(validateExport(value));
    assert(semanticProblems(value).includes(problem));
  });
}
test('valid fixture has no semantic problems and Ajv reports a version pointer', () => {
  assert.deepEqual(semanticProblems(fixture()), []);
  assert.equal(validateJson({ ...fixture(), version: 2 }), false);
  assert(validateJson.errors?.some(error => error.instancePath === '/version'));
});
test('a Zod semantic refinement does not survive JSON Schema export', () => {
  const refined = zodScene.refine(scene => semanticProblems(scene as ReturnType<typeof fixture>).length === 0);
  const exported = new Ajv({ strict: true }).compile(z.toJSONSchema(refined, { target: 'draft-7' }));
  const value = fixture(); value.objects[0].x = 950;
  assert.equal(refined.safeParse(value).success, false);
  assert.equal(exported(value), true, 'export alone is not equivalent to semantic validation');
});
test('generated TypeScript declarations stay derived from the canonical schema', async () => {
  const generated = await compileFromFile('experiments/schema-choice/scene.schema.json', { cwd: process.cwd() });
  assert.equal(await readFile('experiments/schema-choice/scene.generated.d.ts', 'utf8'), generated);
});
