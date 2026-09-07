# Proposal 32: scene contract pilot

Issue: [#32](https://github.com/jonesrussell/minoo-game-engine/issues/32)
Delivery issue: [#6](https://github.com/jonesrussell/minoo-game-engine/issues/6)
Status: specification accepted; #6 and #7 implementation remains planned
Owner: Minoo engine maintainers

## Why

Make one Journey scene inspectable before rendering by specifying stable scene
and object IDs, logical bounds, vocabulary references and an explicit completion
rule. This proposal demonstrates the plain Markdown flow selected in the SDD
pilot.

## Scope and exclusions

In scope: a versioned behavior contract, valid and invalid examples, actionable
diagnostic expectations and links from requirements to planned verification.

Excluded: the canonical schema format and validator decision in #35, runtime
state transitions and replay in #7, rendering, Studio integration, production
language or artwork, and executable scene code.

## Requirements

- SCN-VERSION-001: A scene MUST declare a supported scene-contract version;
  unsupported versions MUST be rejected with the version data path and expected
  versions.
- SCN-IDENTITY-001: A scene MUST contain a supported identifier and unique
  stable object IDs. Duplicate IDs MUST produce a diagnostic with a data path.
- SCN-BOUNDS-001: Object placement MUST fit within declared logical bounds.
  An out-of-bounds object MUST produce its object path and bounds diagnostic.
- SCN-VOCAB-001: Vocabulary references MUST resolve to records preserving
  Unicode text, dialect and source fields. Marked English fixtures MAY be used
  for engineering; validation does not infer language or cultural approval.
- SCN-COMPLETE-001: The scene MUST declare the required unique object IDs and
  completion condition. Runtime counting and replay behavior belong to #7.

## Concrete examples

Valid: a supported version, six distinct IDs, in-bounds extents, references to
existing marked fixture records, and a completion condition requiring those six
IDs.

Invalid: an unsupported version, a duplicate ID, an object crossing a boundary,
or a missing vocabulary reference. Each case should identify the failing path
and an actionable expected diagnostic.

## Tasks and verification ownership

| Task | Requirement IDs | Owner | Planned check | Expected outcome |
| --- | --- | --- | --- | --- |
| Define supported scene version field and rejection rule | SCN-VERSION-001 | #6 implementer | Structural validation fixture | Unsupported version is rejected with the version field's JSON Pointer and expected versions |
| Define scene and object IDs | SCN-IDENTITY-001 | #6 implementer | Valid and duplicate-ID fixtures | Valid IDs pass; duplicate path is reported |
| Define logical bounds | SCN-BOUNDS-001 | #6 implementer | In-bounds and out-of-bounds fixtures | Valid placement passes; object path and bounds error are reported |
| Define vocabulary reference shape | SCN-VOCAB-001 | #6 implementer | Missing reference and Unicode/dialect/source fixture checks | Missing path is reported; fixture metadata is preserved unchanged |
| Define completion condition shape | SCN-COMPLETE-001 | #6 implementer | Structural fixture for required IDs and condition | Valid condition passes; malformed condition is rejected |
| Implement unique-find counting and replay behavior | SCN-COMPLETE-001 | #7 implementer | Runtime and replay tests | Duplicate selection does not change count or award completion twice |

All checks above are planned. No #6 or #7 implementation check has been
executed by this pilot. When implementation begins, record the tested commit,
actual command and result beside the relevant task. Human review remains
required for language, art and learning quality.
