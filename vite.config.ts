import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/hackathon-chrono-canvas/', // GitHub Pages repository name
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    allowedHosts: ['5173-iw87zc5lzo1ib6gdn4ug7-fb8a0aa4.manus.computer'],
  },
  preview: {
    port: 4173,
    strictPort: true,
    host: true,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'react-router-dom',
    ],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
