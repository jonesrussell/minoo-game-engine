# Package ownership and boundaries

This document records the ownership decision for issue [#33](https://github.com/jonesrussell/minoo-game-engine/issues/33). The `packages/engine`, `packages/authoring` and `games/journey` packages exist in the current workspace. The internal `contracts`, `core` and `adapters` layers below remain planned boundaries; they do not claim that those layers or any service already exist.

## Requirements

These requirements apply before framework, runtime or game implementation begins.

| ID | Requirement |
| --- | --- |
| OWN-001 | Framework contracts are platform-neutral and contain versioned scene, action, content-reference, validation and documented public contract types needed by supported use cases. |
| OWN-002 | Runtime core owns state transitions, replay, persistence contracts and failure behavior. It accepts structured inputs and does not import a game package or browser API. |
| OWN-003 | Runtime adapters translate platform events and services into runtime ports. Rendering is an adapter boundary: a renderer reads a view model and emits structured actions; it does not mutate game state. |
| OWN-004 | A game package owns its scenes, vocabulary references, artwork references, prompts, hints, rewards and game-specific rules. It consumes framework contracts and public runtime extension interfaces. |
| OWN-005 | Authoring uses the same contracts and validation rules as runtime execution. It may produce candidate data and diagnostics, but it does not define an independent game model. |
| OWN-006 | The runtime and standalone browser game require no Studio, account service, model call or network service during ordinary play. Standalone local authoring has no mandatory Studio or model dependency; optional integrations may be added behind documented adapters. |

The scene contract and observable gameplay requirements will be specified by the SDD work in [#32](https://github.com/jonesrussell/minoo-game-engine/issues/32). That work should reference OWN-001 through OWN-005 when it defines scene and action types.

## Ownership

| Area | Owns | Does not own |
| --- | --- | --- |
| Framework contracts | Versioned data shapes, stable IDs, content references, validation interfaces, operations and compatibility rules | Journey assets, vocabulary, browser APIs or game-specific progression |
| Runtime core | Headless state transitions, deterministic replay, persistence and asset-loading ports | Browser rendering, Studio coordination, model calls or Journey-specific rules |
| Runtime adapters | Browser input, storage, asset loading and rendering implementations | Game meaning, source-of-truth state or authoring decisions |
| Authoring | Inspect, validate, edit, diff, undo and replay operations over framework data | A second rules engine, direct renderer mutation or account/project services |
| Game packages | Scene data, presentation references, approved content metadata and game-specific rules | Generic engine services or assumptions about Studio |
| Delivery | Local setup, CI, browser evidence, release metadata and review workflow | Language, cultural or learning approval inferred from automated checks |

Minoo owns game semantics and execution. The accepted [ADR 002](decisions/002-studio-game-capability.md) keeps Studio optional: Studio may later coordinate accounts, projects, revisions, jobs and approvals around Minoo-owned candidate artifacts. The runtime and local authoring path must remain independently usable.

## Allowed imports

The dependency direction is one-way. A package may import only the rows listed for it and ordinary platform-neutral utilities. Importing a private file across a boundary is equivalent to importing the package itself and is disallowed.

| Package or layer | Allowed imports | Prohibited imports |
| --- | --- | --- |
| `packages/engine/contracts` | Standard TypeScript/runtime types and small platform-neutral utilities | `packages/engine/core`, `packages/authoring`, `games/*`, browser APIs, Studio or network clients |
| `packages/engine/core` | `packages/engine/contracts` public contracts and platform-neutral utilities | `games/*`, `packages/authoring`, browser APIs, DOM/Canvas, Studio or model clients |
| `packages/engine/adapters` | `packages/engine/contracts` public contracts and `packages/engine/core` public ports | Engine private state, authoring internals, Studio clients or game-specific rules |
| `packages/authoring` | `packages/engine` public contracts and documented validation/replay ports | Renderer/browser code, engine private state, Studio account/project code |
| `games/journey` and `games/matcher` (planned reuse game) | `packages/engine` public contracts, documented runtime extension interfaces and their own content/assets | Other game packages, engine internals, renderer internals or Studio services |
| Browser entrypoint | A selected game package, engine public API and engine adapter | Direct mutation of runtime state, authoring internals or Studio services |

The current engine package contains the viewport helper used by the browser fixture. That helper is an existing renderer utility, not headless simulation. The internal layer names may change when the engine is implemented; the dependency direction and public/private distinction are the decision. New dependencies require a concrete use case and an update to this table.

## Rendering boundary

The headless runtime is the source of truth. A runtime step accepts a validated structured action and returns the next state plus replayable effects or diagnostics. A renderer receives a derived view model and dispatches input as structured actions through the public runtime port.

```text
browser input -> runtime adapter -> structured action -> runtime core
runtime state -> view model -> renderer -> accessible controls / pixels
```

The renderer may choose DOM, SVG, Canvas or a later library after the concrete requirements are evaluated. That choice does not move rules into the renderer. The renderer must provide an accessible equivalent for interactive targets and must report unsupported input or asset failures through the adapter contract. It must not import game-private rules, write persistence directly or call a model.

## Browser and local constraints

The first target is a static, browser-playable game with responsive mouse, touch and keyboard interaction. Development and authoring stay local through chat and command-line operations. GitHub provides review, issue tracking and CI; a hosted game is a release concern rather than a development prerequisite.

Ordinary gameplay must work with local assets and deterministic inputs. It does not require Studio, PHP, an account, an API key, a hosted model, an MCP server or a backend. Local authoring may later use optional network or coordination adapters, but no such adapter is mandatory for standalone authoring. Optional Studio integration may review and coordinate Minoo candidate artifacts later, but the adapter depends on Minoo and the runtime never calls Studio.

The following remain outside this boundary and require separate decisions: native iOS, Android or console exports; multiplayer and realtime services; neural rendering or physics; model training; runtime LLM dependence; payments and backend accounts; a hosted model service; and an embedded chatbot or full visual editor. A renderer or package may not introduce one of these as an implicit dependency.

## Boundary examples

Success: Journey declares a stable `tree` object and its approved label reference, the runtime validates the scene and transitions state after a structured `inspect` action, and the browser adapter renders the resulting view model. The same candidate can be inspected locally without a browser.

Failure: a Journey module imports a runtime-private reducer to change state, a Canvas handler awards a reward directly, or the runtime imports Journey to decide what a `tree` means. These choices bypass the public contracts and must be rejected during review.

Failure: a local play command requires an account token, Studio process, network model call or MCP server. Those services belong to optional authoring or coordination workflows and are not runtime prerequisites.

## Verification

Before implementation, reviewers should verify that each new package has an explicit public entrypoint, that imports follow the table, and that rendering tests exercise input through structured actions. A boundary check should fail for a runtime-to-game or runtime-core-to-browser import. Browser evidence can establish interaction and accessibility behavior; it cannot establish language, cultural or learning approval, which remains human review under [the content policy](content-policy.md).
