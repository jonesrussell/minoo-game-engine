# Ford Frenzy: full-game scene storyboards

Status: **DRAFT** on every scene and panel. Owner review pending.
Game: Ford Frenzy by **jr42 productions**. Issue: #92.
Cast roles in dialogue: **Journalist Alex Chen** (player), **Editor Elliot Vance**, **Photographer Priya D'Souza**, **Community contact Tomás Reyes**; recurring **Copy chief Nadia Okafor** and **Intern Sasha Bell**.

This document is a text storyboard, not final illustrated art. Historical pointers H00-H14 are reference labels only; exact sourcing is parent-verified via [historical ledger](../research/ford-frenzy-history.md).

## Document conventions

- **Evidence** finds support a sourced claim in the notebook. **Context** finds orient the player in time, place or civic stakes. **Tool** finds unlock inspect/compare UI or ordering mechanics. Historical evidence points to H claims; fictional interview notes only support fictional character concerns. Tools, assignments, drafts and checklists are not independent corroboration. Finding a prop never upgrades a historical claim by itself.
- Props are **original fiction** summarizing public records; they are never forged facsimiles of real documents.
- The original 2013 video is **unavailable to the player** in 2013 scenes; no find grants scoop footage or implies the player broke the story.
- Player authors **attributed coverage**; real reporters, arrests, votes and elections remain outside player responsibility.

## Common scene contract

All scenes inherit FF-SCN-001, FF-SAVE-001 and FF-UI-002 behavior:

| Control | Behavior |
| --- | --- |
| Entry | Prior scene completion (or New Game for S01); notebook and branch metadata carry forward once. |
| Exit | Six unique finds (Sxx.O1-O6) plus correct editorial answer; awards Kxx once. |
| Hints | Three optional rings per scene highlight unfound targets. Free editorial explanations are separate and always available when reviewing a draft. |
| Resume | Atomic save stores scene ID, found set, hint count, notebook, branch IDs and retry count together; failed writes leave the last complete save intact. |
| Reset | Reset clears only the uncompleted current scene, preserving earlier K outputs; campaign reset requires confirmation. |
| Retry | Wrong editorial answer shows Editor feedback, returns to Sxx.P3; no permanent failure; unlimited retries. |
| Tutorial | Generic tutorial inherited from opening; each scene adds **sceneObjectiveAnswerHint** string in panel Sxx.P2. |
| Replay | Chapter replay is a separate fork and cannot alter the campaign branch; duplicate find input ignored. |
| Input | Keyboard Tab/Enter and an accessible list mirror pointer interactions; no forced drag. Proposed hit areas are at least 44 CSS pixels at the rendered viewport scale; #41 verifies scaling. Reduced-motion mode removes movement only; no mode uses a hard timer. |

No hard countdown is used. At chapter boundaries the K award, branch choice and next-scene state commit atomically. All gameplay behavior below is proposed, not implemented. Each scene preserves all earlier K outputs; listed dependencies identify the minimum relevant inputs.

## Historical reference index (pointers only)

| ID | Label | Campaign use |
| --- | --- | --- |
| H00 | 2010 backstory | Mayor takes office; baseline civic context in title/card copy only |
| H01 | Initial reports | Evening May 16 2013 reporting begins; player cannot see original video |
| H02 | May 17 denial | May 17 2013 deadline desk backdrop |
| H03 | May 24 denial | Chapter 2 denial beat |
| H04 | Oct 31 police recovery statement | Chapter 3 announcement |
| H05 | Nov 5 admission | Chapter 4 breaking beat |
| H06 | Nov 13 council request leave | Council gallery context |
| H07 | Nov 15 powers | Powers transition notes |
| H08 | Nov 18 powers | Changed responsibilities explainer |
| H09 | Apr 30 leave | Leave announcement |
| H10 | June 30 return | Return briefing |
| H11 | Sep 12 candidate switch | Candidate change scene |
| H12 | Oct 27 election | Preliminary results night |
| H13 | Oct 30 certification | Certified results retrospective |
| H14 | Dec 1 term transition | Optional dated closing card after S18 |

## Notebook output graph (K01-K18)

```
S01 -> K01 -> S02 -> K02 -> S03 -> K03 -> BR-CH1
 -> S04 -> K04 -> S05 -> K05 -> S06 -> K06 -> BR-CH2
 -> S07 -> K07 -> S08 -> K08 -> S09 -> K09 -> BR-CH3
 -> S10 -> K10 -> S11 -> K11 -> S12 -> K12 -> BR-CH4
 -> S13 -> K13 -> S14 -> K14 -> S15 -> K15 -> BR-CH5
 -> S16 -> K16 -> S17 -> K17 -> S18 -> K18 -> BR-CH6 -> END-A or END-B
```

| Output | Scene | Summary |
| --- | --- | --- |
| K01 | S01 | Assignment triage: published report vs unverified lead vs follow-up question |
| K02 | S02 | Public records timeline; what City Hall materials do and do not show |
| K03 | S03 | Sourced short account with explicit uncertainty (H01/H02) |
| K04 | S04 | Denial framing checklist (H03) |
| K05 | S05 | Community concern map (fictional cafe, diverse civic stakes) |
| K06 | S06 | Source audit matrix for summer verification |
| K07 | S07 | Archive retrieval log (after H04) |
| K08 | S08 | Police statement summary pointer (H04) |
| K09 | S09 | Verification deadline package |
| K10 | S10 | Admission coverage draft (H05) |
| K11 | S11 | Council gallery session notes (H06) |
| K12 | S12 | Powers and responsibilities explainer (H07/H08) |
| K13 | S13 | Leave announcement coverage (H09) |
| K14 | S14 | Civic service reporting while mayor away |
| K15 | S15 | Return briefing (H10) |
| K16 | S16 | Candidate switch timeline (H11) |
| K17 | S17 | Preliminary results table (H12) |
| K18 | S18 | Certified retrospective byline (H13); resolves final branch and ending |

## Chapter-ending branches (converge next chapter)

| After | Branch A | Branch B | Effect (fiction only) |
| --- | --- | --- | --- |
| S03 | BR-CH1-A speed | BR-CH1-B caution | Fictional byline emphasis; both enter S04 |
| S06 | BR-CH2-A community | BR-CH2-B audit | Fictional notebook emphasis; both enter S07 |
| S09 | BR-CH3-A archive depth | BR-CH3-B clarity | Fictional reflection; both enter S10 |
| S12 | BR-CH4-A breaking tone | BR-CH4-B accountability | Fictional sidebar; both enter S13 |
| S15 | BR-CH5-A service | BR-CH5-B responsibilities | Fictional quote box; both enter S16 |
| S18 | BR-CH6-A ward | BR-CH6-B citywide | Fictional closing emphasis; both resolve at S18 |

