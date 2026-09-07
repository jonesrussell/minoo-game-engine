# Optional Waaseyaa Studio integration

Accepted direction: [ADR 002](decisions/002-studio-game-capability.md). Studio owns shared account and work coordination; Minoo owns game schemas, simulation, rendering, assets, replay and game validation. The runtime remains independently usable.

This S0-S2 track is separate from M0-M7. It does not block Journey alpha, framework beta, local MCP, or Studio private-MVP acceptance. No game definitions enter waaseyaa.site; no second account/project platform is created. Studio repository issues are external prerequisites only; this plan does not edit their scope.

## Delivery gates

### S0 - Optional Studio review adapter

Prove a versioned review boundary and the Journey tree-label example with a standalone CLI and static preview. No source mutation by review, no Studio MVP dependency, no MCP prerequisite.

[Milestone](https://github.com/jonesrussell/minoo-game-engine/milestone/9) | [Tracker #66](https://github.com/jonesrussell/minoo-game-engine/issues/66)

| Issue | Prerequisites |
|---|---|
| [#69 Specify the versioned Minoo candidate review boundary](https://github.com/jonesrussell/minoo-game-engine/issues/69) | #33, #35 |
| [#70 Prove the standalone Journey tree-label authoring example](https://github.com/jonesrussell/minoo-game-engine/issues/70) | #14, #37, #38, #43 |
| [#71 Build an optional read-only Studio adapter for Minoo review](https://github.com/jonesrussell/minoo-game-engine/issues/71) | #69, #70 |
| [#72 Qualify the Journey candidate review boundary end to end](https://github.com/jonesrussell/minoo-game-engine/issues/72) | #71 |

### S1 - Shared Studio authoring workflow

After Studio private-MVP acceptance and stable account/project/revision/job contracts, reuse those services for game candidates. Prove durable acceptance, revision conflicts, authorization and failure behavior.

[Milestone](https://github.com/jonesrussell/minoo-game-engine/milestone/10) | [Tracker #67](https://github.com/jonesrussell/minoo-game-engine/issues/67)

| Issue | Prerequisites |
|---|---|
| [#73 Verify Studio readiness before shared game authoring](https://github.com/jonesrussell/minoo-game-engine/issues/73) | #72, waaseyaa/studio#14, waaseyaa/studio#15, waaseyaa/studio#16, waaseyaa/studio#17, waaseyaa/studio#18, waaseyaa/studio#19 |
| [#74 Connect Minoo candidates to shared Studio revisions jobs and decisions](https://github.com/jonesrussell/minoo-game-engine/issues/74) | #73, #47 |
| [#75 Qualify durable Journey authoring and account isolation in Studio](https://github.com/jonesrussell/minoo-game-engine/issues/75) | #74 |

### S2 - Optional Studio preview and publishing

Decide whether embedding is useful, qualify isolated presentation if adopted, and specify separate publishing authorization. Neither embedding nor publishing blocks standalone Minoo releases.

[Milestone](https://github.com/jonesrussell/minoo-game-engine/milestone/11) | [Tracker #68](https://github.com/jonesrussell/minoo-game-engine/issues/68)

| Issue | Prerequisites |
|---|---|
| [#76 Decide whether Journey needs embedded Studio previews](https://github.com/jonesrussell/minoo-game-engine/issues/76) | #75 |
| [#77 Qualify isolated Journey preview presentation if adopted](https://github.com/jonesrussell/minoo-game-engine/issues/77) | #76 |
| [#78 Specify separate authorization for Studio-assisted game publishing](https://github.com/jonesrussell/minoo-game-engine/issues/78) | #75 |

## Scheduling and evidence

All entries are P2 optional work, with no invented dates. Native dependencies represent prerequisites; external_dependencies in roadmap.json stores qualified cross-repository references. Readiness remains Blocked until prerequisites have actual acceptance evidence. Core issues must not acquire a dependency on this optional track.

The standalone tree-label example is the first proof. The existing PR #23 fixture browser checks are baseline evidence only: data-driven editing, replay and Studio integration are not implemented by that shell. Every later proof records both repository heads and uses real adapters, not canned previews.

S1 requires evidence of Studio private-MVP acceptance and stable account/project/revision/job contracts. The optional adapter can be absent without affecting the existing blueprint workflow. S2 embedding may be deferred with an explicit decision; publishing work here is a contract only, not deployment authorization.
