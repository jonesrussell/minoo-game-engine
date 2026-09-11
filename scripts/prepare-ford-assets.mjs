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
// S02 City Hall background candidate (#98). Copied unedited; hash-checked against its own record.
const cityHallSource = new URL('docs/art/city-hall-01/', root);
const cityHall = JSON.parse(await readFile(new URL('generation.json', cityHallSource), 'utf8'));
const cityHallBytes = await readFile(new URL('background.png', cityHallSource));
if (createHash('sha256').update(cityHallBytes).digest('hex') !== cityHall.sha256) throw Error('City Hall background hash mismatch');

// S02.O5 (visitor bell) has an approved-for-candidate-use generated sprite; copied unedited, hash-checked.
const visitorBell = JSON.parse(await readFile(new URL('visitor-bell-generation.json', cityHallSource), 'utf8'));
const visitorBellBytes = await readFile(new URL(visitorBell.file, cityHallSource));
if (createHash('sha256').update(visitorBellBytes).digest('hex') !== visitorBell.sha256) throw Error('Visitor bell hash mismatch');

// Remaining S02 props reuse the approved S01 sprite files as honest temporary placeholders; #98 does not
// add final art for them. The May 16 summary folder uses the S01 folder sprite, not the calendar sprite.
const S02_PLACEHOLDER_PROPS = [
  { s02Id: 'S02.O1', reuses: 'S01.O2' },
  { s02Id: 'S02.O2', reuses: 'S01.O5' },
  { s02Id: 'S02.O3', reuses: 'S01.O1' },
  { s02Id: 'S02.O4', reuses: 'S01.O4' },
  { s02Id: 'S02.O6', reuses: 'S01.O4' },
];

await mkdir(destination, { recursive: true });
await copyFile(new URL('background.png', environmentSource), new URL('background.png', destination));
await copyFile(new URL('background.png', cityHallSource), new URL('s02-background.png', destination));
await copyFile(new URL(visitorBell.file, cityHallSource), new URL('S02.O5.png', destination));
for (const asset of assets) await copyFile(new URL(asset.file, source), new URL(asset.file.slice(7), destination));
// S02 placeholder props get their own destination filenames (distinct URLs from S01's).
// The S01 and S02 renderers can each be live/disposed independently in the same page session;
// the shared PixiJS Assets cache keys textures by URL, so reusing S01's exact URL for an S02
// object risks an in-flight unload from one renderer racing a fresh load from the other.
for (const { s02Id, reuses } of S02_PLACEHOLDER_PROPS) {
  const reused = assets.find(a => a.id === reuses);
  await copyFile(new URL(reused.file, source), new URL(`${s02Id}.png`, destination));
}
await writeFile(new URL('manifest.json', destination), JSON.stringify({
  version: 1, assets: [
    {id:'S01.BG01', url:'./assets/background.png', mediaType:'image/png', sha256:environment.sha256, source:'docs/art/toronto-runtime-01/generation.json', rights:'runtime candidate; release clearance separate'},
    {id:'S02.BG01', url:'./assets/s02-background.png', mediaType:'image/png', sha256:cityHall.sha256, source:'docs/art/city-hall-01/generation.json', rights:'candidate; not integrated or owner-approved; release clearance separate'},
    {id:'S02.O5', url:'./assets/S02.O5.png', mediaType:'image/png', sha256:visitorBell.sha256, source:'docs/art/city-hall-01/visitor-bell-generation.json', rights:'generated candidate; owner acceptance pending; release clearance separate'},
    ...assets.map(a => ({id:a.id, url:`./assets/${a.file.slice(7)}`, mediaType:'image/png', sha256:a.sha256,
      source:'docs/art/pipeline-proof-01/generation.json', rights:'proof-only; release clearance separate'})),
    ...S02_PLACEHOLDER_PROPS.map(({ s02Id, reuses }) => {
      const reused = assets.find(a => a.id === reuses);
      return {id:s02Id, url:`./assets/${s02Id}.png`, mediaType:'image/png', sha256:reused.sha256,
        source:'docs/art/pipeline-proof-01/generation.json', rights:`placeholder; duplicate of ${reuses} sprite; not final S02 prop art`};
    }),
  ],
}, null, 2));
console.log(`Prepared ${assets.length} hash-verified S01 textures, the S02 background and visitor-bell candidates, and ${S02_PLACEHOLDER_PROPS.length} S02 placeholder props.`);

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
