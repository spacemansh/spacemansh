# Spaceman repository guide

Behavioural and project-specific guidelines for coding agents working in
`spacemansh` — the spaceman.sh website and the shared Spaceman design system.
The `@spaceman` registry lives in the separate `spaceman-ui` repo.

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

`packages/ui/src/styles/tokens.css` is the **single source of truth for token
values** for every Spaceman site. They live in `:root` (light) and `.dark`
(dark), and are exposed to Tailwind through `@theme inline`. `spaceman-ui` keeps
a byte-identical copy (`app/tokens.css`) and fails `pnpm tokens:check` if it
drifts, so change tokens here first and then copy the file across. `DESIGN.md` carries the named rules and the intent behind the
system; its frontmatter is **not** a token source and must not be treated as
one.

Two rules bind every change to the system itself:

- **One token set.** `:root` and `.dark` are the only places tokens are
  defined. Do not introduce a page-scoped or component-scoped block that
  redefines them. A second set silently shadows the first, leaves the tokens it
  does not override falling through to the wrong theme, and breaks parity with
  `spaceman-ui`.
- **Do not invent tokens or colours.** Use what exists. If a change appears to
  need a token that is not there, that is a design-system question — stop and
  ask. Adding one is a decision, not an implementation detail.

The theme is applied as the `dark` class on `<html>` by
`apps/web/components/theme-provider.tsx` (next-themes), which is what
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
rather than a fix, plus the copy in `spaceman-ui`. The tokens are never shipped to
registry consumers.

## 7. Architecture

A pnpm + Turborepo monorepo scaffolded by `shadcn init --monorepo`: Next.js App
Router (React 19, TypeScript strict) apps and a shared shadcn UI package.

```text
apps/web/                 spaceman.sh — the product family page
  app/                    routes, layout (next/font wiring, theme provider, metadata)
  components/             page-level compositions
  next.config.ts          includes the permanent /r/* → ui.spaceman.sh redirect
  wrangler.jsonc          Cloudflare Worker config for spaceman.sh
packages/ui/              @workspace/ui — the shared design system
  src/styles/tokens.css   design tokens: the system of record (§6)
  src/styles/globals.css  Tailwind entry: imports tokens, declares @source paths
  src/components/         shadcn primitives (add with the shadcn CLI)
  src/lib/utils.ts        cn() — clsx + tailwind-merge
packages/typescript-config/  shared tsconfig presets
DESIGN.md                 design-system rules and intent (not token values)
PRODUCT.md                in-progress positioning material
plan/                     dated briefs for explorations run in their own session
```

Boundary rules:

- **Server Components are the default.** Add `"use client"` only at a real
  interactivity boundary, and push it as far down the tree as possible.
- `packages/ui/src/components/` holds generic primitives added via the shadcn
  CLI (run it from `apps/web`; `components.json` routes primitives into the
  package). Anything that knows about spaceman.sh page content lives in
  `apps/web/components/`.
- Registry items from `@spaceman` (ui.spaceman.sh) install into `apps/web`
  with the shadcn CLI. Do not copy registry sources in by hand.
- Fonts are loaded through `next/font/google` in `apps/web/app/layout.tsx` and
  consumed as CSS variables. Do not add a `<link>` to a font CDN.
- The `@/*` alias maps to the app root; shared code is imported as
  `@workspace/ui/...`.

## 8. Cloudflare deployment

`apps/web` builds to a Worker: `next build` → `opennextjs-cloudflare build` →
`.open-next/worker.js`, configured by `apps/web/open-next.config.ts` and
`apps/web/wrangler.jsonc`.

- `wrangler.jsonc` binds assets, a self-reference service (required by OpenNext
  caching — the `service` name must stay equal to the worker name), and the
  images binding. Do not rename the worker without updating the self-reference.
- The custom domain route is `spaceman.sh`. The registry used to be served from
  this Worker at `/r/`; `next.config.ts` now redirects `/r/*` permanently to
  `https://ui.spaceman.sh/r/*` so existing installs keep resolving. Never
  remove that redirect. Treat routes, bindings, and
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
  irreproducible. Raise this before adding more; do not add a new dependency as
  `"latest"`. The Ox toolchain is pinned exactly, and `oxlint` and
  `@oxlint/plugins` must move together.
