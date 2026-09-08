import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdir,rm,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {preview} from 'vite';
import {chromium} from 'playwright';

const root=fileURLToPath(new URL('..',import.meta.url));
const output=new URL('../test-results/',import.meta.url);
async function buildProduction(){
 await new Promise((resolve,reject)=>{
  const windows=process.platform==='win32';
  const command=windows?(process.env.ComSpec??'cmd.exe'):'npm';
  const args=windows?['/d','/s','/c','npm.cmd run build']:['run','build'];
  const child=spawn(command,args,{cwd:root,stdio:'inherit'});
  child.once('error',reject);
  child.once('exit',(code,signal)=>code===0?resolve():reject(new Error(`${command} ${args.join(' ')} failed (${signal??code})`)));
 });
}

await buildProduction();
const server=await preview({root,preview:{host:'127.0.0.1',port:0,open:false},logLevel:'error'});
const address=server.httpServer.address();
if(!address||typeof address==='string') throw new Error('Preview server did not expose a local port.');
const baseUrl=`http://127.0.0.1:${address.port}`;
await mkdir(output,{recursive:true});
for(const renderer of ['pixi','phaser']) for(const suffix of ['-desktop.png','-mobile.png','-failure.png']) await rm(new URL(`${renderer}${suffix}`,output),{force:true});

let browser;
const results=[];
try {
 browser=await chromium.launch({headless:true});
 for(const renderer of ['pixi','phaser']) {
  console.log('checking',renderer);
  const context=await browser.newContext({viewport:{width:900,height:650},hasTouch:true,reducedMotion:'reduce'});
  const page=await context.newPage();
  page.setDefaultTimeout(10000);
  const errors=[];
  page.on('pageerror',error=>errors.push(String(error)));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text())});
  let blocked=true;
  await page.route('**/assets/S01.O3.png*',route=>blocked?route.abort():route.continue());
  try {
   await page.goto(`${baseUrl}/?renderer=${renderer}`);
   await page.waitForFunction(()=>document.querySelector('#status')?.textContent?.includes('failed'));
   assert.match((await page.locator('#live').textContent()).toLowerCase(),/retry/,`${renderer}: failure path not announced`);
   errors.length=0; // The deliberately aborted request is the expected failure probe.
   blocked=false;
   await page.locator('#retry').click();
   await page.waitForFunction(()=>document.querySelector('#status')?.textContent?.includes('ready'));
   assert.equal(await page.locator('canvas').count(),1,`${renderer}: retry must leave exactly one canvas`);

   await page.locator('button[data-target="S01.O4"]').click();
   assert.match(await page.locator('#live').textContent(),/S01\.O4/,`${renderer}: target control failed`);
   await page.keyboard.press('ArrowRight');
   assert.match(await page.locator('#live').textContent(),/S01\.O5/,`${renderer}: keyboard target failed`);

   const canvas=page.locator('canvas');
   const box=await canvas.boundingBox();
   assert.ok(box,`${renderer}: canvas bounds missing`);
   const target={x:box.x+box.width*.44,y:box.y+box.height*.55};
   await page.mouse.click(target.x,target.y);
   assert.equal(await page.evaluate(()=>window.rendererEvidence.targetEvents.at(-1)),'S01.O3',`${renderer}: pointer must hit the expected sprite ID`);
   const pointerCount=await page.evaluate(()=>window.rendererEvidence.targetEvents.length);
   await page.mouse.click(box.x+5,box.y+box.height-5);
   assert.equal(await page.evaluate(()=>window.rendererEvidence.targetEvents.length),pointerCount,`${renderer}: outside-sprite click must not dispatch a target`);

   const before=await page.evaluate(()=>document.documentElement.dataset.reduced||'false');
   await page.locator('#motion').click();
   const after=await page.evaluate(()=>document.documentElement.dataset.reduced);
   assert.notEqual(before,after,`${renderer}: reduced-motion control signal did not change`);
   await page.touchscreen.tap(target.x,target.y);
   assert.equal(await page.evaluate(()=>window.rendererEvidence.targetEvents.at(-1)),'S01.O3',`${renderer}: touch must hit the expected sprite ID`);

   await page.screenshot({path:fileURLToPath(new URL(`${renderer}-desktop.png`,output)),fullPage:true});
   await page.setViewportSize({width:390,height:700});
   await page.waitForTimeout(100);
   const dimensions=await canvas.evaluate(element=>({width:element.width,height:element.height}));
   assert.ok(dimensions.width>=300&&dimensions.height>=200,`${renderer}: resize did not reach canvas`);
   await page.screenshot({path:fileURLToPath(new URL(`${renderer}-mobile.png`,output)),fullPage:true});
   assert.deepEqual(errors,[],`${renderer}: browser errors`);
   results.push({renderer,outcome:'passed',consoleErrors:errors});
   console.log('ready',renderer);
  } catch(error) {
   results.push({renderer,outcome:'failed',error:String(error),consoleErrors:errors});
   await page.screenshot({path:fileURLToPath(new URL(`${renderer}-failure.png`,output)),fullPage:true}).catch(()=>{});
   throw error;
  } finally {
   await context.close();
  }
 }
 console.log('renderer browser checks passed: production preview, abort/retry, single canvas, controls, stable-ID pointer/touch hits, negative hit, reduced-motion signal, resize, screenshots and browser errors');
} finally {
 await writeFile(new URL('browser-results.json',output),JSON.stringify({results},null,2)+'\n');
 await browser?.close();
 await new Promise((resolve,reject)=>server.httpServer.close(error=>error?reject(error):resolve()));
}
