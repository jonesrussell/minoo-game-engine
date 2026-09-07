# ADR 002: Minoo as an optional Studio capability

Status: accepted by the owner, 2026-09-07. This decision authorizes the architecture and planning direction. Integration implementation remains gated by the issues below.

Keep Minoo independently usable. Studio can eventually supply the authoring workspace around it through a small, optional adapter. Studio owns account and work coordination; Minoo owns game meaning and execution. Studio's current private MVP has no dependency on this integration.

## Repository evidence

Inspected Studio main at `7166b2cba52fdf30eab8c3347a823589cd12b9d3`, Minoo main at `5c3a04a133f446f855b734841af7332f24147350`, and open Minoo PR #23 at `ecf9b9aa8e1d00436a4548065f5ae28d6140d9d2`. These are snapshots, not claims about unmerged work elsewhere.

| Concern | Verified Studio capability | Reuse and missing contract |
|---|---|---|
| Accounts | OAuth provider/subject identities, sessions, explicit approver allowlist, CSRF protection. | Reuse identity. Project membership and project-scoped permission remain work in #14. This is not yet a full account platform. |
| Projects | Configured target directory for Framework dry-run. No saved-project implementation in this source tree. | Studio #15 owns saved projects. Later attach an opaque Minoo artifact reference to a Studio project; do not create Minoo accounts or a second dashboard. |
| Revisions | Blueprint/manifest digests reject stale decisions. SQLite stores immutable decision receipts, not editable document history. | Studio #15 plans revisions and conflict handling. Studio owns history/storage; Minoo owns canonical game bytes, compatibility and content digests. |
| Agent jobs | Bounded synchronous subprocess runner with timeout and output limits. No implemented model provider, durable queue or job lifecycle. | Reuse Studio's eventual jobs/proposal work in #6/#15/#16. A subprocess wrapper is not a sandbox or agent scheduler. |
| Approvals | Authenticated durable blueprint decisions; successful storage precedes approved preview. | Reuse interaction and identity controls. Existing receipt and persistence interfaces are explicitly typed to site blueprints, so game decisions need a separate supported subject contract. |
| Preview presentation | Escaped review page and post-approval `site:init --dry-run` artifact-plan presentation. | This is not a running app preview. #17 plans live preview. A game artifact descriptor, serving policy and optional presentation adapter are missing. |

