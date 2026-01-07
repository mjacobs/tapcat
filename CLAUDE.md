# CLAUDE.md

See README.md for project overview and commands.

## AI-Specific Guidance

### Key Patterns to Follow

- **iOS Audio**: AudioContext must be resumed on user gesture (see `useAudioEngine.ts`)
- **Lookahead scheduler**: Audio is scheduled 100ms ahead onto the Web Audio API timeline - don't rely on JS timing for beat accuracy
- **Theme-aware components**: When adding UI, check if it needs theme variants (clean/cat/pug). Theme affects `BeatLights.tsx`, `PlayButton.tsx`, and `App.tsx`.
- **Beat callbacks**: UI updates use `setTimeout` to sync with actual audio playback time, not the scheduling time

### Architecture Notes

- State lives in single Zustand store (`src/store/metronomeStore.ts`) with localStorage persistence
- Audio engine uses `setInterval` at 25ms to schedule notes onto AudioContext's precise timeline
- PWA configured via `vite-plugin-pwa` in `vite.config.ts`
- Wake lock keeps screen on during playback (`useWakeLock.ts`)
