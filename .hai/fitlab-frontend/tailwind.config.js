/** @type {import('tailwindcss').Config} */
export default {
  // Specify the files where Tailwind CSS classes will be used
  // This includes the root HTML file and all JavaScript/TypeScript files in the src directory
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  // Theme configuration
  theme: {
    // Extend the default theme configuration
    // Currently empty, but can be used to add custom colors, fonts, spacing, etc.
    extend: {},
  },

  // Array of Tailwind CSS plugins
  // Currently no plugins are being used
  plugins: [],
};