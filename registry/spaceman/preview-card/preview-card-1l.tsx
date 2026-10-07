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
 * Design 1l, header first. The number and name sit above the preview, like a
 * document title, and the whole card links to the item.
 *
 * On hover the border firms up and a soft shadow appears.
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
        'group border-border bg-card has-[a[id]:focus-visible]:outline-ring hover:border-border-strong hover:shadow-lift relative flex aspect-square min-h-0 flex-col gap-1.5 overflow-hidden rounded-[calc(var(--radius)+6px)] border p-[5px] transition-[border-color,box-shadow] duration-150 ease-out has-[a[id]:focus-visible]:outline-2 has-[a[id]:focus-visible]:outline-offset-2 motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      <div className='flex items-center gap-2 px-2 pt-2 pb-1'>
        {index ? (
          <span className='text-muted-foreground font-mono text-[10px] tracking-[0.08em] uppercase'>
            {index}
          </span>
        ) : null}
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

      <div className='bg-inset relative z-10 grid min-h-0 flex-1 place-items-center overflow-hidden rounded-[calc(var(--radius)+2px)]'>
        {children}
      </div>
    </article>
  )
}

export { PreviewCard }
