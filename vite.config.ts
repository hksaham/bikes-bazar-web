import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// The componentTagger/lovableTagger import should be GONE

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
  plugins: [
    react(),
    // Only standard plugins should remain here
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});