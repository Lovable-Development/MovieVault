import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'


export default defineConfig({
  plugins: [VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'MovieVault',
    short_name: 'MovieVault',
    description: 'I am a simple Vite PWA app',
    theme_color: '#181818',
    background_color: '#e0cc3b',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    orientation: 'portrait',
    icons: [
      {
        src: 'MV-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: 'MV-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: 'MV-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  },
})],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
