'use client'

import { useCallback, useRef, useState } from 'react'

import { ExploreButtonFace } from '@/components/explore-button'
import { replayCards } from '@/lib/replay-cards'
import { products } from '@/lib/site'

// The Explore tour: one full-screen page per product, moved like a framed page
// transition. Every change of page runs three phases, timed from the reference:
//   frame  the page scales into a frame on a muted field   420ms ease-out
//   slide  framed pages travel vertically, a gap between    560ms ease-in-out
//   full   the new page grows back to full bleed            420ms ease-out
// Away is the resting state while closed: framed, parked under the screen, no
// field. Opening rises the first page out of it; closing drops the current
// page back into it, a little faster, without travelling past the others.
const frameMs = 420

const slideMs = 560

const awayMs = 440

type Phase = 'away' | 'frame' | 'slide' | 'full'

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

  // the page that held focus turns inert when it leaves, so focus follows to the nav
  const focusCurrent = () => {
    requestAnimationFrame(() => {
      dialogRef.current
        ?.querySelector<HTMLElement>('[aria-current="page"]')
        ?.focus({ preventScroll: true })
    })
  }

  // frame → move → full, then release the lock
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
    document.documentElement.classList.add('spaceman-tour-open')
    // the dialog is already away, so it appears parked and framed
    dialog.showModal()
    focusCurrent()

    if (prefersReducedMotion()) {
      setPhase('full')

      return
    }

    busy.current = true
    // let the parked state paint, then rise and expand
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
    // a page that is already framed (still rising, or mid-move) drops at once
    const wait = phase === 'full' ? frameMs : 0

    setPhase('frame')
    later(wait, () => {
      setPhase('away')
      // the cards pop back in while the field fades off them
      replayCards()
    })
    later(wait + awayMs, () => dialogRef.current?.close())
  }

  const onClosed = () => {
    clearTimers()
    busy.current = false
    setPosition(0)
    setPhase('away')
    document.documentElement.classList.remove('spaceman-tour-open')

    if (prefersReducedMotion()) replayCards()
  }

  const goTo = (index: number) => {
    const next = Math.max(0, Math.min(products.length - 1, index))

    if (busy.current || next === position) return
    travel(next)
  }

  const step = (direction: 1 | -1, at: number) => {
    // one page per gesture: ignore the tail of a trackpad swipe
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
      <button
        aria-haspopup='dialog'
        className='spaceman-explore'
        onClick={show}
        type='button'
      >
        <ExploreButtonFace />
      </button>

      <dialog
        aria-label='Spaceman products'
        className='spaceman-tour'
        data-phase={phase}
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
        <div aria-hidden='true' className='spaceman-tour-field' />
        <div className='spaceman-tour-scale'>
          <div
            className='spaceman-tour-track'
            style={{
              transform: `translate3d(0, calc(${-position * 100}% - ${position * 24}px), 0)`,
            }}
          >
            {products.map((product, i) => (
              <section
                aria-hidden={i !== position}
                aria-labelledby={`tour-${product.id}`}
                className='spaceman-tour-page'
                inert={i !== position}
                key={product.id}
              >
                <div className='mx-auto grid h-full w-full max-w-[1120px] content-center items-center gap-10 px-5 pt-24 pb-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16'>
                  <div className='flex flex-col gap-5'>
                    <p className='text-muted-foreground font-mono text-sm'>
                      {String(i + 1).padStart(2, '0')} /{' '}
                      {String(products.length).padStart(2, '0')} ·{' '}
                      {product.domain}
                    </p>
                    <h2
                      className='spaceman-tour-title'
                      id={`tour-${product.id}`}
                    >
                      {product.name}
                    </h2>
                    <p className='spaceman-tour-lead'>{product.description}</p>
                    <div className='spaceman-tour-actions'>
                      <a className='spaceman-tour-visit' href={product.href}>
                        {/* phones keep the row short; the name stays in the link's name */}
                        <span>
                          Visit
                          <span className='max-sm:sr-only'>
                            {' '}
                            {product.name}
                          </span>
                        </span>
                        <svg
                          aria-hidden='true'
                          fill='none'
                          height='14'
                          stroke='currentColor'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          viewBox='0 0 24 24'
                          width='14'
                        >
                          <path d='M7 17 17 7M8 7h9v9' />
                        </svg>
                      </a>
                      {i < products.length - 1 ? (
                        <button
                          className='spaceman-tour-next'
                          onClick={() => goTo(i + 1)}
                          type='button'
                        >
                          <span>Next: {products[i + 1]!.name}</span>
                        </button>
                      ) : (
                        <button
                          className='spaceman-tour-next'
                          onClick={hide}
                          type='button'
                        >
                          <span>Back to spaceman.sh</span>
                        </button>
                      )}
                    </div>
                  </div>
                  {/* image slot: the product's artwork goes here */}
                  <div
                    aria-hidden='true'
                    className='spaceman-tour-art'
                    data-product={product.id}
                  >
                    <div className='spaceman-card-well' />
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>

        <nav aria-label='Products' className='spaceman-tour-nav'>
          <button
            aria-label='Close'
            className='spaceman-tour-seg'
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
              className='spaceman-tour-seg'
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
