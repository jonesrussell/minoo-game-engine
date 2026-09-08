# Opening dialogue portrait candidates

Issue #138. Generated on 2026-09-07 with the built-in image tool (model ID not
exposed). `prompts.json` records the initial Elliot and Alex prompts; both used
the approved newsroom reference recorded in `manifest.json`.

Alex's generated RGBA export is used unchanged. Elliot's first two exports
(`elliot-source.png`, `elliot-rejected.png`) painted a checkerboard and were not
selected. A third export (`elliot-opaque.png`) used the first Elliot export and
Alex's transparent export as references, but also returned RGB. All original
exports remain unchanged here and are excluded from the runtime asset copy.

The owner explicitly authorized local background removal in conversation.
`remove-background.py` uses Pillow to remove only boundary-connected bright,
neutral pixels and soften the alpha edge by 0.35 pixels. It reads the unchanged
opaque export, writes `elliot.png`, and updates its manifest hash. Run from any
directory with Python and Pillow installed. No runtime image editing or generation
is involved. The selected portraits have actual RGBA transparency.

Agent review covers compositing and style consistency. These are portrait
candidates for owner visual review, not final character or release approval.

## Second Elliot prompt

Remove the entire white and pale checkerboard background from this image. Return the exact existing man and newspaper as a clean PNG cutout with TRUE TRANSPARENT ALPHA outside his silhouette. Checkerboard squares are NOT transparency: do not draw a checkerboard, white backdrop, black backdrop or any color behind him. Preserve his face, clothing, hand, newspaper, pose, detail and illustration exactly. Only background removal. Fully transparent RGBA surrounding pixels.

## Third Elliot prompt

Create a transparent-background PNG sprite of the MAN in image 1, matching image 2's actual alpha transparency. ONLY the man, full head through upper thighs, casual olive hoodie and beige tshirt, holding folded paper, facing slightly left, tired wry expression. Image 2 is ONLY a technical reference for the transparent outside area, do not include its woman. Deliver real transparent background using an alpha channel. Outside the man silhouette must have alpha=0, not visible white/gray squares. Draw no background at all. Preserve the original graphic ink style and male face. This is a character sprite asset that will be composited over a game scene.
