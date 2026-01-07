import { useState, useEffect, useRef } from 'react';
import { useMetronomeStore } from '../store/metronomeStore';

const TimerIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
  </svg>
);

const DURATION_OPTIONS = [
  { label: '5 min', value: 5 * 60 },
  { label: '10 min', value: 10 * 60 },
  { label: '15 min', value: 15 * 60 },
  { label: '30 min', value: 30 * 60 },
];

interface PracticeTimerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PracticeTimer({ isOpen, onClose }: PracticeTimerProps) {
  const { timer, startTimer, stopTimer, updateTimerElapsed, bpm, isPlaying } = useMetronomeStore();
  const [duration, setDuration] = useState(10 * 60);
  const [enableTempoRamp, setEnableTempoRamp] = useState(false);
  const [tempoIncrement, setTempoIncrement] = useState(5);
  const [incrementInterval, setIncrementInterval] = useState(60);
  const [maxBpm, setMaxBpm] = useState(Math.min(bpm + 40, 300));
  const intervalRef = useRef<number | null>(null);

  // Update elapsed time every second when timer is active
  useEffect(() => {
    if (timer?.isActive && isPlaying) {
      intervalRef.current = window.setInterval(() => {
        updateTimerElapsed(timer.elapsed + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer?.isActive, timer?.elapsed, isPlaying, updateTimerElapsed]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleStart = () => {
    startTimer(
      duration,
      enableTempoRamp ? tempoIncrement : 0,
      enableTempoRamp ? incrementInterval : 0,
      enableTempoRamp ? maxBpm : 300
    );
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const remaining = timer ? Math.max(0, timer.duration - timer.elapsed) : 0;
  const progress = timer ? (timer.elapsed / timer.duration) * 100 : 0;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-[var(--color-bg-surface)] rounded-xl max-w-sm w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--color-text)]">Practice Timer</h2>
          <button
            onClick={onClose}
            className="text-[var(--color-secondary)] hover:text-[var(--color-text)] text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {timer ? (
          // Active timer display
          <div className="text-center">
            {/* Progress ring */}
            <div className="relative w-40 h-40 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="var(--color-bg-primary)"
                  strokeWidth="8"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke={timer.isActive ? 'var(--color-accent)' : 'var(--color-secondary)'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-[var(--color-text)]">
                  {formatTime(remaining)}
                </div>
                <div className="text-sm text-[var(--color-secondary)]">
                  {timer.isActive ? 'remaining' : 'complete!'}
                </div>
              </div>
            </div>

            {timer.tempoIncrement > 0 && (
              <div className="text-sm text-[var(--color-secondary)] mb-4">
                Tempo: {bpm} BPM (max {timer.maxBpm})
              </div>
            )}

            <button
              onClick={stopTimer}
              className="w-full py-3 bg-[var(--color-secondary)] text-[var(--color-bg-primary)] rounded-lg font-bold"
            >
              {timer.isActive ? 'Stop Timer' : 'Clear'}
            </button>
          </div>
        ) : (
          // Timer setup
          <>
            {/* Duration selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {DURATION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setDuration(opt.value)}
                    className={`
                      py-2 px-3 rounded-lg text-sm font-medium
                      transition-colors
                      ${duration === opt.value
                        ? 'bg-[var(--color-accent)] text-white'
                        : 'bg-[var(--color-bg-primary)] text-[var(--color-secondary)] hover:text-[var(--color-text)]'
                      }
                    `}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tempo ramp toggle */}
            <div className="mb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableTempoRamp}
                  onChange={(e) => setEnableTempoRamp(e.target.checked)}
                  className="w-5 h-5 rounded accent-[var(--color-accent)]"
                />
                <span className="text-sm text-[var(--color-text)]">
                  Gradually increase tempo
                </span>
              </label>
            </div>

            {/* Tempo ramp settings */}
            {enableTempoRamp && (
              <div className="mb-6 p-4 bg-[var(--color-bg-primary)] rounded-lg space-y-4">
                <div>
                  <label className="block text-xs text-[var(--color-secondary)] mb-1">
                    Increase by {tempoIncrement} BPM every {incrementInterval}s
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={tempoIncrement}
                      onChange={(e) => setTempoIncrement(parseInt(e.target.value) || 5)}
                      className="w-16 px-2 py-1 bg-[var(--color-bg-surface)] text-[var(--color-text)] rounded text-center"
                    />
                    <span className="text-[var(--color-secondary)] self-center">BPM every</span>
                    <input
                      type="number"
                      min="30"
                      max="300"
                      step="30"
                      value={incrementInterval}
                      onChange={(e) => setIncrementInterval(parseInt(e.target.value) || 60)}
                      className="w-16 px-2 py-1 bg-[var(--color-bg-surface)] text-[var(--color-text)] rounded text-center"
                    />
                    <span className="text-[var(--color-secondary)] self-center">sec</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[var(--color-secondary)] mb-1">
                    Max tempo: {maxBpm} BPM
                  </label>
                  <input
                    type="range"
                    min={bpm}
                    max="300"
                    value={maxBpm}
                    onChange={(e) => setMaxBpm(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleStart}
              className="w-full py-3 bg-[var(--color-accent)] text-white rounded-lg font-bold hover:brightness-110 transition-all"
            >
              Start Practice
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function TimerButton({ onClick }: { onClick: () => void }) {
  const { timer } = useMetronomeStore();

  return (
    <button
      onClick={onClick}
      className={`
        p-2 rounded-lg transition-colors
        ${timer?.isActive
          ? 'text-[var(--color-accent)] bg-[var(--color-accent)] bg-opacity-20'
          : 'text-[var(--color-secondary)] hover:text-[var(--color-text)]'
        }
      `}
    >
      <TimerIcon />
    </button>
  );
}
