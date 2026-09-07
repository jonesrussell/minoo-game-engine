# SDD and tooling for Minoo Game Engine

Research date: September 7, 2026. Recommendations are based on current primary documentation and the issue #2 implementation at ecf9b9aa8e1d00436a4548065f5ae28d6140d9d2. This is a documentation-based assessment, not a comparative benchmark or installation trial.

## Recommendation

Adopt a small spec-driven workflow before scene contracts and gameplay implementation. Pilot OpenSpec on issue #6. Keep the current TypeScript, Vite and Playwright foundation. Prefer a portable scene contract validated with Ajv, explicit state transitions, and replay/property tests. Evaluate PixiJS when implementing actual scene rendering, without committing to a renderer migration now.

The current repository has scope, architecture notes and issue acceptance criteria. It does not yet have a durable behavioral specification for scenes, actions, saves or authoring. Issue #2 is useful scaffolding, but its hard-coded canvas is not evidence that the engine contracts are settled.

## SDD tools

| Option | Verified capability | Fit for this project |
|---|---|---|
| Plain Markdown specs | No new tooling required; Git already versions documents | Lowest overhead, but linking requirements, changes and verification is our responsibility |
| OpenSpec | Change folders with proposals, requirements/scenarios, design and tasks; archive updates specs; Codex integration | Preferred pilot for our incremental, local workflow |
| GitHub Spec Kit | Spec, plan, tasks and implementation process; configurable workflows, presets and integrations | Strong alternative if we need more process automation across several projects |

OpenSpec's current documentation includes a proposal/apply/archive workflow and an expanded verification workflow. Its shared cross-repository stores are beta and unnecessary here. Our pilot should stay within this repository. [OpenSpec documentation](https://github.com/Fission-AI/OpenSpec)

Spec Kit's current documentation, updated in August 2026, describes an extensible process harness. Describing it simply as a rigid waterfall tool would be outdated. My preference for OpenSpec is a fit judgment, not evidence that Spec Kit produces worse code. [Spec Kit](https://github.github.com/spec-kit/)

## How we should work

1. Describe the observable behavior and exclusions in a short spec.
2. Define the data contract and concrete success/failure examples.
3. Link implementation issues to the relevant requirement IDs.
4. Write tests from the expected behavior, then implement a small slice.
5. Review the code and evidence against the spec. Update the spec when the intended behavior changes.

An issue tracks delivery. A spec remains the reference for behavior after the issue closes. Avoid copying the whole spec into every issue or loading every specification into every agent prompt.

Example requirement for Journey:

> JRN-FIND-002: Selecting an already found object must not change the found count or award completion again.

Example test: select object A twice, then find the remaining five objects. Expect six unique finds and one completion event. Also test the same behavior through a saved replay. The rule applies regardless of rendering library.

For small fixes, add a regression example to the existing spec. Do not require a large new planning document for every button adjustment. Specifications and tests cannot establish whether a scene is enjoyable or linguistically accurate; human playtesting and language review remain part of release acceptance.

## Libraries and software

| Need | Candidate | Recommendation and boundary |
|---|---|---|
| Portable scene contracts | JSON Schema and Ajv | First choice for #6. Validate file structure; implement cross-reference, bounds and approval checks explicitly. |
| TypeScript-first schemas | Zod | Alternative if authoring ergonomics outweigh a schema-first approach. Export JSON Schema and test the exported contract. |
| Action sequence testing | fast-check | Add in #7 to generate action sequences and minimize failures. Useful for hints, duplicate finds, replay and undo. |
| State orchestration | XState | Consider when parallel or hierarchical states become substantial. A pure reducer is enough for the first scene. |
| 2D rendering and assets | PixiJS | Best rendering-library candidate if sprites, asset loading or interactions exceed simple Canvas/DOM needs. |
| Complete browser game engines | Phaser, Excalibur | Alternatives if shipping a game becomes more important than owning the engine layer. No immediate migration. |
| Browser regression checks | Existing Playwright | Expand in #3 with CI, failure traces and reproducible screenshots. |
| Accessibility checks | axe-core with Playwright | Add automated checks, then retain keyboard, screen-reader and user testing. |
| Visual scene editing | Tiled | Optional later import source for object placement. Keep the canonical engine schema independent. |
| Agent connectivity | Official MCP SDK | Add later as an adapter to established authoring operations. CLI and MCP should invoke the same validated operations. |