---

## Title sequence (DRAFT)

**Composition:** Night Toronto skyline silhouette; foreground newsroom window glow; midground CN Tower and council dome simplified shapes; background indigo gradient with slow parallax cloud layer.

**Camera/light:** Wide static; warm interior key against cool exterior; subtle flicker on window sign "Late Edition."

**Beat:** Logo card **Ford Frenzy**; subline **jr42 productions**; disclaimer line "A fictional newsroom story set around documented public events."

**Audio:** Optional muted typewriter tick (FF-AUD-001).

**Transition:** Fade to main menu or New Game to S01.

---

## Chapter 1 card (DRAFT): "First reports"

**Dates:** May 17 2013 (H01/H02). Text card over blurred assignment desk bokeh.

**Copy:** "Reports begin. The video stays off-screen. Your job is what can be written with what exists tonight."

**Transition:** Hard cut to S01.P1.

---

### S01: The assignment desk (DRAFT)

**Chapter:** 1 | **Historical:** H01/H02 | **Date:** May 17, 2013 | **Play pattern:** shape search (desk clutter silhouettes)
**Entry:** New Game or Continue at S01 | **Exit:** K01 + correct editorial answer to S02
**sceneObjectiveAnswerHint:** "Separate what ran, what is still a lead, and what you must ask before deadline."

#### S01.P1 Establish and arrival (DRAFT)

**Fictional character beat:** Alex has rent due and hopes this assignment will become regular work. Elliot offers responsibility before reassurance.

Foreground: coffee ring, sticky notes, pen cup. Midground: Alex's chair, one monitor dimmed. Background: BG01 newsroom bay, other desks dark. Camera: over-shoulder medium. Light: practical desk lamp, cool monitor spill. Beat: Elliot drops folder; urgency without panic.

#### S01.P2 Interactive search (DRAFT)

Search composition: L-shaped desk plus side table. Player scans for six distinct silhouettes. Hint rings pulse on unfound objects.

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S01.O1 | Spiral reporter notebook | Left desk, open | tool |
| S01.O2 | Contact sheet printout | Under keyboard | context |
| S01.O3 | Wall calendar May 2013 circled | Background corkboard | context |
| S01.O4 | Assignment folder tab "Crack allegation" | Center desk | tool |
| S01.O5 | Published report clipping summary card | Monitor stand | evidence |
| S01.O6 | Digital recorder on charger | Side table | tool |

#### S01.P3 Inspect and compare (DRAFT)

Closeup split: O4 assignment brief vs O5 published summary. Compare UI highlights date lines and attribution labels. Player tags O5 as "published report" and O4 as "unverified lead channel."

#### S01.P4 Editorial outcome and exit (DRAFT)

Editor dialogue (fiction): "We print what we can stand behind. Tag the lead before you chase it."

Journalist dialogue (fiction): "The clipping is public. The folder is still a question mark."

**Player question:** What must the first follow-up question test?

| Answer | Result |
| --- | --- |
| Correct: "Whether any on-record source confirms the allegation" | K01 awarded; continue to S02 |
| Retry: "Whether repeating the report means our desk has independently verified it" | Editor: "We do not have the video. Retry." |

**Asset brief:** BG01 newsroom. Create this base as original art. Export all six listed objects as separate new sprite layers plus readable UI text overlays. No recovered logo used as furniture or texture.

**Dependencies:** none | **Output:** K01

---

### S02: Public City Hall records workspace (DRAFT)

**Chapter:** 1 | **Historical:** H01/H02 | **Date:** May 17, 2013 | **Play pattern:** date ordering on public agenda strips
**Entry:** K01 retained | **Exit:** K02 to S03
**sceneObjectiveAnswerHint:** "Order public dates before you infer private conduct."

#### S02.P1 Establish and arrival (DRAFT)

**Fictional character beat:** The quiet reading area makes Alex feel behind the other desks. The useful discovery is the limit of the record, not a sensational object.

Foreground: visitor counter bell, laminate map. Midground: public research table with fictional "City Hall Public Search" sign. Background: simplified atrium arches (original art). Camera: slight high angle. Light: fluorescent even. Beat: calm institutional tone vs S01 urgency.

#### S02.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S02.O1 | Fictional newsroom visit schedule for May 17 | Tray left | context |
| S02.O2 | Press schedule card | Bulletin board | context |
| S02.O3 | May 17 denial summary H02 | Binder spine | evidence |
| S02.O4 | Filing label drawer tab "Mayor office" | Cabinet | tool |
| S02.O5 | Phone directory plaque | Wall | tool |
| S02.O6 | May 16 reporting summary folder H01 | Table center | evidence |

#### S02.P3 Inspect and compare (DRAFT)

Order O6 (May 16 reports) before O3 (May 17 denial); place O1 separately as a fictional work schedule, not evidence about Ford. Select-and-place is equivalent to drag. The resulting timeline shows publication and response, not proof of private conduct.

#### S02.P4 Editorial outcome and exit (DRAFT)

Editor: "Records show schedules, not secrets."

Journalist: "The gap is the story we can honestly write."

**Player question:** What do these public records establish?

| Answer | Result |
| --- | --- |
| Correct: "The order of the reports and public response, not independent proof of drug use" | K02 |
| Retry: "Proof the allegation is true" | Editor retry |

**Asset brief:** BG02 City Hall reading area. Adapt ff-044 as a composition reference only, reconstruct for close search. Export all six listed objects as separate new sprite layers plus readable UI text overlays. No recovered logo used as furniture or texture.

**Dependencies:** K01 | **Output:** K02

---

### S03: Deadline desk May 17 2013 (DRAFT)

**Chapter:** 1 | **Historical:** H01/H02 | **Date:** May 17, 2013 evening (fictional deadline) | **Play pattern:** source comparison + caption pairing
**Entry:** K01,K02 | **Exit:** K03 to S04; BR-CH1 resolves at S03
**sceneObjectiveAnswerHint:** "Pair each sentence with the source that supports it."

#### S03.P1 Establish and arrival (DRAFT)

**Fictional character beat:** Nadia returns Alex's first lede with one unsupported phrase circled. Correcting it earns another assignment, not humiliation.

