'use client'

import { useTheme } from '@space-man/react-theme-animation'
import type * as React from 'react'
import { useSyncExternalStore } from 'react'

import { cn } from '@/lib/utils'
import { colorThemes } from '@/registry/spaceman/theme-picker/themes'

const subscribe = () => () => {}

/**
 * A row of swatches that switches the accent colour theme at runtime.
 *
 * Each swatch carries its own `theme-<name>` class, so it paints the accent
 * that theme would apply in the current light or dark mode. The pressed state
 * is only reported after hydration: the provider reads the stored theme on
 * the client, and reporting it during hydration would not match the server.
 */
function ThemePicker({
  themes = colorThemes,
  className,
  ...props
}: React.ComponentProps<'fieldset'> & { themes?: string[] }) {
  const { colorTheme, switchColorTheme } = useTheme()

  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )

  return (
    <fieldset
      aria-label='Accent colour'
      className={cn(
        'border-border bg-card flex items-center gap-2.5 rounded-full border px-3.5 py-3',
        className,
      )}
      {...props}
    >
      {themes.map((name) => (
        <button
          aria-label={name.charAt(0).toUpperCase() + name.slice(1)}
          aria-pressed={hydrated ? colorTheme === name : undefined}
          className={cn(
            `theme-${name}`,
            "bg-primary relative size-5 cursor-pointer rounded-full outline-offset-2 transition-[transform,box-shadow] duration-150 ease-out after:absolute after:-inset-1 after:content-[''] hover:scale-110 active:scale-[0.96] aria-pressed:shadow-[0_0_0_2px_var(--card),0_0_0_4px_var(--foreground)] motion-reduce:transition-none",
          )}
          key={name}
          onClick={() => switchColorTheme(name)}
          title={name}
          type='button'
        />
      ))}
    </fieldset>
  )
}

export { ThemePicker }
