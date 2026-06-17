---
name: spaceman.sh
description: Open-source tools that help developers ship beautiful user interfaces.
colors:
  background: "oklch(0.9911 0 0)"
  foreground: "oklch(0.2046 0 0)"
  primary: "oklch(0.8348 0.1302 160.9080)"
  primary-foreground: "oklch(0.2626 0.0147 166.4589)"
  secondary: "oklch(0.9940 0 0)"
  muted: "oklch(0.9461 0 0)"
  muted-foreground: "oklch(0.2435 0 0)"
  border: "oklch(0.9037 0 0)"
  input: "oklch(0.9731 0 0)"
  dark-background: "oklch(0.012 0 0)"
  dark-foreground: "oklch(0.9288 0.0126 255.5078)"
  dark-card: "oklch(0.125 0 0)"
  dark-primary: "oklch(0.8003 0.1821 151.7110)"
  dark-muted-foreground: "oklch(0.7122 0 0)"
  dark-border: "oklch(0.2809 0 0)"
typography:
  display:
    fontFamily: "Inter Display, sans-serif"
    fontSize: "clamp(2.8rem, 4.2vw, 3.45rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "0"
  accent:
    fontFamily: "Intel one mono, Georgia, serif"
    fontStyle: "italic"
  body:
    fontFamily: "Intel one mono, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0"
  label:
    fontFamily: "Intel one mono, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "0"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "28px"
  xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    height: "36px"
  input-email:
    backgroundColor: "transparent"
    textColor: "{colors.dark-foreground}"
    rounded: "{rounded.md}"
    padding: "4px 12px"
    height: "36px"
---

# Design System: spaceman.sh

## 1. Overview

**Creative North Star: "The Quiet Toolbench"**

spaceman.sh should feel like a precise developer workspace: minimal, monochrome-first, quiet, and capable. The current landing page is a Suron-inspired reference capture, not the final product story. Preserve the useful parts: dark-first restraint, intimate pacing, a single clear email action, and careful typography. Replace the parts that belong to Suron: romantic copy, matchmaking promise, and the specific brand name.

The system must work in both light and dark mode. Dark mode can remain the more atmospheric presentation, but light mode must feel intentional, not like an afterthought. The brand should read as open-source developer tooling, familiar enough for GitHub and npm, but not dressed up in obvious code tropes.

**Key Characteristics:**
- Monochrome-first identity with one rare green accent.
- Small, confident UI primitives rather than oversized marketing blocks.
- Dark-mode atmosphere with light-mode parity.
- Calm developer-tool voice, never romantic or AI-generated.
- Current typography is documented as implementation state, not a permanent mandate.

## 2. Colors

The palette is strict neutral monochrome with a small green accent used for action and focus.

### Primary
- **Signal Green**: The current primary action and focus color. It should be rare, functional, and never expanded into a full green theme.

### Neutral
- **White Surface**: The light-mode background and surface color.
- **Ink Text**: The primary light-mode text color.
- **Near-Black Field**: The dark-mode page background. This is the most important current atmosphere token.
- **Soft Dark Surface**: The dark card and input field base.
- **Quiet Border**: Thin structural lines only. Borders should be subtle and useful.
- **Muted Text**: Secondary copy and placeholder text. Check contrast every time this is used on dark backgrounds.

### Named Rules

**The Monochrome First Rule.** Any new spaceman.sh screen must work in black, white, and neutral gray before adding accent color.

**The Rare Accent Rule.** Signal Green is for action, focus, selection, and tiny moments of confirmation. If more than 10 percent of a viewport is green, the page is off-brand.

## 3. Typography

**Display Font:** Outfit, with sans-serif fallback
**Body Font:** Outfit, with sans-serif fallback
**Accent Font:** Playfair Display italic, with Georgia fallback

**Character:** The current Suron reference uses a soft sans with a serif italic accent. That pairing gives the page intimacy, but it is not automatically right for spaceman.sh. Future brand work should test a more ownable open-license type direction before locking this in.

### Hierarchy
- **Display** (600, fluid clamp, tight line-height): Use for one dominant landing-page statement. Keep max size restrained enough to avoid overflow.
- **Headline** (600, 2rem to 3rem): Use for section-level messaging when the page expands beyond the hero.
- **Title** (500 to 600, 1rem to 1.35rem): Use for compact product claims, feature labels, and small grouped content.
- **Body** (400, 0.875rem to 1rem): Use for explanatory copy. Keep line length under 75 characters.
- **Label** (500, 0.8rem): Use for form controls, small buttons, and compact navigation.

### Named Rules

**The No Costume Rule.** Do not use monospace just to signal "developer." Only use mono where the content is actually code, CLI output, package names, or technical metadata.

**The Reference Font Rule.** Outfit and Playfair describe the current reference implementation. They are not sacred brand assets.

## 4. Elevation

The system uses tonal layering and tight glows more than traditional shadows. Surfaces are mostly flat. When shadow appears, it should feel like local emphasis in a dark interface, not a floating SaaS card.

### Shadow Vocabulary
- **Soft Form Lift**: Used on the current email capture form to separate it from the near-black field.
- **Inset Control Edge**: Used on the current submit button to sharpen it without adding a heavy border.

### Named Rules

**The Flat Unless Active Rule.** Resting UI should be flat or nearly flat. Depth appears when it clarifies focus, interactivity, or a foreground control.

## 5. Components

### Buttons
- **Shape:** Gently squared controls with small corners (6px to 8px).
- **Primary:** Compact height, direct label, functional accent or neutral fill depending on theme.
- **Hover / Focus:** Use color shift and visible focus rings. Avoid oversized glow.
- **Icon Use:** Icons may sit inside buttons when they clarify direction or action. Prefer lucide icons already in the project.

### Inputs / Fields
- **Style:** Compact, dark-aware fields with transparent or tonal backgrounds.
- **Focus:** Ring-based focus is already part of the component system and must remain visible.
- **Placeholder:** Placeholder text must meet contrast requirements, especially on dark surfaces.

### Cards / Containers
- **Corner Style:** Use 8px to 12px at most.
- **Background:** Prefer tonal surfaces over decorative card stacks.
- **Shadow Strategy:** Use the elevation rules above. Do not pair broad shadows with decorative borders.
- **Internal Padding:** Use compact spacing for controls and wider spacing only for major landing sections.

### Navigation
- **Style:** Minimal wordmark or logo presence, sparse links, compact spacing.
- **State:** Hover and focus states should be crisp and quiet.
- **Mobile:** Preserve hierarchy without adding a marketing-style nav block.

## 6. Do's and Don'ts

### Do:
- **Do** keep the identity monochrome-first in both light and dark modes.
- **Do** use the existing logo as the identity source and ignore the Suron logo.
- **Do** make the landing page feel like open-source developer tooling, not a romance product.
- **Do** preserve visible focus states and WCAG AA contrast.
- **Do** use the Signal Green accent sparingly for meaningful action.

### Don't:
- **Don't** use AI cliche, over-corporate SaaS identity, crypto styling, gaming marks, or random startup templates.
- **Don't** use angle brackets, terminal-window marks, hexagons, rocket icons, AI sparkles, gradients as identity, or mascots.
- **Don't** turn the whole brand green, purple, blue-slate, or beige.
- **Don't** use the current Suron copy, matchmaking promise, or product story for spaceman.sh.
- **Don't** rely on Outfit + Playfair as the final brand voice without testing a more ownable open-license type direction.
