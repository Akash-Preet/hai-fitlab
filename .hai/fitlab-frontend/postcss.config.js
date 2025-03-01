// PostCSS Configuration File
// This file configures PostCSS, a tool for transforming CSS with JavaScript

export default {
  // Define the plugins to be used by PostCSS
  plugins: {
    // Enable Tailwind CSS processing
    // Tailwind is a utility-first CSS framework
    tailwindcss: {},

    // Enable Autoprefixer
    // Automatically adds vendor prefixes to CSS rules (e.g., -webkit-, -moz-)
    // based on current browser popularity and property support
    autoprefixer: {},
  },
};