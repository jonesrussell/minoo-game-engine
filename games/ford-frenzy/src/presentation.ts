import Ajv, { type ErrorObject } from "ajv";
import presentationSchema from "../data/presentation.schema.json" with { type: "json" };
import type { FordFrenzyGamePresentation as GamePresentation } from "./presentation.generated.ts";
type PresentationConversation = GamePresentation["conversations"][number];
type PresentationDialogue = PresentationConversation["beats"][number];

export type PresentationDiagnostic = {
  readonly code:
    | "PRESENTATION_STRUCTURE"
    | "PRESENTATION_DUPLICATE_ID"
    | "PRESENTATION_REFERENCE";
  readonly path: string;
  readonly message: string;
};
export type PresentationValidation =
  | { readonly ok: true; readonly presentation: GamePresentation }
  | { readonly ok: false; readonly errors: readonly PresentationDiagnostic[] };
const ajv = new Ajv({
  strict: true,
  allErrors: true,
  ownProperties: true,
  coerceTypes: false,
  useDefaults: false,
  removeAdditional: false,
});
const validateStructure = ajv.compile<GamePresentation>(presentationSchema);
const pointer = (error: ErrorObject): string => {
  const property =
    error.keyword === "required"
      ? error.params.missingProperty
      : error.keyword === "additionalProperties"
        ? error.params.additionalProperty
        : undefined;
  return (
    error.instancePath +
    (typeof property === "string"
      ? `/${property.replaceAll("~", "~0").replaceAll("/", "~1")}`
      : "")
  );
};
const duplicateErrors = (
  records: readonly { id: string }[],
  path: string,
  errors: PresentationDiagnostic[],
) => {
  const seen = new Map<string, number>();
  records.forEach((record, index) => {
    const previous = seen.get(record.id);
    if (previous !== undefined)
      errors.push({
        code: "PRESENTATION_DUPLICATE_ID",
        path: `${path}/${index}/id`,
        message: `ID "${record.id}" duplicates ${path}/${previous}/id.`,
      });
    else seen.set(record.id, index);
  });
};

export function validatePresentation(
  input: unknown,
  objectIds?: readonly string[],
): PresentationValidation {
  if (!validateStructure(input))
    return {
      ok: false,
      errors: (validateStructure.errors ?? []).map((error) => ({
        code: "PRESENTATION_STRUCTURE",
        path: pointer(error),
        message: `${pointer(error) || "/"} ${error.message ?? "does not match the presentation schema"}.`,
      })),
    };
  const presentation = input as GamePresentation;
  const errors: PresentationDiagnostic[] = [];
  duplicateErrors(presentation.assets, "/assets", errors);
  duplicateErrors(presentation.characters, "/characters", errors);
  duplicateErrors(presentation.conversations, "/conversations", errors);
  const assetIds = new Set(presentation.assets.map((asset) => asset.id));
  const characterIds = new Set(
    presentation.characters.map((character) => character.id),
  );
  const beatIds = new Set<string>();
  presentation.characters.forEach((character, index) => {
    if (!assetIds.has(character.assetId))
      errors.push({
        code: "PRESENTATION_REFERENCE",
        path: `/characters/${index}/assetId`,
        message: `Asset "${character.assetId}" does not exist.`,
      });
    for (const [expression, assetId] of Object.entries(character.expressions))
      if (!assetIds.has(assetId))
        errors.push({
          code: "PRESENTATION_REFERENCE",
          path: `/characters/${index}/expressions/${expression}`,
          message: `Asset "${assetId}" does not exist for expression "${expression}".`,
        });
  });
  presentation.conversations.forEach((conversation, conversationIndex) => {
    duplicateErrors(
      conversation.beats,
      `/conversations/${conversationIndex}/beats`,
      errors,
    );
    conversation.beats.forEach((beat, beatIndex) => {
      if (beatIds.has(beat.id))
        errors.push({
          code: "PRESENTATION_DUPLICATE_ID",
          path: `/conversations/${conversationIndex}/beats/${beatIndex}/id`,
          message: `Beat "${beat.id}" is duplicated.`,
        });
      else beatIds.add(beat.id);
      if (!characterIds.has(beat.speaker))
        errors.push({
          code: "PRESENTATION_REFERENCE",
          path: `/conversations/${conversationIndex}/beats/${beatIndex}/speaker`,
          message: `Character "${beat.speaker}" does not exist.`,
        });
    });
  });
  const targetIds = presentation.targetLabels.map((target) => target.objectId);
  if (
    new Set(targetIds).size !== targetIds.length ||
    targetIds.length !== presentation.mission.totalTargets
  )
    errors.push({
      code: "PRESENTATION_REFERENCE",
      path: "/targetLabels",
      message: "Target labels must be unique and match the mission total.",
    });
  if (
    objectIds &&
    (objectIds.length !== targetIds.length ||
      objectIds.some((id) => !targetIds.includes(id)))
  )
    errors.push({
      code: "PRESENTATION_REFERENCE",
      path: "/targetLabels",
      message: "Target labels must reference every scene object exactly once.",
    });
  return errors.length ? { ok: false, errors } : { ok: true, presentation };
}

