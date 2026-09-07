# Minoo framework, runtime and Journey roadmap

Updated September 7, 2026. This roadmap has eight phases, 54 delivery/decision issues and eight phase trackers. It expands the original backlog without closing or replacing existing work. PR #23 remains open for review; its implementation is not yet merged into main.

## Product direction

Build a game framework designed for agents to inspect and operate reliably, with a small runtime engine and Journey as the first game. The framework defines scenes, objects, content references, operations and compatibility rules. The runtime loads those definitions, processes input and actions, manages state and renders results. Game packages own vocabulary, artwork and game-specific rules.

Development stays local through chat. GitHub provides code review, issue tracking and CI. Hosting a finished browser game is a release concern, not a cloud-development requirement. The first release is one small Journey experience; the framework becomes reusable only after Matcher demonstrates it.

## Project entry points

- [Framework and Runtime Roadmap](https://github.com/users/jonesrussell/projects/15): complete cross-project backlog, phase trackers and decisions.
- [Journey Delivery](https://github.com/users/jonesrussell/projects/16): scene work, content, playtesting and browser release.
- [Milestones](https://github.com/jonesrussell/minoo-game-engine/milestones): phase acceptance gates.
- [Machine-readable dependencies](roadmap.json): issue references for agents and graph checks.
- [Research and tooling assessment](research/sdd-and-engine-research.md): rationale and candidate libraries, not a commitment to install all of them.

## Scope and ownership

| Layer | Owns | Must not own |
|---|---|---|
| Framework | Versioned contracts, content references, validation, operations, extension interfaces | Journey-specific assets or invented language content |
| Runtime | State transitions, input adapters, assets, rendering, saves and replay | Model calls required for ordinary gameplay |
| Authoring | Inspect, validate, edit, undo, diffs, CLI and later MCP | Independent rules that disagree with runtime validation |
| Journey | First scene, vocabulary, prompts, hints, restoration and learning review | Generic infrastructure added only for speculative future games |
| Delivery | Local setup, CI, evidence, release and feedback | Unqualified claims of browser, language or device support |

## Sequencing and commitments

Phases are acceptance gates, not calendar promises. Independent documentation, content decisions and CI work can proceed when their direct dependencies allow it. Do not serialize every task merely because a previous phase tracker is still open. Native GitHub dependency links identify prerequisites; child relationships identify ownership, not scheduling constraints.

P0 blocks its milestone. P1 is required planned work in that phase but may be sequenced after the critical P0 path. P2 is deferred improvement. S/M/L are initial relative scope estimates, not days or token budgets. Split an issue if it no longer fits a focused, reviewable PR. No due dates have been invented.

The next useful work is review of [PR #23](https://github.com/jonesrussell/minoo-game-engine/pull/23), then #3 once #2 merges. The SDD pilot #32, package-boundary decision #33 and licensing decision #5 can be prepared independently. Schema implementation #6 waits on the spec/schema decisions.

## Phase overview

| Phase | Purpose | Tracker |
|---|---|---|
| M0 - Local delivery and specifications | Prove a reproducible development loop before adding game complexity. | [#24](https://github.com/jonesrussell/minoo-game-engine/issues/24) |
| M1 - Framework contracts and runtime | Define the framework contracts separately from rendering and Journey content. | [#25](https://github.com/jonesrussell/minoo-game-engine/issues/25) |
| M2 - Journey vertical slice | Prove one coherent learning experience and gather owner playtest feedback. | [#26](https://github.com/jonesrussell/minoo-game-engine/issues/26) |
| M3 - Agent authoring | Make structured authoring measurable before adding an MCP transport. | [#27](https://github.com/jonesrussell/minoo-game-engine/issues/27) |
| M4 - Journey browser alpha | Ship a small browser alpha with known support limits and a feedback loop. | [#28](https://github.com/jonesrussell/minoo-game-engine/issues/28) |
| M5 - Framework reuse | Use a second game to decide what is reusable rather than designing speculative abstractions. | [#29](https://github.com/jonesrussell/minoo-game-engine/issues/29) |
| M6 - Local MCP authoring | Expose the framework to agents without requiring model calls in gameplay. | [#30](https://github.com/jonesrussell/minoo-game-engine/issues/30) |
| M7 - Framework beta and maintenance | Stabilize the demonstrated framework and small runtime; set future scope from evidence. | [#31](https://github.com/jonesrussell/minoo-game-engine/issues/31) |

## M0 - Local delivery and specifications

Prove a reproducible development loop before adding game complexity.

**Exit evidence:** A local task can install, build, test and open a PR; CI retains evidence; a small SDD workflow and license decision are recorded.

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

## M1 - Framework contracts and runtime

Define the framework contracts separately from rendering and Journey content.

**Exit evidence:** Versioned scenes validate; actions replay deterministically; input, storage and asset failures have explicit behavior.

| Issue | Priority | Workstream | Prerequisites |
|---|---|---|---|
| [#11 Persist and recover local game progress](https://github.com/jonesrussell/minoo-game-engine/issues/11) | P1 | engine | #7 |
| [#8 Render responsive scenes with accessible object controls](https://github.com/jonesrussell/minoo-game-engine/issues/8) | P0 | engine | #6, #7, #40 |
| [#7 Implement deterministic game state and replayable actions](https://github.com/jonesrussell/minoo-game-engine/issues/7) | P0 | engine | #6 |
| [#6 Define versioned scene and vocabulary contracts](https://github.com/jonesrussell/minoo-game-engine/issues/6) | P0 | engine | #2, #35 |
| [#35 Select the canonical schema format and validator](https://github.com/jonesrussell/minoo-game-engine/issues/35) | P0 | framework | #32, #33 |
| [#36 Define scene version compatibility and migrations](https://github.com/jonesrussell/minoo-game-engine/issues/36) | P1 | framework | #6 |
| [#37 Define asset manifests loading and failure behavior](https://github.com/jonesrussell/minoo-game-engine/issues/37) | P0 | engine | #6 |
| [#38 Version replay logs and verify deterministic results](https://github.com/jonesrussell/minoo-game-engine/issues/38) | P0 | engine | #7 |
| [#39 Add generated action-sequence tests for runtime invariants](https://github.com/jonesrussell/minoo-game-engine/issues/39) | P1 | quality | #7 |
| [#40 Evaluate the scene renderer against concrete requirements](https://github.com/jonesrussell/minoo-game-engine/issues/40) | P1 | engine | #33, #6 |
| [#41 Verify input coordinates and accessible target equivalents](https://github.com/jonesrussell/minoo-game-engine/issues/41) | P0 | engine | #8 |
| [#42 Test save corruption migration and unavailable storage](https://github.com/jonesrussell/minoo-game-engine/issues/42) | P1 | quality | #11, #36 |

## M2 - Journey vertical slice

Prove one coherent learning experience and gather owner playtest feedback.

**Exit evidence:** A six-object scene is usable by pointer and keyboard, with hints, restoration and recoverable progress; initial vocabulary has provenance.

| Issue | Priority | Workstream | Prerequisites |
|---|---|---|---|
| [#16 Approve vocabulary and optional pronunciation content](https://github.com/jonesrussell/minoo-game-engine/issues/16) | P0 | content | #5, #9 |
| [#12 Qualify the complete Journey vertical slice](https://github.com/jonesrussell/minoo-game-engine/issues/12) | P0 | quality | #10, #11, #3, #41 |
| [#10 Add three hints and a restoration reward](https://github.com/jonesrussell/minoo-game-engine/issues/10) | P1 | journey | #9 |
| [#9 Build the first six-object homestead scene](https://github.com/jonesrussell/minoo-game-engine/issues/9) | P0 | journey | #8, #43 |
| [#43 Specify the complete first-scene learning loop](https://github.com/jonesrussell/minoo-game-engine/issues/43) | P0 | journey | #32 |
| [#44 Add optional pronunciation playback with clear fallback](https://github.com/jonesrussell/minoo-game-engine/issues/44) | P1 | journey | #9, #16 |
| [#45 Run an owner playtest and triage learning-flow feedback](https://github.com/jonesrussell/minoo-game-engine/issues/45) | P0 | quality | #12 |

## M3 - Agent authoring

Make structured authoring measurable before adding an MCP transport.

**Exit evidence:** An agent can inspect and modify a second scene using validated, reversible operations and replay the result.

| Issue | Priority | Workstream | Prerequisites |
|---|---|---|---|
| [#15 Demonstrate a second scene authored entirely through chat](https://github.com/jonesrussell/minoo-game-engine/issues/15) | P0 | journey | #14, #4, #12, #16 |
| [#14 Expose inspect validate edit and replay commands](https://github.com/jonesrussell/minoo-game-engine/issues/14) | P0 | authoring | #13, #7 |
| [#13 Implement validated transactional scene editing operations](https://github.com/jonesrussell/minoo-game-engine/issues/13) | P0 | authoring | #6, #12, #46 |
| [#46 Specify authoring operations errors and transaction boundaries](https://github.com/jonesrussell/minoo-game-engine/issues/46) | P0 | authoring | #6, #32 |
| [#47 Qualify authoring rollback and stale revision handling](https://github.com/jonesrussell/minoo-game-engine/issues/47) | P0 | quality | #13 |
| [#48 Build repeatable agent authoring acceptance tasks](https://github.com/jonesrussell/minoo-game-engine/issues/48) | P0 | quality | #14, #15 |
| [#49 Present human-readable scene diffs alongside structured output](https://github.com/jonesrussell/minoo-game-engine/issues/49) | P1 | authoring | #13 |

## M4 - Journey browser alpha

Ship a small browser alpha with known support limits and a feedback loop.

**Exit evidence:** Approved art/content, browser and accessibility evidence, tagged hosting and a rollback procedure meet the release checklist.

| Issue | Priority | Workstream | Prerequisites |
|---|---|---|---|
| [#19 Publish Journey browser alpha with release evidence](https://github.com/jonesrussell/minoo-game-engine/issues/19) | P0 | delivery | #4, #15, #18, #52, #54, #53 |
| [#18 Qualify accessibility touch and supported browsers](https://github.com/jonesrussell/minoo-game-engine/issues/18) | P0 | quality | #16, #17, #12, #50, #51 |
| [#17 Create and approve final homestead artwork](https://github.com/jonesrussell/minoo-game-engine/issues/17) | P1 | content | #5, #12 |
| [#50 Add automated accessibility checks and manual coverage notes](https://github.com/jonesrussell/minoo-game-engine/issues/50) | P0 | quality | #12 |
| [#51 Set and verify browser alpha performance budgets](https://github.com/jonesrussell/minoo-game-engine/issues/51) | P1 | quality | #17, #12 |
| [#52 Enforce content approval and attribution at release build time](https://github.com/jonesrussell/minoo-game-engine/issues/52) | P0 | content | #5, #16, #17 |
| [#53 Provide alpha feedback intake and release support notes](https://github.com/jonesrussell/minoo-game-engine/issues/53) | P1 | delivery | #45 |
| [#54 Rehearse deployment rollback before alpha release](https://github.com/jonesrussell/minoo-game-engine/issues/54) | P0 | delivery | #52 |

## M5 - Framework reuse

Use a second game to decide what is reusable rather than designing speculative abstractions.

**Exit evidence:** Matcher uses shared contracts without importing Journey internals; compatibility and package boundaries are demonstrated.

| Issue | Priority | Workstream | Prerequisites |
|---|---|---|---|
| [#21 Refine engine APIs from Journey and Matcher evidence](https://github.com/jonesrussell/minoo-game-engine/issues/21) | P2 | engine | #20, #56 |
| [#20 Prototype Matcher against the shared engine contracts](https://github.com/jonesrussell/minoo-game-engine/issues/20) | P2 | engine | #19, #55 |
| [#55 Specify Matcher as a framework conformance game](https://github.com/jonesrussell/minoo-game-engine/issues/55) | P1 | framework | #19, #33 |
| [#56 Enforce package boundaries and test two-game compatibility](https://github.com/jonesrussell/minoo-game-engine/issues/56) | P1 | quality | #20 |
| [#57 Define the smallest supported game extension interface](https://github.com/jonesrussell/minoo-game-engine/issues/57) | P1 | framework | #21 |

## M6 - Local MCP authoring

Expose the framework to agents without requiring model calls in gameplay.

**Exit evidence:** A local MCP adapter uses the same validated operations as the CLI; capability limits and client conformance are tested.

| Issue | Priority | Workstream | Prerequisites |
|---|---|---|---|
| [#58 Specify the local MCP adapter and capability boundaries](https://github.com/jonesrussell/minoo-game-engine/issues/58) | P1 | authoring | #14, #48 |
| [#59 Implement local MCP inspection and validation tools](https://github.com/jonesrussell/minoo-game-engine/issues/59) | P1 | authoring | #58 |
| [#60 Implement scoped MCP edit and undo operations](https://github.com/jonesrussell/minoo-game-engine/issues/60) | P1 | authoring | #59, #47 |
| [#61 Qualify CLI and MCP parity with recorded authoring tasks](https://github.com/jonesrussell/minoo-game-engine/issues/61) | P1 | quality | #60 |

## M7 - Framework beta and maintenance

Stabilize the demonstrated framework and small runtime; set future scope from evidence.

**Exit evidence:** Versioned API documentation, migration examples, release checks and repeatable agent acceptance tasks support a tagged beta.

| Issue | Priority | Workstream | Prerequisites |
|---|---|---|---|
| [#62 Publish framework API guide and extension examples](https://github.com/jonesrussell/minoo-game-engine/issues/62) | P1 | framework | #57, #61 |
| [#63 Qualify and tag the first framework beta](https://github.com/jonesrussell/minoo-game-engine/issues/63) | P1 | delivery | #62, #56 |
| [#64 Define dependency maintenance and next-release intake](https://github.com/jonesrussell/minoo-game-engine/issues/64) | P2 | delivery | #63 |

## Definition of ready

A task has an observable outcome, bounded scope, acceptance criteria, applicable spec references and satisfied prerequisites. Decisions may be ready even when implementation is blocked. In-review work is not ready for another implementation agent. A completed checkbox is not enough if the evidence is missing or the linked PR is unmerged.

## Definition of done

Acceptance criteria have evidence at the tested commit; checks appropriate to the change pass; visual changes have browser exercise and screenshot inspection; content changes have provenance; the PR is merged; and downstream readiness has been reconciled. Phase trackers close only after required children and exit evidence are complete. Human learning, language and cultural review must not be inferred from automated checks.

## Specification discipline

Specs describe lasting behavior; issues describe delivery work. Pilot the smallest useful SDD process in #32. Each substantive capability should identify requirement IDs, examples, failure cases, non-goals and verification. Update the spec when intended behavior changes. Use existing specs for small fixes rather than generating a new collection of documents each time.

Important invariants include no duplicate finds, bounded hints, a single completion award, repeatable action replay, valid vocabulary references, recoverable saves and atomic authoring edits. A JSON schema alone does not establish all of these. Runtime, semantic and browser tests cover different parts of the contract.

## Tool adoption gates

Ajv/JSON Schema versus Zod is decided by #35. Rendering choice is decided by #40 against actual requirements. fast-check is evaluated through runtime invariants in #39. MCP follows stable CLI operations in #58 through #61. None of these issue entries means the dependency is already installed. Keep the existing lightweight workspace while choices are evaluated.

## Risks and responses

| Risk | Response and evidence |
|---|---|
| Framework scope grows before a useful game exists | Six-object Journey gate, then one Matcher conformance game; no general plugin system before reuse evidence |
| Agent edits are structurally valid but break play | Semantic validation, independent replay/model tests and human scene review |
| Content rights or language accuracy are unresolved | #5 and #16 plus release content gate #52; fixtures cannot silently become release content |
| Rendering excludes keyboard or touch users | #41, #50 and #18 qualify interactions separately from visual appearance |
| Saves break after content changes | #36, #42 and rollback rehearsal #54 cover migration and recovery |
| Specs drift from code | Requirement-to-test links, per-PR verification and agent acceptance tasks #48 |
| Tooling creates unnecessary maintenance | Explicit adoption decisions; pin selected dependencies and verify updates in #64 |

## Outside this roadmap

Native iOS/Android/console exports, multiplayer, neural rendering or physics, model training, runtime LLM dependence, payments, backend accounts and a full visual editor need separate proposals. MCP here is local authoring infrastructure. Waaseyaa integration may later supply approved content, but no live-site integration or production data transfer is assumed.

## Maintaining the roadmap

After a merge, verify the linked issue criteria, close the issue when satisfied, and update native dependencies/readiness for downstream work in both projects. Add new issues to the primary roadmap and relevant delivery project, set phase/priority/workstream/effort/readiness and link the phase tracker. Keep roadmap.json and this document aligned when scope changes. Review the next phase in detail at each gate; later phases remain adjustable based on evidence.
