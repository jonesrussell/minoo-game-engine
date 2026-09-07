# Develop through ChatGPT

## Intended workflow

You describe an outcome or select an issue. A repository-connected coding agent reads the project, edits files, runs checks and returns a PR with evidence. You review in chat and open the playable build. Ask for changes, or authorize a merge when satisfied. GitHub is the durable source of code, decisions and task status.

## Local setup

1. Open the local repository in the Codex desktop app.
2. Let the agent edit files, run commands and handle GitHub from chat. No separate editor is required.
3. For the current documentation scaffold, Node.js 22+ and Git are sufficient; verify with node scripts/check-repository.mjs.
4. After the tooling issue lands, use its pinned runtime, dependency installation and browser setup. Document commands that work on Windows and Linux CI. Never commit tokens or private machine paths.
5. Have the agent start the local development server and provide its browser URL for playtesting once the runtime exists.

Development runs on the owner's computer. GitHub stores code, issues and PRs and runs CI. Hosting the finished game is a separate release step. No cloud coding environment or custom OpenAI API integration is required.

The previously created cloud environment is unused. The owner selected local development on September 7, 2026.

## First implementation prompt

> Work on the issue titled "Scaffold TypeScript workspace and browser development commands" in jonesrussell/minoo-game-engine. Read AGENTS.md and the linked design documents. Implement its acceptance criteria in a focused branch, run the available checks, and open a PR. Report what works, what is still a placeholder, and the exact evidence. Keep the task limited to the issue.

## Daily prompts

- "Read the projects and select the next ready P0 issue. Implement it, verify it and give me a reviewable PR."
- "Review this PR against its issue. Exercise the browser flow and show the visual result."
- "Move that object away from the doorway. Check the target remains reachable with mouse, touch and keyboard."
- "Report milestone readiness using linked evidence; distinguish completed work, blockers and owner decisions."

## Definition of a useful handoff

Issue and PR links; concise behavior change; exact checked commit; checks and browser evidence; local playable URL and server instructions when the runtime exists; known limitations; next dependency. Do not substitute a screenshot for a playable review build.

## Current limitations

The runtime and browser checks are backlog work, not existing features. The repository scaffold can be checked immediately. Local playtesting becomes available after the executable workspace lands.
