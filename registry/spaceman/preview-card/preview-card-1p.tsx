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
 * Design 1p, the outline. The card has no fill, only a hairline border and a
 * dashed frame around the preview.
 *
 * On hover the card fills with the card surface and its border firms up; the
 * whole card links to the item.
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
        'group border-border has-[a[id]:focus-visible]:outline-ring hover:border-border-strong hover:bg-card relative flex aspect-square min-h-0 flex-col gap-1.5 rounded-[calc(var(--radius)+6px)] border p-[5px] transition-[background-color,border-color] duration-150 ease-out has-[a[id]:focus-visible]:outline-2 has-[a[id]:focus-visible]:outline-offset-2 motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      <div className='border-border-strong relative z-10 grid min-h-0 flex-1 place-items-center overflow-hidden rounded-[calc(var(--radius)+2px)] border border-dashed'>
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
    </article>
  )
}

export { PreviewCard }
