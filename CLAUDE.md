# CLAUDE.md

@AGENTS.md

`AGENTS.md` is the canonical project guide. Follow it in full for every coding
session in this repository.

## Non-negotiables, restated

- **The product story is not settled.** Do not invent claims, feature names,
  metrics, or availability promises, and do not treat the current page copy as
  approved. Copy changes are product decisions — ask.
- **`PRODUCT.md` is working material, not a spec.** Do not build from it.
- **`app/globals.css` is the single source of truth for tokens.** `:root` and
  `.dark`, nothing else. `DESIGN.md` carries the rules and intent, never token
  values — its frontmatter is stale and must not be used.
- **Never hardcode a colour, radius, or font, and never invent a new token.**
  Use what is in `app/globals.css`. A raw hex or `oklch()` in a component is a
  bug; a new token is a decision — stop and ask.
- **Never add a second token set.** No page-scoped or component-scoped block
  that redefines tokens. It shadows `:root`/`.dark`, half-covers the theme, and
  cannot be published.
- **Light and dark are peers.** Every change ships working in both.
- **Monochrome first, accent rare.** Green is for action and focus, not theme.
- **Server Components by default.** `"use client"` only at a real interactivity
  boundary.
- **`pnpm deploy` publishes the live site** at `spaceman.sh`. Never run it
  unless explicitly asked. Bindings, routes, and compatibility flags in
  `wrangler.jsonc` are production infrastructure.
- **There are no tests, and `pnpm lint` is currently broken** (eslint 10 vs
  `eslint-config-next` plugins). `pnpm build` is the real signal — never report
  lint as passing. A visual change is not done until it has been rendered and
  looked at, in both themes, at mobile and desktop widths.
- **The repo publishes a shadcn registry** under `@spaceman` (see `AGENTS.md`
  §13). The site imports items from `registry/spaceman/...`, so anything you
  change there is a public artefact. Only rendered items get published.

## Fast orientation

- Next.js App Router (React 19, TS strict) + Tailwind v4 (CSS-first, no
  `tailwind.config`) + shadcn primitives, deployed to Cloudflare Workers via
  OpenNext.
- Tokens live in `app/globals.css` (`:root` / `.dark` / `@theme inline`); the
  scoped `.spaceman-*` layer holds site-only composition styling, which registry
  items must not depend on.
- The `dark` class is applied to `<html>` by
  `registry/spaceman/theme-toggle/theme-provider.tsx`.
- `components/ui/` = generic primitives (shadcn CLI); `components/*.tsx` =
  page-level compositions; `registry/spaceman/` = published items. `@/*` aliases
  the repo root.
- Fonts come from `next/font/google` in `app/layout.tsx` as CSS variables.
- Cheapest real signal is `pnpm build` (types + build); the true runtime check is
  `pnpm preview`.
- **pnpm only** — pinned in `packageManager`. Many deps are `"latest"`, which is
  a known reproducibility problem; don't add more.

```bash
pnpm dev
```
