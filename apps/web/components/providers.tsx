'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'
import { NextUIThemeProvider, ThemeAnimationType } from 'uitheme-web/react'

import { colorThemes, themeTransition } from '@/lib/theme'

export function Providers({ children }: { children: ReactNode }) {
  const [queries] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false, retry: 1 },
        },
      }),
  )

  return (
    <NextUIThemeProvider
      animationType={ThemeAnimationType.CIRCLE}
      attribute='class'
      colorThemes={[...colorThemes]}
      defaultColorTheme='default'
      defaultTheme='system'
      duration={themeTransition.duration}
      themes={['light', 'dark', 'system']}
    >
      <QueryClientProvider client={queries}>{children}</QueryClientProvider>
    </NextUIThemeProvider>
  )
}
