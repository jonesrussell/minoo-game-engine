import Ajv from 'ajv';
import type { ErrorObject } from 'ajv';
import sceneSchema from './contracts/scene.schema.json' with { type: 'json' };
import type { Scene } from './contracts/scene.generated.d.ts';

export type { Scene, SceneObject, VocabularyRecord, ContentApproval, CompletionRule } from './contracts/scene.generated.d.ts';
export { sceneSchema };

export interface SceneDiagnostic {
  code: 'SCENE_INVALID_JSON' | 'SCENE_STRUCTURE' | 'SCENE_VERSION' | 'SCENE_DUPLICATE_ID' | 'SCENE_BOUNDS' | 'SCENE_REFERENCE' | 'SCENE_REVIEW_DATE' | 'SCENE_TEXT';
  pointer: string;
  requirement: string;
  message: string;
}
export type SceneValidation = { ok: true; scene: Scene } | { ok: false; errors: SceneDiagnostic[] };

// Only compile the bundled trusted schema. No remote lookup, custom keywords,
// coercion, defaults or removal of unknown data.
const ajv = new Ajv({ strict: true, allErrors: true, ownProperties: true, coerceTypes: false, useDefaults: false, removeAdditional: false });
const validateStructure = ajv.compile<Scene>(sceneSchema);
const escapePointer = (value: string) => value.replaceAll('~', '~0').replaceAll('/', '~1');
const sorted = (errors: SceneDiagnostic[]) => errors.sort((a, b) => {
  const left = a.pointer + '\0' + a.code + '\0' + a.message;
  const right = b.pointer + '\0' + b.code + '\0' + b.message;
  return left < right ? -1 : left > right ? 1 : 0;
});
function wellFormed(value: string): boolean {
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = value.charCodeAt(++i);
      if (!(next >= 0xdc00 && next <= 0xdfff)) return false;
    } else if (code >= 0xdc00 && code <= 0xdfff) return false;
  }
  return true;
}

function structuralDiagnostic(error: ErrorObject): SceneDiagnostic {
  const property = error.keyword === 'required' ? error.params.missingProperty
    : error.keyword === 'additionalProperties' ? error.params.additionalProperty : undefined;
  const pointer = error.instancePath + (typeof property === 'string' ? '/' + escapePointer(property) : '');
  const requirement = pointer === '/version' ? 'SCN-VERSION-001'
    : pointer.startsWith('/completion') ? 'SCN-COMPLETE-001'
    : pointer.startsWith('/vocabulary') || pointer.endsWith('/vocabularyId') ? 'SCN-VOCAB-001'
    : pointer === '/id' || pointer.endsWith('/id') ? 'SCN-IDENTITY-001'
    : /\/(x|y|width|height)$/.test(pointer) ? 'SCN-BOUNDS-001' : 'SCN-STRUCTURE-001';
  return {
    code: pointer === '/version' ? 'SCENE_VERSION' : 'SCENE_STRUCTURE', pointer, requirement,
    message: pointer === '/version' ? 'Declare supported scene version 1.'
      : `${pointer || '/'} ${error.message ?? 'does not match the scene schema'}.`,
  };
}

/** Validate without rewriting input. Success is not content-release approval. */
export function validateScene(input: unknown): SceneValidation {
  if (!validateStructure(input)) return { ok: false, errors: sorted((validateStructure.errors ?? []).map(structuralDiagnostic)) };
  const scene = input;
  const errors: SceneDiagnostic[] = [];
  const add = (code: SceneDiagnostic['code'], pointer: string, requirement: string, message: string) => errors.push({ code, pointer, requirement, message });
  function ids(records: readonly { id: string }[], collection: string, requirement: string) {
    const seen = new Map<string, number>();
    records.forEach((record, i) => {
      if (seen.has(record.id)) add('SCENE_DUPLICATE_ID', `/${collection}/${i}/id`, requirement,
        `ID "${record.id}" duplicates /${collection}/${seen.get(record.id)}/id; choose a unique ID.`);
      else seen.set(record.id, i);
    });
    return seen;
  }
  const objectIds = ids(scene.objects, 'objects', 'SCN-IDENTITY-001');
  const vocabularyIds = ids(scene.vocabulary, 'vocabulary', 'SCN-VOCAB-001');
  scene.objects.forEach((object, i) => {
    if (object.x + object.width > scene.width) add('SCENE_BOUNDS', `/objects/${i}/width`, 'SCN-BOUNDS-001', `Object "${object.id}" extends past scene width ${scene.width}; reduce x or width.`);
    if (object.y + object.height > scene.height) add('SCENE_BOUNDS', `/objects/${i}/height`, 'SCN-BOUNDS-001', `Object "${object.id}" extends past scene height ${scene.height}; reduce y or height.`);
    if (!vocabularyIds.has(object.vocabularyId)) add('SCENE_REFERENCE', `/objects/${i}/vocabularyId`, 'SCN-VOCAB-001', `Vocabulary "${object.vocabularyId}" does not exist; add its record or correct the reference.`);
  });
  scene.completion.requiredIds.forEach((id, i) => {
    if (!objectIds.has(id)) add('SCENE_REFERENCE', `/completion/requiredIds/${i}`, 'SCN-COMPLETE-001', `Completion target "${id}" does not exist in objects.`);
  });
  scene.vocabulary.forEach((record, i) => {
    for (const field of ['text', 'meaning', 'dialect', 'source', 'attribution', 'permittedUse'] as const) {
      if (!wellFormed(record[field])) add('SCENE_TEXT', `/vocabulary/${i}/${field}`, 'SCN-VOCAB-001', 'Replace unpaired Unicode surrogates with valid text; validation never rewrites spelling.');
    }
    if (record.approval.reviewedBy !== undefined && !wellFormed(record.approval.reviewedBy)) {
      add('SCENE_TEXT', `/vocabulary/${i}/approval/reviewedBy`, 'SCN-VOCAB-001', 'Reviewer text contains an unpaired Unicode surrogate.');
    }
    const day = record.approval.reviewedOn;
    if (day !== undefined) {
      const date = new Date(day + 'T00:00:00Z');
      if (!Number.isFinite(date.valueOf()) || date.toISOString().slice(0, 10) !== day) {
        add('SCENE_REVIEW_DATE', `/vocabulary/${i}/approval/reviewedOn`, 'SCN-VOCAB-001', 'Use an actual calendar date in YYYY-MM-DD form.');
      }
    }
  });
  return errors.length ? { ok: false, errors: sorted(errors) } : { ok: true, scene };
}

export function parseScene(json: string): SceneValidation {
  let input: unknown;
  try { input = JSON.parse(json); }
  catch { return { ok: false, errors: [{ code: 'SCENE_INVALID_JSON', pointer: '', requirement: 'SCN-STRUCTURE-001', message: 'Scene must be valid JSON; correct its syntax before validation.' }] }; }
  return validateScene(input);
}
