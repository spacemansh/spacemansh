import type { Metadata } from 'next'
import { Noto_Sans, Geist_Mono, Source_Serif_4 } from 'next/font/google'

import { colorThemes } from '@/registry/spaceman/theme-picker/themes'
import { ThemeProvider } from '@/registry/spaceman/theme-toggle/theme-provider'

import './globals.css'

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

// Applies the stored motion preference before first paint, so the hero does
// not start animating for someone who has switched motion off.
const motionScript = `try{if(localStorage.getItem("spaceman-motion")==="reduced")document.documentElement.dataset.motion="reduced"}catch(e){}`

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
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
      </head>
      <body className='antialiased' suppressHydrationWarning>
        <ThemeProvider colorThemes={colorThemes} defaultColorTheme='emerald'>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
