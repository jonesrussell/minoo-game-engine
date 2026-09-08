import './styles.css';
import { createSceneRenderer, type SceneRenderer } from '@minoo/engine/browser';
import { validateSceneV2 } from '@minoo/engine/scene-v2';
import { createNewsroomSession, restoreNewsroomSession, type NewsroomAction } from './session.ts';
import sceneData from '../data/s01.json';

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
let originFocus: HTMLElement | null = null;
let loading = false;
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
  if (mode === 'playing') originFocus = document.activeElement as HTMLElement;
  mode = next;
  renderer?.setPaused(true);
  overlay.innerHTML = `<section role="dialog" aria-modal="true" aria-label="${next}" class="panel ${title ? 'title-panel' : ''}">${body}</section>`;
  overlay.querySelector<HTMLElement>('button, a, input')?.focus();
}
function title() {
  panel('title', `<div class="eyebrow">A Torrona Haps adventure</div><h1>FORD<br>FRENZY</h1><p class="byline">jr42 productions</p><p class="edition-card">You wanted the patio beat.<br>Toronto had other plans.</p><div class="buttons">${button('new-game','New Game',true)}${button('continue','Continue',false,!saveExists && !session.getActions().length)}</div><div class="buttons">${button('settings','Settings')}${button('credits','Credits')}</div><p class="muted">First playable • Welcome to the Haps<br>Search the scene. Check your leads. Get the story.</p>${badSave ? '<p class="muted">The saved game could not be read. It will be preserved until you confirm a new game.</p>' : ''}` , true);
  bind('new-game', () => {
    if (saveExists || badSave || session.getActions().length) confirmNew();
    else newGame();
  });
  bind('continue', play);
  bind('settings', settings);
  bind('credits', credits);
  hud.innerHTML = '<span class="eyebrow">May 17, 2013</span><p>Welcome to the Haps. The coffee is ancient. The news is not.</p>';
  saveStatus.textContent = memoryOnly ? 'Temporary play • keep this tab open' : saveExists ? 'Saved game available' : 'Local play • no account needed';
}
function confirmNew() {
  panel('confirm', `<h2>Fresh notebook?</h2><p>Starting over replaces your saved assignment. Your display setting stays as it is.</p><div class="buttons">${button('confirm-new','Start over',true)}${button('cancel-new','Keep my progress')}</div>`);
  bind('confirm-new', newGame); bind('cancel-new', title);
}
function newGame() {
  session = createNewsroomSession(); badSave = false; persist();
  panel('assignment', `<div class="eyebrow">01 / Welcome to the Haps</div><h2>So much for patio season.</h2><p>You were hired to review patios. Congratulations. You're on the mayor beat.</p><p>The editor needs your notebook, contact sheet, calendar, assignment folder, report summary and recorder. Naturally, they're somewhere in this disaster.</p><p class="muted">Find six objects, get the recorder working, then decide what belongs in the first draft. No timer. Three hints. Keyboard search is available below the scene.</p><div class="buttons">${button('start-assignment',"Let's find the desk",true)}</div>`);
  bind('start-assignment', play);
}
function play() {
  if (session.getState().k01Awarded) { result(); return; }
  mode = 'playing'; overlay.innerHTML = ''; renderer?.setPaused(false); update();
  if (originFocus?.isConnected) originFocus.focus();
  else document.getElementById('notebook')?.focus();
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
  const detailsOpen = hud.querySelector('details')?.open ?? false;
  hud.innerHTML = `<div class="hud-row"><div class="objective"><div class="eyebrow">01 / Welcome to the Haps</div><strong>Find your reporting kit</strong> <span class="big-number">${state.foundIds.length}<small> / 6</small></span></div>${button('hint',`Hint • ${state.hintBudget-state.hintsUsed} left`,false,state.hintsUsed>=state.hintBudget || state.searchCompleted)}${button('notebook','Notebook')}${button('file-draft','File draft',true,!state.searchCompleted)}${button('pause','Pause')}</div><p class="target-names">${scene.contents.map(c=>`<span class="${state.foundIds.includes(scene.objects.find(o=>o.contentId===c.id)!.id)?'found':''}">${escapeHtml(c.label.replace(' with office rumour note',''))}</span>`).join('')}</p><p id="feedback" class="feedback" role="status">${escapeHtml(state.lastMessage)}</p><details ${detailsOpen?'open':''}><summary>Keyboard search / object list</summary><div class="targets">${scene.objects.map(o=>`<button id="target-${o.id}" class="${state.foundIds.includes(o.id)?'found':''}">${state.foundIds.includes(o.id)?'✓ ':''}${escapeHtml(scene.contents.find(c=>c.id===o.contentId)!.label)}</button>`).join('')}</div></details>`;
  bind('hint',()=>act({type:'hint'})); bind('notebook',notebook); bind('pause',pause); bind('file-draft',submit);
  for (const o of scene.objects) bind(`target-${o.id}`,()=>{ if(mode==='playing') act({type:'select',objectId:o.id}); });
  if (focusedId) document.getElementById(focusedId)?.focus();
}
const jokes: Record<string,string> = {
  'S01.O1': 'Three blank pages. One phone number. Forty-seven doodles of the editor as a raccoon. Ready for journalism.',
  'S01.O2': 'A contact sheet with actual Toronto on it. An unusually strong start for this office.',
  'S01.O3': 'May 2013. Someone wrote PATIO?? in enormous letters. Someone else cancelled happiness.',
  'S01.O4': 'The assignment is real. The sticky-note rumour is office chatter. The editor has underlined this twice.',
  'S01.O5': 'A summary of the Toronto Star report. Read what was reported, who reported it and when. Finding the paper is only the start.',
  'S01.O6': 'The recorder is dead. The editor suggests shouting everything from memory. You should probably find the right connector.',
};
function inspect(id: string) {
  const content = scene.contents.find(c=>c.id===scene.objects.find(o=>o.id===id)!.contentId)!;
  panel('inspect', `<div class="eyebrow">Added to your notebook</div><h2>${escapeHtml(content.label)}</h2><span class="badge">${content.classification === 'fiction' ? 'Fictional newsroom prop' : 'Attributed allegation'}</span><p>${jokes[id]}</p><div class="buttons">${id==='S01.O5'?button('source','Read source card',true):''}${id==='S01.O6'?button('recorder','Sort out the recorder',true):''}${button('back-search','Back to the mess')}</div>`);
  bind('back-search',play); bind('source',sourceCard); bind('recorder',recorderPuzzle);
}
function sourceCard() {
  const checked = session.getState().sourceChecks.includes('S01.C5');
  panel('source', `<div class="eyebrow">Source card / H01</div><h2>Read before running with it.</h2><p class="source-copy">On May 16, the Toronto Star published Robyn Doolittle and Kevin Donovan's account of viewing a video they reported appeared to show Mayor Rob Ford smoking crack cocaine.</p><p>This is an attributed report at this point in the story. It does not establish every allegation as fact.</p><p><a href="${escapeHtml(scene.sources[0].url)}" target="_blank" rel="noopener noreferrer">Toronto Star • May 16, 2013</a></p><div class="buttons">${button('check-source',checked?'Source checked':'Record source check',true,checked)}${button('back-search','Back to the mess')}</div>`);
  bind('check-source',()=>{act({type:'check-source',contentId:'S01.C5'}); sourceCard();}); bind('back-search',play);
}
function recorderPuzzle() {
  panel('recorder', `<div class="eyebrow">Equipment desk</div><h2>One job. Two cables.</h2><p>The recorder takes its matching connector. The phone cable looks optimistic.</p><div class="buttons">${button('phone-cable','Try the phone cable')}${button('recorder-cable','Use the recorder connector',true)}</div><p id="cable-feedback" role="status">${session.getState().chargerPaired==='recorder'?'Recorder ready. The editor is out of excuses.':'Pick a connector for the recorder.'}</p><div class="buttons">${button('back-search','Back to the mess')}</div>`);
  for (const connector of ['phone','recorder'] as const) bind(`${connector}-cable`,()=>{act({type:'pair-recorder',connector}); document.getElementById('cable-feedback')!.textContent = connector==='phone'?'Wrong cable. The phone is thrilled. The recorder remains unemployed.':'Recorder ready. The editor is out of excuses.';});
  bind('back-search',play);
}
function notebook() {
  const state=session.getState();
  panel('notebook', `<div class="eyebrow">The Haps / working notebook</div><h2>Leads, not miracles.</h2>${state.notebook.length ? state.notebook.map(e=>`<article class="card"><h3>${escapeHtml(e.label)}</h3><span class="badge">${e.classification==='fiction'?'Fictional prop':'Attributed allegation'}${e.checked?' • source checked':''}</span>${e.id==='S01.C5'?`<div>${button('source','Read source card')}</div>`:''}${e.id==='S01.C6'?`<div>${button('recorder','Check recorder')}</div>`:''}</article>`).join(''):'<p>Nothing yet. The desk is unlikely to search itself.</p>'}<div class="buttons">${button('back-search','Back to the mess')}</div>`);
  bind('source',sourceCard);bind('recorder',recorderPuzzle);bind('back-search',play);
}
function submit() {
  panel('submit', `<div class="eyebrow">First draft</div><h2>What are we going with?</h2><p>The editor wants a starting point for the assignment. Choose the basis for your draft.</p><div class="buttons">${button('report-basis','The published report',true)}${button('rumour-basis','The office rumour')}</div><p id="draft-feedback" role="status">Check the report source and get the recorder ready first.</p><div class="buttons">${button('back-search','Back to my notes')}</div>`);
  for(const basis of ['published-report','office-rumour'] as const) bind(basis==='published-report'?'report-basis':'rumour-basis',()=>{act({type:'submit-draft',basis}); const feedback=document.getElementById('draft-feedback');if(feedback)feedback.textContent=basis==='office-rumour'?'The editor has enough rumours. Bring the report, its source and a working recorder.':session.getState().lastMessage;});
  bind('back-search',play);
}
function resultScreen(){result();}
function result(){panel('result',`<div class="eyebrow">Assignment complete / K01</div><h2>You're officially on the beat.</h2><p>Six finds. One working recorder. An actual source. The editor calls this suspiciously competent.</p><p class="edition-card">“Right. City Hall. Try to come back with a story and our recorder.”</p><p class="muted">Next: Meanwhile at City Hall. That scene is still being built. Your first assignment is saved.</p><div class="buttons">${button('return-title','Back to title',true)}</div>`);bind('return-title',title);}
function pause(){panel('paused',`<div class="eyebrow">Hold the presses</div><h2>Coffee break.</h2><div class="buttons">${button('resume','Resume',true)}${button('return-title','Return to title')}</div><p class="muted">${memoryOnly?'Progress is temporary. Keep this tab open.':'Your progress is saved on this device.'}</p>`);bind('resume',play);bind('return-title',title);}
function settings(){panel('settings',`<h2>Keep it comfortable.</h2><label><input id="motion" type="checkbox" ${reducedMotion?'checked':''}> Reduce motion</label><p class="muted">This prototype is silent. Every cue is visible.</p><div class="buttons">${button('return-title','Back to title')}</div>`);document.getElementById('motion')!.addEventListener('change',e=>{reducedMotion=(e.target as HTMLInputElement).checked;renderer?.setReducedMotion(reducedMotion);});bind('return-title',title);}
function credits(){panel('credits',`<div class="eyebrow">Ford Frenzy</div><h2>jr42 productions</h2><p>Original fictional newsroom and game presentation. Powered by Minoo and PixiJS.</p><p class="muted">Approved S01 art proof: seven original generated exports, preserved unchanged. Production rights and final art review remain separate. Historical reporting is referenced, not reproduced as artwork. The Haps, its staff and their dialogue are fictional.</p><p><a href="${escapeHtml(scene.sources[0].url)}" target="_blank" rel="noopener noreferrer">Historical source: Toronto Star, May 16, 2013</a></p><div class="buttons">${button('return-title','Back to title')}</div>`);bind('return-title',title);}

