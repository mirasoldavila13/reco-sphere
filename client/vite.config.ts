import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      // Proxy for RESTful API endpoints
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
      },
      // Proxy for GraphQL endpoint
      "/graphql": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
