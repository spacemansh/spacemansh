'use client'

import type * as React from 'react'
import { Fragment, useState } from 'react'

import { cn } from '@/lib/utils'

const filters = ['All', 'Themes', 'Motion', 'Loaders', 'Blocks'] as const

type Category = Exclude<(typeof filters)[number], 'All'>

export type CatalogueEntry = {
  id: string
  category: Category
  card: React.ReactNode
}

/**
 * The catalogue grid with its category filter. Cards are rendered on the
 * server and passed in; this component only decides which ones show.
 */
export function Catalogue({ entries }: { entries: CatalogueEntry[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')

  const visible =
    filter === 'All'
      ? entries
      : entries.filter((entry) => entry.category === filter)

  return (
    <section
      aria-labelledby='catalogue-title'
      className='px-page flex scroll-mt-16 flex-col gap-[26px] pt-16 pb-18'
      id='catalogue'
    >
      <div className='flex flex-wrap items-baseline gap-4'>
        <h2
          className='text-[26px] font-normal tracking-[-0.015em] whitespace-nowrap'
          id='catalogue-title'
        >
          The catalogue
        </h2>
        <fieldset
          aria-label='Filter by category'
          className='ml-auto flex flex-wrap gap-1.5'
        >
          {filters.map((name) => (
            <button
              aria-pressed={filter === name}
              className={cn(
                'spaceman-pressable border-border text-muted-foreground hover:text-foreground cursor-pointer rounded-full border px-[11px] py-1.5 font-mono text-xs',
                'aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background aria-pressed:font-medium',
              )}
              key={name}
              onClick={() => setFilter(name)}
              type='button'
            >
              {name}
            </button>
          ))}
        </fieldset>
      </div>

      <div className='grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-3.5'>
        {visible.map((entry) => (
          <Fragment key={entry.id}>{entry.card}</Fragment>
        ))}
      </div>
    </section>
  )
}
