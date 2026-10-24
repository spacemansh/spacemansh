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

// A brand chip: a squircle logo beside its name, after graphicalui.com's hero
// tokens. On an interval the logo dips, springs up larger and leaning right,
// holds, then springs back straight. Only transforms move and every length is
// in em, so the text around the chip never shifts; the logo grows away from
// the name, so the gap between them holds while it outgrows the chip.

export type LogoChipProps = {
  /** the logo image: a path in public/ ('/spaceman.webp') or a full link; empty for a name-only chip */
  logo?: string
  /** empty when the label already names the logo */
  alt?: string
  label?: ReactNode

  /** logo edge in cap heights of the surrounding text; 1 spans baseline to cap line */
  logoSize?: number
  /** logo corner radius as a share of its edge, 0 to 0.5 */
  logoRadius?: number
  /** figma corner smoothing, 0 (circular) to 1 */
  smoothing?: number
  /** sticker ring width in em; 0 hides it */
  ring?: number
  /** any CSS colour */
  ringColor?: string

  /** space between logo and name, in em */
  gap?: number
  /** padding above, below and before the logo, in em */
  padding?: number
  /** padding after the name, in em */
  paddingEnd?: number
  /** chip corner radius in em; 'auto' is concentric: the logo's radius plus the padding */
  radius?: number | 'auto'
  /** any CSS background: a colour, a gradient, an image */
  background?: string
  /** two or more colours; when set, the chip uses a linear gradient of them */
  gradient?: string[]
  /** gradient direction in degrees */
  gradientAngle?: number
  /** border width in px; 0 hides it */
  borderWidth?: number
  borderColor?: string
  /** the name's colour; inherits when omitted */
  color?: string
  /** the name's weight; inherits when omitted */
  weight?: number

  /** ms from one beat to the next; 0 keeps it still */
  interval?: number
  /** ms the logo holds its tilted, zoomed pose */
  hold?: number
  /** ms before the first beat, so beats can fall between other motion */
  delay?: number
  /** tilt in degrees; positive leans right */
  tilt?: number
  /** scale of the held pose */
  zoom?: number
  /** scale of the dip before the zoom */
  dip?: number
  /** grow from the side facing the name (the gap holds) or from the centre */
  origin?: 'label' | 'center'
  paused?: boolean
  /** run one beat as soon as it mounts */
  playOnMount?: boolean

  className?: string
  style?: CSSProperties
}

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// links go to the browser as they are; next/image only optimises local files
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
  // a logo that fails to load leaves the empty well rather than a broken image
  const [failed, setFailed] = useState<string | null>(null)

  const mount = useCallback(
    (sticker: HTMLSpanElement | null) => {
      if (!sticker) return

      const face = sticker.firstElementChild

      // the squircle needs pixels; the box itself is sized in em
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

        // a turned square's box grows; growing from the name's side, move it
        // back by that overhang so the gap to the name stays as it was
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
        // the hold counts from the zoom, so a cycle splits into hold and rest
        settle = window.setTimeout(() => {
          running = animate(
            sticker,
            { scale: 1, rotate: 0, x: 0 },
            { type: 'spring', stiffness: 260, damping: 15 },
          )
        }, 140 + hold)
      }

      // a beat is its hold plus its return; beats never overlap
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
        // concentric: outer radius = the logo's radius + the padding around it
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
            // one cap tall rests on the baseline and meets the cap line; a
            // bigger logo stays centred on the capitals
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
