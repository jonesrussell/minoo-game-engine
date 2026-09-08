import './styles.css';
import { createSceneRenderer, type SceneRenderer } from '@minoo/engine/browser';
import { validateSceneV2 } from '@minoo/engine/scene-v2';
import { createNewsroomSession, restoreNewsroomSession, type NewsroomAction } from './session.ts';
import sceneData from '../data/s01.json';
import clipping from '../data/s01-clipping.json';

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
const bind = (id: string, action: () => void) => document.getElementById(id)?.addEventListener('click', action);

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
  document.getElementById('app')!.dataset.screen = next;
  stage.inert = true;
  renderer?.setSearchCursor(null);
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
  panel('assignment', `<div class="eyebrow">01 / Welcome to the Haps</div><h2>So much for patio season.</h2><p>You were hired to review patios. Congratulations. You're on the mayor beat.</p><p>The editor needs your notebook, contact sheet, calendar, assignment folder, report summary and recorder. Naturally, they're somewhere in this disaster.</p><p class="muted">Find six objects, read the clipping, get the recorder working, then decide what belongs in the first draft. No timer. Three hints. Use the keyboard search control to explore with arrow keys and inspect with Enter.</p><div class="buttons">${button('start-assignment',"Let's find the desk",true)}</div>`);
  bind('start-assignment', play);
}
function play() {
  if (session.getState().k01Awarded) { result(); return; }
  mode = 'playing'; document.getElementById('app')!.dataset.screen = 'playing'; stage.inert = false; overlay.innerHTML = ''; renderer?.setPaused(false); update();
  (document.getElementById(originFocusId) ?? document.getElementById('notebook'))?.focus();
}
function act(action: NewsroomAction) {
  const result = session.step(action);
  if (!result.ok) { const message = result.errors.map(e => e.message).join(' '); document.querySelector('#feedback')!.textContent = message; return; }
  persist(); update();
  if (result.state.k01Awarded) { resultScreen(); return; }
  if (action.type === 'select') inspect(action.objectId);
}
function update() {
  const state = session.getState();
  renderer?.setView({foundIds:state.foundIds,hintedObjectId:state.hintedObjectId});
  const focusedId = document.activeElement?.id;
  hud.innerHTML = `<div class="hud-row"><div class="objective"><div class="eyebrow">01 / Welcome to the Haps</div><strong>GET YOUR SHIT TOGETHER.</strong> <span class="big-number">${state.foundIds.length}<small> / 6</small></span></div>${button('hint',`Hint • ${state.hintBudget-state.hintsUsed} left`,false,state.hintsUsed>=state.hintBudget || state.searchCompleted)}${button('notebook','Your notes')}${button('file-draft','File it',true,!state.searchCompleted)}${button('pause','Pause')}</div><p class="target-names">${scene.contents.map(c=>`<span class="${state.foundIds.includes(scene.objects.find(o=>o.contentId===c.id)!.id)?'found':''}">${escapeHtml(c.label.replace(' with office rumour note',''))}</span>`).join('')}</p><p id="feedback" class="feedback" role="status">${escapeHtml(state.lastMessage)}</p><div class="keyboard-tools">${button('keyboard-search','Search with keyboard')}<span id="search-help">Arrows move · Shift + arrows for fine movement · Enter inspects · Tab leaves the scene</span></div><p id="search-location" class="search-location" role="status" aria-live="polite"></p>`;
  bind('hint',()=>act({type:'hint'})); bind('notebook',notebook); bind('pause',pause); bind('file-draft',submit);
  bind('keyboard-search',()=>stage.focus());
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
  panel('inspect', `<div class="eyebrow">Bagged it. / Added to your notes</div><h2>${escapeHtml(content.label)}</h2><p>${jokes[id]}</p><div class="buttons">${id==='S01.O5'?button('source','Read the clipping',true):''}${id==='S01.O6'?button('recorder','Sort out the recorder',true):''}${button('back-search','Back to the mess')}</div>`);
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
  panel('recorder', `<div class="eyebrow">Equipment desk</div><h2>One job. Two cables.</h2><p>The recorder takes its matching connector. The phone cable looks optimistic.</p><div class="buttons">${button('phone-cable','Try the phone cable')}${button('recorder-cable','Use the recorder connector',true)}</div><p id="cable-feedback" role="status">${session.getState().chargerPaired==='recorder'?'Recorder ready. The editor is out of excuses.':'Pick a connector for the recorder.'}</p><div class="buttons">${button('back-search','Back to the mess')}</div>`);
  for (const connector of ['phone','recorder'] as const) bind(`${connector}-cable`,()=>{act({type:'pair-recorder',connector}); document.getElementById('cable-feedback')!.textContent = connector==='phone'?'Wrong cable. The phone is thrilled. The recorder remains unemployed.':'Recorder ready. The editor is out of excuses.';});
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
function result(){panel('result',`<div class="eyebrow">Assignment complete / K01</div><h2>You're officially on the beat.</h2><p>Six finds. One working recorder. A story to chase. The editor calls this suspiciously competent.</p><p class="edition-card">“Right. City Hall. Try to come back with a story and our recorder.”</p><p class="muted">Next: Meanwhile at City Hall. That scene is still being built. Your first assignment is saved.</p><div class="buttons">${button('return-title','Back to title',true)}</div>`);bind('return-title',title);}
function pause(){panel('paused',`<div class="eyebrow">Hold the presses</div><h2>Coffee break.</h2><div class="buttons">${button('resume','Resume',true)}${button('return-title','Return to title')}</div><p class="muted">${memoryOnly?'Progress is temporary. Keep this tab open.':'Your progress is saved on this device.'}</p>`);bind('resume',play);bind('return-title',title);}
function settings(){panel('settings',`<h2>Keep it comfortable.</h2><label><input id="motion" type="checkbox" ${reducedMotion?'checked':''}> Reduce motion</label><p class="muted">This prototype is silent. Every cue is visible.</p><div class="buttons">${button('return-title','Back to title')}</div>`);document.getElementById('motion')!.addEventListener('change',e=>{reducedMotion=(e.target as HTMLInputElement).checked;renderer?.setReducedMotion(reducedMotion);});bind('return-title',title);}
function credits(){panel('credits',`<div class="eyebrow">Ford Frenzy</div><h2>jr42 productions</h2><p>Original fictional newsroom and game presentation. Powered by Minoo and PixiJS.</p><p>The Haps, the Hogtown Howler and their reporters are fictional. The clipping is original game writing. Everything needed for this assignment is included in the game.</p><div class="buttons">${button('return-title','Back to title')}</div>`);bind('return-title',title);}

async function boot(){
  if(loading)return; loading=true;
  panel('loading','<div class="eyebrow">jr42 productions</div><h2>Opening the Haps…</h2><p>Finding a clean desk may take longer.</p>');
  try{
    const response=await fetch('./assets/manifest.json');if(!response.ok)throw Error('Asset manifest is unavailable.');
    renderer=await createSceneRenderer({host:stage,scene,manifest:await response.json(),backgroundId:'S01.BG01',reducedMotion,onSelect:id=>{if(mode==='playing')act({type:'select',objectId:id});},labels:[{text:'Toronna Haps',x:1060,y:72,fontSize:46,rotation:.07,color:0x302c25},{text:'MAY 2013',x:98,y:147,fontSize:18,color:0x302c25},{text:'Su Mo Tu We Th Fr Sa\n          1  2  3  4\n 5  6  7  8  9 10 11\n12 13 14 15 16 17 18\n19 20 21 22 23 24 25\n26 27 28 29 30 31',x:98,y:175,fontSize:10,color:0x302c25},{text:'PATIO??',x:98,y:270,fontSize:16,color:0x8b3529}]});
    title();
  }catch(error){renderer?.dispose();renderer=undefined;panel('error',`<div class="eyebrow">Ford Frenzy</div><h2>The desk didn't load.</h2><p>${escapeHtml(error instanceof Error?error.message:'Unable to load required artwork.')}</p><p class="muted">Your saved progress has not been changed.</p><div class="buttons">${button('retry','Retry loading',true)}${button('return-title','Back to title')}</div>`);bind('retry',()=>void boot());bind('return-title',title);}
  finally{loading=false;}
}
function describeSearch() {
  if(mode!=='playing') return;
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
stage.addEventListener('blur',()=>renderer?.setSearchCursor(null));
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
document.querySelector('.wordmark')!.addEventListener('click',e=>{e.preventDefault();if(renderer)title();});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){if(mode==='playing')pause();else if(['paused','inspect','source','recorder','notebook','submit'].includes(mode))play();}
  if(e.key==='f' && !e.ctrlKey && !e.metaKey && !e.altKey){if(document.fullscreenElement)void document.exitFullscreen();else void document.getElementById('app')!.requestFullscreen().catch(()=>{});}
  if(e.key==='Tab' && overlay.firstChild){const nodes=[...overlay.querySelectorAll<HTMLElement>('button:not(:disabled),a,input')];const first=nodes[0],last=nodes.at(-1);if(e.shiftKey && document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first?.focus();}}
});
window.addEventListener('pagehide',event=>{if(!event.persisted)renderer?.dispose();});
Object.assign(window,{render_game_to_text:()=>JSON.stringify({mode,coordinates:'screen CSS pixels; origin top-left, x right, y down',targets:renderer?.getTargets()??[],keyboardCursor:searchCursor,state:session.getState(),memoryOnly}),advanceTime:(ms:number)=>renderer?.advanceTime(ms)});
void boot();

