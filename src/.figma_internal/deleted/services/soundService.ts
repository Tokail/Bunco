import { SoundEvents } from '../types/game';

export class SoundService implements SoundEvents {
  private audioContext: AudioContext | null = null;
  private enabled = true;
  
  constructor() {
    // Initialize audio context on first user interaction
    this.initAudioContext();
  }
  
  private initAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
      this.enabled = false;
    }
  }
  
  private async ensureAudioContext(): Promise<void> {
    if (!this.audioContext) {
      this.initAudioContext();
    }
    
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }
  
  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
    if (!this.enabled || !this.audioContext) return;
    
    this.ensureAudioContext().then(() => {
      if (!this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    });
  }
  
  private playMultipleTones(tones: { frequency: number; duration: number; delay: number }[]): void {
    tones.forEach(({ frequency, duration, delay }) => {
      setTimeout(() => this.playTone(frequency, duration), delay);
    });
  }
  
  diceShake(): void {
    // Rapid low tones to simulate dice shaking
    const shakeTones = Array.from({ length: 8 }, (_, i) => ({
      frequency: 150 + Math.random() * 50,
      duration: 0.1,
      delay: i * 50
    }));
    this.playMultipleTones(shakeTones);
  }
  
  diceRoll(): void {
    // Three quick tones for the three dice
    const rollTones = [
      { frequency: 300, duration: 0.15, delay: 0 },
      { frequency: 350, duration: 0.15, delay: 100 },
      { frequency: 400, duration: 0.15, delay: 200 }
    ];
    this.playMultipleTones(rollTones);
  }
  
  bunco(): void {
    // Triumphant ascending melody
    const buncoTones = [
      { frequency: 523, duration: 0.3, delay: 0 },    // C5
      { frequency: 659, duration: 0.3, delay: 200 },  // E5
      { frequency: 784, duration: 0.3, delay: 400 },  // G5
      { frequency: 1047, duration: 0.5, delay: 600 }  // C6
    ];
    this.playMultipleTones(buncoTones);
  }
  
  babyBunco(): void {
    // Cheerful but shorter melody
    const babyBuncoTones = [
      { frequency: 523, duration: 0.2, delay: 0 },    // C5
      { frequency: 659, duration: 0.2, delay: 150 },  // E5
      { frequency: 784, duration: 0.3, delay: 300 }   // G5
    ];
    this.playMultipleTones(babyBuncoTones);
  }
  
  roundWin(): void {
    // Victory fanfare
    const winTones = [
      { frequency: 440, duration: 0.2, delay: 0 },
      { frequency: 554, duration: 0.2, delay: 200 },
      { frequency: 659, duration: 0.2, delay: 400 },
      { frequency: 880, duration: 0.4, delay: 600 }
    ];
    this.playMultipleTones(winTones);
  }
  
  gameWin(): void {
    // Epic victory theme
    const gameTones = [
      { frequency: 523, duration: 0.4, delay: 0 },
      { frequency: 659, duration: 0.4, delay: 300 },
      { frequency: 784, duration: 0.4, delay: 600 },
      { frequency: 1047, duration: 0.6, delay: 900 },
      { frequency: 1319, duration: 0.8, delay: 1200 }
    ];
    this.playMultipleTones(gameTones);
  }
  
  tick(): void {
    this.playTone(800, 0.1);
  }
  
  timeUp(): void {
    // Urgent beeping
    const timeUpTones = [
      { frequency: 880, duration: 0.2, delay: 0 },
      { frequency: 880, duration: 0.2, delay: 250 },
      { frequency: 880, duration: 0.2, delay: 500 }
    ];
    this.playMultipleTones(timeUpTones);
  }
  
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
  
  isEnabled(): boolean {
    return this.enabled;
  }
}