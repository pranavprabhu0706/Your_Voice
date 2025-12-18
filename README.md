# Your Voice

A Voice-to-Text Desktop Application built with Tauri and Deepgram, inspired by Wispr Flow. This application provides real-time speech-to-text transcription with a clean, intuitive interface.

## Demo of the project's execution

https://drive.google.com/drive/folders/1OF7e_qXHGTEl1hQUQuDDyFhIzpS5bATo?usp=sharing


## Features

- **Push-to-Talk Voice Input**: Click the button or hold Spacebar to start/stop recording
- **Real-Time Transcription**: Stream audio to Deepgram for low-latency transcription
- **Microphone Access**: Automatic permission handling and high-quality audio capture
- **Text Display & Management**: View transcribed text with copy and clear functionality
- **Error Handling**: Error handling for network issues, API errors, and permission denials
- **Cross-Platform**: Works on Windows, macOS, and Linux

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Rust** (latest stable version) - [Install Rust](https://www.rust-lang.org/tools/install)
- **Deepgram API Key** - [Get your API key](https://console.deepgram.com/)

### Installing Rust

If you don't have Rust installed:

```bash
# On Windows, download and run rustup-init.exe from https://rustup.rs/
# On macOS/Linux:
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

## Setup Instructions

### 1. Clone or Download the Project

Navigate to the project directory:

```bash
cd YourVoice
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Deepgram API Key

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and add your Deepgram API key:

```
VITE_DEEPGRAM_API_KEY=your_actual_api_key_here
```

**Important**: Never commit your `.env` file to version control. It's already included in `.gitignore`.

### 4. Run the Development Server

```bash
npm run dev
```

This will start the Vite development server. The Tauri window should open automatically.

### 5. Build for Production

To create a production build:

```bash
npm run build
```

Then build the Tauri app:

```bash
npm run tauri build
```

The built application will be in `src-tauri/target/release/`.

## Architecture

### Project Structure

```
YourVoice/
├── src/
│   ├── components/          # React UI components
│   │   ├── VoiceRecorder.tsx
│   │   ├── TranscriptionDisplay.tsx
│   │   └── *.css
│   ├── services/            # Core business logic
│   │   ├── audioCapture.ts  # Microphone access & audio capture
│   │   └── deepgramService.ts # Deepgram API integration
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # React entry point
│   └── index.css            # Global styles
├── src-tauri/               # Tauri backend (Rust)
│   ├── src/
│   │   └── main.rs          # Tauri entry point
│   ├── Cargo.toml           # Rust dependencies
│   └── tauri.conf.json      # Tauri configuration
├── package.json
├── vite.config.ts
└── README.md
```

### Separation of Concerns

The application follows a clean architecture with clear separation:

1. **UI Layer** (`components/`): React components responsible for user interface and user interactions
2. **Service Layer** (`services/`): Core business logic for audio capture and transcription
3. **Application Layer** (`App.tsx`): Orchestrates components and manages application state

### Key Components

#### AudioCaptureService
- Handles microphone permission requests
- Manages audio stream capture
- Converts audio to Float32Array format for processing
- Provides cleanup methods for resource management

#### DeepgramService
- Manages WebSocket connection to Deepgram API
- Handles audio data transmission
- Processes transcription responses
- Manages connection lifecycle

#### VoiceRecorder Component
- Provides push-to-talk interface
- Coordinates between AudioCaptureService and DeepgramService
- Handles recording state management
- Provides visual feedback to users

#### TranscriptionDisplay Component
- Displays transcribed text
- Provides copy and clear functionality
- Shows error messages
- Displays word count

## Usage

1. **Start Recording**: Click the microphone button or press and hold the Spacebar
2. **Speak**: The app will capture your voice and transcribe it in real-time
3. **Stop Recording**: Release the Spacebar or click the stop button
4. **Copy Text**: Click the "Copy" button to copy the transcription to your clipboard
5. **Clear Text**: Click the "Clear" button to reset the transcription

## Known Limitations

1. **API Key Required**: You must provide a valid Deepgram API key in the `.env` file
2. **Internet Connection**: Real-time transcription requires an active internet connection
3. **Browser Permissions**: The app requires microphone permissions, which must be granted by the user
4. **Audio Quality**: Transcription accuracy depends on microphone quality and background noise
5. **Single Language**: Currently configured for English (en-US), but can be changed in `deepgramService.ts`

## Troubleshooting

### Microphone Permission Denied
- Ensure your browser/system has granted microphone permissions
- Check system privacy settings
- Try refreshing the application

### API Key Errors
- Verify your Deepgram API key is correct in the `.env` file
- Ensure the `.env` file is in the root directory
- Check that the API key has sufficient credits/quota

### Connection Issues
- Check your internet connection
- Verify Deepgram API status
- Check browser console for detailed error messages

### Build Errors
- Ensure Rust is properly installed: `rustc --version`
- Ensure Node.js is up to date: `node --version`
- Try cleaning and rebuilding: `npm run tauri build -- --debug`

## Development Decisions

### Why Tauri?
- Smaller bundle sizes compared to Electron
- Better performance with native system integration
- Rust backend provides security and performance benefits
- Cross-platform support (Windows, macOS, Linux)

### Why Deepgram?
- Low-latency real-time transcription
- High accuracy with modern AI models
- WebSocket API for streaming audio
- Developer-friendly API

### Why React?
- Popular and well-documented framework
- Component-based architecture for maintainability
- Large ecosystem and community support
- Good TypeScript integration

### Audio Processing
- Using Web Audio API for high-quality audio capture
- 16kHz sample rate optimized for speech recognition
- Float32Array to Int16Array conversion for Deepgram compatibility
- ScriptProcessorNode for real-time audio streaming