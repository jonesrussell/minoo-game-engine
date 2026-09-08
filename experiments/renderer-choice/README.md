# Renderer choice experiment

This is an isolated, reproducible comparison for issue #40. It keeps PixiJS 8.20.1 and Phaser 3.90.0 in this experiment's own `package.json`, lockfile and install. The root workspace dependencies are untouched. Both candidates render the same approved pipeline-proof background and six alpha PNG targets, expose target buttons as an accessible equivalent, load all assets through the candidate loader, retry the load, resize a canvas, schedule frames, and route pointer/touch and keyboard-equivalent actions to a small view model.

Run from this directory:

```sh
npm ci
npm run build
npm run dev
# in another shell
npm run test:e2e
```

`test:e2e` uses the production preview when `BASE_URL` is provided and writes screenshots under `test-results/`. It asserts the actual canvas, ready state, target selection, keyboard transition, reduced-motion toggle and mobile resize in Chromium. Asset-failure/retry is implemented in both adapters; the normal test leaves the approved assets intact.

The experiment intentionally does not claim GPU FPS or memory measurements. Browser evidence here is functional and visual; bundle measurements are from the actual Vite builds. The six target scenes are the six selectable target presentations over the same proof background, which keeps the comparison bounded and identical.
