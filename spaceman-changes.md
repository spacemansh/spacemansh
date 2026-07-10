# Spaceman Changes

## Summary

This branch reimplements the Figma-inspired spaceman.sh landing page on top of the latest `spacemansh` repository. The work replaces the older multi-section internal-tools marketing page with a quieter header, hero, and product-box layout based on the edited Figma design.

The implementation preserves the current repo's Tailwind/shadcn-style token system while adding a scoped `.spaceman-page` layer for the new dark-first brand surface.

## Source Design

The UI was based on the Figma frame:

`spaceman.sh / header hero / desktop`

Figma URL:

`https://www.figma.com/design/7xdvdvQbERZ4jz0JOnVhYD/spaceman-header-hero-box-layout?node-id=4-29`

Key values brought over:

- 65px header height.
- 32px desktop horizontal page padding.
- Left-aligned hero content.
- 99px desktop top spacing for the hero.
- 55.2px desktop hero heading.
- 56.3px desktop hero heading line height.
- Three 315.5px product boxes on large desktop.
- 254px minimum card height.
- Minimal dark-first visual system with light mode parity.

## Files Changed

### `app/page.tsx`

The previous page was replaced with the new header and hero layout.

Notable changes:

- Removed the old feature grid, CTA section, and footer.
- Removed React `useState` theme handling.
- Added a CSS-native theme toggle using an accessible checkbox and label.
- Added `Sun` and `Moon` icons from `lucide-react`.
- Updated navigation to:
  - Products
  - Standards
  - Docs
  - GitHub
- Updated the hero copy to match the Figma design.
- Added animation hook classes for nav, hero text, product cards, and pressable elements.

### `components/product-box-grid.tsx`

Added a reusable product-box grid component.

The component exports:

- `ProductBox`
- `ProductBoxGrid`

Each product card includes:

- A small mono label.
- A mono product title.
- A short description.
- A clear text action with an arrow icon.
- Focus-visible states.
- Responsive sizing.
- Motion hooks via `.spaceman-product-card`.

### `app/globals.css`

Added the scoped layout, theme, typography, and animation rules for the new page.

Notable additions:

- `text-sp-display` utility for Figma-aligned display typography.
- `.spaceman-page` scoped dark tokens.
- `.spaceman-page:has(.spaceman-theme-toggle:checked)` light tokens.
- Logo inversion in light mode.
- CSS-native sun/moon icon transition.
- Staggered first-load reveal animation.
- Press feedback for interactive elements.
- Pointer-gated hover animation for cards.
- Reduced-motion handling.

## Theme Implementation

The original React-state theme toggle was replaced with a CSS-only toggle.

Why:

- It avoids client hydration/event-binding risk.
- It keeps the page renderable as a server component.
- The real checkbox input is 44px by 44px, so the accessible hit area matches the visible control.

How it works:

- The checkbox is transparent and positioned over the visible control.
- The label shows the sun/moon icons.
- `:has(.spaceman-theme-toggle:checked)` updates the page-scoped CSS variables.
- The logo is inverted in light mode.

## Responsive Design

The layout was adapted for desktop, tablet, mobile, and narrow mobile.

Responsive behavior:

- Desktop keeps the Figma-like three-card row.
- Tablet reflows cards into available columns.
- Mobile stacks cards vertically.
- Navigation links hide below large screens.
- The theme toggle remains available at all sizes.
- The hero heading steps down on small and very narrow screens.
- The grid uses `auto-fit` so it adapts to available space without horizontal scrolling.

## Animation Pass

The animation pass follows the `emil-design-eng` guidance.

Motion added:

- First-load reveal for the nav.
- Staggered hero label, title, and body copy reveal.
- Staggered product-card reveal.
- Press feedback on links, cards, and the theme toggle.
- Pointer-gated card hover movement.
- Smooth theme icon crossfade/rotation.

Motion intentionally avoided:

- No ambient looping animation.
- No layout-property animation.
- No hover animation for touch devices.
- No long UI motion over 300ms.
- No keyboard-triggered animation.

Motion values:

- Enter motion: 360ms.
- Nav enter motion: 240ms.
- Press feedback: 140ms.
- Card hover: 180ms.
- Theme icon transition: 180ms.
- Main ease-out curve: `cubic-bezier(0.23, 1, 0.32, 1)`.
- Icon state curve: `cubic-bezier(0.77, 0, 0.175, 1)`.

## Accessibility Notes

- The theme toggle has a real accessible input.
- The input and visible label are both 44px by 44px.
- Focus states use the repo's `ring` token.
- Reduced-motion users do not receive entrance animation.
- Hover motion is gated to fine-pointer devices.

## Validation

Validation performed during implementation:

```bash
npm run lint
npm run build
```

Browser checks were also used in the prior implementation pass to verify:

- No horizontal overflow at desktop and mobile widths.
- Theme toggle changes state.
- Product cards reflow responsively.
- Reduced motion disables entrance animation.

## Commit Scope

This branch intentionally includes:

- New landing page layout.
- New product box grid component.
- Scoped CSS for theme, layout, responsiveness, and animation.
- This change summary document.

