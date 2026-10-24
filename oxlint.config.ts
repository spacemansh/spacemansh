import { antiSlopConfig } from 'antislop-plugin/config'
import { defineConfig } from 'oxlint'

export default defineConfig({
  ignorePatterns: [
    '**/node_modules/**',
    '**/dist/**',
    '**/.next/**',
    '**/.open-next/**',
    '**/.wrangler/**',
    '**/.turbo/**',
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
  jsPlugins: [...antiSlopConfig.jsPlugins, '@shadcn/lint'],
  settings: {
    shadcn: {
      ui: '@workspace/ui/components',
      note: 'Use a theme value from the spaceman:tokens region of packages/ui/src/styles/globals.css; a missing value is a token decision (DESIGN.md §2).',
    },
  },
  rules: {
    ...antiSlopConfig.rules,

    // tailwind classes: @shadcn/lint owns these checks
    'shadcn/no-arbitrary-values': 'error',
    'shadcn/no-raw-colors': 'error',
    'shadcn/no-unknown-classes': 'error',

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
  overrides: [
    {
      // shadcn primitives own their styling; the rules check their callers
      files: ['packages/ui/src/components/**'],
      rules: {
        'shadcn/no-arbitrary-values': 'off',
        'shadcn/no-raw-colors': 'off',
      },
    },
  ],
})
