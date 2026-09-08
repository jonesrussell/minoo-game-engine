# Proposal 104: reference-based art generation and export

Issue #104 · FF-ART-002 · status: owner-approved separated-asset proof.

This proposal defines a bounded S01 proof: one background plus six independent
alpha target PNGs. It uses the owner-approved visual-direction-02 concept as a
visual reference while preserving provenance and keeping generated pixels
immutable. The approved concept establishes style only; it is a flat review
image and does not approve a new background, target placement, UI, or release
art.

## Source and provenance

The source record is `ff-concept-newsroom-02`, SHA-256
`0bf1e81cd1b91b4ac8ca229744e7308f4e5be365b72852cb80892c9364aad880`, dated
2026-09-07, produced with `image_gen.imagegen`; model: “not exposed by built-in
tool”; prompt: `docs/art/visual-direction-02/prompt.txt`. Each candidate must
also record all input IDs/hashes, prompt, tool/model/date, output hash, bytes,
dimensions, edits, and review result. Pixel edits to immutable originals are
forbidden. A new attempt is a new candidate and revision; rejected outputs are
preserved and never silently replace an approved revision.

## Export and separation

Use logical stage 1920x1080 and stable IDs `S01.O1`–`S01.O6`. Export one opaque
background PNG and six RGBA PNG targets. Targets have transparent outside
pixels and remain independent of the background; live title, HUD, labels, and
other overlays remain editable. The proof does not choose a game renderer,
claim full-scene occlusion, or introduce runtime AI generation.

Source PNGs are evidence for this proof. Later optimized WebP backgrounds,
atlas files, and residency/streaming arrangements are production derivatives,
with separate hashes and measurements. Transfer bytes, decoded texture
residency, and process memory must not be conflated.

## QA and decision gate

Before owner review, record alpha-edge and nontransparent-bound checks, logical
scale, output hashes, and visibility over the background in light and dark
previews. Exercise 390x844, 844x390, and 1440x900 fitted views with keyboard
navigation and focus. Readability and recognizable target bounds must hold after
scaling. Evidence belongs in the proof manifest/viewer; planned checks are not
completion evidence.

Owner export approval was the remaining gate and is now recorded below. Future
rejected revisions retain the prior approved manifest. This workflow does not
claim finished art or release approval.

## Proof accepted

The owner approved the completed separated-asset proof on 2026-09-07.
See [approval record](../art/pipeline-proof-01/approval.md).
The approval gate is satisfied for these exact proof exports. Future revisions and release art remain separately reviewed.