Foreground: fictional deadline clock, May 17 evening. Midground: crowded desk, second chair pulled. Background: newsroom brighter, phones visible. Camera: tight over desk. Light: warm tungsten vs blue breaking-news glow on far wall. Beat: ticking deadline; denial reports arriving (H02 pointer text on monitor sticky, not quoted as fact).

#### S03.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S03.O1 | Source log booklet | Desk left | evidence |
| S03.O2 | Response notes pad | Center | context |
| S03.O3 | Corrections sheet | Clipboard | tool |
| S03.O4 | Caption draft sticky pair | Monitor bezel | tool |
| S03.O5 | Chronology ribbon cards | Desk right fan | tool |
| S03.O6 | Editorial checklist | Wall side clip | context |

#### S03.P3 Inspect and compare (DRAFT)

Pair O4 caption lines to O1 source log rows; flag one sentence as unsupported; retain uncertainty field on K03 draft preview.

#### S03.P4 Editorial outcome and exit (DRAFT)

Editor: "If the denial is on record, say so. Do not imply we watched anything we did not."

Journalist: "Short account, visible uncertainty, ask for corroboration."

**Player question:** Which line belongs in the supported draft?

| Answer | Result |
| --- | --- |
| Correct: "Reports allege; mayor denies on record; video not verified by this desk" | K03 + BR-CH1-A/B pick |
| Retry: "Our desk independently verified the reported video" | Editor retry |

**Asset brief:** BG01 newsroom, evening variant. Reuse the named original base with new lighting and layout. Export all six listed objects as separate new sprite layers plus readable UI text overlays. No recovered logo used as furniture or texture.

**Dependencies:** K01,K02,H01,H02 | **Output:** K03

---

## Chapter 2 card (DRAFT): "Denial and summer verification"

**Dates:** May 24 2013 onward (H03). Copy: "Denials repeat. Verification slows in heat."

**Transition:** S04.P1

---

### S04: Press preparation (DRAFT)

**Chapter:** 2 | **Historical:** H03 | **Date:** May 24, 2013 after the public denial | **Play pattern:** caption pairing for denial framing
**sceneObjectiveAnswerHint:** "Pair the dated denial with the wording it actually supports."
**Entry:** K03 + BR-CH1-A/B | **Exit:** K04

#### S04.P1 (DRAFT)

**Fictional character beat:** Priya refuses an exaggerated caption. Alex chooses a fair account and their working partnership begins.

Foreground: teleprompter glass. Midground: prep table with index cards. Background: BG03 briefing room studio door. Camera: low side. Light: studio fill. Beat: Professional calm; prepare questions without ambush fantasy.

#### S04.P2 finds (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S04.O1 | Question card deck | Table fan | tool |
| S04.O2 | May 24 denial summary card | Clipboard | evidence |
| S04.O3 | Microphone windscreen | Chair arm | context |
| S04.O4 | Legal caution sticky | Glass edge | context |
| S04.O5 | Photographer lens cap | Table corner | tool |
| S04.O6 | Run-of-show sheet | Tablet prop | tool |

#### S04.P3 (DRAFT)

Match O2 denial summary to O6 run-of-show beats; mark "on-record denial" vs "unverified allegation repeat."

#### S04.P4 (DRAFT)

Editor: "Ask what he denies, not what we wish we had."

Photographer: "I shoot the room, not a reenactment."

**Question:** May 24 coverage should lead with?

| Answer | Copy |
| --- | --- |
| Correct | "On-record denial of specific allegation" |
| Retry | "The denial independently disproves the allegation" |

**Asset brief:** BG03 briefing preparation room. Create this base as original art. Export all six listed objects as separate new sprite layers plus readable UI text overlays. No recovered logo used as furniture or texture.

**Dependencies:** K03,H03 | **Output:** K04

---

### S05: Harbourview cafe (DRAFT)

**Chapter:** 2 | **Play pattern:** spatial map of civic concerns (fiction)
**Historical:** none; **Date:** June 8, 2013 (fictional newsroom chronology)
**sceneObjectiveAnswerHint:** "Keep fictional community concerns separate from evidence about the allegation."

#### S05.P1 (DRAFT)

**Fictional character beat:** Tomás asks why the paper only visits when there is a scandal. Alex promises a small follow-up the newsroom can actually deliver.

Foreground: condiment tray. Midground: Community contact booth, bulletin board. Background: street window, diverse patrons silhouettes. Camera: eye-level two-shot space. Light: afternoon sun stripes. Beat: Humane satire; transit, parks, trust in office, not criminal caricature.

#### S05.P2 finds (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S05.O1 | Hand-drawn neighborhood map | Wall | tool |
| S05.O2 | Transit complaint flyer | Board pin | context |
| S05.O3 | Quote notebook page | Booth seat | evidence |
| S05.O4 | Recorder with consent card | Table | tool |
| S05.O5 | Photo print street festival | Window ledge | context |
| S05.O6 | Sticky note cluster "what we need from city hall" | Map margin | evidence |

#### S05.P3 (DRAFT)

Place O2,O3,O6 pins on O1 map layers (services, trust, accountability).

#### S05.P4 (DRAFT)

Community contact: "We are tired of punchlines. Write that the job still matters."

Journalist: "Your concerns go in the notebook, not a caricature."

**Question:** Cafe scene supports which notebook entry?

| Answer | Copy |
| --- | --- |
| Correct | "Civic stakes beyond scandal headline" |
| Retry | "These fictional comments establish what every Toronto resident believes" |

**Asset brief:** BG04 Harbourview cafe. Create this base as original art. Export all six listed objects as separate new sprite layers plus readable UI text overlays. No recovered logo used as furniture or texture.

**Dependencies:** K04 | **Output:** K05

---

### S06: Newsroom source audit (DRAFT)

**Chapter:** 2 | **Date:** Aug 30, 2013 (fictional newsroom chronology) | **Play pattern:** source comparison matrix
**sceneObjectiveAnswerHint:** "Mark what still needs independent corroboration before publication."
**Entry:** K04,K05 | **Exit:** K06 to S07; BR-CH2 resolves at S06

#### S06.P1 (DRAFT)

**Fictional character beat:** Sasha brings two copies of the same story as separate sources. Alex recognizes an earlier mistake and teaches the distinction kindly.

Foreground: audit printouts. Midground: four-chair huddle. Background: evidence wall with yarn (fiction). Camera: wide. Light: late summer evening. Beat: Methodical doubt.

#### S06.P2 finds (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S06.O1 | Source grid whiteboard | Wall center | tool |
| S06.O2 | Summer tip email printout summary | Desk | context |
| S06.O3 | Corroboration checklist | Clipboard | tool |
| S06.O4 | Photographer contact sheet | Pin board | context |
| S06.O5 | May 24 denial summary H03 | Monitor | evidence |
| S06.O6 | Redaction marker | Cup | tool |

