module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
    extraFileExtensions: ['.svelte', '.json'],
  },
  ignorePatterns: ['package.json', 'package-lock.json', 'webpack.config.*'],
  plugins: [
    'svelte3',
    '@typescript-eslint',
  ],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
      rules: {
        'import/no-mutable-exports': ['off'],
        'import/prefer-default-export': ['off'],
      },
    },
  ],
  rules: {
  },
  settings: {
    'svelte3/typescript': true,
  },
};
