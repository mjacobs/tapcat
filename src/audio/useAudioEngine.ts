import { useEffect, useRef, useCallback } from 'react';
import { AudioEngine, type BeatCallback } from './AudioEngine';
import { useMetronomeStore } from '../store/metronomeStore';

export function useAudioEngine() {
  const engineRef = useRef<AudioEngine | null>(null);

  const {
    isPlaying,
    bpm,
    beatsPerMeasure,
    subdivision,
    accentPattern,
    accentVolume,
    clickVolume,
    soundType,
    setCurrentBeat,
    setPlaying
  } = useMetronomeStore();

  // Initialize engine on mount
  useEffect(() => {
    engineRef.current = new AudioEngine();

    return () => {
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  // Update config when settings change
  useEffect(() => {
    engineRef.current?.updateConfig({
      bpm,
      beatsPerMeasure,
      subdivision,
      accentPattern,
      accentVolume,
      clickVolume,
      soundType
    });
  }, [bpm, beatsPerMeasure, subdivision, accentPattern, accentVolume, clickVolume, soundType]);

  // Handle play/stop
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    const beatCallback: BeatCallback = (beat, sub) => {
      setCurrentBeat(beat, sub);
    };

    if (isPlaying) {
      engine.start(beatCallback);
    } else {
      engine.stop();
      setCurrentBeat(0, 0);
    }
  }, [isPlaying, setCurrentBeat]);

  const toggle = useCallback(async () => {
    if (!engineRef.current) return;

    if (!isPlaying) {
      // Initialize on first play (requires user gesture)
      await engineRef.current.init();
    }

    setPlaying(!isPlaying);
  }, [isPlaying, setPlaying]);

  return { toggle, isPlaying };
}
