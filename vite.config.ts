import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  // 1. Set the base path for GitHub Pages (e.g., '/bikes-bazar/')
  // If your repo is "bikes-bazar-showcase-main", use that here:
  base: "/BIKES-BAZAR/", 

  server: {
    host: "0.0.0.0",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      // This allows you to use "@/" instead of "../../../" in your imports
      "@": path.resolve(__dirname, "./src"),
    },
  },
});