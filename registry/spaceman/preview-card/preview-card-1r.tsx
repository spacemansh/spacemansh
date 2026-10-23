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
 * Design 1r, the passe-partout. A square mat frames the preview inside the
 * card, like a framed print, with a small spaced caption below.
 *
 * The whole card links to the item; on hover the border firms up and a soft
 * shadow appears.
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
        'group border-border bg-card has-[a[id]:focus-visible]:outline-ring relative flex aspect-square min-h-0 flex-col gap-2.5 overflow-hidden rounded-[calc(var(--radius)-2px)] border px-3.5 pt-3.5 pb-3 transition-[border-color,box-shadow] duration-150 ease-out hover:border-[var(--border-strong,var(--border))] hover:shadow-[var(--shadow-lift,var(--shadow-md))] has-[a[id]:focus-visible]:outline-2 has-[a[id]:focus-visible]:outline-offset-2 motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      <div className='border-border relative z-10 min-h-0 flex-1 border p-[5px]'>
        <div className='grid h-full place-items-center overflow-hidden bg-[var(--inset,var(--muted))]'>
          {children}
        </div>
      </div>

      <h3 className='text-center font-mono text-[11px] font-medium tracking-[0.14em] uppercase'>
        <a
          className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          href={href}
          id={titleId}
        >
          {title}
        </a>
      </h3>
    </article>
  )
}

export { PreviewCard }
