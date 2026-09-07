# Proposal 35: choose the scene schema source

Issue: #35. Status: decision implemented; production contract remains #6.

Use the same six-object fixture and invalid variants to compare plain JSON
Schema/Ajv with native Zod and Zod export. Preserve the standalone runtime and
optional Studio boundary. Exclude production validation APIs, content imports,
renderer changes, schema migrations and Studio implementation.

| Requirement | Verification | Result |
|---|---|---|
| SCH-001: compare structural behavior without mutating inputs | `tests/unit/schema-choice.test.ts`, ten shared input cases | Passed |
| SCH-002: distinguish portable shape from cross-record semantics | Six semantic cases and a Zod refinement/export counterexample in the same suite | Passed |
| SCH-003: derive types from one authoritative JSON schema | Generated-output drift test and `experiments/schema-choice/type-proof.ts` via typecheck | Passed |

The requirement-to-SCN mapping and library rationale are in [ADR 003](../decisions/003-canonical-scene-schema.md).
Checks above were run on this change; the linked PR records exact source and
merge commits. Production SCN acceptance tests stay planned until #6/#7.
