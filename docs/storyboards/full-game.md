# Ford Frenzy: full-game scene storyboards

**Status:** DRAFT on every scene, panel, route and ending. Owner review pending.  
**Storyboard revision:** 2  
**Game:** Ford Frenzy by **jr42 productions**  
**Paper (exact name):** Torrona Haps  
**Issue:** #92

Cast in dialogue: **Alex Chen** (player), **Elliot Vance** (editor), **Priya D'Souza** (photographer), **Nadia Okafor** (copy chief), **Sasha Bell** (intern), **Tomás Reyes** (cafe contact). All dialogue is original fiction.

Text storyboard only. Historical pointers H00-H18 are reference labels; sourcing is parent-verified via [historical ledger](../research/ford-frenzy-history.md) and [press-events register](../research/ford-frenzy-press-events.md).

**Authored totals:** 22 scenes, 88 gameplay panels, 132 unique finds. **Per playthrough:** 20 scenes, 80 panels, 120 finds.

## Document conventions

- **Evidence** finds support a sourced claim. **Context** finds orient time, place or stakes. **Tool** finds unlock inspect/compare UI. Historical evidence points to H claims; fictional notes support fictional character beats only.
- Props are original fiction summarizing public records; never forged facsimiles of real documents.
- Original 2013 video is unavailable to the player in 2013 scenes.
- Player authors attributed coverage; real reporters, arrests, votes and elections remain outside player responsibility.
- **H15 quote rule:** *"I've got more than enough to eat at home."* appears once in this document (S11 editorial pass). Elsewhere cite H15 without repeating the quote.

## Common scene contract

All scenes inherit FF-SCN-001, FF-SAVE-001 and FF-UI-002:

| Control | Behavior |
| --- | --- |
| Entry | Prior scene completion (or New Game for S01); notebook, BR-CH*, AS* and route metadata carry forward. |
| Exit | Six unique finds (Sxx.O1-O6 or Rxx.O1-O6) plus correct editorial answer; awards Kxx or KRxx once. |
| Hints | Three optional rings per scene; free editorial explanations on review. No hint penalty. |
| Resume | Atomic save: scene ID, found set, hint count, notebook, branch IDs, AS1/AS2, selected route ID, retry count. |
| Reset | Clears only uncompleted current scene; campaign reset needs confirmation. |
| Retry | Wrong answer shows editor feedback, returns to P3; unlimited retries. |
| Tutorial | Each scene adds **sceneObjectiveAnswerHint** in P2. |
| Replay | Chapter replay is separate session; cannot alter committed branches. |
| Input | Keyboard Tab/Enter and accessible list mirror pointer; no forced drag. Hit areas >= 44 CSS px. Reduced motion removes movement only. **No hard timer.** |

## Historical reference index

| ID | Label | Campaign use |
| --- | --- | --- |
| H00 | 2010 backstory | Title/card copy only |
| H01 | Initial reports | May 16 2013; player cannot see original video |
| H02 | May 17 denial | May 17 deadline backdrop |
| H03 | May 24 denial | Chapter 2 |
| H04 | Oct 31 police statement | Chapter 3 |
| H05 | Nov 5 admission | S10 |
| H06 | Nov 13 council leave request | Referenced in S12; not S11 setting |
| H07 | Nov 15 powers | S12 |
| H08 | Nov 18 powers | S12 |
| H09 | Apr 30 leave | S13 |
| H10 | June 30 return | S15 |
| H11 | Sep 12 candidate switch | S16 |
| H12 | Oct 27 election | S17 preliminary |
| H13 | Oct 30 certification | S18 |
| H14 | Dec 1 term transition | Optional closing card |
| H15 | Nov 14 quote and apology | S11; quote once |
| H16 | Nov 14-19 international crush / school tours | R1A, S11 callback |
| H17 | Mar 3 2014 Kimmel | Optional chapter card before Ch5 |
| H18 | Nov 18-19 Ford Nation cancel | S12 montage |

## Notebook output graph

```
S01 -> K01 -> S02 -> K02 -> S03 -> K03 -> BR-CH1
 -> S04 -> K04 -> S05 -> K05 -> S06 -> K06 -> BR-CH2
 -> S07 -> K07 -> S08 -> K08 -> S09 -> K09 -> BR-CH3
 -> S10 -> K10 -> AS1 -> (R1A -> KR1A | R1B -> KR1B) -> S11 -> K11
 -> S12 -> K12 -> BR-CH4
 -> S13 -> K13 -> S14 -> K14 -> S15 -> K15 -> BR-CH5
 -> S16 -> K16 -> AS2 -> (R2A -> KR2A | R2B -> KR2B) -> S17 -> K17
 -> S18 -> K18 -> BR-CH6 -> END-A or END-B
```

| Output | Scene | Summary |
| --- | --- | --- |
| K01 | S01 | Gear triage; published report vs office rumour |
| K02 | S02 | May 16/17 corridor timeline |
| K03 | S03 | First filed Haps piece with silly layout, accurate copy |
| K04 | S04 | Denial bingo / question cards |
| K05 | S05 | Cafe reality check |
| K06 | S06 | Summer shrug ledger |
| K07 | S07 | Halloween dossier |
| K08 | S08 | Statement side-eye summary |
| K09 | S09 | Oct 31 package |
| K10 | S10 | Admission stack |
| KR1A | R1A | International kit scramble |
| KR1B | R1B | Cafe reaction beat |
| K11 | S11 | Quote-apology press kit |
| K12 | S12 | Powers and punchline map |
| K13 | S13 | Leave timeline |
| K14 | S14 | Service sidebar |
| K15 | S15 | Return brief |
| K16 | S16 | Two-race cheat sheet |
| KR2A | R2A | Field election kit |
| KR2B | R2B | Broadcast election kit |
| K17 | S17 | Preliminary night copy |
| K18 | S18 | Certified retrospective |

## Chapter-ending branches (fiction only)

| After | Branch A | Branch B |
| --- | --- | --- |
| S03 | BR-CH1-A Splash First | BR-CH1-B Lawyer Voice |
| S06 | BR-CH2-A Patio Sidebar | BR-CH2-B Audit Mode |
| S09 | BR-CH3-A Archive Goblin | BR-CH3-B Plain English |
| S12 | BR-CH4-A Alert Siren | BR-CH4-B Procedure Nerd |
| S15 | BR-CH5-A Service Desk | BR-CH5-B Org Chart |
| S18 | BR-CH6-A Ward Close | BR-CH6-B Citywide Close |

## Assignment selectors

| ID | When | A | B | Route |
| --- | --- | --- | --- | --- |
| AS1 | After S10, before route | Chase satellite trucks | Stay with Tomás | R1A / R1B |
| AS2 | After S16, before route | Field stakeout | Anchor live desk | R2A / R2B |

Persist AS1/AS2 before route entry. Untaken route never blocks completion.

---

## Title sequence (DRAFT)

**Composition:** Night Toronto skyline; foreground **Torrona Haps** window with crooked neon; midground CN Tower and council dome as simplified shapes; background indigo gradient.

**Beat:** Logo **Ford Frenzy**; subline **jr42 productions**; tag "A fictional newsroom farce around documented public events."

