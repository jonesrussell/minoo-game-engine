# Proposal 7: headless runtime

Issue: [#7](https://github.com/jonesrussell/minoo-game-engine/issues/7)
Status: implemented runtime contract; versioned replay logs remain #38
Owner: Minoo engine maintainers

## Why

Provide a platform-neutral runtime that applies structured actions to validated
scene data so gameplay can be tested, replayed and later rendered without DOM or
game-package imports.

## Scope and exclusions

In scope:

- `createRuntime(scene, { hintBudget })` on `@minoo/engine/runtime`
- `select`, `hint`, `reset` and `complete` actions
- Immutable session state, events and diagnostics
- Deterministic replay through repeated `step` calls in tests

Excluded: rendering (#8), persistence (#11), versioned serialized replay logs
(#38), fast-check action generation (#39), browser adapters, Studio integration,
and Journey presentation.

## Requirements

- RTN-OPTIONS-001: `hintBudget` MUST be a nonnegative safe integer supplied by
  the caller; invalid options MUST fail at session creation.
- RTN-ACTION-001: Only structured `select`, `hint`, `reset` and `complete`
  actions are accepted; unknown or malformed actions MUST return stable
  diagnostics without changing state.
- RTN-SELECT-001: First finds increase unique `score`; duplicate finds emit
  `duplicate` without changing score; unknown object IDs are rejected.
- RTN-HINT-001: Hints target the first remaining `completion.requiredIds` entry,
  do not find objects, respect `hintBudget`, and fail when exhausted or when no
  required target remains.
- RTN-COMPLETE-001: Final required find auto-completes once; `complete` fails
  while targets remain and is idempotent after completion. Subset completion
  targets are supported.
- RTN-POST-001: Post-completion `select` remains allowed without re-emitting
  `completed`; post-completion `hint` fails with `RUNTIME_NO_HINT_TARGET`.
- RTN-RESET-001: `reset` clears run state and enables a fresh completion.
- RTN-REPLAY-001: Identical scene, options and actions yield identical final
  state and events.
- RTN-IMMUTABLE-001: Validated scene snapshots and returned arrays are
  deep-frozen; caller mutation cannot change runtime rules.

## Tasks

| Task | Requirement IDs | Planned check | Expected outcome |
| --- | --- | --- | --- |
| Export `@minoo/engine/runtime` | RTN-ACTION-001 | Type import in `tests/types/runtime.ts` | Public API resolves without game imports |
| Implement `createRuntime` + `step` | RTN-OPTIONS-001, RTN-IMMUTABLE-001 | Unit tests for options and mutation resistance | Invalid ingress rejected; frozen snapshot used |
| Implement find, hint and completion rules | RTN-SELECT-001, RTN-HINT-001, RTN-COMPLETE-001, RTN-POST-001 | Unit tests for duplicates, hint order, auto-complete and post-completion behavior | Score, events and completion invariants hold |
| Implement reset and replay | RTN-RESET-001, RTN-REPLAY-001 | Unit tests for reset and repeated sessions | Fresh run after reset; identical outputs |
| Document durable runtime spec | all RTN-* | `docs/specs/runtime.md` | Requirement IDs linked to tests |

## Verification

- Planned: `npm ci` with Node.js 24.13.1 and npm 11.8.0, then `npm run typecheck`, `npm test -- tests/unit/runtime.test.ts`, and full `npm test`
- Executed on the PR candidate: pinned Windows clean install, typecheck, 54 unit tests and repository links passed. The PR and required CI identify the exact tested commit and browser check results. Integration review corrected permissive extra fields, shallow event freezing and JavaScript-visible internal state; regression tests cover each correction.
- Evidence: [unit suite](../../tests/unit/runtime.test.ts), [type checks](../../tests/types/runtime.ts), [runtime spec](../specs/runtime.md)
