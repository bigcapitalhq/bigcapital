module.exports = {
  env: {
    browser: false,
    es6: true,
    node: true,
    mocha: true,
  },
  extends: [
    'airbnb-base',
  ],
  plugins: [
    'import',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "no-unused-vars": [
      "error",
      {
        "varsIgnorePattern": "describe|afterEach|beforeEach"
      }
    ],
    "import/no-extraneous-dependencies": [
      "error", {"devDependencies": true}
    ],
  },
  settings: {
    'import/resolver': {
      node: {},
      webpack: {
        config: 'webpack.config.js'
      }
    },
  },
};