**Audio:** Optional typewriter tick (FF-AUD-001).

**Transition:** Fade to menu or New Game to S01.

---

## Chapter 1 card (DRAFT): "Welcome to the circus"

**Dates:** 17 May 2013 (H01/H02).

**Copy:** "You were hired for patio season. The mayor beat just opened because the last reporter left a half-eaten sandwich and no forwarding address."

**Transition:** S01.P1.

---

### S01: Welcome to the Haps (DRAFT)

**Chapter:** 1 | **Historical:** H01/H02 | **Date:** 17 May 2013  
**Play pattern:** clutter search under takeout and invoices; charger-recorder pairing  
**Entry:** New Game | **Exit:** K01 to S02  
**sceneObjectiveAnswerHint:** "Find your gear, marry the charger to the recorder, and tell a rumour from something that actually ran."

#### S01.P1 Establish and arrival (DRAFT)

**Beat:** Alex arrives expecting patio listings. Elliot slides a mayor folder over a tower of takeout. The assignment chair lists to the left (running gag). Priya is already photographing the broken chair "for posterity."

Foreground: grease-stained takeout bag, invoice stack. Midground: wobbly chair, dim monitor. Background: BG01 newsroom bay, **Torrona Haps** masthead crooked on wall. Camera: over-shoulder. Light: desk lamp vs fluorescent hum.

**Dialogue:** Elliot: "Welcome to the Haps. Patio column is Tuesday. Today you are mayor-adjacent." Alex: "I do not have a chair." Elliot: "You have urgency. Same thing."

#### S01.P2 Interactive search (DRAFT)

L-shaped desk, side table buried in invoices and food containers.

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S01.O1 | Reporter notebook under pizza box | Left desk | tool |
| S01.O2 | Contact sheet printout | Under keyboard | context |
| S01.O3 | Wall calendar May 2013 with "PATIO??" crossed out | Corkboard | context |
| S01.O4 | Assignment folder tab "Mayor - do not open before coffee" | Center desk | tool |
| S01.O5 | Published report clipping summary (attributed H01) | Monitor stand | evidence |
| S01.O6 | Digital recorder | Side table, **wrong** charger nearby | tool |

#### S01.P3 Inspect and compare (DRAFT)

Pair O6 recorder with matching charger from invoice sleeve (not the phone brick). Compare O5 published summary vs O4 folder sticky labeled "OFFICE RUMOUR - Nadia will kill us."

#### S01.P4 Editorial outcome and exit (DRAFT)

Nadia (offscreen note): "If it did not run, it is gossip with stationery."

**Player question:** What can the Haps honestly chase tonight?

| Answer | Result |
| --- | --- |
| Correct: "The attributed report that already ran, plus on-record follow-up, not the break-room rumour" | K01; S02 |
| Retry: "The rumour, because it sounds more exciting" | Elliot: "That is how we lose the chair and the building." |

**Asset brief:** BG01 newsroom. Six sprite layers. ff-079/080 candidate silhouettes in background only.

**Dependencies:** none | **Output:** K01

---

### S02: Meanwhile at City Hall (DRAFT)

**Chapter:** 1 | **Historical:** H01/H02 | **Date:** 17 May 2013  
**Play pattern:** printer-jam press-kit search; date ordering  
**Entry:** K01 | **Exit:** K02  
**sceneObjectiveAnswerHint:** "Unjam the public kit. May 16 and May 17 only. November is not a prop today."

#### S02.P1 Establish and arrival (DRAFT)

**Beat:** Alex flees the newsroom printer curse for City Hall's worse printer. A public corridor work area, not a secret archive. No satellite trucks. No November calendars.

Foreground: out-of-order sign on jammed printer. Midground: public research counter with **City Hall Public Search** placard. Background: simplified atrium (ff-044 composition reference). Camera: slight high angle.

**Dialogue:** Alex: "Tell me the building has answers." Clerk (fictional extra): "It has agendas and a toner emergency."

#### S02.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S02.O1 | Jammed press-kit tray page 1 | Printer output | tool |
| S02.O2 | Jammed press-kit page 2 (May 17 schedule) | Printer intake | context |
| S02.O3 | May 17 denial summary card H02 | Binder spine | evidence |
| S02.O4 | Filing label "Mayor office - public" | Cabinet | tool |
| S02.O5 | Visitor bell | Counter | context |
| S02.O6 | May 16 reporting summary folder H01 | Table center | evidence |

#### S02.P3 Inspect and compare (DRAFT)

Clear jam: stack O1+O2 in order. Place O6 before O3 on timeline strip. Reject any prop dated after 17 May.

#### S02.P4 Editorial outcome and exit (DRAFT)

**Player question:** What does this corridor establish?

| Answer | Result |
| --- | --- |
| Correct: "Reports appeared May 16; a public denial followed May 17; nothing here proves private conduct" | K02 |
| Retry: "Proof the allegation is true" | Nadia note: "That is a leap, not a timeline." |

**Asset brief:** BG02 City Hall corridor. ff-044 composition reference only.

**Dependencies:** K01 | **Output:** K02

---

### S03: We're Going With WHAT? (DRAFT)

**Chapter:** 1 | **Historical:** H01/H02 | **Date:** 17 May 2013 evening  
**Play pattern:** headline/layout assembly with six distinct props  
**Entry:** K01,K02 | **Exit:** K03; BR-CH1  
**sceneObjectiveAnswerHint:** "Build a headline Elliot deserves but Nadia will allow."

#### S03.P1 Establish and arrival (DRAFT)

**Beat:** Desks rearranged for "breaking energy." Elliot pitches headlines on sticky notes: "CRACK CITY?" Nadia stares. Sasha plugs a monitor cable into a label maker.

Foreground: silly headline sticky pile. Midground: layout desk with movable blocks. Background: BG01 evening, phones ringing. Broken chair now has caution tape.

**Dialogue:** Elliot: "We need a splash." Nadia: "We need a fact." Alex: "We need a working HDMI port."

#### S03.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S03.O1 | Source log booklet | Desk left | evidence |
| S03.O2 | Denial response notes H02 | Center | evidence |
| S03.O3 | Headline word magnets (satirical options) | Tray | tool |
| S03.O4 | Layout column grid | Monitor | tool |
| S03.O5 | Elliot's rejected pun napkin | Floor | context |
| S03.O6 | Nadia's "boring but legal" stamp | Clipboard | tool |

#### S03.P3 Inspect and compare (DRAFT)

Assemble layout: O3 magnets + O4 grid must pair O1 report line with O2 denial line; stamp O6 on uncertainty box; discard O5 pun.

#### S03.P4 Editorial outcome and exit (DRAFT)

**Player question:** Which filed lede survives copy desk?

| Answer | Result |
| --- | --- |
| Correct: "Reports allege; mayor denies on record; video not verified by the Haps" | K03 + BR-CH1-A/B |
| Retry: "Haps exclusive video proves everything" | Elliot: "We do not have video. We have hubris." |

**Asset brief:** BG01 evening variant.

**Dependencies:** K01,K02 | **Output:** K03

---

## Chapter 2 card (DRAFT): "Denial season"

**Dates:** 24 May onward (H03). **Copy:** "Summer is hot. Denials are repetitive. The printer is still jammed."