#### S06.P3 (DRAFT)

Fill O1 grid: assign O3 checkmarks to sources with dates; cross out single-anonymous column.

#### S06.P4 (DRAFT)

Editor: "Audit before amplify."

Journalist: "Two copies of one report still give us only one source."

**Question:** Summer audit status?

| Answer | Copy |
| --- | --- |
| Correct | "Allegation remains attributed, not verified" |
| Retry | "Two copies of one article count as independent corroboration" |

**Asset brief:** BG01 newsroom, summer audit variant. Reuse the named original base with new lighting and layout. Export all six listed objects as separate new sprite layers plus readable UI text overlays. No recovered logo used as furniture or texture.

**Dependencies:** K04,K05,H03 | **Output:** K06

---

## Chapter 3 card (DRAFT): "October announcement"

**Dates:** Oct 31 2013 (H04). Copy: "Police speak. The room changes tone."

**Transition:** S07.P1

---

### S07: Archive retrieval (DRAFT)

**Play pattern:** shape search in stacks | **Historical:** H04 | **Date:** Oct 31, 2013 after the public announcement
**sceneObjectiveAnswerHint:** "Open the dated public advisory summary; do not unlock unseen footage."

#### S07.P1 (DRAFT)

**Fictional character beat:** The old notebook is now useful. Alex retrieves careful May notes while the newsroom rushes around them.

Foreground: rolling cart. Midground: labeled boxes "2013-Q2". Background: archive shelves. Camera: aisle one-point. Light: cool overhead. Beat: Anticipation without spoiling H04 wording.

#### S07.P2 finds (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S07.O1 | Box label Oct timeline | Shelf B | context |
| S07.O2 | Retrieval slip signed | Cart clip | tool |
| S07.O3 | Microfilm reader | Table | tool |
| S07.O4 | Prior tip index card | Box flap | context |
| S07.O5 | Newsroom source-handling checklist | Cart | tool |
| S07.O6 | Envelope of newsroom notes on the public announcement H04 | Top box | evidence |

#### S07.P3 (DRAFT)

Open O6 envelope summary (fiction summary card pointing to H04 slot, not forged PDF).

#### S07.P4 (DRAFT)

Editor: "Retrieve, do not invent."

Journalist: "We log what arrives, not what we hope."

**Question:** Archive scene establishes?

| Answer | Copy |
| --- | --- |
| Correct | "Materials ready for statement comparison" |
| Retry | "A newsroom retrieval slip independently authenticates the video" |

**Asset brief:** BG01 newsroom archive alcove. Reuse the named original base with new lighting and layout. Export all six listed objects as separate new sprite layers plus readable UI text overlays. No recovered logo used as furniture or texture.

**Dependencies:** K06 | **Output:** K07

---

### S08: Public briefing desk (DRAFT)

**Play pattern:** authority comparison (police summary vs prior denials)
**Historical:** H04 | **Date:** Oct 31, 2013 after the public announcement
**sceneObjectiveAnswerHint:** "Attribute the police announcement and preserve what remains unknown."

#### S08.P1 (DRAFT)

**Fictional character beat:** Elliot wants a clear headline fast. Priya helps Alex keep the important limitation visible rather than burying it.

Foreground: notepad. Midground: briefing desk with "Public Statement" placard. Background: silhouette crowd. Camera: frontal medium. Light: harsh press flash freeze-frame style. Beat: Gravity; still no video playable.

#### S08.P2 finds (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S08.O1 | H04 summary card on lectern | Center | evidence |
| S08.O2 | Prior denial timeline strip | Left | context |
| S08.O3 | Audio feed patch bay | Edge | tool |
| S08.O4 | Photographer long lens | Rail | context |
| S08.O5 | Quote approval tick box sheet | Right | tool |
| S08.O6 | Public broadcast clock | Wall | context |

#### S08.P3 (DRAFT)

Align O1 bullet phrases against O2 denial dates; highlight contradiction without inventing quotes.

#### S08.P4 (DRAFT)

Editor: "Attribute to the statement."

Photographer: "Use our room sketch as an illustration. Label it clearly."

**Question:** Headline supported tonight?

| Answer | Copy |
| --- | --- |
| Correct | "Police report recovering a video consistent with prior media descriptions H04" (summary pointer) |
| Retry | "Police recovery means the original video is publicly available" |

**Asset brief:** BG03 briefing room, police-summary variant. Reuse the named original base with new lighting and layout. Export all six listed objects as separate new sprite layers plus readable UI text overlays. No recovered logo used as furniture or texture.

**Dependencies:** K07,H04 | **Output:** K08

---

### S09: Verification deadline (DRAFT)

**Chapter:** 3 | **Historical:** H04 | **Date:** Oct 31, 2013 after the public announcement | **Play pattern:** date ordering + checklist convergence
**Entry:** K07,K08 | **Exit:** K09 to S10; BR-CH3 resolves at S09
**sceneObjectiveAnswerHint:** "Order tonight's statement against the last denial before you file."

#### S09.P1 Establish and arrival (DRAFT)

**Fictional character beat:** The desk publishes a useful update with unknowns intact. Alex is now the colleague Sasha asks for help.

Foreground: coffee timer ticking. Midground: BG01 newsroom, October variant with the reused S03 desk variant and Oct 31 sticky notes. Background: distant generic silhouettes. Camera: over-shoulder matching S03 for visual continuity. Light: mixed warm desk and cold October rain on window. Beat: Exhaustion with clarity; still no playable video.

#### S09.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S09.O1 | Verification binder clip | Desk center stack | evidence |
| S09.O2 | Chronology tile strips | Left fan | tool |
| S09.O3 | Editor marked draft printout | Monitor side | evidence |
| S09.O4 | Tip line call log summary | Phone base | context |
| S09.O5 | Court docket public page summary card | Clipboard rear | context |
| S09.O6 | Coffee timer dial | Foreground corner | tool |

#### S09.P3 Inspect and compare (DRAFT)

Order O2 tiles: last May denial, summer audit pause, Oct 31 statement slot. Checklist on O1 binder must include O3 draft with "unknowns" field populated.

#### S09.P4 Editorial outcome and exit (DRAFT)

Editor: "Deadline with discipline."

Journalist: "Publish the delta, not the fantasy."

**Player question:** What belongs in tonight's filed package?

