# Develop through ChatGPT

## Intended workflow

You describe an outcome or select an issue. A repository-connected coding agent reads the project, edits files, runs checks and returns a PR with evidence. You review in chat and open the playable build. Ask for changes, or authorize a merge when satisfied. GitHub is the durable source of code, decisions and task status.

## One-time cloud setup

1. Open [Codex cloud](https://chatgpt.com/codex) with your ChatGPT account.
2. Give its GitHub integration access to jonesrussell/minoo-game-engine. Local GitHub CLI authentication does not establish cloud integration access.
3. Create/select the repository's cloud environment. For the current documentation scaffold, Node.js 22+ and Git are sufficient; verify with node scripts/check-repository.mjs.
4. After the tooling issue lands, use its pinned runtime, npm ci and browser dependency setup. Store the actual setup steps in this document and the environment. Never paste tokens into prompts or committed files.
5. Run the cloud verification issue and attach its PR/check evidence.

Repository preparation does not prove that your cloud environment is connected. A normal chat without repository editing and execution tools is insufficient for the full workflow. No custom OpenAI API integration or API key is required by this engine plan.

Official references checked September 7, 2026: [cloud setup](https://learn.chatgpt.com/docs/cloud), [environments](https://learn.chatgpt.com/docs/environments/cloud-environment).

## First implementation prompt

> Work on the issue titled "Scaffold TypeScript workspace and browser development commands" in jonesrussell/minoo-game-engine. Read AGENTS.md and the linked design documents. Implement its acceptance criteria in a focused branch, run the available checks, and open a PR. Report what works, what is still a placeholder, and the exact evidence. Keep the task limited to the issue.

## Daily prompts

- "Read the projects and select the next ready P0 issue. Implement it, verify it and give me a reviewable PR."
- "Review this PR against its issue. Exercise the browser flow and show the visual result."
- "Move that object away from the doorway. Check the target remains reachable with mouse, touch and keyboard."
- "Report milestone readiness using linked evidence; distinguish completed work, blockers and owner decisions."

## Definition of a useful handoff

Issue and PR links; concise behavior change; exact checked commit; checks and browser evidence; playable URL when hosting exists; known limitations; next dependency. Do not substitute a screenshot for a playable review build.

## Current limitations

The runtime, browser checks and hosted preview are backlog work, not existing features. The repository scaffold can be checked immediately. Cloud integration/account availability must be verified in the signed-in account.
