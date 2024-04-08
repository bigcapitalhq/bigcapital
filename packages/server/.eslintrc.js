module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['airbnb-base', 'airbnb-typescript', 'plugin:react/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: 'tsconfig.json',
    tsconfigRootDir: './',
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  plugins: ['import'],
  rules: {
    'import/no-unresolved': 'error',
    'import/prefer-default-export': 'off',
    'no-underscore-dangle': [
      'error',
      { allow: ['__root_dir', '__resources_dir', '__locales_dir', '__views_dir', '__storage_dir'] },
    ],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: 'tsconfig.json',
      },
    },
  },
};
