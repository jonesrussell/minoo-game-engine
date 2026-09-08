import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {preview} from 'vite';
import {chromium} from 'playwright';
const server=await preview({configFile:'vite.ford.config.ts',preview:{host:'127.0.0.1',port:0,open:false}});
const url=`http://127.0.0.1:${server.httpServer.address().port}`;
const browser=await chromium.launch();
await mkdir('test-results/ford',{recursive:true});
const records=[];
const scene=JSON.parse(await readFile('games/ford-frenzy/data/s01.json','utf8'));
const saveKey='ford-frenzy.s01.save.v1';
try{
  for(const input of ['pointer','touch','keyboard']){
    const context=await browser.newContext({viewport:input==='touch'?{width:390,height:844}:{width:1440,height:960},hasTouch:input==='touch',reducedMotion:'reduce'});
    const external=[];await context.route('**/*',route=>{if(new URL(route.request().url()).origin!==new URL(url).origin){external.push(route.request().url());return route.abort();}return route.continue();});
    const page=await context.newPage();const errors=[];
    page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
    const state=()=>page.evaluate(()=>JSON.parse(window.render_game_to_text()));
    const press=async selector=>{if(input==='keyboard'){await page.locator(selector).focus();await page.keyboard.press('Enter');}else if(input==='touch')await page.locator(selector).tap();else await page.locator(selector).click();};
    await page.goto(url);await page.locator('#new-game').waitFor();
    await page.locator('.title-art').evaluate(async image => { await image.decode(); });
    assert.equal(await page.locator('.title-art').evaluate(image => image.naturalWidth > 0),true);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    await page.screenshot({path:`test-results/ford/${input}-title.png`,fullPage:true});
    if(input==='pointer')await page.screenshot({path:'test-results/ford/title.png',fullPage:true});
    assert(await page.locator('#continue').isDisabled());
    await press('#settings');assert(await page.locator('#motion').isChecked());
    if(input==='keyboard'){await page.locator('#mute').focus();await page.keyboard.press('Space');}else await page.locator('#mute').check();
    await page.locator('#volume').fill('35');await page.locator('#volume').dispatchEvent('input');
    await press('#test-sound');assert.match(await page.locator('#sound-status').innerText(),/muted/);
    assert.equal(await page.locator('.panel').evaluate(el=>getComputedStyle(el).animationName),'none');
    await press('#return-title');assert.equal(await page.evaluate(()=>document.activeElement.id),'settings');
    await page.reload();await press('#settings');assert(await page.locator('#mute').isChecked());assert.equal(await page.locator('#volume').inputValue(),'35');
    if(input==='pointer'){await page.locator('#mute').uncheck();await press('#test-sound');}
    await page.screenshot({path:`test-results/ford/${input}-settings.png`,fullPage:true});
    await press('#return-title');
    await press('#credits');await press('#return-title');assert.equal(await page.evaluate(()=>document.activeElement.id),'credits');
    await press('#new-game');
    assert.equal((await state()).mode,'conversation');
    assert.equal(await page.locator('img.character-portrait').count(),2);
    for(const portrait of await page.locator('img.character-portrait').all()) { await portrait.evaluate(async image => { await image.decode(); }); assert.equal(await portrait.evaluate(image => image.naturalWidth > 0),true); }
    assert.equal(await page.locator('.speaker-name').count(),1);
    assert.match(await page.locator('.spoken-line').innerText(),/Welcome to the Haps/i);
    assert.match(await page.locator('.character-slot.speaking').getAttribute('class'),/elliot/);
    assert.equal((await state()).state.foundIds.length,0);
    assert.equal(await page.locator('canvas').count(),1);
    assert.equal(await page.locator('#stage').getAttribute('inert'),'');
    const conversationCanvas=await page.locator('canvas').boundingBox();
    await page.mouse.click(conversationCanvas.x+conversationCanvas.width*.5,conversationCanvas.y+conversationCanvas.height*.5);
    assert.equal((await state()).state.foundIds.length,0);
    await page.screenshot({path:`test-results/ford/${input}-dialogue-first.png`,fullPage:true});
    await press('#dialogue-next');
    assert.match(await page.locator('.speaker-name').innerText(),/Alex/i);
    assert.match(await page.locator('.spoken-line').innerText(),/chair/i);
    assert.match(await page.locator('.character-slot.speaking').getAttribute('class'),/alex/);
    if(input!=='keyboard') await page.screenshot({path:`test-results/ford/${input}-dialogue-second.png`,fullPage:true});
    await press('#dialogue-back');
    assert.match(await page.locator('.speaker-name').innerText(),/Elliot/i);
    assert.match(await page.locator('.spoken-line').innerText(),/Welcome to the Haps/i);
    assert.match(await page.locator('.character-slot.speaking').getAttribute('class'),/elliot/);
    await press('#dialogue-next');await press('#dialogue-next');
    assert.match(await page.locator('.spoken-line').innerText(),/folder|recorder|coffee/i);
    await press('#dialogue-next');
    assert.equal((await state()).mode,'assignment');
    assert.match(await page.locator('.assignment-slip').innerText(),/GET YOUR KIT/i);
    await page.screenshot({path:`test-results/ford/${input}-assignment.png`,fullPage:true});await press('#start-assignment');
    await page.screenshot({path:`test-results/ford/${input}-scene.png`,fullPage:true});
    // A click in an empty piece of the scene must not count as a target.
    const canvas=await page.locator('canvas').boundingBox();await page.mouse.click(canvas.x+canvas.width*.52,canvas.y+canvas.height*.35);
    assert.equal((await state()).state.foundIds.length,0);
    assert.equal(await page.locator('[id^="target-S01."]').count(),0);
    if(input==='keyboard'){
      await press('#keyboard-search');
      assert.equal(await page.evaluate(()=>document.activeElement.id),'stage');
      const before=(await state()).state;
      await page.keyboard.press('Enter');assert.equal((await state()).mode,'playing');
      assert.deepEqual((await state()).state,before);
      await page.keyboard.press('ArrowRight');assert.deepEqual((await state()).state,before);
      await page.screenshot({path:'test-results/ford/keyboard-cursor.png',fullPage:true});
      await page.keyboard.press('Tab');assert.notEqual(await page.evaluate(()=>document.activeElement.id),'stage');
    }
    for(let i=1;i<=6;i++){
      if(i===3 && input==='pointer'){await page.setViewportSize({width:1000,height:850});await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));}
      if(input==='keyboard'){
        await press('#keyboard-search');
        const object=scene.objects.find(o=>o.id===`S01.O${i}`);
        for(const [axis,positive,negative] of [['x','ArrowRight','ArrowLeft'],['y','ArrowDown','ArrowUp']]){
          const size=axis==='x'?'width':'height';
          const goal=Math.round((object[axis]+object[size]/2)/10)*10;
          while(Math.abs((await state()).keyboardCursor[axis]-goal)>=10){
            const delta=goal-(await state()).keyboardCursor[axis];
            await page.keyboard.press((Math.abs(delta)<40?'Shift+':'')+(delta>0?positive:negative));
          }
        }
        assert.equal((await state()).state.foundIds.length,i-1,'Movement must not discover objects');
        assert.doesNotMatch(await page.locator('#search-location').innerText(),/notebook|clipping|recorder|calendar|contact sheet|assignment folder/i);
        await page.keyboard.press('Enter');
      }else{
        const target=(await state()).targets.find(t=>t.id===`S01.O${i}`);
        if(input==='touch')await page.touchscreen.tap(target.x+target.width/2,target.y+target.height/2);
        else await page.mouse.click(target.x+target.width/2,target.y+target.height/2);
      }
      assert.equal((await state()).mode,'inspect',`target O${i} inspection`);
      assert.equal((await state()).state.foundIds.length,i);
      await press('#back-search');
      if(input==='keyboard')assert.equal(await page.evaluate(()=>document.activeElement.id),'stage');
    }
    assert.equal((await state()).state.k01Awarded,false);
    await press('#file-draft');await press('#rumour-basis');assert.equal((await state()).state.k01Awarded,false);await press('#back-search');
    await press('#notebook');await press('#source');
    assert.equal(await page.locator('a[href^="http"]').count(),0);
    assert.match(await page.locator('.clipping').innerText(),/Hogtown Howler/);
    assert.doesNotMatch(await page.locator('body').innerText(),/Toronto Star|Doolittle|Donovan/);
    await press('#reading-proof');assert.deepEqual((await state()).state.sourceChecks,[]);
    await page.screenshot({path:`test-results/ford/${input}-clipping.png`,fullPage:true});
    await press('#reading-report');assert.deepEqual((await state()).state.sourceChecks,['S01.C5']);
    await press('#back-search');
    await press('#notebook');await press('#recorder');assert.match(await page.locator('#phone-cable').innerText(),/Cable A/i);assert.match(await page.locator('#recorder-cable').innerText(),/Cable B/i);
    await page.screenshot({path:`test-results/ford/${input}-recorder.png`,fullPage:true});
    await press('#phone-cable');assert.equal((await state()).state.chargerPaired,'phone');await press('#recorder-cable');assert.equal((await state()).state.chargerPaired,'recorder');assert(await page.locator('#recorder-cable').isDisabled());assert.match(await page.locator('.recorder-display').innerText(),/READY/);await press('#back-search');
    await press('#pause');const before=(await state()).state;await page.keyboard.press('Escape');assert.deepEqual((await state()).state,before);assert.equal(await page.evaluate(()=>document.activeElement.id),'pause');
    await page.reload();await page.locator('#continue').waitFor();await press('#continue');assert.deepEqual((await state()).state,before);
    await press('#file-draft');await press('#report-basis');assert.equal((await state()).mode,'result');assert.equal((await state()).state.k01Awarded,true);assert.deepEqual((await state()).state.sourceChecks,['S01.C5']);
    await page.screenshot({path:`test-results/ford/${input}-result.png`,fullPage:true});
    await press('#return-title');await press('#new-game');await press('#cancel-new');assert.equal((await state()).state.k01Awarded,true);assert.deepEqual((await state()).state.sourceChecks,['S01.C5']);
    assert.equal(await page.locator('canvas').count(),1);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    assert.deepEqual(errors,[]);assert.deepEqual(external,[]);records.push({input,status:'passed',errors});await context.close();
  }
  const context=await browser.newContext();const page=await context.newPage();
  await page.addInitScript(key=>localStorage.setItem(key,'broken-save'),saveKey);
  await page.goto(url);await page.locator('#new-game').waitFor();assert(await page.locator('#continue').isDisabled());
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),saveKey),'broken-save');
  await page.locator('#new-game').click();await page.locator('#cancel-new').click();assert.equal(await page.evaluate(key=>localStorage.getItem(key),saveKey),'broken-save');
  await context.close();records.push({input:'corrupt save preserved',status:'passed'});
  const portraitContext=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});
  const portraitPage=await portraitContext.newPage();
  await portraitPage.route('**/dialogue-*.png',route=>route.abort());
  await portraitPage.goto(url);await portraitPage.locator('#new-game').tap();
  assert.equal(await portraitPage.evaluate(()=>JSON.parse(window.render_game_to_text()).mode),'conversation');
  assert.equal(await portraitPage.locator('.speaker-name').isVisible(),true);
  assert.equal(await portraitPage.locator('.spoken-line').isVisible(),true);
  await portraitPage.locator('.portrait-fallback').first().waitFor({state:'visible'});
  assert.equal(await portraitPage.locator('.portrait-fallback:visible').count(),2);
  await portraitPage.locator('#dialogue-skip').tap();assert.equal(await portraitPage.locator('.assignment-slip').isVisible(),true);await portraitPage.locator('#start-assignment').tap();
  assert.equal(await portraitPage.evaluate(()=>JSON.parse(window.render_game_to_text()).mode),'playing');
  await portraitContext.close();records.push({input:'broken dialogue portraits remain playable',status:'passed'});  for(const failure of ['missing','blocked']){
  const silentContext=await browser.newContext();const silentPage=await silentContext.newPage();const silentErrors=[];silentPage.on('pageerror',e=>silentErrors.push(String(e)));
  await silentPage.addInitScript(failure=>{class BlockedAudio{state='suspended';resume(){return Promise.reject(new Error('policy'));}suspend(){return Promise.resolve();}close(){return Promise.resolve();}}Object.defineProperty(window,'AudioContext',{value:failure==='blocked'?BlockedAudio:undefined});Object.defineProperty(window,'webkitAudioContext',{value:undefined});},failure);
  await silentPage.goto(url);await silentPage.locator('#settings').click();await silentPage.locator('#test-sound').click();assert.match(await silentPage.locator('#sound-status').innerText(),/unavailable/);
  await silentPage.locator('#return-title').click();await silentPage.locator('#new-game').click();await silentPage.locator('#dialogue-skip').click();await silentPage.locator('#start-assignment').click();assert.equal(await silentPage.evaluate(()=>JSON.parse(window.render_game_to_text()).mode),'playing');assert.deepEqual(silentErrors,[]);await silentContext.close();records.push({input:failure+' audio permits silent play',status:'passed'});
  }
  const failContext=await browser.newContext();const failPage=await failContext.newPage();
  await failPage.route('**/S01.O6.png',route=>route.abort());await failPage.goto(url);await failPage.locator('#retry').waitFor();assert.equal(await failPage.locator('canvas').count(),0);
  await failPage.locator('#return-title').click();await failPage.locator('#settings').click();await failPage.locator('#return-title').click();await failPage.locator('#new-game').click();await failPage.locator('#retry').waitFor();
  await failPage.unroute('**/S01.O6.png');await failPage.locator('#retry').click();await failPage.locator('#new-game').waitFor();assert.equal(await failPage.locator('canvas').count(),1);
  await failContext.close();records.push({input:'required texture failure and retry',status:'passed'});
  console.log(JSON.stringify(records,null,2));
}finally{await writeFile('test-results/ford/results.json',JSON.stringify(records,null,2));await browser.close();await new Promise(r=>server.httpServer.close(r));}








