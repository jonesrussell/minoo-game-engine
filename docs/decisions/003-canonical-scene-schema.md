# ADR 003: JSON Schema is the canonical scene contract

Status: accepted for issue #35, 2026-09-07. Production scene implementation remains #6.

Use a checked-in JSON Schema Draft-07 document as the single structural source
of truth. Validate with Ajv in strict, non-mutating mode. Generate TypeScript
declarations from that document with json-schema-to-typescript and reject stale
generated output in CI. Game-specific cross-record rules remain an explicit
Minoo semantic validation pass.

## Comparison and evidence

The [comparison pilot](../../experiments/schema-choice/README.md) runs the same
scene examples through canonical JSON Schema/Ajv, native Zod, and Zod's Draft-07
export validated by Ajv. Versions are locked: Ajv 8.20.0, Zod 4.5.4 and
json-schema-to-typescript 16.0.0. All are development dependencies in this proof;
none is imported into the current game bundle.

| Choice | Benefit | Cost or limit |
|---|---|---|
| JSON Schema + Ajv + generated declarations | JSON is directly inspectable by tools without loading TypeScript; one checked-in schema generates types | Generation/check step; type declarations cannot represent every runtime constraint |
| Zod as source + inferred types + JSON export | Concise TypeScript authoring and native inference | JSON is derived; semantic refinements can differ from exported validation; export target/options must be controlled |

Both paths agree on ten structural cases: two valid fixtures and eight invalid
inputs, including unknown version/properties, numeric strings, nonfinite values,
missing provenance and invalid bounds scalars. Six further cases pass all three
structural validators but fail the demonstrator's semantic pass. A refined Zod
schema rejects an out-of-bounds object while its JSON export accepts it. That
is an observed gap for the pinned version, not a claim that all Zod checks fail
to export. No performance benchmark or PHP interoperability test is claimed.
Agreement on these examples is not proof of equivalence for every possible input.

JSON Schema fits the project's portable data boundary without making Studio
load a TypeScript source contract. Studio still calls Minoo for authoritative
game validation; this decision does not move game rules into PHP or
`waaseyaa.site`. Zod remains only an explicitly labeled comparison alternative.

## Portable subset and semantic boundary

Draft-07 covers the pilot's required fields, literals, object/array types,
scalar constraints, regular expressions and local schema references. No newer
draft feature is needed by this slice. Pin `$schema` and version `$id`; changing
the dialect later requires compatibility evidence. Use standard keywords and
bundled references. Do not add Ajv `$data`, custom keywords, remote schema fetches,
coercion, defaults or silent removal of unknown properties to the portable contract.

| Requirement | Structural schema | Minoo semantic validation / other evidence |
|---|---|---|
| SCN-VERSION-001 | Supported version literal and required fields | Migration/compatibility policy in #36 |
| SCN-IDENTITY-001 | Nonempty ID format | Unique IDs within the appropriate collection |
| SCN-BOUNDS-001 | Positive dimensions/extents, nonnegative coordinates | Object extent fits scene dimensions |
| SCN-VOCAB-001 | Required text/provenance fields | References resolve; pronunciation policy; human content approval |
| SCN-COMPLETE-001 | Completion-condition shape | Unique, resolvable targets; runtime counting/award behavior remains #7 |

`$ref` references schemas, not game records. `uniqueItems` compares complete
values; it cannot establish uniqueness of an object's ID property. It can handle
duplicate scalar completion IDs, although this small comparison leaves that
rule in the semantic demonstrator for parity. Production #6 should use standard
structural keywords where they fully express a rule and keep cross-record checks
explicit. Valid JSON cannot contain NaN/Infinity; strict Ajv also rejects these
at the pilot's direct JavaScript-object ingress.

## Type derivation and delivery

`node scripts/generate-pilot-types.mjs` reads the JSON schema and writes the
derived declaration. A test regenerates it in memory and compares the exact
output. `type-proof.ts` demonstrates rejected version, width and fixture types
with checked `@ts-expect-error` lines. Negative numeric values still typecheck;
runtime validation remains mandatory. Do not maintain a parallel handwritten
`Scene` interface or treat `as Scene` as validation.

For #6, move the chosen pattern into the engine's public contract/validation
boundary with production fixtures and stable diagnostics containing a code,
JSON Pointer and requirement mapping. Do not blindly promote this experiment's
fixture-only fields or informal error strings. Resolve vocabulary and content
approval behavior against the existing content policy. Browser packaging and
precompiled validation are implementation choices to qualify, not capabilities
proven here. The runtime stays independently usable.

## Primary sources

- [Ajv schema dialect support](https://ajv.js.org/json-schema.html): Draft-07 default and later dialect differences.
- [Ajv strict mode](https://ajv.js.org/strict-mode.html): reject ignored or ambiguous schema constructs.
- [Ajv TypeScript guidance](https://ajv.js.org/guide/typescript.html): typed validation and limits of type/schema correspondence.
- [Zod JSON Schema conversion](https://zod.dev/json-schema): explicit export target and representability limits.
- [json-schema-to-typescript](https://github.com/bcherny/json-schema-to-typescript): declaration generation and supported constraints.
