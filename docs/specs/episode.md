# Episode session specification

Status: specified in #154. No browser scene, HUD, S02/S03 art or full-campaign
runtime is claimed implemented by this document.

This contract defines a headless, deterministic three-scene episode
(**S01 → S02 → S03**) built on top of the shipped [reporting-loop](reporting-loop.md)
S01 session and the [headless runtime](runtime.md). It is the cross-scene residual
explicitly left after #96's S01 checkpoint (#43), not a claim that #96 delivered
S02/S03. It follows OWN-002/OWN-004 in [package boundaries](../package-boundaries.md).

Canonical S02/S03 objects and copy beats live in
[full-game.md](../storyboards/full-game.md) and
[opening-handoff.md](../storyboards/opening-handoff.md). Do not duplicate a second
object list.

## Ownership

The episode session owns scene sequencing (`currentScene`), the K02/K03 gates,
S02/S03 game fields and the combined notebook. It reuses the shipped
`NewsroomSession` (`games/ford-frenzy/src/session.ts`) unmodified for S01 by
delegating S01-shaped actions to `session.step(...)`; it does not reimplement or
fork the S01 reducer. It calls `createRuntime` directly for S02 and S03 find/hint
behavior, exactly as `NewsroomSession` does for S01. The engine
(`@minoo/engine/runtime`) continues to own only unique finds, hints and
search-completed; it does not interpret episode actions.

## Public boundary

```ts
type S01SubAction = Exclude<NewsroomAction, { type: 'reset' }>; // select | hint | check-source | pair-recorder | submit-draft

type S02Action =
  | { type: 'select'; objectId: string }
  | { type: 'hint' }
  | { type: 'order-timeline'; first: 'S02.O3' | 'S02.O6'; second: 'S02.O3' | 'S02.O6' }
  | { type: 'submit-timeline'; interpretation: 'order-of-reports' | 'proof-of-allegation' };

type S03Action =
  | { type: 'select'; objectId: string }
  | { type: 'hint' }
  | { type: 'choose-emphasis'; branch: 'splash-first' | 'lawyer-voice' }
  | { type: 'submit-account'; support: 'attributed-and-denied' | 'exclusive-video-claim' };

type EpisodeAction =
  | S01SubAction
  | S02Action
  | S03Action
  | { type: 'enter-scene'; scene: 'S02' | 'S03' }
  | { type: 'import-s01-save'; save: unknown }
  | { type: 'reset'; scope: 'scene' | 'episode' };
```

`select` and `hint` route to whichever scene is currently active
(`currentScene`); the other action types are unique per scene and are rejected
outside their owning scene.

## Requirements and scenarios

### EPI-ACTION-001: Structured actions only

The episode session MUST accept only the documented action shapes with exactly
their own fields. Unknown `type` values, wrong-shaped payloads or an
`order-timeline` with `first === second` MUST return stable diagnostics and MUST
NOT mutate state or enter the journal.

### EPI-SCENE-ORDER-001: Strict forward sequencing

`enter-scene` MUST succeed only when `scene: 'S02'` is requested while
`currentScene === 'S01'` and K01 is awarded, or `scene: 'S03'` is requested while
`currentScene === 'S02'` and K02 is awarded. Any other request (skipping a scene,
re-entering the current or a prior scene, or entering before the prior scene's
single award) MUST fail with `EPISODE_SCENE_ORDER` and MUST NOT change
`currentScene` or create a new scene runtime.

#### Scenario: S02 unreachable before K01

- GIVEN a fresh episode on S01 without K01
- WHEN `{ type: 'enter-scene', scene: 'S02' }` is applied
- THEN the step fails with `EPISODE_SCENE_ORDER` and `currentScene` remains `S01`

### EPI-SCENE-LOCKED-001: Actions bind to the active scene only

S01-only, S02-only and S03-only action types MUST be rejected with
`EPISODE_SCENE_LOCKED` when `currentScene` does not own them. `select`/`hint`
apply to the active scene's runtime (S01's via `NewsroomSession`, S02/S03's via
their own `createRuntime` sessions).

### EPI-S02-OBJECTS-001 / EPI-S03-OBJECTS-001: Storyboard IDs

