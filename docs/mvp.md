# Ford Frenzy MVP

Status: owner-approved scope, 2026-09-11. The owner explicitly asked for help
codifying and delivering the MVP: a complete, polished three-scene opening
episode, S01 Welcome to the Haps, S02 Meanwhile at City Hall, S03 We're
Going With WHAT?, as a distinct, smaller deliverable than the approved full
campaign. This document defines what "MVP" observably means, separates it
from full-campaign and framework-reuse work, and gives an ordered delivery
checklist against existing GitHub issues. It does not change source code,
implementation status or GitHub issue state. [Product scope](product.md) and
[the game brief](first-game.md) remain the narrative/product authority;
[the experience contract](specs/ford-frenzy-experience.md) and the
[presentation contract](specs/game-presentation.md) remain the detailed
behavior contracts this MVP draws its acceptance scenarios from.

## What the MVP is

The MVP is the smallest release that lets a player complete the entire
approved opening episode, three linked scenes, one continuous notebook,
character-led opening/closing conversations, save/reset and an episode
ending, with the owner's explicit acceptance that it is complete and
polished enough to stand on its own. It is scoped to the storyboard-approved
opening only ([approval.md](storyboards/approval.md), revision 2,
2026-09-07); it is not the six-chapter campaign, and it is not a claim that
framework reuse, agent authoring or Studio integration are finished.

## MVP requirements

### MVP-001: the opening episode is playable start to finish

The player MUST be able to start a new game, complete S01, S02 and S03 in
order, and reach a defined episode-ending state in one browser session,
without any later campaign scene (S04+) required.

Scenario: GIVEN a fresh save, WHEN the player completes S01's recorder/source
checks, S02's City Hall timeline search and S03's deadline submission, THEN
the game presents an episode-ending state (see FF-SCN-001 in the
[experience contract](specs/ford-frenzy-experience.md)) and no control
requires content beyond S03.

Failure example: GIVEN S02 or S03 has no shipped scene definition, THEN
MVP-001 is not met regardless of how complete S01 is.

