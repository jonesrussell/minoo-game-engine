# Ford Frenzy: asset library to playable opening

This is the SDD implementation plan. The [experience contract](specs/ford-frenzy-experience.md)
defines observable behavior and failure examples. The [game brief](first-game.md)
defines narrative scope. GitHub issues own delivery and evidence. Use the existing
plain Markdown SDD workflow; no additional process tool is required.

## Checkpoints and milestone gates

| Checkpoint | Milestone | Exit evidence |
|---|---|---|
| Source library and art direction | N0 | Complete recovered asset inventory, preserved originals, contact sheet, provenance decisions, approved reusable subset and one reference-based generation/export proof. |
| Runtime foundation | M1 | Proper renderer and frame loop; validated assets, input, generalized scene content and versioned save/recovery contracts. |
| Functional opening | M2 | Branded title, menus, HUD, notebook, settings, three linked scenes and an episode ending; placeholders allowed until art approval. Keyboard/touch, replay, recovery and owner playtest evidence. |
| Finished visual alpha | M4 | Approved adapted/generated art replaces placeholders; credits, historical/editorial review, accessibility, performance, release and rollback evidence. |

N0 also contains full-campaign storyboards. That larger deliverable does not block
the opening once its own outline, research and three scene boards are approved.
No dates are promised before asset inspection and renderer measurements.

## Artwork workflow

1. Inventory all recovered character, environment, prop and logo assets. Preserve
   source PSDs and classify duplicates, reference images and uncertain provenance.
2. Inspect source dimensions/layers and choose storage from the measured inventory.
   Keep game exports small and source artwork recoverable. Do not bundle PSDs.
3. Build a contact sheet and reuse/adapt/generate map for every opening scene and UI
   surface. The recovered hallway is a wide side-view composition; it needs a
   deliberate crop or reconstruction for a dense hidden-object scene.
4. Establish a style guide from selected artwork: palette, line treatment,
   perspective, character proportions, lighting, texture and interface typography.
5. Use the selected artwork as image-generation input. Generate backgrounds and
   separate clue/prop layers; add legible title and HUD text as editable elements.
6. Review candidates, record provenance and export approved versions into manifests.
   Preserve originals and rejected candidates outside shipping bundles.

Archive evidence already located includes a Crack Nation logo and Logo.psd,
Hallway.psd, Mayors office.psd, a City Hall hallway PNG, character source PSDs,
standing/walking/combat sprite exports and a mixed character reference sheet.
Only the previews inspected so far are visually verified; PSD layer suitability
and authorship remain import-task checks. Private Drive links and original files
are not published by this planning change. Arcade references are not automatically
part of the reusable game library. Artwork reuse does not restore combat mechanics.

## What the visible screens need behind them

- Navigation and focus ownership, including pause, confirmation, return to title,
  credits, settings, valid-save Continue and an episode completion screen.
- Stable asset IDs, hit regions, atlas/texture lifecycle, loading progress, retry,
  cancellation and resource disposal across repeated scene changes.
- A new game entry and content identity, without renaming the Journey fixture.
- Notebook, corroboration, hint budgets and progression owned by deterministic
  simulation; HUD and art remain presentation.
- Versioned local saves, incompatible/corrupt-save recovery, preferences and reset.
- Keyboard/touch equivalents, reduced motion, readable targets and silent play.
- Original fictional journalist/editor portraits, source-aware dialogue, tutorial
  cues, credits and minimal sound feedback. Voiceover is deferred.
- Historical/editorial review, asset provenance, measured performance, regression
  evidence and release rollback. Automated checks cannot approve story or art.

## SDD and agent handoff

Before coding an issue, link its requirement IDs and write concrete expected
results, including a failure case. If a scenario is underspecified, amend the spec
in that issue's PR before implementation. Deliver one bounded issue per branch.
Use placeholders for functional integration until final art is approved.

Cursor Composer 2.5 can implement bounded renderer, shell, HUD and import/export
tasks in isolated checkouts under the current routing rules. Parallel lanes must
own different files. One integrator reviews actual changes and serializes shared
contract integration, heavy qualification and merges. Image generation is a
separate tool operation with explicit source references and recorded output review.
Do not send private correspondence to coding workers or publish it as game content.

Definition of done: accepted scenarios have evidence at the merged commit,
remaining limitations are explicit, and issue/project readiness is read back.
An imported file is not approved shipping art. A completed plan is not a completed
game. Studio remains optional and runtime independently usable.

## Requirement and delivery map

