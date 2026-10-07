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
 * Design 2b, inset top, flat bottom. The preview keeps the 5px top and side
 * inset from 1a but ends in a flat divider, with the name, an arrow and an
 * optional description below as in 1b. The whole card links to `href`.
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
        'group border-border bg-card hover:border-border-strong hover:shadow-lift has-[a[id]:focus-visible]:outline-ring relative flex aspect-square min-h-0 flex-col overflow-hidden rounded-[calc(var(--radius)+6px)] border px-[5px] pt-[5px] transition-[border-color,box-shadow] duration-150 ease-out has-[a[id]:focus-visible]:outline-2 has-[a[id]:focus-visible]:outline-offset-2 motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      <div className='border-border bg-inset relative z-10 grid min-h-0 flex-1 place-items-center overflow-hidden rounded-t-[calc(var(--radius)+1px)] border'>
        {children}
      </div>
      <div className='flex flex-col gap-[3px] px-[9px] pt-3 pb-3.5'>
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
            className='text-primary-ink font-mono text-sm font-medium'
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
