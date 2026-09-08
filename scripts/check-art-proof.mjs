import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';

// Diagnostic proof only. This does not select or exercise the game's renderer.
const root = resolve('docs/art/pipeline-proof-01');
const output = resolve('test-results/art-proof');
await mkdir(output, { recursive: true });
const manifest = JSON.parse(await readFile(resolve(root, 'manifest.json'), 'utf8'));
const provenance = JSON.parse(await readFile(resolve(root, 'generation.json'), 'utf8'));
const measurements = JSON.parse(await readFile(resolve(root, 'measurements.json'), 'utf8'));
const referenceHash = createHash('sha256').update(await readFile(resolve(root, '../visual-direction-02/newsroom-concept.png'))).digest('hex');
for (const record of provenance.generations) {
  const expected = record.input.id === 'ff-concept-newsroom-02' ? referenceHash : provenance.generations.find(item => item.id === record.input.id)?.sha256;
  assert.equal(record.input.sha256, expected, `Input lineage: ${record.id}`);
}
for (const item of [manifest.background, ...manifest.objects]) {
  const data = await readFile(resolve(root, item.file));
  const record = provenance.generations.find(record => record.file === item.file);
  assert.ok(record, `Missing provenance: ${item.file}`);
  assert.equal(createHash('sha256').update(data).digest('hex'), record.sha256);
  assert.equal(data.length, record.bytes);
  assert.equal(item.sha256, record.sha256, `Manifest hash: ${item.id}`);
  assert.equal(item.width, record.width); assert.equal(item.height, record.height);
  const measured = measurements.assets.find(asset => asset.file === item.file);
  assert.equal(measured.sha256, record.sha256);
  assert.equal(measured.bytes, data.length);
  assert.equal(measured.width, item.width); assert.equal(measured.height, item.height);
}
assert.equal(measurements.encoded_png_bytes, measurements.assets.reduce((sum,item)=>sum+item.bytes,0));
assert.equal(measurements.rgba8_bytes_no_mips, measurements.assets.reduce((sum,item)=>sum+item.width*item.height*4,0));
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
    const bytes = await readFile(file);
    res.setHeader('Content-Type', ({ '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.png':'image/png' })[extname(file)] || 'application/octet-stream');
    res.end(bytes);
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const url = `http://127.0.0.1:${server.address().port}/`;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const alpha = [];
try {
  await page.goto(url);
  await page.waitForFunction(() => document.querySelector('#load-state').textContent.includes('review ready'));
  for (const object of manifest.objects) {
    const metrics = await page.evaluate(async object => {
      const image = new Image(); image.src = object.file; await image.decode();
      const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
      const ctx = canvas.getContext('2d'); ctx.drawImage(image, 0, 0);
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0, solid = 0, partial = 0, min = 255, max = 0;
      const bounds=[image.width,image.height,0,0], solidBounds=[image.width,image.height,0,0];
      function include(b,x,y){b[0]=Math.min(b[0],x);b[1]=Math.min(b[1],y);b[2]=Math.max(b[2],x+1);b[3]=Math.max(b[3],y+1);}
      for (let i=3;i<pixels.length;i+=4) {
        const a=pixels[i], pixel=(i-3)/4, x=pixel%image.width, y=Math.floor(pixel/image.width);
        min=Math.min(min,a); max=Math.max(max,a);
        if(a===0)clear++; else { include(bounds,x,y); if(a>=240){solid++;include(solidBounds,x,y);}else partial++; }
      }
      return { id:object.id, clear, solid, partial, min, max, bounds, solidBounds, width:image.width, height:image.height };
    }, object);
    assert.ok(metrics.clear > metrics.width*metrics.height*.1 && metrics.solid > metrics.width*metrics.height*.15, `No useful alpha: ${object.id}`);
    assert.equal(metrics.width, object.width); assert.equal(metrics.height, object.height);
    const recorded = measurements.assets.find(item=>item.file===object.file).alpha;
    assert.equal(metrics.min,recorded.min); assert.equal(metrics.max,recorded.max);
    assert.equal(metrics.clear,recorded.zero_pixels); assert.equal(metrics.solid,recorded.near_opaque_pixels);
    assert.deepEqual(metrics.bounds,recorded.nonzero_bounds);
    assert.deepEqual(metrics.solidBounds,recorded.solid_bounds);
    // Generator leaves faint edge pixels. The near-opaque body must retain padding.
    assert.ok(metrics.solidBounds[0]>0 && metrics.solidBounds[1]>0 && metrics.solidBounds[2]<object.width && metrics.solidBounds[3]<object.height, `Clipped body: ${object.id}`);
    metrics.logicalVisibleBounds=metrics.bounds.map((n,i)=>i%2===0?object.bounds.x+n/object.width*object.bounds.width:object.bounds.y+n/object.height*object.bounds.height);
    alpha.push(metrics);
  }
  for (const [name,width,height] of [['desktop',1440,900],['portrait',390,844],['landscape',844,390]]) {
    await page.setViewportSize({width,height});
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const controls = await page.locator('button:visible').evaluateAll(nodes => nodes.map(node => ({id:node.id,width:node.getBoundingClientRect().width,height:node.getBoundingClientRect().height})));
    for (const control of controls) assert.ok(control.width >= 44 && control.height >= 44, JSON.stringify(control));
    await page.screenshot({path:resolve(output, `${name}.png`),fullPage:true});
  }
  await page.setViewportSize({width:1440,height:900});
  await page.locator('#zoom-selected').click();
  assert.equal(await page.locator('#close-zoom').isVisible(),true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#close-zoom').isVisible(),false);
  const before = await page.locator('#scene').evaluate(canvas => canvas.toDataURL());
  const toggle = page.locator('.layer-toggle').first();
  await toggle.click();
  assert.notEqual(await page.locator('#scene').evaluate(canvas => canvas.toDataURL()), before);
  await page.locator('.layer-toggle').first().click();
  assert.equal(await page.locator('.layer-toggle[aria-label^="Hide "]').count(), 6);
  for (let i=0;i<6;i++) {
    const row = page.locator('.object-row').nth(i);
    await row.focus(); await page.keyboard.press('Enter');
    assert.equal(await page.locator('#selected-id').textContent(), manifest.objects[i].id);
    await page.screenshot({path:resolve(output, `alpha-${i+1}-light.png`),fullPage:true});
    await page.locator('#preview-bg').click();
    await page.screenshot({path:resolve(output, `alpha-${i+1}-dark.png`),fullPage:true});
    await page.locator('#preview-bg').click();
  }
  await page.route('**/assets/S01.O6.png', route => route.abort());
  await page.reload();
  await page.waitForFunction(() => document.querySelector('#load-state').textContent.includes('failed'));
  assert.equal(await page.locator('.object-row').count(), 0);
  await page.unroute('**/assets/S01.O6.png');
  await page.locator('#retry').click();
  await page.waitForFunction(() => document.querySelector('#load-state').textContent.includes('review ready'));
  await page.route('**/manifest.json', route => {
    const invalid = structuredClone(manifest); invalid.objects[1].id = invalid.objects[0].id;
    return route.fulfill({json:invalid});
  });
  await page.reload();
  await page.waitForFunction(() => document.querySelector('#load-state').textContent.includes('failed'));
  assert.equal(await page.locator('.object-row').count(), 0);
  await page.unroute('**/manifest.json');
  await page.locator('#retry').click();
  await page.waitForFunction(() => document.querySelector('#load-state').textContent.includes('review ready'));
  assert.deepEqual(errors, []);
  await writeFile(resolve(output,'results.json'), JSON.stringify({alpha,checks:['hashes','dimensions','alpha','layer separation','keyboard selection','44px buttons','three viewport overflow checks','missing-image retry','duplicate-ID rejection'],errors},null,2)+'\n');
  console.log('Art proof: hashes, alpha, layers, keyboard, viewports and failure/retry passed.');
} finally { await browser.close(); await new Promise(resolve=>server.close(resolve)); }
