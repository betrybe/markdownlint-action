module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'import/no-unresolved': 'off',
    'no-cond-assign': 'off',
    'no-unused-vars': ['error', { varsIgnorePattern: '^_' }],
    'no-console': 'off',
  },
};
