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
  /** A short index such as "01". */
  index?: string
  /** One line about the item. */
  description?: string
  /** The live, interactive preview. */
  children: React.ReactNode
}

/**
 * Design 1e, index card. An optional mono category and index sit above a
 * dotted preview, with the name and an optional description below. The whole
 * card links to `href`.
 *
 * On hover the border strengthens and the card takes a soft lift shadow.
 */
function PreviewCard({
  title,
  href,
  category,
  index,
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
        'group border-border bg-card has-[a[id]:focus-visible]:outline-ring relative flex aspect-square min-h-0 flex-col gap-2 overflow-hidden rounded-[calc(var(--radius)+4px)] border p-2 pb-3 transition-[border-color,box-shadow] duration-150 ease-out hover:border-[var(--border-strong,var(--border))] hover:shadow-[var(--shadow-lift,var(--shadow-md))] has-[a[id]:focus-visible]:outline-2 has-[a[id]:focus-visible]:outline-offset-2 motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      {category || index ? (
        <div className='text-muted-foreground flex justify-between px-1 font-mono text-[10px] tracking-[0.08em] uppercase'>
          {category ? <span>{category}</span> : null}
          {index ? <span className='ml-auto'>{index}</span> : null}
        </div>
      ) : null}
      <div className='border-border relative z-10 grid min-h-0 flex-1 place-items-center overflow-hidden rounded-[calc(var(--radius)-4px)] border bg-[var(--inset,var(--muted))] bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[12px_12px]'>
        {children}
      </div>
      <div className='flex flex-col gap-0.5 px-1 pt-1'>
        <h3 className='text-[15px] font-medium'>
          <a
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            href={href}
            id={titleId}
          >
            {title}
          </a>
        </h3>
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
