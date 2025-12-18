# Quick Start Guide

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment Variables
```bash
# Windows PowerShell
Copy-Item env.example .env

# Linux/Mac
cp env.example .env
```

Then edit `.env` and add your Deepgram API key:
```
VITE_DEEPGRAM_API_KEY=your_actual_deepgram_api_key_here
```

Get your API key from: https://console.deepgram.com/

### Step 3: Run the App
```bash
npm run tauri:dev
```

---

## 📋 What's Still Missing?

### Required for Production Build:
- **Icons**: Generate app icons (see `src-tauri/icons/README.md`)
  - Use [Tauri Icon Generator](https://github.com/tauri-apps/tauri-icon)
  - Or create manually: 32x32.png, 128x128.png, 256x256.png, icon.icns, icon.ico

### Optional Enhancements:
- ESLint configuration
- Prettier configuration
- CI/CD setup
- License file

See `MISSING_ITEMS.md` for complete details.

---

## ✅ What's Already Fixed

- ✅ TypeScript environment types (`src/vite-env.d.ts`)
- ✅ Tauri Vite plugin added
- ✅ Development scripts updated
- ✅ Package.json dependencies configured

---

## 🐛 Troubleshooting

**"Deepgram API key not found"**
- Make sure `.env` file exists in root directory
- Verify `VITE_DEEPGRAM_API_KEY` is set correctly
- Restart the dev server after creating `.env`

**"Rust not found"**
- Install Rust: https://www.rust-lang.org/tools/install
- Restart terminal after installation

**"Microphone permission denied"**
- Grant microphone permissions in system settings
- Refresh the app after granting permissions