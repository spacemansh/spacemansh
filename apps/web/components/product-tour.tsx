'use client'

import { useCallback, useRef, useState } from 'react'

import { LiquidMetalButton } from '@/components/liquid-metal-button'
import { ActionRow, StepButton, VisitLink } from '@/components/tour-actions'
import { replayCards } from '@/lib/replay-cards'
import { products } from '@/lib/site'

import './product-tour.css'

const frameMs = 420

const slideMs = 560

const awayMs = 440

type Phase = 'away' | 'frame' | 'slide' | 'full'

const segmentClasses =
  'text-control text-muted-foreground not-data-active:hover:bg-muted not-data-active:hover:text-foreground data-active:bg-foreground data-active:text-background inline-flex h-9 min-w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent px-3 font-medium whitespace-nowrap transition-colors duration-200'

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function ProductTour() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const timers = useRef<number[]>([])
  const busy = useRef(false)
  const lastStep = useRef(0)
  const touchStart = useRef<number | null>(null)
  const [position, setPosition] = useState(0)
  const [phase, setPhase] = useState<Phase>('away')

  const clearTimers = () => {
    timers.current.forEach(window.clearTimeout)
    timers.current = []
  }

  const later = (ms: number, run: () => void) => {
    timers.current.push(window.setTimeout(run, ms))
  }

  const focusCurrent = () => {
    requestAnimationFrame(() => {
      dialogRef.current
        ?.querySelector<HTMLElement>('[aria-current="page"]')
        ?.focus({ preventScroll: true })
    })
  }

  const travel = useCallback((to: number) => {
    clearTimers()

    if (prefersReducedMotion()) {
      setPosition(to)
      focusCurrent()

      return
    }

    busy.current = true
    setPhase('frame')
    later(frameMs, () => {
      setPhase('slide')
      setPosition(to)
      focusCurrent()
    })
    later(frameMs + slideMs, () => {
      setPhase('full')
      later(frameMs, () => {
        busy.current = false
      })
    })
  }, [])

  const show = () => {
    const dialog = dialogRef.current

    if (!dialog || dialog.open) return
    clearTimers()
    document.documentElement.toggleAttribute('data-tour-open', true)
    dialog.showModal()
    focusCurrent()

    if (prefersReducedMotion()) {
      setPhase('full')

      return
    }

    busy.current = true
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setPhase('slide')
        later(slideMs, () => {
          setPhase('full')
          later(frameMs, () => {
            busy.current = false
          })
        })
      }),
    )
  }

  const hide = () => {
    clearTimers()

    if (prefersReducedMotion()) {
      dialogRef.current?.close()

      return
    }

    busy.current = true
    const wait = phase === 'full' ? frameMs : 0

    setPhase('frame')
    later(wait, () => {
      setPhase('away')
      replayCards()
    })
    later(wait + awayMs, () => dialogRef.current?.close())
  }

  const onClosed = () => {
    clearTimers()
    busy.current = false
    setPosition(0)
    setPhase('away')
    document.documentElement.toggleAttribute('data-tour-open', false)

    if (prefersReducedMotion()) replayCards()
  }

  const goTo = (index: number) => {
    const next = Math.max(0, Math.min(products.length - 1, index))

    if (busy.current || next === position) return
    travel(next)
  }

  const step = (direction: 1 | -1, at: number) => {
    if (at - lastStep.current < frameMs * 2 + slideMs) return
    lastStep.current = at
    goTo(position + direction)
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (['ArrowDown', 'PageDown', ' '].includes(event.key)) {
      if (event.target instanceof HTMLButtonElement && event.key === ' ') return
      event.preventDefault()
      goTo(position + 1)
    } else if (['ArrowUp', 'PageUp'].includes(event.key)) {
      event.preventDefault()
      goTo(position - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      goTo(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      goTo(products.length - 1)
    }
  }

  const onWheel = (event: React.WheelEvent) => {
    if (Math.abs(event.deltaY) < 24) return
    step(event.deltaY > 0 ? 1 : -1, event.timeStamp)
  }

  const onPointerDown = (event: React.PointerEvent) => {
    if (event.pointerType === 'touch') touchStart.current = event.clientY
  }

  const onPointerUp = (event: React.PointerEvent) => {
    const start = touchStart.current

    touchStart.current = null

    if (start === null) return

    const travelled = start - event.clientY

    if (Math.abs(travelled) > 56) step(travelled > 0 ? 1 : -1, event.timeStamp)
  }

  return (
    <>
      <LiquidMetalButton
        aria-haspopup='dialog'
        className='self-start'
        onClick={show}
      >
        Explore
      </LiquidMetalButton>

      <dialog
        aria-label='Spaceman products'
        className='text-foreground m-0 size-full max-h-none max-w-none overflow-clip overscroll-contain border-0 bg-transparent p-0 backdrop:bg-transparent'
        data-phase={phase}
        data-tour
        onCancel={(event) => {
          event.preventDefault()
          hide()
        }}
        onClose={onClosed}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onWheel={onWheel}
        ref={dialogRef}
      >
        <div
          aria-hidden='true'
          className='bg-muted-strong absolute inset-0'
          data-tour-field
        />
        <div className='absolute inset-0' data-tour-scale>
          <div
            className='absolute inset-0 flex flex-col gap-6'
            data-tour-track
            style={{
              transform: `translate3d(0, calc(${-position * 100}% - ${position * 24}px), 0)`,
            }}
          >
            {products.map((product, i) => (
              <section
                aria-hidden={i !== position}
                aria-labelledby={`tour-${product.id}`}
                className='bg-background relative flex-none basis-full overflow-hidden'
                data-tour-page
                inert={i !== position}
                key={product.id}
              >
                <div className='mx-auto grid h-full w-full max-w-280 content-center items-center gap-10 px-5 pt-24 pb-12 sm:px-8 lg:grid-cols-2 lg:gap-16'>
                  <div className='flex flex-col gap-5'>
                    <p className='text-muted-foreground font-mono text-sm'>
                      {String(i + 1).padStart(2, '0')} /{' '}
                      {String(products.length).padStart(2, '0')} ·{' '}
                      {product.domain}
                    </p>
                    <h2
                      className='text-page font-normal text-balance'
                      id={`tour-${product.id}`}
                    >
                      {product.name}
                    </h2>
                    <p className='text-copy md:text-copy-lg text-muted-foreground max-w-130 text-pretty'>
                      {product.description}
                    </p>
                    <ActionRow>
                      <VisitLink href={product.href} name={product.name} />
                      {i < products.length - 1 ? (
                        <StepButton onClick={() => goTo(i + 1)}>
                          Next: {products[i + 1]!.name}
                        </StepButton>
                      ) : (
                        <StepButton onClick={hide}>
                          Back to spaceman.sh
                        </StepButton>
                      )}
                    </ActionRow>
                  </div>

                  <div
                    aria-hidden='true'
                    className='bg-card shadow-card relative aspect-4/3 w-full'
                    data-product={product.id}
                    data-tour-art
                  >
                    <div
                      className='bg-inset inset-ring-border absolute inset-ring'
                      data-tour-well
                    />
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>

        <nav
          aria-label='Products'
          className='bg-card shadow-float absolute inset-x-3 top-4 z-2 mx-auto flex w-fit max-w-full items-center gap-0.5 overflow-x-auto rounded-xl p-1'
          data-tour-nav
        >
          <button
            aria-label='Close'
            className={segmentClasses}
            onClick={hide}
            type='button'
          >
            <svg
              aria-hidden='true'
              fill='none'
              height='16'
              stroke='currentColor'
              strokeLinecap='round'
              strokeWidth='2'
              viewBox='0 0 24 24'
              width='16'
            >
              <path d='M6 6l12 12M18 6 6 18' />
            </svg>
          </button>
          <span aria-hidden='true' className='bg-border mx-1 h-5 w-px' />
          {products.map((product, i) => (
            <button
              aria-current={i === position ? 'page' : undefined}
              className={segmentClasses}
              data-active={i === position || undefined}
              key={product.id}
              onClick={() => goTo(i)}
              type='button'
            >
              <span className='hidden sm:inline'>{product.name}</span>
              <span className='sm:hidden'>
                {String(i + 1).padStart(2, '0')}
              </span>
            </button>
          ))}
        </nav>
      </dialog>
    </>
  )
}
