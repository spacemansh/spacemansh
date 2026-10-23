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
 * Design 1m, the spine. The name runs vertically up a narrow spine on the
 * left, like the spine of a book, with the number at the top.
 *
 * The title stays real, selectable text; only its inner span is rotated, so
 * the link still stretches over the whole card.
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
        'group border-border bg-card has-[a[id]:focus-visible]:outline-ring relative flex aspect-square min-h-0 gap-[5px] overflow-hidden rounded-[calc(var(--radius)+6px)] border p-[5px] transition-[border-color,box-shadow] duration-150 ease-out hover:border-[var(--border-strong,var(--border))] hover:shadow-[var(--shadow-lift,var(--shadow-md))] has-[a[id]:focus-visible]:outline-2 has-[a[id]:focus-visible]:outline-offset-2 motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      <div className='flex w-[34px] flex-none flex-col items-center justify-between overflow-hidden py-2.5'>
        {index ? (
          <span className='text-muted-foreground font-mono text-[10px] tracking-[0.08em] uppercase'>
            {index}
          </span>
        ) : (
          <span aria-hidden='true' />
        )}
        <h3 className='text-[14px] font-medium whitespace-nowrap [writing-mode:vertical-rl]'>
          <a
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            href={href}
            id={titleId}
          >
            <span className='inline-block rotate-180'>{title}</span>
          </a>
        </h3>
      </div>

      <div className='relative z-10 grid min-w-0 flex-1 place-items-center overflow-hidden rounded-[calc(var(--radius)+2px)] bg-[var(--inset,var(--muted))]'>
        {children}
      </div>
    </article>
  )
}

export { PreviewCard }
