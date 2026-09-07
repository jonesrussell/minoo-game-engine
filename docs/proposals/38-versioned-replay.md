# Proposal 38: versioned replay

Issue: [#38](https://github.com/jonesrussell/minoo-game-engine/issues/38)
Status: implemented replay contract
Owner: Minoo engine maintainers

## Why

Record and replay headless runtime sessions from a self-contained versioned log so
tests, authoring and later tooling can verify deterministic behavior without
depending on external scene files.

## Scope and exclusions

In scope:

- `@minoo/engine/replay` with `captureReplay` and `replayLog`
- Version-1 envelope with embedded scene snapshot, runtime options, null inputs
  and ordered actions
- Strict envelope validation, first-failure diagnostics and canonical final-state
  JSON
- Journey engineering fixture with six English objects

Excluded: persistence (#11), generated action-sequence tests (#39), hashing,
external lookup, clocks, randomness, services, Studio integration and rendering.

## Requirements

- RPL-VERSION-001: Supported envelope/runtime/action versions and strict shape
  checks; `inputs.seed` and `inputs.time` must both be `null`.
- RPL-SNAPSHOT-001: Embedded full scene snapshot, nonblank `content.revision`,
  frozen capture output and preserved fixture provenance.
- RPL-DETERMINISM-001: Repeated replay of the same log yields identical events,
  final state and canonical final-state JSON.
- RPL-FAILURE-001: Sequential replay stops at the first failing action with
  zero-based `actionIndex`; header failures use `actionIndex: null` and expose no
  partial success output.

## Tasks

| Task | Requirement IDs | Planned check | Expected outcome |
| --- | --- | --- | --- |
| Export `@minoo/engine/replay` | RPL-VERSION-001 | Type import from replay module | Public API resolves without game imports |
| Implement capture and replay | RPL-SNAPSHOT-001, RPL-FAILURE-001 | Unit tests for capture, mutation isolation and first-failure behavior | Frozen logs replay from embedded snapshots only |
| Implement envelope validation | RPL-VERSION-001 | Unit tests for unsupported versions and malformed ingress | Unsupported or wrong-shaped logs fail before action stepping |
| Add Journey replay fixture | RPL-DETERMINISM-001, RPL-SNAPSHOT-001 | Unit test replays fixture twice | Hint, duplicate, completion, reset and second completion are covered |
| Document durable replay spec | all RPL-* | `docs/specs/replay.md` | Requirement IDs linked to tests |

## Verification

- Planned: `npm ci` with Node.js 24.13.1 and npm 11.8.0, then `npm run typecheck`, `npm test -- tests/unit/replay.test.ts`, and full `npm test`
- Executed: see the qualified checks in [the replay spec](../specs/replay.md); source identity is recorded in the PR and CI.
- Evidence: [unit suite](../../tests/unit/replay.test.ts), [replay spec](../specs/replay.md), [Journey replay fixture](../../tests/fixtures/replay/journey.json)

Parent qualification runs the planned checks on Windows Node 24.13.1 and npm
11.8.0. This clone does not record executed evidence until that qualification
completes.
