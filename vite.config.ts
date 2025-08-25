import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react' // if using React
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    // react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'favicon.ico',
        'robots.txt',
        'apple-touch-icon.png'
      ],
      manifest: {
        name: 'MovieVault',
        short_name: 'MovieVault',
        description: 'A Progressive Web App built with Vite!',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'MV-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'MV-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'MV-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})
