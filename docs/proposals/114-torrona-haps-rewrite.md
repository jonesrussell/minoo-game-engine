# Proposal 114: Torrona Haps satire and route contract

Issue: [#114](https://github.com/jonesrussell/minoo-game-engine/issues/114)
Status: revision 2 documentation contract, owner approval pending
Depends on: [#90 research ledger](../research/ford-frenzy-history.md) and the H15-H18 press-events register
Canonical targets: [campaign outline](../storyboards/campaign.md) and [full-game boards](../storyboards/full-game.md)

## Purpose

Make the owner-selected fictional Torrona Haps the stable newsroom identity and
make satire a core game voice. The Haps is a small local paper competing with
worldwide media. Its escalating editor panic, broken gear and fog-machine election
broadcast are fictional comic beats around a sourced public chronology. This
contract supersedes conflicting linear and restrained-journalism wording in
proposals 91, 92 and 93 while preserving their IDs and canonical board paths.

## Stable shape

There are eighteen shared scenes, S01-S18, and two binary assignment forks. AS1 is
after S10 and before S11, selecting R1A or R1B. AS2 is after S16 and before S17,
selecting R2A or R2B. All four route scenes have six objects and four panels.
The authored target is 22 scenes, 88 panels and 132 finds. A playthrough visits 20
scenes, 80 panels and 120 finds. Six editorial binary choices remain 64 combinations;
the two independent route choices multiply this to 256 complete combinations and
two endings. The canonical boards remain the only scene and object inventory.

The opening is:

| ID | Date and title | Contracted beat |
| --- | --- | --- |
| S01 | May 17, **Welcome to the Haps** | Search broken gear, takeout and invoices; assemble the recorder charger and triage report versus rumour. |
| S02 | May 17, **Meanwhile at City Hall** | Search a public corridor printer and press kit using May 16-17 material. November crowds are unavailable. |
| S03 | May 17, **We're Going With WHAT?** | Assemble a silly but accurate headline and layout under deadline. |

S11 is November 14 after the afternoon apology and uses H15/H16. S12 is November
19 after the Ford Nation cancellation report, using dated cards about November 13,
15 and 18. H18 is a dated one-episode broadcast and cancellation card. H17 is a
dated March 3 Kimmel card. Neither is a live May scene.

## Requirements and acceptance scenarios

### FF-SAT-001: owner-selected newsroom and tone

Given the player enters the campaign, when the newsroom identity is shown, then it
is Torrona Haps and the local paper competes with worldwide media. Given a comic
beat, when it is staged, then it is original fiction such as broken gear, deadline
panic or a fog-machine broadcast and does not masquerade as a historical fact.

### FF-SAT-002: canonical opening path

Given a new run, when the player completes S01, then S02 opens with the May 17
public corridor printer and press-kit search. Given S02 is active, when scene data
is inspected, then November crowd material is unavailable. Given S03 is completed,
when the layout pass succeeds, then the sourced opening episode closes and the
first editorial choice is recorded.

### FF-SAT-003: assignment fork path

Given K10 is present, when AS1 is selected, then exactly one of R1A or R1B opens
before S11. Given K16 is present, when AS2 is selected, then exactly one of R2A or
R2B opens before S17. Given a route is completed, when the rejoin transition runs,
then S11 or S17 is reachable with the route output beside the shared K output.

### FF-SAT-004: restore and alternate route isolation

Given a save exists after AS1 or AS2, when Continue is used, then the selected route,
finds, hints and route output restore exactly once. Given the player starts a
separate replay, when the alternate route is chosen, then it does not overwrite the
completed route's notebook output or block the original shared path.

### FF-SAT-005: editorial branch and ending independence

Given any of the 64 editorial choice sequences, when the six choices are counted,
then the ending predicate selects exactly one ending. Given any of the four route
combinations, when S18 completes, then route choice changes only route callbacks
and banter. It cannot change the ending predicate or certified historical outcomes.

### FF-SAT-006: humor does not change source status

Given a comic prop or headline gag, when notebook status is evaluated, then it is
classified as original fiction, context or tool. It cannot upgrade an attributed
allegation, create the original video, invent a source conversation or establish a
private encounter.

### FF-SAT-007: source chronology

Given S11 is entered, when its date and historical card are shown, then the scene is
November 14 after the afternoon apology and uses H15/H16. Given S12 is entered,
when its cards are shown, then the retrospective is dated November 19 after the
cancellation report and its source cards cover November 13, 15 and 18. H18 is
limited to the one-episode Ford Nation broadcast and cancellation. Given H17 is
shown, when its card is opened, then it is dated March 3, 2014 and cannot be used
as a May or November live scene.

## Review and implementation boundary

This is a documentation contract. It does not implement gameplay, route persistence,
scene JSON, final art or owner approval. Production commitment remains S01-S03 only.
The full route boards are design targets and must be reviewed against the canonical
storyboards before implementation.
