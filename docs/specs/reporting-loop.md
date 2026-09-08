# Reporting and evidence loop specification

Status: specified in #43. No browser scene, investigation reducer, save schema or
full-campaign runtime is claimed implemented by this document.

This contract defines the Ford Frenzy investigation loop for the owner-approved
opening storyboards (S01–S03 structure; **authorized checkpoint: S01 through K01
only**). It follows OWN-002 and OWN-004 in
[package boundaries](../package-boundaries.md), delegates find counting to
[runtime.md](runtime.md) and aligns with
[ford-frenzy-experience.md](ford-frenzy-experience.md) FF-SCN-001 and FF-SAVE-001.

Canonical S01 objects and copy beats live in
[full-game.md](../storyboards/full-game.md) and
[opening-handoff.md](../storyboards/opening-handoff.md). Do not duplicate a second
object list.

## Public boundary

```ts
// Engine (@minoo/engine/runtime) — find/search only
type EngineAction =
  | { type: 'select'; objectId: string }
  | { type: 'hint' }
  | { type: 'reset' }; // clears engine find state for the active scene run

// Game package (Ford Frenzy) — investigation semantics
type InvestigationAction =
  | EngineAction
  | { type: 'check-source'; contentId: string }
  | { type: 'pair-recorder'; connector: 'recorder' | 'phone' }
  | { type: 'submit-draft'; basis: 'published-report' | 'office-rumour' }
  | { type: 'reset'; scope: 'scene' | 'session' }; // game-layer reset
```

The game package MUST call `createRuntime(scene, { hintBudget: 3 })` for S01–S03
and apply `select`/`hint` through the engine. The engine MUST NOT interpret
`check-source`, `pair-recorder`, `submit-draft`, notebook outputs, source truth or
K awards.

Game-owned session fields (minimum for this checkpoint):

| Field | Role |
| --- | --- |
| `notebook` | Append-only immutable entries after award |
| `sourceChecks` | Set of `contentId` values the player has checked |
| `chargerPaired` | `null`, `recorder`, or `phone` after `pair-recorder` |
| `editorialAccepted` | Whether the current scene draft passed review |
| `k01Awarded` | K01 awarded at most once |
| `transitionS02` | `locked` until K01; then `unlocked` (S02 play not implemented here) |

S02/S03 add their own K gates and comparison surfaces in #98/#99 using the same
patterns.

## Structured actions

### LOOP-ACTION-001: Supported shapes only

Investigation stepping MUST accept only the action variants above as plain objects
with exactly the documented fields. Unknown `type` values or wrong-shaped payloads
MUST return stable diagnostics and MUST NOT change game or engine state.

### Delegated engine actions

`select` and `hint` behavior MUST match [RTN-SELECT-001](runtime.md),
[RTN-HINT-001](runtime.md) and [RTN-COMPLETE-001](runtime.md) for the active
scene snapshot. `searchCompleted` means every `completion.requiredIds` entry is
found.

Engine `reset` clears find state only. Game `reset` with `scope: 'scene'` also
clears scene-local investigation fields listed above except notebook entries and
`k01Awarded`. Game `reset` with `scope: 'session'` clears the full session after
user confirmation (LOOP-RESET-001).

### Game investigation actions

| Action | When allowed (S01) | Success effect |
| --- | --- | --- |
| `check-source` | After `contentId` is reachable from a found object | Record `contentId` in `sourceChecks` |
| `pair-recorder` | After `S01.O6` is found | Set `chargerPaired` to the chosen connector |
| `submit-draft` | After all six finds | Set `editorialAccepted` or return retry feedback |

`pair-recorder` and `submit-draft` MAY be rejected with diagnostics when
prerequisites are unmet; rejection MUST NOT clear finds.

## Find versus evidence

### LOOP-FIND-001: Finds do not prove claims

A successful `select` MUST NOT set `sourceChecks`, award K outputs, mark a source
as `fact`, or treat an `allegation` as proven. UI copy MUST keep find labels
distinct from verified or filed status (FF-UI-002).

### LOOP-SOURCE-001: Classification on content references

