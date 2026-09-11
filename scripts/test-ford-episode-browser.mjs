import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {preview} from 'vite';
import {chromium} from 'playwright';
const server=await preview({configFile:'vite.ford.config.ts',preview:{host:'127.0.0.1',port:0,open:false}});
const url=`http://127.0.0.1:${server.httpServer.address().port}`;
const browser=await chromium.launch();
async function testContext(options) {
  const context = await browser.newContext(options);
  context.setDefaultTimeout(20000);
  context.setDefaultNavigationTimeout(20000);
  return context;
}
await mkdir('test-results/ford',{recursive:true});
const records=[];
const s02Scene=JSON.parse(await readFile('games/ford-frenzy/data/s02.json','utf8'));
const saveKey='ford-frenzy.episode.save.v1';

// Play S01 to K01 using pointer targets, then land on the S01 receipt.
async function completeS01(page) {
  const state=()=>page.evaluate(()=>JSON.parse(window.render_game_to_text()));
  await page.locator('#new-game').click();
  await page.locator('#dialogue-skip').click();
  for (let i=1;i<=6;i++) {
    const target=(await state()).targets.find(t=>t.id===`S01.O${i}`);
    await page.mouse.click(target.x+target.width/2,target.y+target.height/2);
    if (i>4) await page.locator('#back-search').click();
  }
  await page.locator('#notebook').click();await page.locator('#source').click();
  await page.locator('#reading-report').click();await page.locator('#back-search').click();
  await page.locator('#notebook').click();await page.locator('#recorder').click();
  await page.locator('#recorder-cable').click();await page.locator('#back-search').click();
  await page.locator('#file-draft').click();await page.locator('#report-basis').click();
  await page.locator('#dialogue-skip').click();
  assert.equal((await state()).mode,'result');
  assert.equal((await state()).state.s01.k01Awarded,true);
}

// Find all six S02 objects from the current pointer targets.
async function findAllS02(page) {
  const state=()=>page.evaluate(()=>JSON.parse(window.render_game_to_text()));
  for (let i=1;i<=6;i++) {
    const target=(await state()).targets.find(t=>t.id===`S02.O${i}`);
    await page.mouse.click(target.x+target.width/2,target.y+target.height/2);
    if (i===3 || i===6) await page.locator('#back-search').click();
  }
  assert.equal((await state()).state.s02.foundIds.length,6);
}

