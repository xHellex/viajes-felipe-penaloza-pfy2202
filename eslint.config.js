import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // mockServiceWorker.js lo genera `npx msw init`: no se edita ni se revisa
  globalIgnores(['dist', 'public/mockServiceWorker.js', 'playwright-report', 'test-results']),
  {
    files: ['**/*.{js,jsx,mjs}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // Configuración, scripts y pruebas e2e corren en Node
    files: ['*.config.js', 'scripts/**', 'e2e/**'],
    languageOptions: { globals: globals.node },
  },
])
