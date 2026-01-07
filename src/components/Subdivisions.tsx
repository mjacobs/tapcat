import { useMetronomeStore } from '../store/metronomeStore';
import type { Subdivision } from '../types';

const SUBDIVISION_OPTIONS: { value: Subdivision; label: string; icon: string }[] = [
  { value: 1, label: 'Quarter', icon: '♩' },
  { value: 2, label: 'Eighth', icon: '♪' },
  { value: 3, label: 'Triplet', icon: '♪³' },
  { value: 4, label: 'Sixteenth', icon: '♬' },
];

export function Subdivisions() {
  const { subdivision, setSubdivision, accentPattern, toggleAccent, isPlaying } = useMetronomeStore();

  return (
    <div className="flex flex-col gap-3">
      {/* Subdivision selector */}
      <div className="flex items-center gap-1">
        {SUBDIVISION_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => !isPlaying && setSubdivision(option.value)}
            disabled={isPlaying}
            className={`
              px-3 py-2 rounded-lg text-lg font-mono
              transition-colors
              ${subdivision === option.value
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-[var(--color-bg-surface)] text-[var(--color-secondary)] hover:text-[var(--color-text)]'
              }
              ${isPlaying ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            title={option.label}
          >
            {option.icon}
          </button>
        ))}
      </div>

      {/* Accent pattern (only show if subdivision > 1) */}
      {subdivision > 1 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-secondary)]">Accents:</span>
          <div className="flex gap-1">
            {accentPattern.map((isAccented, i) => (
              <button
                key={i}
                onClick={() => toggleAccent(i)}
                className={`
                  w-6 h-6 rounded-full text-xs font-bold
                  transition-all
                  ${isAccented
                    ? 'bg-[var(--color-accent)] text-white scale-110'
                    : 'bg-[var(--color-bg-surface)] text-[var(--color-secondary)]'
                  }
                `}
                title={`${i === 0 ? 'Beat' : `Subdivision ${i}`}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
