/** the theme transition, shared by the provider and anything timed to it */
export const themeTransition = {
  /** ms the reveal takes; the theme toggle's scramble runs for the same time */
  duration: 500,
} as const

/** the colour palettes in the shared tokens (`.theme-<name>`) */
export const colorThemes = [
  'default',
  'emerald',
  'slate',
  'azure',
  'violet',
  'amber',
] as const
