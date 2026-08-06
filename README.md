# spacemansh

The [spaceman.sh](https://spaceman.sh) website, and the `@spaceman` component
registry it serves.

## Using the registry

The registry is a [shadcn registry](https://ui.shadcn.com/docs/registry). Items
are installed into your own project as source files you own and can edit — there
is no runtime dependency on spaceman.sh.

Register the namespace once:

```bash
npx shadcn@latest registry add @spaceman=https://spaceman.sh/r/{name}.json
```

Then add items by name:

```bash
npx shadcn@latest add @spaceman/theme-toggle
```

You can also install directly from a URL without registering the namespace,
though items that depend on other `@spaceman` items need the namespace to
resolve them:

```bash
npx shadcn@latest add https://spaceman.sh/r/theme.json
```

### Available items

| Item | Type | Description |
| --- | --- | --- |
| `@spaceman/theme` | theme | Design tokens — a neutral monochrome palette with a single green accent for action and focus, plus radius, shadow and typography scales. Light and dark. |
| `@spaceman/theme-toggle` | block | A theme provider and toggle button that switch between light and dark with an animated circular reveal. Depends on `@spaceman/theme`. |

Browse the catalogue from the command line:

```bash
npx shadcn@latest list https://spaceman.sh/r/registry.json
```

### Notes

- `@spaceman/theme` references Geist Sans and Geist Mono. Install them yourself
  (`next/font/google`, or the `geist` package); both fall back to the system
  sans and mono stacks, so the theme works without them.
- `@spaceman/theme-toggle` expects a `dark` variant bound to the `dark` class.
  On Tailwind v4 that is `@custom-variant dark (&:is(.dark *));`.

## Development

Requires [pnpm](https://pnpm.io). The site is Next.js on Cloudflare Workers via
OpenNext.

```bash
pnpm install
pnpm dev
```

| Command | Does |
| --- | --- |
| `pnpm dev` | Local dev server |
| `pnpm build` | Rebuild the registry, then `next build` |
| `pnpm registry:build` | Regenerate `public/r/*.json` from `registry.json` |
| `pnpm preview` | Build and preview on the local Workers runtime |
| `pnpm deploy` | Publish the live site |

`pnpm lint` is currently broken — `eslint` resolves to 10.x while
`eslint-config-next` bundles plugins supporting 9 and below. Use `pnpm build`
for type and correctness checking until that is resolved.

### Adding a registry item

1. Add the source under `registry/spaceman/<item>/`.
2. Add an entry to `registry.json`, listing every npm package in
   `dependencies` and every other item in `registryDependencies` — the latter
   must be namespaced (`@spaceman/theme`, not `theme`).
3. Import it from `app/` so the site renders what it publishes.
4. Run `pnpm registry:build` and commit the generated `public/r/` output.

Items must be self-contained: styling travels with the component in its own
classes, since consumers do not get this repo's stylesheet.

See [`AGENTS.md`](AGENTS.md) for the full contributor and agent guide.

## License

[MIT](LICENSE)