S02 `completion.requiredIds` MUST be exactly `S02.O1`–`S02.O6`; S03
`completion.requiredIds` MUST be exactly `S03.O1`–`S03.O6`, matching
[full-game.md](../storyboards/full-game.md).

### EPI-S02-GATE-001: May 16/17 timeline

K02 MUST be awarded only when all six S02 objects are found, the last
`order-timeline` recorded `first: 'S02.O6', second: 'S02.O3'` (the May 16 report
before the May 17 denial) and the matching `submit-timeline` used
`interpretation: 'order-of-reports'`. On success: append notebook entry **K02**
once, set `k02Awarded: true`, set `transitionS03: 'unlocked'`.

### EPI-S02-RETRY-001: Wrong order or interpretation preserves finds

- GIVEN six S02 finds
- WHEN `submit-timeline` runs with the May 17 denial ordered before the May 16
  report, or with `interpretation: 'proof-of-allegation'`
- THEN the step succeeds (`ok: true`) with retry feedback, `foundIds` and the
  attempted `timelineOrder` are unchanged in meaning, `k02Awarded` remains
  `false`, and unlimited retries are allowed with no hint penalty.

### EPI-S03-GATE-001: Supported account and atomic branch commit

K03 MUST be awarded only when all six S03 objects are found, an emphasis branch
(`splash-first` or `lawyer-voice`) has been chosen, and `submit-account` uses
`support: 'attributed-and-denied'`. On the single successful transition,
`k03Awarded: true`, the committed `branch` and notebook entry **K03** MUST be set
together — `branch` MUST remain `null` in state until that same successful step.
`episodeCompleted` becomes `true` only at this point and is never a caller-supplied
flag.

### EPI-S03-RETRY-001: Wrong account or missing emphasis preserves finds

- GIVEN six S03 finds
- WHEN `submit-account` runs before an emphasis choice, or with
  `support: 'exclusive-video-claim'`
- THEN the step succeeds with retry feedback, finds and any already-chosen
  emphasis persist, `k03Awarded` remains `false`, `branch` remains `null`, and
  retries are unlimited with no hint penalty.

### EPI-FIND-001: Finds do not prove allegations

A successful `select` in S02 or S03 MUST NOT set timeline order, account
support, award K outputs or mark content as proven. This mirrors
[LOOP-FIND-001](reporting-loop.md).

### EPI-NOTEBOOK-001: Combined notebook retains prior outputs

The episode notebook MUST be the ordered concatenation of the S01 session's
notebook (already including K01) with S02's and S03's recorded entries and their
K02/K03 awards. Entering S02 or S03, or resetting the current scene, MUST NOT
remove already-recorded entries from a prior scene.

### EPI-DUPLICATE-001: No duplicate rewards

Duplicate `select` in any scene, and repeating a successful `submit-timeline` or
`submit-account` after its award, MUST NOT add a second K02/K03 notebook entry or
change the committed `branch`. Repeating a rejected post-award choice with a
different value MUST fail with `EPISODE_PROGRESSION_LOCKED` and MUST NOT mutate
state.

### EPI-REPLAY-001: Deterministic replay

Given the same initial episode session and ordered `EpisodeAction` list,
stepping MUST yield identical `currentScene`, S01/S02/S03 state, notebook,
`branch`, `episodeCompleted` and events on repeated runs.

### EPI-RESET-001: Scene versus episode reset

- **Scene reset** (`reset` with `scope: 'scene'`): applies only to the current,
  unfinished scene. For S01 it delegates to `NewsroomSession`'s own scene reset
  (rejected once K01 is awarded, per [LOOP-RESET-001](reporting-loop.md)). For S02/S03
  it clears that scene's engine finds and in-progress choice fields (timeline
  order, chosen emphasis, hint pointer) but preserves that scene's already
  recorded notebook entries; it MUST be rejected with
  `EPISODE_SCENE_RESET_LOCKED` once that scene's K output is awarded. Prior
  scenes' K outputs and notebook entries are always preserved.
- **Episode reset** (`reset` with `scope: 'episode'`): clears the full episode —
  a fresh S01 session, no S02/S03 runtimes, empty notebook, `currentScene: 'S01'`,
  `branch: null`, `episodeCompleted: false`. The reset action itself remains part
  of the deterministic action history.

### EPI-S01-IMPORT-001: Explicit public S01 save import

