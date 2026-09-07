import {readFileSync, existsSync, readdirSync} from 'node:fs';
import {dirname, resolve, extname} from 'node:path';
const required=['README.md','AGENTS.md','CONTRIBUTING.md','docs/product.md','docs/architecture.md','docs/chat-development.md','docs/content-policy.md','docs/roadmap.md'];
const errors=[];
for(const file of required){
 if(!existsSync(file)){errors.push('Missing '+file);continue;}
 const text=readFileSync(file,'utf8');
 for(const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)){
  const link=match[1];
  if(/^(https?:|#|mailto:)/.test(link))continue;
  if(!existsSync(resolve(dirname(file),link.split('#')[0])))errors.push(file+': broken local link '+link);
 }
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log('Repository documentation and local links verified. Run npm test and npm run test:e2e for runtime checks.');
