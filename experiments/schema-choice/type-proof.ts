import type { PilotScene } from './scene.generated.d.ts';
import { fixture } from './pilot.ts';

const scene: PilotScene = fixture();
const version: PilotScene['version'] = 1;
// @ts-expect-error Generated declaration rejects unsupported literal versions.
const wrongVersion: PilotScene['version'] = 2;
// @ts-expect-error Generated declaration requires numeric width, not a coerced string.
const wrongWidth: PilotScene['width'] = '960';
// @ts-expect-error Generated declaration preserves fixture-only literal metadata.
const wrongFixture: PilotScene['vocabulary'][0]['fixture'] = false;
// TypeScript cannot express numeric positivity or cross-record references here.
// These compile; the runtime validator/semantic pass must reject them.
const negativeWidth: PilotScene['width'] = -1;
void [scene, version, wrongVersion, wrongWidth, wrongFixture, negativeWidth];
