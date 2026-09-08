# Proposal 95: additive investigative scene contract

Status: implemented.

Issue #95 requires investigative labels, clue IDs, classifications, source
references and editorial/rights records without storing them in `vocabularyId`.
It must also preserve the Journey fixture and deterministic replay.

The implementation adds a sibling canonical `scene-v2.schema.json` and generated
declarations. It leaves the version-1 schema, types and validators intact. Dedicated
`validateSceneV2` and `parseSceneV2` APIs make the new contract explicit, while
`validateAnyScene` is the shared ingress used by runtime and replay.

Objects point to content records through `contentId`. Content points to sources by
stable ID and carries classification, editorial and rights metadata. Sources retain
publication identity separately from permission to reproduce material. The schema
contains only generic records and synthetic tests; Toronto-specific facts and game
rules stay in the game package.

The runtime continues to own search mechanics only. Version 2 deliberately keeps
the shared `find-all` completion shape, so existing select, duplicate, hint, reset
and completion behavior can be reused. Finding all objects is not evidence that a
claim is publishable. Corroboration, charger assembly, editorial review and rewards
remain Ford Frenzy rules.

Replay envelopes stay at version 1 because their wire shape and action semantics did
not change. Their embedded scene is now the union of supported scene versions. This
is explicit compatibility rather than silent migration: old logs embed v1 and new
investigative logs embed v2.

The alternative of extending version 1 was rejected because it would either break
existing Journey data or make unrelated vocabulary and investigative fields
optional in one ambiguous contract. Automatic migration was rejected because the
engine cannot derive classification, source, rights or editorial facts from legacy
vocabulary data.
