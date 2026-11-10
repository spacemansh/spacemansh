import type { Metadata } from 'next'

import { ExpandableGallery } from '@/components/expandable-gallery'
import { products } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Gallery lab',
  robots: { index: false, follow: false },
}

const items = products.map((product) => ({
  id: product.id,
  alt: product.name,
  label: product.name,
  detail: new URL(product.href).host,
  href: product.href,
}))

export default function GalleryLabPage() {
  return (
    <main className='bg-background text-foreground mx-auto min-h-dvh max-w-280 px-5 py-16 sm:px-8'>
      <h1 className='text-card-title mb-2 font-normal'>Gallery</h1>
      <p className='text-copy text-muted-foreground mb-12 max-w-130'>
        A fanned stack of cards that expands into a grid.
      </p>
      <ExpandableGallery action='See all' items={items} title='Products' />
    </main>
  )
}
