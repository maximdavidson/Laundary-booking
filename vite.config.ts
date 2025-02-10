import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': resolve(__dirname, 'src/components'),
      '@ui': resolve(__dirname, 'src/ui'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@context': resolve(__dirname, 'src/context'),
      '@mock': resolve(__dirname, 'src/mock'),
      '@constants': resolve(__dirname, 'src/constants'),
    },
  },
})
