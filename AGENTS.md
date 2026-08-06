# Spaceman repository guide

Behavioural and project-specific guidelines for coding agents working in
`spacemansh` — the spaceman.sh website and registry.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks,
use judgment.

## 1. Think before coding

**Ask; do not assume. Do not hide confusion. Surface tradeoffs.**

Before implementing:

- State material assumptions explicitly.
- If intent, architecture, requirements, or scope is unclear, ask before writing
  code.
- If multiple reasonable interpretations exist, present them instead of choosing
  silently.
- When running unattended, use the safest reasonable interpretation, proceed only
  when the choice is reversible and within scope, and record the assumption.
- If a simpler approach exists, say so.
- Push back when the requested implementation creates avoidable accessibility,
  performance, brand, or maintenance risk.
- Flag uncertainty explicitly. Confidence without evidence is not certainty.
- When useful, run a small, localized, low-risk experiment and report the
  hypothesis and result before committing to a larger direction.
- Suggest durable improvements when they materially outperform a tactical change,
  but do not implement the expanded scope without authorization.

This site is pre-launch and still moving. Asking costs a message; guessing costs
a rebuild.

## 2. Simplicity first

**Use the minimum design that fully solves the problem.**

- Do not add features, sections, or pages beyond the request.
- Do not create abstractions for a single use.
- Do not add speculative flexibility, configuration, or a component library layer
  the site does not yet need.
- Do not add handling for impossible states.
- Do not reach for a dependency when a few lines of CSS or a plain component will
  do. This is a static marketing site — the dependency list should stay boring.
- If an implementation is substantially larger than the problem requires,
  simplify it.

Ask: "Would a senior engineer consider this unnecessarily complicated?" If yes,
revise it.

## 3. Surgical changes

**Touch only what the task requires. Clean up only what your changes make
obsolete.**

- Do not reformat or refactor unrelated areas.
- Match existing repository style and patterns (see §9).
- Preserve user work and unrelated uncommitted changes.
- Remove imports, variables, and files made unused by your own changes.
- Do not remove pre-existing unused code (for example an unreferenced component)
  unless asked — surface it instead.
- Surface unrelated bugs, unsafe patterns, and design smells to the user as
  separate follow-up work.

Every changed line should trace to the requested outcome or a necessary
supporting invariant.

## 4. Goal-driven execution

**Define success, implement, verify, and loop until the evidence matches the
goal.**

Translate requests into verifiable outcomes:

- "Fix the layout" means look at the rendered page at the relevant breakpoints,
  not just at the diff.
- "Add a section" means it renders correctly in **both light and dark mode**, at
  mobile and desktop widths, with visible focus states.
- "Change a token" means every surface using it still meets contrast.
- "Refactor" means the rendered output is unchanged — verify before and after.
- "Deploy" means the Worker build succeeds, not only `next build`.

For multi-step work, state a short plan:

```text
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Do not call visual work complete from static review. Render it and look.

## 5. Product story is not settled

The positioning, naming of offerings, and page copy are **still being decided**.
Treat everything currently on the page as provisional.

- Do not invent product claims, feature names, pricing, metrics, customer counts,
  compliance statements, or availability promises. If copy is needed and none was
  supplied, ask.
- Do not treat the current hero and product-box copy as approved. It is
  placeholder pending the product decision.
- `PRODUCT.md` is working material for that decision, not a specification to
  implement against. Do not extract implied features from it and build them.
- Changing copy is a product decision, not a styling one. Restructure layout
  freely when asked; do not quietly rewrite words while doing it.
- `DESIGN.md` is the settled part. When design and copy pull in different
  directions, follow `DESIGN.md` and raise the copy question.

## 6. Design system

`app/globals.css` is the **single source of truth for token values**. They live
in `:root` (light) and `.dark` (dark), and are exposed to Tailwind through
`@theme inline`. `DESIGN.md` carries the named rules and the intent behind the
system; its frontmatter is **not** a token source and must not be treated as
one.

Two rules bind every change to the system itself:

- **One token set.** `:root` and `.dark` are the only places tokens are
  defined. Do not introduce a page-scoped or component-scoped block that
  redefines them. A second set silently shadows the first, leaves the tokens it
  does not override falling through to the wrong theme, and cannot be
  distributed through the registry.
- **Do not invent tokens or colours.** Use what exists. If a change appears to
  need a token that is not there, that is a design-system question — stop and
  ask. Adding one is a decision, not an implementation detail.

The theme is applied as the `dark` class on `<html>` by
`registry/spaceman/theme-toggle/theme-provider.tsx`, which is what
`@custom-variant dark (&:is(.dark *))` matches.

Rules that bind every visual change:

- **The Monochrome First Rule.** A screen must work in black, white, and neutral
  grey before any accent colour is added.
- **The Rare Accent Rule.** Signal Green is for action, focus, selection, and
  small moments of confirmation. If more than ~10% of a viewport is green, the
  page is off-brand.
- **The No Costume Rule.** Monospace only where the content is genuinely code,
  CLI output, package names, or technical metadata — never as decoration to
  signal "developer".
- **The Flat Unless Active Rule.** Resting UI is flat or nearly flat. Depth
  appears only to clarify focus, interactivity, or a foreground control.
- **Light and dark are peers.** Dark mode may be the more atmospheric
  presentation, but light mode must look deliberate, never an afterthought.
- Visible focus states and WCAG AA contrast are non-negotiable, especially
  muted-foreground text on dark surfaces.
- Explicitly out of bounds: AI cliché, corporate-SaaS identity, crypto or gaming
  styling, angle brackets, terminal-window marks, hexagons, rocket icons, AI
  sparkles, gradients as identity, and mascots.

**Never hardcode a colour, radius, or font.** Use the token
(`bg-background`, `text-muted-foreground`, `border-border`, `ring-ring`,
`font-sans`, `font-mono`, `rounded-md`). A raw hex or `oklch()` in a component is
a bug. If a value you need has no token, that is a design-system question — raise
it rather than inlining the value.

Adding or changing a token means updating **both** `:root` and `.dark`, plus the
`@theme inline` mapping, plus `DESIGN.md` if the change is a system decision
rather than a fix. Because the tokens are published as `@spaceman/theme`, a
token change is a change to a public artefact — rebuild the registry after one.

## 7. Architecture

Next.js App Router (React 19, TypeScript strict) deployed to Cloudflare Workers
via OpenNext.

```text
app/
  layout.tsx        root layout, next/font wiring, theme provider, metadata
  page.tsx          the landing page
  globals.css       Tailwind v4 entry, design tokens, .spaceman-* page layer
