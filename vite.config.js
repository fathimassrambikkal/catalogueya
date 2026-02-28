import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],

  server: {
    proxy: {
      "/google-api": {
        target: "https://maps.googleapis.com/maps/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/google-api/, ""),
      },
    },
  },

  // 🔥 REMOVE console.* & debugger IN PRODUCTION
  esbuild: {
    drop: ["console", "debugger"],
  },
});
