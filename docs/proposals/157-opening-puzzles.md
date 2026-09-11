# Proposal 157: headless S02/S03 puzzle gates

Issue: [#157](https://github.com/jonesrussell/minoo-game-engine/issues/157)
Dependencies: [#154](https://github.com/jonesrussell/minoo-game-engine/issues/154)
episode session, [#153](https://github.com/jonesrussell/minoo-game-engine/issues/153)
MVP definition
Status: specification and headless implementation of the missing approved S02/S03
puzzle mechanics; browser integration, HUD, art and release approval remain
planned follow-on work
Owner: Ford Frenzy game maintainers

## Why

#154 shipped `EpisodeSession` sequencing S01→S02→S03 with S02's May 16/17
timeline order/interpretation and S03's emphasis/account gates. It did not
implement two storyboard-approved puzzle beats that [full-game.md](../storyboards/full-game.md)
and [opening-handoff.md](../storyboards/opening-handoff.md) require before their
scene's K award:

- S02.P3: "Clear jam: stack O1+O2 in order" — the press-kit pages must be
  stacked page-one-before-page-two before the May 16/17 timeline is filed.
- S03.P3: "Assemble layout: O3 magnets + O4 grid must pair O1 report line with
  O2 denial line; stamp O6 on uncertainty box; discard O5 pun" — three
  deterministic player choices (layout pairing, uncertainty stamp target, pun
  resolution) precede the emphasis choice and account submission.

The owner approved delivering the complete, polished opening MVP; a K02/K03
gate that skips owner-approved mechanics is not that MVP. This proposal adds
the missing action shapes as deterministic player actions (not UI-only flags
or caller-supplied completion booleans), keeps every existing S01/S02/S03
guarantee intact, and bumps the S02/S03 scene revisions so no
already-recorded development save silently replays under the new rules.

## Scope and exclusions

In scope:

- Extend [episode spec](../specs/episode.md) with `EPI-S02-KIT-001` (press-kit
  stacking), `EPI-S03-LAYOUT-001` (report/denial pairing), `EPI-S03-STAMP-001`
  (uncertainty stamp target) and `EPI-S03-PUN-001` (pun discard), and update
  `EPI-S02-GATE-001`/`EPI-S02-RETRY-001` and
  `EPI-S03-GATE-001`/`EPI-S03-RETRY-001` to require them
- `games/ford-frenzy/src/episode.ts`: new `stack-kit`, `assemble-layout`,
  `stamp-uncertainty` and `resolve-pun` action shapes with stable diagnostic
  IDs; found-object prerequisites for each (mirrors the existing
  `pair-recorder` prerequisite in `session.ts`); wrong choices are accepted
  (`ok: true`) with retry feedback and preserve finds; K02/K03 remain awarded
  exactly once and only when every required choice, including these new ones,
  is correct
- New `S02_SCENE_REVISION` / `S03_SCENE_REVISION` identifiers so a save
  recorded under the prior (kit-stacking-free, layout-free) development rules
  is rejected by `restoreEpisodeSession` with `EPISODE_UNSUPPORTED_SAVE`
  instead of silently replaying old rules as new
- Focused headless unit tests in `tests/unit/ford-episode.test.ts` for the new
  gates, retries and old-revision rejection; existing full-path fixtures
  updated to perform the new actions explicitly, without weakening any prior
  assertion

Excluded: `games/ford-frenzy/data/s02.json`/`s03.json` (object IDs and classes
already match the storyboard tables; no data change needed), renderer/HUD/main
wiring, S02/S03 art, GitHub issue/label/roadmap updates, and any claim that
this checkpoint is browser-, playtest- or release-approved. The public S01
save format (`session.ts`, `s01.json`) and its import path are unchanged.

## Requirements

See [docs/specs/episode.md](../specs/episode.md) for the full normative list.
Summary of what's new or changed here:

- `EPI-S02-KIT-001`: `stack-kit` requires `S02.O1` and `S02.O2` already found;
  `submit-timeline` MUST NOT award K02 unless the last `stack-kit` recorded
  `first: 'S02.O1', second: 'S02.O2'`, in addition to the existing May
  16-before-May-17 order and `order-of-reports` interpretation.
- `EPI-S03-LAYOUT-001`: `assemble-layout` requires `S03.O1`-`S03.O4` already
  found; `submit-account` MUST NOT award K03 unless the last `assemble-layout`
  recorded `pairing: 'report-and-denial'` (omitting the denial, `'report-only'`,
  fails the gate and MUST explicitly retry).
- `EPI-S03-STAMP-001`: `stamp-uncertainty` requires `S03.O6` already found;
  K03 requires the last recorded target to be `'video-claim'` (not
  `'sourced-report'`).
- `EPI-S03-PUN-001`: `resolve-pun` requires `S03.O5` already found; K03
  requires the last recorded decision to be `'discard'` (not `'keep'`).
- Updated `EPI-S02-GATE-001`/`RETRY-001` and `EPI-S03-GATE-001`/`RETRY-001`:
  K02/K03 gates fold in the above; any single wrong or missing sub-choice
  keeps the gate open with retry feedback and preserves finds, chosen
  emphasis and every other already-recorded sub-choice.
- Scene-revision bump: `S02_SCENE_REVISION`/`S03_SCENE_REVISION` change so
  `restoreEpisodeSession` rejects a save recorded under the prior rules with
  `EPISODE_UNSUPPORTED_SAVE`, per existing `EPI-SAVE-001` revision matching.
  No public S02 build exists yet, so this only affects development saves; the
  public S01 v1 import path (`EPI-S01-IMPORT-001`) is untouched.

All other requirements (`EPI-ACTION-001`, `EPI-SCENE-ORDER-001`,
`EPI-SCENE-LOCKED-001`, `EPI-S02-OBJECTS-001`/`EPI-S03-OBJECTS-001`,
`EPI-FIND-001`, `EPI-NOTEBOOK-001`, `EPI-DUPLICATE-001`, `EPI-REPLAY-001`,
`EPI-RESET-001`, `EPI-S01-IMPORT-001`, `EPI-IMMUTABLE-001`) are unchanged and
MUST continue to hold exactly as specified.

## Tasks

| Task | Requirement IDs | Planned check | Expected outcome |
| --- | --- | --- | --- |
| Extend durable episode spec | `EPI-S02-KIT-001`, `EPI-S03-LAYOUT-001`, `EPI-S03-STAMP-001`, `EPI-S03-PUN-001` | Spec review against full-game.md S02.P3/S03.P3 | Requirement and scenario IDs stable before source changes |
| Implement `stack-kit` and the S02 gate update | `EPI-S02-KIT-001`, `EPI-S02-GATE-001`, `EPI-S02-RETRY-001` | Correct/wrong stack-order fixtures | K02 requires correct stack order; wrong order preserves finds and retries |
| Implement `assemble-layout`, `stamp-uncertainty`, `resolve-pun` and the S03 gate update | `EPI-S03-LAYOUT-001`, `EPI-S03-STAMP-001`, `EPI-S03-PUN-001`, `EPI-S03-GATE-001`, `EPI-S03-RETRY-001` | Correct/wrong/omitted fixtures for each sub-choice | K03 requires all three correct; any wrong or omitted choice preserves finds and retries; denial-omission explicitly retries |
| Found-object prerequisites | `EPI-S02-KIT-001`, `EPI-S03-LAYOUT-001`, `EPI-S03-STAMP-001`, `EPI-S03-PUN-001` | Prerequisite-violation fixtures | `EPISODE_PREREQUISITE` before the relevant objects are found; no state mutation |
| Scene-revision bump and old-save rejection | `EPI-SAVE-001` | Fixture using the prior revision string | `EPISODE_UNSUPPORTED_SAVE`, no partial session |
| Regression pass on existing guarantees | all prior `EPI-*` | Full existing suite re-run with updated fixtures | Single award, scene/episode reset, immutable journal, exact replay, S01 v1 import all still hold |

## Verification

- Planned/executed: `npm run typecheck`, `node --test tests/unit/ford-episode.test.ts`,
  `npm run check:repository`, `git diff --check`
- Not executed by this proposal: `npm run test:e2e` / browser suite (a separate
  lane owns S02/S03 browser integration); this is a headless foundation only
- Storyboard traceability: S02.P3/S03.P3 in [full-game.md](../storyboards/full-game.md);
  FF-OPEN-003/FF-OPEN-004 in [opening-handoff.md](../storyboards/opening-handoff.md)
- Approvals reflected: revision 2 storyboards and the #153 opening-episode MVP
  authorization; not a claim of art, rights, browser integration or playtest
  sign-off

## Handoff for S02/S03 browser integration

The following action shapes and recommended control mapping are new since
#154 and need a UI:

| Action | Fields | Suggested control |
| --- | --- | --- |
| `stack-kit` | `first`/`second`: `'S02.O1' \| 'S02.O2'` | Drag-or-select-and-place page onto the tray in an order; accessible list equivalent per FF-OPEN-008 |
| `assemble-layout` | `pairing`: `'report-and-denial' \| 'report-only'` | Two labeled layout-grid slots (report line, denial line); an explicit "no denial" slot state maps to `'report-only'` |
| `stamp-uncertainty` | `target`: `'video-claim' \| 'sourced-report'` | Drag-or-select-and-place stamp onto one of two labeled boxes on the layout |
| `resolve-pun` | `decision`: `'discard' \| 'keep'` | Discard/keep control on the napkin prop; both remain reachable by keyboard |

All four require their listed objects already found (`EPISODE_PREREQUISITE`
otherwise) and accept unlimited retries with no hint penalty, matching the
existing `order-timeline`/`choose-emphasis` pattern.

## Proposal trace

Durable behavior: [docs/specs/episode.md](../specs/episode.md).

## Checkpoint evidence

Candidate c027611228d8988330e2ea7b4cd3aab72ba42511 received an independent
Sol review with no actionable findings. Root ran the full unit suite: 128/128
passed. Typecheck, 22 focused episode tests and repository checks passed.
Browser integration and owner acceptance remain open; no deployment is included.
The accompanying roadmap update records #158 and the paused City Hall draft.
