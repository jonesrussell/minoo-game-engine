# Runtime generated-test contract

Issue [#39](https://github.com/jonesrussell/minoo-game-engine/issues/39) verifies
the [RTN runtime requirements](runtime.md) through its public API. These tests
supplement example-based runtime tests and do not define alternate rules.

- Generate valid and malformed actions together, including unknown object IDs.
  Rejected steps preserve prior semantic state and emit no effects.
- Derive expected state independently from the action history after its last
  reset. Unique first finds determine score; required-ID coverage determines
  completion. Count accepted hints against the configured budget.
- Compare state, success/diagnostics and events after every action. Completion
  events occur exactly at the coverage transition and at most once per run.
- Guarantee complete/reset/complete coverage for each generated case in addition
  to its random history. Vary required-ID subsets/order and include zero hints.
- Retain a minimized synthetic failure with generator version, seed, path and
  concrete actions. Generate/shrink it, reproduce it from saved coordinates, and
  show that the real runtime satisfies the invariant for those saved actions.

Run `npm test` for all tests or
`node --test tests/unit/runtime-invariants.test.ts` for this layer. The suite
runs 250 cases with fixed seed `3907`; failures print fast-check replay details.
The deliberately faulty score model uses a separate seed `39073907` and expects
failure. This is test-harness evidence, not a production defect or a claim that
all possible action histories have been exhausted.

See [proposal and evidence](../proposals/39-runtime-invariants.md). Browser
accessibility, game presentation and human language/learning approval remain
separate acceptance work.
