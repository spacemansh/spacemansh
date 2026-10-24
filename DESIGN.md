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

| File                               | Holds                                                                                           |
| ---------------------------------- | ----------------------------------------------------------------------------------------------- |
| `globals.css`, `spaceman:tokens`   | `@custom-variant dark`, `:root` (light), `.dark`, the `.theme-<name>` palettes, `@theme inline` |
| `base.css`                         | Shared base rules: `px-page`, `body`, border and outline defaults, the focus ring               |
| `apps/web/app/site.css` (per site) | The site's `.spaceman-*` composition layer. It uses tokens; it never defines them               |

Tokens live in `globals.css` because that is the file `components.json` names:
the shadcn CLI, uitheme and Spaceman RTA all read and write theme variables
there. Multi-palette theming fails if they sit anywhere else. Every other rule
goes in an imported file.

### Rules

- **One token set.** `:root`, `.dark` and the `.theme-<name>` palettes are the
  only places tokens are defined. No page- or component-scoped block redefines
  them.
- **Keep every token.** Unused groups (sidebar, chart, tag, the shadow scale)
  stay; future products may need them. Removing a token is a decision.
- **Never invent one.** A value that has no token is a design-system question:
  stop and ask. Adding a token means `:root`, `.dark`, `@theme inline`, this
  file, and the copy in spaceman-ui.
- **Never hardcode a colour, radius or font** in a component. Known debt: the
  card and tour shadows in `site.css` use literal `hsl(0 0% 0% / …)` layers;
  they are candidates for shadow tokens, pending a decision.

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

| Role             | Size                                         | Weight | Notes                                        |
| ---------------- | -------------------------------------------- | ------ | -------------------------------------------- |
| Hero line        | `clamp(40px, 34.65px + 1.427vw, 56px)` / 1.1 | 400    | Tracking −0.03em, balanced, two lines        |
| Tour title       | `clamp(30px, 22px + 2vw, 52px)` / 1.08       | 400    | Must fit one line at 320px for every product |
| Lead             | 20px / 26px                                  | 400    | Hero; tracking −0.02em                       |
| Tour description | 16px / 24px, 18px / 26px from 768px          | 400    | Muted foreground                             |
| Controls         | 14–16px / 1                                  | 500    | Buttons, nav pills, tour segments            |
| Footer heading   | 12.5px, tracking 0.16em, uppercase           | 500    | Muted foreground with a 24px rule under it   |
| Metadata         | 14px mono                                    | 400    | `01 / 05 · ui.spaceman.sh`, package names    |
| Wordmark tagline | Fluid with the footer width, mono, uppercase | 500    | Under the SVG wordmark                       |

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

- **Primary (Explore):** accent fill, 48px tall, auto width, letter roll on
  hover and focus.
- **Solid / outline pair (tour):** foreground fill with an arrow for the
  outbound link; a Border Strong outline for the next step. 40px tall, one line.
- **Ghost pill (nav):** text at 34% foreground; Muted fill on hover.
- **Press:** scale 0.96 on `:active`.

### Cards

- Square frame (Card) with an inset well, concentric corners. The well holds
  each product's art; until art exists it stays an empty well.
- Shadows per §5; z-order puts the middle cards on top of the fan.

### Navigation

- Sparse: a GitHub pill top right on spaceman.sh; the tour's segmented pill
  (close, divider, one segment per product; numbers below 640px).

### Footer

- Sticky under the page, revealed as the page scrolls away (relative below a
  640px-tall screen so it can always be fully seen).
- SVG wordmark SPACEMAN.SH after skills.sh's ANSI Shadow, `.SH` at half size,
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
