import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Noto_Sans, Source_Serif_4 } from 'next/font/google'

import { Providers } from '@/components/providers'
import { siteDescription, siteUrl } from '@/lib/site'

import '@workspace/ui/globals.css'

const notoSans = Noto_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
})

const sourceSerif = Source_Serif_4({
  variable: '--font-serif',
  subsets: ['latin'],
  display: 'swap',
})

const title = 'spaceman.sh — open-source tools for beautiful user interfaces'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: '%s · spaceman.sh' },
  description: siteDescription,
  applicationName: 'spaceman.sh',
  keywords: [
    'spaceman.sh',
    'Spaceman',
    'Spaceman UI Registry',
    'Spaceman Skills',
    'Spaceman React Theme Animation',
    'UI Theme',
    'open-source UI tools',
    'shadcn registry',
    'React components',
    'design system',
    'theming library',
    'theme animation',
    'agent skills',
    'Tony Edgal',
  ],
  authors: [{ name: 'Tony Edgal', url: 'https://tony.spaceman.sh' }],
  creator: 'Tony Edgal',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'spaceman.sh',
    title,
    description: siteDescription,
    locale: 'en',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@TonyEdgal',
    title,
    description: siteDescription,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fcfcfc' },
    { media: '(prefers-color-scheme: dark)', color: '#121212' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      className={`${notoSans.variable} ${geistMono.variable} ${sourceSerif.variable} overscroll-none`}
      lang='en'
      suppressHydrationWarning
    >
      <body className='antialiased'>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
