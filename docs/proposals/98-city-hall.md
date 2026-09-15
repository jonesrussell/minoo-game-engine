# S02 City Hall browser checkpoint

Issue: #98. Status: draft implementation, blocked by #158 and pending #157 integration.

## Scope and requirements

Reuse the existing Pixi renderer, validated presentation, HUD and episode session for S01 to S02, with the public-counter search, embedded timeline and dialogue history. Traceability: PRES-001 through PRES-005; FF-OPEN-003, FF-OPEN-006, FF-OPEN-008, FF-OPEN-010; EPI-SCENE-ORDER-001 and EPI-S01-IMPORT-001.

## Implementation record

Claude Sonnet 5 implemented the browser slice in a separate native checkout. The initial attempt exhausted 85 turns. A same-session recovery preserved the exact dirty checkout. This SDD record was added at recovery checkpoint after initial implementation; it does not claim the proposal was written beforehand.

Root interrupted the recovery after finding a page-reload workaround for a second-renderer failure. The workaround blocks memory-only continuation and is NOT accepted for MVP. Root preserved the candidate rather than merging it. #158 owns reproduction and the renderer lifetime fix. #157 adds the remaining authoritative press-kit puzzle gate; this draft must be adapted to that API before final qualification.

## Assets

City Hall background and visitor bell are original generated candidates in docs/art/city-hall-01 with prompts and hashes. Other props still reuse provisional artwork. Final prop choices, geometry, art and owner acceptance remain open. Do not describe this as a finished hidden-object scene.

## Verification

An earlier working-tree browser run reached S02, exercised the timeline retry, awarded K02 and checked dialogue history. Screenshots were inspected and revealed floating/mismatched props, prompting recovery work. That evidence predates the final dirty candidate and is NOT final qualification. Later partial runs overwrote the local results file; no final full S02 suite pass is claimed.

Planned after #158 and #157: in-page transition without reload; memory-only completion; pointer/touch/spatial-keyboard completion; partial save/reload; old S01 import; corrupted save preservation; loading failure/retry; no duplicate K02; history leaves journal unchanged; screenshot inspection of grounded props and coherent UI.

## Remaining work

- Remove reload/storage-dependent transitions after fixing #158.
- Integrate #157 kit stacking without UI-only completion flags.
- Finish all input/recovery checks and inspect final screenshots.
- Finalize six recognizable grounded props and owner art review.
- Continue to S03 under #99 only after shared transition qualification.
