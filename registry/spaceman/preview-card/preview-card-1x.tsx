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
 * Design 1x, notch label. The preview fills the card and the title sits in a
 * notch cut into its bottom-left corner, with no separate footer.
 *
 * On hover the border darkens and the card gains a soft lift shadow.
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
        'group border-border bg-card has-[a[id]:focus-visible]:outline-ring relative aspect-square min-h-0 overflow-hidden rounded-[calc(var(--radius)+6px)] border p-[5px] transition-[border-color,box-shadow] duration-150 ease-out hover:border-[var(--border-strong,var(--border))] hover:shadow-[var(--shadow-lift,var(--shadow-md))] has-[a[id]:focus-visible]:outline-2 has-[a[id]:focus-visible]:outline-offset-2 motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      <div className='grid h-full min-h-0 rounded-[calc(var(--radius)+2px)] bg-[var(--inset,var(--muted))]'>
        <div className='relative z-10 col-start-1 row-start-1 place-self-center'>
          {children}
        </div>

        <div className='bg-card col-start-1 row-start-1 -mb-px -ml-px flex items-center gap-2 self-end justify-self-start rounded-tr-[calc(var(--radius)+4px)] pt-[9px] pr-3.5 pb-1.5 pl-[9px]'>
          <h3 className='text-[15px] font-medium'>
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
            className='font-mono text-[14px] font-medium text-[color:var(--primary-ink,var(--foreground))]'
          >
            →
          </span>
        </div>
      </div>
    </article>
  )
}

export { PreviewCard }
