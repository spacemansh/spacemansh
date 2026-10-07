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
 * Design 1a, tight inset. The live preview sits in a 5px inset above a
 * one-line footer with the name and an arrow, and the whole card links to
 * `href`.
 *
 * On hover the inner layer lifts and takes a stronger border and shadow,
 * while the article stays put under the pointer.
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
        'group has-[a[id]:focus-visible]:outline-ring relative aspect-square rounded-[calc(var(--radius)+6px)] has-[a[id]:focus-visible]:outline-2 has-[a[id]:focus-visible]:outline-offset-2',
        className,
      )}
      {...props}
    >
      <div className='h-full transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-0.5 motion-reduce:transition-none'>
        <div className='border-border bg-card group-hover:border-border-strong group-hover:shadow-lift flex h-full flex-col gap-1.5 rounded-[calc(var(--radius)+6px)] border p-[5px] transition-[border-color,box-shadow] duration-150 ease-out motion-reduce:transition-none'>
          <div className='border-border bg-inset relative z-10 grid min-h-0 flex-1 place-items-center overflow-hidden rounded-[calc(var(--radius)+1px)] border'>
            {children}
          </div>
          <div className='flex items-center gap-2 px-2 pt-1.5 pb-2'>
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
        </div>
      </div>
    </article>
  )
}

export { PreviewCard }
