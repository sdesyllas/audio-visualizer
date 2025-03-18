# Audio Visualizer

A real-time microphone audio visualizer built with Angular that displays waveforms from audio input with customizable themes.

![Audio Visualizer Demo](path-to-screenshot.png) <!-- Add a screenshot of your app when available -->

## Features

- Real-time audio visualization from microphone input
- Responsive waveform display that adapts to window size
- Dark/light theme switching with persistent preferences
- Clean, modern UI built with Angular

## Prerequisites

- Node.js (v14 or later recommended)
- npm (v6 or later)
- Modern web browser with microphone access and Web Audio API support

## Installation

1. Clone the repository
```bash
git clone https://your-repository-url/audio-visualizer.git
cd audio-visualizer
```

2. Install dependencies
```bash
npm install
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## How to Use

1. Open the application in your browser
2. Click the "Listen" button to request microphone access
3. Speak or play audio near your microphone to see the waveform visualization
4. Toggle between dark and light themes using the theme switcher button

## Browser Compatibility

This application uses the Web Audio API and requires microphone access. It works best in:
- Chrome 74+
- Firefox 75+
- Edge 79+
- Safari 14.1+

## Privacy

This application processes audio entirely within your browser. No audio data is ever sent to any server.

## Building for Production

To build the project for production, run:

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

## Running Tests

### Unit Tests

To execute unit tests with Karma, run:

```bash
ng test
```

## Project Structure

- `src/app/audio-visualizer/` - Component for visualizing audio waveforms
- `src/app/theme-switcher/` - Component for toggling between light and dark themes
- `src/app/audio.service.ts` - Service for handling microphone access and audio processing

## Technologies Used

- Angular 19.2.3
- RxJS for reactive programming
- Web Audio API for audio processing
- HTML5 Canvas for visualization

## License

[MIT](LICENSE) <!-- Add an appropriate license file to your project if you haven't already -->

## Acknowledgments

- Built with [Angular](https://angular.io/)
- Inspired by audio visualization techniques from the Web Audio API