- Formatting is **oxfmt** (`.oxfmtrc.json`): single quotes, no semicolons,
  trailing commas, sorted imports and sorted Tailwind classes. Run
  `pnpm format:fix`; do not hand-format against it.
- Linting is **oxlint** (`oxlint.config.ts`) with the eslint, typescript,
  unicorn, oxc, import, react, react-perf, nextjs and jsx-a11y plugins, plus
  every generic rule from `antislop-plugin`. Fix warnings rather than disabling
  rules; if a disable is genuinely right, comment why next to the directive.
- TypeScript is `strict`. Do not add `any` or non-null assertions to get past a
  type error — model the type correctly.
- Tailwind v4 (CSS-first, no `tailwind.config`). Configure through
  `packages/ui/src/styles/globals.css`.
- Compose class variants with CVA and merge with `cn()`. Do not concatenate
  class strings by hand.
- Prefer semantic elements and correct landmarks (`header`, `nav`, `main`,
  `section` with a heading). Every interactive element needs an accessible name
  and a visible focus style.
- Animation uses `motion`; keep it restrained per the design system and respect
  `prefers-reduced-motion`.
- Conventional Commits, as used in the existing history (`feat:`, `fix:`,
  `chore:`). Default branch is `main`.

### The `no-use-effect` skill

There is currently **no `useEffect` in this repository** — client state uses
`useSyncExternalStore`, event handlers, and ref-callback cleanup instead. Keep
it that way where you can: most of what an effect is reached for here belongs
in render, in an event handler, or in CSS.

When you do need one, use the `no-use-effect` skill first. Effects in
`packages/ui` matter twice over: every app that imports the package inherits
them.

If the skill is not already installed in your harness, install it once:

```bash
npx skills add https://github.com/factory-ai/factory-plugins --skill no-use-effect
```

For a quick session or a one-off change, run it without installing:

```bash
npx skills use "https://github.com/factory-ai/factory-plugins" --skill "no-use-effect"
```

Follow the instructions it generates. Read its **complete** output — redirect to
a temporary file first if it is long — and resolve any relative paths against
the supporting-files directory it names.

The skill is a guiding principle, not a gate. No lint rule bans `useEffect`, so
do not treat a passing `pnpm quality` or `pnpm build` as covering this.

## 10. Source-of-truth order

When requirements conflict, use:

1. The current user's explicit request.
2. This repository guide.
3. `packages/ui/src/styles/tokens.css` for token values — the system of record.
4. `DESIGN.md` for visual _rules_ and intent, never for token values.
5. Existing implementation in `apps/` and `packages/`.

`PRODUCT.md` is explicitly **not** in this order — it is unsettled working
material (§5).

Do not silently resolve a meaningful conflict. State it and ask.

## 11. Verification

There is no test suite. Verification is the build, the linter, and your own eyes.

```bash
pnpm dev             # local dev server
pnpm lint            # oxlint (pnpm lint:fix applies safe fixes)
pnpm format          # oxfmt check (pnpm format:fix rewrites)
pnpm quality         # lint, then format check (pnpm quality:fix fixes both)
pnpm typecheck       # tsc in every workspace (turbo)
pnpm build           # next build in every app (turbo)
pnpm preview         # apps/web: opennext build + local Worker preview (the real runtime)
pnpm deploy          # apps/web: PUBLISHES — only when explicitly asked
```

oxlint does not type-check. `pnpm quality`, `pnpm typecheck` and `pnpm build`
are all required signals: run them and report each result.

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

## 13. Shared design system across repos

Spaceman has two sites that must look like one product:

- `spacemansh` (this repo): spaceman.sh, and the canonical tokens in
  `packages/ui/src/styles/tokens.css`.
- `spaceman-ui`: ui.spaceman.sh and the `@spaceman` shadcn registry. It keeps
  `app/tokens.css` byte-identical to the file here; its `pnpm tokens:check`
  compares the two and fails on drift.

To change a token: edit `tokens.css` here, update `DESIGN.md` if it is a system
decision, copy the file to `spaceman-ui/app/tokens.css`, and run
`pnpm tokens:check` there. Ship both changes together.

These guidelines are working when diffs stay focused, uncertainty is surfaced
early, the design system holds in both themes, and visual work is backed by
having actually looked at it.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
