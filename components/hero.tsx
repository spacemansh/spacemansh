import type * as React from 'react'

import { installCommand } from '@/lib/site'
import { CopyButton } from '@/registry/spaceman/copy-button/copy-button'

type Stroke = {
  d: string
  width: number
  duration: number
  delay: number
}

/**
 * A word with a hand-drawn underline that draws itself once on load. The
 * curves wobble on purpose; the SVG is decorative and the word stays text.
 */
function Underlined({
  children,
  strokes,
}: {
  children: React.ReactNode
  strokes: Stroke[]
}) {
  return (
    <span className='relative inline-block whitespace-nowrap'>
      {children}
      <svg
        aria-hidden='true'
        className='absolute -bottom-[0.16em] -left-[2%] h-[0.3em] w-[104%] overflow-visible'
        preserveAspectRatio='none'
        viewBox='0 0 300 22'
      >
        {strokes.map((stroke) => (
          <path
            className='spaceman-underline stroke-primary-ink fill-none'
            d={stroke.d}
            key={stroke.d}
            pathLength={1}
            strokeLinecap='round'
            strokeWidth={stroke.width}
            style={{
              animationDuration: `${stroke.duration}ms`,
              animationDelay: `${stroke.delay}ms`,
            }}
          />
        ))}
      </svg>
    </span>
  )
}

const command = installCommand('theme-picker')

export function Hero() {
  return (
    <section
      aria-labelledby='hero-title'
      className='px-page border-border flex justify-center border-b pt-28 pb-26 max-sm:pt-20 max-sm:pb-20'
      id='top'
    >
      <div className='flex max-w-[720px] min-w-0 flex-col items-center gap-6 text-center'>
        <p className='spaceman-hero-kicker border-border bg-card text-muted-foreground inline-flex items-center gap-2 rounded-full border px-2.5 py-[5px] font-mono text-[11.5px] whitespace-nowrap'>
          <span
            aria-hidden='true'
            className='bg-primary size-1.5 rounded-full'
          />
          New — theme-picker
        </p>

        <h1
          className='spaceman-hero-title text-[clamp(38px,5vw,62px)] leading-[1.02] font-normal tracking-[-0.025em] text-balance'
          id='hero-title'
        >
          A{' '}
          <Underlined
            strokes={[
              {
                d: 'M4 13 C 70 5, 170 5, 296 10',
                width: 4,
                duration: 800,
                delay: 250,
              },
            ]}
          >
            registry
          </Underlined>{' '}
          for{' '}
          <Underlined
            strokes={[
              {
                d: 'M4 14 C 60 6, 150 4, 296 9',
                width: 4,
                duration: 800,
                delay: 1100,
              },
              {
                d: 'M40 20 C 110 13, 200 12, 270 16',
                width: 2.5,
                duration: 650,
                delay: 1750,
              },
            ]}
          >
            interfaces
          </Underlined>{' '}
          that feel considered.
        </h1>

        <p className='spaceman-hero-copy text-muted-foreground max-w-[520px] text-[14.5px] leading-[1.75] text-pretty'>
          Copy themes, motion and blocks straight into your project with the
          shadcn CLI. The code is yours to change. MIT licensed.
        </p>

        <div className='spaceman-hero-actions mt-2 flex max-w-full flex-wrap items-center justify-center gap-3'>
          <div className='border-border bg-input flex h-[46px] max-w-full min-w-0 items-center gap-3.5 rounded-[10px] border pr-2 pl-4'>
            <code className='min-w-0 [scrollbar-width:none] overflow-x-auto font-mono text-[13px] whitespace-nowrap'>
              <span aria-hidden='true' className='text-muted-foreground'>
                ${' '}
              </span>
              {command}
            </code>
            <CopyButton
              className='bg-muted text-muted-foreground hover:bg-muted-strong hover:text-foreground size-[30px] flex-none rounded-md'
              value={command}
            />
          </div>
          <a
            className='spaceman-pressable bg-foreground text-background hover:bg-foreground/90 inline-flex h-[46px] items-center rounded-[10px] px-[18px] text-[13.5px] font-medium'
            href='#catalogue'
          >
            Browse
          </a>
        </div>
      </div>
    </section>
  )
}
