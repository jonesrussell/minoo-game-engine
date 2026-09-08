import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGameAudio } from '../../games/ford-frenzy/src/audio.ts';

class FakeStorage {
  value: string | null = null;
  getItem(): string | null { return this.value; }
  setItem(_key: string, value: string): void { this.value = value; }
}

class FakeGain {
  gain = { setValueAtTime: () => undefined, exponentialRampToValueAtTime: () => undefined };
  connect(): void {}
  disconnect(): void {}
}

class FakeOscillator {
  type = '';
  frequency = { setValueAtTime: () => undefined };
  started = 0;
  stopped = 0;
  connect(): void {}
  start(): void { this.started++; }
  stop(): void { this.stopped++; }
  disconnect(): void {}
}

class FakeDocument {
  hidden = false;
  listener: (() => void) | undefined;
  addEventListener(_type: string, listener: () => void): void { this.listener = listener; }
  removeEventListener(_type: string, listener: () => void): void { if (this.listener === listener) this.listener = undefined; }
}

class FakeContext {
  static instances: FakeContext[] = [];
  state = 'suspended';
  currentTime = 0;
  destination = {};
  oscillators: FakeOscillator[] = [];
  resumeCalls = 0;
  suspendCalls = 0;
  closeCalls = 0;
  constructor() { FakeContext.instances.push(this); }
  createOscillator(): FakeOscillator { const oscillator = new FakeOscillator(); this.oscillators.push(oscillator); return oscillator; }
  createGain(): FakeGain { return new FakeGain(); }
  async resume(): Promise<void> { this.resumeCalls++; this.state = 'running'; }
  async suspend(): Promise<void> { this.suspendCalls++; this.state = 'suspended'; }
  async close(): Promise<void> { this.closeCalls++; this.state = 'closed'; }
}

const scope = globalThis as any;
const originalContext = scope.AudioContext;
const originalStorage = scope.localStorage;
const originalDocument = scope.document;

test.afterEach(() => {
  scope.AudioContext = originalContext;
  scope.localStorage = originalStorage;
  scope.document = originalDocument;
  FakeContext.instances.length = 0;
});

test('does not construct AudioContext until unlock and safely ignores pre-unlock cues', () => {
  scope.AudioContext = FakeContext;
  const audio = createGameAudio();
  assert.equal(FakeContext.instances.length, 0);
  audio.play('find');
  assert.equal(FakeContext.instances.length, 0);
  assert.equal(audio.getState().available, false);
});

test('unlock creates and resumes context, then plays synthesized cues', async () => {
  scope.AudioContext = FakeContext;
  const audio = createGameAudio();
  await audio.unlock();
  assert.equal(audio.getState().available, true);
  audio.play('find');
  assert.equal(FakeContext.instances[0]?.oscillators.length, 1);
  assert.equal(FakeContext.instances[0]?.oscillators[0]?.started, 1);
  audio.dispose();
  assert.equal(FakeContext.instances[0]?.closeCalls, 1);
});

test('preferences are validated, persisted, and storage failures do not throw', () => {
  const storage = new FakeStorage();
  storage.value = JSON.stringify({ muted: true, volume: 9 });
  scope.localStorage = storage;
  const audio = createGameAudio();
  assert.deepEqual(audio.getState(), { muted: true, volume: 0.65, available: false });
  audio.setMuted(false);
  audio.setVolume(2);
  assert.deepEqual(JSON.parse(storage.value ?? '{}'), { muted: false, volume: 1 });
  scope.localStorage = { getItem: () => { throw new Error('denied'); }, setItem: () => { throw new Error('denied'); } } as unknown as FakeStorage;
  assert.doesNotThrow(() => { audio.setMuted(true); audio.setVolume(0.4); });
  audio.dispose();
});


test('volume zero and non-running contexts never create a cue', async () => {
  scope.AudioContext = FakeContext;
  const audio = createGameAudio();
  await audio.unlock();
  const context = FakeContext.instances[0]!;
  audio.setVolume(0);
  audio.play('find');
  assert.equal(context.oscillators.length, 0);
  audio.setVolume(0.5);
  context.state = 'suspended';
  audio.play('ready');
  assert.equal(context.oscillators.length, 0);
  audio.dispose();
});

test('visibility silence stops voices and catches resume failures', async () => {
  scope.AudioContext = FakeContext;
  const document = new FakeDocument();
  scope.document = document;
  const audio = createGameAudio();
  await audio.unlock();
  const context = FakeContext.instances[0]!;
  audio.play('find');
  document.hidden = true;
  document.listener?.();
  assert.ok((context.oscillators[0]?.stopped ?? 0) >= 2);
  context.resume = () => { throw new Error('blocked'); };
  document.hidden = false;
  assert.doesNotThrow(() => document.listener?.());
  audio.dispose();
});
test('pause and mute stop active voices and block later playback', async () => {
  scope.AudioContext = FakeContext;
  const audio = createGameAudio();
  await audio.unlock();
  const context = FakeContext.instances[0]!;
  audio.play('ready');
  audio.setPaused(true);
  assert.ok((context.oscillators[0]?.stopped ?? 0) >= 2);
  audio.play('complete');
  assert.equal(context.oscillators.length, 1);
  audio.setPaused(false);
  audio.setMuted(true);
  audio.play('find');
  assert.equal(context.oscillators.length, 1);
  audio.dispose();
});

