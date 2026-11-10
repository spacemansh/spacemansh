import { ArrowUpRight } from 'lucide-react'
import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'

import { cn } from '@workspace/ui/lib/utils'

import './gallery-card.css'

export type GalleryItem = {
  id: string
  alt: string
  src?: StaticImageData | string
  label?: string
  detail?: string
  href?: string
}

export function CardFace({
  item,
  index,
  expanded,
}: {
  item: GalleryItem
  index: number
  expanded: boolean
}) {
  if (item.src) {
    return (
      <Image
        alt={item.alt}
        className='pointer-events-none object-cover select-none'
        fill
        sizes={expanded ? '(max-width: 1024px) 50vw, 33vw' : '240px'}
        src={item.src}
      />
    )
  }

  return (
    <div className='bg-muted absolute inset-0 flex flex-col justify-between p-4 text-left sm:p-5'>
      <div
        aria-hidden='true'
        className='absolute inset-0 overflow-hidden opacity-70'
      >
        <div className='absolute -inset-1/2' data-grain />
      </div>
      <span
        className='text-muted-foreground relative font-mono tabular-nums'
        data-gallery-index
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className='relative'>
        <span className='text-foreground line-clamp-3 text-base leading-tight font-semibold text-balance sm:text-lg'>
          {item.label ?? item.alt}
        </span>
        {item.detail && (
          <span className='text-muted-foreground mt-1 block truncate text-xs'>
            {item.detail}
          </span>
        )}
      </span>
    </div>
  )
}

// the card as it sits in the stack, with a link over the whole face
export function GalleryCard({
  item,
  index,
  className,
  ...props
}: React.ComponentProps<'article'> & {
  item: GalleryItem & { href: string }
  index: number
}) {
  return (
    <article
      {...props}
      className={cn(
        'bg-muted outline-foreground/10 border-background relative overflow-hidden rounded-3xl border-6 outline-1 -outline-offset-1',
        className,
      )}
      data-gallery-card
      data-stacked=''
    >
      <Link
        className='focus-visible:outline-ring absolute inset-0 focus-visible:outline-2 focus-visible:-outline-offset-4'
        href={item.href}
      >
        <CardFace expanded={false} index={index} item={item} />
        <ArrowUpRight
          aria-hidden='true'
          className='text-muted-foreground absolute top-4 right-4 size-4'
          strokeWidth={1.75}
        />
      </Link>
    </article>
  )
}