**Transition:** S04.P1.

---

### S04: Denial prep room (DRAFT)

**Chapter:** 2 | **Historical:** H03 | **Date:** 24 May 2013 after public denial  
**Play pattern:** denial bingo / question pairing  
**Entry:** K03 + BR-CH1-A/B | **Exit:** K04 to S05  
**sceneObjectiveAnswerHint:** "Match each question to what a denial actually answers."

#### S04.P1 Establish and arrival (DRAFT)

**Beat:** Priya refuses to shoot a "reenactment of guilt." Elliot pitches "DENIAL DENIAL DENIAL" as a three-part headline. Alex builds questions that sound like journalism, not a wrestling promo.

Foreground: teleprompter glass with fingerprint smear. Midground: prep table, index cards fanned like a losing hand of poker. Background: BG03 briefing room door, **Torrona Haps** mic flag chipped. Camera: low side angle. Light: flat studio fill.

**Dialogue:** Priya: "I shoot faces, not fan fiction." Elliot: "Give me a question that lands." Alex: "Give me one that survives Nadia."

#### S04.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S04.O1 | Question card deck | Table fan | tool |
| S04.O2 | May 24 denial summary card H03 | Clipboard center | evidence |
| S04.O3 | Microphone windscreen (chewed by broken chair) | Chair arm | context |
| S04.O4 | Legal caution sticky on glass | Prompter edge | context |
| S04.O5 | Priya lens cap | Table corner | tool |
| S04.O6 | Run-of-show sheet | Tablet prop rear | tool |

#### S04.P3 Inspect and compare (DRAFT)

Match O1 question cards to O2 denial bullets; mark "on-record denial" vs "allegation repeat"; O6 run-of-show is planning only.

#### S04.P4 Editorial outcome and exit (DRAFT)

**Player question:** May 24 coverage should lead with?

| Answer | Result |
| --- | --- |
| Correct: "On-record denial of the specific allegation" | K04 |
| Retry: "The denial independently disproves the allegation" | Priya: "That is not how denials work. Retry." |

**Asset brief:** BG03 briefing prep. Six sprite layers.

**Dependencies:** K03,H03 | **Output:** K04

---

### S05: Harbourview cafe (DRAFT)

**Chapter:** 2 | **Historical:** none (fiction) | **Date:** 8 Jun 2013  
**Play pattern:** civic concern map  
**Entry:** K04 | **Exit:** K05 to S06  
**sceneObjectiveAnswerHint:** "Pin real neighborhood needs, not scandal tourism."

#### S05.P1 Establish and arrival (DRAFT)

**Beat:** Tomás watches Alex order the smallest coffee. "You only visit when the mayor breaks something." A TV muted in the corner shows a loop of City Hall b-roll. Alex promises a transit sidebar the Haps might actually print.

Foreground: condiment caddy, sugar packets stacked like evidence. Midground: booth with community bulletin board. Background: BG04 street window, afternoon stripes. Camera: eye-level two-shot space.

**Dialogue:** Tomás: "Write that the job still matters." Alex: "I can do boring. Boring keeps the lights on."

#### S05.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S05.O1 | Hand-drawn neighborhood map | Wall left | tool |
| S05.O2 | Transit complaint flyer | Board pin | context |
| S05.O3 | Quote notebook page (fiction) | Booth seat | evidence |
| S05.O4 | Recorder with consent card | Table center | tool |
| S05.O5 | Street festival photo print | Window ledge | context |
| S05.O6 | Sticky cluster "what city hall owes us" | Map margin | evidence |

#### S05.P3 Inspect and compare (DRAFT)

Pin O2, O3, O6 to O1 map layers (services, trust, accountability). O5 is color, not corroboration.

#### S05.P4 Editorial outcome and exit (DRAFT)

**Player question:** Cafe scene supports which notebook entry?

| Answer | Result |
| --- | --- |
| Correct: "Civic stakes beyond scandal headline" | K05 |
| Retry: "These comments establish what every resident believes about the video" | Tomás: "We agree the 501 is late. Try again." |

**Asset brief:** BG04 cafe. Six sprite layers.

**Dependencies:** K04 | **Output:** K05

---

### S06: Summer shrug ledger (DRAFT)

**Chapter:** 2 | **Historical:** H03 pointer | **Date:** 30 Aug 2013 (fiction)  
**Play pattern:** source dedup matrix  
**Entry:** K04,K05 | **Exit:** K06 to S07; BR-CH2 at S06  
**sceneObjectiveAnswerHint:** "Two copies of the same blog post is still one blog post."

#### S06.P1 Establish and arrival (DRAFT)

**Beat:** Sasha labels three printouts "SOURCE A/B/C" because the fonts differ. Alex introduces the summer shrug: attributed, not verified, still employed.

Foreground: audit printouts, fan set to maximum. Midground: four-chair huddle under flickering fluorescent. Background: BG01 evidence wall with yarn (fiction). Camera: wide. Light: late summer evening orange.

**Dialogue:** Sasha: "Three sources!" Alex: "One blog, three printers." Elliot: "Audit before amplify."

#### S06.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S06.O1 | Source grid whiteboard | Wall center | tool |
| S06.O2 | Summer tip email printout summary | Desk front | context |
| S06.O3 | Corroboration checklist | Clipboard | tool |
| S06.O4 | Priya contact sheet | Pin board right | context |
| S06.O5 | May 24 denial summary H03 | Monitor | evidence |
| S06.O6 | Redaction marker | Pen cup | tool |

#### S06.P3 Inspect and compare (DRAFT)

Fill O1 grid: trace duplicates to one origin; retain H03 as dated response; cross out anonymous-only column.

#### S06.P4 Editorial outcome and exit (DRAFT)

**Player question:** Summer audit status?

| Answer | Result |
| --- | --- |
| Correct: "Allegation remains attributed, not verified" | K06 + BR-CH2-A/B |
| Retry: "Two copies of one article count as independent corroboration" | Elliot: "Nice try. Audit again." |

**Asset brief:** BG01 summer audit variant. Six sprite layers.

**Dependencies:** K04,K05,H03 | **Output:** K06

---

## Chapter 3 card (DRAFT): "October arrives"

**Dates:** 31 Oct 2013 (H04). **Copy:** "Police speak. Elliot hears angels. Nadia hears liability."

**Transition:** S07.P1.

---

### S07: Archive bay (DRAFT)

**Chapter:** 3 | **Historical:** H04 | **Date:** 31 Oct 2013 after announcement  
**Play pattern:** stack search in archive aisle  
**Entry:** K06 + BR-CH2-A/B | **Exit:** K07 to S08  
**sceneObjectiveAnswerHint:** "Find May denials and tonight's statement stub. No playable video."

#### S07.P1 Establish and arrival (DRAFT)

**Beat:** Halloween candy on the rolling cart. Alex's May notebook is finally useful while everyone else runs in circles. Elliot shouts from the pit: "Headline goblins need files!"

Foreground: rolling cart with squeaky wheel. Midground: labeled boxes "2013-Q2." Background: BG01 archive shelves, cobweb sticker (joke prop). Camera: aisle one-point. Light: cool overhead.

**Dialogue:** Alex: "May called. It wants its denials back." Sasha (distant): "I plugged the archive into the coffee maker again."

