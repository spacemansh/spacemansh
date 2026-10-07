import type * as React from 'react'

import { cn } from '@/lib/utils'
import { ThemePicker } from '@/registry/spaceman/theme-picker/theme-picker'
import { ThemeToggle } from '@/registry/spaceman/theme-toggle/theme-toggle'

type SampleItem = {
  slug: string
  title: string
  index: string
  category: string
  description: string
  preview: React.ReactNode
}

const tokenSwatches = [
  'border border-border bg-background',
  'bg-muted',
  'bg-foreground',
  'bg-primary',
]

/** The published items, with the live preview each card shows. */
export const sampleItems: SampleItem[] = [
  {
    slug: 'theme-picker',
    title: 'Theme picker',
    index: '01',
    category: 'Themes',
    description: 'Swap palettes at runtime.',
    preview: <ThemePicker />,
  },
  {
    slug: 'theme-toggle',
    title: 'Theme toggle',
    index: '02',
    category: 'Themes',
    description: 'Light and dark with a reveal.',
    preview: (
      <div className='border-border bg-card rounded-xl border p-1.5'>
        <ThemeToggle className='hover:bg-muted size-8 rounded-lg' />
      </div>
    ),
  },
  {
    slug: 'theme',
    title: 'Theme tokens',
    index: '03',
    category: 'Themes',
    description: 'CSS variables for every surface.',
    preview: (
      <div aria-hidden='true' className='flex gap-2'>
        {tokenSwatches.map((swatch) => (
          <span
            className={cn('size-9 rounded-[calc(var(--radius)+2px)]', swatch)}
            key={swatch}
          />
        ))}
      </div>
    ),
  },
]
