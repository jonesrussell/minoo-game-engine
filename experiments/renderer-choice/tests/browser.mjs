import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('..',import.meta.url));
await mkdir(new URL('../test-results/',import.meta.url),{recursive:true});
const command=process.platform==='win32'?'npm.cmd':'npm';
const server=spawn(command,['run','dev','--','--port','4173'],{cwd:root,stdio:'ignore',shell:process.platform==='win32'});
await new Promise(r=>setTimeout(r,1500));
const browser=await chromium.launch({headless:true});
try {
 for(const renderer of ['pixi','phaser']) {
  console.log('checking',renderer);
  const page=await browser.newPage({viewport:{width:900,height:650},reducedMotion:'reduce'});
  let blocked=true;
  await page.route('**/assets/S01.O3.png*',route=>blocked?route.abort():route.continue());
  await page.goto(`http://127.0.0.1:4173/?renderer=${renderer}`);
  await page.waitForFunction(()=>document.querySelector('#status')?.textContent?.includes('failed'));
  if(!((await page.locator('#live').textContent()).toLowerCase()).includes('retry')) throw new Error(`${renderer}: failure path not announced`);
  blocked=false; await page.locator('#retry').click();
  await page.waitForFunction(()=>document.querySelector('#status')?.textContent?.includes('ready'));
  console.log('ready',renderer);
  if(await page.locator('canvas').count()!==1) throw new Error(`${renderer}: canvas missing`);
  await page.locator('button[data-target="S01.O4"]').click();
  if(!(await page.locator('#live').textContent()).includes('S01.O4')) throw new Error(`${renderer}: target control failed`);
  await page.keyboard.press('ArrowRight');
  if(!(await page.locator('#live').textContent()).includes('S01.O5')) throw new Error(`${renderer}: keyboard target failed`);
  await page.locator('canvas').click({position:{x:160,y:250}});
  if(!(await page.locator('#live').textContent()).includes('Target clicked')) throw new Error(`${renderer}: canvas sprite pointer hit failed`);
  const before=await page.evaluate(()=>document.documentElement.dataset.reduced||'false');
  await page.locator('#motion').click(); const after=await page.evaluate(()=>document.documentElement.dataset.reduced);
  if(before===after) throw new Error(`${renderer}: reduced motion did not change`);
  await page.locator('canvas').dispatchEvent('pointerdown',{clientX:160,clientY:250,pointerType:'touch'});
  if(!(await page.locator('#live').textContent()).includes('Target clicked')) throw new Error(`${renderer}: canvas touch hit failed`);
  await page.setViewportSize({width:390,height:700}); await page.waitForTimeout(100);
  const dims=await page.locator('canvas').evaluate(c=>({w:c.width,h:c.height}));
  if(dims.w<300||dims.h<200) throw new Error(`${renderer}: resize did not reach canvas`);
  await page.screenshot({path:`test-results/${renderer}-desktop.png`,fullPage:true});
  await page.screenshot({path:`test-results/${renderer}-mobile.png`,fullPage:true});
  await page.close();
 }
 console.log('renderer browser checks passed: server lifecycle, abort/retry, canvas, target controls, keyboard, pointer/touch dispatch, reduced motion, resize, screenshots');
} finally { await browser.close(); server.kill(); }
