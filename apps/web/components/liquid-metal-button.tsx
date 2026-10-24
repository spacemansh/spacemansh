'use client'

import { LiquidMetal } from '@paper-design/shaders-react'
import { ArrowRight } from 'lucide-react'
import {
  type ComponentProps,
  type ReactNode,
  useCallback,
  useState,
  useSyncExternalStore,
} from 'react'

import { cn } from '@workspace/ui/lib/utils'

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

const subscribeToReducedMotion = (callback: () => void) => {
  const query = window.matchMedia(reducedMotionQuery)

  query.addEventListener('change', callback)

  return () => query.removeEventListener('change', callback)
}

const getReducedMotion = () => window.matchMedia(reducedMotionQuery).matches

const getServerReducedMotion = () => false

// the shader takes real colours, not custom properties, so the tokens are
// painted onto a 1px canvas and read back as rgb
const readToken = (name: string) => {
  const context = document.createElement('canvas').getContext('2d')

  if (!context) return ''
  context.fillStyle = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
  context.fillRect(0, 0, 1, 1)

  const [r, g, b] = context.getImageData(0, 0, 1, 1).data

  return `rgb(${r}, ${g}, ${b})`
}

type Metal = { back: string; tint: string; gl: boolean }

// the shader throws where WebGL is missing; those browsers get a plain ring
const hasWebGL = () => {
  const canvas = document.createElement('canvas')

  return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
}

// mid grey body, lit by whichever end of the scale is lighter
const readMetal = (): Metal => {
  const dark = document.documentElement.classList.contains('dark')

  return {
    back: readToken('--muted-foreground'),
    tint: readToken(dark ? '--foreground' : '--background'),
    gl: hasWebGL(),
  }
}

export type LiquidMetalButtonProps = Omit<
  ComponentProps<'button'>,
  'children'
> & {
  children: ReactNode
  /** the icon in the round well; an arrow by default */
  icon?: ReactNode
  /** shader colours; read from the theme tokens when omitted */
  colorBack?: string
  colorTint?: string
  /** flow speed at rest and on hover or focus */
  speed?: number
  activeSpeed?: number
}

export function LiquidMetalButton({
  children,
  icon,
  colorBack,
  colorTint,
  speed = 1.5,
  activeSpeed = 3,
  className,
  onBlur,
  onFocus,
  onMouseEnter,
  onMouseLeave,
  ...props
}: LiquidMetalButtonProps) {
  const [isActive, setIsActive] = useState(false)
  const [metal, setMetal] = useState<Metal | null>(null)

  const reduceMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  )

  // the tokens change with the theme class on <html>, so read them again then
  const watchTheme = useCallback((node: HTMLSpanElement | null) => {
    if (!node) return
    setMetal(readMetal())

    const observer = new MutationObserver(() => setMetal(readMetal()))

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  // metal flows faster on hover and focus, and stays still for reduced motion
  const flow = reduceMotion ? 0 : isActive ? activeSpeed : speed

  return (
    <button
      className={cn(
        'group relative inline-flex h-auto w-fit cursor-pointer overflow-hidden rounded-full border-0 p-1 shadow-lg transition-transform active:scale-96',
        className,
      )}
      onBlur={(event) => {
        setIsActive(false)
        onBlur?.(event)
      }}
      onFocus={(event) => {
        setIsActive(true)
        onFocus?.(event)
      }}
      onMouseEnter={(event) => {
        setIsActive(true)
        onMouseEnter?.(event)
      }}
      onMouseLeave={(event) => {
        setIsActive(false)
        onMouseLeave?.(event)
      }}
      type='button'
      {...props}
    >
      {/* the metal ring, oversized so the shader's faded edges stay clipped */}
      <span
        aria-hidden='true'
        className='absolute -inset-6 z-0'
        ref={watchTheme}
      >
        {metal && !metal.gl ? (
          <span className='bg-border-strong absolute inset-0' />
        ) : null}
        {metal?.gl ? (
          <LiquidMetal
            angle={45}
            colorBack={colorBack ?? metal.back}
            colorTint={colorTint ?? metal.tint}
            distortion={0.15}
            fit='cover'
            repetition={4}
            // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- the shader's own prop name
            shape='none'
            shiftBlue={-0.3}
            shiftRed={0.3}
            softness={0.1}
            speed={flow}
            style={{ width: '100%', height: '100%' }}
          />
        ) : null}
      </span>

      <span className='bg-background text-foreground group-hover:bg-muted relative z-10 flex items-center gap-3 rounded-full py-1.5 ps-1.5 pe-6 text-sm font-medium transition-colors duration-300'>
        <span className='bg-muted text-muted-foreground group-hover:bg-background group-hover:text-foreground flex size-8 items-center justify-center rounded-full transition-colors duration-300'>
          {icon ?? (
            <ArrowRight
              aria-hidden='true'
              className='size-4 transition-transform duration-300 group-hover:-rotate-45'
            />
          )}
        </span>
        {children}
      </span>
    </button>
  )
}
