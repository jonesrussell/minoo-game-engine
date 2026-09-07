# ADR 001: Browser-first, structured authoring

Status: accepted starting direction; dependency choices finalized in the tooling issue.

## Decision

Build a new focused TypeScript engine using browser primitives and ordinary libraries where useful. Use a headless state/action core, versioned JSON content, an accessible browser renderer and a separate authoring package. Ship static assets. AI operates during development; gameplay does not require a model call.

## Proposed layout

- packages/engine: schemas, validation, state transitions, replay, rendering adapters and persistence contracts.
- packages/authoring: inspect/validate/edit/replay commands with structured output and transactional edits.
- games/journey: scene definitions, presentation, approved content references and game-specific rules.
- games/matcher: added only during the reuse milestone.
- tests: end-to-end game flows and fixtures.

These paths describe the implementation plan and are not implemented packages yet.

## Contracts

Scenes use logical coordinates, stable IDs, explicit vocabulary references and completion rules. The renderer emits actions; the core produces state. Persistence wraps versioned state. Randomness and time are injected rather than read implicitly by state transitions. Authoring commands validate the entire result and reject stale revisions before writing.

## Tradeoffs

This prioritizes explicit state, testability and accessible 2D interaction over a general-purpose renderer. Start with DOM/SVG where suitable; choose Canvas only with an accessibility strategy and a demonstrated need. Do not build an ECS or plugin system without a concrete use case.

Reproducible builds and deterministic game replay are separate concerns. Lock dependencies for the former; explicit actions and controlled inputs support the latter.
