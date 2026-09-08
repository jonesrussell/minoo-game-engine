# Scene contract SDD pilot

This document records the issue 32 pilot. It applies one proposed change to the
scene contract, then shows how the behavior will be tested by issue 6.

## The same change in two workflows

The sample change is: add stable object IDs, logical bounds, vocabulary
references and a completion rule to the Journey scene contract. It is deliberately
small and contains no renderer, Studio, or schema-library decision.

| Flow | Artifacts for the sample change | Strength | Cost for this repository |
| --- | --- | --- | --- |
| Plain Markdown | One proposal, a spec section, and test links edited in place | Lowest setup; familiar Git review | The author must preserve IDs, distinguish proposed from executed checks, and keep history manually |
| OpenSpec | A change folder with `proposal.md`, delta specs, `design.md` and `tasks.md`; apply the tasks; archive the delta into the durable spec | Separates intent, behavior, implementation tasks and history; scenarios are directly testable | Adds a small folder lifecycle and requires the team to review/archive artifacts consistently |

The current official OpenSpec documentation describes a proposal, apply and
archive loop. A change folder keeps the proposal, delta requirements, design and
tasks together; archiving merges the delta into the durable spec and preserves
the change history. Its spec format uses requirements with Given/When/Then
scenarios and treats specs as behavior contracts rather than implementation
plans. See the [OpenSpec concepts](https://github.com/Fission-AI/OpenSpec/blob/main/docs/concepts.md),
[getting started guide](https://github.com/Fission-AI/OpenSpec/blob/main/docs/getting-started.md)
and [team workflow](https://github.com/Fission-AI/OpenSpec/blob/main/docs/team-workflow.md).

### Decision for this pilot

Choose plain Markdown in this repository. Do not install the OpenSpec CLI or
another SDD workflow during issue 32. The repository now has an executable
workspace and a Journey fixture preview, while scene schemas and authoring tools
remain backlog work. A small proposal plus a durable spec gives this project the
needed requirement IDs, examples, exclusions and evidence links with less setup
than a new tool lifecycle. The comparison remains recorded so a later issue can
revisit OpenSpec if repeated pilots show that generated scaffolding or
validation repays its setup cost.

The durable behavior lives in [the scene contract spec](specs/scene-contract.md).
The concrete sample proposal is [proposal 32](proposals/32-scene-contract.md).
For a new change, create a short proposal, update or add requirement scenarios,
list tasks, and link each task to requirement IDs. After implementation, record
actual checks in the proposal or linked PR.

## Review rules

- Requirement IDs are stable once published. A small fix updates the existing
  requirement and adds a regression scenario; it does not create a new process
  document for every button or wording adjustment.
- Planned checks are labeled `planned`. Only commands actually run at a named
  commit are labeled `executed`.
- Runtime behavior, structural validation, semantic validation and browser
  behavior are separate evidence. A JSON schema does not replace semantic or
  human review.
- Scene data remains standalone. Studio is an optional authoring boundary, and
  no Studio dependency belongs in the runtime contract.

## Short proposal template

```markdown
# Proposal: <change name>

Issue: #<number>
Status: proposed | implemented | archived

## Why
<Observable problem or outcome.>

## Scope and exclusions
- In scope: <behavior>
- Excluded: <renderer, Studio, content or other boundary>

## Requirements
- SCN-<AREA>-<NNN>: <MUST/SHALL behavior>
  - Scenario: GIVEN <state>, WHEN <action>, THEN <observable result>
  - Failure example: GIVEN <bad input>, WHEN <action>, THEN <diagnostic/result>

## Tasks
- [ ] <task> (SCN-<AREA>-<NNN>)

## Verification
- Planned: <test command or manual review>
- Executed at <commit>: <command and result>
- Evidence: <test/browser/review link>
```

## Ongoing game delivery

This plain Markdown SDD flow also governs game creation. Use the durable
[presentation contract](specs/game-presentation.md) and
[#143 proposal](proposals/143-structured-presentation.md). Before coding, link the
issue to requirement IDs, examples, exclusions and planned checks. Prefer existing
components/layouts and data changes; justify new shared behaviour in the proposal.
After implementation, reconcile specs with the delivered behaviour, record the
exact candidate and executed evidence, and update issues/dependencies on both
boards. Passing checks do not substitute for visual or playtest approval.