async function boot(){
  if(loading)return; loading=true;
  panel('loading','<div class="eyebrow">jr42 productions</div><h2>Opening the Haps…</h2><p>Finding a clean desk may take longer.</p>');
  try{
    const response=await fetch('./assets/manifest.json');if(!response.ok)throw Error('Asset manifest is unavailable.');
    renderer=await createSceneRenderer({host:stage,scene,manifest:await response.json(),backgroundId:'S01.BG01',reducedMotion,onSelect:id=>{if(mode==='playing')act({type:'select',objectId:id});},labels:[{text:'Torrona Haps',x:1060,y:72,fontSize:46,rotation:.07,color:0x302c25},{text:'MAY 2013',x:98,y:147,fontSize:18,color:0x302c25},{text:'Su Mo Tu We Th Fr Sa\n          1  2  3  4\n 5  6  7  8  9 10 11\n12 13 14 15 16 17 18\n19 20 21 22 23 24 25\n26 27 28 29 30 31',x:98,y:175,fontSize:10,color:0x302c25},{text:'PATIO??',x:98,y:270,fontSize:16,color:0x8b3529}]});
    title();
  }catch(error){renderer?.dispose();renderer=undefined;panel('error',`<div class="eyebrow">Ford Frenzy</div><h2>The desk didn't load.</h2><p>${escapeHtml(error instanceof Error?error.message:'Unable to load required artwork.')}</p><p class="muted">Your saved progress has not been changed.</p><div class="buttons">${button('retry','Retry loading',true)}</div>`);bind('retry',()=>void boot());}
  finally{loading=false;}
}
document.querySelector('.wordmark')!.addEventListener('click',e=>{e.preventDefault();if(renderer)title();});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){if(mode==='playing')pause();else if(['paused','inspect','source','recorder','notebook','submit'].includes(mode))play();}
  if(e.key==='f' && !e.ctrlKey && !e.metaKey && !e.altKey){if(document.fullscreenElement)void document.exitFullscreen();else void document.getElementById('app')!.requestFullscreen().catch(()=>{});}
  if(e.key==='Tab' && overlay.firstChild){const nodes=[...overlay.querySelectorAll<HTMLElement>('button:not(:disabled),a,input')];const first=nodes[0],last=nodes.at(-1);if(e.shiftKey && document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first?.focus();}}
});
window.addEventListener('pagehide',event=>{if(!event.persisted)renderer?.dispose();});
Object.assign(window,{render_game_to_text:()=>JSON.stringify({mode,coordinates:'screen CSS pixels; origin top-left, x right, y down',targets:renderer?.getTargets()??[],state:session.getState(),memoryOnly}),advanceTime:(ms:number)=>renderer?.advanceTime(ms)});
void boot();

