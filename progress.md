Original prompt: ok move onto #2

Current owner correction #130: keyboard access must preserve searching. Replaced
direct object buttons with a free scene cursor, broad location announcements,
fine/coarse arrow movement and explicit inspection. Movement never selects targets
or consumes hints; modal focus and normal Tab exit remain available. Production
pointer/touch/keyboard completion and empty-space checks passed.

Issue #2: npm workspaces, pinned tooling, real checks and an interactive browser shell.
Use original geometric fixture art and English labels. Scene schemas, full gameplay and authoring commands remain later issues.

Implemented npm workspace boundaries, a viewport helper, original canvas art and an accessible DOM control strip. Added real unit tests and a Playwright production-build flow for keyboard, touch, reset and browser errors.

Verification: clean npm ci, typecheck, three unit tests, production build and Chromium desktop/touch-sized flows passed on Windows with Node 24.13.1 and npm 11.8.0. Inspected both screenshots. The bundled Develop Web Game client also passed start plus Space-to-inspect; text state matched the highlighted tree and no browser error file was emitted. Screenshots are in docs/evidence and test-results (ignored).

Next: #3 adds executable GitHub CI and artifact delivery; #6 defines scene contracts. Authoring package is deliberately a reserved boundary with no placeholder commands. No approved language content or full game mechanics exist yet. Linux setup is documented, not yet qualified by executable CI.

Current request: build the first playable S01 checkpoint after artwork approval. Parent owns browser shell, public renderer adapter integration and browser evidence. S02 and S03 remain later work.

S01 playable candidate 85311ad: 88 unit tests, existing Journey production/browser/validation/replay checks, repository checks and Ford production pointer/touch/keyboard completion passed. Required texture abort/retry and corrupt-save preservation passed. Inspected title, scene and result screenshots; bundled game client passed. Integrated reviewed prerequisites at36c5a48 without code delta. Next: owner playtest, proper connector visuals, occlusion/search balancing, then S02/S03. Broader parent issues remain open.

Owner request: remove source cards from the game. Removed screens, buttons, classification badges and the completion gate; kept research metadata. Changed scene revision to prevent silently reinterpreting earlier saves.

Owner clarification #128: restore source checking through a fictional embedded Hogtown Howler clipping, meaningful reading choice and retry. Remove real press identities/links from shipped data and credits. No external requests during gameplay.

Owner correction #134: Toronna Haps spelling in current copy and storyboards; title art uses a separate corrected derivative, original provenance retained. No gameplay or save format changes.
