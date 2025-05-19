import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  base: '/hackathon-chrono-canvas/',
  define: {
    'process.env.PACKAGE_VERSION': JSON.stringify(process.env.npm_package_version)
  }
})
