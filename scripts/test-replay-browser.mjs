import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { build } from 'vite';
import { chromium } from 'playwright';
import { replayLog } from '@minoo/engine/replay';

// Compare Node and Chromium using a standalone bundle, without a game or service.
const fixture = JSON.parse(await readFile('tests/fixtures/replay/journey.json', 'utf8'));
const expected = replayLog(fixture);
assert.equal(expected.ok, true);
const built = await build({
  configFile: false, logLevel: 'error',
  build: { write: false, target: 'es2023', minify: false,
    lib: { entry: 'packages/engine/src/replay.ts', formats: ['es'] } },
});
const chunks = (Array.isArray(built) ? built : [built])
  .flatMap(bundle => bundle.output.filter(item => item.type === 'chunk'));
assert.equal(chunks.length, 1);
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  const actual = await page.evaluate(async ({ code, fixture }) => {
    const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
    try {
      const { replayLog } = await import(url);
      return [replayLog(fixture), replayLog(fixture)];
    } finally { URL.revokeObjectURL(url); }
  }, { code: chunks[0].code, fixture });
  assert.deepEqual(actual, [expected, expected]);
  assert.deepEqual(errors, []);
  console.log('Standalone Journey replay: Node and two Chromium runs have identical state and events.');
} finally { await browser.close(); }
