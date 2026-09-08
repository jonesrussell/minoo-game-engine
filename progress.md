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

Issue136: S01 opening dialogue, visual connector comparison, result receipt, optional sound and warm sprite lighting. Source scene/action/save semantics unchanged. First browser attempt caught a test case mismatch against CSS-uppercase Cable A; corrected assertion case sensitivity. Qualification in progress.

Issue138: tracked character presentation order #138 -> #139 -> #140 in GitHub native dependencies and roadmap. Opening conversation uses transient index, unchanged session/save actions, visible speaker and optional portraits. Qualification pending portrait alpha verification.

Issue143: owner approved full-screen Toronto composition on 2026-09-07. Branch feat/143-toronto-presentation base2879c8f. Parent owns assets/preparation, positions, docs and integration; renderer40 owns game presentation code/data; content95 owns browser test updates. Existing save action IDs and revision preserved. New background has no painted UI/characters/collectibles. Qualification pending.

Issue143 integration: replaced the first incomplete worker's handwritten structural
validation with canonical strict Ajv; extracted reusable HUD and accepted-event
reactions. Fixed hidden keyboard controls, stale background lettering, portrait
backdrop, HUD target labels and direct search entry. Interrupted an obsolete
browser run stuck on hidden controls; added 20s browser action/navigation timeouts.
Latest integration production pointer/touch/keyboard and recovery run passed;
102 unit tests passed. Inspected desktop/phone play and desktop dialogue captures.
Source/prompt/background provenance recorded in toronto-runtime-01. Exact-candidate
review/CI pending. No final artwork or release approval is inferred.

Candidate01391c7: exact production assignment/recovery checks passed for pointer,
touch and keyboard with no console or external-request errors; bundled game
client passed and final captures inspected. Independent approval_record review
found no substantive issue. Hosted run34186813595 passed all required checks.
The subsequent documentation-only record reconciles delivered scope; human
playtest, final art, #139 expressions and #140 closing/history remain open.

Issue147: fix branch fix/147-search-input from merged ce59e4b. Capture input
intent separately from focus; gate cursor and location overlay together. Parent
owns main/layout/spec and regression checks. Existing scene/action/save semantics
unchanged. Qualification planned: pointer/touch/keyboard switching and modal
return, then production assignment/recovery.
Issue139: expression catalog and per-beat selection are declarative and schema-validated. S01 uses Elliot neutral, Alex annoyed, and Elliot amused; inactive characters remain neutral. Expression image failure retries neutral once, then exposes the visible name fallback. Browser qualification adds phone/reduced-motion variant retry and both-failure fallback checks; no browser suite claim is made here.

#139 qualification: 104 unit tests passed; build/typecheck, framework browser/replay checks and repository checks passed. Ford mouse/touch/keyboard assignment suite passed on expression implementation; final expanded expression suite and independent review recorded in the PR. Six RGBA candidates inspected together against dark backgrounds; source PNGs and alpha-cleanup provenance preserved. Owner character acceptance remains pending.
