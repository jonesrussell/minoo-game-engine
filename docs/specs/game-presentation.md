# Structured game presentation

Status: accepted design direction, 2026-09-07. S01 implementation under #143;
#142 visual direction approved by owner. Final asset and playtest acceptance remain separate.

## Ownership and structure

Ford Frenzy owns its presentation components and game content. The independent
Minoo runtime owns authoritative state transitions, validation and replay.
Keep rendering behind the existing engine adapter. Extract shared framework APIs
only when another concrete use proves the boundary; no new ECS, generic event bus,
UI library or Studio dependency is required by this decision.

Use reusable components for character portraits, dialogue, objectives, notebook,
hints, puzzle controls and pause/settings. Compose them into search, conversation,
close-up puzzle and result layouts. Layouts own placement, responsive behaviour,
focus and lifecycle. Components own their display and input handling. Scene data
selects layouts and supplies content; it does not contain executable callbacks.
The proper rendering engine continues to draw the scene and manage its frame loop
and assets. Accessible DOM controls may accompany it.

## Requirements

### PRES-001: Reuse components and layouts

Scenes MUST compose existing presentation components and layouts before adding a
new one. Keep visual tokens and responsive rules shared within the game.

Scenario: given two conversation definitions with different speakers and lines,
when each is loaded, the same conversation component renders both without a
scene-ID conditional or copied screen implementation. A second fixture is enough
to demonstrate reuse; it does not imply production completion of S02.

### PRES-002: Validate declarative content

Versioned presentation data MUST use stable IDs for scenes, characters, expressions,
assets, dialogue beats and objectives. It supplies text, asset references, layout
selection and staging. Use canonical JSON Schema with generated TypeScript types,
following ADR 003. A game-owned presentation schema may reference the scene
contract without putting Ford Frenzy dialogue into the generic scene schema.
Validate structure and reference integrity before activation; never execute data.

Scenario: an unknown layout or required character/asset reference rejects the
candidate with an actionable diagnostic before replacing the active scene.
Optional expression art may use a documented neutral fallback. Missing required
art produces a recoverable loading/error state, not an invisible playable target.

### PRES-003: State governs presentation

Inputs MUST dispatch structured actions to the owning session/runtime. Only
accepted state transitions may award finds, consume hints, unlock objectives or
persist progress. Derive the view model from accepted state; typed presentation
events may trigger audio, animation and reactions after that transition.
A small explicit adapter or subscription is sufficient. Presentation events are
not a second rules engine and are not replay inputs.

Scenario: selecting the recorder sends its stable object ID to the session. On
acceptance, the objective display updates and an optional sound/reaction plays.
A rejected or duplicate find grants nothing. Muting audio, disabling motion,
interrupting a transition or replaying dialogue cannot change the outcome.

### PRES-004: Lifecycle, persistence and replay

Layout transitions MUST release input handlers, subscriptions and transient effects.
Conversation controls must not activate underlying search targets. Declare which
state is transient and which is saved. Preserve existing save/replay compatibility
or supply an explicit version/migration decision before changing it.

Scenario: repeated search/conversation transitions do not duplicate handlers or
awards. Skip and Back alter dialogue presentation only. Reload follows the declared
resume policy. Replaying accepted gameplay actions produces the same progress
without a browser, audio or animation completion callback.

### PRES-005: Accessible, independently usable presentation

Layouts MUST support pointer, touch and keyboard; preserve spatial search without
revealing target locations. Keep text editable and readable, with silent and
reduced-motion play. Ordinary play requires no Studio, account or external links.

Scenario: phone and desktop players can complete the same assignment through
supported input paths. Keyboard exploration does not jump directly to hidden
objects. A flattened mockup is never the interactive scene or HUD.

## Delivery and evidence

#143 introduces the components/layouts needed by S01, declarative opening dialogue,
validation, and the state-to-presentation adapter. Prove reuse with a second small
content fixture. Move existing scene-specific copy and configuration out of screen
functions as those screens are migrated. Do not build unused layout systems merely
to satisfy a directory plan. #139 extends character/expression data; #140 consumes
the same dialogue/layout system for closing beats and history. #98/#99 reuse it.

