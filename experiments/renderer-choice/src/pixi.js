import {Application, Assets, Container, Sprite, Text} from 'pixi.js';
export async function create({stage,urls,onStatus,onSelect}){
 let app,root,assets;
 async function load(){onStatus('pixi loading'); try { assets=await Promise.all(urls.map((url)=>Assets.load(url))); if(!app){app=new Application(); await app.init({backgroundColor:0x121820,resizeTo:stage,antialias:true,autoStart:false}); stage.append(app.canvas); root=new Container(); app.stage.addChild(root); app.ticker.add(()=>{root.rotation=document.documentElement.dataset.reduced==='true'?0:Math.sin(performance.now()/1800)*.003});} render(); app.start(); onStatus('pixi ready'); } catch(e){onStatus('pixi load failed: '+e.message); throw e;} }
 function render(){root.removeChildren(); const bg=Sprite.from(assets[0]); bg.width=app.screen.width; bg.height=app.screen.height; root.addChild(bg); assets.slice(1).forEach((texture,i)=>{const s=new Sprite(texture); s.label=targets[i]; s.anchor.set(.5); s.x=app.screen.width*(.18+i*.13); s.y=app.screen.height*.55; s.width=110;s.height=80;s.eventMode='static'; s.cursor='pointer'; s.on('pointertap',()=>onSelect(targets[i])); root.addChild(s)}); root.addChild(new Text({text:'PixiJS • ticker + Assets • pointertap',style:{fill:'white',fontSize:14}}));}
 const targets=['S01.O1','S01.O2','S01.O3','S01.O4','S01.O5','S01.O6'];
 function select(i){if(root) root.children.slice(1,7).forEach((s,n)=>s.alpha=n===i?1:.62)}
 window.addEventListener('resize',()=>{if(app)render()}); await load(); return {load,select};
}
