import './styles.css';
import './layouts.css';
import { createSceneRenderer, type SceneRenderer } from '@minoo/engine/browser';
import { validateSceneV2, type SceneV2 } from '@minoo/engine/scene-v2';
import { createEpisodeSession, restoreEpisodeSession, type EpisodeAction, type EpisodeSceneId, type EpisodeState, type EpisodeSession } from './episode.ts';
import s01SceneData from '../data/s01.json';
import s02SceneData from '../data/s02.json';
import clipping from '../data/s01-clipping.json';
import { createGameAudio } from './audio.ts';
import { renderHud, reactionsForTransition } from './hud.ts';
import s01PresentationData from '../data/s01-presentation.json';
import s02PresentationData from '../data/s02-presentation.json';
import { createDialogueController, renderConversation, validatePresentation } from './presentation.ts';
import type { FordFrenzyGamePresentation as GamePresentation } from './presentation.generated.ts';

const audio = createGameAudio();
const s01PresentationValidation = validatePresentation(s01PresentationData, s01SceneData.objects.map(object => object.id));
if (!s01PresentationValidation.ok) throw Error(`Invalid bundled S01 presentation: ${s01PresentationValidation.errors.map(error => error.message).join(' ')}`);
const s02PresentationValidation = validatePresentation(s02PresentationData, s02SceneData.objects.map(object => object.id));
if (!s02PresentationValidation.ok) throw Error(`Invalid bundled S02 presentation: ${s02PresentationValidation.errors.map(error => error.message).join(' ')}`);
const s01Presentation = s01PresentationValidation.presentation;
const s02Presentation = s02PresentationValidation.presentation;

const s01Validation = validateSceneV2(s01SceneData);
if (!s01Validation.ok) throw Error('Invalid bundled S01 scene');
const s01Scene = s01Validation.scene;
const s02Validation = validateSceneV2(s02SceneData);
if (!s02Validation.ok) throw Error('Invalid bundled S02 scene');
const s02Scene = s02Validation.scene;

function sceneFor(id: EpisodeSceneId): SceneV2 { return id === 'S02' ? s02Scene : s01Scene; }
function presentationFor(id: EpisodeSceneId): GamePresentation { return id === 'S02' ? s02Presentation : s01Presentation; }
const FILE_LABEL: Record<EpisodeSceneId, string> = { S01: 'File it', S02: 'File the timeline', S03: 'File it' };

const stage = document.querySelector<HTMLElement>('#stage')!;
const hud = document.querySelector<HTMLElement>('#hud')!;
const overlay = document.querySelector<HTMLElement>('#overlay')!;
const saveStatus = document.querySelector<HTMLElement>('#save-status')!;
// New episode save key (#98/#154); the prior S01-only key is read-only and imported explicitly, never overwritten.
const EPISODE_SAVE = 'ford-frenzy.episode.save.v1';
const LEGACY_S01_SAVE = 'ford-frenzy.s01.save.v1';
// PixiJS does not support a second live Application in one page after disposing the first (a shared
// GPU/texture resource is torn down with it), so cross-scene renderer swaps reload into a clean page
// rather than dispose+rebuild in place. This flag carries which scene's opening conversation to resume.
const TRANSITION_FLAG = 'ford-frenzy.pending-scene-opening';
let session: EpisodeSession = createEpisodeSession();
let renderer: SceneRenderer | undefined;
let rendererSceneId: EpisodeSceneId = 'S01';
let mode = 'loading';
let manifest: unknown;
let inputMethod: 'pointer' | 'keyboard' = 'pointer';
let reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let saveExists = false;
let badSave = false;
let memoryOnly = false;
let originFocusId = 'notebook';
let titleFocusId = 'new-game';
let loading = false;
let conversationEscape: (() => void) | undefined;
const searchCursor = {x:960,y:540};
stage.tabIndex = 0;
stage.setAttribute('role','application');
stage.setAttribute('aria-label','Search the newsroom');
stage.setAttribute('aria-describedby','search-help search-location');
const escapeHtml = (s: string) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const button = (id: string, text: string, primary = false, disabled = false) => `<button id="${id}" ${primary ? 'class="primary"' : ''} ${disabled ? 'disabled' : ''}>${text}</button>`;
const bind = (id: string, action: () => void) => document.getElementById(id)?.addEventListener('click', () => { void audio.unlock(); action(); });

