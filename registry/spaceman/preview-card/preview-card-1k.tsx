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
 * Design 1k, the caption inside. There is no footer: the name and arrow float
 * in the preview's top corners, and the preview fills the rest of the card.
 *
 * The empty well links to the item; only the preview itself sits above the
 * link, so its controls stay usable.
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
        'group border-border bg-card has-[a[id]:focus-visible]:outline-ring relative aspect-square min-h-0 overflow-hidden rounded-[calc(var(--radius)+6px)] border p-[5px] transition-[border-color,box-shadow] duration-150 ease-out hover:border-[var(--border-strong,var(--border))] hover:shadow-[var(--shadow-lift,var(--shadow-md))] has-[a[id]:focus-visible]:outline-2 has-[a[id]:focus-visible]:outline-offset-2 motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      <div className='grid h-full overflow-hidden rounded-[calc(var(--radius)+2px)] bg-[var(--inset,var(--muted))]'>
        <div className='flex items-center justify-between gap-2 self-start px-3.5 pt-3 [grid-area:1/1]'>
          <h3 className='text-[15px] font-medium'>
            <a
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
              href={href}
              id={titleId}
            >
              {title}
            </a>
          </h3>
          <span
            aria-hidden='true'
            className='font-mono text-[14px] font-medium text-[color:var(--primary-ink,var(--foreground))]'
          >
            →
          </span>
        </div>
        <div className='relative z-10 place-self-center [grid-area:1/1]'>
          {children}
        </div>
      </div>
    </article>
  )
}

export { PreviewCard }
