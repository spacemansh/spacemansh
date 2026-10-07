'use client'

import { Check, Copy } from 'lucide-react'
import type * as React from 'react'
import { useRef, useState } from 'react'

import { cn } from '@/lib/utils'

type CopyButtonProps = Omit<React.ComponentProps<'button'>, 'value'> & {
  value: string
  label?: string
}

/**
 * Copies `value` and confirms with a check that cross-fades in place of the
 * copy icon. Both icons stay mounted so the swap can animate either way, and
 * a polite live region announces the copy to screen readers.
 */
function CopyButton({
  value,
  label = 'Copy install command',
  className,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number>(undefined)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      return
    }

    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1600)
  }

  const icon =
    'col-start-1 row-start-1 size-3.5 transition-[opacity,scale,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)]'

  return (
    <button
      aria-label={label}
      className={cn(
        'group/copy grid cursor-pointer place-items-center transition-[transform,color,background-color] duration-150 ease-out active:scale-[0.96] motion-reduce:transition-none',
        className,
      )}
      data-copied={copied || undefined}
      onClick={copy}
      title={label}
      type='button'
      {...props}
    >
      <Copy
        aria-hidden='true'
        className={cn(
          icon,
          'group-data-copied/copy:scale-25 group-data-copied/copy:opacity-0 group-data-copied/copy:blur-[4px]',
        )}
      />
      <Check
        aria-hidden='true'
        className={cn(
          icon,
          'scale-25 opacity-0 blur-[4px] group-data-copied/copy:scale-100 group-data-copied/copy:opacity-100 group-data-copied/copy:blur-none',
        )}
      />
      <span aria-live='polite' className='sr-only'>
        {copied ? 'Copied' : ''}
      </span>
    </button>
  )
}

export { CopyButton }
