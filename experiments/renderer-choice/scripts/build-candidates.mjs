import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const vite=fileURLToPath(new URL('../node_modules/vite/bin/vite.js',import.meta.url));
for(const renderer of ['pixi','phaser']) await new Promise((resolve,reject)=>{
 const child=spawn(process.execPath,[vite,'build','--mode',renderer,'--outDir',`dist-${renderer}`],{stdio:'inherit'});
 child.once('error',reject);
 child.once('exit',(code,signal)=>code?reject(new Error(`${renderer} build failed (${signal??code})`)):resolve());
});