try {
  const raw = localStorage.getItem(EPISODE_SAVE);
  if (raw) {
    const restored = restoreEpisodeSession(JSON.parse(raw));
    if (restored.ok) { session = restored.session; saveExists = true; }
    else badSave = true;
  } else {
    // Explicit validated import of a public pre-episode S01 v1 save; the legacy key is never written to or cleared here.
    const legacyRaw = localStorage.getItem(LEGACY_S01_SAVE);
    if (legacyRaw) {
      try {
        const attempt = createEpisodeSession();
        const imported = attempt.step({ type: 'import-s01-save', save: JSON.parse(legacyRaw) });
        if (imported.ok) { session = attempt; saveExists = true; } else badSave = true;
      } catch { badSave = true; }
    }
  }
} catch { badSave = true; }
try { localStorage.setItem('ford-frenzy.storage-probe', '1'); localStorage.removeItem('ford-frenzy.storage-probe'); }
catch { memoryOnly = true; }
function persist() {
  if (memoryOnly) { saveStatus.textContent = 'Temporary play • keep this tab open'; return; }
  try { localStorage.setItem(EPISODE_SAVE, JSON.stringify(session.exportSave())); saveExists = true; badSave = false; saveStatus.textContent = 'Saved on this device'; }
  catch { memoryOnly = true; saveStatus.textContent = 'Save failed • keep this tab open; reloading returns to the last saved point'; }
}
function sceneProgress(id: EpisodeSceneId, state: EpisodeState) { return id === 'S02' ? state.s02 : id === 'S03' ? state.s03 : state.s01; }
function activeSceneComplete(state: EpisodeState): boolean {
  if (state.currentScene === 'S02') return state.s02.k02Awarded;
  if (state.currentScene === 'S03') return state.s03.k03Awarded;
  return state.s01.k01Awarded;
}
function backdropUrl(id: EpisodeSceneId): string {
  const assets = (manifest as { assets?: { id: string; url: string }[] } | undefined)?.assets ?? [];
  return assets.find(asset => asset.id === (id === 'S02' ? 'S02.BG01' : 'S01.BG01'))?.url ?? './assets/background.png';
}
function panel(next: string, body: string, title = false) {
  if (mode === 'playing') originFocusId = document.activeElement?.id || 'notebook';
  if (mode === 'title') titleFocusId = document.activeElement?.id || 'new-game';
  if (next !== 'conversation') conversationEscape = undefined;
  mode = next;
  audio.setPaused(['paused','title','loading','error'].includes(next));
  document.getElementById('app')!.dataset.screen = next;
  stage.inert = true;
  hideSearchCursor();
  renderer?.setPaused(true);
  overlay.innerHTML = `<section role="dialog" aria-modal="true" aria-label="${next}" class="panel ${title ? 'title-panel' : ''}">${body}</section>`;
  overlay.querySelector<HTMLElement>('button, a, input')?.focus();
}
function title() {
  panel('title', `<img class="title-art" src="./assets/title-newsroom.png" alt=""><div class="title-shade" aria-hidden="true"></div><div class="title-content"><div class="issue-stamp">TORONTO, 2013 <span>THE CITY'S GONE SIDEWAYS.</span></div><div class="eyebrow">A Toronna Haps story</div><h1><span>FORD</span><span>FRENZY</span></h1><div class="nation-stamp">WELCOME TO CRACK NATION</div><p class="edition-card">The world's watching.<br>You're just trying to get paid.</p><nav class="title-menu" aria-label="Main menu">${button('new-game','Hit the streets',true)}${button('continue','Back on the beat',false,!saveExists && !session.getActions().length)}${button('settings','Options')}${button('credits','The usual suspects')}</nav><p class="byline">jr42 productions <span>presents</span></p>${badSave ? '<p class="save-warning">Your earlier save is incompatible. It stays untouched until you confirm a new game.</p>' : ''}</div><div class="city-slug" aria-hidden="true"><span>ONE CITY.</span><span>NO CHILL.</span></div>` , true);
  bind('new-game', () => {
    if (!renderer) { void boot(); return; }
    if (saveExists || badSave || session.getActions().length) confirmNew();
    else newGame();
  });
  bind('continue', () => { if (!renderer) void boot(); else play(); });
  bind('settings', settings);
  bind('credits', credits);
  hud.innerHTML = '<span class="eyebrow">May 17, 2013</span><p>Welcome to the Haps. The coffee is ancient. The news is not.</p>';
  saveStatus.textContent = memoryOnly ? 'Temporary play • keep this tab open' : saveExists ? 'Saved game available' : 'Local play • no account needed';
  document.getElementById(titleFocusId)?.focus();
}
function confirmNew() {
  panel('confirm', `<h2>Fresh notebook?</h2><p>Starting over replaces your saved assignment. Your display setting stays as it is.</p><div class="buttons">${button('confirm-new','Start over',true)}${button('cancel-new','Keep my progress')}</div>`);
  bind('confirm-new', newGame); bind('cancel-new', title);
}
async function buildRenderer(sceneId: EpisodeSceneId): Promise<SceneRenderer> {
  if (!manifest) throw new Error('Asset manifest is unavailable.');
  if (sceneId === 'S02') {
    return createSceneRenderer({ host: stage, scene: s02Scene, manifest, backgroundId: 'S02.BG01', reducedMotion, onSelect: id => { if (mode === 'playing') act({ type: 'select', objectId: id }); } });
  }
  const calendar = s01Scene.objects.find(object => object.id === 'S01.O3')!;
  return createSceneRenderer({ host: stage, scene: s01Scene, manifest, backgroundId: 'S01.BG01', objectLighting: { tint: 0xded3b8, shadow: true }, reducedMotion, onSelect: id => { if (mode === 'playing') act({ type: 'select', objectId: id }); }, labels: [{ text: 'MAY 2013', x: calendar.x+calendar.width*.22, y: calendar.y+calendar.height*.27, fontSize: 12, color: 0x302c25 }, { text: 'Su Mo Tu We Th Fr Sa\n          1  2  3  4\n 5  6  7  8  9 10 11\n12 13 14 15 16 17 18\n19 20 21 22 23 24 25\n26 27 28 29 30 31', x: calendar.x+calendar.width*.22, y: calendar.y+calendar.height*.38, fontSize: 5.5, color: 0x302c25 }, { text: 'PATIO??', x: calendar.x+calendar.width*.22, y: calendar.y+calendar.height*.75, fontSize: 10, color: 0x8b3529 }] });
}
function newGame() {
  session = createEpisodeSession(); badSave = false; persist();
  if (rendererSceneId === 'S01') { openingDialogue('S01'); return; }
  // Resetting away from a live S02 renderer hits the same cross-Application PixiJS limitation as
  // the S01->S02 transition below; reload into a clean page instead of an in-page renderer swap.
  try { localStorage.setItem(TRANSITION_FLAG, 'S01'); } catch { /* best effort; falls back to title + New Game */ }
  location.reload();
}
function showConversation(presentation: GamePresentation, conversationId: string, returnTo: 'search' | 'receipt' | 'previous-screen', onDone: () => void, index = 0) {
  const controller = createDialogueController(presentation, conversationId, returnTo, returnTo === 'previous-screen');
  const finish = () => { if (conversationEscape === finish) conversationEscape = undefined; onDone(); };
  conversationEscape = finish;
  for (let i = 0; i < index; i++) controller.next();
  const render = (focus = true) => {
    const current = controller.view();
    panel('conversation', `<img class="conversation-backdrop" src="${escapeHtml(backdropUrl(rendererSceneId))}" alt="">${renderConversation(presentation, conversationId, current.index, button, returnTo, returnTo === 'previous-screen')}`);
    overlay.querySelector('.panel')!.classList.add('conversation-panel');
    for (const portrait of overlay.querySelectorAll<HTMLImageElement>('.character-portrait')) {
      let retriedNeutral = false;
      let settled = false;
      const fallback = () => {
        if (settled) return;
        if (!retriedNeutral && portrait.dataset.expression !== 'neutral' && portrait.dataset.neutralSrc) {
          retriedNeutral = true;
          portrait.dataset.expression = 'neutral';
          portrait.src = portrait.dataset.neutralSrc;
          return;
        }
        settled = true;
        portrait.hidden = true;
        (portrait.nextElementSibling as HTMLElement).hidden = false;
      };
      portrait.addEventListener('load', () => { if (portrait.naturalWidth > 0) settled = true; });
      portrait.addEventListener('error', fallback);
      if (portrait.complete) { if (portrait.naturalWidth > 0) settled = true; else fallback(); }
    }
    bind('dialogue-next', () => { const next = controller.next(); if (next.done) finish(); else render(); });
    bind('dialogue-back', () => { controller.back(); render(); });
    bind('dialogue-skip', finish);
    if (focus) document.getElementById('dialogue-next')?.focus();
  };
  render();
}
function openingDialogue(sceneId: EpisodeSceneId, index = 0) { showConversation(presentationFor(sceneId), sceneId === 'S02' ? 's02-opening' : 's01-opening', 'search', play, index); }
function closingDialogue(sceneId: EpisodeSceneId) { showConversation(presentationFor(sceneId), sceneId === 'S02' ? 's02-closing' : 's01-closing', 'receipt', () => sceneResult(sceneId), 0); }
function play() {
  const state = session.getState();
  if (activeSceneComplete(state)) { sceneResult(state.currentScene); return; }
  conversationEscape = undefined;
  audio.setPaused(false);
  mode = 'playing'; document.getElementById('app')!.dataset.screen = 'playing'; stage.inert = false; overlay.innerHTML = ''; renderer?.setPaused(false); update();
  (document.getElementById(originFocusId) ?? document.getElementById('notebook'))?.focus();
}
function act(action: EpisodeAction) {
  const result = session.step(action);
  if (!result.ok) { const message = result.errors.map(e => e.message).join(' '); document.querySelector('#feedback')!.textContent = message; return; }
  persist(); update();
  for (const reaction of reactionsForTransition(result)) {
    if (reaction.type === 'sound') audio.play(reaction.cue);
  }
  if (result.events.some(event => event.type === 'k01-awarded')) { closingDialogue('S01'); return; }
  if (result.events.some(event => event.type === 'k02-awarded')) { closingDialogue('S02'); return; }
  if (action.type === 'select') {
    const label = presentationFor(result.state.currentScene).targetLabels.find(target => target.objectId === action.objectId);
    if (label?.inspection === 'inspect') inspect(result.state.currentScene, action.objectId);
  }
}
function update() {
  const state = session.getState();
  const id = state.currentScene;
  const progress = sceneProgress(id, state);
  renderer?.setView({foundIds: progress.foundIds, hintedObjectId: progress.hintedObjectId});
  const focusedId = document.activeElement?.id;
  hud.innerHTML = renderHud(presentationFor(id), sceneFor(id), progress, state.lastMessage, FILE_LABEL[id], button);
  bind('hint',()=>act({type:'hint'})); bind('notebook',notebook); bind('pause',pause);
  bind('file-draft', id === 'S02' ? timelinePanel : submit);
  bind('keyboard-search',()=>{ inputMethod='keyboard'; stage.focus(); describeSearch(); });
  if (focusedId) document.getElementById(focusedId)?.focus();
  if(document.activeElement===stage) describeSearch();
}
const NOTES: Record<string,string> = {
  'S01.O1': 'Three blank pages. One phone number. Forty-seven doodles of the editor as a raccoon. Ready for journalism.',
  'S01.O2': 'A contact sheet with actual Toronto on it. An unusually strong start for this office.',
  'S01.O3': 'May 2013. Someone wrote PATIO?? in enormous letters. Someone else cancelled happiness.',
  'S01.O4': 'The assignment is real. The sticky-note rumour is office chatter. The editor has underlined this twice.',
  'S01.O5': 'The story everyone is talking about. Someone printed it, lost it, and blamed the printer. Classic Haps.',
  'S01.O6': 'The recorder is dead. The editor suggests shouting everything from memory. You should probably find the right connector.',
  'S02.O1': 'Page one of the press kit, stuck sideways. Toner emergency confirmed.',
  'S02.O2': 'Page two: the May 17 public schedule. Nothing here is dated November.',
  'S02.O3': 'A May 17 denial summary, filed where anyone can read it. Worth placing on the timeline.',
  'S02.O4': '"Mayor\'s office — public." Someone labelled the obvious, loudly.',
  'S02.O5': 'A visitor bell nobody rings. City Hall runs on patience instead.',
  'S02.O6': 'A May 16 reporting summary, the first public account. Also worth placing on the timeline.',
};
function inspect(sceneId: EpisodeSceneId, id: string) {
  const scn = sceneFor(sceneId);
  const content = scn.contents.find(c=>c.id===scn.objects.find(o=>o.id===id)!.contentId)!;
  const assetUrl = (manifest as { assets?: { id: string; url: string }[] } | undefined)?.assets?.find(asset => asset.id === id)?.url ?? `./assets/${id}.png`;
  const extra = id==='S01.O5' ? button('source','Read the clipping',true)
    : id==='S01.O6' ? button('recorder','Sort out the recorder',true)
    : (sceneId==='S02' && (id==='S02.O3' || id==='S02.O6')) ? button('timeline','Build the timeline',true)
    : '';
  panel('inspect', `<div class="eyebrow">Bagged it. / Added to your notes</div><div class="find-detail"><img src="${escapeHtml(assetUrl)}" alt=""><div><h2>${escapeHtml(content.label)}</h2><p>${NOTES[id] ?? ''}</p></div></div><div class="buttons">${extra}${button('back-search','Back to the mess')}</div>`);
  bind('back-search',play); bind('source',sourceCheck); bind('recorder',recorderPuzzle); bind('timeline',timelinePanel);
}
function sourceCheck() {
  const checked = session.getState().s01.sourceChecks.includes('S01.C5');
  panel('source', `<article class="clipping"><div class="paper-name">${escapeHtml(clipping.publication)}</div><p class="paper-tagline">${escapeHtml(clipping.tagline)}</p><p class="paper-date">${escapeHtml(clipping.date)} · ${escapeHtml(clipping.byline)}</p><h2>${escapeHtml(clipping.headline)}</h2>${clipping.paragraphs.map(text=>`<p>${escapeHtml(text)}</p>`).join('')}</article><h3>What can we put in our notes?</h3><div class="buttons">${button('reading-report','The Howler reports seeing a video',true,checked)}${button('reading-proof','The allegation is proven',false,checked)}</div><p id="reading-feedback" role="status">${checked?'Clipping checked. We have a lead to follow.':'The editor: “Read the thing before we get matching lawsuits.”'}</p><div class="buttons">${button('back-search','Back to the mess')}</div>`);
  for (const reading of ['reported-account','proven-claim'] as const) bind(reading==='reported-account'?'reading-report':'reading-proof',()=>{
    act({type:'check-source',contentId:'S01.C5',reading});
    if (session.getState().s01.sourceChecks.includes('S01.C5')) sourceCheck();
    else document.getElementById('reading-feedback')!.textContent=session.getState().lastMessage;
  });
  bind('back-search',play);
}
function recorderPuzzle() {
  const ready=session.getState().s01.chargerPaired==='recorder';
  const plug=(kind:'phone'|'recorder')=>`<svg viewBox="0 0 160 90" aria-hidden="true"><path d="M80 90V65" stroke="#292d2c" stroke-width="20"/><path d="${kind==='recorder'?'M30 15H130L142 55L122 68H38L18 55Z':'M30 15H130Q142 15 142 28V55Q142 68 130 68H30Q18 68 18 55V28Q18 15 30 15Z'}" fill="#848b85" stroke="#202b2b" stroke-width="5"/>${Array.from({length:kind==='recorder'?5:4},(_,i)=>`<rect x="${43+i*(kind==='recorder'?16:21)}" y="30" width="10" height="23" fill="#d3aa54"/>`).join('')}</svg>`;
  panel('recorder', `<div class="eyebrow">Equipment desk / Match the connector</div><h2>One job. Two cables.</h2><p>Elliot's filing system: one drawer, every cable since 1998.</p><div class="recorder-bench"><div class="recorder-body"><span class="recorder-brand">HAPS PROPERTY · DO NOT LOSE</span><div class="recorder-display ${ready?'powered':''}">${ready?'REC ● READY':'BATTERY EMPTY'}</div><div class="socket">${plug('recorder')}<span>Recorder socket: angled sides, five contacts</span></div></div><div class="cable-choices"><button id="phone-cable" ${ready?'disabled':''} aria-label="Cable A: rounded sides, four contacts">${plug('phone')}<strong>Cable A</strong><span>Rounded · 4 contacts</span></button><button id="recorder-cable" ${ready?'disabled':''} aria-label="Cable B: angled sides, five contacts">${plug('recorder')}<strong>Cable B</strong><span>Angled · 5 contacts</span></button></div></div><p id="cable-feedback" role="status">${ready?'Click. Recorder alive. Somewhere, an expense form just lost an argument.':'Compare the socket shape and contacts, then try a cable.'}</p><div class="buttons">${button('back-search','Back to the mess')}</div>`);
  for (const connector of ['phone','recorder'] as const) bind(`${connector}-cable`,()=>{act({type:'pair-recorder',connector}); if(connector==='recorder')recorderPuzzle();else document.getElementById('cable-feedback')!.textContent='That is the phone cable. The phone feels supported. The recorder remains professionally abandoned.';});
  bind('back-search',play);
}
function timelinePanel() {
  const state = session.getState();
  const s02 = state.s02;
  const ready = s02.searchCompleted;
  const order = s02.timelineOrder;
  const summary = order.length === 2 ? (order[0] === 'S02.O6' && order[1] === 'S02.O3' ? 'May 16, then May 17.' : 'May 17, then May 16.') : 'Not placed yet.';
  panel('timeline', `<div class="eyebrow">City Hall counter / Build the timeline</div><h2>Two dates. One order.</h2><p>Place the May 16 report and the May 17 denial on the timeline strip.</p><div class="buttons">${button('order-16-17','May 16 report, then May 17 denial')}${button('order-17-16','May 17 denial, then May 16 report')}</div><p id="timeline-order" role="status">Current order: ${escapeHtml(summary)}</p><h3>File the public record</h3><div class="buttons">${button('file-order-of-reports','Order of reports and response, not private proof',true,!ready)}${button('file-proof-of-allegation','This proves the allegation',false,!ready)}</div>${!ready?'<p class="muted">Find all six City Hall objects before filing.</p>':''}<p id="timeline-feedback" role="status">${escapeHtml(state.lastMessage)}</p><div class="buttons">${button('back-search','Back to the counter')}</div>`);
  bind('order-16-17', () => { act({type:'order-timeline', first:'S02.O6', second:'S02.O3'}); timelinePanel(); });
  bind('order-17-16', () => { act({type:'order-timeline', first:'S02.O3', second:'S02.O6'}); timelinePanel(); });
  bind('file-order-of-reports', () => { act({type:'submit-timeline', interpretation:'order-of-reports'}); if (mode === 'timeline') timelinePanel(); });
  bind('file-proof-of-allegation', () => { act({type:'submit-timeline', interpretation:'proof-of-allegation'}); if (mode === 'timeline') timelinePanel(); });
  bind('back-search',play);
}
function notebook() {
  const state=session.getState();
  const entries = state.notebook;
  const timelineAvailable = entries.some(e => e.id === 'S02.C3' || e.id === 'S02.C6');
  panel('notebook', `<div class="eyebrow">The Haps / working notebook</div><h2>Leads, not miracles.</h2>${entries.length ? entries.map(e=>`<article class="card"><h3>${escapeHtml(e.label)}</h3>${e.id==='S01.C5'?`<p>${e.checked?'Clipping checked. Follow-up needed.':'Clipping waiting to be read.'}</p><div>${button('source','Read the clipping')}</div>`:''}${e.id==='S01.C6'?`<div>${button('recorder','Check recorder')}</div>`:''}</article>`).join(''):'<p>Nothing yet. The desk is unlikely to search itself.</p>'}${timelineAvailable?`<div class="buttons">${button('timeline','Build the timeline')}</div>`:''}<div class="buttons">${button('back-search','Back to the mess')}</div>`);
  bind('source',sourceCheck);bind('recorder',recorderPuzzle);bind('timeline',timelinePanel);bind('back-search',play);
}
function submit() {
  panel('submit', `<div class="eyebrow">Toronna Haps / Stop the presses</div><h2>What are we going with?</h2><p>The editor wants a starting point for the assignment. Choose the basis for your draft.</p><div class="buttons">${button('report-basis','The published report',true)}${button('rumour-basis','The office rumour')}</div><p id="draft-feedback" role="status">Read the clipping and get the recorder ready, then pick your story.</p><div class="buttons">${button('back-search','Back to my notes')}</div>`);
  for(const basis of ['published-report','office-rumour'] as const) bind(basis==='published-report'?'report-basis':'rumour-basis',()=>{act({type:'submit-draft',basis}); const feedback=document.getElementById('draft-feedback');if(feedback)feedback.textContent=basis==='office-rumour'?'The editor has enough rumours. Read the clipping and bring a working recorder.':session.getState().lastMessage;});
  bind('back-search',play);
}
function sceneResult(sceneId: EpisodeSceneId) {
  const state = session.getState();
  if (sceneId === 'S01') {
    const s01 = state.s01;
    panel('result', `<div class="eyebrow">Toronna Haps / Assignment filed</div><div class="filed-stamp">ON THE BEAT</div><h2>There goes patio season.</h2><div class="shift-receipt"><span><strong>6 / 6</strong> kit found</span><span><strong>${s01.hintsUsed} / 3</strong> hints used</span><span><strong>READY</strong> recorder</span></div><div class="next-assignment"><div class="eyebrow">Next assignment / 02</div><h3>Meanwhile at City Hall</h3><p>A public corridor. A jammed printer. Everyone has a statement. Nobody has a spare cable.</p><div class="buttons">${button('to-city-hall','Head to City Hall',true)}</div></div><p class="muted">Your assignment is saved.</p><div class="buttons">${button('history','Dialogue history')}${button('return-title','Back to title')}</div>`);
    bind('to-city-hall', () => void goToCityHall());
  } else {
    const s02 = state.s02;
    panel('result', `<div class="eyebrow">Toronna Haps / City Hall filed</div><div class="filed-stamp">TWO DATES, ONE RECORD</div><h2>May 16. May 17. In that order.</h2><div class="shift-receipt"><span><strong>6 / 6</strong> counter cleared</span><span><strong>${s02.hintsUsed} / 3</strong> hints used</span><span><strong>FILED</strong> timeline</span></div><div class="next-assignment"><div class="eyebrow">Next assignment / 03</div><h3>We're Going With WHAT?</h3><p>Not available yet — the deadline desk ships under a separate issue (#99).</p></div><p class="muted">Your assignment is saved.</p><div class="buttons">${button('history','Dialogue history')}${button('return-title','Back to title')}</div>`);
  }
  bind('history',()=>history(true)); bind('return-title',title);
}
async function preflightS02Assets(): Promise<void> {
  const assets = (manifest as { assets?: { id: string; url: string }[] } | undefined)?.assets ?? [];
  const required = ['S02.BG01', ...s02Scene.objects.map(object => object.id)];
  for (const id of required) {
    const asset = assets.find(candidate => candidate.id === id);
    if (!asset) throw new Error(`Required S02 artwork is missing from the manifest: ${id}.`);
    const response = await fetch(asset.url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Required S02 artwork failed to load: ${asset.url}`);
  }
}
async function goToCityHall() {
  if (memoryOnly) {
    panel('error', `<div class="eyebrow">Ford Frenzy</div><h2>City Hall needs a saved slot.</h2><p>This browser can't save progress right now, so crossing scenes safely isn't available in this preview. Enable storage, or use a normal browsing window, then start again to continue to City Hall.</p><div class="buttons">${button('return-title','Back to title',true)}</div>`);
    bind('return-title', title);
    return;
  }
  panel('loading', '<div class="eyebrow">jr42 productions</div><h2>Crossing to City Hall…</h2><p>The elevator smells like toner.</p>');
  try {
    // Validate every required S02 asset before committing the scene transition (no half-loaded scene, no partial progress).
    await preflightS02Assets();
    const result = session.step({ type: 'enter-scene', scene: 'S02' });
    if (!result.ok) throw new Error(result.errors[0]!.message);
    persist();
    // A second live PixiJS Application in this page after disposing the first corrupts shared
    // GPU/texture state (engine limitation, out of scope here), so reload into a clean page rather
    // than swap the renderer in place. The transition flag resumes straight into the S02 opening.
    try { localStorage.setItem(TRANSITION_FLAG, 'S02'); } catch { /* best effort */ }
    location.reload();
  } catch (error) {
    panel('error', `<div class="eyebrow">Ford Frenzy</div><h2>City Hall didn't load.</h2><p>${escapeHtml(error instanceof Error ? error.message : 'Unable to load required artwork.')}</p><p class="muted">Your S01 assignment is unaffected.</p><div class="buttons">${button('retry-city-hall','Retry loading',true)}${button('return-title','Back to title')}</div>`);
    bind('retry-city-hall', () => void goToCityHall()); bind('return-title', title);
  }
}
let historyReturn = pause;
function history(fromReceipt = false, focusId = 'history-opening') {
  const state = session.getState();
  historyReturn = () => { (fromReceipt ? () => sceneResult(state.currentScene) : pause)(); document.getElementById('history')?.focus(); };
  const s01Closing = state.s01.k01Awarded;
  const s02Reached = state.currentScene === 'S02' || state.currentScene === 'S03' || state.s02.k02Awarded;
  const s02Closing = state.s02.k02Awarded;
  panel('history', `<div class="eyebrow">The Haps / Dialogue history</div><h2>Replay a conversation</h2><div class="buttons">${button('history-opening','S01 opening conversation')}${s01Closing ? button('history-closing','S01 closing conversation') : ''}${s02Reached ? button('history-s02-opening','S02 opening conversation') : ''}${s02Closing ? button('history-s02-closing','S02 closing conversation') : ''}${button('history-back','Back')}</div>`);
  bind('history-opening', () => showConversation(presentationFor('S01'), 's01-opening', 'previous-screen', () => history(fromReceipt, 'history-opening')));
  if (s01Closing) bind('history-closing', () => showConversation(presentationFor('S01'), 's01-closing', 'previous-screen', () => history(fromReceipt, 'history-closing')));
  if (s02Reached) bind('history-s02-opening', () => showConversation(presentationFor('S02'), 's02-opening', 'previous-screen', () => history(fromReceipt, 'history-s02-opening')));
  if (s02Closing) bind('history-s02-closing', () => showConversation(presentationFor('S02'), 's02-closing', 'previous-screen', () => history(fromReceipt, 'history-s02-closing')));
  bind('history-back', historyReturn);
  document.getElementById(focusId)?.focus();
}
function pause(){panel('paused',`<div class="eyebrow">Hold the presses</div><h2>Coffee break.</h2><div class="buttons">${button('resume','Resume',true)}${button('history','Dialogue history')}${button('return-title','Return to title')}</div><p class="muted">${memoryOnly?'Progress is temporary. Keep this tab open.':'Your progress is saved on this device.'}</p>`);bind('resume',play);bind('history',()=>history(false));bind('return-title',title);}
function settings(){const sound=audio.getState();panel('settings',`<h2>Keep it comfortable.</h2><label><input id="motion" type="checkbox" ${reducedMotion?'checked':''}> Reduce motion</label><label><input id="mute" type="checkbox" ${sound.muted?'checked':''}> Mute sound</label><label for="volume">Sound level <output id="volume-value">${Math.round(sound.volume*100)}%</output></label><input id="volume" type="range" min="0" max="100" value="${Math.round(sound.volume*100)}"><div class="buttons">${button('test-sound','Try sound')}</div><p id="sound-status" role="status">Short equipment cues. Everything can be played silently.</p><div class="buttons">${button('return-title','Back to title')}</div>`);document.getElementById('motion')!.addEventListener('change',e=>{reducedMotion=(e.target as HTMLInputElement).checked;renderer?.setReducedMotion(reducedMotion);document.getElementById('app')!.dataset.reducedMotion=String(reducedMotion);});document.getElementById('mute')!.addEventListener('change',e=>audio.setMuted((e.target as HTMLInputElement).checked));document.getElementById('volume')!.addEventListener('input',e=>{const value=Number((e.target as HTMLInputElement).value);audio.setVolume(value/100);document.getElementById('volume-value')!.textContent=`${value}%`;});bind('test-sound',()=>{void audio.unlock().then(()=>{audio.play('ready');const state=audio.getState();const status=document.getElementById('sound-status');if(status)status.textContent=state.muted||!state.volume?'Sound is muted.':state.available?'Equipment cue played.':'Sound is unavailable. Silent play is ready.';});});bind('return-title',title);}
function credits(){panel('credits',`<div class="eyebrow">Ford Frenzy</div><h2>jr42 productions</h2><p>Original fictional newsroom and game presentation. Powered by Minoo and PixiJS.</p><p>The Haps, the Hogtown Howler and their reporters are fictional. The clipping is original game writing. Everything needed for this assignment is included in the game.</p><div class="buttons">${button('return-title','Back to title')}</div>`);bind('return-title',title);}

async function boot(){
  if(loading)return; loading=true;
  panel('loading','<div class="eyebrow">jr42 productions</div><h2>Opening the Haps…</h2><p>Finding a clean desk may take longer.</p>');
  try{
    const response=await fetch('./assets/manifest.json');if(!response.ok)throw Error('Asset manifest is unavailable.');
    manifest = await response.json();
    const initialScene: EpisodeSceneId = session.getState().currentScene === 'S02' ? 'S02' : 'S01';
    renderer = await buildRenderer(initialScene);
    rendererSceneId = initialScene;
    stage.setAttribute('aria-label', initialScene === 'S02' ? 'Search the City Hall public counter' : 'Search the newsroom');
    let pendingOpening: EpisodeSceneId | null = null;
    try {
      const flag = localStorage.getItem(TRANSITION_FLAG);
      if (flag) localStorage.removeItem(TRANSITION_FLAG);
      if (flag === initialScene) pendingOpening = flag;
    } catch { /* best effort; falls back to title */ }
    if (pendingOpening) openingDialogue(pendingOpening);
    else title();
  }catch(error){renderer?.dispose();renderer=undefined;panel('error',`<div class="eyebrow">Ford Frenzy</div><h2>The desk didn't load.</h2><p>${escapeHtml(error instanceof Error?error.message:'Unable to load required artwork.')}</p><p class="muted">Your saved progress has not been changed.</p><div class="buttons">${button('retry','Retry loading',true)}${button('return-title','Back to title')}</div>`);bind('retry',()=>void boot());bind('return-title',title);}
  finally{loading=false;}
}
function hideSearchCursor() {
  renderer?.setSearchCursor(null);
  stage.dataset.keyboardSearch = 'false';
  const location=document.getElementById('search-location');
  if(location) location.textContent='';
}
const S01_REGIONS: Record<string,string> = {
  'upper-left':'Pinboard and window frame', 'upper-middle':'Windows and the newsroom sign', 'upper-right':'Wall shelves and window',
  'centre-left':'Monitor and paperwork', 'centre-middle':'Keyboard, lamp and desk clutter', 'centre-right':'The far desk',
  'lower-left':'Chair and near desk edge', 'lower-middle':'The broad desktop', 'lower-right':'Desk edge and cabinets',
};
const S02_REGIONS: Record<string,string> = {
  'upper-left':'Atrium wall and noticeboards', 'upper-middle':'High windows and ceiling beams', 'upper-right':'Binder shelf',
  'centre-left':'Photocopier intake and output trays', 'centre-middle':'Public counter surface', 'centre-right':'Binder shelf and filing cabinet',
  'lower-left':'Floor clutter by the copier', 'lower-middle':'Counter surface', 'lower-right':'Filing cabinet front',
};
function describeSearch() {
  if(mode!=='playing' || inputMethod!=='keyboard' || document.activeElement!==stage) { hideSearchCursor(); return; }
  stage.dataset.keyboardSearch = 'true';
  renderer?.setSearchCursor(searchCursor);
  const id = session.getState().currentScene;
  const scn = sceneFor(id);
  const regions = id === 'S02' ? S02_REGIONS : S01_REGIONS;
  const column = searchCursor.x < 640 ? 'left' : searchCursor.x < 1280 ? 'middle' : 'right';
  const row = searchCursor.y < 360 ? 'upper' : searchCursor.y < 720 ? 'centre' : 'lower';
  const location=document.getElementById('search-location');
  if(location) location.textContent=`${regions[row+'-'+column]}. ${Math.round(searchCursor.x/scn.width*100)}% across, ${Math.round(searchCursor.y/scn.height*100)}% down. Enter to inspect here.`;
}
stage.addEventListener('focus',describeSearch);
stage.addEventListener('blur',hideSearchCursor);
// Capture intent before the browser moves focus or a control restores it.
document.addEventListener('pointerdown',()=>{inputMethod='pointer';hideSearchCursor();},true);
document.addEventListener('pointermove',event=>{
  if(event.movementX || event.movementY) {inputMethod='pointer';hideSearchCursor();}
},true);
document.addEventListener('keydown',event=>{
  if(['Tab','Escape','Enter',' ','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) {
    inputMethod='keyboard';
    if(event.target===stage && event.key!=='Tab' && event.key!=='Escape') describeSearch();
  }
},true);
stage.addEventListener('keydown',event=>{
  if(mode!=='playing') return;
  const directions: Record<string,[number,number]>={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
  const direction=directions[event.key];
  const scn = sceneFor(session.getState().currentScene);
  if(direction){
    event.preventDefault(); const step=event.shiftKey?10:40;
    searchCursor.x=Math.max(0,Math.min(scn.width,searchCursor.x+direction[0]*step));
    searchCursor.y=Math.max(0,Math.min(scn.height,searchCursor.y+direction[1]*step));
    describeSearch();
  }else if(event.key==='Enter' || event.key===' '){
    event.preventDefault(); if(event.repeat)return;
    if(!renderer?.inspectAt(searchCursor)){
      const location=document.getElementById('search-location');
      if(location)location.textContent='Nothing for your kit at this spot. Keep looking.';
    }
  }
});
document.querySelector('.wordmark')?.addEventListener('click',e=>{e.preventDefault();if(renderer)title();});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){if(mode==='conversation'){conversationEscape?.();}else if(mode==='playing')pause();else if(mode==='history')historyReturn();else if(['paused','inspect','source','recorder','notebook','submit','timeline'].includes(mode))play();}
  if(e.key==='f' && !e.ctrlKey && !e.metaKey && !e.altKey){if(document.fullscreenElement)void document.exitFullscreen();else void document.getElementById('app')!.requestFullscreen().catch(()=>{});}
  if(e.key==='Tab' && overlay.firstChild){const nodes=[...overlay.querySelectorAll<HTMLElement>('button:not(:disabled),a,input')];const first=nodes[0],last=nodes.at(-1);if(e.shiftKey && document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first?.focus();}}
});
window.addEventListener('pagehide',event=>{if(!event.persisted){renderer?.dispose();audio.dispose();}});
Object.assign(window,{render_game_to_text:()=>JSON.stringify({mode,coordinates:'screen CSS pixels; origin top-left, x right, y down',targets:renderer?.getTargets()??[],keyboardCursor:searchCursor,keyboardSearchActive:stage.dataset.keyboardSearch==='true',state:session.getState(),currentScene:rendererSceneId,memoryOnly}),advanceTime:(ms:number)=>renderer?.advanceTime(ms)});
document.getElementById('app')!.dataset.reducedMotion=String(reducedMotion);
void boot();
