# Quick Setup Guide

## Prerequisites

1. **Node.js** (v18+): https://nodejs.org/
2. **Rust**: https://www.rust-lang.org/tools/install
3. **Deepgram API Key**: https://console.deepgram.com/

## Installation Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `env.example` to `.env`
   - Add your Deepgram API key:
     ```
     VITE_DEEPGRAM_API_KEY=your_api_key_here
     ```

3. **Run in development:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm run tauri build
   ```

## Troubleshooting

- **Rust not found**: Make sure Rust is installed and in your PATH
- **API key errors**: Verify your `.env` file exists and contains a valid Deepgram API key
- **Microphone access**: Grant microphone permissions when prompted
- **Build errors**: Try `npm run tauri build -- --debug` for more details

