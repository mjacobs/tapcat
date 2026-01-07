export type Subdivision = 1 | 2 | 3 | 4;
export type SoundType = 'synth' | 'woodblock';
export type TimeSignature = [number, number]; // [beats, noteValue]
export type ThemeMode = 'clean' | 'cat' | 'pug';

export interface Preset {
  id: string;
  name: string;
  bpm: number;
  timeSignature: TimeSignature;
  subdivision: Subdivision;
  accentPattern: boolean[];
}

export interface TimerState {
  duration: number;         // Total duration in seconds
  elapsed: number;          // Elapsed time in seconds
  tempoIncrement: number;   // BPM to add per interval
  incrementInterval: number; // Seconds between tempo increases
  maxBpm: number;           // Stop increasing at this BPM
  isActive: boolean;
}

export interface MetronomeState {
  // Playback
  isPlaying: boolean;
  currentBeat: number;
  currentSubdivision: number;

  // Tempo
  bpm: number;
  tapTimes: number[];

  // Time Signature
  beatsPerMeasure: number;
  beatUnit: number;

  // Subdivision
  subdivision: Subdivision;
  accentPattern: boolean[];

  // Volume & Sound
  accentVolume: number;
  clickVolume: number;
  soundType: SoundType;

  // Theme
  theme: ThemeMode;

  // Practice
  presets: Preset[];
  timer: TimerState | null;

  // Actions
  setPlaying: (playing: boolean) => void;
  setBpm: (bpm: number) => void;
  setTimeSignature: (beats: number, unit: number) => void;
  setSubdivision: (sub: Subdivision) => void;
  toggleAccent: (index: number) => void;
  setAccentVolume: (vol: number) => void;
  setClickVolume: (vol: number) => void;
  setSoundType: (type: SoundType) => void;
  setTheme: (theme: ThemeMode) => void;
  addTapTime: (time: number) => void;
  clearTapTimes: () => void;
  setCurrentBeat: (beat: number, subdivision: number) => void;

  // Presets
  savePreset: (name: string) => void;
  loadPreset: (id: string) => void;
  deletePreset: (id: string) => void;

  // Timer
  startTimer: (duration: number, tempoIncrement?: number, incrementInterval?: number, maxBpm?: number) => void;
  stopTimer: () => void;
  updateTimerElapsed: (elapsed: number) => void;
}
