import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
   // ↓↓↓↓ ADD THIS ↓↓↓↓
    resolve: {
        alias: {
            "@": "/public",
            "@img": "/public/images",
        },
    },
})
