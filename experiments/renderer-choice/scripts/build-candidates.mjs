import {spawn} from 'node:child_process';
const npm=process.platform==='win32'?'npx.cmd':'npx';
for(const renderer of ['pixi','phaser']) await new Promise((resolve,reject)=>{const p=spawn(npm,['vite','build','--mode',renderer,'--outDir',`dist-${renderer}`],{stdio:'inherit',shell:process.platform==='win32'});p.on('exit',code=>code?reject(new Error(`${renderer} build failed`)):resolve());});
