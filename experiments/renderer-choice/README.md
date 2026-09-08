# Renderer choice experiment

This is an isolated, reproducible comparison for issue #40. It keeps PixiJS 8.20.1 and Phaser 4.2.1 (the current npm versions checked on 2026-09-07) in this experiment's own `package.json`, lockfile and install. The root workspace dependencies are untouched. Both candidates render the same approved pipeline-proof background and six alpha PNG targets, expose target buttons as an accessible equivalent, load all assets through the candidate loader, retry the load, resize a canvas, schedule frames, and route stable-ID pointer/touch and keyboard-equivalent actions to a small view model.

Run from this directory:

```sh
npm ci
npm run build
npm run build:candidates
npm run dev
# in another shell
npm run test:e2e
```

`test:e2e` first builds production output, starts and closes its own ephemeral Vite preview server and writes distinct desktop/mobile screenshots plus `browser-results.json` under `test-results/`. It intentionally aborts one PNG request, asserts the failure announcement, retries with the restored route, then asserts one canvas, target controls, keyboard selection, expected stable IDs from pointer and touch sprite hits, no event outside a sprite, the reduced-motion control signal, mobile resize and no unexpected browser errors. `build:candidates` produces separate `dist-pixi` and `dist-phaser` graphs for total JavaScript measurements. The approved assets are copied at build/server start from the reference folder and are not duplicated in Git.

The experiment intentionally does not claim GPU FPS or memory measurements. Browser evidence here is functional and visual; bundle measurements are from the actual Vite builds. The six target scenes are the six selectable target presentations over the same proof background, which keeps the comparison bounded and identical.