Sources: [identity](https://github.com/waaseyaa/studio/tree/7166b2cba52fdf30eab8c3347a823589cd12b9d3/src/Identity), [review service](https://github.com/waaseyaa/studio/blob/7166b2cba52fdf30eab8c3347a823589cd12b9d3/src/Blueprint/BlueprintReviewService.php), [durable decisions](https://github.com/waaseyaa/studio/blob/7166b2cba52fdf30eab8c3347a823589cd12b9d3/src/Web/DurableBlueprintDecisions.php), [receipt interface](https://github.com/waaseyaa/studio/blob/7166b2cba52fdf30eab8c3347a823589cd12b9d3/src/Persistence/ReceiptStore.php), [preview interface](https://github.com/waaseyaa/studio/blob/7166b2cba52fdf30eab8c3347a823589cd12b9d3/src/Preview/BlueprintPreviewPort.php), [process runner](https://github.com/waaseyaa/studio/blob/7166b2cba52fdf30eab8c3347a823589cd12b9d3/src/Preview/Process/ProcOpenProcessRunner.php). Planned capabilities: [#14](https://github.com/waaseyaa/studio/issues/14), [#15](https://github.com/waaseyaa/studio/issues/15), [#16](https://github.com/waaseyaa/studio/issues/16), [#17](https://github.com/waaseyaa/studio/issues/17).

Minoo main contains planning and repository checks. PR #23 adds TypeScript/Vite workspaces, a viewport helper and a canvas Journey fixture with start, inspect-tree and reset controls. Its authoring package explicitly has no API. Game schemas, headless simulation, replay, asset manifests and transactional authoring remain planned. Sources: [engine](https://github.com/jonesrussell/minoo-game-engine/blob/ecf9b9aa8e1d00436a4548065f5ae28d6140d9d2/packages/engine/src/index.ts), [Journey](https://github.com/jonesrussell/minoo-game-engine/blob/ecf9b9aa8e1d00436a4548065f5ae28d6140d9d2/games/journey/src/main.ts), [authoring boundary](https://github.com/jonesrussell/minoo-game-engine/blob/ecf9b9aa8e1d00436a4548065f5ae28d6140d9d2/packages/authoring/README.md).

## Ownership and smallest boundary

Minoo must own scene/game schemas and migrations; actions and deterministic simulation; rendering and accessible input; asset manifests, loading and content provenance; save/replay formats; and structural, semantic and game-behavior validation. Studio may store their artifacts and display their results, but must not reinterpret game rules in PHP. Technical validation does not establish cultural or language approval.

Start with one proposed operation: **review an immutable game candidate**. Use versioned JSON files and a configured local Minoo CLI adapter, following Studio's subprocess separation without implementing `BlueprintPreviewPort`. No HTTP service, MCP dependency or generic plugin framework is needed for the first experiment.

Request: protocol version, request ID, candidate artifact reference/digest, optional base digest, and requested preview profile. The candidate identifies its Minoo schema/runtime versions and asset digests. References resolve only within an operator-selected workspace. Studio authenticates and authorizes access; a caller-supplied principal is not authority.

Response: matching request and candidate digests, explicit valid/refused/failed outcome, Minoo-owned diagnostics `{code, pointer, message}`, validation evidence tied to the runtime version, and, on success, a static preview artifact reference, digest and entrypoint. Unsupported versions, timeouts and malformed output cannot become successful previews. Exact canonicalization and digest coverage need specification before coding; cover game data and asset content, not just filenames.

The operation writes only disposable output, never the source revision. Studio verifies the envelope and presents results. Minoo's CLI remains callable directly; its built game runs without Studio, PHP, accounts or model calls. The adapter depends on Minoo, never the reverse.

Initially open the preview separately. Later embedding needs a dedicated origin and constrained frame policy: Studio's current CSP has `default-src 'none'` and does not allow frames or scripts. Do not weaken the existing blueprint page to host arbitrary generated code. Initial game definitions are data consumed by a pinned runtime, not executable uploads. Process limits alone do not provide isolation.

Later, Studio owns proposal jobs and revision persistence. Minoo validates edits and produces candidate artifacts. Accepting a candidate requires a Studio-owned decision bound to the exact game digest, validation evidence and intended action, followed by an atomic expected-base revision check. Revalidate current permission on acceptance; a receipt ID is not authority. Preview approval, accepting an edit and publishing are separate actions. The existing blueprint receipt store cannot support this unchanged. Do not put games into `waaseyaa.site` to reuse it.

## One Journey example

Use the existing English clearing/tree fixture, with no invented vocabulary. Proposed authoring request: “Change the selected-tree heading to ‘You found the tree’.”

1. Minoo's future scene contract represents the existing tree with stable ID `tree` and its fixture label. The agent edits a candidate based on revision digest A, producing B. Today that heading is hardcoded in TypeScript, so this data representation is still missing.
2. The adapter reviews B. Minoo checks the schema, tree reference and fixture/content metadata, then produces a static preview and report bound to B. Studio displays the proposed label change and opens the preview.
3. The player starts, selects the tree and resets. Expected states match today's observable shell: `start/null`, `explore/null`, `explore/tree`, `start/null`. The future headless replay must produce those states independently of Studio or the renderer.
4. Once generic game decisions exist, an authorized acceptance saves B only if A is still current. A concurrent revision C causes a conflict; changing B invalidates its review. A missing tree reference yields a Minoo diagnostic and no acceptable candidate. Storage failure cannot display a successful acceptance. Reject/cancel preserves A.

**Evidence today:** reran `npm run test:e2e` on PR #23 with Node 24.13.1/npm 11.8.0. Production build, desktop keyboard and touch interactions, state inspection, reset/focus, layout and console checks passed. Inspected the desktop screenshot. This proves the standalone fixture interaction, not data-driven editing, deterministic replay or Studio integration.

Studio's [exact-head hosted CI](https://github.com/waaseyaa/studio/actions/runs/34148752755) passed 246 tests and 1,012 assertions. Reviewed its durable journey test, including storage failure and receipt retrieval. That test uses fake OAuth and a preview stub; it does not prove a live provider or Minoo integration. Studio tests were not rerun locally. Some older M0 acceptance text predates durable decisions; the current source and CI take precedence for this comparison.

## Phased integration plan

1. **Independent Minoo foundation:** finish the existing local workspace review, scene contract, headless actions/replay and validated authoring. Exit: the tree-label example works from the CLI and standalone browser. No Studio dependency.
2. **Optional read-only experiment:** agree the review envelope and build one local adapter with a separate preview link. Exit: one real candidate preview plus version, invalid-input, timeout and digest-mismatch refusals; source remains unchanged. Removing the adapter leaves Studio's private MVP unaffected.
3. **Shared Studio workflow:** after Studio's project/revision/job contracts stabilize and its private MVP is accepted, reuse them for Minoo candidates. Add the game decision subject and revision check. Exit: the example survives reopen, conflicting edits, job retry and cross-project access checks without duplicate acceptance.
4. **Preview presentation and publishing:** add isolated embedding only if useful. Publishing gets its own explicit authorization and artifact contract. Exit: Studio-produced and directly built games run from the same standalone artifact, with no Studio service needed during play.

This is an accepted architecture and a worked contract example. Full integration proof remains an implementation gate, not a completed claim. See the [optional Studio roadmap](../studio-integration.md) for issues, milestones and external gates.
