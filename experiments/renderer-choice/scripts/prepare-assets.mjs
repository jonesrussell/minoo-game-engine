import {cp, mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';
const here=dirname(fileURLToPath(import.meta.url));
await mkdir(resolve(here,'../public/assets'),{recursive:true});
await cp(resolve(here,'../../../docs/art/pipeline-proof-01/assets'),resolve(here,'../public/assets'),{recursive:true});