Current status: not met. S01 is implemented and playable, including a
[public WIP](public-wip.md) (#9, #96, #136, #138, #143). `games/ford-frenzy/data`
contains only `s01.json`; S02 and S03 (#98, #99) have no scene data or
implementation yet.

### MVP-002: continuous notebook and source status across scenes

Notebook leads and source-verification status from FF-SCN-001 and FF-SAVE-001
MUST carry from scene to scene without upgrading an unsupported claim.

Scenario: GIVEN S01 completion, WHEN the player enters S02, THEN S01's
notebook entries and source status are present exactly once, and no entry
changes from "unverified" to "verified" without an in-game corroborating
action.

Current status: not met beyond S01. #96 (notebook/progression engine) is
closed, but nothing exercises continuity into S02/S03 until those scenes
exist.

### MVP-003: character-led conversations with owner-accepted expressions and pacing

Opening and closing conversations for each scene MUST use the stable
expression IDs and replayable dialogue history described in the
[presentation contract's](specs/game-presentation.md) expression (#139) and
closing dialogue/history (#140) sections, and the owner MUST explicitly
accept the resulting character consistency and discovery pacing.

Scenario: GIVEN S01's opening and closing conversations, WHEN played, THEN
Elliot and Alex render through `neutral`/`annoyed`/`amused`/`surprised` art
with a documented neutral fallback, dialogue history replays without
mutating saves, and the owner records acceptance of character consistency
and pacing separately from merged code.

Current status: code implemented and merged; owner acceptance open. #139 and
#140 both carry the `in-review` label but are not owner-accepted; #140
depends on #139. Extending this pattern into S02/S03 is explicit follow-on
work and has not started.

### MVP-004: baseline navigation, HUD and sound work across the episode

Title, menus, HUD, notebook access, pause, settings, credits and sound
controls (FF-UI-001, FF-UI-002, FF-AUD-001) MUST function for all three
scenes, not only S01.

Scenario: GIVEN any of the three scenes, WHEN the player pauses, opens the
notebook, mutes sound or returns to title, THEN the same components respond
consistently and no scene-specific screen implementation is required.

Current status: implemented for S01 only (`games/ford-frenzy/src/main.ts`,
`hud.ts`, `audio.ts`). #105, #106 and #107 stay open because they are scoped
to all three scenes, not S01 alone, a playable S01 does not close them.

### MVP-005: local save/reset and deterministic replay hold across the episode

FF-SAVE-001 MUST hold for partial progress in any of the three scenes,
including corrupted/incompatible-save recovery and a confirmed reset that
preserves preferences.

Scenario: GIVEN partial S02 progress, WHEN the player reloads, THEN Continue
restores finds, hints, notebook and scene without replaying rewards; GIVEN a
confirmed reset, THEN campaign progress clears while sound/accessibility
preferences remain.

Current status: implemented for S01 saves only. #11 (persistence) and #42
(corruption/recovery testing) stay open pending S02/S03.

### MVP-006: the owner accepts pacing, content and rights before calling it done

Owner acceptance of production art (#17), playtest (#45), content/source/rights (#52), and the qualified release (#19) MUST all be recorded before MVP delivery. Placeholders may support development but do not satisfy the polished MVP. A green `npm run check:repository`
or `npm test` run is evidence of code correctness, not of enjoyable pacing,
historical accuracy or clearable rights.

Scenario: GIVEN MVP-001 through MVP-005 are met, WHEN all acceptance and publication gates close with
recorded owner sign-off, THEN the MVP may be declared delivered. WHEN any
required gate is still open, THEN the MVP remains undelivered regardless of passing
automated checks.

Current status: not met. #45 and #52 are both open.

### MVP-007: the MVP is reachable without framework-reuse or Studio scope

Reaching MVP-001 through MVP-006 MUST NOT require agent-authoring
demonstrations, Matcher reuse, local MCP tooling or optional Studio
integration.

Scenario: GIVEN the delivery checklist below, WHEN it is walked in order,
THEN no step references M3 authoring (#13, #14, #15, #46-#49), M5 reuse (#20, #21, #55-#57),
M6 MCP (#58-#61), M7 beta (#62-#64) or S0-S2 Studio tracks (#69-#78).

Current status: met by this document's checklist design. See
[M4 alpha and authoring](#m4-alpha-19-and-authoring-15) below for the release dependency reconciliation tracked in #153.

## Full campaign is a separate, larger deliverable

The MVP is not the campaign. The owner-approved (2026-09-07, revision 2,
[approval.md](storyboards/approval.md)) full campaign is six chapters with 18
shared scene boards plus four route boards, 22 authored scenes total
([roadmap.json](roadmap.json) `decisions.campaign_storyboards`). A single
playthrough visits 20 of those scenes, 80 gameplay panels and 120 unique
finds, spanning 17 May 2013 to 30 October 2014, with two fictional newsroom
endings. This is storyboard approval only: production art, full-campaign
scene implementation (S04-S18, R1A/R1B/R2A/R2B) and final release review are
explicitly uncommitted by that approval (see [roadmap.md](roadmap.md)
"Delivery rules" and [first-game.md](first-game.md) "Entire-game storyboard
work"). The MVP consumes only the S01-S03 subset of this approved storyboard.

## Exclusions

Not required for MVP delivery, and not implied by any MVP requirement above:

- Full-campaign scene implementation or production art beyond S01-S03
  (S04-S18, R1A/R1B/R2A/R2B; #92 storyboards remain design-only).
- Multiplayer, payments, backend accounts, native app-store exports, a
  runtime LLM/model service or 3D implementation ([product.md](product.md)
  "Release evidence and exclusions").
- Production minoo.live deployment or copying its data.
- Agent authoring (M3, #13, #14, #15, #46-#49), framework reuse via Matcher (M5, #20, #21,
  #55-#57), local MCP authoring (M6, #58-#61), framework beta/maintenance
  (M7, #62-#64) and optional Studio integration (S0-S2, #69-#78). These are
  framework/product goals tracked in [roadmap.md](roadmap.md); none gate the
  game MVP ([AGENTS.md](../AGENTS.md) "Optional Studio integration").

## Delivery checklist

Ordered by dependency, not by issue number. Each step names its GitHub state
as observed during this review; recheck before starting work, since state
changes independently of this document.

0. **#154** Implement the episode session, scene gates and compatible saves, the explicit cross-scene residual of #96.
1. **#98** Build investigation scene S02: City Hall records, OPEN, blocked.
   Its listed dependencies (#8, #93, #94, #95, #96) are closed or already
   proven by the S01 implementation; #8 itself stays open for broader engine
   acceptance beyond S01. This is the next concrete source issue.
2. **#99** Build investigation scene S03: deadline review, OPEN, blocked on
   #98 and #10.
3. **#10** Add bounded hints and investigation progression feedback, OPEN,
   needed by #99, #106 and #12.
4. **#139** Add consistent character expressions, code merged, `in-review`;
   needs recorded owner acceptance (MVP-003).
5. **#140** Stage closing conversations and tune discovery pacing, code
   merged, `in-review`, depends on #139; needs recorded owner acceptance
   (MVP-003).
6. **#105 / #106 / #107** Close residual title/menu, HUD/notebook and sound
   scope across all three scenes (MVP-004), all OPEN, blocked.
7. **#11 / #42** Extend persistence and recovery testing to S02/S03
   (MVP-005), both OPEN, blocked.
8. **#41** Verify input coordinates and accessible equivalents across all
   three scenes, OPEN, blocked.
9. **#12** Qualify the three-scene investigation slice, OPEN, blocked;
   aggregates steps 1-8 through its native dependencies.
10. **#45** Run an owner playtest of investigative clarity and pacing, OPEN,
    blocked on #12 (MVP-006).
11. **#52** Review investigative content, sources and asset rights for
    release, OPEN, blocked on #12 (MVP-006).
12. **#50 / #18** Accessibility checks and cross-browser qualification —
    both OPEN, blocked on #12.
13. **#54** Rehearse deployment rollback, OPEN, blocked on #52.
14. **#53** Provide alpha feedback intake and release support notes, OPEN,
    blocked on #45.

15. **#17 / #51** Approve the opening art and verify performance budgets.
16. **#19** Publish the qualified, owner-accepted episode on Waaseyaa Labs.

All applicable gates above are required. The public S01 WIP does not satisfy them.

## M4 alpha (#19) and authoring (#15)

The owner-approved MVP boundary separates game release from M3 authoring.
Under #153, #19 replaces its #15 prerequisite with explicit game qualification
#12, owner playtest #45, art #17 and performance #51, retaining #4, #18,
#52, #53 and #54. Its acceptance no longer requires all M3 blockers to close.
#15 remains valuable M3 framework work but cannot block the game MVP.

## Next concrete source issue

#154 implements ordered episode state and S01-save compatibility before
#98 and #99 integrate City Hall and the deadline scene through shared
components. #96 delivered the S01 checkpoint only. #9, #139 and #140
retain their outstanding scope and owner acceptance.
