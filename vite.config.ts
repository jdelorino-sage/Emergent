import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // PixiJS uses dynamic import() for renderer auto-detection which can
    // fail in some deployment environments. Inline everything into one bundle.
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        inlineDynamicImports: true,
      },
    },
  },
});
