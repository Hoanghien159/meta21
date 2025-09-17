import { globalIgnores } from 'eslint/config';
import pluginVue from 'eslint-plugin-vue';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),
  pluginVue.configs['flat/essential'],
  skipFormatting,
];
