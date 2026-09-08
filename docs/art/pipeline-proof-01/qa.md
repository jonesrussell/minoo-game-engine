# Candidate proof verification

Run `node scripts/check-art-proof.mjs` from the repository root. The delivery PR
records the exact tested commit and hosted checks. Execution on this candidate
passed the following checks:

- File bytes and hashes agree across manifest, generation and measurements records.
  Source lineage hashes agree with the approved style reference and recorded repairs.
- Decoded dimensions, alpha extrema/counts, nonzero and near-opaque bounds agree
  with recorded measurements. Near-opaque object bodies retain padding; faint edge
  pixels are preserved and disclosed, not silently removed.
- Layer toggles change the composition. All six targets have independent files.
- Keyboard selection, enlarged-view Escape, 44px buttons and overflow checks pass
  at 1440x900, 390x844 and 844x390. Small scene objects use the accessible review list.
- Missing image fails with no partial list; retry recovers. Duplicate object IDs
  fail validation. No JavaScript page errors were observed during these checks.

Desktop and portrait composition plus light/dark export views were inspected.
The candidates visibly separate from the background. Current placement is an
asset study; no production occlusion, character layers or puzzle difficulty is
claimed. Tiny scene calendar text is decorative; enlarged inspect copy remains
runtime work. Alpha is near-opaque rather than exactly 255 in several originals.

Before owner review, a non-Toronto contact sheet, an RGB checkerboard repair and
a book-like folder were rejected. Their prompts/hashes remain in the generation
record. Selected source PNGs were copied without pixel edits.

Full workspace typecheck, 68 unit tests, production build, desktop/touch browser
checks, scene validation, replay parity and repository link checks also passed.
They verify the existing runtime is unaffected, not that this is a playable game.

**Owner approval:** recorded in [approval.md](approval.md).

**Open:** production
compression and residency measurement; final occlusion, copy and release approval.
