# CLAUDE.md

@AGENTS.md

`AGENTS.md` is the canonical project guide. Follow it in full for every coding
session in this repository.

## Non-negotiables, restated

- **The product story is not settled.** Do not invent claims, feature names,
  metrics, or availability promises, and do not treat the current page copy as
  approved. Copy changes are product decisions — ask.
- **`PRODUCT.md` is working material, not a spec.** Do not build from it.
- **`DESIGN.md` is authoritative for anything visual.** Read it before styling.
- **Never hardcode a colour, radius, or font.** Use the tokens in
  `app/globals.css`. A raw hex or `oklch()` in a component is a bug.
- **Light and dark are peers.** Every change ships working in both.
- **Monochrome first, accent rare.** Green is for action and focus, not theme.
- **Server Components by default.** `"use client"` only at a real interactivity
  boundary.
- **`pnpm deploy` publishes the live site** at `spaceman.sh`. Never run it
  unless explicitly asked. Bindings, routes, and compatibility flags in
  `wrangler.jsonc` are production infrastructure.
- **There are no tests.** A visual change is not done until it has been rendered
  and looked at, in both themes, at mobile and desktop widths.

## Fast orientation

- Next.js App Router (React 19, TS strict) + Tailwind v4 (CSS-first, no
  `tailwind.config`) + shadcn primitives, deployed to Cloudflare Workers via
  OpenNext.
- Tokens live in `app/globals.css` (`:root` / `.dark` / `@theme inline`); the
  scoped `.spaceman-*` layer holds composition styling.
- `components/ui/` = generic primitives (shadcn CLI); `components/*.tsx` =
  page-level compositions. `@/*` aliases the repo root.
- Fonts come from `next/font/google` in `app/layout.tsx` as CSS variables.
- Cheapest real signal is `pnpm build` (types + build); the true runtime check is
  `pnpm preview`.
- The repo carries **both** `package-lock.json` and `pnpm-lock.yaml` — resolve
  that with the user before changing dependencies.

```bash
pnpm dev
```