#### S07.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S07.O1 | Box label "2013-Q2 denials" | Shelf B | context |
| S07.O2 | Retrieval slip signed | Cart clip | tool |
| S07.O3 | Microfilm reader (decorative) | Table rear | tool |
| S07.O4 | Prior tip index card | Box flap | context |
| S07.O5 | Source-handling checklist | Cart side | tool |
| S07.O6 | H04 announcement summary envelope | Top box | evidence |

#### S07.P3 Inspect and compare (DRAFT)

Open O6 fiction summary pointing to H04 slot; log on O2 slip; do not unlock video player UI.

#### S07.P4 Editorial outcome and exit (DRAFT)

**Player question:** Archive scene establishes?

| Answer | Result |
| --- | --- |
| Correct: "Materials ready to compare statement vs prior denials" | K07 |
| Retry: "Retrieval slip authenticates video for the player" | Nadia note: "Slip tracks paper, not a play button." |

**Asset brief:** BG01 archive alcove. Six sprite layers.

**Dependencies:** K06 | **Output:** K07

---

### S08: Statement side-eye (DRAFT)

**Chapter:** 3 | **Historical:** H04 | **Date:** 31 Oct 2013 after announcement  
**Play pattern:** authority comparison (police summary vs prior denials)  
**Entry:** K07 | **Exit:** K08 to S09  
**sceneObjectiveAnswerHint:** "Attribute the police announcement. Public availability is still a separate question."

#### S08.P1 Establish and arrival (DRAFT)

**Beat:** Elliot wants "POLICE HAVE THE TAPE" in 72-point type. Priya makes Alex keep the limitation visible like a neon sign.

Foreground: reporter notepad, chewed pen. Midground: briefing desk, **Public Statement** placard. Background: silhouette crowd, no faces. Camera: frontal medium. Light: harsh press-flash freeze.

**Dialogue:** Elliot: "Clear headline. Now." Priya: "Clear is not the same as complete."

#### S08.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S08.O1 | H04 summary card on lectern | Center | evidence |
| S08.O2 | Prior denial timeline strip | Left rail | context |
| S08.O3 | Audio patch bay (Sasha tangled) | Desk edge | tool |
| S08.O4 | Priya long lens on monopod | Right rail | context |
| S08.O5 | Quote approval tick box sheet | Clipboard | tool |
| S08.O6 | Public broadcast clock | Wall | context |

#### S08.P3 Inspect and compare (DRAFT)

Align O1 bullets to O2 denial dates; highlight contradiction without inventing quotes; tick O5 attribution boxes.

#### S08.P4 Editorial outcome and exit (DRAFT)

**Player question:** Headline supported tonight?

| Answer | Result |
| --- | --- |
| Correct: "Police report recovering a video consistent with prior media descriptions (H04 summary pointer)" | K08 |
| Retry: "Police recovery means the original video is publicly available to the Haps" | Elliot: "We still cannot press play. Retry." |

**Asset brief:** BG03 police-summary variant. Six sprite layers.

**Dependencies:** K07,H04 | **Output:** K08

---

### S09: Verification deadline (DRAFT)

**Chapter:** 3 | **Historical:** H04 | **Date:** 31 Oct 2013 evening  
**Play pattern:** chronology ordering + checklist convergence  
**Entry:** K07,K08 | **Exit:** K09 to S10; BR-CH3 at S09  
**sceneObjectiveAnswerHint:** "Order tonight's statement against the last denial before you file."

#### S09.P1 Establish and arrival (DRAFT)

**Beat:** October rain on the window. S03 desk variant returns with more cables. Alex is now who Sasha calls when the printer screams.

Foreground: coffee timer (narrative only, no countdown). Midground: BG01 October deadline clutter. Background: distant silhouette runners. Camera: over-shoulder matching S03.

**Dialogue:** Nadia: "Publish the delta, not the fantasy." Alex: "Delta with unknowns attached."

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

Order O2: May denial, summer audit pause (fiction label), Oct 31 statement. O1 checklist must include O3 draft with unknowns field.

#### S09.P4 Editorial outcome and exit (DRAFT)

**Player question:** What belongs in tonight's filed package?

| Answer | Result |
| --- | --- |
| Correct: "Statement summary, denial timeline, explicit unknowns" | K09 + BR-CH3-A/B |
| Retry: "Original video file attachment" | Elliot: "We still do not have it." |

**Asset brief:** BG01 October deadline. Six sprite layers.

**Dependencies:** K07,K08,H04 | **Output:** K09

---

## Chapter 4 card (DRAFT): "On record, on camera, on fire"

**Dates:** 5 Nov; 14 Nov; 18-19 Nov 2013. **Copy:** "Admissions, apologies, and a printer that finally achieves sentience."

**Transition:** S10.P1.

---

### S10: Breaking pit (DRAFT)

**Chapter:** 4 | **Historical:** H05 | **Date:** 5 Nov 2013  
**Play pattern:** admission vs denial pairing  
**Entry:** K09 + BR-CH3-A/B | **Exit:** K10 to AS1  
**sceneObjectiveAnswerHint:** "Compare the new admission with earlier denials. Do not erase history."

#### S10.P1 Establish and arrival (DRAFT)

**Beat:** Red alert lights. Elliot pitches "CRACK CONFIRMED CRACK CONFIRMED." Nadia pitches "words exist, dates matter." Broken chair has a red alert sticker on it.

Foreground: ringing phone light. Midground: BG01 November alert lighting. Background: blurred runners. Camera: handheld slight sway.

**Dialogue:** Elliot: "This is on record now." Alex: "So were the denials. Both stay."

#### S10.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S10.O1 | Breaking banner template strip | Top monitor | tool |
| S10.O2 | Admission summary card H05 | Desk center | evidence |
| S10.O3 | Rewrite sticky stack | Keyboard side | context |
| S10.O4 | Live blog monitor frame | Right monitor | tool |
| S10.O5 | Prior denial printout | Left clip | evidence |
| S10.O6 | Headset with frayed cable | Desk edge | context |

#### S10.P3 Inspect and compare (DRAFT)

Drag O2 bullets beside O5 denial rows; mark new on-record claim without erasing dated history; forbid unsourced private detail.

#### S10.P4 Editorial outcome and exit (DRAFT)

**Player question:** Supported breaking lead?

| Answer | Result |
| --- | --- |
| Correct: "Public admission H05 beside earlier denials, without erasing history" | K10 -> AS1 |
| Retry: "Player proved private behavior" | Elliot: "We document statements, not nights we did not see." |

**Asset brief:** BG01 November alert.

**Dependencies:** K09,H05 | **Output:** K10

---

### AS1: Assignment selector (DRAFT)

**When:** After K10, before route. **Persist AS1-A or AS1-B atomically before R1A or R1B entry.**

| Option | Copy | Route |
| --- | --- | --- |
| AS1-A | Elliot: "CNN left a scarf in the lobby. Go be international." | R1A |
| AS1-B | Tomás text: "My regulars have opinions. So does my espresso machine." | R1B |

**Transition:** Hard cut to selected route P1. Untaken route available only in separate replay session.

---

### R1A: International Press Kit Scramble (DRAFT)

