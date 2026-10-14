import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Dev only: forward /api calls to the NestJS backend (single-server in production)
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
