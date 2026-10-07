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
  /** The registry slug, such as "theme-picker". */
  slug?: string
  /** A category such as "Themes". */
  category?: string
  /** The live, interactive preview. */
  children: React.ReactNode
}

/**
 * Design 1h, crop marks. Printer's registration marks sit in the top corners,
 * and a mono spec line along the base holds the optional index, the slug and
 * the optional category. The whole card links to `href`.
 *
 * The spec line shows the slug when given, and the link keeps the title as
 * its name. On hover the border darkens to the foreground colour.
 */
function PreviewCard({
  title,
  href,
  index,
  slug,
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
        'group border-border bg-card hover:border-foreground has-[a[id]:focus-visible]:outline-ring relative flex aspect-square min-h-0 flex-col overflow-hidden rounded-[calc(var(--radius)-4px)] border p-3.5 transition-[border-color] duration-150 ease-out has-[a[id]:focus-visible]:outline-2 has-[a[id]:focus-visible]:outline-offset-2 motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden='true'
        className='border-muted-foreground pointer-events-none absolute top-2 left-2 size-2.5 border-t border-l'
      />
      <span
        aria-hidden='true'
        className='border-muted-foreground pointer-events-none absolute top-2 right-2 size-2.5 border-t border-r'
      />
      <div className='relative z-10 grid min-h-0 flex-1 place-items-center'>
        {children}
      </div>
      <div className='border-border flex items-baseline gap-2.5 border-t pt-2.5'>
        {index ? (
          <span className='text-muted-foreground font-mono text-[10px] tracking-[0.08em] uppercase'>
            {index}
          </span>
        ) : null}
        <h3
          className={cn(
            'min-w-0 flex-1 text-sm font-medium',
            slug && 'font-mono tracking-[-0.01em]',
          )}
        >
          <a
            aria-label={slug ? `${title}, ${slug}` : undefined}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            href={href}
            id={titleId}
          >
            {slug ?? title}
          </a>
        </h3>
        {category ? (
          <span className='text-muted-foreground font-mono text-[10px] tracking-[0.08em] uppercase'>
            {category}
          </span>
        ) : null}
      </div>
    </article>
  )
}

export { PreviewCard }