| Requirements | Tasks |
|---|---|
| FF-ART-001 | #103 inventory/import, #94 art direction |
| FF-ART-002 | #104 generation/export proof, #17 finished art |
| FF-UI-001 | #105 title/menus/navigation, #17 final branding |
| FF-UI-002 | #106 HUD, #96 notebook/progression, #10 hints |
| FF-UI-003 | #37 asset lifecycle, #105 navigation, #97 frame loop |
| FF-INPUT-001 | #8 renderer, #41 coordinates/accessibility |
| FF-SAVE-001 | #11 saves, #95 content versioning, #96 progression |
| FF-SCN-001 | #90 research, #91 outline, #93 opening boards, #43 detailed loop, #9/#98/#99 scene implementation |
| FF-AUD-001 | #107 sound/settings |
| FF-QA-001 | #12 slice qualification, #45 playtest, #50 accessibility, #51 performance, #52 editorial/rights, #18/#19 release |

Plan delivery: #102. Immediate independent starts: #103 asset inventory, #90 research, #40 renderer evaluation and #37 manifests. #11 now waits for the investigative content/progression contracts. #105 can use placeholders; #106 integrates after notebook/hints. #12 requires menus/HUD/sound through native dependencies. #17 final artwork does not form a cycle with slice qualification.

Milestones group capabilities, not a strict chronological sequence. M1 persistence cannot close until the M2 investigation-state contract is available; foundational renderer work proceeds independently. #36 compatibility is an explicit prerequisite for #11, and #42 recovery testing is an explicit prerequisite for #12.

S01 polish checkpoint #136 supplies fictional editor dialogue, visual connector
comparison, optional synthesized equipment cues and a City Hall handoff card.
It is a bounded contribution to #105/#106/#107, not completion of their three-scene
scope. Owner playtest #45 follows this local preview; timing and fun remain human
acceptance. S02 and S03 remain #98 and #99.

## Earlier character presentation order (reordered by #142)

1. **#138: visible opening conversation.** Derive Elliot and Alex portraits from
   the approved newsroom concept. Stage one line at a time, identify the speaker,
   and provide Next, Back and Skip with equivalent pointer/touch/keyboard controls.
   The conversation blocks search; entering the assignment removes the portraits.
2. **#139: consistent expressions.** After the opening presentation, review neutral,
   annoyed, amused and surprised variants without drifting identities or clothing.
   Missing variants fall back to neutral. Nadia joins when her scene is delivered.
3. **#140: closing conversation and discovery pace.** Use the character/expression
   pattern for the assignment payoff, add dialogue replay/history, and playtest
   interruption frequency and transitions before extending it to S02/S03.

All three tasks belong to M2, the primary roadmap and the Ford Frenzy delivery
project. Native dependencies preserve this order. The first pass uses candidate
portraits; style approval is not final character or release approval.

Presentation references: Wooga's [dialogue example](https://wooga.theymes.com/hc/en/junes-journey/articles/what-is-the-detective-partners-event-463)
shows character-led communication. Its [gameplay guide](https://wooga.theymes.com/hc/en/junes-journey/articles/how-do-i-play-junes-journey-394)
describes search and adventure-puzzle scene types. Our implementation uses original
art and satire, a standalone runtime, and no outside links in gameplay. These are
presentation lessons, not a commitment to the reference game's economy or structure.

## Current presentation priority: complete composition first

Owner feedback on 2026-09-07 rejects the overall current play presentation: beige
assignment popup, website-like header/footer, dimming overlay and generic office.
Character staging did not resolve that composition problem. This changes delivery
order without undoing the working runtime, dialogue or input checks.

1. **#142: visual review.** Produce one complete edge-to-edge Toronto gameplay
   mockup using the existing art as reference. Include compact integrated HUD and
   mission copy over the scene, strong ink shapes and a recognisable Toronto
   street/neighbourhood context. Keep the scene readable and the satire present
   in the environment. Owner acceptance is still required.
2. **#143: implement the selected composition.** After #142 approval, implement
   editable game UI and separate scene/prop assets, preserving input and saves.
   A flat concept image is not a playable scene or production asset package.
3. **#139: expressions.** Resume character expression variants after the overall
   presentation is implemented. The added native dependency is #143.
4. **#140: closing conversation and discovery pace.** Follow expression work.

The original style reference remains GTA IV illustrated promotional/loading art,
translated into an original Toronto hidden-object game. No open-world 3D scope,
weapons, minimap, energy gates or multiplayer is introduced by this visual review.

Candidate and provenance: [gameplay composition 01](art/gameplay-composition-01/README.md).
The mockup's generated UI lettering is for composition review; production UI
must remain editable and accessible. The live playable build stays unchanged
until the selected direction is implemented under #143.
