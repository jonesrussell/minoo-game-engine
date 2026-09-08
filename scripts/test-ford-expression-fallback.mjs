import assert from 'node:assert/strict';
import { preview } from 'vite';
import { chromium } from 'playwright';

const server = await preview({ configFile: 'vite.ford.config.ts', preview: { host: '127.0.0.1', port: 0, open: false } });
const url = `http://127.0.0.1:${server.httpServer.address().port}`;
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.route('**/dialogue-alex-annoyed.png', route => route.abort());
  await page.goto(url);
  await page.locator('#new-game').tap();
  await page.locator('#dialogue-next').tap();
  const alex = page.locator('.character-slot.alex img');
  await page.waitForFunction(() => document.querySelector('.character-slot.alex img')?.getAttribute('src')?.endsWith('/dialogue-alex.png'));
  await alex.evaluate(async image => { await image.decode(); });
  assert.equal(await alex.evaluate(image => image.naturalWidth > 0), true);
  assert.equal(await alex.getAttribute('data-expression'), 'neutral');
  assert.equal(await page.locator('.portrait-fallback:visible').count(), 0);
  await page.locator('#dialogue-skip').tap();
  assert.equal(await page.evaluate(() => JSON.parse(window.render_game_to_text()).mode), 'playing');
  await context.close();
  console.log(JSON.stringify({ status: 'passed', case: 'variant failure retries decoded neutral without visible fallback' }));
} finally {
  await browser.close();
  await new Promise(resolve => server.httpServer.close(resolve));
}
