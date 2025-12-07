class AudioService {
  private ctx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private isMuted: boolean = false;

  constructor() {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.connect(this.ctx.destination);
    } catch (e) {
      console.error("Web Audio API not supported");
    }
  }

  public init() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(mute: boolean) {
    this.isMuted = mute;
  }

  public play(type: 'type' | 'success' | 'error' | 'hover' | 'boot' | 'click') {
    if (!this.ctx || !this.gainNode || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    const now = this.ctx.currentTime;

    switch (type) {
      case 'type':
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      
      case 'hover':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(300, now + 0.05);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;

      case 'click':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;

      case 'success':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.1); // Arpeggio up
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
        
        // Second harmony
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(554.37, now); // C#
        osc2.frequency.linearRampToValueAtTime(1108, now + 0.1);
        gain2.gain.setValueAtTime(0.05, now);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc2.start(now);
        osc2.stop(now + 0.6);
        break;

      case 'error':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
        
      case 'boot':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(50, now);
        osc.frequency.linearRampToValueAtTime(1000, now + 1.5);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0, now + 2);
        osc.start(now);
        osc.stop(now + 2);
        break;
    }
  }
}

export const audioService = new AudioService();
