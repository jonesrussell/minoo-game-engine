import Ajv from 'ajv';
import type { ErrorObject } from 'ajv';
import sceneV2Schema from './contracts/scene-v2.schema.json' with { type: 'json' };
import type { SceneV2 } from './contracts/scene-v2.generated.d.ts';
import type { SceneDiagnostic } from './scene.ts';

export type { SceneV2, SceneObjectV2, InvestigativeContent, SourceRecord, EditorialMetadata, RightsMetadata, CompletionRuleV2 } from './contracts/scene-v2.generated.d.ts';
export { sceneV2Schema };

export type SceneV2Validation = { ok: true; scene: SceneV2 } | { ok: false; errors: SceneDiagnostic[] };

const ajv = new Ajv({ strict: true, allErrors: true, ownProperties: true, coerceTypes: false, useDefaults: false, removeAdditional: false });
const validateStructure = ajv.compile<SceneV2>(sceneV2Schema);
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
  const requirement = pointer === '/version' ? 'SCN-VERSION-002'
    : pointer.startsWith('/completion') ? 'SCN-COMPLETE-001'
    : pointer.startsWith('/objects') ? (/\/(x|y|width|height)$/.test(pointer) ? 'SCN-BOUNDS-001' : 'SCN-CONTENT-002')
    : pointer.startsWith('/contents') ? 'SCN-CONTENT-002'
    : pointer.startsWith('/sources') ? 'SCN-SOURCE-002'
    : pointer === '/id' ? 'SCN-IDENTITY-001'
    : /\/(width|height)$/.test(pointer) ? 'SCN-BOUNDS-001' : 'SCN-STRUCTURE-001';
  return {
    code: pointer === '/version' ? 'SCENE_VERSION' : 'SCENE_STRUCTURE', pointer, requirement,
    message: pointer === '/version' ? 'Declare supported scene version 2.'
      : `${pointer || '/'} ${error.message ?? 'does not match the scene-v2 schema'}.`,
  };
}

function actualDate(day: string): boolean {
  const date = new Date(day + 'T00:00:00Z');
  return Number.isFinite(date.valueOf()) && date.toISOString().slice(0, 10) === day;
}

/** Validate a version-2 investigative scene without rewriting input or inferring approval. */
export function validateSceneV2(input: unknown): SceneV2Validation {
  if (!validateStructure(input)) return { ok: false, errors: sorted((validateStructure.errors ?? []).map(structuralDiagnostic)) };
  const scene = input;
  const errors: SceneDiagnostic[] = [];
  const add = (code: SceneDiagnostic['code'], pointer: string, requirement: string, message: string) => errors.push({ code, pointer, requirement, message });
  function ids(records: readonly { id: string }[], collection: string, requirement: string) {
    const seen = new Map<string, number>();
    records.forEach((record, i) => {
      if (seen.has(record.id)) add('SCENE_DUPLICATE_ID', `/${collection}/${i}/id`, requirement, `ID "${record.id}" duplicates /${collection}/${seen.get(record.id)}/id; choose a unique ID.`);
      else seen.set(record.id, i);
    });
    return seen;
  }
  const objectIds = ids(scene.objects, 'objects', 'SCN-IDENTITY-001');
  const contentIds = ids(scene.contents, 'contents', 'SCN-CONTENT-002');
  const sourceIds = ids(scene.sources, 'sources', 'SCN-SOURCE-002');
  const clueIds = new Map<string, number>();
  scene.objects.forEach((object, i) => {
    if (object.x + object.width > scene.width) add('SCENE_BOUNDS', `/objects/${i}/width`, 'SCN-BOUNDS-001', `Object "${object.id}" extends past scene width ${scene.width}; reduce x or width.`);
    if (object.y + object.height > scene.height) add('SCENE_BOUNDS', `/objects/${i}/height`, 'SCN-BOUNDS-001', `Object "${object.id}" extends past scene height ${scene.height}; reduce y or height.`);
    if (!contentIds.has(object.contentId)) add('SCENE_REFERENCE', `/objects/${i}/contentId`, 'SCN-CONTENT-002', `Content "${object.contentId}" does not exist; add its record or correct the reference.`);
  });
  scene.completion.requiredIds.forEach((id, i) => {
    if (!objectIds.has(id)) add('SCENE_REFERENCE', `/completion/requiredIds/${i}`, 'SCN-COMPLETE-001', `Completion target "${id}" does not exist in objects.`);
  });
  scene.contents.forEach((content, i) => {
    if (clueIds.has(content.clueId)) add('SCENE_DUPLICATE_ID', `/contents/${i}/clueId`, 'SCN-CONTENT-002', `Clue ID "${content.clueId}" duplicates /contents/${clueIds.get(content.clueId)}/clueId; choose a unique clue ID.`);
    else clueIds.set(content.clueId, i);
    for (const field of ['label'] as const) if (!wellFormed(content[field])) add('SCENE_TEXT', `/contents/${i}/${field}`, 'SCN-CONTENT-002', 'Replace unpaired Unicode surrogates with valid text; validation never rewrites text.');
    content.sourceRefs.forEach((id, j) => {
      if (!sourceIds.has(id)) add('SCENE_REFERENCE', `/contents/${i}/sourceRefs/${j}`, 'SCN-SOURCE-002', `Source "${id}" does not exist; add its record or correct the reference.`);
    });
    for (const field of ['reviewedBy', 'notes'] as const) {
      const value = content.editorial[field];
      if (value !== undefined && !wellFormed(value)) add('SCENE_TEXT', `/contents/${i}/editorial/${field}`, 'SCN-CONTENT-002', 'Replace unpaired Unicode surrogates with valid text.');
    }
    for (const field of ['basis', 'attribution'] as const) {
      const value = content.rights[field];
      if (value !== undefined && !wellFormed(value)) add('SCENE_TEXT', `/contents/${i}/rights/${field}`, 'SCN-CONTENT-002', 'Replace unpaired Unicode surrogates with valid text.');
    }
    if (content.editorial.reviewedOn !== undefined && !actualDate(content.editorial.reviewedOn)) add('SCENE_REVIEW_DATE', `/contents/${i}/editorial/reviewedOn`, 'SCN-CONTENT-002', 'Use an actual calendar date in YYYY-MM-DD form.');
  });
  scene.sources.forEach((source, i) => {
    if (!actualDate(source.publishedOn)) add('SCENE_REVIEW_DATE', `/sources/${i}/publishedOn`, 'SCN-SOURCE-002', 'Use an actual calendar date in YYYY-MM-DD form.');
    for (const field of ['title', 'url'] as const) if (!wellFormed(source[field])) add('SCENE_TEXT', `/sources/${i}/${field}`, 'SCN-SOURCE-002', 'Replace unpaired Unicode surrogates with valid text.');
    try {
      const url = new URL(source.url);
      if ((url.protocol !== 'https:' && url.protocol !== 'http:') || !url.hostname) throw new Error();
    } catch {
      add('SCENE_STRUCTURE', `/sources/${i}/url`, 'SCN-SOURCE-002', 'Use an absolute HTTP or HTTPS source URL.');
    }
  });
  return errors.length ? { ok: false, errors: sorted(errors) } : { ok: true, scene };
}

export function parseSceneV2(json: string): SceneV2Validation {
  let input: unknown;
  try { input = JSON.parse(json); }
  catch { return { ok: false, errors: [{ code: 'SCENE_INVALID_JSON', pointer: '', requirement: 'SCN-STRUCTURE-001', message: 'Scene must be valid JSON; correct its syntax before validation.' }] }; }
  return validateSceneV2(input);
}
