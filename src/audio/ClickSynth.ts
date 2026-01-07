import type { SoundType } from '../types';

export class ClickSynth {
  private audioContext: AudioContext;
  private soundType: SoundType = 'synth';

  // Preloaded samples
  private samples: {
    accent: AudioBuffer | null;
    click: AudioBuffer | null;
    subdivision: AudioBuffer | null;
  } = {
    accent: null,
    click: null,
    subdivision: null
  };

  // Synth frequencies
  private readonly FREQ_ACCENT = 880;
  private readonly FREQ_CLICK = 440;
  private readonly FREQ_SUBDIVISION = 660;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  setSoundType(type: SoundType): void {
    this.soundType = type;
    if (type === 'woodblock' && !this.samples.accent) {
      this.loadSamples();
    }
  }

  private async loadSamples(): Promise<void> {
    const types = ['accent', 'click', 'subdivision'] as const;

    for (const type of types) {
      try {
        const response = await fetch(`/sounds/woodblock-${type === 'subdivision' ? 'sub' : type}.mp3`);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          this.samples[type] = await this.audioContext.decodeAudioData(arrayBuffer);
        }
      } catch {
        console.warn(`Failed to load ${type} sample, falling back to synth`);
      }
    }
  }

  play(type: 'accent' | 'click' | 'subdivision', time: number, volume: number): void {
    if (this.soundType === 'woodblock' && this.samples[type]) {
      this.playSample(type, time, volume);
    } else {
      this.playSynth(type, time, volume);
    }
  }

  private playSynth(type: 'accent' | 'click' | 'subdivision', time: number, volume: number): void {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    // Set frequency based on type
    let frequency: number;
    let duration: number;

    switch (type) {
      case 'accent':
        frequency = this.FREQ_ACCENT;
        duration = 0.08;
        break;
      case 'click':
        frequency = this.FREQ_CLICK;
        duration = 0.06;
        break;
      case 'subdivision':
        frequency = this.FREQ_SUBDIVISION;
        duration = 0.04;
        break;
    }

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, time);

    // Sharp attack, quick decay envelope
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(volume, time + 0.002);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start(time);
    oscillator.stop(time + duration);
  }

  private playSample(type: 'accent' | 'click' | 'subdivision', time: number, volume: number): void {
    const buffer = this.samples[type];
    if (!buffer) {
      this.playSynth(type, time, volume);
      return;
    }

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = buffer;
    gainNode.gain.setValueAtTime(volume, time);

    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    source.start(time);
  }
}
