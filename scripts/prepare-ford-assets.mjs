import { readFile, mkdir, copyFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
const source = new URL('docs/art/pipeline-proof-01/', root);
const destination = new URL('games/ford-frenzy/public/assets/', root);
const proof = JSON.parse(await readFile(new URL('manifest.json', source), 'utf8'));
const assets = [proof.background, ...proof.objects];
// Validate every input before replacing any output. Source pixels are never edited.
for (const asset of assets) {
  if (!/^assets\/[A-Za-z0-9.-]+\.png$/.test(asset.file)) throw Error('Invalid asset path');
  const bytes = await readFile(new URL(asset.file, source));
  if (createHash('sha256').update(bytes).digest('hex') !== asset.sha256) throw Error(`Hash mismatch: ${asset.id}`);
}
await mkdir(destination, { recursive: true });
for (const asset of assets) await copyFile(new URL(asset.file, source), new URL(asset.file.slice(7), destination));
await writeFile(new URL('manifest.json', destination), JSON.stringify({
  version: 1, assets: assets.map(a => ({id:a.id, url:`./assets/${a.file.slice(7)}`, mediaType:'image/png', sha256:a.sha256,
    source:'docs/art/pipeline-proof-01/generation.json', rights:'proof-only; release clearance separate'})),
}, null, 2));
console.log(`Prepared ${assets.length} hash-verified S01 textures.`);