try {
  {
    const context=await testContext({viewport:{width:1440,height:960},reducedMotion:'reduce'});
    const page=await context.newPage();
    const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
    const state=()=>page.evaluate(()=>JSON.parse(window.render_game_to_text()));
    await page.goto(url);
    await completeS01(page);
    assert.equal(await page.locator('#to-city-hall').isVisible(),true);
    await page.screenshot({path:'test-results/ford/s01-receipt-city-hall.png',fullPage:true});

    // Missing S02 asset retry: a failed preflight fetch must not commit the scene transition; S01 must remain unaffected.
    await page.route('**/s02-background.png',route=>route.abort());
    await page.locator('#to-city-hall').click();
    await page.locator('#retry-city-hall').waitFor();
    assert.equal((await state()).currentScene,'S01');
    assert.equal((await state()).state.s01.k01Awarded,true,'S01 progress must be unaffected by a failed S02 asset load');
    await page.screenshot({path:'test-results/ford/s02-asset-failure.png',fullPage:true});
    await page.unroute('**/s02-background.png');
    errors.length = 0; // the deliberate abort above logs its own benign "failed to load resource" console error
    // The successful transition reloads into a clean page (documented engine limitation on a
    // second live PixiJS Application) and resumes straight into the S02 opening conversation.
    await page.locator('#retry-city-hall').click();
    await page.locator('#dialogue-skip').waitFor();
    assert.equal((await state()).currentScene,'S02');
    await page.locator('#dialogue-skip').click();
    assert.equal((await state()).mode,'playing');
    assert.match(await page.locator('#hud').innerText(),/CITY HALL/i);
    assert.match(await page.locator('#hud').innerText(),/0\s*\/\s*6/i);
    assert.equal(await page.locator('.target-names span').count(),s02Scene.objects.length);
    await page.screenshot({path:'test-results/ford/s02-scene.png',fullPage:true});

    // History must offer S02 opening once City Hall is reached but not S02 closing before K02.
    await page.locator('#pause').click();await page.locator('#history').click();
    assert.equal(await page.locator('#history-s02-opening').isVisible(),true);
    assert.equal(await page.locator('#history-s02-closing').count(),0);
    const beforeReplay=await state();
    await page.locator('#history-s02-opening').click();assert.equal((await state()).mode,'conversation');
    await page.locator('#dialogue-next').click();await page.locator('#dialogue-back').click();await page.locator('#dialogue-skip').click();
    assert.deepEqual((await state()).state,beforeReplay.state,'replaying history must not mutate session state');
    await page.locator('#history-back').click();await page.locator('#resume').click();

    await findAllS02(page);
    assert.match(await page.locator('#hud').innerText(),/6\s*\/\s*6/i);

    // Wrong order and wrong interpretation retries must preserve finds and award nothing.
    await page.locator('#file-draft').click();
    assert.equal((await page.locator('#file-order-of-reports').isDisabled()),false);
    await page.locator('#order-17-16').click();
    await page.locator('#file-order-of-reports').click();
    assert.equal((await state()).state.s02.k02Awarded,false);
    assert.equal((await state()).state.s02.foundIds.length,6,'a wrong timeline retry must preserve finds');
    await page.screenshot({path:'test-results/ford/s02-timeline-retry.png',fullPage:true});
    await page.locator('#order-16-17').click();
    await page.locator('#file-proof-of-allegation').click();
    assert.equal((await state()).state.s02.k02Awarded,false);
    assert.equal((await state()).state.s02.foundIds.length,6);

    // Correct order and interpretation award K02 once and open the closing conversation.
    await page.locator('#order-16-17').click();
    await page.locator('#file-order-of-reports').click();
    assert.equal((await state()).mode,'conversation');
    assert.equal((await state()).state.s02.k02Awarded,true);
    assert.match(await page.locator('.spoken-line').innerText(),/Corridor's filed/i);
    const completedSnapshot=await state();
    await page.screenshot({path:'test-results/ford/s02-closing.png',fullPage:true});
    await page.locator('#dialogue-next').click();await page.locator('#dialogue-next').click();await page.locator('#dialogue-next').click();
    assert.equal((await state()).mode,'result');
    assert.match(await page.locator('body').innerText(),/Not available yet/i);
    assert.equal(await page.locator('#to-city-hall').count(),0,'S03 must have no entry control in this slice');
    await page.screenshot({path:'test-results/ford/s02-receipt.png',fullPage:true});
    const notebookK02Count=(await state()).state.notebook.filter(e=>e.id==='K02').length;
    assert.equal(notebookK02Count,1);

    // No double K02: reloading a completed S02 (and play() re-routing straight to its receipt,
    // never back into search) must not re-run the award and must keep exactly one K02 entry.
    await page.reload();await page.locator('#continue').waitFor();await page.locator('#continue').click();
    assert.equal((await state()).mode,'result');
    assert.equal((await state()).state.notebook.filter(e=>e.id==='K02').length,1);
    assert.equal((await state()).state.s02.k02Awarded,true);

    // History now exposes both S02 conversations without mutating state.
    await page.locator('#history').click();
    assert.equal(await page.locator('#history-s02-closing').isVisible(),true);
    const beforeClosingReplay=await state();
    await page.locator('#history-s02-closing').click();await page.locator('#dialogue-skip').click();
    assert.deepEqual((await state()).state,beforeClosingReplay.state);
    await page.locator('#history-back').click();

    assert.deepEqual(errors,[]);
    await context.close();
    records.push({input:'S01 to S02 transition, wrong/right timeline retries, K02 once, history',status:'passed',errors});
  }

  {
    // Exact partial-S02 reload: found objects, hint count and un-filed timeline order survive a reload.
    const context=await testContext({viewport:{width:1440,height:960},reducedMotion:'reduce'});
    const page=await context.newPage();
    const state=()=>page.evaluate(()=>JSON.parse(window.render_game_to_text()));
    await page.goto(url);
    await completeS01(page);
    await page.locator('#to-city-hall').click();
    await page.locator('#dialogue-skip').waitFor();
    await page.locator('#dialogue-skip').click();
    for (let i=1;i<=3;i++) {
      const target=(await state()).targets.find(t=>t.id===`S02.O${i}`);
      await page.mouse.click(target.x+target.width/2,target.y+target.height/2);
    }
    await page.locator('#hint').click();
    const before=await state();
    assert.equal(before.state.s02.foundIds.length,3);
    await page.reload();await page.locator('#continue').waitFor();await page.locator('#continue').click();
    assert.deepEqual((await state()).state,before.state,'reload mid-S02 must restore exact scene/hint/notebook state');
    assert.equal((await state()).currentScene,'S02');
    await context.close();
    records.push({input:'partial S02 reload restores exact state',status:'passed'});
  }

  {
    // Legacy pre-episode S01 v1 save imports explicitly and is never overwritten by a bad episode save.
    const context=await testContext();
    const page=await context.newPage();
    await page.addInitScript(()=>{
      localStorage.setItem('ford-frenzy.s01.save.v1', JSON.stringify({
        version: 1, sceneRevision: 'ford-frenzy-s01-v2-embedded-clipping-2026-09-07',
        actions: [{ type: 'select', objectId: 'S01.O1' }],
      }));
    });
    await page.goto(url);await page.locator('#new-game').waitFor();
    assert.equal(await page.locator('#continue').isDisabled(),false);
    await page.locator('#continue').click();
    const imported=await page.evaluate(()=>JSON.parse(window.render_game_to_text()));
    assert.deepEqual(imported.state.s01.foundIds,['S01.O1']);
    assert.equal(await page.evaluate(()=>localStorage.getItem('ford-frenzy.s01.save.v1')!==null),true,'legacy save key must be preserved untouched');
    await context.close();
    records.push({input:'legacy S01 v1 save imports explicitly into the episode session',status:'passed'});
  }

  {
    // A corrupted episode save is never silently overwritten on load.
    const context=await testContext();
    const page=await context.newPage();
    await page.addInitScript(key=>localStorage.setItem(key,'not-json'),saveKey);
    await page.goto(url);await page.locator('#new-game').waitFor();
    assert.equal(await page.locator('#continue').isDisabled(),true);
    assert.equal(await page.evaluate(key=>localStorage.getItem(key),saveKey),'not-json');
    await page.locator('#new-game').click();await page.locator('#cancel-new').click();
    assert.equal(await page.evaluate(key=>localStorage.getItem(key),saveKey),'not-json');
    await context.close();
    records.push({input:'corrupted episode save preserved until confirmed new game',status:'passed'});
  }

  console.log(JSON.stringify(records,null,2));
} finally {
  await writeFile('test-results/ford/episode-results.json',JSON.stringify(records,null,2));
  await browser.close();
  await new Promise(r=>server.httpServer.close(r));
}
