import assert from 'node:assert/strict';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { preview } from 'vite';
import { chromium } from 'playwright';

const server = await preview({ preview: { host: '127.0.0.1', port: 0, open: false } });
let browser;
const results = [];
await mkdir('test-results', { recursive: true });
// Clear only this harness's known outputs so local reruns cannot retain old traces.
for (const name of ['desktop', 'touch']) {
  for (const suffix of ['.png', '-failure.png', '-trace.zip']) {
    await rm(`test-results/${name}${suffix}`, { force: true });
  }
}
try {
  const address = server.httpServer.address();
  const url = `http://127.0.0.1:${address.port}`;
  browser = await chromium.launch();
  for (const [name, viewport, touch] of [['desktop', { width: 1280, height: 1000 }, false], ['touch', { width: 390, height: 844 }, true]]) {
    const context = await browser.newContext({ viewport, hasTouch: touch });
    await context.tracing.start({ screenshots: true, snapshots: true });
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    try {
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
    results.push({ name, outcome: 'passed', consoleErrors: errors });
    await context.tracing.stop();
    console.log(`${name}: production build, controls, reset, focus, layout and console passed`);
    } catch (error) {
      results.push({ name, outcome: 'failed', error: String(error), consoleErrors: errors });
      await page.screenshot({ path: `test-results/${name}-failure.png`, fullPage: true }).catch(() => {});
      await context.tracing.stop({ path: `test-results/${name}-trace.zip` }).catch(() => {});
      throw error;
    } finally {
      await context.close();
    }
  }
} catch (error) {
  if (!results.some(result => result.outcome === 'failed')) results.push({ name: 'harness', outcome: 'failed', error: String(error) });
  throw error;
} finally {
  await writeFile('test-results/browser-results.json', JSON.stringify({ results }, null, 2) + '\n');
  await browser?.close();
  await new Promise((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve()));
}
