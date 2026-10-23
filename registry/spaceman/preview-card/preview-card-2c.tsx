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
 * Design 2c, split panels. Two stacked panels sit in a 5px inset with a 6px
 * gap: the preview has a flat bottom, and the footer below it has a flat top
 * and holds the name and an arrow. The whole card links to `href`.
 *
 * On hover the border strengthens and the card takes a soft lift shadow.
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
        'group border-border bg-card has-[a[id]:focus-visible]:outline-ring relative flex aspect-square min-h-0 flex-col gap-1.5 overflow-hidden rounded-[calc(var(--radius)+6px)] border p-[5px] transition-[border-color,box-shadow] duration-150 ease-out hover:border-[var(--border-strong,var(--border))] hover:shadow-[var(--shadow-lift,var(--shadow-md))] has-[a[id]:focus-visible]:outline-2 has-[a[id]:focus-visible]:outline-offset-2 motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      <div className='border-border relative z-10 grid min-h-0 flex-1 place-items-center overflow-hidden rounded-t-[calc(var(--radius)+1px)] border bg-[var(--inset,var(--muted))]'>
        {children}
      </div>
      <div className='border-border bg-input flex items-center gap-2 rounded-b-[calc(var(--radius)+1px)] border px-2.5 py-[9px]'>
        <h3 className='mr-auto text-[15px] font-medium'>
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
          className='font-mono text-sm font-medium text-[color:var(--primary-ink,var(--foreground))]'
        >
          →
        </span>
      </div>
    </article>
  )
}

export { PreviewCard }
