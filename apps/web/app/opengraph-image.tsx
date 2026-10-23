import { ImageResponse } from 'next/og'

import { siteDescription } from '@/lib/site'

export const alt =
  'spaceman.sh — open-source tools for beautiful user interfaces'

export const size = { width: 1200, height: 630 }

export const contentType = 'image/png'

// Static: no request data is read, so the image is generated once at build.
// ImageResponse takes literal colours; these are the dark --background,
// --foreground and --muted-foreground tokens.
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 80,
        background: '#121212',
        color: '#e2e8f0',
      }}
    >
      <div style={{ fontSize: 112, letterSpacing: '-0.04em', lineHeight: 1 }}>
        spaceman.sh
      </div>
      <div style={{ marginTop: 28, fontSize: 36, color: '#a8a8a8' }}>
        {siteDescription}
      </div>
    </div>,
    size,
  )
}
