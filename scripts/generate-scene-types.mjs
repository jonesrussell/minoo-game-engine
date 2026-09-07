import { compileFromFile } from 'json-schema-to-typescript';
import { writeFile } from 'node:fs/promises';
const source = 'packages/engine/src/contracts/scene.schema.json';
await writeFile('packages/engine/src/contracts/scene.generated.d.ts', await compileFromFile(source, { cwd: process.cwd() }));
console.log('Generated scene declarations from the canonical JSON schema.');
