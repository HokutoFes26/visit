import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { fileURLToPath, URL } from "node:url";
export default defineConfig({
  base: "./",
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      registerType: "prompt",
      injectRegister: false,
      injectManifest: {
        globPatterns: [
          "**/*.{js,css,html,svg,png,jpg,jpeg,webp,avif,woff,woff2,json}",
        ],
      },
      manifest: {
        name: "工場見学 電子パンフレット",
        short_name: "工場見学",
        description: "スケジュール・企業情報・見学メモ",
        lang: "ja",
        start_url: "./",
        scope: "./",
        display: "standalone",
        theme_color: "#10233f",
        background_color: "#edf4ff",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icons/maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
