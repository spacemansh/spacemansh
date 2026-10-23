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
 * Design 1v, dog-ear. The card's top-right corner is folded over, marking it
 * as a page you can open. The fold is a triangle painted in the page
 * background and the strong border colour, laid over the square corner.
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
        'group border-border bg-card has-[a[id]:focus-visible]:outline-ring relative flex aspect-square min-h-0 flex-col gap-1.5 rounded-[calc(var(--radius)+6px)] rounded-tr-none border p-[5px] transition-[border-color,box-shadow] duration-150 ease-out hover:border-[var(--border-strong,var(--border))] hover:shadow-[var(--shadow-lift,var(--shadow-md))] has-[a[id]:focus-visible]:outline-2 has-[a[id]:focus-visible]:outline-offset-2 motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden='true'
        className='pointer-events-none absolute -top-px -right-px z-20 size-7 rounded-bl-[calc(var(--radius)-2px)] bg-[linear-gradient(225deg,var(--background)_50%,var(--border-strong,var(--border))_50%)]'
      />

      <div className='relative z-10 grid min-h-0 flex-1 place-items-center overflow-hidden rounded-[calc(var(--radius)+2px)] rounded-tr-none bg-[var(--inset,var(--muted))]'>
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
          className='font-mono text-[14px] font-medium text-[color:var(--primary-ink,var(--foreground))]'
        >
          →
        </span>
      </div>
    </article>
  )
}

export { PreviewCard }
