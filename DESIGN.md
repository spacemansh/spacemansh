---
name: Spaceman
description: Open-source tools that help developers ship beautiful user interfaces.
tokens: spacemansh/packages/ui/src/styles/globals.css (the spaceman:tokens region)
---

# Design System: Spaceman

> **Token values live in the `spaceman:tokens` region of
> `packages/ui/src/styles/globals.css` in the spacemansh repo**, not in this
> file. spaceman-ui keeps that region, and `base.css`, byte-identical in its
> `app/globals.css` and `app/base.css`; `pnpm tokens:check` there fails on
> drift. Both repos share this document. It carries the _rules and intent_ of
> the system; the CSS carries the numbers. Do not reintroduce token values here.
>
> The site tokens stay local. Registry items inherit the installing project's
> theme and use standard shadcn token fallbacks for site-specific values.

## 1. Overview

**Creative North Star: "The Quiet Toolbench"**

Spaceman is a family of open-source tools for interface work: spaceman.sh is
the parent page, and each product (the personal website, the UI registry at
ui.spaceman.sh, UI theme, Spaceman RTA and Spaceman skills) has its own site.
Every surface should feel like a precise developer workspace: monochrome-first,
quiet, capable, with motion that feels physical rather than decorative.

Light and dark are peers. Dark can be the more atmospheric presentation, but
light must look deliberate. The brand reads as open-source developer tooling,
familiar next to GitHub and npm, without code costumes.

**Key characteristics:**

- Monochrome identity with one rare accent (Signal Green by default).
- Objects you can touch: square frames that pop, lean, slide and settle.
- Few, large, confident type sizes; one weight for display.
- Generous empty space; one action per moment.
- Every motion has a reduced-motion twin that keeps the state change.

## 2. Tokens

### Where they live

| File                             | Holds                                                                                               |
| -------------------------------- | --------------------------------------------------------------------------------------------------- |
| `globals.css`, `spaceman:tokens` | `@custom-variant dark`, `:root` (light), `.dark`, the `.theme-<name>` palettes, `@theme inline`     |
| `base.css`                       | Shared base rules: `px-page`, `body`, border and outline defaults, the focus ring                   |
| `<component>.css` (per feature)  | What Tailwind cannot express: keyframes, phase selectors, engine-driven geometry, on `data-*` hooks |

Tokens live in `globals.css` because that is the file `components.json` names:
the shadcn CLI, uitheme and Spaceman RTA all read and write theme variables
there. Multi-palette theming fails if they sit anywhere else. Every other rule
goes in an imported file.

### Tailwind first, no arbitrary values

Styling is Tailwind classes built from the theme. `@shadcn/lint` enforces it in
`pnpm lint`: `no-arbitrary-values` (no `p-[13px]`, `text-[clamp(…)]`),
`no-raw-colors` (no palette or raw colours) and `no-unknown-classes`. A value
the scale does not have becomes a named token, not an arbitrary value. CSS
that classes cannot express lives next to its component and hooks onto `data-*`
attributes, never custom class names.

### Design tokens added for the site

| Group   | Tokens                                                                                                                                                                                                                        |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Type    | `text-hero`, `text-page`, `text-card-title`, `text-lead`, `text-copy`, `text-copy-lg`, `text-nav`, `text-action`, `text-control`, `text-overline`, `text-link`, `text-tagline` (each with its line height and letter spacing) |
| Spacing | `gutter`, `footer-top`, `footer-gap`, `footer-end`, `tagline` (fluid `clamp()` values)                                                                                                                                        |
| Shadow  | `shadow-card`, `shadow-card-raised` (light and dark values), `shadow-float`, `shadow-hairline`                                                                                                                                |
| Colour  | `primary-hover`, derived from `--primary` so it follows every palette                                                                                                                                                         |
| Easing  | `ease-sp-out`, `ease-sp-in-out`, `ease-roll`                                                                                                                                                                                  |

### Rules

- **One token set.** `:root`, `.dark` and the `.theme-<name>` palettes are the
  only places tokens are defined. No page- or component-scoped block redefines
  them.
- **Keep every token.** Unused groups (sidebar, chart, tag, the shadow scale)
  stay; future products may need them. Removing a token is a decision.
- **Never invent one.** A value that has no token is a design-system question:
  stop and ask. Adding a token means `:root`, `.dark`, `@theme inline`, this
  file, and the copy in spaceman-ui.
- **Never hardcode a colour, radius or font** in a component.

## 3. Colour

The palette is strict neutral monochrome with one accent used for action and
focus.

### Roles

- **Background / Foreground**: page field and primary text. Near-white and ink
  in light; near-black and cool off-white in dark.
- **Card**: the frame of a card, a panel, the tour nav pill.
- **Inset**: the recessed well inside a card frame, where product art sits.
- **Muted / Muted Strong**: quiet fills. Muted Strong is the field the framed
  tour pages sit on.
- **Muted Foreground**: secondary copy. Check AA contrast every time it sits on
  a dark surface.
- **Border / Border Strong**: hairlines. Strong is for outlines of controls and
  for a raised card's ring.