components/
  ui/               shadcn primitives (Radix + CVA + tailwind-merge)
  *.tsx             page-level compositions
registry/spaceman/  published registry sources — see §13
registry.json       registry catalogue
public/r/*.json     built registry output, served at spaceman.sh/r/
lib/utils.ts        cn() — clsx + tailwind-merge
public/figma-assets/  design-sourced SVGs
DESIGN.md           design-system rules and intent (not token values)
PRODUCT.md          in-progress positioning material
spaceman-changes.md implementation notes for the current landing-page work
```

Boundary rules:

- **Server Components are the default.** Add `"use client"` only at a real
  interactivity boundary, and push it as far down the tree as possible. The
  current page is fully server-rendered — keep it that way unless a change
  genuinely requires client state.
- `components/ui/` holds generic, reusable primitives added via the shadcn CLI.
  Prefer regenerating or extending a primitive over hand-writing a one-off
  button or input. Anything that knows about spaceman.sh page content is a
  page-level component in `components/`, not `ui/`.
- Composition-specific styling lives in the scoped `.spaceman-*` layer in
  `globals.css`; keep that convention rather than starting a second CSS approach.
- Fonts are loaded through `next/font/google` in `app/layout.tsx` and consumed as
  CSS variables. Do not add a `<link>` to a font CDN or import a font in CSS.
- Images go through `next/image`; SVG assets live in `public/figma-assets/`.
  Decorative images take `alt=""` and decorative wrappers take `aria-hidden`.
- The `@/*` alias maps to the repo root. Use it; avoid deep relative chains.
- `lib/utils.ts` is for genuinely shared helpers. It is not a dumping ground.

## 8. Cloudflare deployment

The site builds to a Worker: `next build` → `opennextjs-cloudflare build` →
`.open-next/worker.js`, configured by `open-next.config.ts` and `wrangler.jsonc`.

- `wrangler.jsonc` binds assets, a self-reference service (required by OpenNext
  caching — the `service` name must stay equal to the worker name), and the
  images binding. Do not rename the worker without updating the self-reference.
- The custom domain route is `spaceman.sh`. Treat routes, bindings, and
  compatibility flags as production infrastructure: changing them is a
  confirm-first action, not a side effect of a feature.
- `nodejs_compat` and `global_fetch_strictly_public` are set deliberately. Do not
  remove them.
- Code must run on the Workers runtime. Node built-ins beyond what
  `nodejs_compat` provides, filesystem access, and long-lived in-process state
  are not available. Verify anything runtime-sensitive with
  `pnpm preview`, not `pnpm dev`.
- **`pnpm deploy` publishes the live site.** Never run it unless explicitly
  asked.
- Never commit secrets. `.env*` is gitignored; anything the Worker needs at
  runtime belongs in Wrangler secrets, not in the repo or in a `NEXT_PUBLIC_`
  variable (those ship to the browser).

## 9. Style and tooling

- **pnpm is the package manager**, pinned via `packageManager` in
  `package.json`. `pnpm-lock.yaml` is the only lockfile; do not reintroduce
  `package-lock.json` or run `npm install`.
- Many dependencies are pinned to `"latest"`, which makes installs
  irreproducible and has already broken `pnpm lint` (see §11). Raise this before
  adding more; do not add a new dependency as `"latest"`.
- Prettier defaults are in effect in the committed code: double quotes,
  semicolons, trailing commas. Match it; do not hand-format against it.
- ESLint is flat config with `next/core-web-vitals` + `next/typescript`. Fix
  warnings rather than disabling rules; if a disable is genuinely right, comment
  why.
- TypeScript is `strict`. Do not add `any` or non-null assertions to get past a
  type error — model the type correctly.
- Tailwind v4 (CSS-first, no `tailwind.config`). Configure through `globals.css`.
- Compose class variants with CVA and merge with `cn()`. Do not concatenate
  class strings by hand.
- Prefer semantic elements and correct landmarks (`header`, `nav`, `main`,
  `section` with a heading). Every interactive element needs an accessible name
  and a visible focus style.
- Animation uses `motion`; keep it restrained per the design system and respect
  `prefers-reduced-motion`.
- Conventional Commits, as used in the existing history (`feat:`, `fix:`,
  `chore:`). Default branch is `main`.

## 10. Source-of-truth order

When requirements conflict, use:

1. The current user's explicit request.
2. This repository guide.
3. `app/globals.css` for token values — it is the system of record.
4. `DESIGN.md` for visual *rules* and intent, never for token values.
5. Existing implementation in `app/`, `components/`, and `registry/`.
6. `spaceman-changes.md` for why the current landing page is shaped as it is.

`PRODUCT.md` is explicitly **not** in this order — it is unsettled working
material (§5).

Do not silently resolve a meaningful conflict. State it and ask.

## 11. Verification

There is no test suite. Verification is the build, the linter, and your own eyes.

```bash
pnpm dev             # local dev server
pnpm lint            # eslint — CURRENTLY BROKEN, see below
pnpm build           # next build — catches type and build errors
pnpm registry:build  # regenerate public/r/*.json from registry.json
pnpm preview         # opennext build + local Worker preview (the real runtime)
pnpm deploy          # PUBLISHES — only when explicitly asked
```

`pnpm lint` currently fails before linting anything: `eslint` resolves to 10.x
while `eslint-config-next` bundles plugins supporting ≤9, and the flat config
has no `ignores`, so it also tries to lint `.open-next` output. This is a
pre-existing defect, not something your change caused. Until it is fixed,
`pnpm build` is the type and correctness signal — do not report lint as passing.

Because there are no tests, visual verification is not optional:

- Any visual change ⇒ render it and look, in **both themes**, at mobile and
  desktop widths.
- Check focus-visible states by tabbing through, and check muted text contrast on
  dark surfaces.
- Anything touching the build, bindings, or runtime behaviour ⇒ `pnpm preview`,
  not just `pnpm build`.
- Do not report a visual change as done on the strength of the diff alone.

Report what was run, what passed, and what could not be verified.

## 12. Git and documentation discipline

- Use Conventional Commits.
- Keep commits focused and subject-only unless a body is genuinely needed.
- Do not add agent attribution, co-author footers, or generated-by messages.
- Never rewrite or discard user changes without explicit permission.
- Do not commit `.next`, `.open-next`, `.wrangler`, env files, screenshots, or
  build output.
- Update `DESIGN.md` when a change alters a design-system decision, and this
  guide when a change alters the build, deployment, or developer workflow.

## 13. The registry

spaceman.sh publishes a shadcn registry under the `@spaceman` namespace, served
as static JSON from the same Worker at `https://spaceman.sh/r/{name}.json`.

```text
registry.json                    the catalogue — hand-written, one entry per item
registry/spaceman/<item>/*.tsx   item sources
public/r/*.json                  built output, committed
```

`pnpm registry:build` runs `shadcn build`, which flattens `registry.json` into
`public/r/`. It is chained into `pnpm build`, so a normal build keeps the output
current. The generated files **are committed** so the published artefacts are
reviewable in the repo.

Rules for registry items:

- **The site consumes what it publishes.** `app/` imports items from
  `registry/spaceman/...` directly. There is no second copy, so the published
  file and the rendered file cannot drift. Keep it that way.
- **Only publish what has been rendered.** An item that has never been displayed
  in both themes does not go in `registry.json`. This is why
  `components/ui/button.tsx` and `input.tsx` are not published yet.
- **Items must be self-contained.** Styling travels with the component in
  Tailwind classes. Do not rely on the `.spaceman-*` layer in `globals.css` — a
  consumer does not get that file, and the item will install unstyled.
- List every npm package in `dependencies` and every other item in
  `registryDependencies`. A missing entry installs a broken component.
- Item `name` is a public API. Renaming one breaks everybody who installed it.

After changing an item or a token, run `pnpm registry:build` and verify with
`pnpm dlx shadcn@latest view @spaceman/<name>` against the running dev server.

These guidelines are working when diffs stay focused, uncertainty is surfaced
early, the design system holds in both themes, and visual work is backed by
having actually looked at it.
