# Versioned replay specification

Status: implemented in #38.

This contract defines versioned replay logs for the headless runtime in
[runtime.md](runtime.md). It follows OWN-002 in
[package boundaries](../package-boundaries.md).

## Public API

```ts
import { captureReplay, replayLog, type ReplayLogV1 } from '@minoo/engine/replay';

const captured = captureReplay(scene, { hintBudget: 3 }, 'content-revision-1', actions);
if (!captured.ok) {
  // Present captured.errors from scene, option or action validation.
} else {
  const log: ReplayLogV1 = captured.log;
  const replayed = replayLog(log);
  if (replayed.ok) {
    const state = replayed.state;
    const events = replayed.events;
    const canonicalState = replayed.canonicalState;
  }
}
```

Exports:

| Symbol | Role |
| --- | --- |
| `captureReplay(scene, options, revision, actions)` | Validate ingress, run the action sequence once and return a frozen version-1 log |
| `replayLog(input)` | Parse unknown replay ingress, create a fresh runtime from the embedded snapshot and replay actions sequentially |
| `ReplayLogV1` | Version-1 envelope with embedded scene snapshot, options, null inputs and ordered actions |
| `ReplayDiagnostic` | Stable failure codes for malformed envelopes and unsupported versions |

`replayLog` accepts `unknown` ingress. Runtime and scene diagnostics are
returned unchanged when embedded content or an action step fails.
Their pointers remain relative to the scene, options or individual action;
`actionIndex` identifies the action within the log. Capture failures use the
same index convention. Content revisions identify caller records, not signatures
or proof of release approval.

## Version-1 envelope

| Field | Value |
| --- | --- |
| `version` | `1` envelope format version |
| `runtimeVersion` | `1` headless runtime contract version |
| `actionVersion` | `1` structured action shape version |
| `content.revision` | Caller-supplied nonblank content revision string |
| `content.scene` | Full validated scene snapshot used for replay |
| `options.hintBudget` | Runtime hint budget copied from capture or ingress |
| `inputs.seed` | `null` until time/random ports exist |
| `inputs.time` | `null` until time/random ports exist |
| `actions` | Ordered runtime actions replayed sequentially |

`content.scene.version` is the scene contract version. `content.revision` is a
separate caller-supplied content revision and is not derived from scene files.

## Requirements and scenarios

### RPL-VERSION-001: Supported versions and strict envelope shape

Replay ingress MUST declare supported `version`, `runtimeVersion` and
`actionVersion` values. Unsupported values MUST be rejected with
`REPLAY_UNSUPPORTED_VERSION`. Envelope objects MUST reject unknown properties,
missing required sections and wrong-shaped `content`, `options`, `inputs` and
`actions` fields. Because no time or random ports exist yet, `inputs.seed` and
`inputs.time` MUST both be `null`; non-null values MUST be rejected with
`REPLAY_INVALID_INPUTS`.

#### Scenario: supported version-1 log

- GIVEN a version-1 log with null inputs and a valid embedded scene snapshot
- WHEN `replayLog` is called
- THEN replay proceeds through runtime creation and action stepping

#### Failure example: unsupported runtime version

- GIVEN `runtimeVersion: 2`
- WHEN `replayLog` is called
- THEN replay fails with `REPLAY_UNSUPPORTED_VERSION` at `/runtimeVersion` and `actionIndex: null`

### RPL-SNAPSHOT-001: Embedded scene snapshot and provenance

A replay log MUST embed the full scene snapshot used for capture. Replay MUST
NOT depend on external scene files. `content.revision` MUST be a nonblank string.
Capture MUST deep-clone and freeze scene, options and actions so later caller
mutation cannot change the stored log. Fixture vocabulary provenance MUST remain
inspectable in the embedded snapshot.

#### Scenario: snapshot independence

- GIVEN a captured log and later mutation of the original scene object
- WHEN `replayLog` replays the stored log
- THEN transitions use the embedded snapshot, not the mutated source object

### RPL-DETERMINISM-001: Identical replay output

Given the same version-1 log, `replayLog` MUST return identical final state,
identical ordered events and identical canonical final-state JSON on repeated
runs. Canonical state JSON MUST sort object keys recursively and preserve array
order.

#### Scenario: repeated replay

- GIVEN the Journey engineering replay fixture
- WHEN `replayLog` is called twice
- THEN `canonicalState` and `events` are identical across both runs

### RPL-FAILURE-001: First failure only, no partial success

`replayLog` MUST create a fresh runtime from the embedded snapshot, then apply
actions sequentially without prevalidating later action shapes. The first
failing action MUST stop replay and return a zero-based `actionIndex` with the
underlying runtime or scene diagnostics. Envelope, embedded scene and option
failures MUST use `actionIndex: null`. Failed replay MUST NOT expose partial
state, events or canonical output as success.

#### Scenario: semantic failure before malformed later action

- GIVEN actions `[{ type: 'select', objectId: 'missing' }, { type: 'inspect' }]`
- WHEN `replayLog` runs
- THEN replay fails at `actionIndex: 0` with `RUNTIME_UNKNOWN_OBJECT`

#### Failure example: header rejection

- GIVEN `inputs.seed: 1`
- WHEN `replayLog` runs
- THEN replay fails with `REPLAY_INVALID_INPUTS` and `actionIndex: null`

## Diagnostics

| Code | Meaning |
| --- | --- |
| `REPLAY_UNSUPPORTED_VERSION` | Envelope, runtime or action version is not supported |
| `REPLAY_INVALID_LOG` | Replay ingress is not a supported structured envelope |
| `REPLAY_INVALID_CONTENT` | `content` shape or `content.revision` is invalid |
| `REPLAY_INVALID_INPUTS` | `inputs.seed` or `inputs.time` is not `null` |
| `REPLAY_INVALID_ACTIONS` | `actions` is not an array |

Scene and runtime diagnostics from `@minoo/engine/scene` and
`@minoo/engine/runtime` are returned unchanged when embedded content or an action
step fails.

## Exclusions

Persistence (#11), generated action-sequence tests (#39), hashing, external
content lookup, clocks, randomness, services, Studio integration and browser
rendering remain out of scope.

## Proposal trace

See [proposal 38](../proposals/38-versioned-replay.md).

## Verification

- Planned: `npm ci` with Node.js 24.13.1 and npm 11.8.0, then `npm run typecheck`, `npm test -- tests/unit/replay.test.ts`, and full `npm test`
- Executed on the PR candidate: Windows Node 24.13.1/npm 11.8.0 clean install,
  typecheck, 65 tests, production build, keyboard/touch browser checks,
  scene-validation browser bundle and repository links passed. A separate
  [replay browser bundle](../../scripts/test-replay-browser.mjs) compares one
  Node run and two Chromium runs of the Journey fixture, including ordered
  events. The PR/CI record exact tested commits.
- Evidence: [unit suite](../../tests/unit/replay.test.ts), [Journey replay fixture](../../tests/fixtures/replay/journey.json)