| Answer | Result |
| --- | --- |
| Correct: "Statement summary, denial timeline, explicit unknowns" | K09 + BR-CH3-A/B pick |
| Retry: "Original video file attachment" | Editor: "We still do not have it." |

**Asset brief:** BG01 newsroom, October deadline variant. Reuse the named original base with new lighting and layout. Export all six listed objects as separate new sprite layers plus readable UI text overlays. No recovered logo used as furniture or texture.

**Dependencies:** K07,K08,H04 | **Output:** K09

---

## Chapter 4 card (DRAFT): "Admission and council"

**Dates:** Nov 5 through Nov 18 2013 (H05-H08). Copy: "On-record shifts. Council responds."

**Transition:** S10.P1

---

### S10: Newsroom breaking news (DRAFT)

**Chapter:** 4 | **Historical:** H05 | **Date:** Nov 5, 2013 | **Play pattern:** caption pairing under time pressure
**Entry:** K09 + BR-CH3-A/B | **Exit:** K10 to S11
**sceneObjectiveAnswerHint:** "Compare the new admission with earlier dated denials; retain both in the record."

#### S10.P1 Establish and arrival (DRAFT)

**Fictional character beat:** There is no victory lap. Alex must preserve the earlier reporting record while covering a major change in public knowledge.

Foreground: ringing phone light. Midground: BG01 newsroom with November alert lighting. Background: generic blurred runners. Camera: handheld slight sway. Light: red alert practicals. Beat: Controlled chaos; player writes, does not gloat.

#### S10.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S10.O1 | Breaking banner template strip | Top monitor | tool |
| S10.O2 | Admission summary card H05 | Desk center | evidence |
| S10.O3 | Rewrite sticky stack | Keyboard side | context |
| S10.O4 | Live blog monitor frame | Right monitor | tool |
| S10.O5 | Prior denial printout | Left clip | evidence |
| S10.O6 | Headset on hook | Desk edge | context |

#### S10.P3 Inspect and compare (DRAFT)

Drag O2 summary bullets to O5 denial rows; mark the new claim without erasing the earlier dated record; forbid inserting unsourced private detail.

#### S10.P4 Editorial outcome and exit (DRAFT)

Editor: "This is on record now."

Journalist: "We document the change, not the private night."

**Player question:** Supported breaking lead?

| Answer | Result |
| --- | --- |
| Correct: "Ford publicly says he has smoked crack cocaine (H05); preserve the earlier denial as history" | K10 |
| Retry: "The player proved Ford was lying" | Editor retry |

**Asset brief:** BG01 newsroom, November alert variant. Reuse the named original base with new lighting and layout. Export all six listed objects as separate new sprite layers plus readable UI text overlays. No recovered logo used as furniture or texture.

**Dependencies:** K09,H05 | **Output:** K10

---

### S11: Public council gallery (DRAFT)

**Chapter:** 4 | **Historical:** H06 | **Date:** Nov 13, 2013 after the council votes | **Play pattern:** fictional newsroom motion-summary sort
**Entry:** K10 | **Exit:** K11 to S12
**sceneObjectiveAnswerHint:** "Sort the public motion summary by request for leave versus removal from office."

#### S11.P1 Establish and arrival (DRAFT)

**Fictional character beat:** The gallery is noisy; Nadia asks Alex to explain the motion so a reader can understand what changed in one glance.

Foreground: gallery rail, folded program. Midground: council chamber simplified semicircle. Background: public overflow screen. Camera: elevated three-quarter. Light: chamber cool spots. Beat: Civic accountability, not trial spectacle.

#### S11.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S11.O1 | Council agenda summary Nov 13 | Program insert | evidence |
| S11.O2 | Seat map placard | Rail clip | tool |
| S11.O3 | Motion category cards: request leave / removal | Reporter table | tool |
| S11.O4 | Leave request motion summary H06 | Agenda tab | evidence |
| S11.O5 | Fictional gallery observation note | Reporter notebook | context |
| S11.O6 | Photographer shot list | Bag tag | tool |

#### S11.P3 Inspect and compare (DRAFT)

Sort O3 into “request leave” and “removal from office,” then link O4 to the Nov 13 agenda summary. O2 is a fictional orientation aid; the player never reaches onto a Clerk desk.

#### S11.P4 Editorial outcome and exit (DRAFT)

Community contact (message print on phone prop): "Gallery is packed for accountability, not spectacle."

Journalist: "We cover the vote, not a trial."

**Player question:** What does Nov 13 coverage document?

| Answer | Result |
| --- | --- |
| Correct: "Council urged a temporary leave; this was a request, not removal (H06)" | K11 |
| Retry: "Council finds guilt" | Editor retry |

**Asset brief:** BG05 public Council gallery. Create this base as original art. Export all six listed objects as separate new sprite layers plus readable UI text overlays. No recovered logo used as furniture or texture.

**Dependencies:** K10,H06 | **Output:** K11

---

### S12: Changed responsibilities explainer (DRAFT)

**Chapter:** 4 | **Historical:** H07,H08 | **Date:** Nov 18, 2013 after the public votes | **Play pattern:** authority comparison powers before/after
**Entry:** K11 | **Exit:** K12 to S13; BR-CH4 resolves at S12
**sceneObjectiveAnswerHint:** "Show which powers moved on which public dates."

#### S12.P1 Establish and arrival (DRAFT)

**Fictional character beat:** Elliot gives the explainer space usually reserved for a splash headline. The team begins trusting Alex with context.

Foreground: highlighter cap. Midground: explainer desk with dual charts. Background: pinned timeline Nov 15-18. Camera: straight-on instructional. Light: even office. Beat: Clarify machinery amid noise.

#### S12.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S12.O1 | Nov 15 powers summary card | Left chart | evidence |
| S12.O2 | Nov 18 powers summary card | Right chart | evidence |
| S12.O3 | Specified-functions flowchart | Center | tool |
| S12.O4 | Editorial sidebar draft | Lower desk | context |
| S12.O5 | Council clerk notice | Pin board | context |
| S12.O6 | Highlighter | Foreground | tool |

#### S12.P3 Inspect and compare (DRAFT)

Highlight deltas between O1 and O2; route only the specified functions through O3. Do not turn the chart into a blanket acting-mayor protocol.

#### S12.P4 Editorial outcome and exit (DRAFT)

Editor: "Explain what moved, not who to mock."

Journalist: "Readers need the machinery."

**Player question:** Accurate explainer core?

| Answer | Result |
| --- | --- |
| Correct: "Council transferred specified responsibilities by dated votes (H07/H08)" | K12 + BR-CH4-A/B pick |
| Retry: "Mayor removed from office" | Editor retry |

