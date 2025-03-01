// Import the defineConfig function from Vite
// This function is used to define and type-check the configuration
import { defineConfig } from 'vite'

// Import the React plugin for Vite
// This plugin provides React specific features and optimizations
import react from '@vitejs/plugin-react'

// Export the Vite configuration
// The configuration is wrapped in defineConfig for better TypeScript support
export default defineConfig({
  // Configure plugins array with React plugin
  // This enables React support including JSX transformation and HMR
  plugins: [react()],
})