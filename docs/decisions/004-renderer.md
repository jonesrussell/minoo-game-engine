# ADR 004: renderer for the first-game 2D slice

Status: proposed for owner review. Date: 2026-09-07.

## Decision

Use PixiJS 8.20.1 behind the engine renderer adapter for the first-game 2D slice. Keep the headless runtime and deterministic fixed-step scheduling independent of PixiJS. The adapter owns drawing, sprites, asset loading, resize, pointer/touch translation and the canvas frame ticker; accessible HTML controls remain the equivalent for target discovery and keyboard use.

## Evidence

The bounded experiment in `experiments/renderer-choice` renders the same six approved S01 target PNGs and background through PixiJS 8.20.1 and Phaser 4.2.1, the current npm versions checked on 2026-09-07. Both candidates were installed from the experiment lockfile and exercised in Chromium against a production build. The browser run starts its own server, aborts one asset request, asserts the failure and retry path, then captures desktop and 390px mobile screenshots and asserts canvas creation, ready state, target selection, keyboard transition, pointer/touch dispatch, reduced-motion toggle and resize. Both adapters implement all-or-fail asset loading with a retry action.

PixiJS's official documentation describes an async `Application.init`, built-in ticker and resize plugins, `Assets.load`, and pointer events. Phaser's official documentation describes Scene lifecycle, a Loader, a unified pointer system and keyboard input. Those APIs map to this slice, but the functional claims above come from the local browser run, not documentation. Separate candidate builds measured all transitive production JavaScript at 570,445 raw / 170,813 gzip for PixiJS and 1,379,398 raw / 358,131 gzip for Phaser.

Measured build output from the actual Vite build is recorded in the proposal. Raw and gzip sizes are JavaScript output only and are not texture transfer or GPU residency. Complexity is assessed from the adapter surface needed for this experiment, not from a synthetic benchmark.

## Why PixiJS

The slice needs a renderer boundary and a scene graph, sprites, asset cache, pointer events and a frame ticker. PixiJS supplies those primitives with a smaller adapter surface and leaves scene/state policy in Minoo. Phaser provides more complete game-framework systems, including Scene and input orchestration, but those systems add lifecycle and framework policy the headless runtime does not need for six hidden-object targets. Phaser remains a credible fallback if later requirements need its broader scene, physics or input facilities.

## Scheduling and future 3D boundary

Simulation advances through an injected clock with a fixed-step accumulator and emits immutable view models. The PixiJS ticker only requests presentation frames; it never mutates game state or becomes the simulation clock. Pause, replay and reduced-motion behavior therefore remain deterministic and testable headlessly.

This decision is 2D-only. It does not promise a path to 3D. A future 3D requirement would trigger a separate evaluation of a WebGL/WebGPU or 3D engine, asset pipeline, camera model, accessibility equivalents and device budgets. Neither candidate's 2D scene graph is treated as a 3D abstraction.

## Sources

- [PixiJS Application](https://pixijs.com/8.x/guides/components/application)
- [PixiJS Assets](https://pixijs.com/8.x/guides/components/assets)
- [PixiJS Ticker](https://pixijs.com/8.x/guides/components/ticker)
- [PixiJS Events](https://pixijs.com/8.x/guides/components/events)
- [Phaser Scenes](https://docs.phaser.io/phaser/concepts/scenes)
- [Phaser Loader](https://docs.phaser.io/phaser/concepts/loader)
- [Phaser Input](https://docs.phaser.io/phaser/concepts/input)
