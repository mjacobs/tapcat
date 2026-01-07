import { useState, useCallback, useRef, useEffect } from 'react';
import { useMetronomeStore } from '../store/metronomeStore';

export function TempoControl() {
  const { bpm, setBpm, addTapTime, clearTapTimes } = useMetronomeStore();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(bpm.toString());
  const inputRef = useRef<HTMLInputElement>(null);
  const tapTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isEditing) {
      setInputValue(bpm.toString());
    }
  }, [bpm, isEditing]);

  const handleBpmClick = () => {
    setIsEditing(true);
    setInputValue(bpm.toString());
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    const newBpm = parseInt(inputValue, 10);
    if (!isNaN(newBpm)) {
      setBpm(newBpm);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue(bpm.toString());
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBpm(parseInt(e.target.value, 10));
  };

  const adjustBpm = (delta: number) => {
    setBpm(bpm + delta);
  };

  const handleTap = useCallback(() => {
    // Clear tap times after 2 seconds of inactivity
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }
    tapTimeoutRef.current = window.setTimeout(() => {
      clearTapTimes();
    }, 2000);

    addTapTime(Date.now());
  }, [addTapTime, clearTapTimes]);

  return (
    <div className="flex flex-col items-center gap-6 px-4">
      {/* BPM Display */}
      <div className="text-center">
        {isEditing ? (
          <input
            ref={inputRef}
            type="number"
            min="20"
            max="300"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            className="w-32 text-6xl sm:text-7xl font-bold text-center bg-transparent border-b-2 border-[var(--color-accent)] outline-none"
            autoFocus
          />
        ) : (
          <button
            onClick={handleBpmClick}
            className="text-6xl sm:text-7xl font-bold hover:text-[var(--color-accent)] transition-colors"
          >
            {bpm}
          </button>
        )}
        <div className="text-[var(--color-secondary)] text-lg tracking-widest mt-1">BPM</div>
      </div>

      {/* Tempo Slider */}
      <div className="w-full max-w-xs">
        <input
          type="range"
          min="20"
          max="300"
          value={bpm}
          onChange={handleSliderChange}
          className="w-full h-2"
        />
        <div className="flex justify-between text-xs text-[var(--color-secondary)] mt-1">
          <span>20</span>
          <span>300</span>
        </div>
      </div>

      {/* Quick Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => adjustBpm(-5)}
          className="w-12 h-12 rounded-full bg-[var(--color-bg-surface)] text-[var(--color-text)] font-bold text-lg hover:bg-[var(--color-secondary)] transition-colors active:scale-95"
        >
          -5
        </button>
        <button
          onClick={handleTap}
          className="px-6 py-3 rounded-full bg-[var(--color-bg-surface)] text-[var(--color-text)] font-bold text-lg hover:bg-[var(--color-secondary)] transition-colors active:scale-95"
        >
          TAP
        </button>
        <button
          onClick={() => adjustBpm(5)}
          className="w-12 h-12 rounded-full bg-[var(--color-bg-surface)] text-[var(--color-text)] font-bold text-lg hover:bg-[var(--color-secondary)] transition-colors active:scale-95"
        >
          +5
        </button>
      </div>
    </div>
  );
}
