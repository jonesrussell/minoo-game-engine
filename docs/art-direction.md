# Ford Frenzy art direction (opening slice)

**Issue:** #94. **Status:** DRAFT. Storyboard revision 2 is owner-approved; **visual art approval is not given.** Scope: S01-S03 plus title, menu, HUD, loading and credits. Object IDs are canonical in [full-game storyboards](storyboards/full-game.md).

## Style

Satirical **2D editorial comic illustration**: bold ink contours, blocky readable silhouettes, flat colour, restrained halftone **on backgrounds only**. Palette: civic blue (ff-075), warm paper cream, mustard newsroom lamp, brick red alerts. Civic parody tone; not photoreal, cozy cottage or pixel art. Title **Ford Frenzy** and **jr42 productions** are live text layers, not baked lettering.

**2D/3D:** 2D layers for the runtime renderer (#40). No 3D meshes or neural renders. Simulation stays independent of draw order.

## Stage and layers

Logical stage **1920x1080**; background art candidate **2560x1440** (budget proposal only). Device fit **letterboxes** the stage; do not crop finds. Hits **>= 44 CSS px** via HUD zoom and object list.

| Layer | Role |
| --- | --- |
| Background | BG01/BG02; optional parallax with **no** hit mapping |
| Foreground | Occluders only |
| Objects | Six alpha sprites per scene (Sxx.O1-O6) |
| Effects | Static under reduced motion |
| UI | HUD, dialogs, logos, text |

No hidden finds in background bitmaps. Parallax is decorative.

This layer rule applies to production assets. The review concept is a flat image
with baked props and characters, explicitly unsuitable as the final search backdrop.
S01.O6 is only the recorder; a wrong charger is a non-target distractor. Its two
connector choices appear in the inspect tray. S03.O3 and S03.O4 each award one find;
their magnets/grid become separate UI controls after inspection, never extra finds.

Palette tokens: civic blue `#073fb4`, paper `#f6e9ce`, mustard `#dfae45`, brick
`#ae493b`, ink `#142536`. Ink on paper is the primary reading combination; cream
on ink supports HUD labels. Blue/mustard selection needs an outline and label as
well as color. Body and evidence copy is at least 16 CSS px in the inspect tray,
with a design contrast target of 4.5:1 checked on actual rendered combinations.
Do not expect text baked into artwork to carry historical evidence.

At 390x844, 844x390 and 1440x900, inspect the fitted scene and keyboard navigation.
When a scaled target is too small, a 44 CSS px list control focuses and opens it;
zoom/pan must reveal the whole target without changing its canonical hit mapping.
Selected and focused objects need distinct outlines. The flat review mockup does
not implement those input/zoom rules; small-screen HUD is a layout study only.

## References (authoring only, not release)

| ID | Use | SHA-256 |
| --- | --- | --- |
| ff-075 | Title/menu palette | `e2961e24084a8a43806a5000c113e94af298c7f75756091b59e8ece0142ed216` |
| ff-044 | S02 composition only | `91d754bff6d2f751c1fb798720a1f56b5017fb5b3ff4375acff6ac8b26e1301a` |
| ff-022 | Silhouette candidate | `ad2f21f48c77c03408a8df7022556d5deb95a3a1b77de035d4f67a09d2ed9fb4` |
| ff-037 | Silhouette candidate | `335ef3f9df4a5cfb668913c0c677d24c39af92fa59d59140c812b5b198ab7444` |

Manifest: `games/ford-frenzy/assets/reference-manifest.json` (ff-044, ff-075).
ff-022 and ff-037 were visually inspected and their hashes verified on 2026-09-07;
creator attribution and release rights remain unresolved. ff-079 and ff-080 may
inform distant neutral standing silhouettes only: exclude combat, injury and death
frames. Hash verification is not content-rights approval.

## Scenes

**S01 Welcome to the Haps (BG01 day):** Scrappy May 2013 Torrona Haps newsroom: takeout, invoices, broken chair left-mid, crooked masthead, mustard lamps on cream paper.

| ID | Placement |
| --- | --- |
| S01.O1-O2 | Left desk: notebook under pizza box; contact sheet under keyboard |
| S01.O3 | Corkboard: May calendar, PATIO?? crossed out |
| S01.O4-O5 | Centre: mayor folder tab; H01 clipping on monitor stand |
| S01.O6 | Side table: recorder plus wrong charger (inspect tray is UI) |

**S02 Meanwhile at City Hall (BG02):** Public corridor from ff-044 line; cool blue-grey walls, cream counter, brick red printer sign. No November or post-May-17 props.

ff-044 is 8977x720, about 12.47:1. Recompose selected architectural motifs into
a new 16:9 public workspace, not a stretch or automatic center crop. Remove old
marks and reconstruct search surfaces; verify all six placements before export.

| ID | Placement |
| --- | --- |
| S02.O1-O2 | Jammed printer trays |
| S02.O3, O6 | Binder spine (H02); table-centre H01 folder |
| S02.O4-O5 | Cabinet public label; visitor bell |

**S03 We're Going With WHAT? (BG01 evening):** Same room, warmer amber, rearranged desks, cable clutter, caution-taped chair.

| ID | Placement |
| --- | --- |
| S03.O1-O2 | Source log; H02 denial notes |
| S03.O3-O4 | Word magnets; layout grid on monitor |
| S03.O5-O6 | Floor pun napkin; legal stamp on clipboard |

## Shell

**Title/menu:** Simplified night skyline; Haps window neon. **HUD:** objective, targets, hints, notebook, pause; found vs corroborated distinct. **Loading:** neutral silhouette placeholder; **no fake progress**. On failure: asset error, retry, back to title. **Credits:** Ford Frenzy, jr42 productions, fictional cast, H acknowledgements, content policy, play again.

## Proposed budgets (not measured)

WebP backgrounds, PNG alpha sprites; sizes per renderer #40, no 2048-only assumption.

| Group | RGBA8 texture arithmetic, no mipmaps | Transfer target, not measured |
| --- | --- | --- |
| Three separate 2560x1440 backgrounds | 42.19 MiB if all resident; 14.06 MiB each | 2.3-3.7 MB |
| 18 object sprites | Pending dimensions/atlas packing | 0.8-1.6 MB |
| Title/menu, HUD, loading, error, credits | Text/CSS or renderer primitives plus reused background; extra textures pending inventory | Pending export |

RGBA8 bytes = width x height x 4; full mip chains increase the background estimate
to about 56.25 MiB. Compressed GPU formats are not assumed. Stream scene textures
and release prior assets where replay/navigation permits; simultaneous residency
must be measured in #40. Transfer is the sum of actual encoded file bytes after
export, decoded residency includes textures/atlases/mipmaps, and process memory
also includes decode buffers. Do not sum these unlike measurements as one budget.

## Gates

Owner review: (1) flat concept mockup; (2) editable HTML presentation. Not pipeline proof (#104). **#104 blocked** until visual sign-off. Release art is #17. No finished art or gameplay claimed.

## Review checkpoint

Open the [visual presentation](art/visual-direction-01/index.html) for scene/HUD and
title views, or inspect the [concept image](art/visual-direction-01/newsroom-concept.png).
Input hashes, exact prompt, output hash/dimensions and limits are in
[generation.json](art/visual-direction-01/generation.json). This first concept uses
ff-075, ff-022 and ff-037; ff-044 is reserved for S02, not used in this generation.

The generated 1672x941 flat image conveys mood and characters. Props are easier to
spot than final hidden targets, some occlusion differs from the boards, and small
page marks are not source text. These are production tasks, not claims of finished
S01 artwork. The HTML review controls switch two mockups; they do not run a game.
Desktop and 390px views were inspected; both switches and page overflow were checked.
