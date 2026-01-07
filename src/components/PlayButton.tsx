import { useAudioEngine } from '../audio/useAudioEngine';
import { useMetronomeStore } from '../store/metronomeStore';

// Standard play icon
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
    <path d="M8 5v14l11-7z" />
  </svg>
);

// Paw print icon for cat/pug modes
const PawIcon = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 fill-current">
    <ellipse cx="50" cy="60" rx="22" ry="20" />
    <ellipse cx="32" cy="35" rx="9" ry="11" />
    <ellipse cx="50" cy="28" rx="9" ry="11" />
    <ellipse cx="68" cy="35" rx="9" ry="11" />
  </svg>
);

const StopIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
    <rect x="6" y="6" width="12" height="12" rx="2" />
  </svg>
);

export function PlayButton() {
  const { toggle, isPlaying } = useAudioEngine();
  const theme = useMetronomeStore((state) => state.theme);
  const isPetMode = theme === 'cat' || theme === 'pug';

  return (
    <button
      onClick={toggle}
      className={`
        flex items-center justify-center gap-3
        px-8 py-4 rounded-full
        text-xl font-bold
        transition-all duration-200
        active:scale-95
        ${isPlaying
          ? 'bg-[var(--color-secondary)] text-[var(--color-bg-primary)]'
          : 'bg-[var(--color-accent)] text-white hover:brightness-110'
        }
      `}
    >
      {isPlaying ? (
        <>
          <StopIcon />
          <span>STOP</span>
        </>
      ) : (
        <>
          {isPetMode ? <PawIcon /> : <PlayIcon />}
          <span>PLAY</span>
        </>
      )}
    </button>
  );
}
