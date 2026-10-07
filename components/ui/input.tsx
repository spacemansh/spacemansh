import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        'bg-input placeholder:text-muted-foreground/65 focus-visible:ring-ring/45 h-10 min-w-0 rounded-md px-3 py-1 text-base transition-[box-shadow,color] duration-200 ease-out outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
