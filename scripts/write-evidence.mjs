import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const identity = {
  schema: 'minoo.build-evidence', version: 1,
  testedCommit: git('rev-parse', 'HEAD'),
  sourceHead: process.env.SOURCE_HEAD_SHA || git('rev-parse', 'HEAD'),
  dirty: git('status', '--porcelain', '--untracked-files=no') !== '',
  node: process.version,
  runId: process.env.GITHUB_RUN_ID || null,
  runAttempt: process.env.GITHUB_RUN_ATTEMPT || null,
};
async function inventory(root, relative = '') {
  const files = [];
  for (const entry of await readdir(`${root}/${relative}`, { withFileTypes: true })) {
    const path = relative ? `${relative}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...await inventory(root, path));
    else if (entry.isFile() && path !== 'evidence.json') {
      const bytes = await readFile(`${root}/${path}`);
      files.push({ path, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
    }
  }
  return files.sort((a, b) => a.path.localeCompare(b.path));
}
await mkdir('test-results', { recursive: true });
for (const root of ['test-results', 'dist/journey']) {
  let files;
  try { files = await inventory(root); }
  catch (error) { if (error.code === 'ENOENT' && root === 'dist/journey') continue; throw error; }
  await writeFile(`${root}/evidence.json`, JSON.stringify({ ...identity, files }, null, 2) + '\n');
}
console.log(`Evidence identifies tested commit ${identity.testedCommit}; source head ${identity.sourceHead}.`);
