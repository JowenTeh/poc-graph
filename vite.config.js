import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import legacy from '@vitejs/plugin-legacy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // legacy({
    //   target: ['es2015'],
    // }),
  ],
  base: './',
  build: {
    target: ['es2015'],
    // lib: ['iife'],
    rollupOptions: {
      output: {
        format: 'umd',
      },
    },
  },
})
