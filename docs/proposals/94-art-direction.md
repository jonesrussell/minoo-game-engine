# Proposal 94: opening art direction

**Issue:** #94. **IDs:** FF-VIS-001..005. **Status:** art direction owner-approved on 2026-09-07.

Revision 2 storyboards (#92, #93) are approved for narrative. This proposal adds [art-direction.md](../art-direction.md), visual acceptance requirements and one generated flat concept with editable presentation. It records #103 reference hashes but ships no runtime textures. #104 now proceeds to pipeline proof; release exports are #17.

## FF-VIS-001: Editorial comic style

Opening art MUST match the [approved GTA IV inspired direction](../art/visual-direction-02/approval.md): heavy ink, grounded adult faces, casual clothing, muted olive / slate / tan / rust. MUST NOT read as photoreal, pixel art or cozy cottage.

- Given S01-S03 and shell screens, when visual review runs, then contour, palette and silhouette stay consistent.
- Given ff-075, when title/menu are composed, then parody tone matches without copying baked logo type.
- Given rejected style drift, when review runs, then the rejected candidate is not promoted. The approved direction governs production; earlier experiments remain superseded.

## FF-VIS-002: Layers and canonical IDs

Backgrounds, objects, effects and UI stay separate. IDs MUST match [full-game.md](../storyboards/full-game.md); no alternate inventories.

- Given any scene, when backgrounds render, then no Sxx.O1-O6 find exists only in the background bitmap.
- Given parallax, when the stage letterboxes, then object hit regions do not drift.
- Given S01.O6 charger puzzle, when inspect opens, then controls are UI layers, not hidden scene objects.

## FF-VIS-003: Fit, alpha and readability

Stage 1920x1080, letterboxed fit; 2560x1440 background is a budget proposal. Targets readable at >= 44 CSS px via zoom or list.

- Given resize, when an object is selected, then the stable ID matches canonical Sxx.On.
- Given sprites on cream paper, when reviewed, then alpha edges do not halo and evidence text stays legible.
- Given reduced motion, when S03 lamps or S02 haze show, then static frames preserve scene identity.

## FF-VIS-004: Loading vs asset failure

Neutral silhouette while manifests validate. Missing art shows retry/back; no fake progress or partial scene init (FF-UI-003, FF-OPEN-010).

- Given valid manifests, when transition starts, then placeholder may show until decode; no required progress bar.
- Given missing texture, when load fails, then explicit error, retry and title back; no find state committed.
- Given retry after transient failure, when scene enters, then canonical object layers appear.

## FF-VIS-005: References, QA and gates

Exports record reference IDs, hashes, dimensions, alpha policy and review outcome (FF-ART-002). Repository references stay authoring-only until #17.

- Given ff-044, when BG02 is composed, then hallway line follows reference; unrelated marks removed.
- Given ff-022/ff-037, when silhouette style is judged, then visual inspection and hash verification are recorded separately from owner and rights approval before production export.
- Given no owner visual sign-off, when #104 is considered, then generation automation remains blocked.
- Given opening visual QA, when evidence is collected, then screenshots cover title, HUD, loading, error retry and all three scenes; simulation evidence stays separate.

## Verification

**Executed:** art-direction.md; object tables cross-checked to full-game.md; reference hashes verified; generated flat concept inspected; editable scene/title view toggles and 390px page overflow checked. Texture-budget arithmetic corrected during independent review. Actual prompt and output metadata are linked in the art brief.

**Owner review executed:** GTA IV inspired concept approved in conversation ("awesome, locked in") on 2026-09-07. See the linked approval record and exact image hash.

**Planned:** browser readability and missing-art checks at #37/#9/#98/#99 commits; budget remeasure after #40/#51 baseline.

**Not claimed:** separate production sprites/background, pipeline proof, final UI acceptance or release assets. Hosted check evidence is recorded on the PR.
