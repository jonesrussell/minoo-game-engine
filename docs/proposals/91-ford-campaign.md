# Proposal 91: complete investigation campaign outline

Issue: [#91](https://github.com/jonesrussell/minoo-game-engine/issues/91)  
Status: fully outlined creative draft awaiting owner review  
Depends on: [#90 historical ledger](../research/ford-frenzy-history.md)  
Unlocks: #92 scene storyboards and #93 opening scene boards

## Purpose

Ford Frenzy needs a finite, reviewable campaign shape before scene boards, generalized content, and investigation progression bind stable scene IDs and clue outputs. The complete outline is [docs/storyboards/campaign.md](../storyboards/campaign.md).

## Scope

The campaign contains exactly six chapters and eighteen playable scenes, S01 through S18, with one K output per scene. Six binary chapter choices, BR-CH1-A/B through BR-CH6-A/B, alter fictional voice, sidebar emphasis, and Alex's career reflection. All 64 combinations resolve deterministically to END-A or END-B. Both endings preserve certified public history and provide supportive fictional resolutions.

The cast is fictional: Alex Chen, Elliot Vance, Priya D'Souza, Tomás Reyes, Nadia Okafor, and Sasha Bell. Public figures appear only through dated, attributed public events. The player does not originate the Star or Gawker scoop, access the unseen video, cause police action, control Council votes, or decide election results.

## Requirements

### FF-CAM-001: finite campaign shape

The campaign has exactly six chapters and eighteen scenes labeled S01-S18, three per chapter. K18 completes the campaign with no nineteenth required scene.

### FF-CAM-002: linear progression

The graph is the simple chain S01 -> K01 -> S02 -> K02 through S18 -> K18. Each scene requires the prior K output and prior chapter branch. Every scene has six finds and an editorial pass. A failed pass returns to review, preserves valid finds and earned outputs, and carries no retry penalty.

### FF-CAM-003: convergent branches

Each chapter ends with one binary choice at S03, S06, S09, S12, S15, or S18. The chosen branch appears in the next chapter's assignment sidebar. For example, BR-CH4-A/B appears in S13, not S11. Every choice opens the next chapter.

### FF-CAM-004: fixed historical outcomes

The ledger dates are mapped in campaign.md. S17 uses 27 October preliminary election-night reporting. S18 uses the 30 October declaration and names John Tory mayor and Rob Ford winner of Ward 2 Etobicoke North. No choice changes those outcomes. Use “leave” and “return” language for H09-H10.

### FF-CAM-005: player boundary on scoop and media

No scene gives the player the original video, portrays the player as its source, or makes the player cause police action, arrests, votes, or elections.

### FF-CAM-006: fiction and attribution separation

Notebook content labels public record, attributed allegation, or original fiction. Fictional cast dialogue is original. Public figures receive dated attributed paraphrases only. Unsupported integrity-process minutiae are excluded.

### FF-CAM-007: no permanent failure

An unsupported draft returns to its scene review with actionable notes. Valid finds and K outputs persist. There are no trust bands, relationship scores, hint penalties, or simulated relationship mechanics.

### FF-CAM-008: endings change reflection only

END-A is “Record of the city” when at least three of CH1-B, CH2-B, CH3-A, CH4-B, CH5-B, and CH6-B are selected. END-B is “People behind headlines” otherwise. Both endings contain two numbered shot descriptions, cast resolution, and the same historical outcomes.

### FF-CAM-009: opening slice boundary

S01-S03 remain implementable without S04-S18 assets. Later scenes remain outlined but production is pending.

### FF-CAM-010: candidate art reuse

Art references are candidates only pending owner selection. ff-011/073/075 refer to logo and civic palette, not desk textures. ff-044 refers to City Hall hallway, not a generic newsroom. ff-079/080 are non-combat silhouette candidates.

## Verification status

This is a documentation-only draft. Owner creative approval remains pending for branding, final dialogue, scene boards, candidate art, rights, and release copy. Historical dates and narrow events were integrated against #90. Actual repository checks are recorded in the PR.

## Acceptance scenarios (planned gameplay checks)

- FF-CAM-002: Given K02 is absent, when S03 entry is requested, then entry is refused. Given six finds but unsupported copy, when review fails, then finds remain and no K03 award occurs.
- FF-CAM-003: Given either BR-CH4 choice, when chapter five begins, then S13 receives the chosen sidebar and remains reachable. No earlier scene changes retrospectively.
- FF-CAM-004/005: Given any branch sequence, when S18 completes, then the same certified winners appear. Given May gameplay, when media is inspected, then the original video is unavailable.
- FF-CAM-007: Given repeated incorrect submissions, when the player corrects the draft, then completion works without an ending penalty.
- FF-CAM-008: Given any of the 64 binary sequences, when the ending predicate runs, then exactly one ending is selected. Three matching choices select END-A; two select END-B.
- FF-CAM-009: Given only opening assets, when S03 completes, then the episode ends without fetching S04 or contacting Studio.