- **Primary (Signal Green)**: the Explore button, focus rings, selection. Rare.
- **Primary Ink**: the readable form of primary for lines, links and icons on
  the page background (footer link underlines).
- **Tag**: soft blue for catalogue category labels on ui.spaceman.sh. It labels,
  never acts.

### Palettes

`.theme-<name>` on `<html>` swaps the accent: emerald (the default, equal to the
base tokens), slate, azure, violet and amber. Each palette overrides only
`--primary`, `--primary-foreground`, `--ring` and `--primary-ink`, in light
(`.theme-<name>`) and dark (`.dark.theme-<name>`). uitheme's `colorThemes` and
the `@spaceman/theme-picker` item drive the class.

### Named rules

**The Monochrome First Rule.** A screen must work in black, white and neutral
grey before any accent is added.

**The Rare Accent Rule.** The accent is for action, focus, selection and small
moments of confirmation. If more than ~10% of a viewport carries it, the page
is off-brand.

## 4. Typography

- **Sans (display and body):** Noto Sans, via `next/font` as `--font-sans`.
- **Mono:** Geist Mono, as `--font-mono`, for technical metadata only.
- **Serif:** Source Serif 4, as `--font-serif`, loaded and reserved; no surface
  uses it yet.

### Scale in use

| Role             | Size                                       | Weight | Notes                                        |
| ---------------- | ------------------------------------------ | ------ | -------------------------------------------- |
| Hero line        | `text-hero`: 40–56px fluid / 1.1, −0.03em  | 400    | Balanced, two lines                          |
| Tour title       | `text-page`: 30–52px fluid / 1.08, −0.03em | 400    | Must fit one line at 320px for every product |
| Carousel name    | `text-card-title`: 24–32px fluid / 1.1     | 400    | Under the centred card                       |
| Lead             | `text-lead`: 20px / 26px, −0.02em          | 400    | Hero                                         |
| Description      | `text-copy`, `md:text-copy-lg`             | 400    | Tour and carousel; muted foreground          |
| Controls         | `text-sm`, `text-control`, `text-action`   | 500    | Buttons, tour segments, Explore              |
| Footer heading   | `text-overline`: 12.5px, 0.16em, uppercase | 500    | Muted foreground with a 24px rule under it   |
| Metadata         | `text-sm` mono                             | 400    | `01 / 05 · ui.spaceman.sh`, package names    |
| Wordmark tagline | `text-tagline`, mono, uppercase            | 500    | Fluid with the footer width                  |

### Named rules

**The One Weight Rule.** Display type is regular weight (400). Hierarchy comes
from size and space, not bold.

**The No Costume Rule.** Monospace only for code, CLI output, package names,
domains and technical metadata — never to signal "developer".

**The One Line Rule.** A control's label never wraps. When a row gets tight,
shorten the label on small screens (keep the full name in the accessible name)
before letting buttons stack.

## 5. Shape and elevation

- **Radius:** controls 6px (`--radius-md`); cards scale their radius with their
  size (24px at 288px) and their inner well follows the concentric rule.
- **The Concentric Rule.** A well's radius equals the frame radius minus the
  padding minus the 1px hairline, so nested corners stay parallel.
- **Shadows:** a resting card has a hairline ring plus a soft two-layer drop. A
  raised (hovered, selected, centred) card swaps to Border Strong and a deeper
  drop. Dark mode uses deeper, darker layers.

**The Flat Unless Active Rule.** Resting UI is flat or nearly flat. Depth only
clarifies focus, interactivity or a foreground object.

## 6. Motion

Motion is physical: springs for objects, eased curves for surfaces. It never
loops for attention, and every animation has a reduced-motion variant that keeps
the state change and drops the movement.

### Curves and springs

- `--ease-sp-out` (`cubic-bezier(0.23, 1, 0.32, 1)`): entrances, frames, expands.
- `--ease-sp-in-out` (`cubic-bezier(0.77, 0, 0.175, 1)`): on-screen travel.
- Card springs (BounceCards): pop k=170 with bounciness 0.6; position k=210,
  damping ratio 0.72; 240Hz substeps; entrance delay 0.5s, stagger 0.06s.

### Patterns

- **Card fan** (desktop and tablet): five square frames on a straight zig-zag
  line. Hover straightens, lifts and scales a card (1.06) and pushes its
  neighbours aside; a press squashes it.
- **Card marquee** (where the fan cannot fit at 150px cards): the same frames
  drift left at 32px/s in an endless loop. Drag scrubs, a flick throws and
  eases back over ~1s, and a tap opens the card carousel.
- **Card carousel** (clicking a card): the fan opens into a row of large,
  upright cards centred on the one clicked; the hero fades back; a caption
  under the centred card names the product and links to it. Arrows, keys,
  swipes and clicks on a neighbour move one card; it loops; clicking the
  centred card, Escape or the close control folds it back into the fan.
- **Framed tour** (Explore): frame 420ms, slide 560ms, expand 420ms. Closed
  means away: framed, parked under the screen; closing drops only the current
  page while the field and nav fade.
