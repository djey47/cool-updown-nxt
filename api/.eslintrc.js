/* eslint-env node */
module.exports = {
	env: {
		node: true,
	},
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'script',
  },
	rules: {
    '@typescript-eslint/object-curly-spacing': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: '_' }],
    'semi': 'warn',
	},
};
