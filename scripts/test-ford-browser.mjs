import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {preview} from 'vite';
import {chromium} from 'playwright';
const server=await preview({configFile:'vite.ford.config.ts',preview:{host:'127.0.0.1',port:0,open:false}});
const url=`http://127.0.0.1:${server.httpServer.address().port}`;
const browser=await chromium.launch();
await mkdir('test-results/ford',{recursive:true});
const records=[];
const saveKey='ford-frenzy.s01.save.v1';
try{
  for(const input of ['pointer','touch','keyboard']){
    const context=await browser.newContext({viewport:input==='touch'?{width:390,height:844}:{width:1440,height:960},hasTouch:input==='touch',reducedMotion:'reduce'});
    const page=await context.newPage();const errors=[];
    page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
    const state=()=>page.evaluate(()=>JSON.parse(window.render_game_to_text()));
    const press=async selector=>{if(input==='keyboard'){await page.locator(selector).focus();await page.keyboard.press('Enter');}else if(input==='touch')await page.locator(selector).tap();else await page.locator(selector).click();};
    await page.goto(url);await page.locator('#new-game').waitFor();
    if(input==='pointer')await page.screenshot({path:'test-results/ford/title.png',fullPage:true});
    assert(await page.locator('#continue').isDisabled());
    await press('#settings');assert(await page.locator('#motion').isChecked());await press('#return-title');assert.equal(await page.evaluate(()=>document.activeElement.id),'settings');
    await press('#credits');await press('#return-title');assert.equal(await page.evaluate(()=>document.activeElement.id),'credits');
    await press('#new-game');await press('#start-assignment');
    await page.screenshot({path:`test-results/ford/${input}-scene.png`,fullPage:true});
    // A click in an empty piece of the scene must not count as a target.
    const canvas=await page.locator('canvas').boundingBox();await page.mouse.click(canvas.x+canvas.width*.52,canvas.y+canvas.height*.35);
    assert.equal((await state()).state.foundIds.length,0);
    for(let i=1;i<=6;i++){
      if(i===3 && input==='pointer'){await page.setViewportSize({width:1000,height:850});await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));}
      if(input==='keyboard'){
        if(!await page.locator('details').evaluate(e=>e.open))await press('summary');
        await press(`[id="target-S01.O${i}"]`);
      }else{
        const target=(await state()).targets.find(t=>t.id===`S01.O${i}`);
        if(input==='touch')await page.touchscreen.tap(target.x+target.width/2,target.y+target.height/2);
        else await page.mouse.click(target.x+target.width/2,target.y+target.height/2);
      }
      assert.equal((await state()).mode,'inspect',`target O${i} inspection`);
      assert.equal((await state()).state.foundIds.length,i);
      await press('#back-search');
      if(input==='keyboard')assert.equal(await page.evaluate(()=>document.activeElement.id),`target-S01.O${i}`);
    }
    assert.equal((await state()).state.k01Awarded,false);
    await press('#file-draft');await press('#rumour-basis');assert.equal((await state()).state.k01Awarded,false);await press('#back-search');
    await press('#notebook');assert.equal(await page.getByText(/source card|source checked/i).count(),0);await press('#back-search');
    await press('#notebook');await press('#recorder');await press('#phone-cable');assert.equal((await state()).state.chargerPaired,'phone');await press('#recorder-cable');assert.equal((await state()).state.chargerPaired,'recorder');await press('#back-search');
    await press('#pause');const before=(await state()).state;await page.keyboard.press('Escape');assert.deepEqual((await state()).state,before);assert.equal(await page.evaluate(()=>document.activeElement.id),'pause');
    await page.reload();await page.locator('#continue').waitFor();await press('#continue');assert.deepEqual((await state()).state,before);
    await press('#file-draft');await press('#report-basis');assert.equal((await state()).mode,'result');assert.equal((await state()).state.k01Awarded,true);assert.deepEqual((await state()).state.sourceChecks,[]);
    await page.screenshot({path:`test-results/ford/${input}-result.png`,fullPage:true});
    await press('#return-title');await press('#new-game');await press('#cancel-new');assert.equal((await state()).state.k01Awarded,true);assert.deepEqual((await state()).state.sourceChecks,[]);
    assert.equal(await page.locator('canvas').count(),1);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    assert.deepEqual(errors,[]);records.push({input,status:'passed',errors});await context.close();
  }
  const context=await browser.newContext();const page=await context.newPage();
  await page.addInitScript(key=>localStorage.setItem(key,'broken-save'),saveKey);
  await page.goto(url);await page.locator('#new-game').waitFor();assert(await page.locator('#continue').isDisabled());
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),saveKey),'broken-save');
  await page.locator('#new-game').click();await page.locator('#cancel-new').click();assert.equal(await page.evaluate(key=>localStorage.getItem(key),saveKey),'broken-save');
  await context.close();records.push({input:'corrupt save preserved',status:'passed'});
  const failContext=await browser.newContext();const failPage=await failContext.newPage();
  await failPage.route('**/S01.O6.png',route=>route.abort());await failPage.goto(url);await failPage.locator('#retry').waitFor();assert.equal(await failPage.locator('canvas').count(),0);
  await failPage.locator('#return-title').click();await failPage.locator('#settings').click();await failPage.locator('#return-title').click();await failPage.locator('#new-game').click();await failPage.locator('#retry').waitFor();
  await failPage.unroute('**/S01.O6.png');await failPage.locator('#retry').click();await failPage.locator('#new-game').waitFor();assert.equal(await failPage.locator('canvas').count(),1);
  await failContext.close();records.push({input:'required texture failure and retry',status:'passed'});
  console.log(JSON.stringify(records,null,2));
}finally{await writeFile('test-results/ford/results.json',JSON.stringify(records,null,2));await browser.close();await new Promise(r=>server.httpServer.close(r));}

