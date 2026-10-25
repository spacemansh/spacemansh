# spacemansh

**Read [AGENTS.md](AGENTS.md) first.** It holds the rules for coding, testing,
human communication, and commits. This file describes the project.
[DESIGN.md](DESIGN.md) holds the design-system rules and intent.

spacemansh is the spaceman.sh website, the parent page of the Spaceman product
family, and the system of record for the Spaceman design tokens. The
`@spaceman` shadcn registry and ui.spaceman.sh live in the sibling
`spaceman-ui` repository; it consumes the tokens defined here.

## Plans

Plans for anything Spaceman — every repository, product and site — live in
`/Users/tony/Developer/Spaceman/.plan/` (`../.plan/` from this repository). It is
outside every git repository on purpose, so a plan never lands in a project's
history. Read `.plan/README.md` before writing one. Never create `plan/` or a
similar folder inside this repository.

## Stack

- pnpm workspaces and Turborepo, from `shadcn init --monorepo`. Use the pnpm
  version in the root `packageManager` field. Dependencies are pinned exactly;
  `oxlint` and `@oxlint/plugins` move together.
- Next.js App Router, React 19, TypeScript strict, Tailwind CSS v4 (CSS-first,
  no `tailwind.config`), shadcn primitives on Base UI.
- oxlint (with `antislop-plugin`) and oxfmt: single quotes, no semicolons,
  sorted imports and Tailwind classes. Run `pnpm format:fix`; do not hand-format.
- Cloudflare Workers through OpenNext (`apps/web/open-next.config.ts`,
  `apps/web/wrangler.jsonc`).

## Project structure

```text
apps/web/                      spaceman.sh
  app/layout.tsx               fonts (next/font), theme provider, metadata
  app/page.tsx                 the home page
  app/lab/logo/                the logo token controls page (noindex, not in the sitemap)
  app/llms.txt/, robots.ts, sitemap.ts, opengraph-image.tsx   static metadata routes
  components/                  page-level compositions, each with any CSS it needs beside it
  lib/site.ts                  the product list and links every surface reads
  next.config.ts               includes the permanent /r/* → ui.spaceman.sh redirect
  wrangler.jsonc               Cloudflare Worker config
packages/ui/                   @workspace/ui, the shared design system
  src/styles/globals.css       Tailwind entry and the design tokens (spaceman:tokens)
  src/styles/base.css          shared base rules, imported by globals.css
  src/components/              shadcn primitives (add with the shadcn CLI)
  src/lib/utils.ts             cn()
packages/typescript-config/    shared tsconfig presets
DESIGN.md                      design-system rules and intent, shared with spaceman-ui
PRODUCT.md                     in-progress positioning material, not a spec
```

## Common commands

Run these from the repository root:

```bash
pnpm install --frozen-lockfile
pnpm dev            # turbo dev
pnpm lint           # oxlint with antislop and @shadcn/lint; fix every error
pnpm quality        # oxlint, then oxfmt --check (quality:fix fixes both)
pnpm typecheck      # tsc in every workspace
pnpm build          # next build in every app
pnpm preview        # OpenNext build and a local Worker: the real runtime
pnpm deploy         # PUBLISHES spaceman.sh — only when explicitly asked
```

The dev server normally uses port 3000; check for one before starting another.
Run the shadcn CLI from `apps/web`; `components.json` routes primitives into
`packages/ui`.

## Product story

The positioning, naming and page copy are **still being decided**. Treat what
is on the page as provisional.

- Do not invent product claims, feature names, pricing, metrics, customer
  counts, compliance statements, or availability promises. Ask for copy.
- Changing copy is a product decision, not a styling one. Restructure layout
  freely when asked; do not quietly rewrite words while doing it.
- `PRODUCT.md` is working material, not a specification. Do not build from it.
- The product descriptions in `lib/site.ts` feed the cards, the Explore tour,
  the structured data and `llms.txt`. Keep them factual and in step with each
  product's own site.

## Design system contracts

- **Tokens live in `globals.css`**, inside the `spaceman:tokens` region:
  `@custom-variant dark`, `:root` (light), `.dark`, the `.theme-<name>`
  palettes, and `@theme inline`. That is the file `components.json` names, and
  the shadcn CLI, uitheme and Spaceman RTA read and write theme variables there.
  Every other rule goes in an imported file (`base.css`, or a component's own
  CSS file).
- **One token set, and keep every token.** Nothing outside the region defines
  or overrides a token. Unused token groups stay for future products.
- **Never hardcode a colour, radius, or font, and never invent a token.** A raw
  hex or `oklch()` in a component is a bug; a new token is a decision — stop and
  ask. Adding one means `:root`, `.dark`, `@theme inline`, `DESIGN.md`, and the
  copy in spaceman-ui.
