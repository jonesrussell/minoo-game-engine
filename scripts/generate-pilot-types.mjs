import { compileFromFile } from 'json-schema-to-typescript';
import { writeFile } from 'node:fs/promises';
const source = 'experiments/schema-choice/scene.schema.json';
await writeFile('experiments/schema-choice/scene.generated.d.ts', await compileFromFile(source, { cwd: process.cwd() }));
console.log('Generated pilot declarations from the canonical JSON schema.');