Planned verification: invalid-content/reference cases; accepted/rejected action
and duplicate-handler cases; headless outcome equivalence with presentation absent;
browser keyboard/touch, skip/back, save reload, silent/reduced-motion and responsive
checks. Inspect screenshots for composition and readable search. Record exact
candidate and executed results in the PR. Visual approval and playtest acceptance
remain separate from automated checks.

## S01 implementation boundary (#143)

The opening conversation and HUD are pure reusable render functions; shared layout
CSS composes them over the independent Pixi scene. The existing panel helper hosts
specialised notebook, puzzle and result content. These specialised screens are not
a generic puzzle-definition language. Expression variants and closing/history data
remain #139/#140. Later scene work follows the same spec.

presentation.schema.json is the canonical game-owned contract. The existing
`npm run generate:scene-types` command also generates its declarations. Strict,
non-mutating Ajv validation checks structure; semantic checks cover unique IDs,
speaker/portrait references and complete target-label references. The alternate
fixture proves the same conversation renderer accepts different content.

The presentation asset catalog contains optional local portraits. Required scene
textures stay in the renderer manifest, with its loading/error/retry lifecycle;
there is no second required-asset loader in the conversation layer. The background
plate contains no painted HUD, characters or collectibles. Text and control labels
remain live. Object coordinates changed for this plate while ID-based gameplay
journals and the save revision remain compatible.

Accepted session state feeds renderHud; reactionsForTransition maps accepted events
to optional sounds/status. Sound and animation never commit progress. Replacing a
panel drops its controls and listeners; global input handlers attach once. Dialogue
index is transient; Back and Skip cannot discover clues, and resume uses the stored
assignment state. Required texture, portrait, audio and save failures have separate
recovery paths. Production browser evidence and exact candidate are recorded in the
linked PR, not inferred from this document.

### PRES-006: input intent controls the search cursor (#147)

Pointer focus alone MUST NOT enable the keyboard crosshair or location overlay.
Tab navigation into the scene, supported search keys and the explicit keyboard
search control enable it. Actual pointer movement or pointer/touch press hides
both, retaining the search position. Blur and modal entry also hide them.

Scenario: clicking empty scenery leaves no crosshair. Choosing keyboard search
shows it; moving the mouse hides it without changing progress. Arrow input on the
focused scene enables it again. Tab exit hides it; keyboard return restores it.
Returning from a panel follows the latest input method, including pointer close.
No action, target coordinate or save contract changes are part of this behaviour.

## Expression presentation (#139)

Character expressions use stable IDs `neutral`, `annoyed`, `amused`, and
`surprised`. A dialogue beat selects one expression for its active speaker;
inactive speakers always use their neutral asset. Expression assets are optional
local presentation assets. If a beat has no mapping for its requested expression,
the renderer selects neutral art. If a requested expression image fails, the
browser presentation retries neutral once and then reveals the character name
fallback if neutral also fails. Expressions do not alter session actions, saves,
replay, or progression.

## Closing dialogue and history (#140)

Opening and closing beats are named validated conversations. The transient dialogue
controller owns only conversation ID, beat index, return destination, and replay
state; it never imports or mutates the session. New Game opens `s01-opening`,
while the first accepted `k01-awarded` event opens `s01-closing` once. Its final
Next or Skip enters the existing receipt. Restored completed sessions enter the
receipt directly. Pause and receipt expose history replay; opening is always
available after a started game and closing is available only when authoritative
session state reports K01 awarded. Replay Back, Skip, Escape, and navigation do
not append actions or change saves. O1-O4 accepted finds remain in search with
HUD feedback; O5/O6 retain their inspection panels.

Conversation titles and discovery inspection modes are validated presentation data. Replaying returns to the history list and restores its launching control; leaving history restores its entry control on Pause or the receipt. Escape uses the same safe destination as Skip. Panel replacement clears abandoned conversation callbacks.
