import { useState } from 'react';
import { useMetronomeStore } from '../store/metronomeStore';

const VolumeIcon = ({ muted }: { muted: boolean }) => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    {muted ? (
      <>
        <path d="M3 9v6h4l5 5V4L7 9H3z" />
        <path d="M16.5 12l4.5-4.5-1.4-1.4-4.5 4.5-4.5-4.5-1.4 1.4 4.5 4.5-4.5 4.5 1.4 1.4 4.5-4.5 4.5 4.5 1.4-1.4-4.5-4.5z" />
      </>
    ) : (
      <>
        <path d="M3 9v6h4l5 5V4L7 9H3z" />
        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03z" />
        <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
      </>
    )}
  </svg>
);

export function VolumeControl() {
  const { accentVolume, clickVolume, setAccentVolume, setClickVolume } = useMetronomeStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const isMuted = accentVolume === 0 && clickVolume === 0;

  const toggleMute = () => {
    if (isMuted) {
      setAccentVolume(1);
      setClickVolume(0.7);
    } else {
      setAccentVolume(0);
      setClickVolume(0);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          p-2 rounded-lg
          transition-colors
          ${isExpanded ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-secondary)] hover:text-[var(--color-text)]'}
        `}
      >
        <VolumeIcon muted={isMuted} />
      </button>

      {isExpanded && (
        <div className="absolute bottom-full right-0 mb-2 p-4 bg-[var(--color-bg-surface)] rounded-lg shadow-xl min-w-48">
          <div className="flex flex-col gap-4">
            {/* Mute button */}
            <button
              onClick={toggleMute}
              className={`
                px-3 py-1 rounded text-sm font-medium
                ${isMuted
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-[var(--color-bg-primary)] text-[var(--color-secondary)]'
                }
              `}
            >
              {isMuted ? 'Unmute' : 'Mute'}
            </button>

            {/* Accent volume */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[var(--color-secondary)]">
                Accent: {Math.round(accentVolume * 100)}%
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

            {/* Click volume */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[var(--color-secondary)]">
                Click: {Math.round(clickVolume * 100)}%
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
          </div>
        </div>
      )}
    </div>
  );
}
