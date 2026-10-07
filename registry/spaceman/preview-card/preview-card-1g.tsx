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
 * Design 1g, folder tab. The name and an optional index sit on a tab that
 * rises out of the card body, and nothing sits below the preview. The whole
 * card links to `href`.
 *
 * On hover the inner column lifts rather than the hovered element, so the
 * card never slides out from under the pointer.
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
        'group has-[a[id]:focus-visible]:outline-ring relative flex aspect-square min-h-0 flex-col rounded-[calc(var(--radius)+4px)] has-[a[id]:focus-visible]:outline-2 has-[a[id]:focus-visible]:outline-offset-2',
        className,
      )}
      {...props}
    >
      <div className='flex h-full min-h-0 flex-col transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-0.5 motion-reduce:transition-none'>
        <div className='border-border bg-card flex h-[34px] items-center gap-2.5 self-start rounded-t-[calc(var(--radius)+2px)] border border-b-0 px-3.5'>
          <h3 className='text-[13.5px] font-medium whitespace-nowrap'>
            <a
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
              href={href}
              id={titleId}
            >
              {title}
            </a>
          </h3>
          {index ? (
            <span className='text-muted-foreground font-mono text-[10px] tracking-[0.08em] uppercase'>
              {index}
            </span>
          ) : null}
        </div>
        <div className='border-border bg-card relative -mt-px min-h-0 flex-1 rounded-[calc(var(--radius)+4px)] rounded-tl-none border p-[5px]'>
          <div className='bg-inset relative z-10 grid h-full place-items-center overflow-hidden rounded-[calc(var(--radius)-1px)]'>
            {children}
          </div>
          <span
            aria-hidden='true'
            className='text-primary-ink pointer-events-none absolute right-3.5 bottom-3 z-20 font-mono text-sm font-medium'
          >
            →
          </span>
        </div>
      </div>
    </article>
  )
}

export { PreviewCard }
