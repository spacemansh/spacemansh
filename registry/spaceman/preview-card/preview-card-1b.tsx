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
  /** One line about the item. */
  description?: string
  /** The live, interactive preview. */
  children: React.ReactNode
}

/**
 * Design 1b, flush preview. The preview runs edge to edge, and a divider
 * separates it from a footer with the name, an arrow and an optional
 * description. The whole card links to `href`.
 *
 * On hover the border strengthens and the card takes a soft lift shadow.
 */
function PreviewCard({
  title,
  href,
  description,
  children,
  className,
  ...props
}: PreviewCardProps) {
  const titleId = useId()

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        'group border-border bg-card has-[a[id]:focus-visible]:outline-ring relative flex aspect-square flex-col overflow-hidden rounded-[calc(var(--radius)+6px)] border transition-[border-color,box-shadow] duration-150 ease-out hover:border-[var(--border-strong,var(--border))] hover:shadow-[var(--shadow-lift,var(--shadow-md))] has-[a[id]:focus-visible]:outline-2 has-[a[id]:focus-visible]:outline-offset-2 motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      <div className='border-border relative z-10 grid min-h-0 flex-1 place-items-center overflow-hidden border-b bg-[var(--inset,var(--muted))]'>
        {children}
      </div>
      <div className='flex flex-col gap-[3px] px-3.5 pt-3 pb-3.5'>
        <div className='flex items-center gap-2'>
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
        {description ? (
          <p className='text-muted-foreground text-[12.5px]/[1.5]'>
            {description}
          </p>
        ) : null}
      </div>
    </article>
  )
}

export { PreviewCard }
