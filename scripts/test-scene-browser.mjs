import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { build } from 'vite';
import { chromium } from 'playwright';

// Build the public validation entry independently, without changing the game
// artifact or exporting test hooks into the preview.
const result = await build({
  configFile: false, logLevel: 'error',
  build: { write: false, target: 'es2023', minify: false,
    lib: { entry: 'packages/engine/src/scene.ts', formats: ['es'] } },
});
const bundles = Array.isArray(result) ? result : [result];
const chunks = bundles.flatMap(bundle => bundle.output.filter(item => item.type === 'chunk'));
assert.equal(chunks.length, 1);
const fixture = JSON.parse(await readFile('tests/fixtures/scenes/valid.json', 'utf8'));
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const evidence = await page.evaluate(async ({ code, fixture }) => {
    const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
    try {
      const { validateScene, parseScene } = await import(url);
      const valid = validateScene(fixture);
      const invalid = validateScene({ ...fixture, version: 2 });
      return { valid: valid.ok, invalid, parsed: parseScene(JSON.stringify(fixture)).ok };
    } finally { URL.revokeObjectURL(url); }
  }, { code: chunks[0].code, fixture });
  assert.equal(evidence.valid, true);
  assert.equal(evidence.parsed, true);
  assert.equal(evidence.invalid.ok, false);
  assert(evidence.invalid.errors.some(error => error.code === 'SCENE_VERSION' && error.pointer === '/version'));
  assert.deepEqual(errors, []);
  console.log('Public scene validation bundle: Chromium valid/invalid/parse checks passed.');
} finally { await browser.close(); }