`{ type: 'import-s01-save', save: unknown }` MAY be applied only as the first
action of an episode session (empty journal). It MUST validate `save` through
the existing `restoreNewsroomSession` and MUST NOT silently discard an existing
in-progress S01 session — if the episode journal is non-empty, the step MUST fail
with `EPISODE_IMPORT_NOT_FIRST` and leave state unchanged. On success the
episode's S01 session becomes the restored session; subsequent play, save and
replay proceed normally. This preserves compatibility with the public shipped S01
v1 save format without migrating or discarding honest player progress.

### EPI-SAVE-001: Canonical episode save round-trips

`exportSave()` returns a versioned envelope
`{ version, sceneRevisions: { s01, s02, s03 }, actions }`. `restoreEpisodeSession`
MUST reject unknown top-level or `sceneRevisions` properties, an unsupported
`version`, a mismatched scene revision, a non-array `actions`, an
oversized action journal (`EPISODE_ACTION_LIMIT`), and any action that fails to
replay — all transactionally, returning no partial session. Given a session that
imported a valid S01 v1 save and then played across S02/S03,
`restoreEpisodeSession(session.exportSave())` MUST reproduce an identical state,
action journal and re-exported save (round-trip).

### EPI-IMMUTABLE-001: Bounded journal and frozen snapshots

The episode action journal is bounded by `EPISODE_ACTION_LIMIT`. `getState()`,
`getActions()`, `exportSave()` and every `EpisodeStepResult` MUST be deeply
frozen for the caller; caller mutation of a returned value MUST NOT change
subsequent transitions.

## Diagnostics

| Code | Meaning |
| --- | --- |
| `EPISODE_INVALID_ACTION` | Action shape is unsupported or has extra/missing/invalid fields |
| `EPISODE_SCENE_LOCKED` | Action type does not belong to the active scene |
| `EPISODE_SCENE_ORDER` | `enter-scene` requested out of order or before the prior scene's award |
| `EPISODE_SCENE_RESET_LOCKED` | Scene reset requested after that scene's K output is already awarded |
| `EPISODE_PROGRESSION_LOCKED` | A post-award action attempted to contradict the committed outcome |
| `EPISODE_PREREQUISITE` | A scene action ran before its required finds were complete |
| `EPISODE_IMPORT_NOT_FIRST` | `import-s01-save` requested after the episode journal already has actions |
| `EPISODE_INVALID_SAVE` | Save envelope is not a well-formed versioned object or an action failed replay |
| `EPISODE_UNSUPPORTED_SAVE` | Save `version` or `sceneRevisions` entry does not match the bundled content |
| `EPISODE_ACTION_LIMIT` | The action journal exceeds `EPISODE_ACTION_LIMIT` |

`NewsroomDiagnostic` and `RuntimeDiagnostic` codes are returned unchanged when a
routed S01/S02/S03 sub-action fails inside the delegated session or runtime.

## Exclusions

Rendering, HUD, asset import, S02/S03 art, presentation data, full-campaign
scenes beyond S03, Studio integration and any claim of release/playtest approval
remain out of scope. The `main.ts`/HUD/renderer integration that will consume
`createEpisodeSession`/`restoreEpisodeSession` is separate follow-on work.

## Proposal trace

See [proposal 154](../proposals/154-episode-session.md).

## Verification

- Planned/executed: headless unit tests in `tests/unit/ford-episode.test.ts`
  covering gating (EPI-SCENE-ORDER-001, EPI-SCENE-LOCKED-001), correct
  completion (EPI-S02-GATE-001, EPI-S03-GATE-001), wrong answers
  (EPI-S02-RETRY-001, EPI-S03-RETRY-001), duplicates (EPI-DUPLICATE-001), exact
  replay state (EPI-REPLAY-001), malformed/tampered save rejection
  (EPI-SAVE-001), S01 save compatibility (EPI-S01-IMPORT-001) and reset
  boundaries (EPI-RESET-001).
- `npm run typecheck`, `node --test tests/unit/ford-episode.test.ts` and
  `npm run check:repository` are run at implementation time; browser/HUD
  evidence is explicitly out of scope for this headless foundation.
- Human review: storyboard alignment and editorial copy remain owner-facing; a
  green check does not prove historical accuracy, art readiness or shipping
  approval.
