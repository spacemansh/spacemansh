# CLAUDE.md

@AGENTS.md

`AGENTS.md` is the canonical project guide. Follow it in full for every coding
session in this repository.

## Non-negotiables, restated

- **The product story is not settled.** Do not invent claims, feature names,
  metrics, or availability promises, and do not treat the current page copy as
  approved. Copy changes are product decisions — ask.
- **`PRODUCT.md` is working material, not a spec.** Do not build from it.
- **`packages/ui/src/styles/tokens.css` is the single source of truth for
  tokens**, for this repo and for `spaceman-ui`. `:root` and `.dark`, nothing
  else. `DESIGN.md` carries the rules and intent, never token values.
- **Never hardcode a colour, radius, or font, and never invent a new token.**
  A raw hex or `oklch()` in a component is a bug; a new token is a decision —
  stop and ask.
- **Never add a second token set**, and keep `spaceman-ui/app/tokens.css`
  byte-identical to `tokens.css` here (`AGENTS.md` §13).
- **Light and dark are peers.** Every change ships working in both.
- **Monochrome first, accent rare.** Green is for action and focus, not theme.
- **Server Components by default.** `"use client"` only at a real interactivity
  boundary.
- **`pnpm deploy` publishes the live site** at `spaceman.sh`. Never run it
  unless explicitly asked. Bindings, routes, the `/r/*` redirect and
  compatibility flags in `apps/web` are production infrastructure.
- **There are no tests.** `pnpm quality` (oxlint + oxfmt), `pnpm typecheck` and
  `pnpm build` are the signals — run all three. A visual change is not done
  until it has been rendered and looked at, in both themes, at mobile and
  desktop widths.

## Fast orientation

- pnpm + Turborepo monorepo from `shadcn init --monorepo`: `apps/web`
  (spaceman.sh, Cloudflare Workers via OpenNext) and `packages/ui`
  (`@workspace/ui`: tokens, Tailwind entry, shadcn primitives, `cn`).
- The `@spaceman` registry and ui.spaceman.sh live in the `spaceman-ui` repo.
- The `dark` class is applied to `<html>` by
  `apps/web/components/theme-provider.tsx` (next-themes).
- Run the shadcn CLI from `apps/web`; primitives land in `packages/ui`.
- Fonts come from `next/font/google` in `apps/web/app/layout.tsx` as CSS
  variables.
- Cheapest real signal is `pnpm build`; the true runtime check is
  `pnpm preview`.
- **pnpm only** — pinned in `packageManager`. Dependencies are pinned exactly.

```bash
pnpm dev
```
