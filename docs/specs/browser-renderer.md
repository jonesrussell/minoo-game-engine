# Browser renderer adapter

`createSceneRenderer` in `packages/engine/src/browser.ts` is the generic PixiJS 8 browser boundary. It accepts a validated v1 or v2 scene, a manifest v1, and game-owned labels. It does not import game rules, persistence or content.

The manifest must provide `assets` with unique IDs, non-empty URLs, `mediaType: image/png`, SHA-256, source and rights fields. The background ID is supplied by the caller. Every scene object ID must have a corresponding asset ID. Asset loading is all-or-fail; initialization appends no canvas until every texture and Pixi application setup succeeds. A failed load releases candidate textures. Retry means calling `createSceneRenderer` again with a fresh adapter.

The renderer uses the validated scene's logical width and height (1920×1080 for S01) and preserves aspect ratio through `ResizeObserver`. `getTargets()` returns viewport CSS-pixel rectangles for QA and hit-map inspection. Sprites use rectangular texture bounds plus an 8-logical-pixel border as the prototype policy. Hit bounds are converted to texture-local coordinates before Pixi scaling. When bounds overlap, the last drawn sprite wins. `pointertap` emits only the selected stable object ID. `setPaused(true)` blocks selection and stops the private ticker; visibility changes stop presentation while the document is hidden. `dispose()` is idempotent and removes listeners, observer, ticker and Pixi resources. One active scene adapter owns its texture cache; concurrent adapters sharing URLs are not supported by this first implementation.

The Pixi ticker is presentation-only. The current runtime is action-driven; `advanceTime` exists for presentation QA and future timed effects. It does not mutate runtime state. Reduced motion removes the presentation pulse, while hinted-object outlines remain visible and static. Editable labels are supplied by the game through `labels`; no story or Ford-specific text is embedded in the adapter.

## Keyboard search (#130)

`setSearchCursor(point | null)` draws a fixed, high-contrast search marker in logical
coordinates. It does not highlight nearby targets. `inspectAt(point)` emits a
selection only when that position intersects an object under the same rectangular
border and overlap policy as pointer input. Empty space returns false. Paused,
hidden or disposed renderers reject inspection. Neither moving nor inspecting
empty space consumes a hint or awards a find.

The game supplies a focusable, named scene search surface and broad location
descriptions independent of target bounds. Arrow keys move 40 logical pixels;
Shift reduces the step to 10. Enter or Space inspects; Tab exits normally. The
surface is inert during modal screens and focus returns after inspection. The
cursor never snaps between targets and unfound object names are not announced by
focus or movement. The shared objective list still tells every player what to find,
but no direct object-selection buttons remain. Notebook names appear after finds.

Browser checks cover actual arrow navigation to all six finds, empty-space
inspection, movement without discovery, neutral location announcements, Tab exit
and return after inspection. This is keyboard and semantic-browser evidence, not a
claim of completed screen-reader user testing or final accessibility certification.
