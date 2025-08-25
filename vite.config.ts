import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Movie Vault",
        short_name: "MovieVault",
        description: "Your personal movie collection vault",
        theme_color: "#000000",
        start_url: ".",
        display: "standalone",
        icons: [
          {
            src: "MV-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "MV-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "MV-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