**Asset brief:** BG01 newsroom, responsibility-chart variant. Reuse the named original base with new lighting and layout. Export all six listed objects as separate new sprite layers plus readable UI text overlays. No recovered logo used as furniture or texture.

**Dependencies:** K11,H07,H08 | **Output:** K12

---

## Chapter 5 card (DRAFT): "Leave and return"

**Dates:** Apr 30 2014 through June 30 2014 (H09-H10). Copy: "Office continues while the mayor is away."

**Transition:** S13.P1

---

### S13: Leave announcement (DRAFT)

**Chapter:** 5 | **Historical:** H09 | **Date:** May 1, 2014 after the Apr 30 public statement | **Play pattern:** source comparison and humane headline tone
**Entry:** K12 + BR-CH4-A/B | **Exit:** K13 to S14
**sceneObjectiveAnswerHint:** "Compare the public leave statement to its timeline without adding treatment details."

#### S13.P1 Establish and arrival (DRAFT)

**Fictional character beat:** Alex discards a cruel pun before Nadia needs to intervene. The deadline remains real, but the tone is quieter.

Foreground: potted plant on quiet desk. Midground: health beat assignment corner. Background: muted newsroom, fewer red lights. Camera: calm medium. Light: soft morning. Beat: Humane coverage duty.

#### S13.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S13.O1 | Ford public leave statement summary H09 | Desk center | evidence |
| S13.O2 | Leave timeline strip | Wall clip | evidence |
| S13.O3 | Health desk explainer sheet | Folder | context |
| S13.O4 | Assignment calendar Apr 30 | Monitor sticky | tool |
| S13.O5 | Press pool schedule | Side tray | context |
| S13.O6 | Empathetic tone guide card | Drawer front | tool |

#### S13.P3 Inspect and compare (DRAFT)

Align O1 public statement to O2 timeline anchors; apply O6 tone guide to headline preview. No clinic scene or medical record is available.

#### S13.P4 Editorial outcome and exit (DRAFT)

Editor: "No ghoulish wordplay."

Journalist: "Cover the leave statement and its public timeline."

**Player question:** Supported leave coverage?

| Answer | Result |
| --- | --- |
| Correct: "Mayor announces leave from campaigning and duties to seek help (H09)" | K13 |
| Retry: "Seeking help means the mayor has resigned" | Editor retry |

**Asset brief:** BG01 newsroom, spring leave variant. Reuse the named original base with new lighting and layout. Export all six listed objects as separate new sprite layers plus readable UI text overlays. No recovered logo used as furniture or texture.

**Dependencies:** K12,H09 | **Output:** K13

---

### S14: Civic service reporting while mayor away (DRAFT)

**Chapter:** 5 | **Date:** May 8, 2014 (fictional newsroom chronology) | **Play pattern:** spatial map of fictional city-service beats
**Entry:** K13 | **Exit:** K14 to S15
**sceneObjectiveAnswerHint:** "Label each fictional request as a reporting lead, not proof of a citywide fact."

#### S14.P1 Establish and arrival (DRAFT)

**Fictional character beat:** Alex keeps the promise made to Tomás in S05. Priya returns to photograph ordinary community life with permission.

Foreground: push pins. Midground: city map table. Background: window to ordinary street scene. Camera: top-down slight angle. Light: bright spring. Beat: City still runs.

#### S14.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S14.O1 | Garbage route map overlay | Map left | context |
| S14.O2 | Fictional community question about budget hearings | Pin stack | context |
| S14.O3 | Fictional request to cover transit meetings | Map right | context |
| S14.O4 | Community contact library hours tip | Sticky note | context |
| S14.O5 | Photographer parks feature shot list | Camera bag | tool |
| S14.O6 | Service desk phone tree card | Map corner | tool |

#### S14.P3 Inspect and compare (DRAFT)

Pin O2,O3,O4 to map districts; classify each pin as civics beat using O6 phone tree categories.

#### S14.P4 Editorial outcome and exit (DRAFT)

Community contact: "Our questions are still here."

Journalist: "That is the week one story."

**Player question:** Week-one emphasis while mayor away?

| Answer | Result |
| --- | --- |
| Correct: "Separate fictional service requests from the leave report" | K14 |
| Retry: "These fictional requests prove a citywide service fact" | Editor retry |

**Asset brief:** BG06 community desk map table. Create this base as original art. Export all six listed objects as separate new sprite layers plus readable UI text overlays. No recovered logo used as furniture or texture.

**Dependencies:** K13 | **Output:** K14

---

### S15: Return briefing (DRAFT)

**Chapter:** 5 | **Historical:** H10 | **Date:** June 30, 2014 after the public return | **Play pattern:** preliminary plan vs public return statement
**Entry:** K14 | **Exit:** K15 to S16; BR-CH5 resolves at S15
**sceneObjectiveAnswerHint:** "Match return briefing materials to the public June 30 statement."

#### S15.P1 Establish and arrival (DRAFT)

**Fictional character beat:** Elliot asks for a public-duty question, not a personal ambush. Alex prepares one that the available record can support.

Foreground: security cordon tape roll. Midground: briefing table with name tents generic. Background: council media room blank screens. Camera: symmetrical press room. Light: fluorescent neutral. Beat: Transition back to presence without intrusion fantasy.

#### S15.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S15.O1 | June 30 return summary H10 | Table center | evidence |
| S15.O2 | Gate plan diagram | Easel | context |
| S15.O3 | Council briefing pack | Stack | evidence |
| S15.O4 | Schedule whiteboard | Wall | tool |
| S15.O5 | Security cordon map | Floor clip | context |
| S15.O6 | Return Q&A cards | Tray | tool |

#### S15.P3 Inspect and compare (DRAFT)

Match O6 Q&A prompts to O1 summary bullets; discard any question implying private medical detail.

#### S15.P4 Editorial outcome and exit (DRAFT)

Editor: "Return is public fact; recovery is private."

Journalist: "We report the door opening, not the bedroom."

**Player question:** Return briefing covers?

| Answer | Result |
| --- | --- |
| Correct: "Mayor returns per June 30 public statement (H10)" | K15 + BR-CH5-A/B pick |
| Retry: "Returning to the office automatically restores every earlier power" | Editor retry |

**Asset brief:** BG03 briefing room, return variant. Reuse the named original base with new lighting and layout. Export all six listed objects as separate new sprite layers plus readable UI text overlays. No recovered logo used as furniture or texture.

**Dependencies:** K14,H10 | **Output:** K15

