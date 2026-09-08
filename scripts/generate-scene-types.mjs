import { compileFromFile } from 'json-schema-to-typescript';
import { writeFile } from 'node:fs/promises';
const contracts = [
  ['packages/engine/src/contracts/scene.schema.json', 'packages/engine/src/contracts/scene.generated.d.ts'],
  ['packages/engine/src/contracts/scene-v2.schema.json', 'packages/engine/src/contracts/scene-v2.generated.d.ts'],
];
for (const [source, target] of contracts) {
  await writeFile(target, await compileFromFile(source, { cwd: process.cwd() }));
}
console.log('Generated scene declarations from the canonical JSON schemas.');
