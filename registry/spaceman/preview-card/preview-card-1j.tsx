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
  /** The live, interactive preview. */
  children: React.ReactNode
}

/**
 * Design 1j, the inverted footer. The footer is a solid ink bar that reads as
 * a button, while the preview above it stays neutral.
 *
 * The whole card links to the item, and a soft shadow appears on hover.
 */
function PreviewCard({
  title,
  href,
  children,
  className,
  ...props
}: PreviewCardProps) {
  const titleId = useId()

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        'group border-border bg-card has-[a[id]:focus-visible]:outline-ring relative flex aspect-square min-h-0 flex-col gap-[5px] overflow-hidden rounded-[calc(var(--radius)+6px)] border p-[5px] transition-[box-shadow] duration-150 ease-out hover:shadow-[var(--shadow-lift,var(--shadow-md))] has-[a[id]:focus-visible]:outline-2 has-[a[id]:focus-visible]:outline-offset-2 motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      <div className='relative z-10 grid min-h-0 flex-1 place-items-center overflow-hidden rounded-[calc(var(--radius)+2px)] bg-[var(--inset,var(--muted))]'>
        {children}
      </div>

      <div className='bg-foreground text-background flex h-10 items-center gap-2 rounded-[calc(var(--radius)+2px)] px-3'>
        <h3 className='mr-auto text-[14px] font-medium'>
          <a
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            href={href}
            id={titleId}
          >
            {title}
          </a>
        </h3>
        <span aria-hidden='true' className='font-mono text-[11px] opacity-75'>
          Open
        </span>
        <span aria-hidden='true' className='font-mono text-[14px] font-medium'>
          →
        </span>
      </div>
    </article>
  )
}

export { PreviewCard }