**Design target:** post-opening milestone; not in first production slice.  
**Chapter:** 4 fork | **Historical bounds:** H15 apology known; H16 crush and school-tour notice | **Date:** 14 Nov 2013 afternoon (fiction)  
**Play pattern:** scramble props into borrowed press kit  
**Entry:** K10, AS1-A persisted | **Exit:** KR1A to S11  
**sceneObjectiveAnswerHint:** "Pack what the Haps actually has before the satellite trucks eat your desk."

#### R1A.P1 Establish and arrival (DRAFT)

**Beat:** The newsroom looks like a luggage store exploded. Priya needs a clean lens cap. Sasha is mistaken for a producer three times in four minutes. Broken chair wedged in supply closet with a **MEDIA** vest hanging on it.

Foreground: cardboard boxes labeled "NOT FOOD." Midground: BG01 international-crush variant, window shows truck silhouettes (no real network logos). Background: fax machine eating O3. Camera: handheld slight sway.

**Dialogue:** Elliot: "Look bigger than we are." Priya: "Look accurate." Alex: "Look employed."

#### R1A.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| R1A.O1 | Haps press credential lanyard | Coat hook | tool |
| R1A.O2 | Borrowed "MEDIA" vest (too large) | Chair | context |
| R1A.O3 | School-tour relocation notice H16 | Fax tray | evidence |
| R1A.O4 | Satellite truck schedule parody sheet | Desk | context |
| R1A.O5 | Priya spare battery | Bag | tool |
| R1A.O6 | Elliot's wrong-network business cards | Trash | context |

#### R1A.P3 Inspect and compare (DRAFT)

Pack O1, O3, O5 into kit case; discard O6 wrong cards; label O3 as municipal relocation notice per H16, not "City Hall closed forever."

#### R1A.P4 Editorial outcome and exit (DRAFT)

**Player question:** Kit ready for City Hall crush?

| Answer | Result |
| --- | --- |
| Correct: "Haps ID, camera power, and the relocation notice for context" | KR1A -> S11 |
| Retry: "Pretend we are a cable network" | Priya: "We are a paper that prints twice a week on a good week." |

**Asset brief:** BG01 international-crush variant. Six sprite layers. No schoolchildren props.

**Dependencies:** K10, AS1-A, H16 | **Output:** KR1A

---

### R1B: Cafe Reaction Beat (DRAFT)

**Design target:** post-opening milestone.  
**Chapter:** 4 fork | **Historical bounds:** H15 via paraphrase only; no quote repeat | **Date:** 14 Nov 2013 afternoon (fiction)  
**Play pattern:** gather reaction props for sidebar  
**Entry:** K10, AS1-B persisted | **Exit:** KR1B to S11  
**sceneObjectiveAnswerHint:** "Capture how regulars talk about the circus, not the unverified private allegation."

#### R1B.P1 Establish and arrival (DRAFT)

**Beat:** Tomás has the TV on mute. Regulars argue about whether the mayor or the media is louder. Alex is here because Elliot said "local color" and Priya refused to shoot the espresso machine as B-roll.

Foreground: steam from O1. Midground: BG04 afternoon, news glow on faces. Background: street reflection of distant truck lights (abstract). Camera: eye-level bar angle.

**Dialogue:** Tomás: "You want quotes? Buy a second round." Alex: "I want sentences Nadia will not set on fire."

#### R1B.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| R1B.O1 | Espresso machine steam knob | Counter | context |
| R1B.O2 | Regular's annotated newspaper | Booth | context |
| R1B.O3 | Tomás quote notebook | Under counter | evidence |
| R1B.O4 | Haps sidebar layout sketch | Table | tool |
| R1B.O5 | "World media" TV mute remote | Bar | context |
| R1B.O6 | Consent card stack | Register | tool |

#### R1B.P3 Inspect and compare (DRAFT)

Record O3 with O6 consent; draft O4 sidebar layout using O2 annotations; O5 stays muted background gag.

#### R1B.P4 Editorial outcome and exit (DRAFT)

**Player question:** Sidebar focus?

| Answer | Result |
| --- | --- |
| Correct: "Neighborhood reaction to circus coverage, not proof of allegations" | KR1B -> S11 |
| Retry: "Cafe conversation proves the private allegation" | Tomás: "I prove you need milk. Retry." |

**Asset brief:** BG04 cafe afternoon variant. Six sprite layers.

**Dependencies:** K10, AS1-B | **Output:** KR1B

---

### S11: Did He Just Say That? (DRAFT)

**Chapter:** 4 | **Historical:** H15 | **Date:** 14 Nov 2013 **after afternoon apology**  
**Play pattern:** press-kit retelling: morning quote slot vs afternoon apology slot  
**Entry:** K10 + KR1A or KR1B | **Exit:** K11  
**sceneObjectiveAnswerHint:** "Stage the Haps retelling: morning on record, afternoon sorry, no private reenactment."

**Route callbacks:** If KR1A, satellite truck mug on desk. If KR1B, Tomás takeaway cup on desk.

#### S11.P1 Establish and arrival (DRAFT)

**Beat:** Nadia spreads a **Torrona Haps press kit** on the rearranged desk: morning appearance, afternoon apology, no private reenactment. Elliot waves a fog-machine brochure. "Apology atmosphere," he says. Nadia says no.

Foreground: kit folders labeled AM and PM. Midground: BG01 Nov 14 layout, route callback prop (KR1A truck mug or KR1B takeaway cup). Background: printer finally works, prints one page, jams again. Camera: tight desk.

**Dialogue:** Nadia: "We explain the day. We do not cosplay the bedroom." Elliot: "What if the fog is tasteful?" Alex: "What if we file?"

#### S11.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S11.O1 | Morning appearance summary card H15 | Kit left | evidence |
| S11.O2 | Afternoon apology summary card H15 | Kit right | evidence |
| S11.O3 | Argonauts jersey objection note (attributed) | Kit pocket | context |
| S11.O4 | Timeline ribbon AM / PM | Desk | tool |
| S11.O5 | Single-quote placard (H15 text once) | Kit center | evidence |
| S11.O6 | Elliot fog-machine brochure | Trash | context |

#### S11.P3 Inspect and compare (DRAFT)

Order O4 ribbon: morning before afternoon. Place O5 once with attribution label (sole H15 quote instance). O6 brochure to joke bin.

#### S11.P4 Editorial outcome and exit (DRAFT)

**Player question:** What does Nov 14 coverage document?

| Answer | Result |
| --- | --- |
| Correct: "Attributed morning quote, later apology same day; allegation remains attributed, not proven" | K11 |
| Retry: "Apology proves the private allegation true" | Nadia: "Sorry is not a courtroom." |

**H15 quote (once):** *"I've got more than enough to eat at home."*

**Asset brief:** BG01 Nov 14 press-kit layout. No council gallery.

**Dependencies:** K10, KR*, H15 | **Output:** K11

---

### S12: Powers and punchline map (DRAFT)

**Chapter:** 4 | **Historical:** H06-H08, H18 | **Date:** 18-19 Nov 2013  
**Play pattern:** powers delta chart + Nov 19 montage card  
**Entry:** K11 | **Exit:** K12 to S13; BR-CH4 at S12  
**sceneObjectiveAnswerHint:** "Show which powers moved on which public dates. Slot the one-episode TV cancellation as paraphrase."

