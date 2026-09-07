# Product scope

## First outcome

Build a story-driven hidden-object investigation set in Toronto during Rob Ford's
mayoral tenure and the crack-video scandal. The player is a fictional investigative
journalist. June's Journey is a genre reference. The final title is undecided.
See [the game brief](first-game.md) for the proposed opening and research anchors.

## Delivery

Storyboard the entire planned campaign, starting with its chapter outline and ending.
Develop a three-scene opening slice: assignment desk, City Hall records workspace,
and deadline desk. Those scene treatments remain proposals for owner review. Later
storyboards and finished campaign art do not block the opening slice.

The player searches, records leads, checks sources, builds a timeline and submits a
supported account. Include bounded hints, notebook/progression, local save/reset,
mouse/touch/keyboard input and a static browser build. Finding a clue does not verify
an allegation. Historical facts, attributed reporting and fiction remain distinct.

## Framework direction

Use a proper 2D rendering engine with a frame loop, drawing/sprites, assets and scene
transitions. Minoo owns deterministic simulation, schemas, actions, replay and
structured authoring. Evaluate future 3D implications in #40 without making 3D an
alpha requirement. Ordinary gameplay needs no model, account or network service.

Existing scene/runtime/replay code remains a foundation, not finished investigative
gameplay. Generalize vocabulary-shaped content through an explicit versioned contract.
The current Journey shell remains a legacy fixture; Journey learning is deferred.
Matcher later tests reuse independently of first-game-specific rules.

## Release evidence and exclusions

Require source/fiction classification, content/art rights, editorial and owner review,
passing checks at the released commit, browser/accessibility evidence and rollback.
No multiplayer, payments, backend accounts, native app stores, runtime LLM service,
full-campaign production or 3D implementation in the first slice. No production
minoo.live deployment or copying of its data.

## Optional Studio authoring

[ADR 002](decisions/002-studio-game-capability.md) remains accepted. Studio may reuse
accounts/projects/revisions/jobs/approvals around Minoo-owned artifacts. The existing
Journey example remains a compatibility fixture. Do not put game definitions in
waaseyaa.site, duplicate a platform, or make Studio's private MVP depend on games.
