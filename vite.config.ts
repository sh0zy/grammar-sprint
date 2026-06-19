import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' で相対パス出力 → Capacitor / file:// での読み込みに対応
// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
})