#### S12.P1 Establish and arrival (DRAFT)

**Beat:** Elliot finally gives an explainer the splash zone. Sasha queues a montage card for H18: one episode, cancelled next day. Paraphrase only; no ratings speculation.

Foreground: highlighter cap off. Midground: dual charts on easel. Background: pinned timeline Nov 15-19. Camera: straight-on instructional.

**Dialogue:** Elliot: "Make the machinery boring enough to be true." Alex: "Boring is our brand."

#### S12.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S12.O1 | Nov 15 powers summary card H07 | Left chart | evidence |
| S12.O2 | Nov 18 powers summary card H08 | Right chart | evidence |
| S12.O3 | Specified-functions flowchart | Center easel | tool |
| S12.O4 | Nov 13 leave request note H06 | Pin board | context |
| S12.O5 | H18 cancellation chyron card (paraphrase) | Monitor | evidence |
| S12.O6 | Highlighter | Foreground tray | tool |

#### S12.P3 Inspect and compare (DRAFT)

Highlight deltas O1 to O2 through O3 specified functions only. O5 montage slot separate from powers chart. No "mayor removed" language.

#### S12.P4 Editorial outcome and exit (DRAFT)

**Player question:** Accurate explainer core?

| Answer | Result |
| --- | --- |
| Correct: "Council transferred specified responsibilities by dated votes (H07/H08); Ford Nation one episode cancelled Nov 19 (H18 paraphrase)" | K12 + BR-CH4-A/B |
| Retry: "Mayor removed from office" | Nadia: "Read the votes, not the vibes." |

**Asset brief:** BG01 chart variant. Six sprite layers.

**Dependencies:** K11,H06,H07,H08,H18 | **Output:** K12

---

## Chapter 5 card (DRAFT): "Leave, latte, return"

**Optional H17 card (DRAFT):** Before S13, dated **3 Mar 2014** flashback card: "Ford visited a late-night show. The Haps did not send a correspondent. We sent a strongly worded calendar reminder." Not a playable scene.

**Transition:** S13.P1.

---

### S13: Leave watch (DRAFT)

**Chapter:** 5 | **Historical:** H09 | **Date:** 1 May 2014 after Apr 30 statement  
**Play pattern:** leave statement timeline with humane tone  
**Entry:** K12 + BR-CH4-A/B | **Exit:** K13 to S14  
**sceneObjectiveAnswerHint:** "Cover the public leave statement without ghoulish wordplay."

#### S13.P1 Establish and arrival (DRAFT)

**Beat:** Alex drafts a pun headline, hears Nadia's footsteps, deletes it in one motion. Elliot is uncharacteristically quiet. Fog machine brochure reappears as a bookmark.

Foreground: potted plant. Midground: health beat corner, muted newsroom. Background: BG01 spring quiet variant. Camera: calm medium.

**Dialogue:** Nadia: "No ghoulish wordplay." Alex: "I was thinking 'May the fourth be with...'" Nadia: "No."

#### S13.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S13.O1 | Leave statement summary H09 | Desk center | evidence |
| S13.O2 | Leave timeline strip | Wall clip | evidence |
| S13.O3 | Health desk explainer (public only) | Folder | context |
| S13.O4 | Apr 30 calendar sticky | Monitor | tool |
| S13.O5 | Press pool schedule | Side tray | context |
| S13.O6 | "No ghoulish puns" card from Nadia | Drawer front | tool |

#### S13.P3 Inspect and compare (DRAFT)

Align O1 to O2 anchors; apply O6 tone guide; no clinic or medical record props.

#### S13.P4 Editorial outcome and exit (DRAFT)

**Player question:** Supported leave coverage?

| Answer | Result |
| --- | --- |
| Correct: "Mayor announces leave from campaigning and duties to seek help (H09)" | K13 |
| Retry: "Seeking help means the mayor has resigned" | Elliot: "Read the statement again." |

**Asset brief:** BG01 spring leave variant. Six sprite layers.

**Dependencies:** K12,H09 | **Output:** K13

---

### S14: Service sidebar (DRAFT)

**Chapter:** 5 | **Historical:** none (fiction) | **Date:** 8 May 2014  
**Play pattern:** spatial map of fictional city-service beats  
**Entry:** K13 | **Exit:** K14 to S15  
**sceneObjectiveAnswerHint:** "Label each fictional request as a follow-up lead, not proof of citywide failure."

#### S14.P1 Establish and arrival (DRAFT)

**Beat:** Alex keeps the S05 promise. Priya photographs a park permit signing, not a mayor cardboard cutout. Elliot calls twice; Alex ignores one call successfully.

Foreground: push pins. Midground: BG06 map table. Background: ordinary street through window. Camera: top-down slight angle.

**Dialogue:** Priya: "Permission first." Alex: "Revolutionary concept."

#### S14.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S14.O1 | Garbage route map overlay | Map left | context |
| S14.O2 | Fictional budget hearing question pin | Pin stack | context |
| S14.O3 | Fictional transit meeting request | Map right | context |
| S14.O4 | Tomás library hours tip sticky | Map margin | context |
| S14.O5 | Priya parks feature shot list | Camera bag | tool |
| S14.O6 | Service desk phone tree card | Map corner | tool |

#### S14.P3 Inspect and compare (DRAFT)

Pin O2, O3, O4 to districts; classify with O6 categories as civics beat, separate from H09 leave reporting.

#### S14.P4 Editorial outcome and exit (DRAFT)

**Player question:** Week-one emphasis while mayor away?

| Answer | Result |
| --- | --- |
| Correct: "Separate fictional service requests from the leave report" | K14 |
| Retry: "These fictional requests prove a citywide service fact" | Elliot: "That is a leap. Map the leads." |

**Asset brief:** BG06 map table. Six sprite layers.

**Dependencies:** K13 | **Output:** K14

---

### S15: Return briefing (DRAFT)

**Chapter:** 5 | **Historical:** H10 | **Date:** 30 Jun 2014  
**Play pattern:** public return Q&A matching  
**Entry:** K14 | **Exit:** K15 to S16; BR-CH5 at S15  
**sceneObjectiveAnswerHint:** "Match briefing questions to the public June 30 statement only."

#### S15.P1 Establish and arrival (DRAFT)

**Beat:** Elliot wants a "gotcha." Alex prepares a public-duty question the record can support. Sasha labels the audio cables with masking tape legends.

Foreground: cordon tape roll. Midground: BG03 return briefing layout. Background: blank screens. Camera: symmetrical press room.

**Dialogue:** Elliot: "One hard question." Nadia: "One fair one."

#### S15.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S15.O1 | June 30 return summary H10 | Table center | evidence |
| S15.O2 | Gate plan diagram | Easel left | context |
| S15.O3 | Council briefing pack | Stack | evidence |
| S15.O4 | Schedule whiteboard | Wall | tool |
| S15.O5 | Security cordon map | Floor clip | context |
| S15.O6 | Return Q&A cards | Tray | tool |

#### S15.P3 Inspect and compare (DRAFT)

Match O6 prompts to O1 bullets; discard private medical implications.

