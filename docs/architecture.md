# ADR 001: Browser-first, structured authoring

Status: accepted. The workspace uses npm, TypeScript and Vite, with Node's test runner and Playwright browser checks. Versions are pinned in package.json and package-lock.json.

## Current first-game direction

The [investigative-game brief](first-game.md) supersedes the original Journey-first product scope. Keep completed independent scene/runtime/replay APIs. #40 must evaluate a proper 2D rendering engine, frame scheduling, drawing and asset lifecycle, plus the boundary for possible future 3D. HTML/SVG-only is not the product direction. The new game package and versioned investigative content contract are planned; existing games/journey stays a legacy fixture.

## Decision

Build a new focused TypeScript engine using browser primitives and ordinary libraries where useful. Use a headless state/action core, versioned JSON content, an accessible browser renderer and a separate authoring package. Ship static assets. AI operates during development; gameplay does not require a model call.

## Proposed layout

- packages/engine: schemas, validation, state transitions, replay, rendering adapters and persistence contracts.
- packages/authoring: inspect/validate/edit/replay commands with structured output and transactional edits.
- games/journey: scene definitions, presentation, approved content references and game-specific rules.
- games/matcher: added only during the reuse milestone.
- tests: end-to-end game flows and fixtures.

The engine, authoring and Journey workspaces exist. Engine exports the viewport helper, a separate [scene validation API](scene-validation.md) and the [headless runtime](specs/runtime.md). Runtime sessions validate scenes and process structured actions with immutable public state. Authoring reserves its package boundary with no API yet. Journey remains an illustrated fixture shell; scene-driven browser gameplay remains later work.

## Contracts

Scenes use logical coordinates, stable IDs, explicit vocabulary references and completion rules. The renderer emits actions; the core produces state. Persistence wraps versioned state. Randomness and time are injected rather than read implicitly by state transitions. Authoring commands validate the entire result and reject stale revisions before writing.

## Tradeoffs

This prioritizes explicit state, testability and accessible 2D interaction over a general-purpose renderer. Choose the rendering engine in #40 using the updated game requirements, with accessible equivalents for interactive scene targets. Do not build an ECS or plugin system without a concrete use case.

Reproducible builds and deterministic game replay are separate concerns. Lock dependencies for the former; explicit actions and controlled inputs support the latter.

## Studio integration boundary

[ADR 002](decisions/002-studio-game-capability.md) defines a separate optional adapter over Minoo-owned contracts. Studio coordinates authoring; the runtime never imports or calls Studio. Versioned candidate review returns diagnostics and a standalone static preview. Shared revision acceptance is a later, separately gated contract.

The package ownership and import rules for this boundary are recorded in [package-boundaries.md](package-boundaries.md). They apply to the planned package layout above and keep rendering behind runtime ports.
