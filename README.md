# Audio Visualizer

A real-time microphone audio visualizer built with Angular that displays waveforms from audio input with customizable themes.

![image](https://github.com/user-attachments/assets/269e7b78-9265-49ce-88c0-db5cf4bcaaaf)

## Features

- Real-time audio visualization from microphone input
- Responsive waveform display that adapts to window size
- Dark/light theme switching with persistent preferences
- Clean, modern UI built with Angular
- Server-side rendering (SSR) support for improved SEO and initial load performance

## Prerequisites

- Node.js (v18.18.0 or later recommended)
- npm (v9 or later)
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

## Server-Side Rendering

This project supports Angular's SSR capabilities. To run the app with SSR:

```bash
npm run build
npm run serve:ssr:audio-visualizer
```

Then navigate to `http://localhost:4000/`.

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
- `src/main.server.ts` and `src/server.ts` - Server-side rendering setup
- `src/app.config.server.ts` - Server-side application configuration

## Technologies Used

- Angular 19.2.3
- RxJS 7.8.0 for reactive programming
- Web Audio API for audio processing
- HTML5 Canvas for visualization
- Express for server-side rendering

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- Built with [Angular](https://angular.io/)
- Inspired by audio visualization techniques from the Web Audio API
- Uses Express.js for server-side functionality
