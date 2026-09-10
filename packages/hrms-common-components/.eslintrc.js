module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    'react/prop-types': 'warn',
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    "max-lines-per-function": "off"
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
