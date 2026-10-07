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
  /** The registry slug, such as "theme-picker". */
  slug?: string
  /** The live, interactive preview. */
  children: React.ReactNode
}

/**
 * Design 1s, side meta. The preview takes the top; below a hairline, the name
 * and package name sit on the left and the arrow has its own cell on the right.
 *
 * The whole card links to the item; on hover the border firms up and a soft
 * shadow appears.
 */
function PreviewCard({
  title,
  href,
  slug,
  children,
  className,
  ...props
}: PreviewCardProps) {
  const titleId = useId()

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        'group border-border bg-card has-[a[id]:focus-visible]:outline-ring hover:border-border-strong hover:shadow-lift relative flex aspect-square min-h-0 flex-col overflow-hidden rounded-[calc(var(--radius)+6px)] border px-[5px] pt-[5px] transition-[border-color,box-shadow] duration-150 ease-out has-[a[id]:focus-visible]:outline-2 has-[a[id]:focus-visible]:outline-offset-2 motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      <div className='bg-inset relative z-10 grid min-h-0 flex-1 place-items-center overflow-hidden rounded-[calc(var(--radius)+2px)]'>
        {children}
      </div>

      <div className='border-border mt-[5px] grid grid-cols-[1fr_auto] items-stretch border-t'>
        <div className='flex min-w-0 flex-col gap-px px-2 py-[9px]'>
          <h3 className='text-[14px] font-medium'>
            <a
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
              href={href}
              id={titleId}
            >
              {title}
            </a>
          </h3>
          {slug ? (
            <span className='text-muted-foreground font-mono text-[11px]'>
              {`@spaceman/${slug}`}
            </span>
          ) : null}
        </div>
        <div className='border-border grid w-[52px] place-items-center border-l'>
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
