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
 * Design 1z, no card. There is no card container: a rounded preview tile with
 * the linked title set beneath it, like an app icon.
 *
 * On hover the tile's border darkens and it gains a soft lift shadow.
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
        'group has-[a[id]:focus-visible]:outline-ring relative flex aspect-square min-h-0 flex-col gap-2.5 rounded-[calc(var(--radius)+10px)] has-[a[id]:focus-visible]:outline-2 has-[a[id]:focus-visible]:outline-offset-2',
        className,
      )}
      {...props}
    >
      <div className='border-border relative z-10 grid min-h-0 flex-1 place-items-center overflow-hidden rounded-[calc(var(--radius)+10px)] border bg-[var(--inset,var(--muted))] transition-[border-color,box-shadow] duration-150 ease-out group-hover:border-[var(--border-strong,var(--border))] group-hover:shadow-[var(--shadow-lift,var(--shadow-md))] motion-reduce:transition-none'>
        {children}
      </div>

      <div className='flex items-center gap-2 px-1'>
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
