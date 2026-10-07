'use client'

import { ThemeProvider as ThemeAnimationProvider } from '@space-man/react-theme-animation'
import type * as React from 'react'

/**
 * Wraps the app in theme state and applies the `dark` class to <html>.
 *
 * Renders a pre-hydration script so the stored theme is applied before first
 * paint, which keeps the page from flashing the wrong theme on load. Any
 * provider prop can be overridden, e.g. `colorThemes` for the theme picker.
 */
function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof ThemeAnimationProvider>) {
  return (
    <ThemeAnimationProvider
      attribute='class'
      defaultTheme='dark'
      duration={300}
      enableSystem
      {...props}
    >
      {children}
    </ThemeAnimationProvider>
  )
}

export { ThemeProvider }