Ajv validates JSON Schema. That does not automatically validate a reference against an external vocabulary collection or establish whether an object is usable on screen. Keep structural and semantic validation distinct. Generate TypeScript types from the chosen canonical schema rather than maintain two independent definitions. [Ajv](https://ajv.js.org/guide/getting-started.html)

Zod supports JSON Schema conversion, but some constructs, including transforms and custom types, cannot be represented directly. Do not silently weaken the exported schema to accommodate them. Choose one authoritative definition format. [Zod conversion documentation](https://zod.dev/json-schema)

fast-check supports model-based testing against a simplified model. Use an independent model of expected behavior, not a copy of the implementation. Save a failing seed and minimized action sequence as reproducible evidence. [fast-check model testing](https://fast-check.dev/docs/advanced/model-based-testing/)

XState provides state machines, statecharts and actor-based orchestration. Those are useful capabilities, but an additional state framework is not required to express the initial Journey rules. [XState](https://stately.ai/docs/xstate)

PixiJS supplies a scene graph, rendering, assets and pointer/touch support. It could sit beneath our game definitions and agent operations. This keeps the distinctive work focused on contracts, authoring and verification rather than recreating a graphics toolkit. [PixiJS](https://pixijs.com/8.x/guides/getting-started/intro)

Phaser is a broader game framework; Excalibur is a TypeScript 2D engine whose documentation still identifies it as pre-1.0. Both deserve consideration if our scope changes, but neither is necessary for six hidden objects. [Phaser](https://docs.phaser.io/phaser/getting-started/what-is-phaser), [Excalibur](https://excaliburjs.com/docs/)

Playwright supports screenshot comparisons, and its accessibility guide integrates axe-core. Pin the screenshot environment and review baseline changes. Pixel equality and an automated accessibility scan do not replace human review. [Visual comparisons](https://playwright.dev/docs/test-snapshots), [Accessibility testing](https://playwright.dev/docs/accessibility-testing)

Tiled supports object shapes and custom properties, making it a possible future placement tool. It should be optional because the owner wants to develop through chat. [Tiled objects](https://doc.mapeditor.org/en/stable/manual/objects/)

Official MCP SDKs are available, including TypeScript. MCP is an interface to operations, not the source of game rules. Stabilize inspect, validate, edit, undo and replay before exposing them to a client. SDK/client schema compatibility must be checked when implementing the adapter. [MCP SDKs](https://modelcontextprotocol.io/docs/sdk)

## Next steps for our backlog

- Before #6: pilot one short scene-contract spec with valid and invalid examples, stable requirement IDs and a schema decision. This need not delay #3.
- #3: run existing checks in CI and retain browser evidence. Consider Playwright Test's built-in reporting/fixtures if the custom runner becomes cumbersome.
- #6: choose canonical JSON Schema plus Ajv, then define scene, object and vocabulary-reference contracts. Include schema versioning.
- #7: implement pure action transitions and explicit replay inputs. Add generated action sequences with fast-check.
- #8: compare the same small scene in the existing renderer and PixiJS only if there is a concrete interaction or asset-management need. Include keyboard access, scaling and bundle cost in the decision.
- #13 and #14: transactional authoring operations, stale-revision checks and undo. Add MCP only when these operations are stable.

No dependencies, SDD tools or repository policies were changed as part of this research. Proposed choices should be validated with the first small implementation rather than treated as benchmarked conclusions.
