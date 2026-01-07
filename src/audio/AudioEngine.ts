import { ClickSynth } from './ClickSynth';
import type { Subdivision, SoundType } from '../types';

export type BeatCallback = (beat: number, subdivision: number, isAccent: boolean, isDownbeat: boolean) => void;

interface SchedulerConfig {
  bpm: number;
  beatsPerMeasure: number;
  subdivision: Subdivision;
  accentPattern: boolean[];
  accentVolume: number;
  clickVolume: number;
  soundType: SoundType;
}

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private clickSynth: ClickSynth | null = null;
  private schedulerTimer: number | null = null;
  private isRunning = false;

  // Timing constants
  private readonly LOOKAHEAD = 0.1; // 100ms lookahead
  private readonly SCHEDULE_INTERVAL = 25; // 25ms scheduler interval

  // Current state
  private nextNoteTime = 0;
  private currentBeat = 0;
  private currentSubdivision = 0;

  // Config
  private config: SchedulerConfig = {
    bpm: 120,
    beatsPerMeasure: 4,
    subdivision: 1,
    accentPattern: [true],
    accentVolume: 1,
    clickVolume: 0.7,
    soundType: 'synth'
  };

  private beatCallback: BeatCallback | null = null;

  async init(): Promise<void> {
    if (this.audioContext) return;

    this.audioContext = new AudioContext();
    this.clickSynth = new ClickSynth(this.audioContext);

    // iOS requires resuming on user gesture
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  async start(callback?: BeatCallback): Promise<void> {
    if (!this.audioContext) {
      await this.init();
    }

    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }

    this.beatCallback = callback || null;
    this.isRunning = true;
    this.currentBeat = 0;
    this.currentSubdivision = 0;
    this.nextNoteTime = this.audioContext!.currentTime;

    this.scheduler();
  }

  stop(): void {
    this.isRunning = false;
    if (this.schedulerTimer !== null) {
      clearTimeout(this.schedulerTimer);
      this.schedulerTimer = null;
    }
    this.currentBeat = 0;
    this.currentSubdivision = 0;
  }

  updateConfig(config: Partial<SchedulerConfig>): void {
    this.config = { ...this.config, ...config };
    this.clickSynth?.setSoundType(this.config.soundType);
  }

  private scheduler(): void {
    if (!this.audioContext || !this.isRunning) return;

    // Schedule all notes that fall within the lookahead window
    while (this.nextNoteTime < this.audioContext.currentTime + this.LOOKAHEAD) {
      this.scheduleNote(this.nextNoteTime);
      this.advanceNote();
    }

    // Schedule next scheduler call
    this.schedulerTimer = window.setTimeout(
      () => this.scheduler(),
      this.SCHEDULE_INTERVAL
    );
  }

  private scheduleNote(time: number): void {
    if (!this.clickSynth) return;

    const isDownbeat = this.currentBeat === 0 && this.currentSubdivision === 0;
    const isBeatStart = this.currentSubdivision === 0;
    const isAccented = this.config.accentPattern[this.currentSubdivision] ?? false;

    // Determine click type and volume
    let volume: number;
    let type: 'accent' | 'click' | 'subdivision';

    if (isDownbeat) {
      type = 'accent';
      volume = this.config.accentVolume;
    } else if (isBeatStart) {
      type = isAccented ? 'accent' : 'click';
      volume = isAccented ? this.config.accentVolume : this.config.clickVolume;
    } else {
      type = isAccented ? 'click' : 'subdivision';
      volume = isAccented ? this.config.clickVolume : this.config.clickVolume * 0.6;
    }

    this.clickSynth.play(type, time, volume);

    // Fire callback for UI updates (with slight delay to sync with audio)
    if (this.beatCallback) {
      const delay = Math.max(0, (time - this.audioContext!.currentTime) * 1000);
      setTimeout(() => {
        this.beatCallback?.(
          this.currentBeat,
          this.currentSubdivision,
          isAccented || isDownbeat,
          isDownbeat
        );
      }, delay);
    }
  }

  private advanceNote(): void {
    // Calculate duration of one subdivision
    const secondsPerBeat = 60 / this.config.bpm;
    const secondsPerSubdivision = secondsPerBeat / this.config.subdivision;

    this.nextNoteTime += secondsPerSubdivision;

    // Advance subdivision counter
    this.currentSubdivision++;
    if (this.currentSubdivision >= this.config.subdivision) {
      this.currentSubdivision = 0;
      this.currentBeat++;
      if (this.currentBeat >= this.config.beatsPerMeasure) {
        this.currentBeat = 0;
      }
    }
  }

  dispose(): void {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.clickSynth = null;
  }
}
