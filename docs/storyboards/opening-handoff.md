# Opening episode: implementation handoff

Issue #93. **Status:** DRAFT for owner review, not approved shipping content.  
**Storyboard revision:** 2  
Read [campaign](campaign.md), [scene boards](full-game.md) and the [historical ledger](../research/ford-frenzy-history.md) together. Full-game owns S01.P1 through S03.P4 and all opening object IDs; do not maintain a second conflicting object list here.

## Bounded build

Build **S01-S03** as one standalone episode for **Ford Frenzy** by **jr42 productions**. The fictional paper name is **Torrona Haps** (exact spelling). No S04 assets, route scenes, model service, account or Studio connection is required. Episode end offers review notebook, replay episode in a separate session, credits or return to title. Campaign continuation may remain unavailable.

All scenes use original staged environments with separate findable prop layers. BG01 newsroom is new artwork reused with a deadline lighting variant in S03. S02 may adapt ff-044 as a City Hall composition reference. ff-011, ff-073 and ff-075 inform title palette only. Source art candidate approval stays with #94/#104/#17. Placeholders support #9/#98/#99.

**Out of scope for this slice:** AS1/AS2 selectors, routes R1A-R2B, S04-S18.

## Reviewable opening script

Alex arrives at **Torrona Haps** expecting patio openings and invoice filing. The previous mayor-beat reporter quit without forwarding their charger. Elliot assigns the Ford story because the broken chair is currently occupied by classifieds. The opening is after the first public reports, not inside a secret viewing or a reenactment of the original scoop.

**S01 Welcome to the Haps:** Search gear buried under takeout and invoices. Match the digital recorder to the correct charger (not the phone brick). Distinguish the attributed published report summary from the office rumour folder. Six distinct finds, not six identical paper cards. Award **K01** when the player identifies what the Haps can honestly chase tonight. Natural newsroom action, not a lecture about metadata.

**S02 Meanwhile at City Hall:** Public corridor work area with a jammed printer and press-kit pages. Build a May 16 / May 17 timeline only. No November international crush, no satellite trucks, no props dated after 17 May. Award **K02** with both dates and a clear limit: public materials show order of reports and response, not private proof.

**S03 We're Going With WHAT?:** Rearranged deadline desk. Six finds power a silly headline magnet layout while preserving accurate copy: reports allege, mayor denied on record, video not verified by this desk. Nadia's stamp beats Elliot's worst pun. Player chooses **BR-CH1-A Splash First** or **BR-CH1-B Lawyer Voice**; commit **K03** and branch together, then episode-complete screen.

Dialogue in full-game boards is fictional satire. Final performance, visible source copy and paper branding remain owner-review decisions.

## Running gags (opening slice)

Establish in S01-S03 for continuity later:

- Broken assignment chair (wobbles, caution tape by S03)
- Elliot's absurd headline pitches (rejected by Nadia)
- Printer / cable tech disasters (S02 jam, S03 HDMI-to-label-maker gag)
- Tiny Haps versus bigger desks (Elliot's international fantasies begin as jokes)

## Acceptance scenarios and issue traceability

| ID | Given / when / then | Delivery |
|---|---|---|
| FF-OPEN-001 | Given New Game, when S01 opens, then six objects are available and K01 is absent. Finding one twice produces one find. | #9, #96; FF-SCN-001 |
| FF-OPEN-002 | Given six S01 finds, when the player pairs the wrong charger or treats rumour as published report, then feedback explains and preserves finds. Correct triage awards K01 once. | #9, #10, #43 |
| FF-OPEN-003 | Given K01, when S02 comparison completes, then K02 retains H01/H02 attribution and rejects post-May-17 dates. May 24 and November facts are unavailable. | #98, #95; FF-HIST-001 |
| FF-OPEN-004 | Given K02, when S03 omits denial or claims direct viewing, then review shows unsupported field and returns to comparison. No progress deletion or retry penalty. | #99, #106 |
| FF-OPEN-005 | Given a supported S03 account, when either BR-CH1 emphasis is confirmed, then K03 and that branch persist together and the episode completes once. | #99, #96, #11 |
| FF-OPEN-006 | Given a save after a find or editorial retry, when Continue runs, then the same scene, finds, hint remainder and notebook return. No duplicate award across completion transition. | #11, #42; FF-SAVE-001 |
| FF-OPEN-007 | Given an incomplete scene, when its confirmed restart runs, then only that scene's working progress resets; earlier K outputs remain. Whole-game reset requires its own confirmation. | #105, #11 |
| FF-OPEN-008 | Given keyboard-only, touch or pointer input, when searching, comparing and choosing emphasis, then the same outcomes are reachable. Drag has a select-and-place equivalent. Focus returns after dialogs. | #8, #41, #106; FF-INPUT-001 |
| FF-OPEN-009 | Given zero hints left, when an editorial answer fails, then explanatory feedback is still available. Hints do not gate completion, accuracy or ending. | #10, #106 |
| FF-OPEN-010 | Given missing scene art, when loading fails, then retry/back controls and a clear asset error appear; no partially initialized progress is saved. | #37, #105; FF-UI-003 |
| FF-OPEN-011 | Given silent mode and reduced motion, when all scenes play, then no information requires sound, camera sway or a countdown. Deadline tension is narrative. | #107, #50 |
| FF-OPEN-012 | Given only opening assets, when K03 is committed, then episode completion and credits work without loading S04, routes or contacting Studio. | #12, #45; FF-CAM-009 |

## Campaign continuity notes (design, not implemented)

Revision 2 adds 22-scene campaign shape with AS1/AS2 and routes R1A-R2B. Opening handoff does not implement assignment persistence; parent issues own save schema. When campaign continues beyond S03, next scene is S04 with BR-CH1 sidebar.

## Handoff gates

Draft is ready for review, not a claim that game schemas already encode it. #43 specifies comparison rules; #95 supplies generalized source references; #96 owns investigation state; #8/#97 render it; #37 owns assets; #105/#106 supply navigation and HUD. Preserve headless deterministic replay and validate candidate content before persistence. Do not put historical evidence into vocabulary fields.

Owner review covers **Torrona Haps** branding, satirical tone, placement, cast and both BR-CH1 emphasis choices. Qualified playable slice later supplies input, save/recovery and pacing evidence. No screenplay or repository link check counts as a successful playtest.
