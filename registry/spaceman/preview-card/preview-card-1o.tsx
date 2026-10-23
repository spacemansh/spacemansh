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
  /** A short index such as "01", set large behind the preview. */
  index?: string
  /** The live, interactive preview. */
  children: React.ReactNode
}

/**
 * Design 1o, the big numeral. An oversized index sits faintly behind the
 * preview, cropped by the well's bottom-right corner.
 *
 * The numeral is decoration only; the whole card links to the item.
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
        'group border-border bg-card has-[a[id]:focus-visible]:outline-ring relative flex aspect-square min-h-0 flex-col gap-1.5 overflow-hidden rounded-[calc(var(--radius)+6px)] border p-[5px] transition-[border-color,box-shadow] duration-150 ease-out hover:border-[var(--border-strong,var(--border))] hover:shadow-[var(--shadow-lift,var(--shadow-md))] has-[a[id]:focus-visible]:outline-2 has-[a[id]:focus-visible]:outline-offset-2 motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      <div className='relative z-10 grid min-h-0 flex-1 place-items-center overflow-hidden rounded-[calc(var(--radius)+2px)] bg-[var(--inset,var(--muted))]'>
        {index ? (
          <span
            aria-hidden='true'
            className='text-border pointer-events-none absolute -right-1.5 -bottom-[34px] font-mono text-[150px] leading-none font-semibold tracking-[-0.06em] select-none'
          >
            {index}
          </span>
        ) : null}
        <div className='relative'>{children}</div>
      </div>

      <div className='flex items-center px-2 pt-1.5 pb-2'>
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
          className='font-mono text-[14px] font-medium text-[color:var(--primary-ink,var(--foreground))]'
        >
          →
        </span>
      </div>
    </article>
  )
}

export { PreviewCard }