Each checkable source MUST reference a v2 content record (#95) carrying
`classification: 'fact' | 'allegation' | 'fiction'` plus attribution metadata.
Scene objects link to content by `contentId`; they MUST NOT embed historical
claims in vocabulary label fields (LOOP-CONTENT-001).

S01 published-report content for `S01.O5` references historical **H01** as
`allegation` with published-report attribution. Office rumour on `S01.O4` is
`fiction` desk material, not a filed basis.

## S01 canonical objects

### LOOP-S01-OBJECTS-001: Storyboard IDs

S01 `completion.requiredIds` MUST be exactly:

`S01.O1`, `S01.O2`, `S01.O3`, `S01.O4`, `S01.O5`, `S01.O6`

| ID | Storyboard object | Class |
| --- | --- | --- |
| S01.O1 | Reporter notebook under pizza box | tool |
| S01.O2 | Contact sheet printout | context |
| S01.O3 | Wall calendar May 2013 | context |
| S01.O4 | Assignment folder (office rumour sticky) | tool |
| S01.O5 | Published report clipping summary (H01) | evidence |
| S01.O6 | Digital recorder (wrong phone charger nearby) | tool |

## S01 K01 gate

### LOOP-S01-GATE-001: Assignment complete

K01 MUST be awarded only when **all** of the following hold simultaneously:

1. `searchCompleted` is true (six unique finds).
2. `chargerPaired === 'recorder'`.
3. H01 published-report `contentId` from `S01.O5` is in `sourceChecks`.
4. Latest successful `submit-draft` used `basis: 'published-report'`.

On success: append immutable notebook entry **K01** once, set `k01Awarded: true`,
set `editorialAccepted: true`, set `transitionS02: 'unlocked'`. Do not load S02
at this checkpoint.

### LOOP-S01-RETRY-001: Preserve finds on failure

- GIVEN `chargerPaired === 'phone'` OR `submit-draft` with `basis: 'office-rumour'`
- WHEN the player requests editorial review
- THEN feedback explains the error (wrong charger and/or rumour filed as fact),
  `foundIds` and `sourceChecks` are unchanged, `k01Awarded` remains false and
  unlimited retries are allowed with no hint penalty.

### LOOP-NOTEBOOK-001: Single K01 award

Repeating a successful K01 path MUST NOT append a second K01 or duplicate notebook
progression.

### LOOP-TRANSITION-001: S02 unlocked, not implemented

After K01, `transitionS02` MUST be `unlocked`. Entering S02 simulation, assets and
comparison rules are owned by #98; this spec does not require S02 runtime at the
#43 checkpoint.

## Hints, time and duplicates

### LOOP-HINT-001: Three optional hints

S01 MUST use `hintBudget: 3`. There is no hard countdown timer and no hint-point
score. When hints are exhausted, `submit-draft` failure MUST still return editorial
explanation (FF-OPEN-009).

### LOOP-DUPLICATE-001: No extra reward

Duplicate `select` on the same object MUST emit engine `duplicate` only. Replaying
`check-source` on an already checked `contentId` MUST be idempotent. Repeated
successful editorial steps after K01 MUST NOT add rewards.

## Replay, reset and save

### LOOP-REPLAY-001: Deterministic investigation replay

Given the same validated scene snapshot, initial game session and ordered
`InvestigationAction` list, stepping MUST yield identical engine state, game
fields, notebook contents and events on repeated runs. Replay logs (#38) MUST
embed enough snapshot data to reproduce both engine and game outcomes (#96).

### LOOP-RESET-001: Scene versus session reset

- **Scene reset** (`reset` with `scope: 'scene'`, after confirmation): allowed
  only before K01; reject after completion. Before K01, clear
  current-scene finds (engine reset), scene-local `sourceChecks`/`chargerPaired`/
  `editorialAccepted`; retain notebook and `k01Awarded`.
- **Session reset** (New Game after confirmation): clear all campaign progress,
  notebook and flags; preferences MAY remain (FF-SAVE-001).

### LOOP-SAVE-001: Honest Continue

Continue MUST appear only when a compatible versioned save or action log restores
successfully. If `localStorage` (or the configured port) is unavailable, the game
MUST allow in-memory play and MUST NOT show an enabled Continue that cannot restore.
Reload MUST apply only valid versioned actions; corrupt or incompatible data MUST
surface recovery options without silently dropping prior honest progress (#11, #42).

## Input

### LOOP-INPUT-001: Equivalent modalities

Pointer, touch and keyboard input MUST reach the same investigation outcomes
(FF-INPUT-001). Drag-based inspect trays MUST expose select-and-confirm
equivalents. An optional accessible object list MAY satisfy the 44 CSS px minimum
when scaled hits are too small (#41, #8).

## Scenarios and traceability

| ID | Given / when / then | Planned owner |
| --- | --- | --- |
| FF-LOOP-001 | Given New Game on S01, when the scene loads, then six targets are findable, K01 is absent and duplicate `select` does not increase score. | #9, #96 |
| FF-LOOP-002 | Given five finds, when `submit-draft` runs, then the step is rejected without clearing finds. | #96, #9 |
| FF-LOOP-003 | Given six finds and `chargerPaired: phone`, when `submit-draft` runs, then feedback cites the wrong charger and finds persist. | #9, #43 |
| FF-LOOP-004 | Given six finds and `submit-draft` with `basis: office-rumour`, when review runs, then feedback cites rumour-as-fact and finds persist. | #9, #43 |
| FF-LOOP-005 | Given six finds, `chargerPaired: recorder`, H01 checked, when `submit-draft` uses `published-report`, then K01 is awarded once and `transitionS02` is `unlocked`. | #9, #96 |
| FF-LOOP-006 | Given K01 awarded, when the success path repeats, then no second K01 is recorded. | #96, #9 |
| FF-LOOP-007 | Given `hintBudget: 3`, when three hints are used, then further hints fail with exhausted diagnostic and editorial retry still explains failures. | #10, #106 |
| FF-LOOP-008 | Given a recorded S01 action sequence, when replay runs twice, then final notebook and flags match. | #96, #38 |
| FF-LOOP-009 | Given incomplete S01, when confirmed scene reset runs, then its working state clears; after K01, scene reset is rejected. | #11, #105 |
| FF-LOOP-010 | Given confirmed New Game, when accepted, then session notebook and flags clear after warning. | #11, #105 |
| FF-LOOP-011 | Given unavailable persistence, when Title loads, then Continue is absent/disabled and New Game works in memory. | #11, #42 |
| FF-LOOP-012 | Given reload with valid versioned log, when Continue runs, then finds, hints, checks and notebook match the log. | #11, #96 |
| FF-LOOP-013 | Given `select` on `S01.O5` without `check-source`, when `submit-draft` runs, then K01 is not awarded. | #9, #95 |
| FF-LOOP-014 | Given keyboard-only play, when S01 K01 path runs, then outcomes match pointer play. | #8, #41, #106 |

Storyboard crosswalk: FF-LOOP-001 ↔ FF-OPEN-001; FF-LOOP-003/004 ↔ FF-OPEN-002;
FF-LOOP-005 ↔ FF-OPEN-002; FF-LOOP-007 ↔ FF-OPEN-009; FF-LOOP-009/010 ↔
FF-OPEN-007; FF-LOOP-011/012 ↔ FF-OPEN-006.

## Exclusions

Rendering, art import, HUD layout, S02/S03 scene code, persistence implementation,
generalized content-reference schema (#95), investigation reducer code (#96),
Studio, pronunciation (#44), hint scoring, hard timers and full-campaign production
approval remain out of scope for this specification.

## Proposal trace

See [proposal 43](../proposals/43-reporting-loop.md).

## Verification

- Planned: headless tests in #96 and S01 tests in #9 covering FF-LOOP-001–006 and
  FF-LOOP-013; hint fixtures in #10; save/reload fixtures in #11/#42; content
  classification fixtures in #95; browser input evidence in #8/#106 for
  FF-LOOP-014
- Executed: none by this specification change
- Human review: storyboard alignment and S01 editorial copy remain owner-facing;
  green automated checks do not prove historical accuracy or shipping readiness
