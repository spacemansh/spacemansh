import { antiSlopConfig } from 'antislop-plugin/config'
import { defineConfig } from 'oxlint'

export default defineConfig({
  ignorePatterns: [
    '**/node_modules/**',
    '**/dist/**',
    '**/.next/**',
    '**/.open-next/**',
    '**/.wrangler/**',
    '**/coverage/**',
    'next-env.d.ts',
  ],
  plugins: [
    'eslint',
    'typescript',
    'unicorn',
    'oxc',
    'import',
    'react',
    'react-perf',
    'nextjs',
    'jsx-a11y',
  ],
  jsPlugins: antiSlopConfig.jsPlugins,
  rules: {
    ...antiSlopConfig.rules,

    'nextjs/no-html-link-for-pages': 'error',
    'nextjs/no-sync-scripts': 'error',
    'react/rules-of-hooks': 'error',
    'react/display-name': 'error',
    'react/jsx-no-comment-textnodes': 'error',
    'react/no-unescaped-entities': 'error',
    'import/no-anonymous-default-export': 'warn',

    'typescript/ban-ts-comment': 'error',
    'no-array-constructor': 'error',
    'typescript/no-empty-object-type': 'error',
    'typescript/no-explicit-any': 'error',
    'typescript/no-namespace': 'error',
    'typescript/no-require-imports': 'error',
    'typescript/no-unnecessary-type-constraint': 'error',
    'typescript/no-unsafe-function-type': 'error',
  },
})
