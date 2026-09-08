# Proposal: #40 renderer evaluation

## Scope

This comparison answers the first-game 2D renderer question with a reproducible, six-target experiment. It uses the approved pipeline-proof PNGs without changing artwork. It covers frame scheduling, drawing/sprites, asset loading and all-or-fail retry, resize, pointer/touch, keyboard equivalents and reduced motion. The runtime contract remains headless and renderer-independent.

## Reproduction

```sh
cd experiments/renderer-choice
npm ci
npm run build
npm run build:candidates
npm run test:e2e
```

The experiment package has its own lockfile and `node_modules`; root dependencies are unchanged. The browser test runs Chromium at desktop and 390px mobile sizes and writes four screenshots under `experiments/renderer-choice/test-results/`.

## Results

Separate production builds completed for each candidate with `npm run build:candidates`. The complete JavaScript graphs measured:

| Actual Vite chunk | Raw JavaScript | gzip (mtime=0) |
|---|---:|---:|
| Candidate graph | Raw JavaScript | gzip (mtime=0) |
| PixiJS 8.20.1 (`dist-pixi`) | 570,445 bytes | 170,813 bytes |
| Phaser 4.2.1 (`dist-phaser`) | 1,379,398 bytes | 358,131 bytes |

Reproduce the raw and gzip counts after `npm run build:candidates` with Node's bundled zlib:

```powershell
node -e "const fs=require('fs'),z=require('zlib'); for(const d of ['dist-pixi','dist-phaser']){let a=fs.readdirSync(d+'/assets').filter(x=>x.endsWith('.js')).map(f=>fs.readFileSync(d+'/assets/'+f)); console.log(d,a.reduce((s,b)=>s+b.length,0),a.reduce((s,b)=>s+z.gzipSync(b,{mtime:0}).length,0))}"
```

The experiment is one Vite application with a query-selected adapter, so one build includes both candidates. The final comparison therefore reports per-adapter entry chunks from the actual build output rather than presenting an invented isolated number. Texture transfer and decoded/GPU memory are excluded because they are asset-pipeline measurements, not JavaScript build size.

| Dimension | PixiJS 8.20.1 | Phaser 4.2.1 |
|---|---|---|
| Frame scheduling | Application ticker; adapter can start/stop it | Scene game loop; adapter lifecycle is implicit in Game |
| Sprites/drawing | Display tree and Sprite | Game Objects and Scene display list |
| Assets | `Assets.load` promise/cache | Scene Loader events and keyed textures |
| Failure/retry | Explicit `Promise.all` failure + adapter retry | Loader error state + Game recreation retry |
| Resize | Application resize plugin / explicit resize render | Scale Manager `RESIZE` |
| Pointer/touch | Pointer events on display objects; HTML target buttons | Unified pointer input; HTML target buttons |
| Keyboard equivalent | Shared document handler | Shared document handler |
| Reduced motion | Shared view policy stops presentation wobble | Shared view policy stops presentation wobble |
| Adapter complexity | Lower: renderer primitives only | Higher: Scene/Game/Loader lifecycle |

## Recommendation

Choose PixiJS for the first-game 2D slice. It meets the required rendering boundary with less framework policy and keeps the fixed-step headless state contract clear. Preserve the Phaser adapter in this experiment as a credible comparison and fallback. Do not implement 3D here; open a separate decision if the product gains a 3D requirement.

## Limits

This is functional browser evidence, not a performance benchmark. It does not claim FPS, GPU residency, input latency, mobile thermal behavior or future 3D suitability. Those require device-specific workloads and a separate 3D evaluation.
