# spacemansh

The [spaceman.sh](https://spaceman.sh) website and its shadcn source registry.

## Install

Use an existing React project with Tailwind CSS, shadcn's standard theme tokens,
`components.json`, and a `cn` utility. Initialize shadcn if needed:

```bash
npx shadcn@latest init
npx shadcn@latest registry add "@spaceman=https://spaceman.sh/r/{name}.json"
npx shadcn@latest add @spaceman/theme-toggle
```

Items copy editable source into your project. The registry does not install a
base theme, change your typography, or require Spaceman's fonts. Cards inherit
your existing colors, radius and shadows. Optional site-specific variables have
standard shadcn/Tailwind fallbacks. The theme picker adds only its selectable
accent palettes; it does not replace the base light/dark theme.

For URL installation:

```bash
npx shadcn@latest add https://spaceman.sh/r/preview-card-1a.json
```

Register `@spaceman` first when installing `theme-picker`, `preview-card-1c` or
`preview-card-2g`: they resolve other items through that namespace. Other items
can be installed directly by URL without it.

## Catalogue

| Item                     | Contents                                                             |
| ------------------------ | -------------------------------------------------------------------- |
| `@spaceman/theme-toggle` | Animated light/dark toggle and theme provider                        |
| `@spaceman/theme-picker` | Five accent swatches and a shared themes list; includes theme-toggle |
| `@spaceman/copy-button`  | Clipboard button with confirmation and accessible announcement       |

There are also 33 preview card variants:

| Item                        | Variant                                |
| --------------------------- | -------------------------------------- |
| `@spaceman/preview-card-1a` | Tight inset                            |
| `@spaceman/preview-card-2a` | Inset top, flat bottom, compact footer |
| `@spaceman/preview-card-1b` | Flush preview                          |
| `@spaceman/preview-card-2b` | Inset top, flat bottom                 |
| `@spaceman/preview-card-2c` | Split panels                           |
| `@spaceman/preview-card-1c` | Install footer                         |
| `@spaceman/preview-card-1d` | Floating footer                        |
| `@spaceman/preview-card-1e` | Index card                             |
| `@spaceman/preview-card-1f` | Ticket stub                            |
| `@spaceman/preview-card-1g` | Folder tab                             |
| `@spaceman/preview-card-2g` | Tinted folder tab                      |
| `@spaceman/preview-card-1h` | Crop marks                             |
| `@spaceman/preview-card-1i` | Stacked variants                       |
| `@spaceman/preview-card-1j` | Inverted footer                        |
| `@spaceman/preview-card-1k` | Caption inside                         |
| `@spaceman/preview-card-1l` | Header first                           |
| `@spaceman/preview-card-1m` | Spine                                  |
| `@spaceman/preview-card-1n` | Window chrome                          |
| `@spaceman/preview-card-1o` | Big numeral                            |
| `@spaceman/preview-card-1p` | Outline                                |
| `@spaceman/preview-card-1q` | Pill on the seam                       |
| `@spaceman/preview-card-1r` | Passe-partout                          |
| `@spaceman/preview-card-1s` | Side meta                              |
| `@spaceman/preview-card-1t` | Keycap                                 |
| `@spaceman/preview-card-1u` | Polaroid                               |
| `@spaceman/preview-card-1v` | Dog-ear                                |
| `@spaceman/preview-card-2v` | Dog-ear, flat bottom                   |
| `@spaceman/preview-card-3v` | Dog-ear, clear fold                    |
| `@spaceman/preview-card-4v` | Dog-ear on the preview                 |
| `@spaceman/preview-card-1w` | Hard offset                            |
| `@spaceman/preview-card-1x` | Notch label                            |
| `@spaceman/preview-card-1y` | Blueprint                              |
| `@spaceman/preview-card-1z` | No card                                |

Browse the generated catalogue:

```bash
npx shadcn@latest list https://spaceman.sh/r/registry.json
```

## Usage

### Theme provider

Install `theme-toggle`, then wrap the application in its provider. In Next.js:

```tsx
import { ThemeProvider } from '@/components/theme-provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

The provider defaults to class-based dark mode, enables the system preference,
and uses a 300ms animation. It forwards the underlying
`@space-man/react-theme-animation` provider props. Override `defaultTheme` to
change the initial mode. Tailwind v4 needs the class variant in its stylesheet:

```css
@custom-variant dark (&:is(.dark *));
```

`ThemeToggle` accepts standard button props and `className`:

```tsx
import { ThemeToggle } from '@/components/theme-toggle'

;<ThemeToggle />
```

### Accent picker

Install `theme-picker`, then pass its shared list to the same provider:

```tsx
import { colorThemes } from '@/lib/themes'
import { ThemePicker } from '@/components/theme-picker'

;<ThemeProvider colorThemes={colorThemes} defaultColorTheme='emerald'>
  <ThemePicker />
</ThemeProvider>
```

The built-in list is emerald, slate, azure, violet and amber. `ThemePicker`
accepts standard fieldset props and an optional `themes` array. For custom
names, provide matching `theme-<name>` CSS and pass the same names to the provider.

### Cards and clipboard

```tsx
import { PreviewCard } from '@/components/preview-card-1a'
import { CopyButton } from '@/components/copy-button'

<PreviewCard title="Example" href="/examples">
  <YourPreview />
</PreviewCard>
<CopyButton value="pnpm add example" label="Copy command" />
```

Cards accept `title`, `href`, `children`, `className` and standard article props.
Individual variants expose additional metadata props in their copied source.
Cards 1c and 2g include `copy-button` automatically. `CopyButton` requires
`value`, accepts an optional accessible `label`, and forwards button props.
The CLI adapts these example paths to the aliases in your `components.json`.

## Development

Use the pinned pnpm version in `package.json`. Direct dependency versions are
pinned to the existing lockfile; installing does not upgrade them.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

| Command               | Purpose                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------- |
| `pnpm quality`        | Lint and formatting checks                                                                |
| `pnpm registry:build` | Build payloads and validate the registry                                                  |
| `pnpm registry:check` | Check schemas, dependency graph, source payloads, stale artifacts and styling portability |
| `pnpm build`          | Rebuild the registry and production Next.js app                                           |
| `pnpm preview`        | Build and run locally in the Cloudflare Workers runtime                                   |
| `pnpm deploy`         | Publish the live site; run only when deployment is authorized                             |

GitHub stars are captured during the build with an identifying User-Agent.
Missing or invalid API results show the existing link without a count. The count
is fixed for a deployment; a fresh build captures a new count. Next.js may
reuse an existing fetch cache during incremental builds. No hourly revalidation
or remote cache storage is required. OpenNext uses its
[static assets cache](https://opennext.js.org/cloudflare/caching#ssg-site)
for prerendered pages.

### Registry maintenance

1. Add sources under `registry/spaceman/<item>/` and render them on the site.
2. Declare npm packages and namespaced registry dependencies, such as
   `@spaceman/copy-button`, in `registry.json`.
3. Use standard theme tokens or optional site variables with standard fallbacks.
   Do not publish the site's base theme, fonts or `.spaceman-*` styling.
4. Run `pnpm registry:build`. When removing an item, delete its old JSON payload.
5. Review generated `public/r/` files alongside the source before committing.

See [AGENTS.md](AGENTS.md) and [the release checklist](docs/release-checklist.md).

## License

[MIT](LICENSE)
