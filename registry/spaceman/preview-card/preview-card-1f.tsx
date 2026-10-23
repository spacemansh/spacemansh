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
  /** The registry slug, such as "theme-picker". */
  slug?: string
  /** The live, interactive preview. */
  children: React.ReactNode
}

/**
 * Design 1f, ticket stub. A dashed tear line with a notch cut into each side
 * separates the preview from a stub with the name and the optional install
 * slug. The whole card links to `href`.
 *
 * On hover the border strengthens and the card takes a soft lift shadow.
 */
function PreviewCard({
  title,
  href,
  slug,
  children,
  className,
  ...props
}: PreviewCardProps) {
  const titleId = useId()

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        'group border-border bg-card has-[a[id]:focus-visible]:outline-ring relative flex aspect-square min-h-0 flex-col overflow-hidden rounded-[calc(var(--radius)+6px)] border p-[5px] transition-[border-color,box-shadow] duration-150 ease-out hover:border-[var(--border-strong,var(--border))] hover:shadow-[var(--shadow-lift,var(--shadow-md))] has-[a[id]:focus-visible]:outline-2 has-[a[id]:focus-visible]:outline-offset-2 motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      <div className='relative z-10 grid min-h-0 flex-1 place-items-center overflow-hidden rounded-[calc(var(--radius)+1px)] bg-[var(--inset,var(--muted))]'>
        {children}
      </div>
      <div
        aria-hidden='true'
        className='pointer-events-none relative my-[9px] h-0 border-t border-dashed border-[var(--border-strong,var(--border))]'
      >
        <span className='border-border bg-background absolute -top-2 -left-[17px] size-4 rounded-full border' />
        <span className='border-border bg-background absolute -top-2 -right-[17px] size-4 rounded-full border' />
      </div>
      <div className='flex items-center gap-2 px-2 pb-1.5'>
        <h3 className='mr-auto text-[15px] font-medium'>
          <a
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            href={href}
            id={titleId}
          >
            {title}
          </a>
        </h3>
        {slug ? (
          <span className='text-muted-foreground font-mono text-[10px] tracking-[0.08em] uppercase'>
            @spaceman/{slug}
          </span>
        ) : null}
      </div>
    </article>
  )
}

export { PreviewCard }
