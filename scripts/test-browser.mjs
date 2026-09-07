import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { preview } from 'vite';
import { chromium } from 'playwright';

const server = await preview({ preview: { host: '127.0.0.1', port: 0, open: false } });
let browser;
try {
  const address = server.httpServer.address();
  const url = `http://127.0.0.1:${address.port}`;
  browser = await chromium.launch();
  await mkdir('test-results', { recursive: true });
  for (const [name, viewport, touch] of [['desktop', { width: 1280, height: 1000 }, false], ['touch', { width: 390, height: 844 }, true]]) {
    const page = await browser.newPage({ viewport, hasTouch: touch });
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(url);
    await page.getByText('Fixture content', { exact: true }).waitFor();
    const state = () => page.evaluate(() => JSON.parse(window.render_game_to_text()));
    assert.equal((await state()).mode, 'start');
    if (touch) await page.locator('#start').tap();
    else { await page.locator('#start').focus(); await page.keyboard.press('Enter'); }
    assert.equal((await state()).mode, 'explore');
    if (touch) await page.locator('#inspect').tap();
    else await page.keyboard.press('Enter');
    assert.equal((await state()).selected, 'tree');
    assert.match(await page.locator('#status').innerText(), /Tree selected/);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.screenshot({ path: `test-results/${name}.png`, fullPage: true });
    if (touch) await page.locator('#inspect').tap();
    else await page.keyboard.press('Enter');
    assert.equal((await state()).selected, null);
    if (touch) await page.locator('#reset').tap();
    else { await page.keyboard.press('Tab'); await page.keyboard.press('Enter'); }
    assert.equal((await state()).mode, 'start');
    assert.equal(await page.locator('#start').evaluate(element => element === document.activeElement), true);
    await page.reload();
    assert.equal((await state()).mode, 'start');
    assert.deepEqual(errors, [], `${name}: browser errors`);
    await page.close();
    console.log(`${name}: production build, controls, reset, focus, layout and console passed`);
  }
} finally {
  await browser?.close();
  await new Promise((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve()));
}
