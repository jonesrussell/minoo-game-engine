# Develop through ChatGPT

## Intended workflow

You describe an outcome or select an issue. A repository-connected coding agent reads the project, edits files, runs checks and returns a PR with evidence. You review in chat and open the playable build. Ask for changes, or authorize a merge when satisfied. GitHub is the durable source of code, decisions and task status.

## Local setup

1. Open the local repository in the Codex desktop app.
2. Let the agent edit files, run commands and handle GitHub from chat. No separate editor is required.
3. Install Node.js 24.13.1 and npm 11.8.0, then run npm ci from the repository root. The version files pin Node; package.json and the lockfile pin tooling. Never commit tokens or private machine paths.
4. Run npx playwright install chromium, then npm run typecheck, npm test and npm run test:e2e. On PowerShell, npm.cmd and npx.cmd avoid execution-policy wrapper errors.
5. Have the agent run npm run dev and provide http://127.0.0.1:5173 for playtesting. Stop with Ctrl+C. Use -- --port 5174 if the default port is occupied.

Development runs on the owner's computer. GitHub stores code, issues and PRs and runs CI. Hosting the finished game is a separate release step. No cloud coding environment or custom OpenAI API integration is required.

The previously created cloud environment is unused. The owner selected local development on September 7, 2026.

## Linux CI setup

Select Node.js 24.13.1, install npm 11.8.0 if needed, then run:

```sh
npm ci
npx playwright install --with-deps chromium
npm run typecheck
npm test
npm run test:e2e
npm run check:repository
```

The e2e command builds production assets, starts its own server on an available port and stops it afterward. No separately running development server is required. Executable GitHub CI integration and artifact uploads remain issue #3; these commands are verified locally on Windows by #2.

## Example implementation prompt

> Work on the issue titled "Scaffold TypeScript workspace and browser development commands" in jonesrussell/minoo-game-engine. Read AGENTS.md and the linked design documents. Implement its acceptance criteria in a focused branch, run the available checks, and open a PR. Report what works, what is still a placeholder, and the exact evidence. Keep the task limited to the issue.

## Daily prompts

- "Read the projects and select the next ready P0 issue. Implement it, verify it and give me a reviewable PR."
- "Review this PR against its issue. Exercise the browser flow and show the visual result."
- "Move that object away from the doorway. Check the target remains reachable with mouse, touch and keyboard."
- "Report milestone readiness using linked evidence; distinguish completed work, blockers and owner decisions."

## Definition of a useful handoff

Issue and PR links; concise behavior change; exact checked commit; checks and browser evidence; local playable URL and server instructions when the runtime exists; known limitations; next dependency. Do not substitute a screenshot for a playable review build.

## Current limitations

The local preview supports start, inspect-tree and reset interactions using English fixtures. It is not a language lesson or completed hidden-object game. Full scene rules, persistence, hints, restoration and authoring commands remain backlog work. Test screenshots cover Chromium at desktop and touch-sized viewports, not a claim of Safari or physical-device testing.
