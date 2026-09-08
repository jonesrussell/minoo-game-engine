# Minoo framework and first-game roadmap

Updated September 7, 2026. The first game is **Ford Frenzy**, a Toronto investigative hidden-object adventure during the Ford era. Production presentation uses the **jr42 productions** brand. See [the product scope](product.md) and [game brief](first-game.md). There are 79 active delivery/decision records plus phase trackers, and 2 deferred Journey learning records.

See the [asset-to-playable SDD plan](ford-frenzy-delivery.md) and [experience scenarios](specs/ford-frenzy-experience.md). Asset library #103, generation workflow #104, title/menus #105, HUD #106 and sound/settings #107 complete the visible-game delivery scope.

## Current checkpoint

The headless runtime, versioned replay and generated invariant evidence (#7/#38/#39) are delivered. The new game's scene content, notebook and progression are not implemented. The current Journey preview is a legacy fixture. The renderer evaluation #40 now requires a proper rendering engine, frame loop, drawing/sprites, assets and an explicit future-3D boundary; HTML/SVG-only is not the product direction.

The revision 2 campaign, full-game and opening storyboards (#91, #92 and #93), including the Torrona Haps rewrite contract (#114), received owner storyboard approval on 2026-09-07. This approval covers storyboard structure and content only. Art direction #94 received separate owner approval on 2026-09-07; #104 has owner proof approval; runtime integration is next; rights, release copy, runtime implementation and playtest remain open. Parent status and issue readiness are reconciled in GitHub after merge. Reporting-loop spec #43 has its storyboard dependency satisfied and becomes ready when its other dependency checks are closed. The three scene implementation issues are #9, #98 and #99. Generalized content #95 and investigation progression #96 remain explicit prerequisites.

## Projects and boundaries

- [Framework roadmap](https://github.com/users/jonesrussell/projects/15)
- [Ford Frenzy - Delivery](https://github.com/users/jonesrussell/projects/16)
- [Milestones](https://github.com/jonesrussell/minoo-game-engine/milestones)
- [Machine-readable scope and dependencies](roadmap.json)
- [Project views](project-views.md)

Minoo owns game contracts/simulation/rendering/assets/replay/validation. Studio integration remains optional under [ADR 002](decisions/002-studio-game-capability.md) and [S0-S2](studio-integration.md). Its existing Journey tree-label example remains a compatibility fixture, not the new game's story. It never blocks core delivery or Studio's private MVP. Follow [package boundaries](package-boundaries.md) and [Markdown SDD](sdd-pilot.md). Historical facts, attributed allegations and fiction require separate records and review under [content policy](content-policy.md).

## N0 - Investigation storyboards

[Phase tracker #89](https://github.com/jonesrussell/minoo-game-engine/issues/89). Exit evidence: Research ledger and a reviewed complete campaign storyboard. The opening three-scene boards can be approved before later panels are finished.

| Issue | Priority | Workstream | Prerequisites |
|---|---|---|---|
| [#90 Build the Ford-era research and source ledger](https://github.com/jonesrussell/minoo-game-engine/issues/90) | P0 | content | None |
| [#91 Outline the complete investigation campaign and ending](https://github.com/jonesrussell/minoo-game-engine/issues/91) | P0 | content | #90 |
| [#92 Storyboard every scene in the full campaign](https://github.com/jonesrussell/minoo-game-engine/issues/92) | P0 | content | #91 |
| [#93 Storyboard the opening three investigative scenes](https://github.com/jonesrussell/minoo-game-engine/issues/93) | P0 | content | #91 |
| [#114 Rewrite Ford Frenzy around the Torrona Haps satire and route contract](https://github.com/jonesrussell/minoo-game-engine/issues/114) | P0 | content | #90 |
| [#94 Define Toronto scene art direction and asset briefs](https://github.com/jonesrussell/minoo-game-engine/issues/94) | P0 | content | #93, #103 |
| [#103 Inventory and import the legacy Ford Frenzy art library](https://github.com/jonesrussell/minoo-game-engine/issues/103) | P0 | content | None |
| [#104 Establish reference-based artwork generation and export workflow](https://github.com/jonesrussell/minoo-game-engine/issues/104) | P0 | content | #103, #94 |

## M0 - Local delivery and specifications

[Phase tracker #24](https://github.com/jonesrussell/minoo-game-engine/issues/24). Exit evidence: Reproducible local setup, specs, licensing and delivery guidance.

| Issue | Priority | Workstream | Prerequisites |
|---|---|---|---|
| [#5 Record code license and content provenance decisions](https://github.com/jonesrussell/minoo-game-engine/issues/5) | P0 | content | None |
| [#4 Provide local browser previews for chat-based playtesting](https://github.com/jonesrussell/minoo-game-engine/issues/4) | P1 | delivery | #2, #3 |
| [#3 Add executable CI and downloadable browser evidence](https://github.com/jonesrussell/minoo-game-engine/issues/3) | P0 | delivery | #2 |
| [#2 Scaffold TypeScript workspace and browser development commands](https://github.com/jonesrussell/minoo-game-engine/issues/2) | P0 | engine | None |
| [#1 Verify local development through chat](https://github.com/jonesrussell/minoo-game-engine/issues/1) | P0 | delivery | #2, #3 |
| [#32 Pilot spec-driven development on the scene contract](https://github.com/jonesrussell/minoo-game-engine/issues/32) | P0 | delivery | None |
| [#33 Define framework runtime and game ownership](https://github.com/jonesrussell/minoo-game-engine/issues/33) | P0 | framework | None |
| [#34 Document issue readiness review and release evidence rules](https://github.com/jonesrussell/minoo-game-engine/issues/34) | P1 | delivery | None |
| [#88 Codify the investigative first-game pivot](https://github.com/jonesrussell/minoo-game-engine/issues/88) | P0 | delivery | None |
| [#102 Codify the Ford Frenzy asset-to-playable SDD plan](https://github.com/jonesrussell/minoo-game-engine/issues/102) | P0 | delivery | None |

## M1 - Framework contracts and runtime

[Phase tracker #25](https://github.com/jonesrussell/minoo-game-engine/issues/25). Exit evidence: Independent schemas/runtime/replay, generalized content, proper renderer/frame loop, assets and storage.

| Issue | Priority | Workstream | Prerequisites |
|---|---|---|---|
| [#11 Persist and recover local game progress](https://github.com/jonesrussell/minoo-game-engine/issues/11) | P1 | engine | #7, #95, #96, #36 |
| [#8 Render responsive scenes with accessible object controls](https://github.com/jonesrussell/minoo-game-engine/issues/8) | P0 | engine | #6, #7, #40, #97 |
| [#7 Implement deterministic game state and replayable actions](https://github.com/jonesrussell/minoo-game-engine/issues/7) | P0 | engine | #6 |
| [#6 Define versioned scene and vocabulary contracts](https://github.com/jonesrussell/minoo-game-engine/issues/6) | P0 | engine | #2, #35 |
| [#35 Select the canonical schema format and validator](https://github.com/jonesrussell/minoo-game-engine/issues/35) | P0 | framework | #32, #33 |
| [#36 Define scene version compatibility and migrations](https://github.com/jonesrussell/minoo-game-engine/issues/36) | P1 | framework | #6 |
| [#37 Define asset manifests loading and failure behavior](https://github.com/jonesrussell/minoo-game-engine/issues/37) | P0 | engine | #6 |
| [#38 Version replay logs and verify deterministic results](https://github.com/jonesrussell/minoo-game-engine/issues/38) | P0 | engine | #7 |
| [#39 Add generated action-sequence tests for runtime invariants](https://github.com/jonesrussell/minoo-game-engine/issues/39) | P1 | quality | #7 |
| [#40 Evaluate a proper 2D rendering engine and future 3D boundary](https://github.com/jonesrussell/minoo-game-engine/issues/40) | P1 | engine | #33, #6 |
| [#41 Verify input coordinates and accessible target equivalents](https://github.com/jonesrussell/minoo-game-engine/issues/41) | P0 | engine | #8 |
| [#42 Test save corruption migration and unavailable storage](https://github.com/jonesrussell/minoo-game-engine/issues/42) | P1 | quality | #11, #36 |
| [#95 Generalize content references for investigative scenes](https://github.com/jonesrussell/minoo-game-engine/issues/95) | P0 | framework | #6, #35, #43 |
| [#97 Implement the rendering frame loop and simulation scheduling](https://github.com/jonesrussell/minoo-game-engine/issues/97) | P0 | engine | #7, #40 |

## M2 - Investigation vertical slice

[Phase tracker #26](https://github.com/jonesrussell/minoo-game-engine/issues/26). Exit evidence: Three linked scenes, notebook leads, editorial retry, hints, save/reset and accessible play with owner review.

| Issue | Priority | Workstream | Prerequisites |
|---|---|---|---|
| [#12 Qualify the three-scene investigation slice](https://github.com/jonesrussell/minoo-game-engine/issues/12) | P0 | quality | #10, #11, #3, #41, #98, #99, #106, #107, #42 |
| [#10 Add bounded hints and investigation progression feedback](https://github.com/jonesrussell/minoo-game-engine/issues/10) | P1 | game | #9, #96 |
| [#9 Build investigation scene S01: assignment desk](https://github.com/jonesrussell/minoo-game-engine/issues/9) | P0 | game | #8, #43, #93, #94, #95, #96, #105 |
| [#43 Specify the hidden-object reporting and evidence loop](https://github.com/jonesrussell/minoo-game-engine/issues/43) | P0 | game | #32, #91 |
| [#45 Run an owner playtest of investigative clarity and pacing](https://github.com/jonesrussell/minoo-game-engine/issues/45) | P0 | quality | #12 |
| [#96 Implement replayable investigation notebook and scene progression](https://github.com/jonesrussell/minoo-game-engine/issues/96) | P0 | engine | #7, #43, #95 |
| [#98 Build investigation scene S02: City Hall records](https://github.com/jonesrussell/minoo-game-engine/issues/98) | P0 | game | #8, #93, #94, #95, #96 |
| [#99 Build investigation scene S03: deadline review](https://github.com/jonesrussell/minoo-game-engine/issues/99) | P0 | game | #9, #98, #96, #10 |
| [#105 Build Ford Frenzy title screen menus and game navigation](https://github.com/jonesrussell/minoo-game-engine/issues/105) | P0 | game | #8, #11, #37 |
| [#106 Build investigation HUD notebook and scene transition UI](https://github.com/jonesrussell/minoo-game-engine/issues/106) | P0 | game | #105, #96, #10 |
| [#107 Implement sound settings and essential game feedback](https://github.com/jonesrussell/minoo-game-engine/issues/107) | P0 | game | #105, #37 |

## M3 - Agent authoring

[Phase tracker #27](https://github.com/jonesrussell/minoo-game-engine/issues/27). Exit evidence: Inspect and change investigative scenes through validated, reversible operations with replay evidence.

| Issue | Priority | Workstream | Prerequisites |
|---|---|---|---|
| [#15 Demonstrate a second scene authored entirely through chat](https://github.com/jonesrussell/minoo-game-engine/issues/15) | P0 | game | #14, #4, #12, #90 |
| [#14 Expose inspect validate edit and replay commands](https://github.com/jonesrussell/minoo-game-engine/issues/14) | P0 | authoring | #13, #7, #95 |
| [#13 Implement validated transactional scene editing operations](https://github.com/jonesrussell/minoo-game-engine/issues/13) | P0 | authoring | #6, #12, #46 |
| [#46 Specify authoring operations errors and transaction boundaries](https://github.com/jonesrussell/minoo-game-engine/issues/46) | P0 | authoring | #6, #32, #95 |
| [#47 Qualify authoring rollback and stale revision handling](https://github.com/jonesrussell/minoo-game-engine/issues/47) | P0 | quality | #13 |
| [#48 Build repeatable agent authoring acceptance tasks](https://github.com/jonesrussell/minoo-game-engine/issues/48) | P0 | quality | #14, #15 |
| [#49 Present human-readable scene diffs alongside structured output](https://github.com/jonesrussell/minoo-game-engine/issues/49) | P1 | authoring | #13 |

## M4 - Investigation browser alpha

[Phase tracker #28](https://github.com/jonesrussell/minoo-game-engine/issues/28). Exit evidence: Reviewed source/fiction classification and content rights, supported browsers, hosting and rollback.

| Issue | Priority | Workstream | Prerequisites |
|---|---|---|---|
| [#19 Publish first-game browser alpha with release evidence](https://github.com/jonesrussell/minoo-game-engine/issues/19) | P0 | delivery | #4, #15, #18, #52, #54, #53 |
| [#18 Qualify accessibility touch and supported browsers](https://github.com/jonesrussell/minoo-game-engine/issues/18) | P0 | quality | #90, #17, #12, #50, #51 |
| [#17 Produce approved original art for the investigative slice](https://github.com/jonesrussell/minoo-game-engine/issues/17) | P1 | content | #94, #37, #104, #105 |
| [#50 Add automated accessibility checks and manual coverage notes](https://github.com/jonesrussell/minoo-game-engine/issues/50) | P0 | quality | #12 |
| [#51 Set and verify browser alpha performance budgets](https://github.com/jonesrussell/minoo-game-engine/issues/51) | P1 | quality | #17, #12 |
| [#52 Review investigative content, sources and asset rights for release](https://github.com/jonesrussell/minoo-game-engine/issues/52) | P0 | content | #90, #93, #17, #12 |
| [#53 Provide alpha feedback intake and release support notes](https://github.com/jonesrussell/minoo-game-engine/issues/53) | P1 | delivery | #45 |
| [#54 Rehearse deployment rollback before alpha release](https://github.com/jonesrussell/minoo-game-engine/issues/54) | P0 | delivery | #52 |

## M5 - Framework reuse

[Phase tracker #29](https://github.com/jonesrussell/minoo-game-engine/issues/29). Exit evidence: Matcher and the investigative game run independently through shared public contracts.

| Issue | Priority | Workstream | Prerequisites |
|---|---|---|---|
| [#21 Refine engine APIs from first-game and Matcher evidence](https://github.com/jonesrussell/minoo-game-engine/issues/21) | P2 | engine | #20, #56 |
| [#20 Prototype Matcher against the shared engine contracts](https://github.com/jonesrussell/minoo-game-engine/issues/20) | P2 | engine | #19, #55 |
| [#55 Specify Matcher as a framework conformance game](https://github.com/jonesrussell/minoo-game-engine/issues/55) | P1 | framework | #19, #33 |
| [#56 Enforce package boundaries and test two-game compatibility](https://github.com/jonesrussell/minoo-game-engine/issues/56) | P1 | quality | #20 |
| [#57 Define the smallest supported game extension interface](https://github.com/jonesrussell/minoo-game-engine/issues/57) | P1 | framework | #21 |

## M6 - Local MCP authoring

[Phase tracker #30](https://github.com/jonesrussell/minoo-game-engine/issues/30). Exit evidence: Local MCP consumes the same tested authoring operations without becoming a gameplay requirement.

| Issue | Priority | Workstream | Prerequisites |
|---|---|---|---|
| [#58 Specify the local MCP adapter and capability boundaries](https://github.com/jonesrussell/minoo-game-engine/issues/58) | P1 | authoring | #14, #48 |
| [#59 Implement local MCP inspection and validation tools](https://github.com/jonesrussell/minoo-game-engine/issues/59) | P1 | authoring | #58 |
| [#60 Implement scoped MCP edit and undo operations](https://github.com/jonesrussell/minoo-game-engine/issues/60) | P1 | authoring | #59, #47 |
| [#61 Qualify CLI and MCP parity with recorded authoring tasks](https://github.com/jonesrussell/minoo-game-engine/issues/61) | P1 | quality | #60 |

## M7 - Framework beta and maintenance

[Phase tracker #31](https://github.com/jonesrussell/minoo-game-engine/issues/31). Exit evidence: Published compatible contracts, migration guidance and repeatable acceptance.

| Issue | Priority | Workstream | Prerequisites |
|---|---|---|---|
| [#62 Publish framework API guide and extension examples](https://github.com/jonesrussell/minoo-game-engine/issues/62) | P1 | framework | #57, #61 |
| [#63 Qualify and tag the first framework beta](https://github.com/jonesrussell/minoo-game-engine/issues/63) | P1 | delivery | #62, #56 |
| [#64 Define dependency maintenance and next-release intake](https://github.com/jonesrussell/minoo-game-engine/issues/64) | P2 | delivery | #63 |

## S0 - Optional Studio review adapter

[Phase tracker #66](https://github.com/jonesrussell/minoo-game-engine/issues/66). Exit evidence: Existing Journey compatibility example over a standalone candidate-review contract.

| Issue | Priority | Workstream | Prerequisites |
|---|---|---|---|
| [#69 Specify the versioned Minoo candidate review boundary](https://github.com/jonesrussell/minoo-game-engine/issues/69) | P2 | authoring | #33, #35 |
| [#70 Prove the standalone Journey tree-label authoring example](https://github.com/jonesrussell/minoo-game-engine/issues/70) | P2 | game | #14, #37, #38, #43 |
| [#71 Build an optional read-only Studio adapter for Minoo review](https://github.com/jonesrussell/minoo-game-engine/issues/71) | P2 | authoring | #69, #70 |
| [#72 Qualify the Journey candidate review boundary end to end](https://github.com/jonesrussell/minoo-game-engine/issues/72) | P2 | quality | #71 |

## S1 - Shared Studio authoring workflow

[Phase tracker #67](https://github.com/jonesrussell/minoo-game-engine/issues/67). Exit evidence: Reuse verified Studio workflow contracts after its private MVP gate.

| Issue | Priority | Workstream | Prerequisites |
|---|---|---|---|
| [#73 Verify Studio readiness before shared game authoring](https://github.com/jonesrussell/minoo-game-engine/issues/73) | P2 | delivery | #72 plus qualified external dependencies in roadmap.json |
| [#74 Connect Minoo candidates to shared Studio revisions jobs and decisions](https://github.com/jonesrussell/minoo-game-engine/issues/74) | P2 | authoring | #73, #47 |
| [#75 Qualify durable Journey authoring and account isolation in Studio](https://github.com/jonesrussell/minoo-game-engine/issues/75) | P2 | quality | #74 |

## S2 - Optional Studio preview and publishing

[Phase tracker #68](https://github.com/jonesrussell/minoo-game-engine/issues/68). Exit evidence: Separately decide isolated embedding and publishing authorization.

| Issue | Priority | Workstream | Prerequisites |
|---|---|---|---|
| [#76 Decide whether Journey needs embedded Studio previews](https://github.com/jonesrussell/minoo-game-engine/issues/76) | P2 | delivery | #75 |
| [#77 Qualify isolated Journey preview presentation if adopted](https://github.com/jonesrussell/minoo-game-engine/issues/77) | P2 | quality | #76 |
| [#78 Specify separate authorization for Studio-assisted game publishing](https://github.com/jonesrussell/minoo-game-engine/issues/78) | P2 | delivery | #75 |

## Deferred Journey learning

#16 vocabulary approval and #44 pronunciation playback remain open in a separate deferred milestone. They are not investigative release prerequisites and are not claimed delivered. Existing source/schema fixtures and historical ADRs remain valid engineering evidence.

## Delivery rules

Visual checkpoint #94: [art direction](art-direction.md) and a
[newsroom/title/HUD concept](art/visual-direction-02/index.html) have owner style approval. These are flat concept pixels and editable presentation, not runtime
gameplay or the separated asset pipeline proof in #104. Storyboard approval is complete.

Full campaign design checkpoint: [historical ledger](research/ford-frenzy-history.md)
delivered under #90; [six-chapter campaign](storyboards/campaign.md),
[eighteen shared scene boards plus four route boards](storyboards/full-game.md) and
[opening handoff](storyboards/opening-handoff.md) have owner storyboard approval under
#91/#92/#93/#114. Art direction approval is recorded separately under #94. S01-S03 remain the production
slice; S04-S18 and R1A/R1B/R2A/R2B have no added implementation or release
commitment. Art direction #94 follows approval of the opening boards, then #104
proves reference-based art.

Native dependencies identify prerequisites; sub-issues identify phase ownership. Do not infer readiness from phase order. P0 blocks its gate, P1 is planned required work and P2 is deferred improvement. No dates or full-campaign production commitments have been invented.

Keep scopes, evidence and project readiness current. A completed issue needs acceptance evidence at the reviewed commit and a merged PR. Planning tasks require the named owner review before their own completion. Phase trackers close only when their required children and exit gate are satisfied. Tests cannot establish historical accuracy, content rights or enjoyable play.

Asset workflow #104: [generation workflow](art-generation-workflow.md) and
[layered S01 proof](art/pipeline-proof-01/index.html) have owner proof approval. One background and six independent PNG targets;
production integration and release remain open. The diagnostic viewer does not select #40.

## S01 playable checkpoint

The first local Ford Frenzy assignment is playable through New Game, six sprite finds, recorder pairing, embedded clipping checks and K01 submission. Use npm run dev:ford. The independent runtime and Journey fixture remain usable. This is the bounded #9 checkpoint, with S01 session work from #96 and browser foundation slices from #8/#37/#97/#105. S02/S03, campaign saves, final art and owner playtest remain open. See [checkpoint contract](proposals/9-first-playable.md).

Source checking (#128) is a self-contained game mechanic using fictional press names and original local clippings. Research links stay in development records. This supersedes the temporary removal in #126.
