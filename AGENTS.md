# Agent instructions

## Mission and scope

Build the browser game framework for the Toronto investigative hidden-object first game, then validate reuse with Matcher. Read docs/first-game.md; Journey is now a legacy fixture and deferred learning game. Read README.md, docs/product.md, docs/architecture.md and the assigned issue before changing code.

The product is a framework with a small runtime engine. Read docs/roadmap.md and the assigned phase tracker for current scope. Specs describe lasting behavior; issues describe delivery work. Use the plain Markdown flow in docs/sdd-pilot.md and the imports in docs/package-boundaries.md. Keep planned verification distinct from executed evidence. Do not install every research candidate by default.

## Working through chat

- The owner directs work through ChatGPT/Codex. Perform editing, commands and verification yourself when tools permit; provide results, links and the next concrete step.
- Work one bounded issue per branch and PR. Read dependency issues before starting. Resolve routine choices within the agreed scope; record material architecture decisions.
- Use issue acceptance criteria as the delivery contract. Reference the issue in the PR and report actual evidence, never planned checks as completed.
- After a dependency closes, check downstream issues and update blocked/ready labels. Keep project status aligned with actual progress.
- Use native GitHub dependencies for prerequisites and sub-issues for phase membership. Add work to the primary roadmap project and the relevant first-game subset. Reconcile Phase, Priority, Workstream, Effort and Readiness fields with labels when issues change. In-review work remains open until merged. Keep docs/roadmap.json aligned with scope changes.
- Develop locally through the Codex desktop app. Keep setup reproducible on Windows and checks runnable in Linux CI. The agent handles commands and editing; the owner directs and reviews through chat. Do not require a cloud coding environment or commit private machine paths or secrets.

## Architecture

- Proposed implementation: TypeScript; independent headless state transitions and versioned JSON scene definitions; browser rendering; a static deployable game.
- Follow docs/decisions/003-canonical-scene-schema.md: canonical JSON Schema Draft-07, strict non-mutating Ajv validation and generated TypeScript declarations. Experiments are not public engine APIs. Keep portable structural constraints separate from Minoo semantic checks; do not maintain parallel handwritten scene types.
- Shared engine code must not import Journey content. Use structured actions and stable IDs. Inject clocks/randomness if needed and record seeds/actions for replay.
- Agent edits must validate before persistence and support reversal. Scene definitions are data, never executable code.
- Build only capabilities needed by the current milestone. Defer neural rendering, multiplayer, native exports, a hosted model service and a custom conversational editor.

## Optional Studio integration

- Follow accepted docs/decisions/002-studio-game-capability.md and docs/studio-integration.md. Minoo owns game semantics and execution; Studio owns shared authoring coordination.
- Keep S0-S2 optional. Never add it as a prerequisite for M0-M7, local MCP or Studio private-MVP acceptance. Verify external Studio prerequisites before shared-workflow implementation.
- Do not put game definitions in waaseyaa.site or build duplicate account/project/job services. Keep the runtime and CLI independently usable.
- Preserve qualified external_dependencies in docs/roadmap.json and native cross-repository dependency links. An open upstream issue or fixture is not acceptance evidence.

## Content

- Distinguish dated historical facts, attributed allegations and fictional story beats. Keep source/rights/editorial records separate from gameplay completion. Do not invent private conduct or dialogue for real people as fact.
- Use a proper rendering engine with frame scheduling, drawing/sprites and asset lifecycle. #40 evaluates future 3D implications; HTML/SVG-only is not the first-game direction.

- Never invent Anishinaabemowin translations, pronunciation or claims of cultural approval.
- Use marked fixtures until approved content is supplied. Preserve dialect, source, permissions and review metadata; do not scrape or copy production datasets by default.
- Keep source-code licensing separate from content rights. Read docs/content-policy.md.

## Verification and completion

- Use Node.js 24.13.1 and npm 11.8.0. Install locked dependencies with npm ci.
- Checks: npm run typecheck, npm test, npm run build, npm run test:e2e, npm run check:repository. Browser tests include a production build and write screenshots to test-results/. Install Chromium first with npx playwright install chromium (add --with-deps on Linux).
- The fixture shell, @minoo/engine/scene, @minoo/engine/runtime and @minoo/engine/replay are implemented. Read docs/specs/runtime.md, replay.md and runtime-testing.md for their contracts. Full investigative browser gameplay, scene-driven rendering and authoring commands remain separate issues; do not describe the shell as a completed game. Regenerate scene types from the canonical schema and keep validation before external scene use.
- UI work requires browser exercise and screenshot inspection. Include keyboard/touch behavior where affected. Record tested commit and failures.
- A green check does not prove learning quality, cultural accuracy or enjoyable play. Keep human acceptance explicit for release content.
- No deployment to minoo.live is part of routine work. Use the separate review/alpha host defined by its delivery issue.
