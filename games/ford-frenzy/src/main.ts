import './styles.css';
import './layouts.css';
import { createSceneRenderer, type SceneRenderer } from '@minoo/engine/browser';
import { validateSceneV2 } from '@minoo/engine/scene-v2';
import { createNewsroomSession, restoreNewsroomSession, type NewsroomAction } from './session.ts';
import sceneData from '../data/s01.json';
import clipping from '../data/s01-clipping.json';
import { createGameAudio } from './audio.ts';
import { renderHud, reactionsForTransition } from './hud.ts';
import presentationData from '../data/s01-presentation.json';
import { conversationView, renderConversation, validatePresentation } from './presentation.ts';

const audio = createGameAudio();
const presentationValidation = validatePresentation(presentationData, sceneData.objects.map(object => object.id));
if (!presentationValidation.ok) throw Error(`Invalid bundled presentation: ${presentationValidation.errors.map(error => error.message).join(' ')}`);
const presentation = presentationValidation.presentation;

const validation = validateSceneV2(sceneData);
if (!validation.ok) throw Error('Invalid bundled S01 scene');
const scene = validation.scene;
const stage = document.querySelector<HTMLElement>('#stage')!;
const hud = document.querySelector<HTMLElement>('#hud')!;
const overlay = document.querySelector<HTMLElement>('#overlay')!;
const saveStatus = document.querySelector<HTMLElement>('#save-status')!;
const SAVE = 'ford-frenzy.s01.save.v1';
let session = createNewsroomSession();
let renderer: SceneRenderer | undefined;
let mode = 'loading';
let inputMethod: 'pointer' | 'keyboard' = 'pointer';
let reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let saveExists = false;
let badSave = false;
let memoryOnly = false;
let originFocusId = 'notebook';
let titleFocusId = 'new-game';
let loading = false;
const searchCursor = {x:960,y:540};
stage.tabIndex = 0;
stage.setAttribute('role','application');
stage.setAttribute('aria-label','Search the newsroom');
stage.setAttribute('aria-describedby','search-help search-location');
const escapeHtml = (s: string) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const button = (id: string, text: string, primary = false, disabled = false) => `<button id="${id}" ${primary ? 'class="primary"' : ''} ${disabled ? 'disabled' : ''}>${text}</button>`;
const bind = (id: string, action: () => void) => document.getElementById(id)?.addEventListener('click', () => { void audio.unlock(); action(); });
const dialogue = (lines: readonly [string, string][]) => `<div class="dialogue">${lines.map(([speaker, line]) => `<div class="dialogue-line"><span class="speaker">${escapeHtml(speaker)}</span><p>${escapeHtml(line)}</p></div>`).join('')}</div>`;

