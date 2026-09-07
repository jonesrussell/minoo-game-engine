# Contributing

Read AGENTS.md and select a ready issue. Use a focused branch and a PR referencing the issue. Keep engine behavior, game content and authoring tools separated. Follow the documented checks and include browser evidence for UI work.

Use Node.js 24.13.1 and npm 11.8.0. Run npm ci, npm run typecheck, npm test and npm run test:e2e. Install the test browser with npx playwright install chromium first. The browser command builds the game and exercises keyboard and touch flows. npm run check:repository checks documentation links only.

Use the PR template. Include content provenance for assets or language material. Record material design decisions in docs. Keep issue/project status current and use dependency links to sequence work.