#### S15.P4 Editorial outcome and exit (DRAFT)

**Player question:** Return briefing covers?

| Answer | Result |
| --- | --- |
| Correct: "Mayor returns per June 30 public statement (H10)" | K15 + BR-CH5-A/B |
| Retry: "Return automatically restores every earlier power" | Nadia: "Check the Council record." |

**Asset brief:** BG03 return variant. Six sprite layers.

**Dependencies:** K14,H10 | **Output:** K15

---

## Chapter 6 card (DRAFT): "Vote, fog, futures"

**Transition:** S16.P1.

---

### S16: Candidate shuffle (DRAFT)

**Chapter:** 6 | **Historical:** H11 | **Date:** 12 Sep 2014  
**Play pattern:** mayoral vs ward race card sort  
**Entry:** K15 + BR-CH5-A/B | **Exit:** K16 to AS2  
**sceneObjectiveAnswerHint:** "Order filing dates before you name the switch."

#### S16.P1 Establish and arrival (DRAFT)

**Beat:** Sasha nearly merges both races on one map color. Alex separates them and lets Sasha stamp the correction herself. Elliot pitches headline: "BROTHER BOWL."

Foreground: filing stamp pad. Midground: BG01 election prep, ward map without candidate portraits. Background: debate schedule wall. Camera: slight dutch tilt corrected in P2.

**Dialogue:** Sasha: "Same last name, same map?" Alex: "Different ballot, different story."

#### S16.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S16.O1 | Sep 12 switch summary H11 | Desk center | evidence |
| S16.O2 | Ward map poster | Wall | context |
| S16.O3 | Candidate filing stamp | Foreground | tool |
| S16.O4 | Debate schedule card | Cork strip | context |
| S16.O5 | Mayor-race / Ward 2 explainer card | Folder | tool |
| S16.O6 | Priya lens chart | Bag flap | tool |

#### S16.P3 Inspect and compare (DRAFT)

Sort O1 into columns using O5; stamp O3 only on public filing marker.

#### S16.P4 Editorial outcome and exit (DRAFT)

**Player question:** Candidate change coverage states?

| Answer | Result |
| --- | --- |
| Correct: "Doug enters mayoral race; Rob leaves it and enters Ward 2 (H11)" | K16 -> AS2 |
| Retry: "Both brothers are now mayoral candidates" | Elliot: "Read the filing sheet." |

**Asset brief:** BG01 election prep. Six sprite layers.

**Dependencies:** K15,H11 | **Output:** K16

---

### AS2: Assignment selector (DRAFT)

**When:** After K16, before route. **Persist AS2-A or AS2-B atomically before R2A or R2B entry.**

| Option | Copy | Route |
| --- | --- | --- |
| AS2-A | Priya: "I need batteries and a parka. Field me." | R2A |
| AS2-B | Sasha: "They made me engineer again. Desk me." | R2B |

**Transition:** Hard cut to selected route P1.

---

### R2A: Election Night Field Kit (DRAFT)

**Design target:** post-opening milestone.  
**Chapter:** 6 fork | **Date:** 27 Oct 2014 before results (fiction)  
**Play pattern:** field bag packing for preliminary reporting  
**Entry:** K16, AS2-A persisted | **Exit:** KR2A to S17  
**sceneObjectiveAnswerHint:** "Pack for cold sidewalks and careful labels, not a victory party."

#### R2A.P1 Establish and arrival (DRAFT)

**Beat:** Priya tests batteries by the loading dock. Elliot's fog-machine remote is taped to a "DO NOT TOUCH" sign. Alex pretends not to see it.

Foreground: open field bag. Midground: BG01 staging corner. Background: election signage silhouettes, no candidate faces. Camera: medium two-shot space.

**Dialogue:** Priya: "Preliminary means cold fingers." Alex: "Preliminary means we label everything twice."

#### R2A.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| R2A.O1 | Battery brick charged | Shelf | tool |
| R2A.O2 | Ward map laminated | Bag | tool |
| R2A.O3 | PRELIMINARY label roll | Drawer | tool |
| R2A.O4 | Thermos | Counter | context |
| R2A.O5 | Elliot fog-machine remote (taped) | Coat pocket | context |
| R2A.O6 | Results call sheet blank | Clipboard | tool |

#### R2A.P3 Inspect and compare (DRAFT)

Pack O1, O2, O3, O6; leave O5 taped; O4 optional flavor prop.

#### R2A.P4 Editorial outcome and exit (DRAFT)

**Player question:** Field kit complete?

| Answer | Result |
| --- | --- |
| Correct: "Power, map, preliminary labels, blank call sheet" | KR2A -> S17 |
| Retry: "Champagne and fog machine" | Priya: "We are not that kind of paper." |

**Asset brief:** BG01 staging corner. Six sprite layers.

**Dependencies:** K16, AS2-A | **Output:** KR2A

---

### R2B: Newsroom Broadcast Kit (DRAFT)

**Design target:** post-opening milestone.  
**Chapter:** 6 fork | **Date:** 27 Oct 2014 before results (fiction)  
**Play pattern:** fix live desk wiring and templates  
**Entry:** K16, AS2-B persisted | **Exit:** KR2B to S17  
**sceneObjectiveAnswerHint:** "Wire the desk for preliminary labels, not certified victory."

#### R2B.P1 Establish and arrival (DRAFT)

**Beat:** Sasha's cable map looks like modern art. Nadia demands three different spellings of PRELIMINARY on screen. Cold pizza arrives as a prop, not a celebration.

Foreground: pizza box. Midground: BG01 election pre-show desk. Background: **LIVE** tape not yet applied. Camera: over desk.

**Dialogue:** Sasha: "Green cable is audio. Or video. I will check." Nadia: "Spell preliminary correctly or I sit on the remote."

#### R2B.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| R2B.O1 | HDMI cable (correct one) | Floor tangle | tool |
| R2B.O2 | RETURN label gaffe sticky | Monitor bezel | context |
| R2B.O3 | Preliminary results template | Desk center | tool |
| R2B.O4 | Sasha duct-tape legend card | Keyboard | context |
| R2B.O5 | Headset | Hook | tool |
| R2B.O6 | Cold pizza box | Foreground | context |

#### R2B.P3 Inspect and compare (DRAFT)

Connect O1 to desk; apply O3 template; fix O2 gaffe; O6 stays untouched gag.

#### R2B.P4 Editorial outcome and exit (DRAFT)

**Player question:** Broadcast desk ready?

| Answer | Result |
| --- | --- |
| Correct: "Live feed wired, preliminary template loaded, no certified language" | KR2B -> S17 |
| Retry: "Push FINAL RESULTS banner" | Nadia: "Certification is Thursday." |

**Asset brief:** BG01 election pre-show. Six sprite layers.

**Dependencies:** K16, AS2-B | **Output:** KR2B

---

### S17: Election night preliminary (DRAFT)

**Chapter:** 6 | **Historical:** H12 | **Date:** 27 Oct 2014  
**Play pattern:** preliminary labeling under fog-machine chaos  
**Entry:** K16 + KR2A or KR2B | **Exit:** K17 to S18  
**sceneObjectiveAnswerHint:** "Label every number preliminary until certification."

