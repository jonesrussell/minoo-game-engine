# Proposal 92: full-game scene storyboards

Issue: [#92](https://github.com/jonesrussell/minoo-game-engine/issues/92)
Status: **DRAFT** pending owner review
Owner: jr42 productions / Minoo storyboard track
Depends on: campaign draft (#91, owner approval pending), historical source ledger at [docs/research/ford-frenzy-history.md](../research/ford-frenzy-history.md)
Opening handoff #93 reuses S01-S03 here. Later boards are not an opening prerequisite.

## Why

Ford Frenzy now has a draft text storyboard for all eighteen planned hidden-object
scenes so individual approved scenes can proceed with stable IDs,
find targets, notebook outputs and editorial questions. The [first-game brief](../first-game.md)
defines the opening three scenes at campaign level; this proposal supplies panel-level
composition, object placement, clue dependencies and playable variation across the
full six-chapter arc.

## Scope and exclusions

In scope:

- Text storyboards for S01 through S18 with four panels each (Sxx.P1 through Sxx.P4)
- Six finds per scene (Sxx.O1 through Sxx.O6) with evidence/context/tool classification
- Notebook outputs K01 through K18 with retained dependencies
- Historical reference pointers H00 through H14 (no new historical claims)
- Title sequence, chapter cards, two ending boards and credits treatment
- Common hint, resume, reset and entry/exit contract inherited across scenes
- Requirement IDs with Given/When/Then scenarios

Excluded:

- New runtime code, scene JSON, artwork import or generation
- Historical source verification, rights clearance and final editorial approval
- Illustrated final art (text boards only)

## Deliverables

| Artifact | Path | Status |
| --- | --- | --- |
| Full-game storyboards | [docs/storyboards/full-game.md](../storyboards/full-game.md) | DRAFT |
| This proposal | docs/proposals/92-full-game-storyboards.md | DRAFT |

## Draft coverage (content inventory, not gameplay evidence)

| Metric | Count |
| --- | --- |
| Chapters | 6 |
| Playable scenes | 18 (S01-S18) |
| Panels | 72 (4 per scene) |
| Find objects | 108 (6 per scene) |
| Notebook outputs | 18 (K01-K18) |
| Historical pointers | 15 (H00-H14) |
| Chapter-ending branch IDs | 6 (BR-CH1-A/B through BR-CH6-A/B pairs) |
| Ending boards | 2 (END-A / END-B, each two panels) |
| Requirement IDs | 12 (SB-STRUCT through SB-CRED) |

## Requirements

### SB-STRUCT-001: stable scene and panel identity

Every playable scene MUST declare a stable scene ID (S01-S18), four panel IDs
(Sxx.P1-P4), six object IDs (Sxx.O1-O6) and one notebook output ID (Kxx).

- Scenario: GIVEN the full-game storyboard document, WHEN an implementer maps
  scene JSON, THEN each scene ID appears exactly once with no gaps from S01 to S18.
- Failure example: GIVEN a duplicate object ID across scenes, WHEN validation runs,
  THEN the duplicate path is reported before art binding.

### SB-PANEL-001: four-panel beat structure

Each scene MUST include four numbered panels covering establish/arrival, interactive
search, inspect/compare closeup and editorial outcome/exit.

- Scenario: GIVEN scene S07, WHEN a reviewer reads S07.P1 through S07.P4, THEN
  the four-panel sequence supplies composition, camera, light, emotional beat and
  draft status.
- Failure example: GIVEN a scene with only three panels, WHEN storyboard review runs,
  THEN the scene is rejected as incomplete.

### SB-FIND-001: six varied finds with classification

Each scene MUST list exactly six concrete finds with stable IDs, plausible visual
positions and classification as evidence, context or tool. Historical evidence
MUST link to the ledger; fictional concerns remain fictional. No quota turns a
checklist, assignment or draft into independent corroboration.

- Scenario: GIVEN S05, WHEN the find list is counted, THEN six distinct object types
  appear (not six identical paper cards) and fictional civic notes are not historical corroboration.
- Failure example: GIVEN six clipboard props with identical art, WHEN art review runs,
  THEN the scene fails the variation rule even if IDs differ.

### SB-NOTE-001: notebook outputs and dependencies

Each scene MUST produce one notebook output Kxx listing retained dependencies on
prior K outputs and historical pointers used as reference only.

- Scenario: GIVEN completion of S03 with K01 and K02 retained, WHEN S03 awards K03,
  THEN K03 lists K01 and K02 as dependencies and does not mark unverified leads verified.
- Failure example: GIVEN a notebook entry that upgrades a lead without corroboration,
  WHEN editorial review runs, THEN the entry is rejected.

### SB-QUEST-001: editorial question with retry

Each scene MUST declare one player-facing editorial question, one correct answer,
at least one retry answer and no permanent failure path.

- Scenario: GIVEN an incorrect editorial answer in S12, WHEN the player confirms retry,
  THEN the scene returns to S12.P3 with hints preserved and no save corruption.
- Failure example: GIVEN a wrong answer that locks the campaign, WHEN save reload runs,
  THEN the player cannot continue (disallowed).

### SB-HIST-001: historical pointers without new claims

Historical beats MUST reference H00-H14 as parent-verified pointers only. The game
MUST NOT introduce new historical claims, original 2013 video discovery or forged
public-record facsimiles.

- Scenario: GIVEN S03 set on May 17 2013, WHEN the player completes the scene,
  THEN no find implies access to the original video and H01/H02 are cited as summaries only.
- Failure example: GIVEN a prop labeled as the Gawker video file, WHEN content review runs,
  THEN the prop is rejected.

### SB-PLAY-001: varied scene mechanics

Across the campaign, scene play MUST vary using shape search, date ordering, source
comparison, spatial map, caption pairing, authority comparison and preliminary versus
certified results. Opening slice scenes S01-S03 MUST remain detailed enough for
implementation handoff.

- Scenario: GIVEN scenes S01, S08 and S17, WHEN mechanics are compared, THEN at least
  three distinct interaction patterns appear across the set.
- Failure example: GIVEN eighteen scenes that differ only by background swap, WHEN
  design review runs, THEN SB-PLAY-001 fails.

### SB-ART-001: asset brief with reuse candidates

Each scene MUST name its new BG base, new layers and any reused candidate IDs.
The recovered ff011/073/075 references are title-palette authoring references;
ff044 is a City Hall hallway reconstruction reference for S02 only; ff079/080 are
candidate-background references only. Reuse MUST NOT imply combat or unapproved
historical staging.

- Scenario: GIVEN S01 asset brief, WHEN art import runs, THEN new BG01 newsroom,
  new desk clutter layers are listed with no combat verbs.
- Failure example: GIVEN agentsff079 used as a villain sprite, WHEN art review runs,
  THEN the usage is rejected.

### SB-CHAP-001: chapter cards and convergence

Six chapter cards MUST precede S01, S04, S07, S10, S13 and S16. Branch IDs
(BR-CH1-A/B through BR-CH6-A/B) resolve at S03, S06, S09, S12, S15 and S18 and
change fictional byline or editorial reflection only.

- Scenario: GIVEN BR-CH2-B selected after S06, WHEN S07 loads, THEN notebook state
  includes K06 plus branch metadata and historical outcomes remain fixed.
- Failure example: GIVEN a branch that changes the October 31 police announcement outcome,
  WHEN historical review runs, THEN the branch is rejected.

### SB-END-001: ending boards without altering history

Two ending boards (END-A and END-B), each two panels, MUST change fictional cast
role resolution after S18 only. Certified election results (H12/H13) remain fixed.
END-A is selected when at least three choices are in [BR-CH1-B, BR-CH2-B,
BR-CH3-A, BR-CH4-B, BR-CH5-B, BR-CH6-B]; otherwise END-B. Six independent bits
allow all 64 combinations; there is no trust score or punished retry.

- Scenario: GIVEN END-A after S18, WHEN credits roll, THEN its two-panel cast
  resolution differs from END-B while John Tory and Rob Ford Ward 2 outcomes match H13.
- Failure example: GIVEN an ending where Doug Ford wins the 2014 mayoral race, WHEN
  historical review runs, THEN the ending is rejected.

### SB-UI-001: inherited common contract

All scenes MUST inherit three manual hint rings independent from free editorial
feedback, atomic save/resume per FF-SAVE-001, reset of only the uncompleted scene,
and deterministic chapter replay in a separate fork. Keyboard Tab/Enter and an
accessible list must mirror pointer interactions; no forced drag. Proposed hit areas
are at least 44 CSS pixels after viewport scaling, subject to #41. Reduced-motion mode removes movement only; no mode uses a hard
timer. Save includes K award and branch choice atomically with the next-scene state.

- Scenario: GIVEN partial progress in S11 with two finds and one hint used, WHEN the
  player reloads, THEN finds and hint count restore exactly once.
- Failure example: GIVEN duplicate find input, WHEN replay is recorded, THEN a second
  K11 award does not occur.

### SB-CRED-001: credits and branding

Credits MUST list Ford Frenzy, jr42 productions, content/source acknowledgements per
[content policy](../content-policy.md) and separate fictional cast from historical figures.

- Scenario: GIVEN campaign completion, WHEN credits display, THEN jr42 productions
  appears as production credit and `../research/ford-frenzy-history.md` is listed.
- Failure example: GIVEN credits that attribute invented dialogue to a real mayor, WHEN
  content review runs, THEN credits fail SB-CRED-001.

## Tasks (planned)

| Task | Requirement IDs | Owner | Planned check |
| --- | --- | --- | --- |
| Owner review of all eighteen scene boards | SB-STRUCT, SB-PANEL | Story owner | Manual storyboard review |
| Historical ledger crosswalk H00-H14 | SB-HIST | Parent verification | Ledger file match |
| Opening slice handoff S01-S03 | SB-PLAY, SB-ART | #93 implementer | Panel/object ID checklist |
| Art candidate mapping | SB-ART | #103/#104 | Inventory cross-reference |
| Notebook dependency graph audit | SB-NOTE | #43 reporting loop | K01-K18 DAG review |
| Ending board copy review | SB-END | Editorial owner | END-A/B two-panel tone check |

## Verification

- Planned: owner reads [full-game.md](../storyboards/full-game.md); confirms DRAFT
  panels; checks no new historical claims; validates S01-S03 implementation readiness.
- Planned: reconcile object IDs with future scene JSON validation (SCN-IDENTITY-001).
- Executed: none at proposal submission time.

## Unresolved decisions (owner / parent)

1. Final historical paraphrases; unverified exact times remain omitted.
2. Final wording of public-record summaries on props (owner editorial review).
3. Final visual treatment of the two ending boards.

## Related documents

- [first-game.md](../first-game.md)
- [content-policy.md](../content-policy.md)
- [ford-frenzy-experience.md](../specs/ford-frenzy-experience.md)
- [proposal 102](102-ford-frenzy-experience.md)
- [Campaign draft](../storyboards/campaign.md), owner review pending
