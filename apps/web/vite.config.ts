import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // allow serving behind the local Caddy proxy at maplefurnishers.com (dev only)
  server: { allowedHosts: true },
  preview: { allowedHosts: true },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          animation: ['gsap', '@gsap/react', 'lenis', 'motion'],
        },
      },
    },
  },
})
