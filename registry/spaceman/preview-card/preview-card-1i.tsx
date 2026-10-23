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
  /** How many variants the item has, shown as "3 variants". */
  variants?: number
  /** The live, interactive preview. */
  children: React.ReactNode
}

/**
 * Design 1i, stacked variants. Two faint card edges peek out below the card,
 * hinting that there are more variants inside; the whole card links to the item.
 *
 * On hover the card lifts and the edges behind it fan out a little, while the
 * article itself stays still under the pointer.
 */
function PreviewCard({
  title,
  href,
  variants,
  children,
  className,
  ...props
}: PreviewCardProps) {
  const titleId = useId()

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        'group has-[a[id]:focus-visible]:outline-ring relative aspect-square min-h-0 rounded-[calc(var(--radius)+6px)] pb-2.5 has-[a[id]:focus-visible]:outline-2 has-[a[id]:focus-visible]:outline-offset-2',
        className,
      )}
      {...props}
    >
      <div
        aria-hidden='true'
        className='border-border pointer-events-none absolute inset-x-4 bottom-0 h-5 rounded-b-[calc(var(--radius)+4px)] border bg-[var(--inset,var(--muted))] transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-y-0.5 motion-reduce:transition-none'
      />
      <div
        aria-hidden='true'
        className='border-border bg-input pointer-events-none absolute inset-x-2 bottom-[5px] h-5 rounded-b-[calc(var(--radius)+5px)] border transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-y-px motion-reduce:transition-none'
      />

      <div className='relative h-full transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-0.5 motion-reduce:transition-none'>
        <div className='border-border bg-card flex h-full flex-col gap-1.5 rounded-[calc(var(--radius)+6px)] border p-[5px] transition-[border-color] duration-150 ease-out group-hover:border-[var(--border-strong,var(--border))] motion-reduce:transition-none'>
          <div className='relative z-10 grid min-h-0 flex-1 place-items-center overflow-hidden rounded-[calc(var(--radius)+2px)] bg-[var(--inset,var(--muted))]'>
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
            {variants === undefined ? null : (
              <span className='text-muted-foreground font-mono text-[10px] tracking-[0.08em] uppercase'>
                {`${variants} variants`}
              </span>
            )}
            <span
              aria-hidden='true'
              className='font-mono text-[14px] font-medium text-[color:var(--primary-ink,var(--foreground))]'
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
