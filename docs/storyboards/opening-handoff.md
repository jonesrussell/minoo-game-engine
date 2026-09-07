# Opening episode: implementation handoff

Issue #93. Status: complete draft for owner review, not approved shipping content.
Read the [campaign](campaign.md), [scene boards](full-game.md) and
[historical ledger](../research/ford-frenzy-history.md) together. The full-game
document owns S01.P1 through S03.P4 and all 18 opening object IDs; do not maintain
a second conflicting object list here. The selected draft keeps the assignment
desk, public City Hall workspace and deadline desk on 17 May 2013.

## Bounded build

Build S01-S03 as one standalone episode. No S04 asset, model service, account or
Studio connection is needed to finish it. Episode end offers review notebook,
replay episode in a separate session, credits or return to title. The campaign
continuation can remain unavailable. Display Ford Frenzy and jr42 productions.

All scenes use an original staged environment with separate findable prop layers.
BG01 newsroom is new artwork reused with a deadline lighting variant in S03.
S02 may adapt ff-044 as a City Hall composition reference. ff-011, ff-073 and ff-075 inform
title palette only; they are logos, not furniture or scene textures. Source art
candidate approval stays with #94/#104/#17. Placeholders support #9/#98/#99.

## Reviewable opening script

Alex arrives for a first major assignment at the fictional Ledger Gazette. Elliot
wants a useful account before deadline; Alex wants work solid enough to earn the
next assignment. The opening is after the first reports, not inside a secret
viewing or a reenactment of the original reporters' work.

S01: the assignment folder contains an unverified follow-up question; the published
report summary is attributed to its actual reporting source. Collect six props,
compare those two records and create K01 assignment triage. Alex's recorder is a
tool with no secretly acquired recording. The next action is checking public
chronology, not hunting a hidden copy of the video.

S02: a fictional public reading area organizes permitted summaries. Distinguish
the May 16 report and May 17 response (H01/H02) from fictional work schedules.
Create K02 with both dates and a clear limit: these materials do not independently
establish what happened privately. A made-up calendar entry cannot corroborate
drug use. Any unlabeled historical date in the art is a content-review failure.

S03: the newsroom is busier, the desk has changed, and Nadia's copy review gives
the deadline emotional weight. Pair the report and response with their proper
attribution. The valid account says reports appeared, the mayor denied allegations,
and this fictional desk has not independently viewed the video. Preserve all three
parts. The player chooses timely summary or explicit-unknowns emphasis, both
supported. Commit K03 and BR-CH1-A/B together, then the episode-complete screen.

Dialogue in the full-game boards is fictional. Final performance, character names
and visible source copy remain owner-review decisions, not implied approval here.

## Acceptance scenarios and issue traceability

| ID | Given / when / then | Delivery |
|---|---|---|
| FF-OPEN-001 | Given New Game, when S01 opens, then its six objects are available and K01 is absent. Finding one twice produces one find. | #9, #96; FF-SCN-001 |
| FF-OPEN-002 | Given six S01 finds, when the player confuses a report with direct verification, then feedback explains the distinction and preserves finds. Correct classification awards K01 once. | #9, #10, #43 |
| FF-OPEN-003 | Given K01, when S02 comparison completes, then K02 retains H01/H02 attribution and does not upgrade private-conduct certainty. May 24 and November facts are unavailable. | #98, #95; FF-HIST-001 |
| FF-OPEN-004 | Given K02, when S03 omits the response or claims direct viewing, then review shows the unsupported field and returns to comparison. No progress deletion or retry penalty. | #99, #106 |
| FF-OPEN-005 | Given a supported S03 account, when either chapter emphasis is confirmed, then K03 and that branch persist together and the episode completes once. | #99, #96, #11 |
| FF-OPEN-006 | Given a save after a find or editorial retry, when Continue runs, then the same scene, finds, hint remainder and notebook return. No duplicate award across the completion transition. | #11, #42; FF-SAVE-001 |
| FF-OPEN-007 | Given an incomplete scene, when its confirmed restart runs, then only that scene's working progress resets; earlier K outputs remain. Whole-game reset requires its own confirmation. | #105, #11 |
| FF-OPEN-008 | Given keyboard-only, touch or pointer input, when searching, comparing and choosing emphasis, then the same outcomes are reachable. Drag has a select-and-place equivalent. Focus returns after dialogs. | #8, #41, #106; FF-INPUT-001 |
| FF-OPEN-009 | Given zero hints left, when an editorial answer fails, then explanatory feedback is still available. Hints do not gate completion, accuracy or ending. | #10, #106 |
| FF-OPEN-010 | Given missing scene art, when loading fails, then retry/back controls and a clear asset error appear; no partially initialized progress is saved. | #37, #105; FF-UI-003 |
| FF-OPEN-011 | Given silent mode and reduced motion, when all scenes play, then no information requires sound, camera sway or a countdown. Deadline tension is narrative. | #107, #50 |
| FF-OPEN-012 | Given only opening assets, when K03 is committed, then episode completion and credits work without loading S04 or contacting Studio. | #12, #45; FF-CAM-009 |

## Handoff gates

The draft is ready for review, not a claim that game schemas already encode it.
#43 specifies comparison rules; #95 supplies generalized source references; #96
owns investigation state; #8/#97 render it; #37 owns assets; #105/#106 supply
navigation and HUD. Preserve headless deterministic replay and validate candidate
content before persistence. Do not put historical evidence into vocabulary fields.

Owner review covers placement, cast, tone and both chapter emphasis choices.
The qualified playable slice later supplies input, save/recovery and pacing
evidence. No screenplay or repository link check counts as a successful playtest.
