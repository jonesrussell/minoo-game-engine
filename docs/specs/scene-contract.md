# Scene contract specification

Status: pilot for issue [#32](https://github.com/jonesrussell/minoo-game-engine/issues/32)

This is a behavior contract for issue [#6](https://github.com/jonesrussell/minoo-game-engine/issues/6).
It does not choose JSON Schema, Zod, Ajv or another validator. That decision is
reserved for [#35](https://github.com/jonesrussell/minoo-game-engine/issues/35).

## Purpose

Make a scene inspectable before rendering. A scene identifies its objects,
places them in logical bounds, references approved vocabulary records and states
how completion is determined.

## Requirements and scenarios

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

Each object MUST have logical placement that lies within the declared scene
bounds.

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
Unicode-safe value and its dialect and source fields. A pronunciation reference
MUST only be usable when its approval metadata permits playback.

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

The scene MUST declare a completion rule that can identify the required unique
finds and award completion once.

#### Scenario: six unique finds

- GIVEN a scene requiring six objects
- WHEN each object is selected once
- THEN the state reports six unique finds and one completion event

#### Failure example: repeated find

- GIVEN an object already counted as found
- WHEN it is selected again
- THEN the found count and completion event count remain unchanged

## Exclusions

This pilot does not define the canonical schema format or validator (#35),
state transitions and replay (#7), rendering, asset placement tools, Studio
integration, production vocabulary, translations, pronunciation approval,
multiplayer, native export or generated executable scene code. Fixtures must be
marked as non-release content and must not invent language or cultural claims.

## Proposal-to-test trace for #6

| Proposal task | Requirement IDs | Planned test or review | Status |
| --- | --- | --- | --- |
| Define scene and object IDs | SCN-IDENTITY-001 | Unit test valid IDs and duplicate-ID diagnostic with path | planned |
| Define logical bounds | SCN-BOUNDS-001 | Unit test in-bounds and out-of-bounds fixtures | planned |
| Define vocabulary references | SCN-VOCAB-001 | Unit test missing reference and Unicode/dialect/source preservation | planned |
| Define completion rule | SCN-COMPLETE-001 | Runtime/replay test for six unique finds and duplicate selection | planned |
| Keep unsupported versions rejected | SCN-IDENTITY-001 | Unit test unsupported version diagnostic | planned |

No implementation or tests for #6 have been executed by this pilot. The table
intentionally records planned evidence only. When #6 is implemented, replace
each status with `executed at <commit>` and link the exact test or browser
evidence. Human review remains required for language, art and learning quality.

## Small fix updates

When a small fix changes behavior covered here, update the existing requirement
or scenario, add a focused regression example, and link the implementation and
executed check to the same requirement ID. For example, if a duplicate selection
could award completion twice, extend SCN-COMPLETE-001 with that regression and
record the failing and passing test commits. Create a new requirement only when
the behavior is a new contract, not merely because the code has another helper
or button.

