# Investigative scene contract, version 2

Status: implemented for issue #95.

Scene version 2 generalizes findable-object content without changing the version-1
Journey contract. The canonical structural source is
`packages/engine/src/contracts/scene-v2.schema.json`, a strict JSON Schema Draft-07
document. TypeScript declarations are generated from that schema.

## Public API

`@minoo/engine/scene-v2` exports `SceneV2`, its generated record types,
`sceneV2Schema`, `validateSceneV2` and `parseSceneV2`. `@minoo/engine/scene`
continues to export the version-1 `Scene`, `validateScene` and `parseScene` API and
also exports `AnyScene` and `validateAnyScene` for explicit version dispatch.

`validateSceneV2` and `validateAnyScene` accept unknown external data. They do not
coerce, default, remove fields, migrate records or infer metadata. A successful
result returns the original object. A failed result uses the established
`SceneDiagnostic` shape with stable JSON Pointers.

## Records

A version-2 scene declares `version: 2`, a stable ID, positive logical dimensions,
one or more objects, one or more content records, zero or more source records and a
find-all completion rule.

Each object has a stable `id`, logical bounds and `contentId`. Version-2 IDs allow
letters, digits, hyphens and dots after an initial letter, so storyboard IDs such as
`S01.O1` are valid. This does not relax the version-1 lowercase ID grammar.

Each content record has:

- `id`, player-facing `label` and stable `clueId`;
- `classification`: `fact`, `allegation` or `fiction`;
- `sourceRefs`, which may be empty and must resolve when present;
- `editorial.status`: `fixture`, `draft`, `reviewed` or `approved`, with reviewer and
  review date required for reviewed or approved records;
- `rights.status`: `fixture`, `unresolved` or `cleared`, plus a nonblank `basis` and
  optional attribution.

Each source has an ID, title, absolute HTTP(S) URL and actual calendar
`publishedOn` date. Source records identify material used by content. Rights metadata
separately records permission or basis for use.

IDs are unique within object, content and source collections. Clue IDs are unique
across content records. Object-to-content, content-to-source and completion-to-object
references must resolve. Every object extent must fit the scene dimensions.

## Runtime and meaning

The headless runtime accepts either supported scene version through
`validateAnyScene`. It uses only shared scene ID, object IDs and completion IDs for
selection, duplicate finds, bounded hints, reset and search completion. A
`find-all` completion event means that every required search target was found. It
does not establish a historical claim, corroborate a source, approve copy, clear
rights or award a game-specific editorial reward. Those rules belong to the game.

## Compatibility and replay

Version-1 scenes remain valid through their existing schema and APIs. There is no
automatic v1-to-v2 migration because vocabulary records do not contain enough
information to infer classification, sources, editorial review or rights.

Replay envelope, runtime and action versions remain `1`. A replay embeds either a
validated version-1 or version-2 scene snapshot unchanged. Replay dispatches on the
embedded scene's explicit version; it does not migrate the snapshot or guess missing
metadata. Existing Journey replay fixtures therefore retain their version-1 scene
and behavior.

## Requirement mapping

| Requirement | Meaning |
| --- | --- |
| `SCN-VERSION-002` | Scene declares version 2. |
| `SCN-CONTENT-002` | Object/content/clue structure and references are valid. |
| `SCN-SOURCE-002` | Source records and content source references are valid. |
| `SCN-IDENTITY-001` | Object IDs are unique. |
| `SCN-BOUNDS-001` | Dimensions are positive and object extents fit. |
| `SCN-COMPLETE-001` | Required find targets are unique and resolve to objects. |

Automated validation establishes contract conformance only. Source quality,
historical accuracy, editorial approval, rights clearance and owner acceptance
remain separate review decisions.
