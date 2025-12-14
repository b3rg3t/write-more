import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";

const manifestConfig: Partial<VitePWAOptions> = {
  registerType: "autoUpdate",
  includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
  manifest: {
    name: "Write More",
    short_name: "Write More",
    description:
      "Keep your all your notes in one place. Write more, worry less.",
    icons: [
      { src: "/16x16.png", sizes: "16x16", type: "image/png" },
      { src: "/32x32.png", sizes: "32x32", type: "image/png" },
      { src: "/72x72.png", sizes: "72x72", type: "image/png" },
      { src: "/96x96.png", sizes: "96x96", type: "image/png" },
      { src: "/120x120.png", sizes: "120x120", type: "image/png" },
      { src: "/128x128.png", sizes: "128x128", type: "image/png" },
      { src: "/144x144.png", sizes: "144x144", type: "image/png" },
      { src: "/152x152.png", sizes: "152x152", type: "image/png" },
      { src: "/180x180.png", sizes: "180x180", type: "image/png" },
      { src: "/192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/384x384.png", sizes: "384x384", type: "image/png" },
      { src: "/512x512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    theme_color: "#000000",
    background_color: "#000000",
    display: "standalone",
    scope: "https://write-more-gamma.vercel.app/",
    start_url: "https://write-more-gamma.vercel.app/",
    orientation: "portrait",
  },
  devOptions: {
    enabled: false,
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestConfig)],
  server: {
    open: "/",
  },
});
