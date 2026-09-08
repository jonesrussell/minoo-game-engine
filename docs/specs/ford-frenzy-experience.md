# Ford Frenzy experience contract

Status: specified for implementation. No screen, artwork import or scene is claimed
implemented by this document. Follow the [delivery plan](../ford-frenzy-delivery.md)
and [reporting-loop task #43](https://github.com/jonesrussell/minoo-game-engine/issues/43).
The owner selected Ford Frenzy, jr42 productions, three opening scenes and reuse of
existing art to guide new generated art. Specific storyboards and visual candidates
remain subject to owner review.

The owner-selected newsroom is **Toronna Haps**, with satire driving the fictional
assignments and dialogue. [Revision 2](../proposals/114-torrona-haps-rewrite.md)
defines the current storyboard and future assignment-route requirements. Its route
state is a proposed extension, not an implemented save/schema capability. The
opening remains S01-S03 with no later route assets required.

## FF-ART-001: preserve and classify source art

The import MUST retain unchanged source files, checksums, dimensions, file type,
source identity, creator/rights status and a stable asset ID. Classify each as reuse,
adapt, reference-only or unresolved. Inventory all recovered assets; ship only the
approved subset. Preserve Drive originals. Source PSD files and shipping textures
are different artifacts. Size measurements determine LFS or external source storage;
runtime bundles MUST NOT contain PSDs or load from private Drive URLs.

- Given two identical source files, when imported, then one canonical content hash
  retains both source records without creating ambiguous gameplay IDs.
- Given a third-party reference or unresolved provenance, when producing the public
  asset package, then it is excluded with an actionable inventory entry.
- Given a corrupt PSD or missing source, then import reports that file and preserves
  the previously approved library without silently substituting another image.

## FF-ART-002: derive and approve new artwork

Generation MUST use selected existing artwork as visual input. Record reference
IDs/hashes, prompt, model/tool, date, output hash, manual edits and review outcome.
Generation is a development operation. The shipped game needs no generation service.
Approved exports MUST have stable IDs, logical size, alpha policy, source linkage
and manifest entries. Backgrounds, interactive objects and overlays stay separate.
Text and title branding remain editable rather than relying on generated lettering.

- Given an approved character reference and scene board, when generating a candidate,
  then review checks silhouette, costume, palette, perspective and consistency.
- Given a target layered over a background, when resized on supported viewports,
  then it remains recognizable and its tested hit region follows the exported object.
- Given a rejected candidate, when building, then the last approved version remains
  selected; prompt repetition is not assumed to reproduce identical pixels.
- Given an updated approved export, then content revision and replay compatibility
  follow the versioned game contract, not an unrecorded replacement in place.

## FF-UI-001: complete game navigation

Provide boot, title, loading, playing, paused, notebook, scene-result, episode-result,
settings, credits and recoverable-error states. Title displays Ford Frenzy and
jr42 productions. New Game starts S01. Continue is offered only for a compatible
validated save. Settings and credits are reachable without starting a game.

- Given existing progress, when New Game or reset is chosen, then confirm the loss;
  cancelling preserves progress and focus.
- Given paused play, when Resume is chosen, then the same scene state resumes once.
- Given no save, then Continue is absent or clearly disabled with an explanation.
- Given return to title and repeated entry, then there is one active renderer loop
  and no accumulated input handlers or asset references.

## FF-UI-002: HUD reflects authoritative investigation state

Show objective, remaining target list, find feedback, hint budget, notebook access,
pause and progress. The HUD reads Minoo state and emits structured actions. It MUST
NOT maintain a parallel source of clue ownership or completion. A found object and
a corroborated claim have distinct labels. Pause/notebook overlays block underlying
scene selection. Nonessential animation respects reduced motion.

- Given a found target, when duplicate pointer or keyboard input arrives, then no
  second clue or progression award is produced.
- Given an exhausted hint budget, then the control explains why it is unavailable.
- Given an unverified lead in the notebook, then finding it never relabels it verified.
- Given an overlay closes, then focus returns to the originating control or a stable
  replacement if that control no longer exists.

## FF-UI-003: load and transition without corrupting progress

Required manifest entries MUST validate and load before entering the next scene.
Show loading, useful errors, retry and a route back to title. Cancelled or stale
loads MUST NOT replace the active scene. Release old scene resources after a
successful transition. Hidden tabs and pause suspend unnecessary presentation work
without changing deterministic gameplay results.

- Given a missing required texture, when loading, then no half-interactive scene
  starts and no completion award is committed; retry can recover.
- Given two rapid navigation requests, then a late first load cannot overwrite the
  selected destination or produce a second active loop.

## FF-INPUT-001: equivalent pointer, touch and keyboard play

Logical scene coordinates MUST map through resize, device pixel ratio and any
camera transform. Every essential target and control has a keyboard equivalent and
accessible label. Specify overlap/boundary policy in renderer input work. Overlays,
focus indication and target readability must be exercised on desktop and touch.

- Given resize during play, then the same visible target resolves to its stable ID.
- Given keyboard-only input, then S01 through S03 can be completed without a pointer.
- Given a hidden or disabled target, then it cannot be selected through stale input.

## FF-SAVE-001: versioned recovery

Save schema version, game/content identity, current scene, notebook and progression
consistently. Preferences are separate from campaign reset. Define compatibility
and migration explicitly; do not restore an unknown version as if it were current.

- Given partial S02 progress, when reloading, then Continue restores finds, hints,
  notebook and scene without replaying rewards.
- Given corrupted, incompatible or unavailable storage, then explain the condition
  and offer safe recovery or temporary play without silently erasing the old save.
- Given confirmed reset, then campaign progress clears while volume and accessibility
  preferences remain unless the user explicitly resets those too.

## FF-SCN-001: three linked investigative scenes

S01 Welcome to the Haps, S02 Meanwhile at City Hall and S03 We're Going With WHAT?
must follow the opening boards once owner-approved. Each has entry/exit conditions, find targets, hint behavior, source
classification and failure/retry scenarios. Six targets per scene is the starting
budget. Reusing hallway/office art does not automatically approve a historical
location, private encounter or story event. Later campaign boards do not block this
opening slice.

- Given completion of S01, then the notebook survives entry to S02 exactly once.
- Given an unsupported draft in S03, then editorial feedback preserves uncertainty
  and returns the player to the missing checks without awarding episode completion.
- Given a recorded action sequence, then replay reproduces investigation outcomes
  across scene transitions independently of rendering and animation timing.

## FF-AUD-001: optional sound, complete silent play

Provide volume/mute controls, saved preferences and gesture-based audio startup.
Sound cues supplement visible feedback. Missing optional audio does not prevent
play. No voiceover requirement in the first slice; dialogue remains readable text.

- Given mute, then no cue plays after transition or reload.
- Given blocked autoplay or failed audio load, then the visible interaction still
  completes and the game remains usable.

## FF-QA-001: evidence before completion

Each issue MUST link requirement IDs, discriminating success/failure checks and
tested commit. Capture browser evidence for menus, HUD and all three scenes.
Include save recovery, asset retry, repeated navigation, duplicate actions,
keyboard completion and touch resizing. Keep schema, simulation, renderer and
human content review evidence separate. Measure loading, texture memory, frame
cost and interaction on named devices; agree budgets from that baseline in #51.

Planned checks: typecheck, runtime tests, production build, browser tests,
repository checks, source/export validation, owner art/story review. None are
reported executed here. Exact commands and results belong in implementation PRs.

Owner spelling correction (#134): the canonical fictional newspaper name is **Toronna Haps**. Historical generation inputs and stable proposal filenames remain unchanged. The title uses the spelling-corrected derivative recorded in docs/art/visual-direction-02/toronna-edit.json.

## S01 playtest checkpoint (#136)

The first shift adds a short fictional Elliot/Alex exchange, an inspect view with
its found prop, a visual two-cable comparison, and an assignment receipt leading
into the City Hall premise. Cable choices describe shape and contact count equally
in visuals and accessible names; neither button names the correct answer. The
existing recorder action and source-check rules remain authoritative. No dialogue
choice changes the historical timeline, clue ownership or save format.

Original synthesized equipment cues supplement finds, wrong comparisons, ready
checks and completion. No audio files or outside requests are required. Mute and
volume survive reload under a separate preference key. Gesture unlock, hidden-tab
silence, pause and unavailable audio must leave silent play complete. These are
prototype cues, not an approved final soundtrack.

Panel motion is decorative and disabled by the game Reduce motion option or the
OS preference. Optional renderer objectLighting applies a warm tint and a small
non-interactive shadow to the existing sprites. Source pixels, target bounds and
spatial keyboard inspection remain unchanged. Finished object occlusion and
production assets remain #17 work.

The scene result is explicitly the end of this playable preview. S02/S03 delivery,
three-scene sound qualification and owner pacing acceptance remain open under
#98/#99, #107 and #45. A five-to-ten-minute first play is a target to measure with
people, not a result established by automated completion tests.
