# Headless runtime specification

Status: implemented in #7.

This contract defines deterministic find-object gameplay for validated scenes.
It follows OWN-002 in [package boundaries](../package-boundaries.md) and extends
[SCN-COMPLETE-001](scene-contract.md) with runtime counting and completion.

## Public API

```ts
import { createRuntime, type Runtime, type RuntimeAction, type RuntimeState } from '@minoo/engine/runtime';

const created = createRuntime(scene, { hintBudget: 3 });
if (!created.ok) {
  // Present created.errors from scene or option validation.
} else {
  const runtime: Runtime = created.runtime;
  const result = runtime.step({ type: 'select', objectId: 'tree' });
  if (result.ok) {
    const state: RuntimeState = result.state;
    const events = result.events;
  }
}
```

Exports:

| Symbol | Role |
| --- | --- |
| `createRuntime(scene, options)` | Validate external scene data, deep-freeze a snapshot and return a session |
| `Runtime.getState()` | Read the current immutable session state |
| `Runtime.step(action)` | Apply one structured action and return state plus events or diagnostics |
| `RuntimeAction` | `select`, `hint`, `reset`, `complete` |
| `RuntimeEvent` | `found`, `duplicate`, `hint`, `completed`, `reset` |
| `RuntimeState` | `sceneId`, `foundIds`, `score`, `hintsUsed`, `hintBudget`, `completed` |
| `RuntimeDiagnostic` | Stable failure codes for invalid options or actions |

`createRuntime` accepts `unknown` scene ingress and uses `@minoo/engine/scene`
validation without coercion. Option validation is separate and returns
`RUNTIME_INVALID_OPTIONS` when `hintBudget` is not a nonnegative safe integer.
The game package chooses the hint budget; Journey uses three hints.

Replay in #38 will consume the same `createRuntime` + `step` sequence. This
issue does not define versioned serialized logs.

## Requirements and scenarios

### RTN-OPTIONS-001: Hint budget is explicit and bounded

The runtime MUST accept a nonnegative safe-integer `hintBudget` option. Invalid
options MUST be rejected at session creation with a stable diagnostic.

#### Scenario: valid budget

- GIVEN a validated scene and `hintBudget: 3`
- WHEN `createRuntime` is called
- THEN a session is created with `hintBudget: 3` and `hintsUsed: 0`

#### Failure example: invalid budget

- GIVEN `hintBudget: -1`
- WHEN `createRuntime` is called
- THEN creation fails with `RUNTIME_INVALID_OPTIONS` at `/hintBudget`

### RTN-ACTION-001: Structured actions only

The runtime MUST accept `select`, `hint`, `reset` and `complete` actions as plain
objects with exactly the documented own fields and no accessors. Unknown or wrong-shaped actions MUST return stable diagnostics and MUST
NOT change session state.

#### Scenario: supported select action

- GIVEN an active session
- WHEN `{ type: 'select', objectId: 'tree' }` is applied to a scene object
- THEN the step succeeds

#### Failure example: unsupported action

- GIVEN an active session
- WHEN `{ type: 'inspect' }` is applied
- THEN the step fails with `RUNTIME_INVALID_ACTION` at `/type` and state is unchanged

### RTN-SELECT-001: Unique finds increase score; duplicates do not

`select` MUST record the first find of a scene object, increase `score` by one
and emit `found`. Re-selecting the same object MUST emit `duplicate` and MUST
NOT change `score` or `foundIds`.

Selecting an unknown object ID MUST fail with `RUNTIME_UNKNOWN_OBJECT`.

`score` is the count of unique found scene objects. Objects outside
`completion.requiredIds` still count toward `score` but not toward completion.

#### Scenario: first find

- GIVEN no prior finds
- WHEN `select` targets `tree`
- THEN `score` is `1`, `foundIds` is `['tree']` and events contain `found`

#### Failure example: duplicate find

- GIVEN `tree` is already found
- WHEN `select` targets `tree` again
- THEN events contain `duplicate` and `score` remains `1`

### RTN-HINT-001: Hints reveal but do not find

