import type * as React from 'react'

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
]
