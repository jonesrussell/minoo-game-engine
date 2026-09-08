import Ajv, { type ErrorObject } from 'ajv';
import presentationSchema from '../data/presentation.schema.json' with { type: 'json' };
import type { FordFrenzyGamePresentation as GamePresentation } from './presentation.generated.ts';
type PresentationDialogue = GamePresentation['dialogue'][number];

export type PresentationDiagnostic = {
  readonly code: 'PRESENTATION_STRUCTURE' | 'PRESENTATION_DUPLICATE_ID' | 'PRESENTATION_REFERENCE';
  readonly path: string;
  readonly message: string;
};
export type PresentationValidation = { readonly ok: true; readonly presentation: GamePresentation } | { readonly ok: false; readonly errors: readonly PresentationDiagnostic[] };

const ajv = new Ajv({ strict: true, allErrors: true, ownProperties: true, coerceTypes: false, useDefaults: false, removeAdditional: false });
const validateStructure = ajv.compile<GamePresentation>(presentationSchema);
const pointer = (error: ErrorObject): string => {
  const property = error.keyword === 'required' ? error.params.missingProperty : error.keyword === 'additionalProperties' ? error.params.additionalProperty : undefined;
  return error.instancePath + (typeof property === 'string' ? `/${property.replaceAll('~', '~0').replaceAll('/', '~1')}` : '');
};
const duplicateErrors = (records: readonly { id: string }[], path: string, errors: PresentationDiagnostic[]) => {
  const seen = new Map<string, number>();
  records.forEach((record, index) => {
    const previous = seen.get(record.id);
    if (previous !== undefined) errors.push({ code: 'PRESENTATION_DUPLICATE_ID', path: `${path}/${index}/id`, message: `ID "${record.id}" duplicates ${path}/${previous}/id.` });
    else seen.set(record.id, index);
  });
};

/** Validate immutable declarative data with the canonical schema, then check references. */
export function validatePresentation(input: unknown, objectIds?: readonly string[]): PresentationValidation {
  if (!validateStructure(input)) {
    return { ok: false, errors: (validateStructure.errors ?? []).map(error => ({
      code: 'PRESENTATION_STRUCTURE', path: pointer(error), message: `${pointer(error) || '/'} ${error.message ?? 'does not match the presentation schema'}.`,
    })) };
  }
  const presentation = input as GamePresentation;
  const errors: PresentationDiagnostic[] = [];
  duplicateErrors(presentation.assets, '/assets', errors);
  duplicateErrors(presentation.characters, '/characters', errors);
  duplicateErrors(presentation.dialogue, '/dialogue', errors);
  const assetIds = new Set(presentation.assets.map(asset => asset.id));
  const characterIds = new Set(presentation.characters.map(character => character.id));
  presentation.characters.forEach((character, index) => {
    if (!assetIds.has(character.assetId)) errors.push({ code: 'PRESENTATION_REFERENCE', path: `/characters/${index}/assetId`, message: `Asset "${character.assetId}" does not exist.` });
  });
  presentation.dialogue.forEach((beat, index) => {
    if (!characterIds.has(beat.speaker)) errors.push({ code: 'PRESENTATION_REFERENCE', path: `/dialogue/${index}/speaker`, message: `Character "${beat.speaker}" does not exist.` });
  });
  const targetIds = presentation.targetLabels.map(target => target.objectId);
  if (new Set(targetIds).size !== targetIds.length || targetIds.length !== presentation.mission.totalTargets) {
    errors.push({code:'PRESENTATION_REFERENCE',path:'/targetLabels',message:'Target labels must be unique and match the mission total.'});
  }
  if (objectIds && (objectIds.length !== targetIds.length || objectIds.some(id => !targetIds.includes(id)))) {
    errors.push({code:'PRESENTATION_REFERENCE',path:'/targetLabels',message:'Target labels must reference every scene object exactly once.'});
  }
  return errors.length ? { ok: false, errors } : { ok: true, presentation };
}

export type ConversationView = { readonly beat: PresentationDialogue; readonly index: number; readonly total: number };
export function conversationView(presentation: GamePresentation, index: number): ConversationView {
  if (!Number.isInteger(index) || index < 0 || index >= presentation.dialogue.length) throw new RangeError('Dialogue index is outside the presentation.');
  const beat = presentation.dialogue[index]!;
  return { beat, index, total: presentation.dialogue.length };
}

export function escapePresentationHtml(value: string): string {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]!));
}

export function renderConversation(presentation: GamePresentation, index: number, button: (id: string, text: string, primary?: boolean, disabled?: boolean) => string): string {
  const view = conversationView(presentation, index);
  const character = presentation.characters.find(candidate => candidate.id === view.beat.speaker)!;
  return `<div class="conversation-heading"><span>${escapePresentationHtml(presentation.mission.brand)}</span><span>${view.index + 1} / ${view.total}</span></div><div class="conversation-cast" aria-hidden="true">${presentation.characters.map(candidate => `<div class="character-slot ${escapePresentationHtml(candidate.id)} ${candidate.id === character.id ? 'speaking' : ''}"><img class="character-portrait" src="${escapePresentationHtml(presentation.assets.find(asset => asset.id === candidate.assetId)?.url ?? '')}" alt=""><span class="portrait-fallback" hidden>${escapePresentationHtml(candidate.name)}</span></div>`).join('')}</div><div class="conversation-strip"><div class="speaker-name">${escapePresentationHtml(character.name)}</div><p class="spoken-line" aria-live="polite">${escapePresentationHtml(view.beat.line)}</p><div class="dialogue-controls"><span class="line-count">${view.index + 1} / ${view.total}</span>${button('dialogue-back', 'Back', false, view.index === 0)}${button('dialogue-skip', 'Skip conversation')}${button('dialogue-next', view.index === view.total - 1 ? 'Find the kit' : 'Next', true)}</div></div>`;
}



