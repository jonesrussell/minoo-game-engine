# Proposal: reusable, data-driven Ford Frenzy presentation

Issue: #143
Status: implementation candidate; owner approved the visual direction in #142.

## Why

The next visual pass must establish reusable game screens instead of repeating
hardcoded dialogue, HUD and layout code for every scene.

## Scope and exclusions

Apply [the presentation spec](../specs/game-presentation.md) to S01 while implementing
the selected composition. Owner visual approval in #142 remains a prerequisite
for that visual implementation. The linked implementation PR records runtime changes and qualification.
No new account platform, Studio prerequisite, runtime model service or speculative
framework/plugin rewrite is included.

## Tasks

- [x] Extract required components, shared styling and layouts (PRES-001).
- [x] Define canonical presentation schema, generated types, declarative S01
      dialogue/configuration and reference validation (PRES-002).
- [x] Introduce an explicit state/view-model and typed reaction boundary (PRES-003).
- [x] Define teardown, transient state and save/replay compatibility (PRES-004).
- [x] Integrate separate approved artwork and editable accessible controls
      with the existing renderer (PRES-005).
- [x] Prove reuse with alternate content and record requirement-linked evidence
      at the implementation candidate (PRES-001 through PRES-005).

## Verification

Qualification: 102 unit tests passed, including schema drift, invalid references,
reaction boundaries and old-save compatibility. Production pointer/touch/keyboard
assignment completion and recovery scenarios passed during integration. The PR
records the immutable candidate, independent review and hosted checks. Final
visual/playtest acceptance remains human review; the new plate is a runtime candidate.
