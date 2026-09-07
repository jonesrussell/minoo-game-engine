# Agent instructions

## Mission and scope

Build the smallest reusable browser engine that supports Journey, then validate reuse with Matcher. Read README.md, docs/product.md, docs/architecture.md and the assigned issue before changing code.

## Working through chat

- The owner directs work through ChatGPT/Codex. Perform editing, commands and verification yourself when tools permit; provide results, links and the next concrete step.
- Work one bounded issue per branch and PR. Read dependency issues before starting. Resolve routine choices within the agreed scope; record material architecture decisions.
- Use issue acceptance criteria as the delivery contract. Reference the issue in the PR and report actual evidence, never planned checks as completed.
- After a dependency closes, check downstream issues and update blocked/ready labels. Keep project status aligned with actual progress.
- Develop locally through the Codex desktop app. Keep setup reproducible on Windows and checks runnable in Linux CI. The agent handles commands and editing; the owner directs and reviews through chat. Do not require a cloud coding environment or commit private machine paths or secrets.

## Architecture

- Proposed implementation: TypeScript; independent headless state transitions and versioned JSON scene definitions; browser rendering; a static deployable game.
- Shared engine code must not import Journey content. Use structured actions and stable IDs. Inject clocks/randomness if needed and record seeds/actions for replay.
- Agent edits must validate before persistence and support reversal. Scene definitions are data, never executable code.
- Build only capabilities needed by the current milestone. Defer neural rendering, multiplayer, native exports, a hosted model service and a custom conversational editor.

## Content

- Never invent Anishinaabemowin translations, pronunciation or claims of cultural approval.
- Use marked fixtures until approved content is supplied. Preserve dialect, source, permissions and review metadata; do not scrape or copy production datasets by default.
- Keep source-code licensing separate from content rights. Read docs/content-policy.md.

## Verification and completion

- Use Node.js 24.13.1 and npm 11.8.0. Install locked dependencies with npm ci.
- Checks: npm run typecheck, npm test, npm run build, npm run test:e2e, npm run check:repository. Browser tests include a production build and write screenshots to test-results/. Install Chromium first with npx playwright install chromium (add --with-deps on Linux).
- The interactive fixture shell is implemented. Full Journey gameplay, scene schemas and authoring commands remain separate issues; do not describe the shell as a completed game.
- UI work requires browser exercise and screenshot inspection. Include keyboard/touch behavior where affected. Record tested commit and failures.
- A green check does not prove learning quality, cultural accuracy or enjoyable play. Keep human acceptance explicit for release content.
- No deployment to minoo.live is part of routine work. Use the separate review/alpha host defined by its delivery issue.
