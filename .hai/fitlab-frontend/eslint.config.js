// ESLint Configuration File
// This configuration sets up linting rules for JavaScript and React applications

// Import required ESLint plugins and configurations
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  // Ignore the 'dist' directory from linting
  { ignores: ['dist'] },
  {
    // Apply rules to JavaScript and JSX files
    files: ['**/*.{js,jsx}'],

    // Language and environment options
    languageOptions: {
      // Set ECMAScript version to 2020
      ecmaVersion: 2020,
      // Include browser globals
      globals: globals.browser,
      // Parser options for modern JavaScript and JSX
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },

    // Configure React-related plugins
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },

    // Define linting rules
    rules: {
      // Include recommended JavaScript rules
      ...js.configs.recommended.rules,
      // Include recommended React Hooks rules
      ...reactHooks.configs.recommended.rules,
      // Configure unused variables rule to ignore uppercase variables
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // Configure React Refresh rules for component exports
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]