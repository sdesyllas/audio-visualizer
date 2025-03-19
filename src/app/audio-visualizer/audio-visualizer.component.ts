import { Component, ElementRef, OnDestroy, OnInit, ViewChild, Inject } from '@angular/core';
import { AudioService } from '../audio.service';
import { Subscription } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type VisualizationType = 'waveform' | 'bars' | 'circles' | 'frequency';

@Component({
  selector: 'app-audio-visualizer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audio-visualizer.component.html',
  styleUrls: ['./audio-visualizer.component.scss']
})
export class AudioVisualizerComponent implements OnInit, OnDestroy {
  @ViewChild('visualizerCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private canvasContext!: CanvasRenderingContext2D;
  private audioSubscription!: Subscription;
  private volumeSubscription!: Subscription;
  public isListening = false;
  public visualizationTypes: VisualizationType[] = ['waveform', 'bars', 'circles', 'frequency'];
  public selectedVisualization: VisualizationType = 'waveform';
  public microphoneVolume = 1.0;

  constructor(private audioService: AudioService, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupCanvas();
      
      // Initialize volume from service
      this.microphoneVolume = this.audioService.getVolume();
      
      // Subscribe to volume changes
      this.volumeSubscription = this.audioService.volume$.subscribe(volume => {
        this.microphoneVolume = volume;
      });
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.stopListening();
      if (this.audioSubscription) {
        this.audioSubscription.unsubscribe();
      }
      if (this.volumeSubscription) {
        this.volumeSubscription.unsubscribe();
      }
    }
  }

  // Update microphone volume when slider changes
  onVolumeChange(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.audioService.setVolume(this.microphoneVolume);
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
          this.drawVisualization(data);
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

  private drawVisualization(dataArray: Uint8Array): void {
    // Call the selected visualization method based on user's choice
    switch (this.selectedVisualization) {
      case 'waveform':
        this.drawWaveform(dataArray);
        break;
      case 'bars':
        this.drawBars(dataArray);
        break;
      case 'circles':
        this.drawCircles(dataArray);
        break;
      case 'frequency':
        this.drawFrequency(dataArray);
        break;
      default:
        this.drawWaveform(dataArray);
    }
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

  private drawBars(dataArray: Uint8Array): void {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.width;
    const height = canvas.height;
    const bufferLength = dataArray.length;
    
    // Clear the canvas before drawing
    this.canvasContext.clearRect(0, 0, width, height);
    
    // Set bar style
    this.canvasContext.fillStyle = 'var(--waveform-color, #00aaff)';
    
    // Calculate bar width with spacing
    const barWidth = (width / bufferLength) * 2.5;
    let x = 0;
    
    // Draw the bars
    for (let i = 0; i < bufferLength; i += 2) {
      const v = dataArray[i] / 128.0;  // normalize to 0-2 range
      const barHeight = (v * height) / 2;
      
      this.canvasContext.fillRect(x, height / 2 - barHeight / 2, barWidth, barHeight);
      x += barWidth + 1; // Add a small gap between bars
    }
  }

  private drawCircles(dataArray: Uint8Array): void {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear the canvas before drawing
    this.canvasContext.clearRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;
    
    // Set circle style
    this.canvasContext.strokeStyle = 'var(--waveform-color, #00aaff)';
    
    // Draw multiple circles based on audio data
    for (let i = 0; i < 5; i++) {
      const offset = i * 30;
      const sampleIndex = Math.floor((dataArray.length / 5) * i);
      const amplitude = dataArray[sampleIndex] / 255.0; // Normalize to 0-1
      
      this.canvasContext.beginPath();
      this.canvasContext.lineWidth = 2 + amplitude * 3;
      this.canvasContext.arc(centerX, centerY, radius + offset + amplitude * 20, 0, 2 * Math.PI);
      this.canvasContext.stroke();
    }
  }

  private drawFrequency(dataArray: Uint8Array): void {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.width;
    const height = canvas.height;
    const bufferLength = dataArray.length;
    
    // Clear the canvas before drawing
    this.canvasContext.clearRect(0, 0, width, height);
    
    // Use frequency data from the analyzer
    if (this.audioService.getFrequencyData) {
      const frequencyData = this.audioService.getFrequencyData();
      
      // Set bar style
      this.canvasContext.fillStyle = 'var(--waveform-color, #00aaff)';
      
      // Calculate bar width
      const barWidth = (width / frequencyData.length);
      let x = 0;
      
      // Draw the frequency bars
      for (let i = 0; i < frequencyData.length; i++) {
        const barHeight = (frequencyData[i] / 255) * height;
        
        this.canvasContext.fillRect(x, height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    } else {
      // Fallback to a modified waveform if frequency data isn't available
      this.drawWaveform(dataArray);
    }
  }
}
