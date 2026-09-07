# Product scope

## First outcome

An owner can request, review and iterate on one complete Journey scene through chat, then open a browser link and play it.

## Journey vertical slice

One homestead scene; six objects; Anishinaabemowin prompts with optional English meanings; pronunciation only when approved recordings exist; three hints; found-object feedback; one visible restoration reward; local save and reset. Mouse, touch and keyboard input. Responsive browser target.

Initial fixtures must be visibly marked as non-release content. Progression and technical playability can be tested automatically; learning quality and cultural presentation need human review.

## Engine success

Scene data is inspectable. Actions replay predictably. Agent edits are validated and reversible. A second scene can be authored through chat with a reviewable diff and evidence. Matcher later tests reuse.

## Out of scope for alpha

Multiplayer, backend accounts, payments, native app stores, neural physics/rendering, training models, arbitrary generated code inside scene data, and an embedded chatbot. No automated transfer of minoo.live content or production deployment.

## Release evidence

Approved content provenance; passing checks at the released commit; hosted smoke test; keyboard and touch verification; owner playtest; changelog, known limitations and rollback instructions.

## Optional Studio authoring

Studio may become another authoring interface through [ADR 002](decisions/002-studio-game-capability.md). Reuse its accounts, projects, revisions, agent jobs, approvals and preview presentation as those capabilities become available. Do not build a parallel platform in Minoo or place game definitions in waaseyaa.site. Keep the first game and standalone runtime independent; see [S0-S2](studio-integration.md).
