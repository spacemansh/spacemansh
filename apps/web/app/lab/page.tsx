import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Lab',
  robots: { index: false, follow: false },
}

const pages = [
  {
    href: '/lab/logo',
    name: 'Logo chip',
    description: 'A squircle logo beside its name, with live controls.',
  },
  {
    href: '/lab/gallery',
    name: 'Gallery',
    description: 'A fanned stack of cards that expands into a grid.',
  },
]

export default function LabPage() {
  return (
    <main className='bg-background text-foreground mx-auto min-h-dvh max-w-280 px-5 py-16 sm:px-8'>
      <h1 className='text-card-title mb-2 font-normal'>Lab</h1>
      <p className='text-copy text-muted-foreground mb-12 max-w-130'>
        Components in progress, each on its own page.
      </p>
      <ul className='divide-border border-border flex flex-col divide-y border-y'>
        {pages.map((page) => (
          <li key={page.href}>
            <Link
              className='group flex flex-col gap-1 py-5 no-underline sm:flex-row sm:items-baseline sm:justify-between sm:gap-6'
              href={page.href}
            >
              <span className='text-lead decoration-transparent decoration-1 underline-offset-4 transition-colors duration-180 group-hover:underline group-hover:decoration-current'>
                {page.name}
              </span>
              <span className='text-copy text-muted-foreground'>
                {page.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
