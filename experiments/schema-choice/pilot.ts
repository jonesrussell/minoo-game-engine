// Comparison-only code. Production engine and game packages must not import it.
import { readFileSync } from 'node:fs';
import Ajv from 'ajv';
import { z } from 'zod';
import type { PilotScene } from './scene.generated.d.ts';

export const schema = JSON.parse(readFileSync(new URL('./scene.schema.json', import.meta.url), 'utf8'));
const ajv = new Ajv({ strict: true, allErrors: true, coerceTypes: false, useDefaults: false, removeAdditional: false });
export const validateJson = ajv.compile<PilotScene>(schema);

// Deliberately independent alternative for the experiment, not an authoritative contract.
const id = z.string().regex(/^[a-z][a-z0-9-]*$/);
export const zodScene = z.strictObject({
  version: z.literal(1), id,
  width: z.number().positive(), height: z.number().positive(),
  objects: z.array(z.strictObject({
    id, x: z.number().nonnegative(), y: z.number().nonnegative(),
    width: z.number().positive(), height: z.number().positive(), vocabularyId: id,
  })).min(1),
  vocabulary: z.array(z.strictObject({
    id, text: z.string().min(1), dialect: z.string().min(1), source: z.string().min(1), fixture: z.literal(true),
  })).min(1),
  completion: z.strictObject({ requiredIds: z.array(id).min(1) }),
});
export const exportedSchema = z.toJSONSchema(zodScene, { target: 'draft-7' });
export const validateExport = ajv.compile(exportedSchema);

export function fixture(): PilotScene {
  const ids = ['tree', 'rock', 'water', 'path', 'leaf', 'flower'] as const;
  const object = (id: string, i: number) => ({ id, x: 10 + i * 100, y: 20, width: 40, height: 40, vocabularyId: id });
  const word = (id: string) => ({ id, text: id, dialect: 'not-applicable-fixture', source: 'engineering-fixture', fixture: true as const });
  return {
    version: 1, id: 'clearing', width: 960, height: 460,
    objects: [object(ids[0], 0), ...ids.slice(1).map((id, i) => object(id, i + 1))],
    vocabulary: [word(ids[0]), ...ids.slice(1).map(word)],
    completion: { requiredIds: [...ids] },
  };
}

// A demonstration of checks that portable structural schemas do not express.
// Issue #6 must define production diagnostic codes, paths and content policies.
export function semanticProblems(scene: PilotScene): string[] {
  const errors: string[] = [];
  const ids = new Set(scene.objects.map(object => object.id));
  const vocabulary = new Set(scene.vocabulary.map(record => record.id));
  if (ids.size !== scene.objects.length) errors.push('duplicate-object-id');
  if (vocabulary.size !== scene.vocabulary.length) errors.push('duplicate-vocabulary-id');
  for (const object of scene.objects) {
    if (object.x + object.width > scene.width || object.y + object.height > scene.height) errors.push('out-of-bounds');
    if (!vocabulary.has(object.vocabularyId)) errors.push('missing-vocabulary');
  }
  if (new Set(scene.completion.requiredIds).size !== scene.completion.requiredIds.length) errors.push('duplicate-completion-id');
  if (scene.completion.requiredIds.some(id => !ids.has(id))) errors.push('missing-completion-id');
  return errors;
}
