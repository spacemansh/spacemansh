'use client'

import { getSvgPath } from 'figma-squircle'
import { animate } from 'motion'
import Image from 'next/image'

import './logo-chip.css'
import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useState,
} from 'react'

export type LogoChipProps = {
  logo?: string

  alt?: string
  label?: ReactNode

  logoSize?: number

  logoRadius?: number

  smoothing?: number

  ring?: number

  ringColor?: string

  gap?: number

  padding?: number

  paddingEnd?: number

  radius?: number | 'auto'

  background?: string

  gradient?: string[]

  gradientAngle?: number

  borderWidth?: number
  borderColor?: string

  color?: string

  weight?: number

  interval?: number

  hold?: number

  delay?: number

  tilt?: number

  zoom?: number

  dip?: number

  origin?: 'label' | 'center'
  paused?: boolean

  playOnMount?: boolean

  className?: string
  style?: CSSProperties
}

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const isLink = (logo: string) => /^(https?:|data:|\/\/)/.test(logo)

export function LogoChip({
  logo = '',
  alt = '',
  label,
  logoSize = 1,
  logoRadius = 0.3,
  smoothing = 0.6,
  ring = 0.06,
  ringColor = 'var(--foreground)',
  gap = 0.28,
  padding = 0.14,
  paddingEnd = 0.24,
  radius = 'auto',
  background = 'var(--muted)',
  gradient,
  gradientAngle = 135,
  borderWidth = 0,
  borderColor = 'var(--border)',
  color,
  weight,
  interval = 10000,
  hold = 5000,
  delay = 1000,
  tilt = 10,
  zoom = 1.35,
  dip = 0.78,
  origin = 'label',
  paused = false,
  playOnMount = false,
  className,
  style,
}: LogoChipProps) {
  const [failed, setFailed] = useState<string | null>(null)

  const mount = useCallback(
    (sticker: HTMLSpanElement | null) => {
      if (!sticker) return

      const face = sticker.firstElementChild

      const clip = () => {
        const edge = sticker.offsetWidth
        const font = getComputedStyle(sticker)
        const em = parseFloat(font.fontSize)

        const inset = Math.min(edge / 3, ring * em)

        sticker.style.clipPath = `path('${getSvgPath({ width: edge, height: edge, cornerRadius: logoRadius * edge, cornerSmoothing: smoothing })}')`

        if (face instanceof HTMLElement) {
          const inner = edge - inset * 2

          face.style.clipPath = `path('${getSvgPath({ width: inner, height: inner, cornerRadius: Math.max(0, logoRadius * edge - inset), cornerSmoothing: smoothing })}')`
        }
      }

      let running: { stop: () => void } | null = null
      let settle = 0

      const beat = () => {
        if (document.hidden || prefersReducedMotion()) return
        running?.stop()
        window.clearTimeout(settle)
        const turn = (Math.abs(tilt) * Math.PI) / 180

        const overhang =
          origin === 'label'
            ? ((sticker.offsetWidth * zoom) / 2) *
              (Math.sin(turn) + Math.cos(turn) - 1)
            : 0

        running = animate([
          [
            sticker,
            { scale: dip, rotate: tilt * -0.2, x: 0 },
            { duration: 0.14, ease: 'easeIn' },
          ],
          [
            sticker,
            { scale: zoom, rotate: tilt, x: -overhang },
            { type: 'spring', stiffness: 320, damping: 16 },
          ],
        ])
        settle = window.setTimeout(() => {
          running = animate(
            sticker,
            { scale: 1, rotate: 0, x: 0 },
            { type: 'spring', stiffness: 260, damping: 15 },
          )
        }, 140 + hold)
      }

      const every =
        interval > 0 && !paused ? Math.max(interval, hold + 1000) : 0

      const resize = new ResizeObserver(clip)
      let timer = 0

      const start = every
        ? window.setTimeout(() => {
            beat()
            timer = window.setInterval(beat, every)
          }, delay)
        : 0

      const first = playOnMount ? window.setTimeout(beat, 300) : 0

      resize.observe(sticker)

      return () => {
        resize.disconnect()
        window.clearTimeout(start)
        window.clearInterval(timer)
        window.clearTimeout(first)
        window.clearTimeout(settle)
        running?.stop()
      }
    },
    [
      delay,
      dip,
      hold,
      interval,
      logoRadius,
      paused,
      playOnMount,
      origin,
      ring,
      smoothing,
      tilt,
      zoom,
    ],
  )

  const fill =
    gradient && gradient.length > 1
      ? `linear-gradient(${gradientAngle}deg, ${gradient.join(', ')})`
      : background

  return (
    <span
      className={['inline-flex items-baseline whitespace-nowrap', className]
        .filter(Boolean)
        .join(' ')}
      style={{
        gap: logo && label ? `${gap}em` : undefined,
        padding: `${padding}em ${paddingEnd}em ${padding}em ${padding}em`,
        borderRadius:
          radius === 'auto'
            ? `calc(${logo ? logoRadius * logoSize : 0}cap + ${padding}em)`
            : `${radius}em`,
        background: fill,
        border: borderWidth
          ? `${borderWidth}px solid ${borderColor}`
          : undefined,
        color,
        fontWeight: weight,
        ...style,
      }}
    >
      {logo ? (
        <span
          className='relative inline-block shrink-0'
          data-logo
          ref={mount}
          style={{
            width: `${logoSize}cap`,
            height: `${logoSize}cap`,
            top: `${((logoSize - 1) / 2).toFixed(3)}cap`,
            borderRadius: `${logoRadius * 100}%`,
            background: ring > 0 ? ringColor : undefined,
            transformOrigin: origin === 'label' ? 'right center' : 'center',
          }}
        >
          <span
            className='bg-inset absolute overflow-hidden'
            style={{ inset: `${ring}em` }}
          >
            {failed === logo ? null : (
              <Image
                alt={alt}
                className='object-cover'
                fill
                onError={() => setFailed(logo)}
                sizes='96px'
                src={logo}
                unoptimized={isLink(logo)}
              />
            )}
          </span>
        </span>
      ) : null}
      {label ? <span data-chip-label>{label}</span> : null}
    </span>
  )
}
