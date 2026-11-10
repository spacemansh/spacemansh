import type * as React from 'react'
import { useId } from 'react'

import { cn } from '@workspace/ui/lib/utils'

type PreviewCardProps = Omit<
  React.ComponentProps<'article'>,
  'children' | 'title'
> & {
  title: string

  href: string

  index?: string

  slug?: string

  children: React.ReactNode
}

function PreviewCard({
  title,
  href,
  index,
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
        'group border-border bg-card has-[a[id]:focus-visible]:outline-ring relative flex aspect-square min-h-0 flex-col overflow-hidden rounded-[calc(var(--radius)-4px)] border px-2.5 pt-2.5 shadow-xs transition-[border-color,box-shadow] duration-150 ease-out hover:border-[var(--border-strong,var(--border))] hover:shadow-[var(--shadow-lift,var(--shadow-md))] has-[a[id]:focus-visible]:outline-2 has-[a[id]:focus-visible]:outline-offset-2 motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      <div className='relative z-10 grid min-h-0 flex-1 place-items-center overflow-hidden bg-[var(--inset,var(--muted))]'>
        {children}
      </div>

      <div className='flex h-[58px] shrink-0 items-center justify-between gap-2 px-1'>
        <h3
          className={cn(
            'min-w-0 truncate text-[13px] font-medium',
            slug && 'font-mono',
          )}
        >
          <a
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            href={href}
            id={titleId}
          >
            {slug ? (
              <>
                <span className='sr-only'>{title}, </span>
                {slug}
              </>
            ) : (
              title
            )}
          </a>
        </h3>
        {index ? (
          <span className='text-muted-foreground font-mono text-[10px] tracking-[0.08em] uppercase'>
            {index}
          </span>
        ) : null}
      </div>
    </article>
  )
}

export { PreviewCard }
