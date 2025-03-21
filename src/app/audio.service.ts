import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private dataArray: Uint8Array = new Uint8Array();
  private frequencyArray: Uint8Array = new Uint8Array();
  private isInitialized = false;
  private currentVolume = 1.0; // Default volume level (0.0 to 1.0)
  
  // Observable to emit audio data to components
  private audioDataSubject = new BehaviorSubject<Uint8Array>(new Uint8Array());
  public audioData$: Observable<Uint8Array> = this.audioDataSubject.asObservable();

  // Observable for volume changes
  private volumeSubject = new BehaviorSubject<number>(this.currentVolume);
  public volume$: Observable<number> = this.volumeSubject.asObservable();

  constructor() { }

  async initAudio(): Promise<boolean> {
    try {
      // Get microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      
      // Create audio context
      this.audioContext = new AudioContext();
      
      // Create analyzer
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      
      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = this.currentVolume;
      
      // Create buffer for data
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      this.frequencyArray = new Uint8Array(bufferLength);
      
      // Connect microphone to gain node to analyzer
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.microphone.connect(this.gainNode);
      this.gainNode.connect(this.analyser);
      
      this.isInitialized = true;
      
      // Start the audio data collection loop
      this.collectAudioData();
      
      return true;
    } catch (error) {
      console.error('Error initializing audio:', error);
      return false;
    }
  }
  
  private collectAudioData(): void {
    if (!this.analyser || !this.isInitialized) return;
    
    // Get time domain data (waveform)
    this.analyser.getByteTimeDomainData(this.dataArray);
    
    // Get frequency domain data
    this.analyser.getByteFrequencyData(this.frequencyArray);
    
    // Publish the time domain data to subscribers
    this.audioDataSubject.next(new Uint8Array(this.dataArray));
    
    // Continue the loop
    requestAnimationFrame(() => this.collectAudioData());
  }
  
  stopAudio(): void {
    if (this.microphone && this.audioContext) {
      this.microphone.disconnect();
      if (this.gainNode) {
        this.gainNode.disconnect();
      }
      this.audioContext.close();
      this.isInitialized = false;
    }
  }

  getFrequencyData(): Uint8Array {
    return new Uint8Array(this.frequencyArray);
  }
  
  // Set the microphone volume (0.0 to 1.0)
  setVolume(volume: number): void {
    if (volume < 0) volume = 0;
    if (volume > 1) volume = 1;
    
    this.currentVolume = volume;
    
    if (this.gainNode && this.isInitialized) {
      this.gainNode.gain.setValueAtTime(volume, this.audioContext?.currentTime || 0);
    }
    
    this.volumeSubject.next(volume);
  }
  
  // Get the current microphone volume
  getVolume(): number {
    return this.currentVolume;
  }
}
