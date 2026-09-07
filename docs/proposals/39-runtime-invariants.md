# Proposal 39: generated runtime invariant tests

Issue: [#39](https://github.com/jonesrussell/minoo-game-engine/issues/39).
Status: implemented; exact source and qualification results are recorded in the PR.

Add a small property-testing layer over the public runtime API. Pin fast-check
4.9.0 as a development dependency only. No production dependency or browser change.

The independent oracle derives state from action history since the latest reset:
first-seen valid selections, accepted hints and required-object coverage. It does
not call runtime internals or reuse its completion flag. Compare every step's
state, success, diagnostic code and ordered events.

250 seeded cases vary required subsets/order, budgets 0 through 5, valid and
unknown selections, duplicates, hints, completion retries, resets and malformed
actions interleaved in one history. Every case also finishes its required finds,
retries completion, resets and completes again. Count completion events per run.

| Requirements | Evidence |
|---|---|
| RTN-ACTION-001, RTN-SELECT-001 | Mixed legal/malformed histories; unique finds and rejected unknown IDs |
| RTN-HINT-001 | Independent hint ordering and bounds after every step |
| RTN-COMPLETE-001, RTN-RESET-001 | Coverage-derived completion, one event per run, guaranteed reset/completion suffix |
| RTN-REPLAY-001 | A persisted minimized counterexample reproduced from seed/path and replayed on the real runtime |

The shrink demonstration deliberately introduces faulty duplicate scoring in a
test model. It is not a discovered production bug. Seed `39073907` shrinks to two
identical selects at path `0:1:0:0`. The test generates and shrinks afresh, compares
the result to the checked-in fixture, reproduces the synthetic failure from that
fixture, then passes its saved actions through the real runtime.

Evidence: [tests](../../tests/unit/runtime-invariants.test.ts),
[saved counterexample](../../tests/fixtures/runtime/minimized-duplicate.json),
and [test contract](../specs/runtime-testing.md). Focused unit tests and typecheck
passed on the integrated candidate using Node 24.13.1/npm 11.8.0. Full checks and
exact source identity are recorded in the PR and required CI.

The [official fast-check guidance](https://fast-check.dev/docs/advanced/model-based-testing/)
supports independent models and shrinking. This small runtime uses array
arbitraries rather than a command framework; the
[replay parameters](https://fast-check.dev/docs/api/interfaces/Parameters/)
remain seed and path. Future schema or generator changes must intentionally
regenerate saved evidence rather than silently updating its coordinates.
