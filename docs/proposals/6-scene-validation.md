# Proposal 6: production scene validation

Status: implemented validation contract; gameplay remains #7/#8.

Implement the SCN behavior using ADR 003's JSON Schema, generated types, strict
non-mutating Ajv and explicit semantic validation. Exclude runtime transitions,
authoring persistence, release approval, audio playback and Studio integration.

| Requirement | Implemented evidence |
|---|---|
| SCN-STRUCTURE-001 | Parsing, unknown/missing fields, escaped pointers and non-mutating malformed-input tests |
| SCN-VERSION-001 | Unsupported-version fixture and public browser bundle rejection |
| SCN-IDENTITY-001 | ID-format and duplicate-object diagnostics with the first occurrence identified |
| SCN-BOUNDS-001 | Bounds fixture, exact-edge acceptance, nonfinite and scalar checks |
| SCN-VOCAB-001 | Missing/duplicate references, Unicode/provenance, review metadata/date and unsupported audio tests |
| SCN-COMPLETE-001 | Unique, resolvable completion targets and subset acceptance |

Evidence: [unit suite](../../tests/unit/scene-validation.test.ts),
[type checks](../../tests/types/scene-validation.ts), and
[browser bundle smoke](../../scripts/test-scene-browser.mjs).
Run `npm test`, `npm run typecheck`, `npm run test:e2e` and
`npm run check:repository`. The PR and hosted CI identify tested source commits.
Game find-count/replay tests stay planned for #7. Successful authoring validation
does not establish approved language content or completed gameplay.