---

## Chapter 6 card (DRAFT): "Election and reckoning"

**Dates:** Sep 12 through Oct 30 2014 (H11-H13). Copy: "Candidates shift. Votes certify. Your byline closes the arc."

**Transition:** S16.P1

---

### S16: Candidate change (DRAFT)

**Chapter:** 6 | **Historical:** H11 | **Date:** Sep 12, 2014 | **Play pattern:** mayoral versus ward-race card sort
**Entry:** K15 + BR-CH5-A/B | **Exit:** K16 to S17
**sceneObjectiveAnswerHint:** "Order filing dates before you name the switch."

#### S16.P1 Establish and arrival (DRAFT)

**Fictional character beat:** Sasha nearly merges the two races on the map. Alex separates them and lets the intern finish the correction.

Foreground: filing stamp pad. Midground: BG01 newsroom, election variant with ward map. Background: generic debate wall with no candidate portraits. Camera: slight dutch tilt corrected in P2. Light: campaign season bright. Beat: Plot pivot without mockery.

#### S16.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S16.O1 | Sep 12 switch summary H11 | Desk center | evidence |
| S16.O2 | Ward map poster | Wall | context |
| S16.O3 | Candidate filing stamp | Foreground | tool |
| S16.O4 | Debate schedule card | Cork strip | context |
| S16.O5 | Mayor-race / Ward 2-race explainer card | Folder | tool |
| S16.O6 | Photographer lens chart | Bag flap | tool |

#### S16.P3 Inspect and compare (DRAFT)

Sort O1 into the mayoral-race and Ward 2-race columns using O5; stamp O3 only on a public filing marker. No party-election framework is implied.

#### S16.P4 Editorial outcome and exit (DRAFT)

Editor: "Name the switch, not a cartoon."

Photographer: "Posters are background, not punchlines."

**Player question:** Candidate change coverage states?

| Answer | Result |
| --- | --- |
| Correct: "Doug enters the mayoral race; Rob leaves it and enters Ward 2 (H11)" | K16 |
| Retry: "Both brothers are now mayoral candidates" | Editor retry |

**Asset brief:** BG01 newsroom, election preparation variant. Reuse the named original base with new lighting and layout. Export all six listed objects as separate new sprite layers plus readable UI text overlays. No recovered logo used as furniture or texture.

**Dependencies:** K15,H11 | **Output:** K16

---

### S17: Election night preliminary results (DRAFT)

**Chapter:** 6 | **Historical:** H12 | **Date:** Oct 27, 2014 after reported results | **Play pattern:** preliminary vs certified label discipline
**Entry:** K16 | **Exit:** K17 to S18; CH6 branch resolves at S18
**sceneObjectiveAnswerHint:** "Label every number preliminary until certification."

#### S17.P1 Establish and arrival (DRAFT)

**Fictional character beat:** Cold pizza and a silent phone underline a long shift. The team agrees to label the state of the count before sending an update.

Foreground: untouched champagne cork. Midground: results desk with dual monitors. Background: election night crowd murmur silhouettes. Camera: over results desk. Light: monitor glow on faces. Beat: Numbers without premature certainty.

#### S17.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S17.O1 | Preliminary results board Oct 27 | Main monitor | evidence |
| S17.O2 | Ward tracker grid sheet | Side monitor | tool |
| S17.O3 | John Tory row label card | Grid overlay | context |
| S17.O4 | Rob Ford Ward 2 row label | Grid overlay | context |
| S17.O5 | Mobile push draft phone | Desk | tool |
| S17.O6 | Champagne cork unused | Foreground | context |

#### S17.P3 Inspect and compare (DRAFT)

Apply "PRELIMINARY" ribbon to O1 and O5 push draft; verify O3/O4 rows match O2 grid without certified language.

#### S17.P4 Editorial outcome and exit (DRAFT)

Editor: "Preliminary stays preliminary."

Journalist: "Numbers with caution labels."

**Player question:** Safe election night push?

| Answer | Result |
| --- | --- |
| Correct: "Preliminary reported result favors Tory; Ford wins Ward 2 (H12)" | K17 |
| Retry: "Final certified totals" | Editor retry |

**Asset brief:** BG01 newsroom, election night variant. Reuse the named original base with new lighting and layout. Export all six listed objects as separate new sprite layers plus readable UI text overlays. ff-079/ff-080 are optional non-combat crowd references pending approval.

**Dependencies:** K16,H12 | **Output:** K17

---

### S18: Final newsroom retrospective (DRAFT)

**Historical:** H13 | **Date:** Oct 30, 2014 after certification | **Play pattern:** certified results comparison + byline selection
**sceneObjectiveAnswerHint:** "Compare the certified record with the preliminary board, then choose the closing board."
**Exit:** K18, BR-CH6-A/B and END-A/END-B

#### S18.P1 (DRAFT)

**Fictional character beat:** The first notebook sits beside the final record. Alex chooses what the retrospective emphasizes and receives the next fictional assignment.

Foreground: certified results print Oct 30 summary. Midground: BG01 newsroom with dawn lighting and a season collage wall. Background: empty chair motif. Camera: slow push-in. Light: dawn warm. Beat: Exhaustion, professionalism, no mockery of addiction.

#### S18.P2 finds (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S18.O1 | Certified results sheet H13 | Desk center | evidence |
| S18.O2 | Preliminary vs certified diff highlighter | Tray | tool |
| S18.O3 | Notebook stack K01-K17 spines | Shelf | context |
| S18.O4 | Ward and citywide emphasis cards BR-CH6-A/B | Pin board | tool |
| S18.O5 | Editor reflection letter | Envelope | context |
| S18.O6 | Photographer election night contact sheet | Wall | evidence |

#### S18.P3 (DRAFT)

Compare the date and status of O1 to S17. The same winners remain. Do not invent numerical changes; no precise totals are needed for this puzzle.

#### S18.P4 (DRAFT)

Editor: "Your arc is the reporting, not the arrest."

Journalist: "We survived the room with our standards visible."

**Question:** Retrospective lede supported by certified results?

| Answer | Copy |
| --- | --- |
| Correct | "Toronto elects Tory mayor; Ford wins Ward 2 seat (H13 certified)" |
| Retry | "Election-night estimates were already the certified declaration" |

**Dependencies:** all K01-K17, H12,H13 | **Output:** K18; resolve BR-CH6-A/B here and select END-A/END-B

**Asset brief:** BG01 newsroom, dawn retrospective variant. Reuse the named original base with new lighting and layout. Export all six listed objects as separate new sprite layers plus readable UI text overlays. No recovered logo used as furniture or texture.

