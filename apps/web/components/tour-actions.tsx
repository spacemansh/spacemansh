import { ArrowUpRight } from 'lucide-react'
import type { ComponentProps } from 'react'

import { cn } from '@workspace/ui/lib/utils'

import './tour-actions.css'

// the solid outbound link and the outline step that share one row in the
// tour and the card carousel; the row never wraps, the step label gives way
export function ActionRow({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('mt-1 flex min-w-0 items-center gap-2', className)}
      {...props}
    />
  )
}

// the arrow starts beside the label and travels to the far end on hover, so
// the link reads as leaving the site; it turns from → to ↗ on the way
export function VisitLink({ href, name }: { href: string; name: string }) {
  return (
    <a
      className='bg-foreground text-background group relative inline-flex h-12 w-fit shrink-0 items-center overflow-hidden rounded-full ps-14 pe-6 text-sm font-medium whitespace-nowrap no-underline hover:ps-6 hover:pe-14 focus-visible:ps-6 focus-visible:pe-14 active:scale-96'
      data-visit
      href={href}
    >
      <span className='relative z-10'>
        Visit
        {/* phones keep the row short; the name stays in the accessible name */}
        <span className='max-sm:sr-only'> {name}</span>
      </span>
      <span
        aria-hidden='true'
        className='bg-background text-foreground absolute left-1 flex size-10 rotate-45 items-center justify-center rounded-full group-hover:left-full group-hover:-ml-1 group-hover:-translate-x-full group-hover:rotate-0 group-focus-visible:left-full group-focus-visible:-ml-1 group-focus-visible:-translate-x-full group-focus-visible:rotate-0'
        data-visit-icon
      >
        <ArrowUpRight className='size-4' />
      </span>
    </a>
  )
}

export function StepButton({
  children,
  ...props
}: Omit<ComponentProps<'button'>, 'className' | 'type'>) {
  return (
    <button
      className='border-border-strong text-foreground hover:bg-muted inline-flex h-12 min-w-0 cursor-pointer items-center rounded-full border bg-transparent px-5 text-sm leading-none font-medium whitespace-nowrap transition duration-150 active:scale-96'
      type='button'
      {...props}
    >
      <span className='min-w-0 truncate'>{children}</span>
    </button>
  )
}
