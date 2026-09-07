import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fitViewport } from '../../packages/engine/src/index.ts';

test('fits a wide scene in a square surface without distortion', () => {
  assert.deepEqual(fitViewport(960, 460, 480, 480), { scale: .5, x: 0, y: 125 });
});
test('centers a scene on a wider surface', () => {
  assert.deepEqual(fitViewport(100, 100, 400, 200), { scale: 2, x: 100, y: 0 });
});
test('rejects dimensions that would create an invalid canvas transform', () => {
  for (const value of [0, -1, NaN, Infinity]) {
    for (let i = 0; i < 4; i++) {
      const dimensions = [960, 460, 960, 460]; dimensions[i] = value;
      assert.throws(() => fitViewport(...dimensions as [number, number, number, number]), RangeError);
    }
  }
});
