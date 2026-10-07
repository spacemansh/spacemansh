import type * as React from 'react'
import { useId } from 'react'

import { cn } from '@/lib/utils'

type PreviewCardProps = Omit<
  React.ComponentProps<'article'>,
  'children' | 'title'
> & {
  /** The item's display name. */
  title: string
  /** Where the card links, such as the item's docs page. */
  href: string
  /** A short index such as "01". */
  index?: string
  /** The live, interactive preview. */
  children: React.ReactNode
}

/**
 * Design 1y, blueprint. Ruler ticks run along the preview's top and left
 * edges over a fine grid, like a technical drawing.
 *
 * On hover the border darkens and the card gains a soft lift shadow.
 */
function PreviewCard({
  title,
  href,
  index,
  children,
  className,
  ...props
}: PreviewCardProps) {
  const titleId = useId()

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        'group border-border bg-card hover:border-border-strong hover:shadow-lift has-[a[id]:focus-visible]:outline-ring relative flex aspect-square min-h-0 flex-col gap-1.5 overflow-hidden rounded-[calc(var(--radius)+6px)] border p-[5px] transition-[border-color,box-shadow] duration-150 ease-out has-[a[id]:focus-visible]:outline-2 has-[a[id]:focus-visible]:outline-offset-2 motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      <div className='border-border bg-inset relative z-10 grid min-h-0 flex-1 place-items-center overflow-hidden rounded-[calc(var(--radius)+2px)] border bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:20px_20px]'>
        <span
          aria-hidden='true'
          className='pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,var(--muted-foreground)_1px,transparent_1px)] bg-[size:10px_6px] opacity-50'
        />
        <span
          aria-hidden='true'
          className='pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-[linear-gradient(var(--muted-foreground)_1px,transparent_1px)] bg-[size:6px_10px] opacity-50'
        />
        {children}
      </div>

      <div className='flex items-center gap-2 px-2 pt-1.5 pb-2'>
        <h3 className='mr-auto text-[15px] font-medium'>
          <a
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            href={href}
            id={titleId}
          >
            {title}
          </a>
        </h3>
        {index ? (
          <span className='text-muted-foreground font-mono text-[10px] tracking-[0.08em] uppercase'>
            {index}
          </span>
        ) : null}
      </div>
    </article>
  )
}

export { PreviewCard }
