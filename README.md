# Minoo Game Engine

A game framework designed for reliable agent authoring, with a small 2D browser runtime engine. **Minoo Journey** is the first game: find six objects, learn vocabulary, and restore part of a homestead. Development happens locally through chat.

**Status:** executable workspace and interactive Journey fixture preview. Full gameplay, scene schemas and authoring tools are still backlog work.

## Start here

- [Chat-based development](docs/chat-development.md)
- [Product scope](docs/product.md)
- [Architecture decision](docs/architecture.md)
- [Studio capability decision](docs/decisions/002-studio-game-capability.md)
- [Optional Studio integration roadmap](docs/studio-integration.md)
- [Roadmap and issues](docs/roadmap.md)
- [Project views and planning fields](docs/project-views.md)
- [SDD and tooling research](docs/research/sdd-and-engine-research.md)
- [Scene contract SDD pilot](docs/sdd-pilot.md)
- [Scene contract specification](docs/specs/scene-contract.md)
- [Content policy](docs/content-policy.md)
- [Contribution workflow](CONTRIBUTING.md)

## Projects

- [Engine Development](https://github.com/users/jonesrussell/projects/15)
- [Journey Delivery](https://github.com/users/jonesrussell/projects/16)
- [Milestones](https://github.com/jonesrussell/minoo-game-engine/milestones)

## Local development

Use Node.js **24.13.1** and npm **11.8.0**. From the repository root:

```sh
npm ci
npx playwright install chromium
npm run dev
```

Open http://127.0.0.1:5173. On Windows PowerShell, use `npm.cmd` and `npx.cmd` if script execution policy blocks the `.ps1` wrappers. Stop the server with Ctrl+C. An occupied port fails explicitly; use `npm run dev -- --port 5174` to select another.

Checks: `npm run typecheck`, `npm test`, `npm run test:e2e`, and `npm run check:repository`. The browser check builds the production game, starts an isolated preview server and verifies keyboard/touch flows. Screenshots are saved in `test-results/`.

`npm run build` produces `dist/journey`. Use `npm run preview` to inspect the static build locally. This package boundary is private source consumed by Vite, not a published engine library. [Setup details](docs/chat-development.md).

## Relationship to Minoo

Inspired by [Minoo's existing games](https://minoo.live/games). This is a separate engine and game implementation. Nothing here deploys to or changes minoo.live. Initial runtime requires no AI service, account, or API key.

## Licensing

Code license selection is pending in #5. No open-source license has been granted yet. Dictionary content, recordings and artwork retain their respective rights and must have separate provenance records.

## Future Studio capability

Minoo can supply game authoring within Waaseyaa Studio through an optional adapter. Studio supplies shared account/work coordination; Minoo supplies game contracts and execution. The runtime and local authoring remain independently usable. This is planned integration, not an implemented feature or a dependency of Studio's private MVP.
