import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// Note: Tauri v1 uses CLI-based build, so we don't need the vite plugin
// The plugin is available for Tauri v2, but this project uses Tauri v1
export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
});

