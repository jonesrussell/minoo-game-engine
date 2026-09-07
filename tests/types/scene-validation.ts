import type { Scene } from '@minoo/engine/scene';

const validScene: Scene = {
  version: 1,
  id: 'clearing',
  width: 100,
  height: 100,
  objects: [{ id: 'tree', x: 0, y: 0, width: 10, height: 10, vocabularyId: 'tree' }],
  vocabulary: [{
    id: 'tree', text: 'tree', meaning: 'tree', dialect: 'engineering-fixture',
    source: 'engineering-fixture', attribution: 'engineering-fixture', permittedUse: 'testing-only',
    approval: { status: 'fixture' },
  }],
  completion: { type: 'find-all', requiredIds: ['tree'] },
};

// @ts-expect-error generated literal type rejects unsupported scene versions.
const unsupportedVersion: Scene = { ...validScene, version: 2 };
// @ts-expect-error generated literal type rejects an unsupported completion rule.
const unsupportedCompletion: Scene = { ...validScene, completion: { type: 'count', requiredIds: ['tree'] } };
// @ts-expect-error generated tuple type requires at least one object.
const emptyObjects: Scene = { ...validScene, objects: [] };

void [validScene, unsupportedVersion, unsupportedCompletion, emptyObjects];