export type DialogueReturn = "search" | "receipt" | "previous-screen";
export type DialogueState = {
  readonly conversationId: string;
  readonly index: number;
  readonly returnTo: DialogueReturn;
  readonly replay: boolean;
};
export type ConversationView = {
  readonly conversationId: string;
  readonly beat: PresentationDialogue;
  readonly index: number;
  readonly total: number;
  readonly returnTo: DialogueReturn;
  readonly replay: boolean;
};
function conversation(
  presentation: GamePresentation,
  id: string,
): PresentationConversation {
  const found = presentation.conversations.find(
    (candidate) => candidate.id === id,
  );
  if (!found) throw new RangeError(`Unknown conversation "${id}".`);
  return found;
}
export function conversationView(
  presentation: GamePresentation,
  conversationId: string,
  index: number,
  returnTo: DialogueReturn = "search",
  replay = false,
): ConversationView {
  const selected = conversation(presentation, conversationId);
  if (!Number.isInteger(index) || index < 0 || index >= selected.beats.length)
    throw new RangeError("Dialogue index is outside the presentation.");
  return {
    conversationId,
    beat: selected.beats[index]!,
    index,
    total: selected.beats.length,
    returnTo,
    replay,
  };
}
export function createDialogueController(
  presentation: GamePresentation,
  conversationId: string,
  returnTo: DialogueReturn,
  replay = false,
) {
  let state: DialogueState = { conversationId, index: 0, returnTo, replay };
  const view = () =>
    conversationView(
      presentation,
      state.conversationId,
      state.index,
      state.returnTo,
      state.replay,
    );
  return {
    getState: (): DialogueState => state,
    view,
    next: () => {
      const current = conversation(presentation, state.conversationId);
      if (state.index < current.beats.length - 1) {
        state = { ...state, index: state.index + 1 };
        return { done: false as const, view: view() };
      }
      return { done: true as const, returnTo: state.returnTo };
    },
    back: () => {
      state = { ...state, index: Math.max(0, state.index - 1) };
      return view();
    },
    skip: () => ({ done: true as const, returnTo: state.returnTo }),
  };
}

export function escapePresentationHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ]!,
  );
}
export function renderConversation(
  presentation: GamePresentation,
  conversationId: string,
  index: number,
  button: (
    id: string,
    text: string,
    primary?: boolean,
    disabled?: boolean,
  ) => string,
  returnTo: DialogueReturn = "search",
  replay = false,
): string {
  const view = conversationView(
    presentation,
    conversationId,
    index,
    returnTo,
    replay,
  );
  const character = presentation.characters.find(
    (candidate) => candidate.id === view.beat.speaker,
  )!;
  const expression = view.beat.expression;
  const conversationTitle = conversation(presentation, conversationId).title;
  return `<div class="conversation-heading"><span>${escapePresentationHtml(presentation.mission.brand)}</span><span>${escapePresentationHtml(conversationTitle)} · ${view.index + 1} / ${view.total}</span></div><div class="conversation-cast" aria-hidden="true">${presentation.characters
    .map((candidate) => {
      const neutralId = candidate.expressions.neutral;
      const requestedId =
        candidate.id === character.id
          ? (candidate.expressions[expression] ?? neutralId)
          : neutralId;
      const requested = presentation.assets.find(
        (asset) => asset.id === requestedId,
      );
      const neutral = presentation.assets.find(
        (asset) => asset.id === neutralId,
      );
      const displayedExpression =
        candidate.id === character.id ? expression : "neutral";
      return `<div class="character-slot ${escapePresentationHtml(candidate.id)} ${candidate.id === character.id ? "speaking" : ""}"><img class="character-portrait" data-expression="${displayedExpression}" data-neutral-src="${escapePresentationHtml(neutral?.url ?? "")}" src="${escapePresentationHtml(requested?.url ?? neutral?.url ?? "")}" alt=""><span class="portrait-fallback" hidden>${escapePresentationHtml(candidate.name)}</span></div>`;
    })
    .join(
      "",
    )}</div><div class="conversation-strip"><div class="speaker-name">${escapePresentationHtml(character.name)}</div><p class="spoken-line" aria-live="polite">${escapePresentationHtml(view.beat.line)}</p><div class="dialogue-controls"><span class="line-count">${view.index + 1} / ${view.total}</span>${button("dialogue-back", "Back", false, view.index === 0)}${button("dialogue-skip", "Skip conversation")}${button("dialogue-next", view.index === view.total - 1 ? "Continue" : "Next", true)}</div></div>`;
}