**Route callbacks:** KR2A adds field mittens on chair; KR2B adds triple-spelled PRELIMINARY on monitor.

#### S17.P1 Establish and arrival (DRAFT)

**Beat:** Elliot unveils the **fog machine** for "democracy atmosphere." It activates sideways. Priya gets one clean frame through haze. Sasha's stream says "PRELIMINARY" in three fonts.

#### S17.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S17.O1 | Preliminary results board H12 | Main monitor | evidence |
| S17.O2 | Ward tracker grid sheet | Side monitor | tool |
| S17.O3 | John Tory row label card | Grid overlay | context |
| S17.O4 | Rob Ford Ward 2 row label | Grid overlay | context |
| S17.O5 | Push draft phone | Desk | tool |
| S17.O6 | Fog machine remote (payoff) | Elliot hand | context |

#### S17.P3 Inspect and compare (DRAFT)

Apply PRELIMINARY ribbon to O1 and O5 draft; verify O3/O4 rows match O2 without certified language. O6 activates sideways fog gag (reduced-motion: static puff overlay).

#### S17.P4 Editorial outcome and exit (DRAFT)

**Player question:** Safe election night push?

| Answer | Result |
| --- | --- |
| Correct: "Preliminary reported: Tory mayor lead; Ford wins Ward 2 H12" | K17 |
| Retry: "Certified final totals" | Nadia: "Certification is Thursday. Breathe." |

**Asset brief:** BG01 election night. ff-079/080 optional silhouettes. Six sprite layers.

**Dependencies:** K16, KR*, H12 | **Output:** K17

---

### S18: Certified retrospective (DRAFT)

**Chapter:** 6 | **Historical:** H13 | **Date:** 30 Oct 2014  
**Play pattern:** certified vs preliminary compare + BR-CH6 + ending predicate  
**Entry:** K17 | **Exit:** K18, BR-CH6, END-A or END-B  
**sceneObjectiveAnswerHint:** "Confirm certified winners match preliminary board, then pick your closing emphasis."

#### S18.P1 Establish and arrival (DRAFT)

**Beat:** Dawn light. Broken chair has a support bolt at last. K01 notebook beside K18 draft. Elliot slides two career envelopes (fiction).

Foreground: certified print. Midground: BG01 dawn retrospective. Background: season collage wall with fog-machine receipt pinned as joke.

**Dialogue:** Elliot: "You survived our budget choices." Alex: "The city survived worse."

#### S18.P2 Interactive search (DRAFT)

| ID | Object | Position | Class |
| --- | --- | --- | --- |
| S18.O1 | Certified results sheet H13 | Desk center | evidence |
| S18.O2 | Diff highlighter | Tray | tool |
| S18.O3 | Notebook stack K01-K17 spines | Shelf | context |
| S18.O4 | BR-CH6 emphasis cards (Ward Close / Citywide Close) | Pin board | tool |
| S18.O5 | Elliot career letter (fiction) | Envelope | context |
| S18.O6 | Priya election night contact sheet | Wall | evidence |

#### S18.P3 Inspect and compare (DRAFT)

Compare O1 date/status to S17; same winners; no invented numeric changes. Select O4 emphasis; resolve BR-CH6.

#### S18.P4 Editorial outcome and exit (DRAFT)

**Player question:** Retrospective lede supported by certified results?

| Answer | Result |
| --- | --- |
| Correct: "Toronto elects Tory mayor; Ford wins Ward 2 seat (H13 certified)" | K18; apply END predicate |
| Retry: "Election-night estimates were already certified" | Nadia: "Dates matter. Status matters." |

**Asset brief:** BG01 dawn. ff-011/073/075 palette on wall logo only. Six sprite layers.

**Dependencies:** all K01-K17, H12,H13 | **Output:** K18

---

## Comparison keys (DRAFT)

| Scene | Required comparison | Retry explanation |
| --- | --- | --- |
| S01 | O5 published H01; O4 rumour; O6 correct charger | Rumour is not a source |
| S02 | O6 before O3; no post-May-17 dates | Schedules are not proof |
| S03 | Pair H01/H02 with uncertainty | No fake exclusive video |
| S04 | H03 denial scope only | Denial is not disproof of everything |
| S05 | Fictional civic pins | Not a citywide poll |
| S06 | Dedup sources; H03 dated | Duplicate fonts are not sources |
| S07 | H04 stub + prior denials | Slip is not a play button |
| S08 | Attribute H04; no public video | Recovery is not broadcast to player |
| S09 | Dated chain with unknowns | Summer fiction labeled |
| S10 | H05 plus prior denials | No private episode invention |
| R1A | H16 notice context | Not permanent closure |
| R1B | Cafe reaction fiction | Not allegation proof |
| S11 | AM quote once; PM apology; H15 | Sorry is not proof |
| S12 | H07/H08 delta; H18 montage | Not removal from office |
| S13 | H09 public leave | Not resignation |
| S14 | Fiction pins | Not service failure proof |
| S15 | H10 return public | Not full power restoration |
| S16 | H11 race sort | Keep person with office |
| R2A | Preliminary kit | Not victory party |
| R2B | Live desk labels | Not certified language |
| S17 | H12 preliminary labels | Certification later |
| S18 | H13 matches H12 winners | Status change only |

## Branch resolution and endings (DRAFT)

Six BR bits at S03, S06, S09, S12, S15, S18. AS1/AS2 do not affect END predicate.

**END-A: City Beat Survivor**

**END-A.P1:** Notebook beside Nadia note. Elliot offers city beat and fog remote: "You filed the chaos without becoming it."

**END-A.P2:** Wide BG01 dawn. Priya pins caption; Sasha labels cables; broken chair has bolt. Continue to credits.

**END-B: Patio Columnist**

**END-B.P1:** Tomás slides column assignment: "Write about the patio. Seriously."

**END-B.P2:** Wide BG04 morning. Cast waves off election hangover. Fade credits.

**Closing card (optional H14):** 1 Dec 2014 term transition. After endings only.

**256 paths:** 64 editorial x 4 assignment. All resolve same H13 history.

---

## Credits (DRAFT)

1. Ford Frenzy  
2. jr42 productions  
3. Torrona Haps (fictional paper)  
4. Fictional cast list  
5. H00-H18 acknowledgements  
6. Content policy line  
7. Minoo framework  
8. Play again

---

## Art brief summary

BG01 newsroom (+variants), BG02 City Hall corridor, BG03 briefing, BG04 cafe, BG05 gallery (reserved), BG06 map table. Routes reuse with distinct props. ff-044 S02 only. ff-011/073/075 title palette. ff-079/080 silhouettes only.

## Revision 2 migration (design)

Revision 1 boards lacked routes and used Ledger Gazette tone. Revision 2 renames paper to Torrona Haps, moves S11 to Nov 14 H15 beat, adds R1A-R2B and AS selectors. Runtime save migration not specified here.

## Review checklist (planned)

- [ ] 22 scenes, 4 panels each (88)
- [ ] 132 unique object IDs (108 shared + 24 route)
- [ ] K01-K18 + KR* chain acyclic
- [ ] H15 quote once in S11
- [ ] S01-S03 production-ready text
- [ ] Routes fully boarded (design)
- [ ] Owner DRAFT approval
