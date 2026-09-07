# Proposal 93: opening storyboard handoff

Issue #93. Status: storyboard approved by owner on 2026-09-07; not approved shipping content.

Use the canonical S01-S03 board sequence from #92 and provide a bounded handoff with
FF-OPEN-001 through FF-OPEN-012 acceptance scenarios in
[opening handoff](../storyboards/opening-handoff.md). These scenarios refine the
existing experience contract; they do not implement a new schema or runtime.

Revision 2 fixes the owner-selected fictional setting and opening chronology:
S01 is **Welcome to the Haps**, S02 is **Meanwhile at City Hall**, and S03 is
**We're Going With WHAT?** All three occur on May 17, 2013. S02 is a public
corridor printer and press-kit search; November crowd material is unavailable in
the May scene. The Haps is a local paper competing with worldwide media, and
satire is a core fictional voice expressed through deadline comedy and newsroom
gear failures.

Scope: opening script, source boundaries, interface/save/retry failure cases,
issue traceability, three-scene-only asset loading. The opening handoff must leave
the later AS1/AS2 forks and route scenes to the canonical full-game boards. Excluded: completed gameplay,
final art, later campaign production, rights and release approval, runtime implementation,
playtest qualification and final shipping approval.

Owner storyboard review was completed on 2026-09-07. #12/#45 playable qualification,
art, rights, runtime and release checks remain open. Actual documentation checks and
integration review will be recorded in the PR.
