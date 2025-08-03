import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist', 'prisma/generated/client', 'src/examples'] },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  prettierConfig,
);
