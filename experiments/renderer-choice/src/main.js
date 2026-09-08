import './style.css';
const params = new URLSearchParams(location.search); const buildChoice=import.meta.env.VITE_RENDERER; const choice = buildChoice || params.get('renderer') || 'pixi';
const targets = ['S01.O1','S01.O2','S01.O3','S01.O4','S01.O5','S01.O6'];
const urls = ['background.png', ...targets.map((x)=>`${x}.png`)].map((x)=>`/assets/${x}`); let attempt=0;
const status = document.querySelector('#status'); const live = document.querySelector('#live'); const stage = document.querySelector('#stage');
const controls = document.querySelector('#controls');
controls.innerHTML = `<button id="retry">Retry assets</button><button id="motion">Toggle reduced motion</button><span id="scene-label"></span>`;
const sceneLabel = document.querySelector('#scene-label'); let selected=0; let reduced=false; let runtime;
window.rendererEvidence={targetEvents:[]};
function targetClicked(id){window.rendererEvidence.targetEvents.push(id);announce(`Target clicked ${id}`)}
function announce(message){ live.textContent=message; }
function select(i){selected=(i+targets.length)%targets.length; sceneLabel.textContent=` Target ${targets[selected]}`; runtime?.select(selected); announce(`Selected ${targets[selected]}`);}
targets.forEach((id,i)=>{const b=document.createElement('button');b.textContent=id;b.dataset.target=id;b.addEventListener('click',()=>select(i));controls.append(b);});
document.addEventListener('keydown',(e)=>{if(e.key==='ArrowRight'||e.key==='ArrowDown')select(selected+1); if(e.key==='ArrowLeft'||e.key==='ArrowUp')select(selected-1);});
document.querySelector('#motion').addEventListener('click',()=>{reduced=!reduced; document.documentElement.dataset.reduced=reduced?'true':'false'; announce(`Reduced motion ${reduced?'on':'off'}`);});
document.querySelector('#retry').addEventListener('click',()=>runtime?.load() ?? boot());
async function boot(){
  status.textContent=`${choice} loading`; stage.replaceChildren();
  const attemptUrls=urls.map((url)=>`${url}?attempt=${attempt++}`);
  const onStatus=(x)=>{status.textContent=x;if(x.includes('failed')) announce('Asset load failed; use Retry assets')};
  runtime = choice==='phaser' ? await import('./phaser.js').then(m=>m.create({stage,urls:attemptUrls,onStatus,onSelect:targetClicked})) : await import('./pixi.js').then(m=>m.create({stage,urls:attemptUrls,onStatus,onSelect:targetClicked}));
  select(0);
}
boot().catch((e)=>{status.textContent='load failed: '+e.message; announce('Asset load failed; use Retry assets');});