`hint` MUST identify the first remaining ID in `completion.requiredIds` order
that is not yet found. Hints MUST NOT add finds or increase `score`. Each
successful hint increments `hintsUsed`. When `hintsUsed` equals `hintBudget`,
further hint requests MUST fail with `RUNTIME_HINT_EXHAUSTED`. Budget exhaustion takes precedence when both failures apply. When every
required ID is already found, hint requests MUST fail with
`RUNTIME_NO_HINT_TARGET`.

#### Scenario: ordered hint target

- GIVEN `requiredIds: ['tree', 'rock']` and `rock` is found
- WHEN `hint` is requested
- THEN the event targets `tree`

#### Failure example: exhausted budget

- GIVEN `hintBudget: 1` and one hint already used
- WHEN `hint` is requested again
- THEN the step fails with `RUNTIME_HINT_EXHAUSTED`

### RTN-COMPLETE-001: Completion is explicit, automatic and single-use

When the last required object is found through `select`, the runtime MUST set
`completed: true` and emit exactly one `completed` event for the run.

`complete` MUST succeed only when every `completion.requiredIds` entry is found.
If required targets remain, it MUST fail with `RUNTIME_INCOMPLETE`. After
completion, `complete` is idempotent and emits no additional `completed`
events.

Subset completion targets declared by the scene are supported.

#### Scenario: auto-complete on final required find

- GIVEN `requiredIds: ['tree']`
- WHEN `select` targets `tree`
- THEN `completed` is `true` and events end with one `completed`

#### Failure example: premature complete

- GIVEN a required object remains unfound
- WHEN `complete` is requested
- THEN the step fails with `RUNTIME_INCOMPLETE`

### RTN-POST-001: Post-completion select and hint behavior

After `completed` is `true`, `select` remains allowed. Additional finds update
`foundIds` and `score`; duplicate selects still emit `duplicate`. No further
`completed` events are emitted.

After completion, `hint` fails with `RUNTIME_HINT_EXHAUSTED` if the budget is spent; otherwise it fails with `RUNTIME_NO_HINT_TARGET` because no required
ID remains. `complete` remains idempotent.

### RTN-RESET-001: Reset starts a fresh run

`reset` MUST clear `foundIds`, `score`, `hintsUsed` and `completed`, emit
`reset`, and allow the same scene and options to complete again.

#### Scenario: fresh run after reset

- GIVEN a completed run
- WHEN `reset` is applied and the required finds are repeated
- THEN a new `completed` event is emitted once

### RTN-REPLAY-001: Deterministic transitions

Given the same validated scene, options and action sequence, `step` MUST return
identical final state and event sequences. Replay evidence in this issue uses
repeated `createRuntime` + `step` calls; versioned logs are #38.

### RTN-IMMUTABLE-001: Frozen rules and returned snapshots

`createRuntime` MUST deep-freeze the validated scene snapshot used for rule
lookup. Caller mutation of the original scene object or returned `foundIds`
arrays MUST NOT change subsequent transitions.

Returned `state` objects, `foundIds`, `events` and error arrays MUST be deeply
frozen for the caller.

## Diagnostics

| Code | Meaning |
| --- | --- |
| `RUNTIME_INVALID_OPTIONS` | Supply a nonnegative safe-integer `hintBudget` |
| `RUNTIME_INVALID_ACTION` | Use a supported structured action shape |
| `RUNTIME_UNKNOWN_OBJECT` | Select a scene object ID that exists in the frozen snapshot |
| `RUNTIME_HINT_EXHAUSTED` | Hint budget is spent for the current run |
| `RUNTIME_NO_HINT_TARGET` | Every required object is already found |
| `RUNTIME_INCOMPLETE` | Find all required objects before `complete` |

Scene validation diagnostics from `@minoo/engine/scene` are returned unchanged
when `createRuntime` rejects invalid scene ingress.

## Exclusions

Rendering (#8), persistence (#11), versioned replay logs (#38), generated
action-sequence tests (#39), Studio integration, clocks, randomness, network
services and game-specific presentation remain out of scope.

## Proposal trace

See [proposal 7](../proposals/7-headless-runtime.md).
