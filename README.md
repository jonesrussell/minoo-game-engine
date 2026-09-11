# Minoo Game Engine

A game framework designed for reliable agent authoring, with an independent runtime and a proper 2D rendering-engine boundary. The first game is **Ford Frenzy** by **jr42 productions**, a Toronto investigative hidden-object adventure set during Rob Ford's mayoral tenure and the crack-video scandal. Development stays local through chat.

**Status:** [public Ford Frenzy S01 work in progress](https://labs.waaseyaa.org/ford-frenzy/), independent scene/runtime/replay APIs and the preserved Journey fixture. S02, S03, production art and authoring tools remain backlog work.

The [first-game brief](docs/first-game.md) proposes the Toronna Haps opening and a separate full-campaign storyboard track. The owner has approved that opening slice — S01, S02 and S03 — as the project's MVP; see [the MVP definition](docs/mvp.md). The existing Journey preview is a legacy engineering fixture, not the new game.

- [MVP definition and delivery checklist](docs/mvp.md)
- [Public WIP and deployment record](docs/public-wip.md)
- [Chat-based development](docs/chat-development.md)
- [CI and downloadable evidence](docs/ci-evidence.md)
- [Product scope](docs/product.md)
- [Architecture decision](docs/architecture.md)
- [Package ownership and boundaries](docs/package-boundaries.md)
- [Canonical scene schema decision](docs/decisions/003-canonical-scene-schema.md)
- [Scene validation API](docs/scene-validation.md)
- [Headless runtime contract](docs/specs/runtime.md)
- [Versioned replay contract](docs/specs/replay.md)
- [Studio capability decision](docs/decisions/002-studio-game-capability.md)
- [Optional Studio integration roadmap](docs/studio-integration.md)
- [Roadmap and issues](docs/roadmap.md)
- [Project views and planning fields](docs/project-views.md)
- [SDD and tooling research](docs/research/sdd-and-engine-research.md)
- [Scene contract SDD pilot](docs/sdd-pilot.md)
- [Scene contract specification](docs/specs/scene-contract.md)
- [Content policy](docs/content-policy.md)
- [Ford Frenzy full campaign storyboard](docs/storyboards/full-game.md)
- [Ford Frenzy visual direction and concept](docs/art-direction.md)
- [Campaign outline and endings](docs/storyboards/campaign.md)
- [Toronna Haps rewrite contract](docs/proposals/114-torrona-haps-rewrite.md)
- [Historical timeline and sources](docs/research/ford-frenzy-history.md)
- [Contribution workflow](CONTRIBUTING.md)

## Projects

- [Engine Development](https://github.com/users/jonesrussell/projects/15)
- [Ford Frenzy - Delivery](https://github.com/users/jonesrussell/projects/16)
- [Milestones](https://github.com/jonesrussell/minoo-game-engine/milestones)

## Local development

For the Ford Frenzy first assignment, run `npm ci` then `npm run dev:ford` and open
http://127.0.0.1:5175. `npm run build:ford` produces the standalone
`dist/ford-frenzy` build; `npm run test:ford` exercises the complete assignment and
recovery through the production browser build. Source artwork is hash-verified and
copied during preparation, without editing pixels or duplicating tracked textures.

The commands below continue to run the separate Journey engineering fixture.

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

[Ford Frenzy SDD delivery plan](docs/ford-frenzy-delivery.md) tracks source artwork, generation, screens, HUD and opening-scene delivery.
