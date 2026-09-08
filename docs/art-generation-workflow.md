# Art generation and export workflow

Issue #104 establishes a reviewable proof for one S01 background and six
separate target sprites. It is a development export workflow. The game never
calls an image-generation service at runtime.

## Provenance

Every candidate records its source reference IDs and SHA-256 hashes, prompt
file (or prompt text), tool, model, generation date, output hash, dimensions,
manual edits, and review outcome. The approved visual-direction-02 reference
is `ff-concept-newsroom-02`, SHA-256
`0bf1e81cd1b91b4ac8ca229744e7308f4e5be365b72852cb80892c9364aad880`, generated
2026-09-07 with `image_gen.imagegen`; the built-in model is recorded as “not
exposed by built-in tool”. Its prompt is `docs/art/visual-direction-02/prompt.txt`.
The source PNG and every candidate are immutable originals: no pixel edits,
silent replacement, or in-place regeneration. Any revision gets a new asset ID,
output hash, and review record; rejected candidates remain available for audit.

Style approval for the reference does not approve a new background or target
export. The current candidates are owner-export approval pending. Issue #104
remains open until an actual background proof is reviewed and approved.

## Export contract

The logical stage is 1920x1080. Export one opaque background PNG and six RGBA
target PNGs with stable IDs `S01.O1` through `S01.O6`. Targets are independent
layers with transparent pixels outside their artwork; the background has no
hidden find mapping. Keep title, HUD, labels, and other live overlays editable
and separate. Do not bake historical evidence text into generated art.

The PNGs are proof artifacts. Later production may create optimized WebP
backgrounds, atlases, or residency/streaming variants, but those are derived
artifacts with their own hashes and manifest entries. Do not treat encoded
transfer size as decoded texture residency, or claim renderer choices here.

## Review and rejection

For each candidate, verify alpha edges, nontransparent bounds, logical scale,
stable target ID, visible placement over the background, and light/dark preview.
Exercise fitted views at 390x844, 844x390, and 1440x900, including keyboard
focus/navigation; readability must survive scaling and mobile layout. A target
must remain recognizable and its tested bounds must follow the exported object.

An approved revision is selected by an explicit owner review recorded beside
the manifest. If review rejects a candidate, preserve the last approved
revision and mark the candidate rejected; never regenerate silently or let a
failed export replace the approved one. No claim of finished art, final
renderer, full-scene occlusion, or production residency belongs in this proof.

## Manifest minimum

The proof manifest links each stable ID to source IDs/hashes, candidate output
hash and dimensions, alpha policy, logical scale, prompt/tool/model/date,
manual-edit status, review state, and immutable file path. It also records the
QA checks and their evidence paths. Missing evidence is pending, not passed.

## Proof accepted

The owner approved the completed separated-asset proof on 2026-09-07.
See [approval record](art/pipeline-proof-01/approval.md).
Earlier pending-review wording describes the candidate gate; it is now satisfied
for these exact proof exports. Future revisions and release art remain separately reviewed.
