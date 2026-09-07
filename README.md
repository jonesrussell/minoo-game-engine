# Minoo Game Engine

A game framework designed for reliable agent authoring, with a small 2D browser runtime engine. **Minoo Journey** is the first game: find six objects, learn vocabulary, and restore part of a homestead. Development happens locally through chat.

**Status:** repository and delivery planning established; the game and runtime are not implemented yet.

## Start here

- [Chat-based development](docs/chat-development.md)
- [Product scope](docs/product.md)
- [Architecture decision](docs/architecture.md)
- [Studio capability decision](docs/decisions/002-studio-game-capability.md)
- [Optional Studio integration roadmap](docs/studio-integration.md)
- [Roadmap and issues](docs/roadmap.md)
- [Project views and planning fields](docs/project-views.md)
- [SDD and tooling research](docs/research/sdd-and-engine-research.md)
- [Content policy](docs/content-policy.md)
- [Contribution workflow](CONTRIBUTING.md)

## Projects

- [Engine Development](https://github.com/users/jonesrussell/projects/15)
- [Journey Delivery](https://github.com/users/jonesrussell/projects/16)
- [Milestones](https://github.com/jonesrussell/minoo-game-engine/milestones)

## Repository checks

Node.js 22 or later: run `node scripts/check-repository.mjs`. This checks the planning scaffold only. Runtime build, unit tests and browser tests are tracked in #2 and #3.

## Relationship to Minoo

Inspired by [Minoo's existing games](https://minoo.live/games). This is a separate engine and game implementation. Nothing here deploys to or changes minoo.live. Initial runtime requires no AI service, account, or API key.

## Licensing

Code license selection is pending in #5. No open-source license has been granted yet. Dictionary content, recordings and artwork retain their respective rights and must have separate provenance records.

## Future Studio capability

Minoo can supply game authoring within Waaseyaa Studio through an optional adapter. Studio supplies shared account/work coordination; Minoo supplies game contracts and execution. The runtime and local authoring remain independently usable. This is planned integration, not an implemented feature or a dependency of Studio's private MVP.
