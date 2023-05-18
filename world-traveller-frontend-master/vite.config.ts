import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), { ...eslint({ include: "src/**/*.+(js|jsx|ts|tsx)" }), enforce: "pre" }],
  server: {
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
});
