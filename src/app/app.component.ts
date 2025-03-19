import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AudioVisualizerComponent } from './audio-visualizer/audio-visualizer.component';
import { ThemeSwitcherComponent } from './theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AudioVisualizerComponent, ThemeSwitcherComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Coding GenAI Demo';
}
