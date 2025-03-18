import { Component, ElementRef, OnDestroy, OnInit, ViewChild, Inject } from '@angular/core';
import { AudioService } from '../audio.service';
import { Subscription } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-audio-visualizer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-visualizer.component.html',
  styleUrls: ['./audio-visualizer.component.scss']
})
export class AudioVisualizerComponent implements OnInit, OnDestroy {
  @ViewChild('visualizerCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private canvasContext!: CanvasRenderingContext2D;
  private audioSubscription!: Subscription;
  public isListening = false;

  constructor(private audioService: AudioService, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupCanvas();
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.stopListening();
      if (this.audioSubscription) {
        this.audioSubscription.unsubscribe();
      }
    }
  }

  private setupCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.canvasContext = canvas.getContext('2d')!;
    
    // Make canvas responsive
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  async toggleListening(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      if (this.isListening) {
        this.stopListening();
      } else {
        await this.startListening();
      }
    }
  }

  async startListening(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      const success = await this.audioService.initAudio();
      if (success) {
        this.isListening = true;
        this.audioSubscription = this.audioService.audioData$.subscribe(data => {
          this.drawWaveform(data);
        });
      }
    }
  }

  stopListening(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.audioSubscription) {
        this.audioSubscription.unsubscribe();
      }
      this.audioService.stopAudio();
      this.isListening = false;
      this.clearCanvas();
    }
  }

  private clearCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  }

  private drawWaveform(dataArray: Uint8Array): void {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.width;
    const height = canvas.height;
    const bufferLength = dataArray.length;
    
    // Clear the canvas before drawing
    this.canvasContext.clearRect(0, 0, width, height);
    
    // Set line style
    this.canvasContext.lineWidth = 2;
    this.canvasContext.strokeStyle = 'var(--waveform-color, #00aaff)';
    
    // Start drawing path
    this.canvasContext.beginPath();
    
    // Calculate width of each segment
    const sliceWidth = width / bufferLength;
    let x = 0;
    
    // Draw the waveform
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;  // normalize to 0-2 range
      const y = (v * height) / 2;
      
      if (i === 0) {
        this.canvasContext.moveTo(x, y);
      } else {
        this.canvasContext.lineTo(x, y);
      }
      
      x += sliceWidth;
    }
    
    // Close the path and stroke it
    this.canvasContext.stroke();
  }
}
