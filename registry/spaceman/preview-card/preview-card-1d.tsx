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
  /** A category such as "Themes". */
  category?: string
  /** The live, interactive preview. */
  children: React.ReactNode
}

/**
 * Design 1d, floating footer. The card is a single inset surface, and the
 * footer is a bar inset at its base with the name, an optional category and
 * an arrow. The whole card links to `href`.
 *
 * On hover the border strengthens and the card takes a soft lift shadow.
 */
function PreviewCard({
  title,
  href,
  category,
  children,
  className,
  ...props
}: PreviewCardProps) {
  const titleId = useId()

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        'group border-border bg-inset hover:border-border-strong hover:shadow-lift has-[a[id]:focus-visible]:outline-ring relative flex aspect-square flex-col gap-2 rounded-[calc(var(--radius)+8px)] border p-1.5 transition-[border-color,box-shadow] duration-150 ease-out has-[a[id]:focus-visible]:outline-2 has-[a[id]:focus-visible]:outline-offset-2 motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      <div className='relative z-10 grid min-h-0 flex-1 place-items-center overflow-hidden rounded-[calc(var(--radius)+2px)]'>
        {children}
      </div>
      <div className='border-border bg-card flex items-center gap-2 rounded-[calc(var(--radius)+2px)] border px-3 py-2.5'>
        <h3 className='mr-auto text-sm font-medium'>
          <a
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            href={href}
            id={titleId}
          >
            {title}
          </a>
        </h3>
        {category ? (
          <span className='text-muted-foreground font-mono text-[11px]'>
            {category}
          </span>
        ) : null}
        <span
          aria-hidden='true'
          className='text-primary-ink font-mono text-sm font-medium'
        >
          →
        </span>
      </div>
    </article>
  )
}

export { PreviewCard }
