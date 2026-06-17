import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default [
  { ignores: ['dist'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // The marketing site is imperative R3F/three.js (mutating materials in useFrame,
      // short-circuit assignments). These rules are false positives here.
      'react-hooks/immutability': 'off',
      'react-hooks/set-state-in-effect': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
]
