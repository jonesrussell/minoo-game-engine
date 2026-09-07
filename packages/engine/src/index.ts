/** Fit a logical scene inside a surface without stretching it. */
export function fitViewport(sceneWidth: number, sceneHeight: number, width: number, height: number) {
  if (![sceneWidth, sceneHeight, width, height].every(n => Number.isFinite(n) && n > 0)) {
    throw new RangeError('Scene and surface dimensions must be finite and positive.');
  }
  const scale = Math.min(width / sceneWidth, height / sceneHeight);
  return { scale, x: (width - sceneWidth * scale) / 2, y: (height - sceneHeight * scale) / 2 };
}
