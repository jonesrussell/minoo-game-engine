# Project views

The primary project contains every roadmap issue and tracker. First Game Delivery contains its delivery subset, including relevant authoring demonstrations and the Matcher comparison.

| View | Layout | Purpose |
|---|---|---|
| Full roadmap | Table | All work with phase, priority, workstream, effort and readiness |
| Delivery board | Board | Open implementation work by execution status; excludes phase trackers |
| Ready to start | Table | Open issues with satisfied prerequisites |
| Blocked work | Table | Open issues awaiting named dependencies |
| Decisions | Table | SDD, architecture, schema, renderer and MCP choices |
| Phase trackers | Table | Core and optional phase epics and their child progress |
| Framework and runtime | Table | Contract and runtime workstreams |
| Agent authoring | Table | Transactions, CLI and MCP work |
| In review | Table | Implemented work awaiting merge; merged issues leave this view |

First Game Delivery also provides Content and review, Release blockers, and Playtesting and quality views. Views are saved in GitHub. Phase is the planning axis; no date-based timeline is presented because dates have not been estimated.

Status is Todo, In Progress or Done. Readiness is Ready, Blocked, In review, Phase tracker or Complete. Priority and effort do not imply deadlines. Native issue dependencies and acceptance evidence are authoritative. Fields and labels must be updated after state changes; no automatic synchronization workflow has been installed yet.

## Optional integration views

Both projects add **Core delivery** (`is:open -label:integration:studio -label:type:epic`) and **Optional Studio integration** (`is:open label:integration:studio`) table views. Existing views remain available. Phase retains M0-M7 and adds S0-S2 with existing option IDs preserved. Priority P2 and the integration:studio label identify the optional track.

Both projects include all 13 new entries so the Journey example can be followed through its adapter and workflow prerequisites. The Studio readiness issue links to upstream prerequisites without changing Studio project scope.

## Investigative first game

Project 16 is now Minoo First Game - Delivery. Both projects include a Storyboards view for N0 and a Deferred Journey view. Core open-work views exclude the deferred label. The release-blocker filter follows the renamed Investigation alpha milestone. Full campaign boards and opening boards remain separate issues.
