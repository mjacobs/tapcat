import { useState } from 'react';
import { useMetronomeStore } from '../store/metronomeStore';

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
);

interface PresetMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PresetMenu({ isOpen, onClose }: PresetMenuProps) {
  const { presets, savePreset, loadPreset, deletePreset, bpm, beatsPerMeasure, beatUnit, subdivision } = useMetronomeStore();
  const [newPresetName, setNewPresetName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = () => {
    if (newPresetName.trim()) {
      savePreset(newPresetName.trim());
      setNewPresetName('');
      setIsAdding(false);
    }
  };

  const handleLoad = (id: string) => {
    loadPreset(id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-start z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-[var(--color-bg-surface)] w-72 h-full shadow-2xl overflow-y-auto">
        <div className="p-4 border-b border-[var(--color-secondary)] border-opacity-20">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--color-text)]">Presets</h2>
            <button
              onClick={onClose}
              className="text-[var(--color-secondary)] hover:text-[var(--color-text)] text-2xl leading-none"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Current settings */}
        <div className="p-4 bg-[var(--color-bg-primary)] border-b border-[var(--color-secondary)] border-opacity-20">
          <div className="text-xs text-[var(--color-secondary)] mb-1">Current</div>
          <div className="text-sm text-[var(--color-text)]">
            {bpm} BPM • {beatsPerMeasure}/{beatUnit} • {subdivision === 1 ? '♩' : subdivision === 2 ? '♪' : subdivision === 3 ? '♪³' : '♬'}
          </div>
        </div>

        {/* Add new preset */}
        <div className="p-4 border-b border-[var(--color-secondary)] border-opacity-20">
          {isAdding ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                placeholder="Preset name..."
                className="flex-1 px-3 py-2 bg-[var(--color-bg-primary)] text-[var(--color-text)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') setIsAdding(false);
                }}
              />
              <button
                onClick={handleSave}
                className="px-3 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-2 border-2 border-dashed border-[var(--color-secondary)] border-opacity-40 text-[var(--color-secondary)] rounded-lg text-sm font-medium hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
            >
              + Save Current Settings
            </button>
          )}
        </div>

        {/* Preset list */}
        <div className="p-2">
          {presets.length === 0 ? (
            <div className="text-center text-[var(--color-secondary)] text-sm py-8">
              No presets saved yet
            </div>
          ) : (
            <div className="space-y-1">
              {presets.map((preset) => (
                <div
                  key={preset.id}
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-[var(--color-bg-primary)] group"
                >
                  <button
                    onClick={() => handleLoad(preset.id)}
                    className="flex-1 text-left"
                  >
                    <div className="text-sm font-medium text-[var(--color-text)]">
                      {preset.name}
                    </div>
                    <div className="text-xs text-[var(--color-secondary)]">
                      {preset.bpm} BPM • {preset.timeSignature[0]}/{preset.timeSignature[1]}
                    </div>
                  </button>
                  <button
                    onClick={() => deletePreset(preset.id)}
                    className="p-1 text-[var(--color-secondary)] hover:text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function MenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-2 text-[var(--color-secondary)] hover:text-[var(--color-text)] transition-colors"
    >
      <MenuIcon />
    </button>
  );
}
