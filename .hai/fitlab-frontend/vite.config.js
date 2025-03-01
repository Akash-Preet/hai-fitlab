// Vite configuration file for the fitness app

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Vite configuration object
 * @see https://vite.dev/config/
 */
export default defineConfig({
  // Configure plugins - React is the main plugin used
  plugins: [react()],

  // Server configuration
  server: {
    // Proxy configuration for API requests
    proxy: {
      // All requests to /api will be proxied
      "/api": {
        // Target backend server URL
        target: "http://localhost:5005",
        // Enables origin changes in the host header
        changeOrigin: true,
        // Disables SSL certificate validation
        secure: false,
      },
    },
  },
});