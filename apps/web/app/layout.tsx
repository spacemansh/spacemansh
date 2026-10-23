import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Noto_Sans, Source_Serif_4 } from 'next/font/google'

import { ThemeProvider } from '@/components/theme-provider'
import { siteDescription, siteUrl } from '@/lib/site'

import '@workspace/ui/globals.css'
import './site.css'

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

// Browser chrome colour; the values are the light and dark --background tokens.
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
      className={`${notoSans.variable} ${geistMono.variable} ${sourceSerif.variable}`}
      lang='en'
      suppressHydrationWarning
    >
      <body className='antialiased'>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
