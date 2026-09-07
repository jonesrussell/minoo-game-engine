# S01 asset pipeline proof

Candidate exports for #104. Reference style is approved; these new assets are not.
Run from the repository root with any local static HTTP server, then open
`docs/art/pipeline-proof-01/index.html`. File URLs cannot fetch the manifest.
Validation command: `node scripts/check-art-proof.mjs` (uses locked Playwright).

The viewer composes one background and six independent alpha sprites. Layer
switches expose their separation; the selected export can be enlarged over light
or dark backing. The list remains keyboard accessible on small screens. Masthead
and calendar text are code/data overlays, never changes to source image pixels.
This is an asset inspection tool, not a game or a runtime renderer selection.

## Provenance and measurements

[generation.json](generation.json) contains exact prompts, tool/model disclosure,
input/output hashes, dimensions and selected/rejected attempt records.
[manifest.json](manifest.json) binds canonical S01.O1-O6 IDs to logical placements.
[measurements.json](measurements.json) records PNG transfer sizes and alpha bounds.
All selected image bytes are unchanged built-in imagegen outputs.

Seven PNGs total 14,862,282 encoded bytes (14.17 MiB). RGBA8 storage arithmetic is
44,044,784 bytes (42.00 MiB) without mipmaps. Neither is measured process/GPU
residency. Source PNGs intentionally retain full resolution; #40/#51 and release
art work will select optimized exports and atlas/streaming budgets.

## Review limits

- Brightened empty background with original target props removed. Final character
  layers, pizza-box/keyboard occlusion, wrong-charger distractor and lighting polish
  remain production work. Current props demonstrate separation, not puzzle difficulty.
- Contact-sheet thumbnails are generated Toronto illustrations, not archival photos.
  The earlier non-Toronto attempt and baked-checkerboard attempt were rejected.
  The book-like folder attempt was also rejected; selected folder is thin.
- Near-opaque interiors reach alpha 253-254 rather than 255 in several tool outputs.
  Faint boundary pixels remain untouched. Light/dark backing inspection is required
  before selecting final exports; no automatic matte removal changes approved bytes.
- The newspaper art is a graphic stand-in with abstract rules. Historical attribution
  and full readable copy belong in inspect UI; tiny generated marks are not evidence.
- Native source aspect ratios are preserved within logical bounds. At 390px the
  scene targets are too small for standalone touch gameplay; use the 44px list and
  enlarged preview for this review. Runtime zoom/hit mapping remains separate work.

Owner decision: accept this background and target treatment as the pipeline proof,
or identify a specific visual revision. #104 stays open until that decision.
