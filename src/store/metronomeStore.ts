import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MetronomeState, Subdivision } from '../types';

const generateId = () => Math.random().toString(36).substring(2, 9);

const getDefaultAccentPattern = (subdivision: Subdivision): boolean[] => {
  // First subdivision of each beat is accented by default
  return Array(subdivision).fill(false).map((_, i) => i === 0);
};

export const useMetronomeStore = create<MetronomeState>()(
  persist(
    (set) => ({
      // Playback
      isPlaying: false,
      currentBeat: 0,
      currentSubdivision: 0,

      // Tempo
      bpm: 120,
      tapTimes: [],

      // Time Signature
      beatsPerMeasure: 4,
      beatUnit: 4,

      // Subdivision
      subdivision: 1,
      accentPattern: [true],

      // Volume & Sound
      accentVolume: 1,
      clickVolume: 0.7,
      soundType: 'synth',

      // Theme
      theme: 'clean',

      // Practice
      presets: [],
      timer: null,

      // Actions
      setPlaying: (playing) => set({ isPlaying: playing }),

      setBpm: (bpm) => set({ bpm: Math.min(300, Math.max(20, bpm)) }),

      setTimeSignature: (beats, unit) => set({
        beatsPerMeasure: beats,
        beatUnit: unit,
        currentBeat: 0,
        currentSubdivision: 0
      }),

      setSubdivision: (sub) => set({
        subdivision: sub,
        accentPattern: getDefaultAccentPattern(sub)
      }),

      toggleAccent: (index) => set((state) => {
        const newPattern = [...state.accentPattern];
        newPattern[index] = !newPattern[index];
        return { accentPattern: newPattern };
      }),

      setAccentVolume: (vol) => set({ accentVolume: Math.min(1, Math.max(0, vol)) }),

      setClickVolume: (vol) => set({ clickVolume: Math.min(1, Math.max(0, vol)) }),

      setSoundType: (type) => set({ soundType: type }),

      setTheme: (theme) => set({ theme }),

      addTapTime: (time) => set((state) => {
        const newTimes = [...state.tapTimes, time].slice(-4);

        if (newTimes.length >= 2) {
          const intervals = [];
          for (let i = 1; i < newTimes.length; i++) {
            intervals.push(newTimes[i] - newTimes[i - 1]);
          }
          const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
          const newBpm = Math.round(60000 / avgInterval);

          if (newBpm >= 20 && newBpm <= 300) {
            return { tapTimes: newTimes, bpm: newBpm };
          }
        }

        return { tapTimes: newTimes };
      }),

      clearTapTimes: () => set({ tapTimes: [] }),

      setCurrentBeat: (beat, subdivision) => set({
        currentBeat: beat,
        currentSubdivision: subdivision
      }),

      // Presets
      savePreset: (name) => set((state) => ({
        presets: [...state.presets, {
          id: generateId(),
          name,
          bpm: state.bpm,
          timeSignature: [state.beatsPerMeasure, state.beatUnit],
          subdivision: state.subdivision,
          accentPattern: [...state.accentPattern]
        }]
      })),

      loadPreset: (id) => set((state) => {
        const preset = state.presets.find(p => p.id === id);
        if (!preset) return {};

        return {
          bpm: preset.bpm,
          beatsPerMeasure: preset.timeSignature[0],
          beatUnit: preset.timeSignature[1],
          subdivision: preset.subdivision,
          accentPattern: [...preset.accentPattern]
        };
      }),

      deletePreset: (id) => set((state) => ({
        presets: state.presets.filter(p => p.id !== id)
      })),

      // Timer
      startTimer: (duration, tempoIncrement = 0, incrementInterval = 60, maxBpm = 300) => set({
        timer: {
          duration,
          elapsed: 0,
          tempoIncrement,
          incrementInterval,
          maxBpm,
          isActive: true
        }
      }),

      stopTimer: () => set({ timer: null }),

      updateTimerElapsed: (elapsed) => set((state) => {
        if (!state.timer) return {};

        const timer = { ...state.timer, elapsed };

        // Check if we should increment tempo
        if (timer.tempoIncrement > 0 && timer.incrementInterval > 0) {
          const intervals = Math.floor(elapsed / timer.incrementInterval);
          const targetBpm = Math.min(
            state.bpm + (timer.tempoIncrement * intervals),
            timer.maxBpm
          );

          if (targetBpm !== state.bpm) {
            return { timer, bpm: targetBpm };
          }
        }

        // Check if timer is complete
        if (elapsed >= timer.duration) {
          return { timer: { ...timer, isActive: false } };
        }

        return { timer };
      })
    }),
    {
      name: 'tapcat-storage',
      partialize: (state) => ({
        bpm: state.bpm,
        beatsPerMeasure: state.beatsPerMeasure,
        beatUnit: state.beatUnit,
        subdivision: state.subdivision,
        accentPattern: state.accentPattern,
        accentVolume: state.accentVolume,
        clickVolume: state.clickVolume,
        soundType: state.soundType,
        theme: state.theme,
        presets: state.presets
      })
    }
  )
);
