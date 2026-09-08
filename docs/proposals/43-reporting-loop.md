# Proposal 43: hidden-object reporting and evidence loop

Issue: [#43](https://github.com/jonesrussell/minoo-game-engine/issues/43)
Dependencies: [#32](https://github.com/jonesrussell/minoo-game-engine/issues/32) scene contract,
[#91](https://github.com/jonesrussell/minoo-game-engine/issues/91) campaign outline
Status: specification accepted for S01→K01 checkpoint; runtime and scene code remain planned
Owner: Ford Frenzy game maintainers

## Why

The opening storyboards (#91/#92/#93, owner-approved 2026-09-07) define search,
source triage and editorial review as one loop: finding a prop is not proving a
claim. The headless runtime (#7) counts unique finds only. Ford Frenzy needs an
explicit contract for investigation actions, notebook outputs, retries, hints,
replay and save boundaries before #9, #96 and #95 implement S01.

The owner authorized the next delivery checkpoint:

**New Game → six S01 objects → recorder/charger and source triage → K01 assignment
complete.**

S02 transition unlocks after K01 but S02 gameplay is not part of this checkpoint.

## Scope and exclusions

In scope:

- Durable [reporting-loop spec](../specs/reporting-loop.md) with stable requirement
  and scenario IDs
- Structured game actions: `select`, `hint`, `check-source`, `pair-recorder`,
  `submit-draft`, `reset`
- Engine versus game-package ownership for finds, evidence truth and notebook state
- S01 canonical object IDs `S01.O1`–`S01.O6` and K01 gate rules aligned with
  [full-game S01](../storyboards/full-game.md) and [opening handoff](../storyboards/opening-handoff.md)
- S02/S03 loop summaries tied to storyboards; normative scenario detail for S01→K01
- Source classification (`fact`, `allegation`, `fiction`) on content references
- Planned verification mapping to #9, #10, #11, #95 and #96

Excluded: renderer (#8), asset import (#37), HUD chrome (#106), S02/S03 scene
implementation (#98/#99), persistence schema implementation (#11), generalized
content-reference types (#95), investigation state machine code (#96), Studio,
timers, hint scoring, vocabulary pronunciation (#44) and any claim that runtime
or the full campaign is implemented or production-approved.

## Requirements

- LOOP-BOUNDARY-001: `@minoo/engine/runtime` owns unique finds and
  search-completed only; the game package owns evidence truth, notebook entries,
  charger pairing, editorial acceptance and scene progression flags.
- LOOP-ACTION-001: Investigation sessions accept only the documented structured
  actions with stable shapes; unknown actions fail without mutating state.
- LOOP-FIND-001: A `select` find never upgrades a source to verified fact or
  proves an allegation.
- LOOP-S01-OBJECTS-001: S01 uses canonical IDs `S01.O1`–`S01.O6` from the
  approved storyboard; no parallel object list.
- LOOP-S01-GATE-001: K01 requires all six finds, `pair-recorder` with
  `connector: recorder`, `check-source` on the H01 published-report content
  attached to `S01.O5`, and `submit-draft` with `basis: published-report`.
- LOOP-S01-RETRY-001: Wrong charger or unsupported draft basis returns
  explanatory feedback, preserves finds and allows unlimited retry without hint
  or progress penalty.
- LOOP-NOTEBOOK-001: Notebook entries are immutable; K01 is awarded at most once
  per session.
- LOOP-TRANSITION-001: After K01, `transitionS02` is `unlocked`; S02 play remains
  unimplemented at this checkpoint.
- LOOP-HINT-001: Three hints per scene via engine `hintBudget: 3`; no hard
  timer and no hint-point scoring; editorial failure feedback remains available
  with zero hints left.
- LOOP-DUPLICATE-001: Duplicate `select` or repeated successful editorial steps
  do not add finds, notebook entries or rewards.
- LOOP-REPLAY-001: Identical initial state and ordered actions reproduce
  investigation outcomes deterministically.
- LOOP-RESET-001: Confirmed scene reset clears only the current scene's
  uncompleted work; confirmed full New Game clears the session after progress-loss
  confirmation.
- LOOP-SAVE-001: Continue appears only for a compatible saved session; unavailable
  storage allows in-memory play without a false Continue; reload applies only
  valid versioned action logs.
- LOOP-INPUT-001: Pointer, touch and keyboard paths reach the same outcomes;
  an optional accessible list alternative may satisfy the 44 CSS px target (#41).
- LOOP-SOURCE-001: Content references retain `fact`, `allegation` or `fiction`
  classification; labels come from approved content records, not invented
  vocabulary fields.
- LOOP-CONTENT-001: Source and content labels use the generalized v2 reference
  shape defined in #95; historical claims stay in content metadata, not scene
  vocabulary strings.

## S02/S03 summaries (storyboard-aligned, downstream implementation)

| Scene | Search complete gate | Investigation pass | Output |
| --- | --- | --- | --- |
| S02 | Six finds `S02.O1`–`S02.O6` | May 16/17 public timeline; reject post–17 May props | K02 |
| S03 | Six finds `S03.O1`–`S03.O6` | Headline layout with report, denial and uncertainty; BR-CH1 choice | K03 |

Detailed comparison rules for S02/S03 follow the same retry, hint and notebook
patterns as S01. #98 and #99 own scene-specific action surfaces.

## Tasks

| Task | Requirement IDs | Owner | Planned check | Expected outcome |
| --- | --- | --- | --- | --- |
| Publish durable reporting-loop spec | all LOOP-* | #43 | Spec review against storyboards | Requirement and scenario IDs stable |
| Define v2 content-reference fields for sources | LOOP-CONTENT-001, LOOP-SOURCE-001 | #95 | Structural validation fixtures | `fact`/`allegation`/`fiction` preserved |
| Implement investigation state reducer | LOOP-BOUNDARY-001, LOOP-NOTEBOOK-001, LOOP-TRANSITION-001 | #96 | Headless unit tests | Engine finds delegated; game truth separate |
| Wire S01 scene actions and K01 gate | LOOP-S01-* , LOOP-S01-RETRY-001 | #9 | S01 headless + browser scenarios FF-LOOP-001–006 | K01 once; S02 unlocked only |
| Hint budget and editorial feedback | LOOP-HINT-001, LOOP-DUPLICATE-001 | #10 | Hint exhaustion + failed draft fixtures | Three hints; failure still explains |
| Save, reset and replay across actions | LOOP-RESET-001, LOOP-SAVE-001, LOOP-REPLAY-001 | #11, #96 | Corruption/unavailable-storage fixtures (#42) | Continue honest; versioned reload only |
| Accessible input parity | LOOP-INPUT-001 | #8, #41, #106 | Keyboard/touch/browser evidence | Same outcomes without pointer-only steps |

All checks above are **planned**. No implementation check is executed by this
proposal.

## Verification

- Planned: requirement scenarios FF-LOOP-001 through FF-LOOP-014 in
  [reporting-loop.md](../specs/reporting-loop.md), mapped to implementing issues
- Planned commands at implementation: `npm run typecheck`, `npm test`, targeted
  headless suites for #96/#9, `npm run test:e2e` for #9/#106, save fixtures for
  #11/#42
- Storyboard traceability: FF-OPEN-001, FF-OPEN-002, FF-OPEN-006–009,
  FF-SCN-001, FF-SAVE-001, FF-INPUT-001
- Approvals reflected: revision 2 storyboards (#91/#92/#93) and owner-authorized
  S01→K01 checkpoint only; not runtime delivery or full-campaign production sign-off

## Proposal trace

Durable behavior: [docs/specs/reporting-loop.md](../specs/reporting-loop.md).
