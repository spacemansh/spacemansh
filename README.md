# spacemansh

The [spaceman.sh](https://spaceman.sh) website and the shared Spaceman design
system. The `@spaceman` shadcn registry lives in
[spaceman-ui](https://github.com/spacemansh/spaceman-ui) at
[ui.spaceman.sh](https://ui.spaceman.sh).

## Layout

```text
apps/web          spaceman.sh (Next.js, Cloudflare Workers via OpenNext)
packages/ui       @workspace/ui: design tokens, Tailwind entry, shadcn primitives
packages/typescript-config  shared tsconfig presets
```

Design tokens live in the `spaceman:tokens` region of
`packages/ui/src/styles/globals.css`; shared base rules are in `base.css` beside
it. spaceman-ui keeps both byte-identical and checks them with
`pnpm tokens:check`. The rules behind the tokens are in [DESIGN.md](DESIGN.md).
Plans for anything Spaceman live in `../.plan/`, outside this repository.

## Development

```bash
pnpm install --frozen-lockfile
pnpm dev
```

| Command          | Purpose                                                     |
| ---------------- | ----------------------------------------------------------- |
| `pnpm quality`   | Lint (oxlint) and formatting (oxfmt) checks                 |
| `pnpm typecheck` | TypeScript in every workspace                               |
| `pnpm build`     | Production build of every app                               |
| `pnpm preview`   | Build `apps/web` and run it in the local Workers runtime    |
| `pnpm deploy`    | Publish spaceman.sh; run only when deployment is authorized |

Add shadcn components from `apps/web`:

```bash
cd apps/web
pnpm dlx shadcn@latest add button
```

`spaceman.sh/r/*` redirects permanently to `ui.spaceman.sh/r/*`, so registry
installs made before the move keep working.

## License

[MIT](LICENSE)
