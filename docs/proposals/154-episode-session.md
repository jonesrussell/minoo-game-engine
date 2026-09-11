# Proposal 154: deterministic three-scene episode session

Issue: [#154](https://github.com/jonesrussell/minoo-game-engine/issues/154)
Dependencies: [#7](https://github.com/jonesrussell/minoo-game-engine/issues/7) headless
runtime, [#43](https://github.com/jonesrussell/minoo-game-engine/issues/43)
reporting-loop spec, [#95](https://github.com/jonesrussell/minoo-game-engine/issues/95)
v2 content references, [#96](https://github.com/jonesrussell/minoo-game-engine/issues/96)
S01 investigation session, [#153](https://github.com/jonesrussell/minoo-game-engine/issues/153)
MVP definition
Status: specification and headless implementation for the #154 checkpoint; browser
integration, HUD, art and release approval remain planned follow-on work
Owner: Ford Frenzy game maintainers

## Why

#96 shipped a deterministic S01 session (`NewsroomSession`) gated to the
owner-authorized **S01 → K01 only** checkpoint. #153 authorizes the opening
episode (S01–S03) as the current MVP scope. #154 is the explicitly deferred
cross-scene residual: an independently usable, headless episode foundation that
sequences the shipped S01 session into S02 and S03 using the same engine
primitives (`createRuntime` find/hint), without inventing a second S01
implementation and without claiming browser, art or full-campaign delivery.

## Scope and exclusions

In scope:

- Durable [episode spec](../specs/episode.md) with stable requirement and
  scenario IDs, extending [reporting-loop.md](../specs/reporting-loop.md)
- `games/ford-frenzy/src/episode.ts`: a headless `EpisodeSession` that reuses
  the shipped `NewsroomSession` for S01 (no reducer fork) and calls
  `createRuntime` directly for S02/S03 find/hint behavior
- `games/ford-frenzy/data/s02.json` and `s03.json`: validated `SceneV2` data
  with exact canonical object IDs `S02.O1`–`S02.O6` / `S03.O1`–`S03.O6` from
  [full-game.md](../storyboards/full-game.md), fictional in-game content only
- Strict scene sequencing (`enter-scene`) that only unlocks the next scene after
  the prior scene's single K award, matching the common scene contract in
  full-game.md
- S02 May 16/17 public-timeline check and S03 supported-account plus binary
  BR-CH1 emphasis choice, atomically committed with K03
- Explicit, validated import of an existing public S01 v1 save
  (`restoreNewsroomSession`) as the optional first episode action, and a
  canonical versioned episode save that round-trips through export/restore
- Scene-scoped and whole-episode reset boundaries; bounded, frozen, replayable
  action journal
- Focused headless unit tests in `tests/unit/ford-episode.test.ts`

Excluded: renderer/HUD wiring in `main.ts` (separate integration issue), S02/S03
presentation data and art, asset import, a second UI shell, Studio, timers, hint
scoring, campaign continuation beyond S03, and any claim that this checkpoint is
release- or playtest-approved. Public S01 (`session.ts`, `s01.json`, `main.ts`,
HUD, renderer) is unchanged by this proposal.

## Requirements

See [docs/specs/episode.md](../specs/episode.md) for the full normative list
(`EPI-ACTION-001` through `EPI-IMMUTABLE-001`). Summary:

- `EPI-SCENE-ORDER-001` / `EPI-SCENE-LOCKED-001`: strict S01→S02→S03 order; each
  scene's action types are rejected outside their owning scene.
- `EPI-S02-OBJECTS-001` / `EPI-S03-OBJECTS-001`: canonical storyboard object IDs,
  no parallel list.
- `EPI-S02-GATE-001` / `EPI-S02-RETRY-001`: K02 requires six finds plus the
  correct May 16-before-May-17 order and interpretation; wrong attempts preserve
  finds and retry without hint penalty.
- `EPI-S03-GATE-001` / `EPI-S03-RETRY-001`: K03 requires six finds, a chosen
  emphasis branch and the supported (not exclusive-video) account; success
  commits K03 and the branch atomically.
- `EPI-NOTEBOOK-001` / `EPI-DUPLICATE-001`: combined notebook retains prior K
  outputs across scene transitions; no duplicate awards.
- `EPI-REPLAY-001` / `EPI-IMMUTABLE-001`: deterministic replay over a bounded,
  frozen action journal.
- `EPI-RESET-001`: scene reset only touches the current unfinished scene and
  keeps prior outputs; episode reset clears everything.
- `EPI-S01-IMPORT-001` / `EPI-SAVE-001`: explicit, validated S01 v1 save import
  as the first action only; malformed, extra-property, future-version or
  invalid-journal saves are rejected transactionally; a valid save round-trips.

## Tasks

| Task | Requirement IDs | Planned check | Expected outcome |
| --- | --- | --- | --- |
| Publish durable episode spec | all `EPI-*` | Spec review against full-game.md/opening-handoff.md | Requirement and scenario IDs stable |
| Author validated S02/S03 `SceneV2` data | `EPI-S02-OBJECTS-001`, `EPI-S03-OBJECTS-001` | `validateSceneV2` in tests | Canonical IDs, positive-fiction content, no invented real-world claims |
| Implement `EpisodeSession` orchestration | `EPI-SCENE-ORDER-001`, `EPI-SCENE-LOCKED-001`, `EPI-NOTEBOOK-001` | Headless gating tests | S02/S03 unreachable before prior award; actions scene-locked |
| Implement S02 timeline gate | `EPI-S02-GATE-001`, `EPI-S02-RETRY-001` | Correct/wrong order and interpretation fixtures | K02 once; wrong attempts preserve finds |
| Implement S03 account/emphasis gate | `EPI-S03-GATE-001`, `EPI-S03-RETRY-001` | Correct/wrong account and missing-emphasis fixtures | K03 + branch atomic; wrong attempts preserve finds |
| Reset boundaries | `EPI-RESET-001` | Scene-reset-before/after-award and episode-reset fixtures | Only current unfinished scene clears; prior K outputs persist |
| S01 save import and episode save round-trip | `EPI-S01-IMPORT-001`, `EPI-SAVE-001` | Public S01 save fixture import + export/restore round-trip; malformed/tampered rejection fixtures | Honest S01 progress preserved; transactional rejection |
| Determinism and immutability | `EPI-REPLAY-001`, `EPI-IMMUTABLE-001` | Repeated replay + frozen-snapshot assertions | Identical state/events; caller mutation has no effect |

All checks above are executed by this proposal's headless test suite; browser,
HUD and art evidence remain planned follow-on work (#98/#99 integration).

## Verification

- Executed: `npm run typecheck`, `node --test tests/unit/ford-episode.test.ts`,
  `npm run check:repository`
- Not executed by this proposal: `npm run test:e2e` (browser/HUD/art
  integration is out of scope for this headless foundation)
- Storyboard traceability: FF-OPEN-003 through FF-OPEN-006 and FF-OPEN-012 in
  [opening-handoff.md](../storyboards/opening-handoff.md); common scene contract
  in [full-game.md](../storyboards/full-game.md)
- Approvals reflected: revision 2 storyboards (#91/#92/#93) and the #153
  opening-episode MVP authorization; not a claim of art, rights, browser
  integration or playtest sign-off

## Proposal trace

Durable behavior: [docs/specs/episode.md](../specs/episode.md).
