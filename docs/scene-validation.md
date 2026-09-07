# Scene version 1 validation

The canonical [Draft-07 schema](../packages/engine/src/contracts/scene.schema.json)
and generated declarations belong to the engine. Validation has a separate public subpath:

```ts
import { parseScene, validateScene, type Scene } from '@minoo/engine/scene';
const result = parseScene(sceneJson);
if (!result.ok) {
  // Present result.errors; do not render or persist invalid scene data.
} else {
  const scene: Scene = result.scene;
  // Pass validated data to the caller's runtime or authoring operation.
}
```

`parseScene(string)` reports malformed JSON at the document root.
`validateScene(unknown)` checks parsed data. Both return `{ ok: true, scene }`
or `{ ok: false, errors }` without rewriting input. Success returns the original
object, not a frozen snapshot or lasting authorization token. Revalidate after
edits. Structural failures stop the semantic pass, preventing partial-data access.

## Contract choices

- IDs use `^[a-z][a-z0-9-]*$`. These are local identifiers, not registry lookups.
  Objects and vocabulary each have their own uniqueness scope.
- Scene dimensions and object extents are finite positive numbers; coordinates
  are finite and nonnegative. Right/bottom edges may equal the scene edge exactly.
  Comparison uses JavaScript arithmetic with no hidden tolerance.
- Generic scenes contain one or more objects. Journey's six-object layout is a
  game constraint, not a restriction on all engine scenes.
- Each object references one vocabulary record. `completion` has `type: find-all`
  and a nonempty, distinct `requiredIds` list of existing object IDs. A subset is
  allowed. Counting finds, replay and awarding completion remain #7.
- Vocabulary requires exact `text`, English `meaning`, `dialect`, `source`,
  `attribution`, `permittedUse` and `approval` metadata. Empty/whitespace-only
  metadata and unpaired Unicode surrogates are rejected. Valid spelling is never
  normalized or transliterated. Engineering content uses `approval.status: fixture`.
- `fixture` and `draft` records are accepted for authoring. `approved` requires
  `reviewedBy` and an actual `YYYY-MM-DD` `reviewedOn` date. These are supplied
  metadata, not verified identity or cultural approval. Release checks remain #52.
- Audio/pronunciation/art asset fields are unsupported and rejected as unknown.
  Asset and playback support need later manifest/content contracts. This API
  cannot make unapproved audio playable.

## Diagnostics

Each error has a stable `code`, RFC 6901 `pointer`, `requirement` ID and actionable
`message`. Missing-field pointers name the absent field; an empty pointer names
the document root. Arrays sort by pointer, code and message using code-unit
ordering. Clients should match codes/paths, not Ajv message wording.

| Code | Meaning |
|---|---|
| SCENE_INVALID_JSON | Correct malformed JSON before validating |
| SCENE_VERSION | Declare supported scene version 1 |
| SCENE_STRUCTURE | Fix a type, required field, scalar constraint or unknown field |
| SCENE_DUPLICATE_ID | Assign a unique ID; message identifies the first occurrence |
| SCENE_BOUNDS | Adjust the position or extent to fit the scene |
| SCENE_REFERENCE | Add the referenced record/object or correct its ID |
| SCENE_REVIEW_DATE | Supply an actual calendar date |
| SCENE_TEXT | Correct malformed Unicode without rewriting valid spelling |

For example, `SCENE_REFERENCE` at `/objects/0/vocabularyId` maps to
`SCN-VOCAB-001` and identifies the missing vocabulary ID. Duplicate scalar
completion IDs use `SCENE_STRUCTURE` at `/completion/requiredIds`.

## Generated types and evidence

Run `npm run generate:scene-types` after editing the schema. Unit tests regenerate
declarations in memory and reject drift. Do not hand-edit generated declarations.
Numeric constraints, references and conditional review metadata still require
runtime validation; the declarations cannot express the complete contract.

The [fixtures](../tests/fixtures/scenes/valid.json) contain original English
engineering content. [Unit tests](../tests/unit/scene-validation.test.ts) cover
SCN requirements and preservation behavior; [type checks](../tests/types/scene-validation.ts)
verify public generated types. `npm run test:e2e` checks the unchanged Journey
shell and separately bundles the public validator for Chromium. The bundle
smoke writes no game artifacts or test hooks; failures are recorded in the CI log.

Ajv compiles the bundled trusted schema on module load. This smoke does not prove
compatibility with CSP policies forbidding dynamic compilation; qualify
precompiled validation when that hosting requirement is introduced. The Journey
shell does not yet consume scene data; renderer integration remains #8.
The API has no Node filesystem, Journey, authoring, Studio, model or network
dependency. Ajv is declared as an engine dependency.
