# Proposal: reusable, data-driven Ford Frenzy presentation

Issue: #143
Status: proposed implementation; architecture direction accepted by owner.

## Why

The next visual pass must establish reusable game screens instead of repeating
hardcoded dialogue, HUD and layout code for every scene.

## Scope and exclusions

Apply [the presentation spec](../specs/game-presentation.md) to S01 while implementing
the selected composition. Owner visual approval in #142 remains a prerequisite
for that visual implementation. No runtime changes are delivered by this proposal.
No new account platform, Studio prerequisite, runtime model service or speculative
framework/plugin rewrite is included.

## Tasks

- [ ] Extract required components, shared styling and layouts (PRES-001).
- [ ] Define canonical presentation schema, generated types, declarative S01
      dialogue/configuration and reference validation (PRES-002).
- [ ] Introduce an explicit state/view-model and typed reaction boundary (PRES-003).
- [ ] Define teardown, transient state and save/replay compatibility (PRES-004).
- [ ] Integrate separate approved artwork and editable accessible controls
      with the existing renderer (PRES-005).
- [ ] Prove reuse with alternate content and record requirement-linked evidence
      at the implementation candidate (PRES-001 through PRES-005).

## Verification

Planned: the spec's validation, headless and browser scenarios. Actual implementation
results belong to the implementation PR; none are claimed here.
