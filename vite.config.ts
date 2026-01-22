import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@components": "./src/components",
    },
  },
  build: {
    outDir: "dist/client",
  },
  // envDir: "C:\\Users\\Admin\\OneDrive\\Desktop\\projects\\my-app\\.env",
});
