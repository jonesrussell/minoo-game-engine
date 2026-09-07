# Scene contract specification

Status: validation implemented in #6, from the #32 pilot. Runtime gameplay remains #7.

This is a behavior contract for issue [#6](https://github.com/jonesrussell/minoo-game-engine/issues/6).
[ADR 003](../decisions/003-canonical-scene-schema.md) selects JSON Schema Draft-07,
Ajv and generated TypeScript declarations. The #35 comparison is a pilot,
not this production scene implementation.
It follows OWN-001 through OWN-005 in the [package boundaries](../package-boundaries.md).

## Purpose

Make a scene inspectable before rendering. A scene identifies its objects,
places them in logical bounds, references vocabulary or marked fixture records and states
how completion is determined.

## Requirements and scenarios

### SCN-STRUCTURE-001: Parse and validate without mutation

The input MUST be valid scene-shaped JSON data. Unknown properties, missing
fields and wrong types MUST be rejected without coercion, normalization or
removal. Failures MUST include a stable code, JSON Pointer and requirement ID.
The [version 1 API contract](../scene-validation.md) defines concrete fields,
diagnostics and authoring versus release behavior.

### SCN-VERSION-001: Supported scene-contract version

The scene MUST declare a scene-contract version supported by the implementation.
An unsupported version MUST be rejected with the version data path and expected
versions.

#### Scenario: supported version

- GIVEN a scene declaring a supported contract version
- WHEN the validator inspects the scene
- THEN validation proceeds to the remaining scene checks

#### Failure example: unsupported version

- GIVEN a scene declaring a version the implementation does not support
- WHEN the validator inspects the scene
- THEN validation fails with the version field's JSON Pointer and expected versions

### SCN-IDENTITY-001: Stable scene and object identity

The scene MUST contain a supported scene identifier and each object MUST have a
unique stable identifier within that scene.

#### Scenario: valid identities

- GIVEN a scene with a supported identifier and six distinct object IDs
- WHEN the authoring validator inspects it
- THEN validation succeeds and the IDs are available to state and replay logic

#### Failure example: duplicate object ID

- GIVEN two objects with the same ID
- WHEN the validator inspects the scene
- THEN validation fails with the duplicate ID and its data path

### SCN-BOUNDS-001: Logical placement stays in bounds

Scene dimensions MUST be finite and positive. Each object MUST have finite
logical placement and a positive extent entirely within the declared scene bounds.

#### Scenario: valid placement

- GIVEN an object whose position and declared extent fit inside the scene bounds
- WHEN the validator inspects it
- THEN validation succeeds

#### Failure example: out-of-bounds placement

- GIVEN an object whose extent crosses a scene boundary
- WHEN the validator inspects it
- THEN validation fails with the object path and bounds error

### SCN-VOCAB-001: Vocabulary references preserve provenance fields

Each prompt or label that uses vocabulary MUST reference a record containing a
Unicode-safe value and its dialect and source fields. Marked English fixtures
MAY be used for engineering. Validation preserves provenance fields and does
not infer language or cultural approval. A pronunciation reference MUST only be
usable when its approval metadata permits playback.

#### Scenario: referenced vocabulary

- GIVEN an object with a vocabulary reference whose record includes text,
  dialect and source metadata
- WHEN the validator inspects the scene
- THEN validation succeeds without rewriting the text

#### Failure example: missing vocabulary reference

- GIVEN an object that points to a record absent from the vocabulary collection
- WHEN the validator inspects the scene
- THEN validation fails with the missing reference path

### SCN-COMPLETE-001: Completion rule is explicit

The scene MUST declare a completion rule that identifies the required unique
object IDs. Runtime counting, replay and awarding completion belong to issue #7.

#### Scenario: six unique finds

- GIVEN a scene requiring six object IDs
- WHEN the validator inspects the completion condition
- THEN validation confirms that the condition names those IDs

#### Failure example: unresolved completion target

- GIVEN a completion condition referencing an object ID absent from the scene
- WHEN the validator inspects the scene
- THEN validation fails with the missing ID path

## Exclusions

This specification does not implement state transitions and replay (#7),
rendering, asset placement tools, Studio
integration, production vocabulary, translations, pronunciation approval,
multiplayer, native export or generated executable scene code. Fixtures must be
marked as non-release content and must not invent language or cultural claims.

## Proposal-to-test trace for #6

| Proposal task | Requirement IDs | Planned test or review | Status |
| --- | --- | --- | --- |
| Define scene and object IDs | SCN-IDENTITY-001 | Unit test valid IDs and duplicate-ID diagnostic with path | passed in #6 |
| Define logical bounds | SCN-BOUNDS-001 | Unit test in-bounds and out-of-bounds fixtures | passed in #6 |
| Define vocabulary references | SCN-VOCAB-001 | Unit test missing reference and Unicode/dialect/source preservation | passed in #6 |
| Define completion rule | SCN-COMPLETE-001 | #6 validation tests for distinct, resolvable target IDs and malformed conditions | passed in #6 |
| Keep unsupported versions rejected | SCN-VERSION-001 | Unit test unsupported version diagnostic | passed in #6 |

Runtime counting and duplicate-award checks are owned by #7, as listed in the
[proposal trace](../proposals/32-scene-contract.md); they do not block completion
of the #6 schema validation task.

The original pilot table above describes #6 verification targets. Their
implemented evidence is linked in [proposal 6](../proposals/6-scene-validation.md)
and the [API contract](../scene-validation.md). The PR/CI identify tested commits.
Runtime tests for #7 remain planned. Human language, art and learning review
remain independent.

## Small fix updates

When a small fix changes behavior covered here, update the existing requirement
or scenario, add a focused regression example, and link the implementation and
executed check to the same requirement ID. For example, if a duplicate selection
could award completion twice, update SCN-COMPLETE-001 and the #7 runtime trace
with that regression, then record the failing and passing test commits. Create a new requirement only when
the behavior is a new contract, not merely because the code has another helper
or button.