- **Text flip**: one word every 2s; out 300ms (down 40%, blur 1px), in 300ms
  (from −20%). All words share one grid cell, so nothing shifts.
- **Letter roll**: the Explore label rolls letter by letter, 450ms
  `cubic-bezier(0.6, 0, 0.2, 1)`, 20ms stagger.
- **Eased wheel**: page scroll follows the wheel with lerp 0.08; keyboard,
  scrollbar and touch stay native.

### Named rules

**The Interruptible Rule.** Any motion can be reversed mid-flight and retargets
from where it is. Use transitions and springs, not keyframes, for anything a
user can trigger twice.

**The Reduced Twin Rule.** Under `prefers-reduced-motion`, positions change
instantly, springs settle at once, marquees stop, and nothing else is lost.

**The Hover Is Real Rule.** Hover effects are gated to
`(hover: hover) and (pointer: fine)`; touch gets taps, never phantom hovers.

## 7. Components

### Buttons

- **Primary (Explore):** a liquid metal pill (`liquid-metal-button.tsx`): a
  Paper Shaders ring in the grey tokens round a background-filled body with an
  arrow well; the metal flows faster on hover and focus, stays still under
  reduced motion, and falls back to a plain ring without WebGL.
- **Outbound link (tour, carousel):** a foreground pill whose arrow circle
  starts on the left pointing right and slides to the right end, turning to ↗,
  on hover and focus: the link leads away. 48px tall, one line, beside an
  outline pill for the next step.
- **GitHub (nav):** the name and a mono `[count]` of stars (a TanStack Query
  hook, refetched every 6 hours; an org's total, or one repo). `emphasis`
  chooses which part is in foreground; the site mutes the name. `hover` is a
  thin underline under the name (the site's), a fill, a colour change, or none.
- **Theme toggle (nav):** text only, the current mode name in the nav's muted
  style, no fill on hover. Hover keeps the letters after the first three scrambling until the pointer
  leaves; a
  click scrambles the whole word into the next mode over the theme transition's
  duration. System → Light → Dark when `system` is on, else Light ↔ Dark (the site),
  where a system preference shows as the mode it resolves to.
- **Press:** scale 0.96 on `:active`.

### Cards

- Square frame (Card) with an inset well, concentric corners. The well holds
  each product's art; until art exists it stays an empty well.
- Shadows per §5; z-order puts the middle cards on top of the fan.

### Logo chip

- A brand chip (`components/logo-chip.tsx`): a squircle logo beside its name.
  The hero line is "[astronaut]
  Spaceman's [flip]", with the logo and name as the chip.
- Default: a muted fill, a tight padding, no border. The logo is one cap
  height (`1cap`), so it rests on the baseline and meets the cap line; the name
  is trimmed to its capitals (`text-box: trim-both cap alphabetic`), so the
  padding balances evenly round the capitals; descenders may dip below the fill, by design. The radius is concentric: the
  logo's radius plus the padding. Lengths are in em and cap, so it scales with
  the text around it.
- Every 10s the logo dips, springs up 1.35× and leaning right 10°, holds 5s,
  then springs back straight for 5s (motion). It grows from the side facing the
  name and corrects for its rotated overhang, so it outgrows the chip while the
  gap to the name holds. Only transforms move; the text never shifts. Reduced
  motion keeps it still.
- `logo` is a path in `public/` or a full link (links are served as they are);
  an image that fails to load leaves the empty well; an empty `logo` gives a
  name-only chip.
- Props cover the logo (size, radius, smoothing, ring and ring colour,
  alignment), the chip (gap, padding, radius, any CSS background or a gradient,
  border, name colour and weight) and the motion (interval, hold, delay, tilt,
  zoom, dip, origin, paused). Colours are plain CSS values, so the app passes
  tokens (`var(--muted)`) and registry users can pass brand colours.
- Tune it at `/lab/logo` (not indexed), which has presets showing the props
  cover outlined, rose and blue chips. It becomes a
  registry item once approved.

### Navigation

- Sparse: the theme toggle and the GitHub stars top right on spaceman.sh; the tour's segmented pill
  (close, divider, one segment per product; numbers below 640px).

### Footer

- Sticky under the page, revealed as the page scrolls away (relative below a
  640px-tall screen so it can always be fully seen).
- SVG wordmark SPACEMAN.SH with a block shadow, `.SH` at half size,
  scaling to the width; a mono tagline; three link columns.

## 8. Do's and Don'ts

### Do

- **Do** keep the identity monochrome-first in both themes.
- **Do** give every motion a reduced-motion twin and verify both.
- **Do** keep visible focus states and WCAG AA contrast.
- **Do** keep copy factual about the products; product copy is a product decision.

### Don't

- **Don't** use AI cliché, corporate-SaaS identity, crypto or gaming styling, or
  startup templates.
- **Don't** use angle brackets, terminal-window marks, hexagons, rocket icons,
  AI sparkles, gradients as identity, dithered imagery or mascots.
- **Don't** turn the brand green, purple, slate or beige; palettes swap only the
  accent.
- **Don't** define or override tokens outside the `spaceman:tokens` region.
