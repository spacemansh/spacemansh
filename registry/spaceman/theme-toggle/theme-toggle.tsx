'use client'

import { useTheme } from '@space-man/react-theme-animation'
import { Moon, Sun } from 'lucide-react'
import type * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Toggles between light and dark, revealing the new theme from the button.
 *
 * The icons cross-fade through the `dark` variant rather than through React
 * state, so the button renders correctly on the server and never flashes the
 * wrong icon before hydration. Requires `ThemeProvider` above it in the tree.
 * The reveal starts from the button that was clicked, so several toggles can
 * share one provider. It is skipped when <html> carries `data-motion="reduced"`.
 */
function ThemeToggle({ className, ...props }: React.ComponentProps<'button'>) {
  const { resolvedTheme, switchThemeFromElement, toggleTheme } = useTheme()

  return (
    <button
      aria-label='Toggle theme'
      className={cn(
        'text-muted-foreground hover:bg-card hover:text-foreground focus-visible:ring-ring/60 focus-visible:ring-offset-background inline-grid size-11 cursor-pointer place-items-center rounded-md transition-colors duration-200 ease-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        className,
      )}
      onClick={(event) => {
        if (document.documentElement.dataset.motion === 'reduced') {
          void toggleTheme(true)

          return
        }

        void switchThemeFromElement(
          resolvedTheme === 'dark' ? 'light' : 'dark',
          event.currentTarget,
        )
      }}
      type='button'
      {...props}
    >
      <Sun
        aria-hidden='true'
        className='col-start-1 row-start-1 size-4 scale-90 rotate-90 opacity-0 transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none dark:scale-100 dark:rotate-0 dark:opacity-100'
      />
      <Moon
        aria-hidden='true'
        className='col-start-1 row-start-1 size-4 scale-100 rotate-0 opacity-100 transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none dark:scale-90 dark:-rotate-90 dark:opacity-0'
      />
    </button>
  )
}

export { ThemeToggle }
