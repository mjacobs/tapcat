import { useMetronomeStore } from '../store/metronomeStore';

const TIME_SIGNATURES = [
  { beats: 2, unit: 4, label: '2/4' },
  { beats: 3, unit: 4, label: '3/4' },
  { beats: 4, unit: 4, label: '4/4' },
  { beats: 6, unit: 8, label: '6/8' },
];

export function TimeSignature() {
  const { beatsPerMeasure, beatUnit, setTimeSignature, isPlaying } = useMetronomeStore();

  const currentLabel = `${beatsPerMeasure}/${beatUnit}`;

  return (
    <div className="flex items-center gap-2">
      <select
        value={currentLabel}
        onChange={(e) => {
          const sig = TIME_SIGNATURES.find(s => s.label === e.target.value);
          if (sig) {
            setTimeSignature(sig.beats, sig.unit);
          }
        }}
        disabled={isPlaying}
        className={`
          bg-[var(--color-bg-surface)] text-[var(--color-text)]
          px-3 py-2 rounded-lg text-lg font-mono font-bold
          border border-[var(--color-secondary)] border-opacity-30
          focus:outline-none focus:border-[var(--color-accent)]
          ${isPlaying ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {TIME_SIGNATURES.map(sig => (
          <option key={sig.label} value={sig.label}>
            {sig.label}
          </option>
        ))}
      </select>
    </div>
  );
}
