import { useState } from 'react';
import { BeatLights } from './components/BeatLights';
import { TempoControl } from './components/TempoControl';
import { PlayButton } from './components/PlayButton';
import { TimeSignature } from './components/TimeSignature';
import { Subdivisions } from './components/Subdivisions';
import { VolumeControl } from './components/VolumeControl';
import { SettingsModal, SettingsButton } from './components/SettingsModal';
import { PresetMenu, MenuButton } from './components/PresetMenu';
import { PracticeTimer, TimerButton } from './components/PracticeTimer';
import { useWakeLock } from './hooks/useWakeLock';
import { useMetronomeStore } from './store/metronomeStore';
import type { ThemeMode } from './types';

// Clean metronome icon
const MetronomeIcon = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8">
    {/* Body */}
    <path
      d="M30 85 L40 20 L60 20 L70 85 Z"
      fill="var(--color-secondary)"
      stroke="var(--color-text)"
      strokeWidth="2"
    />
    {/* Pendulum */}
    <line
      x1="50"
      y1="75"
      x2="65"
      y2="25"
      stroke="var(--color-accent)"
      strokeWidth="3"
      strokeLinecap="round"
    />
    {/* Weight */}
    <circle cx="60" cy="40" r="6" fill="var(--color-accent)" />
  </svg>
);

// Cat icon
const CatIcon = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8">
    <polygon points="15,35 25,5 40,30" fill="var(--color-secondary)" />
    <polygon points="85,35 75,5 60,30" fill="var(--color-secondary)" />
    <ellipse cx="50" cy="55" rx="40" ry="35" fill="var(--color-secondary)" />
    <ellipse cx="35" cy="50" rx="8" ry="10" fill="var(--color-bg-primary)" />
    <ellipse cx="65" cy="50" rx="8" ry="10" fill="var(--color-bg-primary)" />
    <circle cx="35" cy="52" r="4" fill="var(--color-accent)" />
    <circle cx="65" cy="52" r="4" fill="var(--color-accent)" />
    <ellipse cx="50" cy="65" rx="5" ry="4" fill="var(--color-accent)" />
    <line x1="10" y1="60" x2="30" y2="62" stroke="var(--color-text)" strokeWidth="1.5" />
    <line x1="10" y1="70" x2="30" y2="68" stroke="var(--color-text)" strokeWidth="1.5" />
    <line x1="90" y1="60" x2="70" y2="62" stroke="var(--color-text)" strokeWidth="1.5" />
    <line x1="90" y1="70" x2="70" y2="68" stroke="var(--color-text)" strokeWidth="1.5" />
  </svg>
);

// Pug icon
const PugIcon = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8">
    {/* Ears (floppy) */}
    <ellipse cx="20" cy="40" rx="15" ry="20" fill="var(--color-secondary)" opacity="0.8" />
    <ellipse cx="80" cy="40" rx="15" ry="20" fill="var(--color-secondary)" opacity="0.8" />
    {/* Face (round) */}
    <circle cx="50" cy="55" r="40" fill="var(--color-secondary)" />
    {/* Wrinkles */}
    <path d="M30 45 Q50 35 70 45" stroke="var(--color-bg-primary)" strokeWidth="2" fill="none" opacity="0.5" />
    {/* Eyes (big, round) */}
    <circle cx="35" cy="50" r="10" fill="var(--color-bg-primary)" />
    <circle cx="65" cy="50" r="10" fill="var(--color-bg-primary)" />
    <circle cx="35" cy="52" r="5" fill="var(--color-accent)" />
    <circle cx="65" cy="52" r="5" fill="var(--color-accent)" />
    {/* Snout (flat) */}
    <ellipse cx="50" cy="70" rx="18" ry="12" fill="var(--color-bg-primary)" opacity="0.3" />
    {/* Nose (big, flat) */}
    <ellipse cx="50" cy="68" rx="8" ry="6" fill="var(--color-accent)" />
    {/* Tongue */}
    <ellipse cx="50" cy="82" rx="6" ry="8" fill="#e94560" opacity="0.7" />
  </svg>
);

const ThemeIcon = ({ theme }: { theme: ThemeMode }) => {
  switch (theme) {
    case 'cat':
      return <CatIcon />;
    case 'pug':
      return <PugIcon />;
    default:
      return <MetronomeIcon />;
  }
};

const getAppName = (theme: ThemeMode): string => {
  switch (theme) {
    case 'cat':
      return 'TapCat';
    case 'pug':
      return 'TapPug';
    default:
      return 'TapCat';
  }
};

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const isPlaying = useMetronomeStore((state) => state.isPlaying);
  const theme = useMetronomeStore((state) => state.theme);

  // Keep screen on while playing
  useWakeLock(isPlaying);

  return (
    <div className="min-h-full flex flex-col bg-[var(--color-bg-primary)]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-secondary)] border-opacity-20">
        <div className="flex items-center gap-1">
          <MenuButton onClick={() => setShowPresets(true)} />
          <ThemeIcon theme={theme} />
          <h1 className="text-xl font-bold text-[var(--color-text)]">{getAppName(theme)}</h1>
        </div>
        <div className="flex items-center gap-1">
          <TimerButton onClick={() => setShowTimer(true)} />
          <SettingsButton onClick={() => setShowSettings(true)} />
        </div>
      </header>

      {/* Modals */}
      <PresetMenu isOpen={showPresets} onClose={() => setShowPresets(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <PracticeTimer isOpen={showTimer} onClose={() => setShowTimer(false)} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-between py-6 max-w-lg mx-auto w-full">
        {/* Beat Lights */}
        <section>
          <BeatLights />
        </section>

        {/* Tempo Control */}
        <section className="flex-1 flex items-center justify-center">
          <TempoControl />
        </section>

        {/* Controls Bar */}
        <section className="px-4">
          <div className="flex items-center justify-between py-4 border-t border-b border-[var(--color-secondary)] border-opacity-20">
            <TimeSignature />
            <Subdivisions />
            <VolumeControl />
          </div>
        </section>

        {/* Play Button */}
        <section className="flex justify-center pt-6 pb-4">
          <PlayButton />
        </section>
      </main>
    </div>
  );
}

export default App;
