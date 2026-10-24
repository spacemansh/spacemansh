import type { Metadata } from 'next'

import { LogoLab } from '@/components/logo-lab'

export const metadata: Metadata = {
  title: 'Logo chip lab',
  robots: { index: false, follow: false },
}

export default function LogoLabPage() {
  return (
    <main className='bg-background text-foreground mx-auto min-h-dvh max-w-280 px-5 py-16 sm:px-8'>
      <h1 className='text-card-title mb-2 font-normal'>Logo chip</h1>
      <p className='text-copy text-muted-foreground mb-12 max-w-130'>
        A brand chip: a squircle logo beside its name. Tune it here; the snippet
        shows the props that differ from the defaults.
      </p>
      <LogoLab />
    </main>
  )
}
