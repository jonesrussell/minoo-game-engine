import type { SceneV2 } from '@minoo/engine/scene-v2';
import type { NewsroomState, NewsroomStepResult } from './session.ts';
import type { FordFrenzyGamePresentation as GamePresentation } from './presentation.generated.ts';

export type HudButton = (id: string, text: string, primary?: boolean, disabled?: boolean) => string;

/** Render the compact mission HUD from accepted state and declarative mission data. */
export function renderHud(presentation: GamePresentation, scene: SceneV2, state: NewsroomState, button: HudButton): string {
  const total = presentation.mission.totalTargets;
  const targets = scene.contents.map(content => {
    const object = scene.objects.find(candidate => candidate.contentId === content.id);
    const found = object ? state.foundIds.includes(object.id) : false;
    const label = presentation.targetLabels.find(target => target.objectId === object?.id)?.label ?? content.label;
    return `<span class="${found ? 'found' : ''}" data-object-id="${object?.id ?? ''}">${escapeHtml(label)}</span>`;
  }).join('');
  return `<div class="hud-row"><div class="objective"><div class="eyebrow">${escapeHtml(presentation.mission.eyebrow)}</div><strong>${escapeHtml(presentation.mission.title)}</strong></div><span class="big-number">${state.foundIds.length}<small> / ${total}</small></span>${button('hint', `Hint • ${state.hintBudget - state.hintsUsed} left`, false, state.hintsUsed >= state.hintBudget || state.searchCompleted)}${button('notebook', 'Your notes')}${button('file-draft', 'File it', true, !state.searchCompleted)}${button('pause', 'Pause')}</div><p class="target-names">${targets}</p><p id="feedback" class="feedback" role="status">${escapeHtml(state.lastMessage)}</p><div class="keyboard-tools">${button('keyboard-search', 'Search with keyboard')}<span id="search-help">Arrows move · Shift + arrows for fine movement · Enter inspects · Tab leaves the scene</span></div><p id="search-location" class="search-location" role="status" aria-live="polite"></p>`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]!));
}

export type PresentationReaction =
  | { readonly type: 'sound'; readonly cue: 'find' | 'wrong' | 'ready' | 'complete' }
  | { readonly type: 'status'; readonly key: 'duplicate' | 'hint' | 'reset' };

/** Map accepted session events to optional presentation effects. Rejected steps emit none. */
export function reactionsForTransition(before: NewsroomState, result: NewsroomStepResult): readonly PresentationReaction[] {
  if (!result.ok) return [];
  const reactions: PresentationReaction[] = [];
  for (const event of result.events) {
    if (event.type === 'k01-awarded') reactions.push({ type: 'sound', cue: 'complete' });
    else if (event.type === 'found') reactions.push({ type: 'sound', cue: 'find' });
    else if (event.type === 'source-checked') reactions.push({ type: 'sound', cue: 'ready' });
    else if (event.type === 'recorder-paired' && before.chargerPaired !== result.state.chargerPaired) reactions.push({ type: 'sound', cue: event.connector === 'recorder' ? 'ready' : 'wrong' });
    else if (event.type === 'editorial-retry') reactions.push({ type: 'sound', cue: 'wrong' });
    else if (event.type === 'duplicate') reactions.push({ type: 'status', key: 'duplicate' });
    else if (event.type === 'hint') reactions.push({ type: 'status', key: 'hint' });
    else if (event.type === 'scene-reset' || event.type === 'session-reset' || event.type === 'reset') reactions.push({ type: 'status', key: 'reset' });
  }
  if (before.k01Awarded && result.state.k01Awarded && reactions.length === 0) return [];
  return reactions;
}
