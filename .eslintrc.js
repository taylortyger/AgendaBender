module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'prefer-destructuring': 'off',
  },
  overrides: [
    {
      files: ['*.test.js'],
      rules: {
        'no-plusplus': 'off',
        'no-unused-expressions': 'off',
        'no-unused-vars': 'off',
        'no-undef': 'off',
      }
    }
  ],
};