---


## Comparison keys for production (DRAFT)

These make each comparison concrete. They are authoring acceptance keys, not extra historical facts or a claim that comparison widgets are implemented. All scenes retain the common retry and access rules.

| Scene | Required comparison result | Scene-specific retry explanation |
|---|---|---|
| S01 | O5 is an attributed published report (H01); O4 is the fictional assignment question; O6 contains no original recording. | Repeating a report does not give this desk first-hand verification. |
| S02 | O6 May 16 reporting precedes O3 May 17 response; O1 is a separate fictional visit schedule. | A work schedule does not establish private conduct. |
| S03 | Match the report to H01, response to H02, and keep the desk's lack of independent viewing visible. | Restore attribution and the response before filing. |
| S04 | H03 is an on-record denial; the fictional run-of-show is a planning tool only. | A denial is a response, not independent proof either way. |
| S05 | Group the fictional transit, community voice and services concerns without generalizing to all residents. | These speakers are fictional individuals, not a poll or evidence of crime. |
| S06 | Trace duplicated summaries to their common source; retain H03 as a dated response. | Two copies of one account do not provide independent corroboration. |
| S07 | Retrieve prior dated reporting and the new H04 announcement notes; log origin and public date. | A retrieval slip tracks handling, not authenticity of the reported video. |
| S08 | Attribute the recovery announcement to Blair; public availability is still a separate question. | Police possession does not give the player a playable video. |
| S09 | Keep May reporting, May denial and October announcement as separate dated entries, with the summer audit labeled fiction. | Later information cannot silently rewrite what was known in May. |
| S10 | Add the public admission H05 beside the earlier denials, without erasing them or inventing a specific private episode. | Admission does not validate every unrelated allegation. |
| S11 | Sort H06 into Council request, with no claim of removal or criminal judgment. | Read the action adopted, not an imagined verdict. |
| S12 | H07: appointment/dismissal authority suspended. H08: Deputy Mayor chairs Executive Committee. Keep dates separate. | A transfer of specified responsibilities is not removal from office. |
| S13 | H09 describes leave to seek help; medical details are not among the supplied sources. | Do not change leave into resignation or invent treatment particulars. |
| S14 | Match fictional community requests to follow-up topics, separately from H09's historical leave report. | An invented request is not proof of a real service failure. |
| S15 | H10 establishes return; no supplied record reverses the earlier Council decisions. | Return and restoration of every power are different claims. |
| S16 | Place Doug in the mayoral contest and Rob in Ward 2 after the withdrawal, H11. | Keep the person and the office together when sorting. |
| S17 | Attach preliminary/reporting labels to the Tory mayoral and Rob Ford Ward 2 results, H12. | The official declaration is dated three days later. |
| S18 | Confirm the same winners against H13; note the date change without inventing numeric discrepancies. Resolve BR-CH6, then apply the ending predicate. | An election-night report and a certified declaration have different statuses. |

## Branch resolution and endings (DRAFT, fiction only)

The six branch bits resolve at S03, S06, S09, S12, S15 and S18. There is no trust score, punitive retry or branch lockout; six bits allow all 64 combinations. Choose END-A when at least three selected meanings are in `[BR-CH1-B, BR-CH2-B, BR-CH3-A, BR-CH4-B, BR-CH5-B, BR-CH6-B]`; otherwise choose END-B.

### END-A: Record of the city (DRAFT)

**END-A.P1:** Close on Alex's marked notebook beside Nadia's signed copy note. Warm dawn light. Elliot offers Alex the city beat: "Stay with the records. There is another edition tomorrow." This is an original fictional offer, not an award claimed from a real institution.

**END-A.P2:** Wide BG01 newsroom. Priya pins an accurately captioned image; Tomás leaves a community follow-up; Sasha receives Alex's spare notebook. Alex: "The record holds because every sentence shows its work." Return to credits after a deliberate Continue.

### END-B: People behind headlines (DRAFT)

**END-B.P1:** Close on the same certified history beside Tomás's next assignment card. Elliot offers Alex the Harbourview column. Alex: "The record is a beginning, and the people in it are still here."

**END-B.P2:** Wide BG04 cafe in morning light. Priya frames an ordinary community scene with permission; Nadia's approved copy and Sasha's follow-up list lie on the table. Tomás: "Next week, ask us what changed." Fade to credits. Both endings resolve the fictional team's work without claiming journalism ended a real crisis.

### Closing card (DRAFT, optional after either ending)

**H14 card, explicitly dated 1 December 2014:** The new mayor and Council take office. Cite R17 in the historical notes. This dated jump occurs after the October ending; the November notice cannot be a prop in S18.

Historical outcomes fixed in all variants per H13. No variant rewrites votes.

---

## Credits (DRAFT)

Roll after ending variant:

1. **Ford Frenzy** title card
2. **jr42 productions** production credit
3. Fictional cast: Alex Chen, Elliot Vance, Priya D'Souza, Tomás Reyes, Nadia Okafor, Sasha Bell
4. Historical reference acknowledgements: H00-H14, sourced in `../research/ford-frenzy-history.md`
5. Content policy line: fictional staging with attributed historical events
6. Engine credit: Minoo framework
7. Play again / return to title

---

## Art and asset briefs

Six original environment bases support the campaign: BG01 newsroom (including archive alcove), BG02 City Hall reading area, BG03 briefing room, BG04 cafe, BG05 Council gallery and BG06 community desk/map table. Scene-specific lighting, clutter and props prevent repeated rooms from looking unchanged. Each scene above names its base and new layers.

ff-011/ff-073/ff-075 are Crack Nation logo references for title palette only. ff-044 is a City Hall hallway composition reference for S02 reconstruction. ff-079/ff-080 are optional background character references, never candidate portraits or posters. All source selection and derived art approval remain #94/#104/#17.

## Unresolved decisions (storyboard)

1. Final owner review of DRAFT copy and exact fictional cast dialogue
2. Final paraphrases on historical props; exact unverified times remain omitted
3. Harbourview and cast names are proposed fictional names pending owner approval
4. Final visual treatment of the two ending boards

## Review checklist (planned)

- [ ] All S01-S18 present with four panels each
- [ ] 108 objects with unique IDs
- [ ] K01-K18 dependency chain acyclic
- [ ] No original video find in 2013 scenes
- [ ] No forged facsimiles labeled as real documents
- [ ] Opening S01-S03 sufficient for #93 handoff
- [ ] Owner DRAFT approval recorded

