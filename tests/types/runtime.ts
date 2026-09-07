import {
  createRuntime,
  type Runtime,
  type RuntimeAction,
  type RuntimeCompleteAction,
  type RuntimeDuplicateEvent,
  type RuntimeEvent,
  type RuntimeFoundEvent,
  type RuntimeHintAction,
  type RuntimeHintEvent,
  type RuntimeOptions,
  type RuntimeResetAction,
  type RuntimeSelectAction,
  type RuntimeState,
  type RuntimeStepResult,
} from '@minoo/engine/runtime';
import type { Scene } from '@minoo/engine/scene';

const scene: Scene = {
  version: 1,
  id: 'clearing',
  width: 100,
  height: 100,
  objects: [{ id: 'tree', x: 0, y: 0, width: 10, height: 10, vocabularyId: 'tree' }],
  vocabulary: [{
    id: 'tree',
    text: 'tree',
    meaning: 'tree',
    dialect: 'engineering-fixture',
    source: 'engineering-fixture',
    attribution: 'engineering-fixture',
    permittedUse: 'testing-only',
    approval: { status: 'fixture' },
  }],
  completion: { type: 'find-all', requiredIds: ['tree'] },
};

const options: RuntimeOptions = { hintBudget: 3 };
const created = createRuntime(scene, options);
if (!created.ok) throw new Error('fixture scene should create a runtime');

const runtime: Runtime = created.runtime;
const select: RuntimeSelectAction = { type: 'select', objectId: 'tree' };
const hint: RuntimeHintAction = { type: 'hint' };
const reset: RuntimeResetAction = { type: 'reset' };
const complete: RuntimeCompleteAction = { type: 'complete' };
const action: RuntimeAction = select;

const step: RuntimeStepResult = runtime.step(select);
const state: RuntimeState = step.ok ? step.state : runtime.getState();
const events: readonly RuntimeEvent[] = step.ok ? step.events : [];

const found: RuntimeFoundEvent = { type: 'found', objectId: 'tree' };
const duplicate: RuntimeDuplicateEvent = { type: 'duplicate', objectId: 'tree' };
const hinted: RuntimeHintEvent = { type: 'hint', objectId: 'tree' };

// @ts-expect-error objectId must be a string.
const badSelect: RuntimeSelectAction = { type: 'select', objectId: 1 };
// @ts-expect-error unsupported action literal.
const unsupported: RuntimeAction = { type: 'inspect' };

void [
  runtime,
  select,
  hint,
  reset,
  complete,
  action,
  step,
  state,
  events,
  found,
  duplicate,
  hinted,
  badSelect,
  unsupported,
];
