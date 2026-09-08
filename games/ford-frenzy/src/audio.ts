const AUDIO_PREFERENCE_KEY = 'ford-frenzy-audio-preferences';

type Cue = 'find' | 'wrong' | 'ready' | 'complete';

type AudioState = { muted: boolean; volume: number; available: boolean };
type AudioContextLike = {
  state: string;
  currentTime: number;
  destination: unknown;
  createOscillator(): OscillatorNodeLike;
  createGain(): GainNodeLike;
  resume(): Promise<void>;
  suspend?(): Promise<void>;
  close?(): Promise<void>;
};
type OscillatorNodeLike = {
  type: string;
  frequency: { setValueAtTime(value: number, time: number): void };
  connect(node: unknown): void;
  start(time?: number): void;
  stop(time?: number): void;
  disconnect?(): void;
};
type GainNodeLike = {
  gain: {
    setValueAtTime(value: number, time: number): void;
    exponentialRampToValueAtTime(value: number, time: number): void;
  };
  connect(node: unknown): void;
  disconnect?(): void;
};

type AudioContextConstructor = new () => AudioContextLike;

const CUES: Record<Cue, readonly [number, number, number]> = {
  find: [660, 0.09, 0.07],
  wrong: [180, 0.12, 0.08],
  ready: [440, 0.14, 0.08],
  complete: [523.25, 0.22, 0.1],
};

function readPreferences(): Pick<AudioState, 'muted' | 'volume'> {
  try {
    const raw = globalThis.localStorage?.getItem(AUDIO_PREFERENCE_KEY);
    if (!raw) return { muted: false, volume: 0.65 };
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { muted: false, volume: 0.65 };
    const value = parsed as { muted?: unknown; volume?: unknown };
    return {
      muted: typeof value.muted === 'boolean' ? value.muted : false,
      volume: typeof value.volume === 'number' && Number.isFinite(value.volume) && value.volume >= 0 && value.volume <= 1
        ? value.volume
        : 0.65,
    };
  } catch {
    return { muted: false, volume: 0.65 };
  }
}

function savePreferences(muted: boolean, volume: number): void {
  try {
    globalThis.localStorage?.setItem(AUDIO_PREFERENCE_KEY, JSON.stringify({ muted, volume }));
  } catch {
    // Audio remains usable when storage is unavailable or denied.
  }
}

function audioContextConstructor(): AudioContextConstructor | undefined {
  const scope = globalThis as typeof globalThis & { AudioContext?: AudioContextConstructor; webkitAudioContext?: AudioContextConstructor };
  return scope.AudioContext ?? scope.webkitAudioContext;
}

export function createGameAudio() {
  let muted: boolean;
  let volume: number;
  ({ muted, volume } = readPreferences());
  let context: AudioContextLike | undefined;
  let disposed = false;
  let paused = false;
  let hidden = typeof document !== 'undefined' && document.hidden;
  const active = new Set<{ oscillator: OscillatorNodeLike; gain: GainNodeLike }>();

  const stopActive = (): void => {
    for (const voice of active) {
      try { voice.oscillator.stop(); } catch { /* already stopped */ }
      try { voice.oscillator.disconnect?.(); voice.gain.disconnect?.(); } catch { /* cleanup is best effort */ }
    }
    active.clear();
  };

  const resumeContext = async (): Promise<void> => {
    try {
      await context?.resume?.();
    } catch {
      // Browser policy/device failures are intentionally silent.
    }
  };

  const suspendContext = (): void => {
    try {
      void context?.suspend?.().catch(() => undefined);
    } catch {
      // Browser policy/device failures are intentionally silent.
    }
  };

  const visibilityChanged = (): void => {
    hidden = typeof document !== 'undefined' && document.hidden;
    if (hidden) {
      stopActive();
      suspendContext();
    } else if (context && !paused) {
      resumeContext();
    }
  };

  if (typeof document !== 'undefined') document.addEventListener('visibilitychange', visibilityChanged);

  const unlock = async (): Promise<void> => {
    if (disposed) return;
    if (context) {
      if (!paused && !hidden) await resumeContext();
      return;
    }
    const Constructor = audioContextConstructor();
    if (!Constructor) return;
    try {
      const candidate = new Constructor();
      context = candidate;
      await candidate.resume().catch(() => undefined);
    } catch {
      context = undefined;
    }
  };

  const play = (cue: Cue): void => {
    if (disposed || !context || muted || paused || hidden || volume === 0 || context.state !== 'running') return;
    const [frequency, duration, level] = CUES[cue];
    try {
      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = cue === 'wrong' ? 'square' : 'sine';
      oscillator.frequency.setValueAtTime(frequency, now);
      gain.gain.setValueAtTime(Math.max(0.0001, volume * level), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      const voice = { oscillator, gain };
      active.add(voice);
      oscillator.start(now);
      oscillator.stop(now + duration);
      const cleanup = (): void => {
        active.delete(voice);
        try { oscillator.disconnect?.(); gain.disconnect?.(); } catch { /* best effort */ }
      };
      setTimeout(cleanup, Math.ceil(duration * 1000) + 50);
    } catch {
      // A browser may reject WebAudio operations after a device/policy change.
    }
  };

  const setMuted = (value: boolean): void => {
    muted = Boolean(value);
    if (muted) stopActive();
    savePreferences(muted, volume);
  };

  const setVolume = (value: number): void => {
    if (!Number.isFinite(value)) return;
    volume = Math.min(1, Math.max(0, value));
    if (volume === 0) stopActive();
    savePreferences(muted, volume);
  };

  const setPaused = (value: boolean): void => {
    paused = Boolean(value);
    if (paused) {
      stopActive();
      suspendContext();
    } else if (context && !hidden) {
      resumeContext();
    }
  };

  const getState = (): AudioState => ({ muted, volume, available: context?.state === 'running' && !disposed });

  const dispose = (): void => {
    if (disposed) return;
    disposed = true;
    stopActive();
    if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', visibilityChanged);
    const oldContext = context;
    context = undefined;
    try {
      void oldContext?.close?.().catch(() => undefined);
    } catch {
      // Cleanup remains best effort when the browser context is already broken.
    }
  };

  return { unlock, play, setMuted, setVolume, setPaused, getState, dispose };
}

export type GameAudio = ReturnType<typeof createGameAudio>;



