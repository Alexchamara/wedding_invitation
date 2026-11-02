// Background music is an MP3 file; opening/celebration chimes are synthesized with the Web Audio API

class WeddingAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private music: HTMLAudioElement | null = null;
  private masterGain: GainNode | null = null;

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

  private getMusic(): HTMLAudioElement {
    if (!this.music) {
      this.music = new Audio('/audio/background-music.mp3');
      this.music.loop = true;
      this.music.volume = 0.5;
      this.music.preload = 'auto';
    }
    return this.music;
  }

  public startMusic(): Promise<void> {
    return this.getMusic().play().catch(() => {
      // Autoplay blocked or file unavailable; stay silent
    });
  }

  public pauseMusic() {
    this.music?.pause();
  }

  public toggleMusic(): boolean {
    if (this.isAudioActive()) {
      this.pauseMusic();
      return false;
    }
    this.startMusic();
    return true;
  }

  public isAudioActive(): boolean {
    return !!this.music && !this.music.paused;
  }
}

export const weddingAudio = new WeddingAudioSynthesizer();
