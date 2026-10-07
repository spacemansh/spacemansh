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
 * Design 1t, keycap. A raised card with a hard bottom edge, like a key on a
 * keyboard, holding a live preview above the linked title.
 *
 * On hover the key presses down: the inner layer moves down as the hard edge
 * shrinks by the same amount, so the bottom of the key stays put.
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
        'group has-[a[id]:focus-visible]:outline-ring relative aspect-square min-h-0 rounded-[calc(var(--radius)+6px)] has-[a[id]:focus-visible]:outline-2 has-[a[id]:focus-visible]:outline-offset-2',
        className,
      )}
      {...props}
    >
      <div className='border-border-strong bg-card flex h-full min-h-0 flex-col gap-1.5 rounded-[calc(var(--radius)+6px)] border p-[5px] shadow-[0_4px_0_0_var(--border-strong)] transition-[translate,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-y-0.5 group-hover:shadow-[0_2px_0_0_var(--border-strong)] motion-reduce:transition-none'>
        <div className='bg-inset relative z-10 grid min-h-0 flex-1 place-items-center overflow-hidden rounded-[calc(var(--radius)+2px)]'>
          {children}
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
            className='text-primary-ink font-mono text-[14px] font-medium'
          >
            →
          </span>
        </div>
      </div>
    </article>
  )
}

export { PreviewCard }
