# Ford Frenzy: Toronto investigative hidden-object adventure

Status: product direction accepted by the owner. The game title **Ford Frenzy** is
confirmed. Revision 2 scene treatments and campaign structure have
[owner storyboard approval](storyboards/approval.md). This does not approve visual
assets or claim implemented gameplay.

This replaces Journey as the first game.

## Names and branding

**Game title:** Ford Frenzy (owner confirmed; not provisional).

**Production brand:** jr42 productions (exact lowercase spelling) on title screens,
start screens, credits and loading presentation for Ford Frenzy and future games
from this production line.

**Repository and framework:** Minoo remains the engine and framework name. Package
scopes, runtime APIs and repository identity are unchanged. The `games/journey` legacy
fixture and optional Studio contracts stay as documented elsewhere.

These presentation screens are not implemented. When built, they must follow:

| Surface | Requirements |
|---|---|
| Title/start screen | Display **Ford Frenzy** as the primary game title and **jr42 productions** as the production credit. Visual treatment follows art direction in [#94](https://github.com/jonesrussell/minoo-game-engine/issues/94). Release-quality title and supporting assets are delivered through [#17](https://github.com/jonesrussell/minoo-game-engine/issues/17). |
| Credits | Include **jr42 productions** as the production credit line. List content, source and rights acknowledgements separately per [content policy](content-policy.md). |
| Loading presentation | Show **Ford Frenzy** where a game title appears during load. Include **jr42 productions** where production branding is appropriate. Use approved assets from [#17](https://github.com/jonesrussell/minoo-game-engine/issues/17). Loading behavior follows asset manifest work in [#37](https://github.com/jonesrussell/minoo-game-engine/issues/37). |

## Player experience

Play a fictional investigative journalist at the fictional Toronna Haps local paper
during Rob Ford's mayoral tenure, with the 2013 crack-video scandal as the central
historical backdrop. The Haps competes with worldwide media while its editor tries
to keep a tiny newsroom functioning. Satire is a core story mode: broken gear,
absurd deadline fixes and a fog-machine election broadcast are fictional comic
beats around sourced public chronology. June's Journey is a reference for
illustrated hidden-object scenes, narrative reveals and chapter progression. Create
original story, art and UI.

Loop: receive an assignment -> search a detailed scene -> inspect leads -> compare
sources and chronology -> choose a supported account -> editorial review -> next scene.
Finding an object is not the same as proving a claim. Some finds provide context;
others unlock a question or a source to check. An unsupported draft returns to review.

The game is a browser-first 2D game built on a proper rendering engine, frame loop,
drawing/sprites, asset loading and transitions. Minoo owns authoritative simulation,
content contracts, investigation state and replay. HTML controls may provide menus
and accessibility, but HTML/SVG alone is not the selected product direction. #40 must
compare rendering engines, including PixiJS and the implications of potential 3D.
Do not promise that a 2D renderer or schema automatically supports 3D.

## Opening slice: three proposed scenes

A proposed opening episode takes place around the first public reports in May 2013.
The research task determines exact dates and what the player could know at each point.
Six findable targets per scene are a prototype budget, not a framework limit.

| Scene | Search and story beat | Investigation outcome |
|---|---|---|
| S01: Welcome to the Haps | May 17, 2013. Search takeout, invoices and broken newsroom gear; assemble the charger for the recorder and separate a published report from office rumour. | Keep source status visible while the editor assigns the next check. |
| S02: Meanwhile at City Hall | May 17, 2013. Search a public corridor work area for a jammed printer, press kit, dated public material and filing tools. No November crowds appear in May. | Build a May 16 to May 17 timeline without upgrading an allegation or importing later events. |
| S03: We're Going With WHAT? | May 17, 2013. Beat the layout deadline with headline pieces, source log, response notes, corrections and a silly but accurate Haps page. | File a sourced short account, retain uncertainty and complete the opening episode after editorial review. |

These are staged gameplay props and fictional interactions. Specific documents,
quotations and representations of real people require a source record before use.
No private meeting or dialogue involving a real person is established by this outline.

Slice acceptance: three linked scenes; a notebook retaining leads and source status;
bounded hints; one progression award per scene; save/reload/reset and deterministic
replay across transitions; pointer/touch/keyboard play; understandable asset failure;
a playable local build and owner review. Score measures finds, not factual certainty.

## Entire-game storyboard work

The [approved campaign storyboard](storyboards/campaign.md) specifies six chapters
with eighteen shared scenes, plus two binary assignment forks and four route scenes.
The authored target is 22 scenes, 88 gameplay panels and 132 unique finds. A run
plays 20 scenes, 80 panels and 120 finds. Play runs from 17 May 2013 through 30
October 2014, with optional dated background and closing cards. Two fictional
newsroom endings preserve the real outcomes. Storyboard approval is complete; only
S01-S03 are committed to first production.

Read the [full scene boards](storyboards/full-game.md),
[opening implementation handoff](storyboards/opening-handoff.md) and
[historical ledger](research/ford-frenzy-history.md). These are text storyboards
with numbered panels and asset briefs, not finished illustrated artwork or gameplay.

Then storyboard every planned scene with a stable ID, chronological placement,
player objective, establishing composition, findable-object list, evidence links,
dialogue beats, entry/exit conditions, transitions, hint behavior, asset list and
source/fiction classification. Include the complete clue dependency graph and ending.
Mark panels draft/reviewed/approved and record unresolved research instead of filling
it with invented fact. This is full-campaign design work, not a commitment to produce
all finished art or implement the full campaign before the opening slice.

The first three scene boards depend on the campaign outline and opening-period
research. They do not wait for all later scene boards or final campaign assets.

## Historical and creative records

Keep separate event date, publication date, source URL/location, claim, attribution,
uncertainty, rights status and review status. Distinguish established public fact,
attributed contemporary allegation and original fiction. Avoid hindsight: facts
published later cannot appear in an earlier scene without an explicit time jump.
The playable journalist, editor and newsroom are fictional by default. Historical
public figures may appear through sourced public events; exact portrayal is a
storyboard decision. The player's story does not erase the work of real reporters.

Initial research anchors, verified September 7, 2026:

- [Wooga's June's Journey overview](https://www.wooga.com/junes-journey) establishes
  the hidden-object/narrative reference, not a license to reproduce its content.
- [Canadian Press chronology, November 5, 2013](https://toronto.citynews.ca/2013/11/05/a-history-of-denials-in-toronto-mayor-rob-fords-alleged-crack-video-scandal/)
  places initial reports on May 16, police confirmation on October 31, and Ford's
  public admission on November 5. Use it as a starting index to original reporting.
- [Toronto Integrity Commissioner report, December 5, 2013](https://www.toronto.ca/legdocs/mmis/2013/cc/bgrd/backgroundfile-64720.pdf)
  records Council's November 13 motion and subsequent accountability discussion.
  Quoted allegations and Council statements are attributed records, not blanket
  findings establishing every claim.

## Existing implementation and limits

Keep the independent runtime/replay and their completed evidence. The existing
`games/journey` shell and Journey Studio example remain legacy engineering fixtures.
They are not the new game's implementation. Do not rename working packages in this
planning change or force evidence into `vocabularyId`. A versioned content-reference
contract and investigation progression task precede production scene implementation.

Journey language learning is deferred. Matcher remains a later conformance game.
Studio integration stays optional and must not block standalone development or the
Studio private MVP. No monetization/energy system, full campaign production, native
export or 3D implementation is committed by this first slice.

[Asset-to-playable SDD plan](ford-frenzy-delivery.md) tracks source artwork, generation, screens, HUD and opening-scene delivery.
