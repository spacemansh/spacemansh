import { Eye } from 'lucide-react'
import type * as React from 'react'
import { useId } from 'react'

import { cn } from '@/lib/utils'
import { CopyButton } from '@/registry/spaceman/copy-button/copy-button'

type PreviewCardProps = Omit<
  React.ComponentProps<'article'>,
  'children' | 'title'
> & {
  /** The item's display name, shown on the tab. */
  title: string
  /** A short index shown beside the title, such as "01". */
  index?: string
  /** Where the view action goes, such as the item's docs page. */
  href?: string
  /** The command the copy action puts on the clipboard. */
  installCommand?: string
  /** `soon` renders a muted, hatched placeholder with no actions. */
  status?: 'live' | 'soon'
  /** The live, interactive preview shown inside the card. */
  children?: React.ReactNode
}

/**
 * Design 2g, the tinted folder tab. The title sits on a tab that tucks behind
 * the card body; the body holds a live preview and a copy and view action.
 *
 * On hover the inner column lifts rather than the hovered element, so the
 * card never slides out from under the pointer.
 */
function PreviewCard({
  title,
  index,
  href,
  installCommand,
  status = 'live',
  children,
  className,
  ...props
}: PreviewCardProps) {
  const titleId = useId()

  if (status === 'soon') {
    return (
      <article
        aria-label={`${title}, coming soon`}
        className={cn(
          'flex aspect-square min-h-0 flex-col select-none',
          className,
        )}
        {...props}
      >
        <div className='bg-muted text-muted-foreground -mb-2.5 flex h-[34px] items-center gap-2.5 self-start rounded-t-[calc(var(--radius)+2px)] px-3.5 pb-2.5'>
          <h3 className='text-[13.5px] font-medium whitespace-nowrap'>
            {title}
          </h3>
          <span className='font-mono text-[10px] tracking-[0.08em] uppercase'>
            Soon
          </span>
        </div>
        <div className='border-border-strong bg-background min-h-0 flex-1 rounded-[calc(var(--radius)+4px)] border border-dashed p-[5px]'>
          <div className='grid h-full place-items-center rounded-[calc(var(--radius)-1px)] bg-[repeating-linear-gradient(45deg,color-mix(in_oklch,var(--muted)_60%,var(--background))_0_8px,var(--background)_8px_16px)]'>
            {children ?? (
              <span className='text-muted-foreground font-mono text-[11px] lowercase'>
                {title}
              </span>
            )}
          </div>
        </div>
      </article>
    )
  }

  return (
    <article
      aria-labelledby={titleId}
      className={cn('group flex aspect-square min-h-0 flex-col', className)}
      {...props}
    >
      <div className='flex h-full min-h-0 flex-col transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-0.5 motion-reduce:transition-none'>
        <div className='bg-tag text-tag-foreground -mb-2.5 flex h-[34px] items-center gap-2.5 self-start rounded-t-[calc(var(--radius)+2px)] px-3.5 pb-2.5'>
          <h3
            className='text-[13.5px] font-medium whitespace-nowrap'
            id={titleId}
          >
            {title}
          </h3>
          {index ? (
            <span className='font-mono text-[10px] tracking-[0.08em]'>
              {index}
            </span>
          ) : null}
        </div>

        <div className='border-border bg-card group-hover:border-border-strong group-hover:shadow-lift relative min-h-0 flex-1 rounded-[calc(var(--radius)+4px)] border p-[5px] transition-[border-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]'>
          <div className='bg-inset grid h-full place-items-center overflow-hidden rounded-[calc(var(--radius)-1px)]'>
            {children}
          </div>

          {installCommand || href ? (
            <div className='border-border bg-card absolute right-2.5 bottom-2.5 flex items-center gap-0.5 rounded-[calc(var(--radius)+1px)] border p-0.5'>
              {installCommand ? (
                <CopyButton
                  className='text-primary-ink hover:bg-muted size-[30px] rounded-[calc(var(--radius)-1px)]'
                  label={`Copy ${title} install command`}
                  value={installCommand}
                />
              ) : null}
              {href ? (
                <a
                  aria-label={`View ${title}`}
                  className='text-primary-ink hover:bg-muted grid size-[30px] place-items-center rounded-[calc(var(--radius)-1px)] transition-[transform,background-color] duration-150 ease-out active:scale-[0.96] motion-reduce:transition-none'
                  href={href}
                  title={`View ${title}`}
                >
                  <Eye aria-hidden='true' className='size-4' />
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export { PreviewCard }
