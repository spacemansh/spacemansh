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
 * Design 3v, dog-ear, clear fold. The dog-ear card with its corner cut away,
 * and the preview clipped back from the fold so nothing shows under the
 * folded corner.
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
        'group has-[a[id]:focus-visible]:outline-ring relative aspect-square min-h-0 rounded-[calc(var(--radius)+6px)] rounded-tr-none transition-shadow duration-150 ease-out hover:shadow-[var(--shadow-lift,var(--shadow-md))] has-[a[id]:focus-visible]:outline-2 has-[a[id]:focus-visible]:outline-offset-2 motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      <div className='border-border bg-card relative flex h-full min-h-0 flex-col gap-1.5 rounded-[calc(var(--radius)+6px)] rounded-tr-none border p-[5px] transition-[border-color] duration-150 ease-out [clip-path:polygon(0_0,calc(100%_-_28px)_0,100%_28px,100%_100%,0_100%)] group-hover:border-[var(--border-strong,var(--border))] motion-reduce:transition-none'>
        <span
          aria-hidden='true'
          className='pointer-events-none absolute -top-px -right-px z-20 size-7 rounded-bl-[calc(var(--radius)-2px)] bg-[linear-gradient(225deg,transparent_50%,var(--border-strong,var(--border))_50%)]'
        />

        <div className='relative z-10 grid min-h-0 flex-1 place-items-center overflow-hidden rounded-[calc(var(--radius)+2px)] bg-[var(--inset,var(--muted))] [clip-path:polygon(0_0,calc(100%_-_30px)_0,100%_30px,100%_100%,0_100%)]'>
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
      </div>
    </article>
  )
}

export { PreviewCard }
