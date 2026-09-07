# Proposal 94: opening art direction

**Issue:** #94. **IDs:** FF-VIS-001..005. **Status:** draft; owner visual approval pending.

Revision 2 storyboards (#92, #93) are satisfactory for narrative. This proposal adds [art-direction.md](../art-direction.md) and visual acceptance requirements. Records #103 reference hashes; does not generate or ship textures. #104 stays blocked until visual approval; release exports are #17.

## FF-VIS-001: Editorial comic style

Opening art MUST match satirical 2D editorial comic direction (ink contours, blocky silhouettes, background halftone only, civic blue / cream / mustard / brick red). MUST NOT read as photoreal, pixel art or cozy cottage.

- Given S01-S03 and shell screens, when visual review runs, then contour, palette and silhouette stay consistent.
- Given ff-075, when title/menu are composed, then parody tone matches without copying baked logo type.
- Given rejected style drift, when selection runs, then this brief remains authoritative.

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
- Given ff-022/ff-037, when silhouette style is judged, then parent inspection approves or rejects before export.
- Given no owner visual sign-off, when #104 is considered, then generation automation remains blocked.
- Given opening visual QA, when evidence is collected, then screenshots cover title, HUD, loading, error retry and all three scenes; simulation evidence stays separate.

## Verification

**Executed:** art-direction.md; object tables cross-checked to full-game.md; manifest and inventory hashes recorded.

**Planned:** owner mockup/HTML review; browser readability and missing-art checks at #37/#9/#98/#99 commits; budget remeasure after #40/#51 baseline.

**Not claimed:** generated pixels, pipeline proof, CI green, release assets.
