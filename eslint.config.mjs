import withNuxt from './.nuxt/eslint.config.mjs';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const customRules = {
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
};

export default withNuxt(eslintPluginPrettierRecommended, customRules);
