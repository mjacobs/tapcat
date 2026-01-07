import { useMetronomeStore } from '../store/metronomeStore';
import type { ThemeMode } from '../types';

// Clean dot indicator
const CleanDot = ({ filled, isDownbeat }: { filled: boolean; isDownbeat: boolean }) => (
  <div
    className={`
      w-10 h-10 sm:w-12 sm:h-12 rounded-full
      transition-all duration-75
      ${filled
        ? isDownbeat
          ? 'bg-[var(--color-beat-downbeat)] scale-125 shadow-[0_0_12px_var(--color-beat-downbeat)]'
          : 'bg-[var(--color-beat-active)] scale-110 shadow-[0_0_8px_var(--color-beat-active)]'
        : 'bg-[var(--color-secondary)] opacity-40 scale-100'
      }
    `}
  />
);

// Cat paw print
const CatPaw = ({ filled, isDownbeat }: { filled: boolean; isDownbeat: boolean }) => (
  <svg
    viewBox="0 0 100 100"
    className={`w-10 h-10 sm:w-12 sm:h-12 transition-all duration-75 ${
      filled
        ? isDownbeat
          ? 'scale-125 drop-shadow-[0_0_8px_var(--color-beat-downbeat)]'
          : 'scale-110 drop-shadow-[0_0_6px_var(--color-beat-active)]'
        : 'scale-100 opacity-40'
    }`}
  >
    {/* Main pad */}
    <ellipse
      cx="50"
      cy="60"
      rx="25"
      ry="22"
      fill={filled ? (isDownbeat ? 'var(--color-beat-downbeat)' : 'var(--color-beat-active)') : 'var(--color-secondary)'}
    />
    {/* Toe beans */}
    <ellipse
      cx="30"
      cy="32"
      rx="10"
      ry="12"
      fill={filled ? (isDownbeat ? 'var(--color-beat-downbeat)' : 'var(--color-beat-active)') : 'var(--color-secondary)'}
    />
    <ellipse
      cx="50"
      cy="25"
      rx="10"
      ry="12"
      fill={filled ? (isDownbeat ? 'var(--color-beat-downbeat)' : 'var(--color-beat-active)') : 'var(--color-secondary)'}
    />
    <ellipse
      cx="70"
      cy="32"
      rx="10"
      ry="12"
      fill={filled ? (isDownbeat ? 'var(--color-beat-downbeat)' : 'var(--color-beat-active)') : 'var(--color-secondary)'}
    />
  </svg>
);

// Pug paw print (wider, stubbier toes)
const PugPaw = ({ filled, isDownbeat }: { filled: boolean; isDownbeat: boolean }) => (
  <svg
    viewBox="0 0 100 100"
    className={`w-10 h-10 sm:w-12 sm:h-12 transition-all duration-75 ${
      filled
        ? isDownbeat
          ? 'scale-125 drop-shadow-[0_0_8px_var(--color-beat-downbeat)]'
          : 'scale-110 drop-shadow-[0_0_6px_var(--color-beat-active)]'
        : 'scale-100 opacity-40'
    }`}
  >
    {/* Main pad (wider, rounder) */}
    <ellipse
      cx="50"
      cy="60"
      rx="28"
      ry="24"
      fill={filled ? (isDownbeat ? 'var(--color-beat-downbeat)' : 'var(--color-beat-active)') : 'var(--color-secondary)'}
    />
    {/* Stubby toes (4, rounder) */}
    <circle
      cx="25"
      cy="32"
      r="11"
      fill={filled ? (isDownbeat ? 'var(--color-beat-downbeat)' : 'var(--color-beat-active)') : 'var(--color-secondary)'}
    />
    <circle
      cx="42"
      cy="24"
      r="11"
      fill={filled ? (isDownbeat ? 'var(--color-beat-downbeat)' : 'var(--color-beat-active)') : 'var(--color-secondary)'}
    />
    <circle
      cx="58"
      cy="24"
      r="11"
      fill={filled ? (isDownbeat ? 'var(--color-beat-downbeat)' : 'var(--color-beat-active)') : 'var(--color-secondary)'}
    />
    <circle
      cx="75"
      cy="32"
      r="11"
      fill={filled ? (isDownbeat ? 'var(--color-beat-downbeat)' : 'var(--color-beat-active)') : 'var(--color-secondary)'}
    />
  </svg>
);

const BeatIndicator = ({ theme, filled, isDownbeat }: { theme: ThemeMode; filled: boolean; isDownbeat: boolean }) => {
  switch (theme) {
    case 'cat':
      return <CatPaw filled={filled} isDownbeat={isDownbeat} />;
    case 'pug':
      return <PugPaw filled={filled} isDownbeat={isDownbeat} />;
    default:
      return <CleanDot filled={filled} isDownbeat={isDownbeat} />;
  }
};

export function BeatLights() {
  const { beatsPerMeasure, currentBeat, currentSubdivision, isPlaying, theme } = useMetronomeStore();

  return (
    <div className="flex justify-center items-center gap-2 sm:gap-4 py-6">
      {Array.from({ length: beatsPerMeasure }).map((_, i) => {
        const isActive = isPlaying && currentBeat === i && currentSubdivision === 0;
        const isDownbeat = i === 0;

        return (
          <div
            key={i}
            className={`transition-transform ${isActive ? 'beat-active' : ''}`}
          >
            <BeatIndicator theme={theme} filled={isActive} isDownbeat={isDownbeat && isActive} />
          </div>
        );
      })}
    </div>
  );
}
