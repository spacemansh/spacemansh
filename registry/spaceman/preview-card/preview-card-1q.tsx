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
 * Design 1q, the pill on the seam. The name sits in a pill that straddles the
 * edge between the preview and the card's foot.
 *
 * The empty well links to the item; only the preview itself sits above the
 * link, so the pill can overlap the well and still read on top of it.
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
        'group border-border bg-card has-[a[id]:focus-visible]:outline-ring hover:border-border-strong hover:shadow-lift relative flex aspect-square min-h-0 flex-col overflow-hidden rounded-[calc(var(--radius)+6px)] border p-[5px] transition-[border-color,box-shadow] duration-150 ease-out has-[a[id]:focus-visible]:outline-2 has-[a[id]:focus-visible]:outline-offset-2 motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      <div className='bg-inset grid min-h-0 flex-1 place-items-center overflow-hidden rounded-[calc(var(--radius)+2px)]'>
        <div className='relative z-10'>{children}</div>
      </div>

      <div className='-mt-[15px] flex justify-center'>
        <h3 className='border-border bg-card inline-flex h-[30px] items-center gap-2 rounded-full border px-3.5 text-[13.5px] font-medium'>
          <a
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            href={href}
            id={titleId}
          >
            {title}
          </a>
          <span
            aria-hidden='true'
            className='text-primary-ink font-mono text-[14px] font-medium'
          >
            →
          </span>
        </h3>
      </div>
      <div aria-hidden='true' className='h-3 flex-none' />
    </article>
  )
}

export { PreviewCard }
