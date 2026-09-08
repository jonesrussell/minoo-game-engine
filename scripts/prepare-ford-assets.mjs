import { readFile, mkdir, copyFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
const source = new URL('docs/art/pipeline-proof-01/', root);
const destination = new URL('games/ford-frenzy/public/assets/', root);
const proof = JSON.parse(await readFile(new URL('manifest.json', source), 'utf8'));
const environmentSource = new URL('docs/art/toronto-runtime-01/', root);
const environment = JSON.parse(await readFile(new URL('generation.json', environmentSource), 'utf8'));
const backgroundBytes = await readFile(new URL('background.png', environmentSource));
if (createHash('sha256').update(backgroundBytes).digest('hex') !== environment.sha256) throw Error('Toronto background hash mismatch');
const assets = proof.objects;
// Validate every input before replacing any output. Source pixels are never edited.
for (const asset of assets) {
  if (!/^assets\/[A-Za-z0-9.-]+\.png$/.test(asset.file)) throw Error('Invalid asset path');
  const bytes = await readFile(new URL(asset.file, source));
  if (createHash('sha256').update(bytes).digest('hex') !== asset.sha256) throw Error(`Hash mismatch: ${asset.id}`);
}
await mkdir(destination, { recursive: true });
await copyFile(new URL('background.png', environmentSource), new URL('background.png', destination));
for (const asset of assets) await copyFile(new URL(asset.file, source), new URL(asset.file.slice(7), destination));
await writeFile(new URL('manifest.json', destination), JSON.stringify({
  version: 1, assets: [{id:'S01.BG01', url:'./assets/background.png', mediaType:'image/png', sha256:environment.sha256, source:'docs/art/toronto-runtime-01/generation.json', rights:'runtime candidate; release clearance separate'}, ...assets.map(a => ({id:a.id, url:`./assets/${a.file.slice(7)}`, mediaType:'image/png', sha256:a.sha256,
    source:'docs/art/pipeline-proof-01/generation.json', rights:'proof-only; release clearance separate'}))],
}, null, 2));
console.log(`Prepared ${assets.length} hash-verified S01 textures.`);

// Title and conversation share the clean Toronto environment; live UI supplies branding.
await copyFile(new URL('background.png', environmentSource), new URL('title-newsroom.png', destination));

// Optional character presentation stays local and outside simulation manifests.
const dialogueSource = new URL('docs/art/dialogue-01/', root);
const dialogue = JSON.parse(await readFile(new URL('manifest.json', dialogueSource), 'utf8'));
for (const id of ['elliot', 'alex']) {
  const asset = dialogue.assets.find(asset => asset.id === id);
  if (!asset || asset.file !== `${id}.png`) throw Error(`Missing dialogue portrait: ${id}`);
  const source = new URL(asset.file, dialogueSource);
  if (createHash('sha256').update(await readFile(source)).digest('hex') !== asset.sha256) throw Error(`Dialogue portrait hash mismatch: ${id}`);
  await copyFile(source, new URL(`dialogue-${id}.png`, destination));
}

// Optional expression candidates share the portrait fallback lifecycle.
const expressionSource = new URL('docs/art/expressions-01/', root);
const expressions = JSON.parse(await readFile(new URL('manifest.json', expressionSource), 'utf8'));
for (const asset of expressions.assets) {
  if (!['alex', 'elliot'].includes(asset.character) || !['annoyed', 'amused', 'surprised'].includes(asset.expression) || asset.file !== `${asset.character}-${asset.expression}.png`) throw Error('Invalid expression asset');
  const bytes = await readFile(new URL(asset.file, expressionSource));
  if (createHash('sha256').update(bytes).digest('hex') !== asset.sha256) throw Error(`Expression hash mismatch: ${asset.file}`);
}
for (const asset of expressions.assets) await copyFile(new URL(asset.file, expressionSource), new URL(`dialogue-${asset.file}`, destination));
