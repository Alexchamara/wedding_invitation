// Procedural Web Audio API sound generator (Zero external MP3 dependencies, zero 404s)

class WeddingAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;
  private currentStep: number = 0;

  // Gentle romantic arpeggio notes in Hz (Pentatonic / D major wedding progression)
  // D4, F#4, A4, D5, C#5, B4, A4, G4, F#4, E4
  private arpeggioFreqs = [
    293.66, 369.99, 440.00, 587.33,
    554.37, 493.88, 440.00, 392.00,
    369.99, 329.63, 293.66, 440.00,
    587.33, 739.99, 880.00, 587.33
  ];

  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playTone(freq: number, duration: number = 1.2, type: OscillatorType = 'sine', volume: number = 0.25) {
    try {
      const ctx = this.getAudioContext();
      if (this.isMuted) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Warm low-pass filter for soft acoustic celesta tone
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain || ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext policy handled gracefully
    }
  }

  public playRevealChime() {
    // Elegant two-note opening chime
    this.playTone(587.33, 1.4, 'sine', 0.2); // D5
    setTimeout(() => {
      this.playTone(880.00, 2.0, 'sine', 0.22); // A5
    }, 180);
    setTimeout(() => {
      this.playTone(1174.66, 2.5, 'sine', 0.15); // D6
    }, 380);
  }

  public playCelebrationChime() {
    const chord = [587.33, 739.99, 880.00, 1174.66];
    chord.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 2.0, 'sine', 0.2);
      }, idx * 100);
    });
  }

  private tickArpeggio = () => {
    if (!this.isPlaying || this.isMuted) return;

    const freq = this.arpeggioFreqs[this.currentStep % this.arpeggioFreqs.length];
    this.currentStep++;

    this.playTone(freq, 1.6, 'sine', 0.12);

    // Occasional gentle low root bass note for warmth
    if (this.currentStep % 4 === 0) {
      const bassFreq = freq * 0.25;
      this.playTone(bassFreq, 2.8, 'triangle', 0.08);
    }

    this.timerId = window.setTimeout(this.tickArpeggio, 750);
  };

  public startMusic(): Promise<void> {
    try {
      this.getAudioContext();
      this.isPlaying = true;
      this.isMuted = false;
      if (this.timerId === null) {
        this.tickArpeggio();
      }
      return Promise.resolve();
    } catch {
      return Promise.resolve();
    }
  }

  public pauseMusic() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public toggleMusic(): boolean {
    if (this.isPlaying) {
      this.pauseMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  public isAudioActive(): boolean {
    return this.isPlaying;
  }
}

export const weddingAudio = new WeddingAudioSynthesizer();
