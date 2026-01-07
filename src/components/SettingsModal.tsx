import { useMetronomeStore } from '../store/metronomeStore';
import type { SoundType, ThemeMode } from '../types';

const GearIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
    <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
  </svg>
);

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: string }[] = [
  { value: 'clean', label: 'Clean', icon: '◯' },
  { value: 'cat', label: 'Cat Mode', icon: '🐱' },
  { value: 'pug', label: 'Pug Mode', icon: '🐶' },
];

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const {
    soundType, setSoundType,
    accentVolume, clickVolume, setAccentVolume, setClickVolume,
    theme, setTheme
  } = useMetronomeStore();

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-[var(--color-bg-surface)] rounded-xl max-w-sm w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--color-text)]">Settings</h2>
          <button
            onClick={onClose}
            className="text-[var(--color-secondary)] hover:text-[var(--color-text)] text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Theme Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
            Theme
          </label>
          <div className="flex gap-2">
            {THEME_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`
                  flex-1 py-2 px-3 rounded-lg font-medium text-sm
                  transition-colors flex flex-col items-center gap-1
                  ${theme === option.value
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'bg-[var(--color-bg-primary)] text-[var(--color-secondary)] hover:text-[var(--color-text)]'
                  }
                `}
              >
                <span className="text-lg">{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sound Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
            Click Sound
          </label>
          <div className="flex gap-2">
            {(['synth', 'woodblock'] as SoundType[]).map((type) => (
              <button
                key={type}
                onClick={() => setSoundType(type)}
                className={`
                  flex-1 py-2 px-4 rounded-lg font-medium capitalize
                  transition-colors
                  ${soundType === type
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'bg-[var(--color-bg-primary)] text-[var(--color-secondary)] hover:text-[var(--color-text)]'
                  }
                `}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Accent Volume */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
            Accent Volume: {Math.round(accentVolume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={accentVolume}
            onChange={(e) => setAccentVolume(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Click Volume */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
            Click Volume: {Math.round(clickVolume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={clickVolume}
            onChange={(e) => setClickVolume(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[var(--color-accent)] text-white rounded-lg font-bold hover:brightness-110 transition-all"
        >
          Done
        </button>
      </div>
    </div>
  );
}

export function SettingsButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-2 text-[var(--color-secondary)] hover:text-[var(--color-text)] transition-colors"
    >
      <GearIcon />
    </button>
  );
}
