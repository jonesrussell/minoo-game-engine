# Roadmap

Milestones are ordered by acceptance gates, without invented delivery dates. P0 blocks its milestone; P1 supports the milestone; P2 is deferred reuse work. Issues carry explicit dependency links. Ready means prerequisites are satisfied; blocked means at least one prerequisite is outstanding.

## M0 - Development foundation

Exit: a cloud task can install dependencies, run checks, and open a reviewable PR; build and browser evidence available.

- [#1: Connect and verify ChatGPT cloud development](https://github.com/jonesrussell/minoo-game-engine/issues/1) (P0)
- [#2: Scaffold TypeScript workspace and browser development commands](https://github.com/jonesrussell/minoo-game-engine/issues/2) (P0)
- [#3: Add executable CI and downloadable browser evidence](https://github.com/jonesrussell/minoo-game-engine/issues/3) (P0)
- [#4: Provide hosted review builds for chat-based playtesting](https://github.com/jonesrussell/minoo-game-engine/issues/4) (P1)
- [#5: Record code license and content provenance decisions](https://github.com/jonesrussell/minoo-game-engine/issues/5) (P0)

## M1 - Journey vertical slice

Exit: one scene, six objects, hints, completion and local progress work with approved or clearly marked fixture content.

- [#6: Define versioned scene and vocabulary contracts](https://github.com/jonesrussell/minoo-game-engine/issues/6) (P0)
- [#7: Implement deterministic game state and replayable actions](https://github.com/jonesrussell/minoo-game-engine/issues/7) (P0)
- [#8: Render responsive scenes with accessible object controls](https://github.com/jonesrussell/minoo-game-engine/issues/8) (P0)
- [#9: Build the first six-object homestead scene](https://github.com/jonesrussell/minoo-game-engine/issues/9) (P0)
- [#10: Add three hints and a restoration reward](https://github.com/jonesrussell/minoo-game-engine/issues/10) (P1)
- [#11: Persist and recover local game progress](https://github.com/jonesrussell/minoo-game-engine/issues/11) (P1)
- [#12: Qualify the complete Journey vertical slice](https://github.com/jonesrussell/minoo-game-engine/issues/12) (P0)

## M2 - Agent authoring

Exit: an agent can modify a scene through validated reversible operations and produce replay evidence.

- [#13: Implement validated transactional scene editing operations](https://github.com/jonesrussell/minoo-game-engine/issues/13) (P0)
- [#14: Expose inspect validate edit and replay commands](https://github.com/jonesrussell/minoo-game-engine/issues/14) (P0)
- [#15: Demonstrate a second scene authored entirely through chat](https://github.com/jonesrussell/minoo-game-engine/issues/15) (P0)

## M3 - Browser alpha

Exit: approved content and artwork, accessibility and browser QA, hosted playable release and rollback procedure.

- [#16: Approve vocabulary and optional pronunciation content](https://github.com/jonesrussell/minoo-game-engine/issues/16) (P0)
- [#17: Create and approve final homestead artwork](https://github.com/jonesrussell/minoo-game-engine/issues/17) (P1)
- [#18: Qualify accessibility touch and supported browsers](https://github.com/jonesrussell/minoo-game-engine/issues/18) (P0)
- [#19: Publish Journey browser alpha with release evidence](https://github.com/jonesrussell/minoo-game-engine/issues/19) (P0)

## M4 - Engine reuse

Exit: Matcher reuses demonstrated engine capabilities without coupling the engine to Journey.

- [#20: Prototype Matcher against the shared engine contracts](https://github.com/jonesrussell/minoo-game-engine/issues/20) (P2)
- [#21: Refine engine APIs from Journey and Matcher evidence](https://github.com/jonesrussell/minoo-game-engine/issues/21) (P2)

## Project maintenance

Use Todo, In Progress and Done for execution state, with ready/blocked issue labels for dependencies. Before starting, reread dependencies. After a merge, close the linked issue only if acceptance is satisfied and update downstream readiness. Avoid using a completed milestone to imply a later release is qualified.
