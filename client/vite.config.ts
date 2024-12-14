import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    port: 3000,
    open: true,
    // temporarily removed proxy configuration before render deployment
    // proxy: {
    //   // Proxy for RESTful API endpoints
    //   "/api": {
    //     target: "http://localhost:4000",
    //     changeOrigin: true,
    //     secure: false,
    //   },
    //   // Proxy for GraphQL endpoint
    //   "/graphql": {
    //     target: "http://localhost:4000",
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },
});
