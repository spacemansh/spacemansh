import type { Metadata } from 'next'
import { Geist_Mono, Noto_Sans, Source_Serif_4 } from 'next/font/google'

import { ThemeProvider } from '@/components/theme-provider'

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

export const metadata: Metadata = {
  title: 'spaceman.sh',
  description: 'Open-source tools for building beautiful user interfaces.',
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