- **Tailwind first, no arbitrary values.** Style with Tailwind classes from the
  theme. `@shadcn/lint` (in `oxlint.config.ts`) fails `no-arbitrary-values`,
  `no-raw-colors` and `no-unknown-classes`; it owns Tailwind checks where it
  overlaps oxlint. A missing value becomes a named token in the region, never a
  `[...]` value. There is no site-wide stylesheet: CSS that classes cannot
  express (keyframes, phase selectors, engine-driven geometry) sits next to its
  component as `<component>.css` and targets `data-*` attributes, not class
  names. The rules are off for `packages/ui/src/components`, whose shadcn
  primitives own their styling.
- **Shared across repositories.** spaceman-ui keeps the token region of its
  `app/globals.css` and its `app/base.css` byte-identical to this repository's;
  its `pnpm tokens:check` fails on drift. Change them here first, copy them
  across, run the check there, and ship both changes together.
- Theming runs on `uitheme-web` (`NextUIThemeProvider` in
  `apps/web/components/providers.tsx`). It puts `dark` and `theme-<name>` on
  `<html>`, which `@custom-variant dark (&:is(.dark *))` and the palettes match,
  and animates changes with a circle reveal. Its duration lives in
  `lib/theme.ts`, which the theme toggle's scramble also reads; the hook does
  not expose it. The same provider tree holds the TanStack Query client.
- Light and dark are peers. Monochrome first; the accent is rare. The named
  rules are in `DESIGN.md`.

## Interaction contracts

- **Server Components by default.** `"use client"` only at a real interactivity
  boundary, pushed down the tree. Client islands talk through small DOM events
  (`lib/replay-cards.ts`) rather than lifting the server-rendered hero into a
  client parent.
- **No `useEffect`.** Listeners and loops attach through React 19 ref callbacks
  that return their cleanup; state changes run in event handlers. Use the
  `no-use-effect` skill before adding an effect.
- **Every motion has a reduced-motion twin** that keeps the state change and
  drops the movement. Hover is gated to `(hover: hover) and (pointer: fine)`.
- **Motion is interruptible.** Use transitions and springs that retarget from the
  current state; keyframes only for one-shot effects nobody can retrigger.
- The card engine (`components/bounce-cards.tsx`) owns the fan, the marquee
  (where the fan cannot fit) and the card carousel; the Explore tour
  (`components/product-tour.tsx`) owns the framed page transition. Their timings
  are documented in `DESIGN.md` §6.

## Cloudflare deployment

`apps/web` builds to a Worker: `next build` → `opennextjs-cloudflare build` →
`.open-next/worker.js`.

- `wrangler.jsonc` binds assets, a self-reference service (its `service` name
  must equal the worker name) and the images binding. The custom domain route
  is `spaceman.sh`.
- `next.config.ts` redirects `/r/*` permanently to `https://ui.spaceman.sh/r/*`
  so existing registry installs keep resolving. Never remove it.
- `nodejs_compat` and `global_fetch_strictly_public` are deliberate. Routes,
  bindings and compatibility flags are production infrastructure: changing them
  is a confirm-first action.
- Code must run on the Workers runtime. Verify anything runtime-sensitive with
  `pnpm preview`, not `pnpm dev`.
- Never commit secrets. Anything the Worker needs at runtime belongs in Wrangler
  secrets, not in the repository or a `NEXT_PUBLIC_` variable.

`.github/workflows/deploy.yml` deploys web changes on pushes to `main`.
It requires the `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` Actions secrets.
Cloudflare branch previews remain enabled. Its production deploy command is a
no-op so GitHub Actions is the only production publisher.

## Verification

There is no test suite. `pnpm quality`, `pnpm typecheck` and `pnpm build` are all
required signals: run them and report each result. oxlint does not type-check.

- Any visual change: render it and look, in both themes, at phone and desktop
  widths. Tab through it and check focus states and muted-text contrast on dark
  surfaces.
- Any motion change: record it frame by frame (a per-frame log of the animated
  values, or a screenshot sequence), open and close, interrupted, and under
  reduced motion.
- A token change: also run `pnpm tokens:check` in spaceman-ui.
- Build, binding or runtime changes: `pnpm preview`.

Report what was run, what passed, and what could not be verified.

## Source-of-truth order

1. The current user's explicit request.
2. `AGENTS.md` and this file.
3. The `spaceman:tokens` region of `packages/ui/src/styles/globals.css` for
   token values.
4. `DESIGN.md` for visual rules and intent, never for token values.
5. Existing implementation in `apps/` and `packages/`.

`PRODUCT.md` is not in this order. Do not silently resolve a meaningful
conflict: state it and ask.

## Git

- Conventional Commits as in the history (`feat(web):`, `fix:`, `docs:`,
  `chore:`), through the `/auto-commit` workflow in `AGENTS.md`. No agent
  attribution, co-author footers, or generated-by lines.
- Default branch is `main`. Do not commit `.next`, `.open-next`, `.wrangler`,
  env files, screenshots, or build output.
- Update `DESIGN.md` when a change alters a design-system decision, and this file
  when it alters the build, deployment or developer workflow.
