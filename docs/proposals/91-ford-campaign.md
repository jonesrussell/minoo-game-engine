# Proposal 91: complete investigation campaign outline

Issue: [#91](https://github.com/jonesrussell/minoo-game-engine/issues/91)  
Status: revision 2 storyboard approved by owner on 2026-09-07
Depends on: [#90 historical ledger](../research/ford-frenzy-history.md)  
Unlocks: #92 scene storyboards and #93 opening scene boards

## Purpose

Ford Frenzy needs a finite, reviewable campaign shape before scene boards, generalized content, and investigation progression bind stable scene IDs and clue outputs. The complete outline is [docs/storyboards/campaign.md](../storyboards/campaign.md).

## Scope

The campaign contains six chapters and eighteen shared scenes, S01 through S18,
with one K output per shared scene. Two binary assignment selectors add four route
scenes: AS1 after S10 and before S11, choosing R1A or R1B; AS2 after S16 and before
S17, choosing R2A or R2B. All four route boards have six objects and four panels.
The authored target is 22 scenes, 88 panels and 132 finds. A playthrough contains
20 scenes, 80 panels and 120 finds. Six binary editorial choices, BR-CH1-A/B
through BR-CH6-A/B, produce 64 combinations; the two independent assignment forks
produce four routes, for 256 complete combinations. All resolve to END-A or END-B.
Satire is the core fictional Haps voice, including deadline panic, broken gear and
the fog-machine broadcast. It is not a lesson in restrained journalism.

The cast is fictional: Alex Chen, Elliot Vance, Priya D'Souza, Tomás Reyes, Nadia Okafor, and Sasha Bell. Public figures appear only through dated, attributed public events. The player does not originate the Star or Gawker scoop, access the unseen video, cause police action, control Council votes, or decide election results.

## Requirements

### FF-CAM-001: finite campaign shape

The campaign has exactly six chapters and eighteen scenes labeled S01-S18, three per chapter. K18 completes the campaign with no nineteenth required scene.

### FF-CAM-002: shared progression with assignment forks

The shared path is S01 -> K01 -> S02 -> K02 through S10 -> K10, then AS1 and
exactly one of R1A/R1B, then S11 -> K11 through S16 -> K16, then AS2 and exactly
one of R2A/R2B, then S17 -> K17 -> S18 -> K18. Every authored scene has six
finds, four panels and an editorial pass. A failed pass returns to review, preserves
valid finds and earned outputs, and carries no retry penalty. Untaken route scenes
remain available only to a separate replay.

### FF-CAM-003: convergent editorial and assignment branches

Each chapter ends with one binary editorial choice at S03, S06, S09, S12, S15 or
S18. The chosen branch appears in the next chapter's sidebar. AS1 and AS2 are
separate assignment choices and do not alter the editorial ending predicate.

### FF-CAM-004: fixed historical outcomes and source chronology

The ledger dates are mapped in campaign.md. S11 is 14 November 2013 after the
afternoon apology and uses H15/H16. S12 is November 19 after the Ford Nation
cancellation report, using dated cards about November 13, 15 and 18; H18 remains
one-episode broadcast and cancellation context. H17 is a dated March 3, 2014 Kimmel
card, not a live May scene. S17 uses
27 October preliminary election-night reporting and S18 uses the 30 October
declaration. No choice changes those outcomes. Use “leave” and “return” language
for H09-H10.

### FF-CAM-005: player boundary on scoop and media

No scene gives the player the original video, portrays the player as its source, or makes the player cause police action, arrests, votes, or elections.

### FF-CAM-006: fiction and attribution separation

Notebook content labels public record, attributed allegation, or original fiction. Fictional cast dialogue is original. Public figures receive dated attributed summaries; the single reserved H15 quote may appear once under its source boundary. Unsupported integrity-process minutiae are excluded.

### FF-CAM-007: no permanent failure

An unsupported draft returns to its scene review with actionable notes. Valid finds and K outputs persist. There are no trust bands, relationship scores, hint penalties, or simulated relationship mechanics.

### FF-CAM-008: endings change reflection only

END-A is “City Beat Survivor” when at least three of CH1-B, CH2-B, CH3-A, CH4-B, CH5-B, and CH6-B are selected. END-B is “Patio Columnist” otherwise. Both endings contain two numbered shot descriptions, cast resolution, and the same historical outcomes.

### FF-CAM-009: opening slice boundary

S01-S03 remain implementable without S04-S18 assets. Later scenes remain outlined but production is pending.

### FF-CAM-010: candidate art reuse

Art references are candidates only pending owner selection. ff-011, ff-073 and ff-075 refer to logo and civic palette, not desk textures. ff-044 refers to City Hall hallway, not a generic newsroom. ff-079 and ff-080 are non-combat silhouette candidates.

### FF-CAM-011: Torrona Haps tone and opening chronology

The owner-selected fictional Torrona Haps is the local paper and the player-facing
newsroom. S01 is Welcome to the Haps, S02 is Meanwhile at City Hall, and S03 is
We're Going With WHAT?, all on May 17. S02 contains public corridor printer and
press-kit work and no November crowd material. Comedy may escalate through editor
panic, broken gear and broadcast props while historical chronology and attribution
stay explicit.

## Verification status

This is a documentation-only storyboard approval. The owner approved the revision 2 campaign structure and content on 2026-09-07. Candidate art, rights, final release copy, runtime implementation and playtest approval remain open; Torrona Haps ownership and satire direction are accepted. Historical dates and narrow events were integrated against #90. Actual repository checks are recorded in the PR.

## Acceptance scenarios (planned gameplay checks)

- FF-CAM-002: Given K10 is present, when AS1 is completed, then exactly one R1 route is entered and the alternate remains untaken. Given K16 is present, when AS2 is completed, then exactly one R2 route is entered before S17.
- FF-CAM-003: Given either BR-CH4 choice, when chapter five begins, then S13 receives the chosen sidebar and remains reachable. No earlier scene changes retrospectively.
- FF-CAM-004/005: Given any branch and route sequence, when S18 completes, then the same certified winners appear. Given May gameplay, when media is inspected, then the original video is unavailable and November material is absent.
- FF-CAM-007: Given repeated incorrect submissions, when the player corrects the draft, then completion works without an ending penalty.
- FF-CAM-008: Given any of the 64 binary sequences, when the ending predicate runs, then exactly one ending is selected. At least three matching choices select END-A; otherwise END-B.
- FF-CAM-009: Given only opening assets, when S03 completes, then the episode ends without fetching S04 or contacting Studio.
