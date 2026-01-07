# TapCat

TapCat is a cross-platform PWA metronome built with React, TypeScript, and Web Audio API. It features accurate beat timing, visual beat indicators, and optional pet-themed modes (Cat Mode, Pug Mode).

## Commands

```bash
npm run dev      # Start development server (http://localhost:5173/)
npm run build    # TypeScript check + production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Architecture

### Audio Engine (`src/audio/`)

The audio system uses the **lookahead scheduler pattern** for sample-accurate timing:

- `AudioEngine.ts` - Core scheduler using Web Audio API's `AudioContext` timeline. Schedules beats 100ms ahead to compensate for JavaScript timing jitter.
- `ClickSynth.ts` - Generates click sounds via oscillators (synth mode) or plays audio samples (woodblock mode).
- `useAudioEngine.ts` - React hook that bridges the audio engine with the Zustand store.

The scheduler runs a `setInterval` at 25ms intervals, scheduling notes onto the AudioContext's precise timeline rather than relying on JavaScript timing.

### State Management (`src/store/`)

Single Zustand store (`metronomeStore.ts`) with persistence to localStorage. Contains all app state: tempo, time signature, subdivisions, volume, theme, presets, and timer state.

### Theme System

Three themes selectable in Settings:
- `clean` (default) - Minimal UI with circle beat indicators
- `cat` - Cat paw prints, cat mascot icon, "TapCat" branding
- `pug` - Pug paw prints, pug mascot icon, "TapPug" branding

Theme affects: `BeatLights.tsx` (indicator shapes), `PlayButton.tsx` (play icon), `App.tsx` (header icon and name).

### PWA Configuration

Configured in `vite.config.ts` via `vite-plugin-pwa`. Service worker auto-updates and caches all assets for offline use. Manifest configured for standalone display with portrait orientation.

## Key Patterns

- **iOS Audio**: AudioContext must be resumed on user gesture (handled in `useAudioEngine.ts`)
- **Wake Lock**: Screen stays on during playback (`useWakeLock.ts`)
- **Beat Callback**: UI updates are scheduled with `setTimeout` to sync with actual audio playback time


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
