import react from 'eslint-plugin-react';
import hooks from 'eslint-plugin-react-hooks';
import a11y from 'eslint-plugin-jsx-a11y';
import reactRefresh from 'eslint-plugin-react-refresh';
import tanstackQuery from '@tanstack/eslint-plugin-query';
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import securityNode from 'eslint-plugin-security-node';

export default [
  {
    ignores: [
      'eslint.config.js',
      'eslint.config.mjs',
      'node_modules/**',
      'vite.config.ts',
      'src/vite-env.d.ts',
      'dist/**',
      'build/**',
      'coverage/**',
      '*.min.js',
      '*.d.ts',
      '.next/**',
      '.nuxt/**',
      'public/**',
      'static/**',
      'src/components/ui/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,

  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: {
      'jsx-a11y': a11y,
    },
    rules: {
      ...a11y.configs.recommended.rules,
    },
  },

  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: {
      '@tanstack/query': tanstackQuery,
    },
    rules: {
      ...tanstackQuery.configs.recommended.rules,
    },
  },

  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],

    plugins: {
      'react-hooks': hooks,
      'react-refresh': reactRefresh,
      '@stylistic': stylistic,
      'security-node': securityNode,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        project: './tsconfig.app.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      ...hooks.configs.recommended.rules,
      ...securityNode.configs.recommended.rules,

      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',

      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      'react/no-unescaped-entities': 'off',

      'no-console': ['error', { allow: ['error', 'info', 'warn'] }],
      eqeqeq: ['error', 'always'],
      curly: 'error',
      'prefer-const': 'error',
      'no-duplicate-imports': 'error',
      'no-await-in-loop': 'error',
      'array-callback-return': ['error', { allowImplicit: false }],
      'no-unreachable': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-var': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-unsafe-finally': 'error',
      'no-unsafe-negation': 'error',
      complexity: ['warn', 100],
      'max-depth': ['error', 5],
      'prefer-destructuring': ['error', { object: true, array: false }],
      'prefer-template': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: true }],
      '@typescript-eslint/no-duplicate-enum-values': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/prefer-includes': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/promise-function-async': 'error',

      '@stylistic/no-multi-spaces': 'error',
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/no-extra-semi': 'error',
      '@stylistic/type-annotation-spacing': ['error', { before: false, after: true }],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/max-len': ['error', { code: 200, ignoreUrls: true }],
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/comma-spacing': ['error', { before: false, after: true }],
      '@stylistic/key-spacing': ['error', { beforeColon: false, afterColon: true }],
    },
  },
];