export class TimerAudio {
  private static instance: TimerAudio;
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private activeTimers = 0;

  private constructor() { }

  static getInstance(): TimerAudio {
    if (!TimerAudio.instance) {
      TimerAudio.instance = new TimerAudio();
    }
    return TimerAudio.instance;
  }

  private async initializeAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  async play(): Promise<void> {
    try {
      await this.initializeAudioContext();

      if (!this.audioContext) {
        throw new Error('AudioContext not initialized');
      }

      if (this.oscillator) {
        this.activeTimers++;
        return;
      }
      // Create and configure oscillator
      this.oscillator = this.audioContext.createOscillator();
      this.gainNode = this.audioContext.createGain();

      this.oscillator.type = 'sine';
      this.oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime); // A5 note

      // Configure gain (volume) envelope
      this.gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);

      // Connect nodes
      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);

      // Start the oscillator indefinitely
      this.oscillator.start();
      this.activeTimers++;

    } catch (error) {
      console.error('Failed to play audio:', error);
    }
  }

  stop(): void {
    if (this.activeTimers > 1) {
      this.activeTimers--;
      return;
    }

    if (this.oscillator) {
      this.oscillator.stop();
      this.cleanup();
    }
    this.activeTimers = 0;
  }

  private cleanup(): void {
    if (this.oscillator) {
      try {
        this.oscillator.stop();
        this.oscillator.disconnect();
      } catch (error) {
        console.log(error)
      }
      this.oscillator = null;
    }

    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }
  }
}