import type * as React from 'react'
import { useId } from 'react'

import { cn } from '@/lib/utils'
import { CopyButton } from '@/registry/spaceman/copy-button/copy-button'

type PreviewCardProps = Omit<
  React.ComponentProps<'article'>,
  'children' | 'title'
> & {
  /** The item's display name. */
  title: string
  /** Where the card links, such as the item's docs page. */
  href?: string
  /** The command the copy action copies. */
  installCommand: string
  /** The live, interactive preview. */
  children: React.ReactNode
}

/**
 * Design 1c, install footer. The name sits in the corner of a tight-inset
 * preview, and the footer shows the install command with a copy action.
 *
 * With `href` the whole card links there, while the preview and the copy
 * action stay clickable above the link. On hover the border strengthens and
 * the card takes a soft lift shadow.
 */
function PreviewCard({
  title,
  href,
  installCommand,
  children,
  className,
  ...props
}: PreviewCardProps) {
  const titleId = useId()

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        'group border-border bg-card has-[a[id]:focus-visible]:outline-ring relative flex aspect-square flex-col gap-1.5 rounded-[calc(var(--radius)+6px)] border p-[5px] transition-[border-color,box-shadow] duration-150 ease-out hover:border-[var(--border-strong,var(--border))] hover:shadow-[var(--shadow-lift,var(--shadow-md))] has-[a[id]:focus-visible]:outline-2 has-[a[id]:focus-visible]:outline-offset-2 motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      <div className='grid min-h-0 flex-1 overflow-hidden rounded-[calc(var(--radius)+1px)] bg-[var(--inset,var(--muted))]'>
        <h3
          className='col-start-1 row-start-1 mt-2.5 ml-3 self-start justify-self-start text-[13px] font-medium'
          id={href ? undefined : titleId}
        >
          {href ? (
            <a
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
              href={href}
              id={titleId}
            >
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
        {/* Empty preview space passes clicks through to the card link; the
            preview's own elements take them. */}
        <div className='pointer-events-none relative z-10 col-start-1 row-start-1 grid place-items-center *:pointer-events-auto'>
          {children}
        </div>
      </div>
      <div className='border-border bg-input flex h-8.5 items-center gap-2 rounded-[calc(var(--radius)+1px)] border pr-1.5 pl-2.5'>
        <code className='text-muted-foreground min-w-0 flex-1 truncate font-mono text-[11.5px]'>
          <span aria-hidden='true'>$ </span>
          {installCommand}
        </code>
        <CopyButton
          className='bg-muted text-muted-foreground hover:text-foreground relative z-10 h-[22px] w-7 rounded-[calc(var(--radius)-5px)] hover:bg-[var(--muted-strong,var(--muted))]'
          label={`Copy ${title} install command`}
          value={installCommand}
        />
      </div>
    </article>
  )
}

export { PreviewCard }
