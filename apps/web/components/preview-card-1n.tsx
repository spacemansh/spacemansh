import type * as React from 'react'
import { useId } from 'react'

import { cn } from '@workspace/ui/lib/utils'

type PreviewCardProps = Omit<
  React.ComponentProps<'article'>,
  'children' | 'title'
> & {
  title: string

  href: string

  slug?: string

  children: React.ReactNode
}

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
        'group border-border bg-card has-[a[id]:focus-visible]:outline-ring relative flex aspect-square min-h-0 flex-col overflow-hidden rounded-[calc(var(--radius)+6px)] border transition-[border-color,box-shadow] duration-150 ease-out hover:border-[var(--border-strong,var(--border))] hover:shadow-[var(--shadow-lift,var(--shadow-md))] has-[a[id]:focus-visible]:outline-2 has-[a[id]:focus-visible]:outline-offset-2 motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      <div className='border-border flex h-[34px] flex-none items-center gap-1.5 border-b px-3'>
        <span
          aria-hidden='true'
          className='pointer-events-none flex items-center gap-1.5'
        >
          <span className='size-[9px] rounded-full bg-[var(--border-strong,var(--border))]' />
          <span className='size-[9px] rounded-full bg-[var(--border-strong,var(--border))]' />
          <span className='size-[9px] rounded-full bg-[var(--border-strong,var(--border))]' />
        </span>
        {slug ? (
          <span className='text-muted-foreground mx-auto font-mono text-[11.5px]'>
            {`${slug}.tsx`}
          </span>
        ) : null}
      </div>

      <div className='relative z-10 grid min-h-0 flex-1 place-items-center overflow-hidden bg-[var(--inset,var(--muted))]'>
        {children}
      </div>

      <div className='flex items-center px-3.5 py-2.5'>
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
