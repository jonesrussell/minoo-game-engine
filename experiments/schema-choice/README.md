# Issue 35 schema-choice proof

This is a bounded comparison, not the production scene schema or public engine
API. The existing Journey preview remains unchanged. Decision: [ADR 003](../../docs/decisions/003-canonical-scene-schema.md).

`scene.schema.json` is the canonical structural source for this pilot.
`scene.generated.d.ts` is derived, not hand-maintained. `pilot.ts` contains an
independent Zod alternative solely to compare native and exported validation,
plus a small semantic-rule demonstrator. Production code must not import this
directory. Zod is a dev-only comparator, not a second product contract; remove
or isolate its experiment when it no longer provides useful regression evidence.

From the repository root:

```sh
npm ci
node scripts/generate-pilot-types.mjs
npm test
npm run typecheck
```

The normal CI unit suite includes the comparison and generated-output drift
check. Typecheck includes `type-proof.ts`; changing generated types so the
expected rejections disappear fails typechecking. To update the contract, edit
the JSON schema and regenerate, never edit the declaration directly.

The fixture consists of six English engineering labels with explicit fixture
provenance. Unicode text is tested without inventing a translation. Unknown
version/fields, numeric coercion, missing metadata and scalar failures are
rejected. Duplicate IDs, reference failures and relative bounds are checked
separately. The Zod refinement/export test demonstrates why an exported schema
alone cannot certify semantic equivalence.

Executed locally for this change: 19 schema-choice tests and 3 existing viewport
tests passed; typecheck, production build and desktop/touch smoke tests passed.
The PR CI run records the exact tested commit. These checks do not establish #6
production diagnostics, migrations, pronunciation authorization or gameplay.