try {
  const raw = localStorage.getItem(SAVE);
  if (raw) {
    const restored = restoreNewsroomSession(JSON.parse(raw));
    if (restored.ok) { session = restored.session; saveExists = true; }
    else badSave = true;
  }
} catch { badSave = true; }
try { localStorage.setItem('ford-frenzy.storage-probe', '1'); localStorage.removeItem('ford-frenzy.storage-probe'); }
catch { memoryOnly = true; }
function persist() {
  if (memoryOnly) { saveStatus.textContent = 'Temporary play • keep this tab open'; return; }
  try { localStorage.setItem(SAVE, JSON.stringify(session.exportSave())); saveExists = true; badSave = false; saveStatus.textContent = 'Saved on this device'; }
  catch { memoryOnly = true; saveStatus.textContent = 'Save failed • keep this tab open; reloading returns to the last saved point'; }
}
function panel(next: string, body: string, title = false) {
  if (mode === 'playing') originFocusId = document.activeElement?.id || 'notebook';
  if (mode === 'title') titleFocusId = document.activeElement?.id || 'new-game';
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
function newGame() {
  session = createNewsroomSession(); badSave = false; persist();
  openingDialogue();
}
function openingDialogue(index=0) {
  const line = conversationView(presentation, index);
  panel('conversation', `<img class="conversation-backdrop" src="./assets/background.png" alt="">${renderConversation(presentation, index, button)}`);
  overlay.querySelector('.panel')!.classList.add('conversation-panel');
  for(const portrait of overlay.querySelectorAll<HTMLImageElement>('.character-portrait')){
    let retriedNeutral = false;
    let settled = false;
    const fallback=()=>{
      if (settled) return;
      if (!retriedNeutral && portrait.dataset.expression !== 'neutral' && portrait.dataset.neutralSrc) {
        retriedNeutral = true;
        portrait.dataset.expression = 'neutral';
        portrait.src = portrait.dataset.neutralSrc;
        return;
      }
      settled = true;
      portrait.hidden=true;
      (portrait.nextElementSibling as HTMLElement).hidden=false;
    };
    portrait.addEventListener('load', () => { if (portrait.naturalWidth > 0) settled = true; });
    portrait.addEventListener('error',fallback);
    if(portrait.complete){ if (portrait.naturalWidth > 0) settled = true; else fallback(); }
  }
  bind('dialogue-next',()=>line.index+1<line.total?openingDialogue(line.index+1):play());
  bind('dialogue-back',()=>openingDialogue(Math.max(0,index-1)));
  bind('dialogue-skip',play);
  document.getElementById('dialogue-next')!.focus();
}
function play() {
  if (session.getState().k01Awarded) { result(); return; }
  audio.setPaused(false);
  mode = 'playing'; document.getElementById('app')!.dataset.screen = 'playing'; stage.inert = false; overlay.innerHTML = ''; renderer?.setPaused(false); update();
  (document.getElementById(originFocusId) ?? document.getElementById('notebook'))?.focus();
}
function act(action: NewsroomAction) {
  const before = session.getState();
  const result = session.step(action);
  if (!result.ok) { const message = result.errors.map(e => e.message).join(' '); document.querySelector('#feedback')!.textContent = message; return; }
  persist(); update();
  for (const reaction of reactionsForTransition(before, result)) {
    if (reaction.type === 'sound') audio.play(reaction.cue);
  }
  if (result.state.k01Awarded) { resultScreen(); return; }
  if (action.type === 'select') inspect(action.objectId);
}
function update() {
  const state = session.getState();
  renderer?.setView({foundIds:state.foundIds,hintedObjectId:state.hintedObjectId});
  const focusedId = document.activeElement?.id;
  hud.innerHTML = renderHud(presentation, scene, state, button);
  bind('hint',()=>act({type:'hint'})); bind('notebook',notebook); bind('pause',pause); bind('file-draft',submit);
  bind('keyboard-search',()=>{ inputMethod='keyboard'; stage.focus(); describeSearch(); });
  if (focusedId) document.getElementById(focusedId)?.focus();
  if(document.activeElement===stage) describeSearch();
}
const jokes: Record<string,string> = {
  'S01.O1': 'Three blank pages. One phone number. Forty-seven doodles of the editor as a raccoon. Ready for journalism.',
  'S01.O2': 'A contact sheet with actual Toronto on it. An unusually strong start for this office.',
  'S01.O3': 'May 2013. Someone wrote PATIO?? in enormous letters. Someone else cancelled happiness.',
  'S01.O4': 'The assignment is real. The sticky-note rumour is office chatter. The editor has underlined this twice.',
  'S01.O5': 'The story everyone is talking about. Someone printed it, lost it, and blamed the printer. Classic Haps.',
  'S01.O6': 'The recorder is dead. The editor suggests shouting everything from memory. You should probably find the right connector.',
};
function inspect(id: string) {
  const content = scene.contents.find(c=>c.id===scene.objects.find(o=>o.id===id)!.contentId)!;
  panel('inspect', `<div class="eyebrow">Bagged it. / Added to your notes</div><div class="find-detail"><img src="./assets/${id}.png" alt=""><div><h2>${escapeHtml(content.label)}</h2><p>${jokes[id]}</p></div></div><div class="buttons">${id==='S01.O5'?button('source','Read the clipping',true):''}${id==='S01.O6'?button('recorder','Sort out the recorder',true):''}${button('back-search','Back to the mess')}</div>`);
  bind('back-search',play); bind('source',sourceCheck); bind('recorder',recorderPuzzle);
}
function sourceCheck() {
  const checked = session.getState().sourceChecks.includes('S01.C5');
  panel('source', `<article class="clipping"><div class="paper-name">${escapeHtml(clipping.publication)}</div><p class="paper-tagline">${escapeHtml(clipping.tagline)}</p><p class="paper-date">${escapeHtml(clipping.date)} · ${escapeHtml(clipping.byline)}</p><h2>${escapeHtml(clipping.headline)}</h2>${clipping.paragraphs.map(text=>`<p>${escapeHtml(text)}</p>`).join('')}</article><h3>What can we put in our notes?</h3><div class="buttons">${button('reading-report','The Howler reports seeing a video',true,checked)}${button('reading-proof','The allegation is proven',false,checked)}</div><p id="reading-feedback" role="status">${checked?'Clipping checked. We have a lead to follow.':'The editor: “Read the thing before we get matching lawsuits.”'}</p><div class="buttons">${button('back-search','Back to the mess')}</div>`);
  for (const reading of ['reported-account','proven-claim'] as const) bind(reading==='reported-account'?'reading-report':'reading-proof',()=>{
    act({type:'check-source',contentId:'S01.C5',reading});
    if (session.getState().sourceChecks.includes('S01.C5')) sourceCheck();
    else document.getElementById('reading-feedback')!.textContent=session.getState().lastMessage;
  });
  bind('back-search',play);
}
function recorderPuzzle() {
  const ready=session.getState().chargerPaired==='recorder';
  const plug=(kind:'phone'|'recorder')=>`<svg viewBox="0 0 160 90" aria-hidden="true"><path d="M80 90V65" stroke="#292d2c" stroke-width="20"/><path d="${kind==='recorder'?'M30 15H130L142 55L122 68H38L18 55Z':'M30 15H130Q142 15 142 28V55Q142 68 130 68H30Q18 68 18 55V28Q18 15 30 15Z'}" fill="#848b85" stroke="#202b2b" stroke-width="5"/>${Array.from({length:kind==='recorder'?5:4},(_,i)=>`<rect x="${43+i*(kind==='recorder'?16:21)}" y="30" width="10" height="23" fill="#d3aa54"/>`).join('')}</svg>`;
  panel('recorder', `<div class="eyebrow">Equipment desk / Match the connector</div><h2>One job. Two cables.</h2><p>Elliot's filing system: one drawer, every cable since 1998.</p><div class="recorder-bench"><div class="recorder-body"><span class="recorder-brand">HAPS PROPERTY · DO NOT LOSE</span><div class="recorder-display ${ready?'powered':''}">${ready?'REC ● READY':'BATTERY EMPTY'}</div><div class="socket">${plug('recorder')}<span>Recorder socket: angled sides, five contacts</span></div></div><div class="cable-choices"><button id="phone-cable" ${ready?'disabled':''} aria-label="Cable A: rounded sides, four contacts">${plug('phone')}<strong>Cable A</strong><span>Rounded · 4 contacts</span></button><button id="recorder-cable" ${ready?'disabled':''} aria-label="Cable B: angled sides, five contacts">${plug('recorder')}<strong>Cable B</strong><span>Angled · 5 contacts</span></button></div></div><p id="cable-feedback" role="status">${ready?'Click. Recorder alive. Somewhere, an expense form just lost an argument.':'Compare the socket shape and contacts, then try a cable.'}</p><div class="buttons">${button('back-search','Back to the mess')}</div>`);
  for (const connector of ['phone','recorder'] as const) bind(`${connector}-cable`,()=>{act({type:'pair-recorder',connector}); if(connector==='recorder')recorderPuzzle();else document.getElementById('cable-feedback')!.textContent='That is the phone cable. The phone feels supported. The recorder remains professionally abandoned.';});
  bind('back-search',play);
}
function notebook() {
  const state=session.getState();
  panel('notebook', `<div class="eyebrow">The Haps / working notebook</div><h2>Leads, not miracles.</h2>${state.notebook.length ? state.notebook.map(e=>`<article class="card"><h3>${escapeHtml(e.label)}</h3>${e.id==='S01.C5'?`<p>${e.checked?'Clipping checked. Follow-up needed.':'Clipping waiting to be read.'}</p><div>${button('source','Read the clipping')}</div>`:''}${e.id==='S01.C6'?`<div>${button('recorder','Check recorder')}</div>`:''}</article>`).join(''):'<p>Nothing yet. The desk is unlikely to search itself.</p>'}<div class="buttons">${button('back-search','Back to the mess')}</div>`);
  bind('source',sourceCheck);bind('recorder',recorderPuzzle);bind('back-search',play);
}
function submit() {
  panel('submit', `<div class="eyebrow">Toronna Haps / Stop the presses</div><h2>What are we going with?</h2><p>The editor wants a starting point for the assignment. Choose the basis for your draft.</p><div class="buttons">${button('report-basis','The published report',true)}${button('rumour-basis','The office rumour')}</div><p id="draft-feedback" role="status">Read the clipping and get the recorder ready, then pick your story.</p><div class="buttons">${button('back-search','Back to my notes')}</div>`);
  for(const basis of ['published-report','office-rumour'] as const) bind(basis==='published-report'?'report-basis':'rumour-basis',()=>{act({type:'submit-draft',basis}); const feedback=document.getElementById('draft-feedback');if(feedback)feedback.textContent=basis==='office-rumour'?'The editor has enough rumours. Read the clipping and bring a working recorder.':session.getState().lastMessage;});
  bind('back-search',play);
}
function resultScreen(){result();}
function result(){const state=session.getState();panel('result',`<div class="eyebrow">Toronna Haps / Assignment filed</div><div class="filed-stamp">ON THE BEAT</div><h2>There goes patio season.</h2>${dialogue([['Alex / You','Published report logged. Office rumour stays here. Recorder\'s alive.'],['Elliot / Editor','Careful. Competence makes the furniture nervous.'],['Alex / You','Then point me at City Hall.']])}<div class="shift-receipt"><span><strong>6 / 6</strong> kit found</span><span><strong>${state.hintsUsed} / 3</strong> hints used</span><span><strong>READY</strong> recorder</span></div><div class="next-assignment"><div class="eyebrow">Next assignment / 02</div><h3>Meanwhile at City Hall</h3><p>A public corridor. A jammed printer. Everyone has a statement. Nobody has a spare cable.</p></div><p class="muted">End of this playable preview. Your assignment is saved.</p><div class="buttons">${button('return-title','Back to title',true)}</div>`);bind('return-title',title);}
function pause(){panel('paused',`<div class="eyebrow">Hold the presses</div><h2>Coffee break.</h2><div class="buttons">${button('resume','Resume',true)}${button('return-title','Return to title')}</div><p class="muted">${memoryOnly?'Progress is temporary. Keep this tab open.':'Your progress is saved on this device.'}</p>`);bind('resume',play);bind('return-title',title);}
function settings(){const sound=audio.getState();panel('settings',`<h2>Keep it comfortable.</h2><label><input id="motion" type="checkbox" ${reducedMotion?'checked':''}> Reduce motion</label><label><input id="mute" type="checkbox" ${sound.muted?'checked':''}> Mute sound</label><label for="volume">Sound level <output id="volume-value">${Math.round(sound.volume*100)}%</output></label><input id="volume" type="range" min="0" max="100" value="${Math.round(sound.volume*100)}"><div class="buttons">${button('test-sound','Try sound')}</div><p id="sound-status" role="status">Short equipment cues. Everything can be played silently.</p><div class="buttons">${button('return-title','Back to title')}</div>`);document.getElementById('motion')!.addEventListener('change',e=>{reducedMotion=(e.target as HTMLInputElement).checked;renderer?.setReducedMotion(reducedMotion);document.getElementById('app')!.dataset.reducedMotion=String(reducedMotion);});document.getElementById('mute')!.addEventListener('change',e=>audio.setMuted((e.target as HTMLInputElement).checked));document.getElementById('volume')!.addEventListener('input',e=>{const value=Number((e.target as HTMLInputElement).value);audio.setVolume(value/100);document.getElementById('volume-value')!.textContent=`${value}%`;});bind('test-sound',()=>{void audio.unlock().then(()=>{audio.play('ready');const state=audio.getState();const status=document.getElementById('sound-status');if(status)status.textContent=state.muted||!state.volume?'Sound is muted.':state.available?'Equipment cue played.':'Sound is unavailable. Silent play is ready.';});});bind('return-title',title);}
function credits(){panel('credits',`<div class="eyebrow">Ford Frenzy</div><h2>jr42 productions</h2><p>Original fictional newsroom and game presentation. Powered by Minoo and PixiJS.</p><p>The Haps, the Hogtown Howler and their reporters are fictional. The clipping is original game writing. Everything needed for this assignment is included in the game.</p><div class="buttons">${button('return-title','Back to title')}</div>`);bind('return-title',title);}

async function boot(){
  if(loading)return; loading=true;
  panel('loading','<div class="eyebrow">jr42 productions</div><h2>Opening the Haps…</h2><p>Finding a clean desk may take longer.</p>');
  try{
    const response=await fetch('./assets/manifest.json');if(!response.ok)throw Error('Asset manifest is unavailable.');
    const calendar = scene.objects.find(object => object.id === 'S01.O3')!;
    renderer=await createSceneRenderer({host:stage,scene,manifest:await response.json(),backgroundId:'S01.BG01',objectLighting:{tint:0xded3b8,shadow:true},reducedMotion,onSelect:id=>{if(mode==='playing')act({type:'select',objectId:id});},labels:[{text:'MAY 2013',x:calendar.x+calendar.width*.22,y:calendar.y+calendar.height*.27,fontSize:12,color:0x302c25},{text:'Su Mo Tu We Th Fr Sa\n          1  2  3  4\n 5  6  7  8  9 10 11\n12 13 14 15 16 17 18\n19 20 21 22 23 24 25\n26 27 28 29 30 31',x:calendar.x+calendar.width*.22,y:calendar.y+calendar.height*.38,fontSize:5.5,color:0x302c25},{text:'PATIO??',x:calendar.x+calendar.width*.22,y:calendar.y+calendar.height*.75,fontSize:10,color:0x8b3529}]});
    title();
  }catch(error){renderer?.dispose();renderer=undefined;panel('error',`<div class="eyebrow">Ford Frenzy</div><h2>The desk didn't load.</h2><p>${escapeHtml(error instanceof Error?error.message:'Unable to load required artwork.')}</p><p class="muted">Your saved progress has not been changed.</p><div class="buttons">${button('retry','Retry loading',true)}${button('return-title','Back to title')}</div>`);bind('retry',()=>void boot());bind('return-title',title);}
  finally{loading=false;}
}
function hideSearchCursor() {
  renderer?.setSearchCursor(null);
  stage.dataset.keyboardSearch = 'false';
  const location=document.getElementById('search-location');
  if(location) location.textContent='';
}
function describeSearch() {
  if(mode!=='playing' || inputMethod!=='keyboard' || document.activeElement!==stage) { hideSearchCursor(); return; }
  stage.dataset.keyboardSearch = 'true';
  renderer?.setSearchCursor(searchCursor);
  const column = searchCursor.x < 640 ? 'left' : searchCursor.x < 1280 ? 'middle' : 'right';
  const row = searchCursor.y < 360 ? 'upper' : searchCursor.y < 720 ? 'centre' : 'lower';
  const regions: Record<string,string> = {
    'upper-left':'Pinboard and window frame', 'upper-middle':'Windows and the newsroom sign', 'upper-right':'Wall shelves and window',
    'centre-left':'Monitor and paperwork', 'centre-middle':'Keyboard, lamp and desk clutter', 'centre-right':'The far desk',
    'lower-left':'Chair and near desk edge', 'lower-middle':'The broad desktop', 'lower-right':'Desk edge and cabinets',
  };
  const location=document.getElementById('search-location');
  if(location) location.textContent=`${regions[row+'-'+column]}. ${Math.round(searchCursor.x/scene.width*100)}% across, ${Math.round(searchCursor.y/scene.height*100)}% down. Enter to inspect here.`;
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
  if(direction){
    event.preventDefault(); const step=event.shiftKey?10:40;
    searchCursor.x=Math.max(0,Math.min(scene.width,searchCursor.x+direction[0]*step));
    searchCursor.y=Math.max(0,Math.min(scene.height,searchCursor.y+direction[1]*step));
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
  if(e.key==='Escape'){if(mode==='playing')pause();else if(['paused','inspect','source','recorder','notebook','submit'].includes(mode))play();}
  if(e.key==='f' && !e.ctrlKey && !e.metaKey && !e.altKey){if(document.fullscreenElement)void document.exitFullscreen();else void document.getElementById('app')!.requestFullscreen().catch(()=>{});}
  if(e.key==='Tab' && overlay.firstChild){const nodes=[...overlay.querySelectorAll<HTMLElement>('button:not(:disabled),a,input')];const first=nodes[0],last=nodes.at(-1);if(e.shiftKey && document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first?.focus();}}
});
window.addEventListener('pagehide',event=>{if(!event.persisted){renderer?.dispose();audio.dispose();}});
Object.assign(window,{render_game_to_text:()=>JSON.stringify({mode,coordinates:'screen CSS pixels; origin top-left, x right, y down',targets:renderer?.getTargets()??[],keyboardCursor:searchCursor,keyboardSearchActive:stage.dataset.keyboardSearch==='true',state:session.getState(),memoryOnly}),advanceTime:(ms:number)=>renderer?.advanceTime(ms)});
document.getElementById('app')!.dataset.reducedMotion=String(reducedMotion);
void boot();

