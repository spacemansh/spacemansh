'use client'

import { onReplayCards } from '@/lib/replay-cards'
import { products } from '@/lib/site'

// Square frames on a straight line, one per product, with a zig-zag tilt and stagger, moved
// by React Bits' BounceCards physics (reactbits.dev/components/bounce-cards):
// a staggered pop-in, and the hovered card straightens, lifts and scales while
// its neighbours slide aside. Geometry is in 288px card units.
//
// Where the fan no longer fits at a legible size, the same cards run as an
// endless marquee instead: they drift left and follow a drag or flick.
//
// Clicking a card opens the carousel: the cards straighten and grow into a
// looping row centred on that card, with its caption underneath.
const unit = 288

const overlap = 36

const band = 24

// one card per product, in order; the zig-zag tilt and stagger alternate
const tilts = [
  { rotate: -6, lift: -0.45 },
  { rotate: 5, lift: 0.35 },
  { rotate: -3, lift: -0.2 },
  { rotate: 6, lift: 0.3 },
  { rotate: -4, lift: -0.35 },
]

const cards = products.map((product, i) => ({
  ...tilts[i % tilts.length]!,
  id: product.id,
}))

const middle = (cards.length - 1) / 2

const poses = cards.map((card, i) => ({
  x: (i - middle) * (unit - overlap),
  y: -card.lift * band,
  rotate: card.rotate,
  // the middle cards sit on top
  layer: (cards.length - Math.abs(2 * i - cards.length + 1)) * cards.length + i,
}))

const halfHeights = poses.map(({ rotate }) => {
  const r = (rotate * Math.PI) / 180

  return ((Math.abs(Math.sin(r)) + Math.abs(Math.cos(r))) * unit) / 2
})

const top = Math.min(...poses.map((p, i) => p.y - halfHeights[i]!))

const bottom = Math.max(...poses.map((p, i) => p.y + halfHeights[i]!))

const centreY = (top + bottom) / 2

const fanWidth =
  Math.max(...poses.map((p) => p.x)) - Math.min(...poses.map((p) => p.x)) + unit

const fanHeight = bottom - top + 96

const reach = Math.max(...poses.map((p) => Math.abs(p.x)))

// BounceCards' springs: scale pops (bounciness 0.6), position settles (ratio 0.72).
const popK = 170

const popD = 2 * (1 - 0.85 * 0.6) * Math.sqrt(popK)

const moveK = 210

const moveDamping = (ratio: number) => 2 * ratio * Math.sqrt(moveK)

const delay = 0.5

// a replay follows the tour off screen, so it skips most of the load delay
const replayDelay = 0.12

const stagger = 0.06

// marquee: drift speed in px/s, the gap between cards as a share of their size,
// and how fast a flick hands its speed back to the drift
const drift = 32

const gapRatio = 0.1

const settle = 3

// carousel: a stiffer, nearly critical spring so the row lands without wobble
const carouselK = 300

const carouselD = 2 * 0.8 * Math.sqrt(carouselK)

const swipe = 48

type Body = {
  x: number
  y: number
  r: number
  s: number
  vx: number
  vy: number
  vr: number
  vs: number
  born: number
}

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Ref callback: runs the cards on mount and returns their cleanup (React 19). */
function mountCards(stage: HTMLDivElement | null) {
  if (!stage) return

  const elements = [...stage.querySelectorAll<HTMLElement>('[data-card]')]
  const carousel = stage.querySelector<HTMLElement>('[data-carousel]')
  const captions = [...stage.querySelectorAll<HTMLElement>('[data-caption]')]
  const root = document.documentElement
  const slots = poses.map(() => ({ x: 0, y: 0, rotate: 0 }))
  let bodies: Body[] = []
  let size = 248
  let push = 0
  let width = 0
  let height = 0
  let time = 0
  let hovered = -1
  let layer = -2
  let raf = 0
  let last = 0
  let entrance = delay
  let marquee = false
  let pitch = 0
  let offset = 0
  let speed = drift
  let drag: { id: number; x: number; at: number; moved: number } | null = null
  // the centred card while the carousel is open, else -1
  let open = -1
  let returning = false
  let suppress = false
  let swipeFrom: { id: number; x: number } | null = null
  let lastWheel = 0
  const geo = { x: 0, y: 0, scale: 1, pitch: 0 }

  const n = slots.length

  // a card's place in the row relative to the centred one, in -n/2..n/2
  const rel = (i: number, centre: number) => {
    const d = (((i - centre) % n) + n) % n

    return d > n / 2 ? d - n : d
  }

  // the row sits in viewport space; the caption takes the space under it
  const measure = () => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const phone = vw < 640
    const caption = phone ? 220 : 176
    const big = Math.min(phone ? vw * 0.74 : vw * 0.36, vh - caption - 72, 520)
    const top = Math.max(16, (vh - big - 24 - caption) / 2)
    const rect = stage.getBoundingClientRect()

    geo.x = vw / 2 - rect.left - width / 2
    geo.y = top + big / 2 - rect.top - height / 2
    geo.scale = big / size
    geo.pitch = big * (phone ? 1.1 : 1.22)
    carousel?.style.setProperty('--cc-y', `${top + big / 2}px`)
    carousel?.style.setProperty('--cc-top', `${top + big + 24}px`)
  }

  const layout = () => {
    width = stage.clientWidth
    height = stage.clientHeight
    const base = width >= 1024 ? 248 : width >= 640 ? 208 : 150

    let next = Math.min(
      base,
      (width * unit) / (fanWidth + 64),
      height > 0 ? (height * unit) / fanHeight : base,
    )

    // too small to read as a fan: keep the cards legible and run them as a marquee
    const wasMarquee = marquee

    marquee = next < 150

    if (marquee) next = Math.max(120, Math.min(200, width * 0.42, height * 0.7))

    size = next
    pitch = size * (1 + gapRatio)

    // start centred, in the order of the fan
    if (marquee && !wasMarquee) offset = pitch * (slots.length / 2 - middle)
    const d = size / unit
    // Push neighbours 0.8 × card size, capped so the outer card stays 16px inside.
    push = marquee
      ? 0
      : Math.max(0, Math.min(size * 0.8, width / 2 - 16 - size / 2 - reach * d))
    poses.forEach((pose, i) => {
      slots[i] = {
        x: marquee ? 0 : pose.x * d,
        y: (pose.y - (marquee ? 0 : centreY)) * d,
        rotate: pose.rotate,
      }
    })
    place()

    if (open >= 0) measure()
    stage.style.setProperty('--card-size', `${size}px`)
    stage.style.setProperty('--card-radius', `${(size * 24) / unit}px`)
    stage.style.setProperty('--card-pad', `${(size * 10) / unit}px`)
    layer = -2
    wake()
  }

  const frame = (now: number) => {
    raf = 0
    const reduce = prefersReducedMotion()
    const dt = Math.min(1 / 30, Math.max(1 / 240, (now - last) / 1000))
    const substeps = Math.ceil(dt / (1 / 240))
    const h = dt / substeps
    const moveD = moveDamping(reduce ? 1 : 0.72)
    const narrow = push < size * 0.3
    const showing = open >= 0
    const row = showing || returning
    const k = row ? carouselK : moveK
    const damping = row ? carouselD : moveD
    let moving = 0
    let settled = true

    last = now
    time += dt

    if (marquee) {
      // a held card or a reduced-motion preference stops the drift; a flick
      // eases back to it
      const target = hovered >= 0 || reduce || row ? 0 : drift

      if (!drag) {
        speed = target + (speed - target) * Math.exp(-dt * settle)
        offset -= speed * dt
      }

      place()
      moving += drag || Math.abs(speed) > 0.5 ? 1 : 0
    }

    const step = (
      v: number,
      vel: number,
      target: number,
      k: number,
      damp: number,
    ) => {
      const next = vel + ((target - v) * k - vel * damp) * h

      return [v + next * h, next] as const
    }

    slots.forEach((slot, i) => {
      const el = elements[i]

      if (!el) return

      const body = (bodies[i] ??= {
        x: slot.x,
        y: slot.y,
        r: slot.rotate,
        s: reduce ? 1 : 0,
        vx: 0,
        vy: 0,
        vr: 0,
        vs: 0,
        born: time,
      })

      const appeared = reduce || time - body.born >= entrance + i * stagger
      let tx = slot.x
      let ty = slot.y
      let tr = slot.rotate
      let ts = appeared ? 1 : 0

      if (showing) {
        tx = geo.x + rel(i, open) * geo.pitch
        ty = geo.y
        tr = 0
        ts = appeared ? geo.scale : 0
      } else if (hovered >= 0 && appeared) {
        if (i === hovered) {
          // the hovered card takes the stage; a narrow fan also glides it to centre
          ty = slot.y - size * 0.04
          tr = 0
          ts = narrow ? 1.12 : 1.06

          if (narrow && !marquee) tx = 0
        } else if (!marquee) {
          tx = narrow ? slot.x * 0.82 : slot.x + Math.sign(i - hovered) * push
        }
      }

      // the marquee positions cards itself, so they wrap without springing back
      if (marquee && !row) {
        body.x = tx
        body.vx = 0
      }

      if (reduce && row) {
        // the reduced twin: the row appears in place
        Object.assign(body, {
          x: tx,
          y: ty,
          r: tr,
          s: ts,
          vx: 0,
          vy: 0,
          vr: 0,
          vs: 0,
        })
      } else {
        for (let sub = 0; sub < substeps; sub++) {
          if (!marquee || row)
            [body.x, body.vx] = step(body.x, body.vx, tx, k, damping)
          ;[body.y, body.vy] = step(body.y, body.vy, ty, k, damping)
          ;[body.r, body.vr] = step(body.r, body.vr, tr, k, damping)

          if (reduce) {
            body.s = ts
            body.vs = 0
          } else if (row) {
            ;[body.s, body.vs] = step(body.s, body.vs, ts, k, damping)
          } else {
            ;[body.s, body.vs] = step(body.s, body.vs, ts, popK, popD)
          }
        }
      }

      if (
        Math.abs(tx - body.x) + Math.abs(ty - body.y) > 0.5 ||
        Math.abs(ts - body.s) > 0.002
      ) {
        settled = false
      }

      // speed blur stands in for motion blur while the row travels
      const blur = row
        ? Math.min(6, Math.max(0, (Math.hypot(body.vx, body.vy) - 600) / 500))
        : 0

      const filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : ''

      if (el.style.filter !== filter) el.style.filter = filter

      moving +=
        Math.abs(body.vx) +
        Math.abs(body.vy) +
        Math.abs(body.vr) +
        Math.abs(body.vs) * 100 +
        Math.abs(tx - body.x) +
        Math.abs(ty - body.y) +
        Math.abs(tr - body.r) +
        Math.abs(ts - body.s) * 100 +
        (appeared ? 0 : 1)
      el.style.transform = `translate3d(${(width / 2 + body.x).toFixed(2)}px, ${(height / 2 + body.y).toFixed(2)}px, 0) translate(-50%, -50%) rotate(${body.r.toFixed(3)}deg) scale(${Math.max(0, body.s).toFixed(4)})`
    })

    if (returning && settled) returning = false

    // the row stacks from the centre out; the fan from the middle cards up
    const focus = showing ? 100 + open : hovered

    if (layer !== focus) {
      layer = focus
      elements.forEach((el, i) => {
        el.style.zIndex = showing
          ? String(70 - Math.abs(rel(i, open)))
          : i === hovered
            ? '99'
            : String(poses[i]!.layer)
        el.toggleAttribute('data-active', showing ? i === open : i === hovered)
      })
    }

    if (returning) moving += 1

    // sleep once everything has settled; any input wakes the loop again
    if (moving > 0.02) raf = requestAnimationFrame(frame)
  }

  // marquee slots: evenly spaced on a loop longer than the stage, centred on it
  function place() {
    if (!marquee) return
    const loop = pitch * slots.length

    slots.forEach((slot, i) => {
      slot.x = ((((i * pitch + offset) % loop) + loop) % loop) - loop / 2
    })
  }

  function wake() {
    if (raf) return
    last = performance.now()
    raf = requestAnimationFrame(frame)
  }

  const caption = () => {
    captions.forEach((el, i) => {
      el.toggleAttribute('data-active', i === open)
      el.inert = i !== open
    })
  }

  const openAt = (index: number) => {
    if (open >= 0 || index < 0) return
    hovered = -1
    drag = null
    open = index
    returning = false
    measure()
    root.toggleAttribute('data-cards-open', true)
    carousel?.toggleAttribute('data-open', true)
    caption()
    // focus moves to the caption, but the page must not jump to it
    requestAnimationFrame(() =>
      captions[open]?.querySelector('a')?.focus({ preventScroll: true }),
    )
    wake()
  }

  const goTo = (next: number) => {
    if (open < 0) return
    const target = ((next % n) + n) % n
    const shift = rel(target, open)

    if (!shift) return

    // a card that wraps round is moved a loop's length first, so it slides in
    // from the far side instead of crossing the row
    bodies.forEach((body, i) => {
      const jump = rel(i, target) - rel(i, open) + shift

      if (jump) body.x += jump * geo.pitch
    })

    // focus inside the old caption would fall to the page once it turns inert
    const followFocus = captions.some((el) =>
      el.contains(document.activeElement),
    )

    open = target
    caption()

    if (followFocus)
      captions[open]?.querySelector('a')?.focus({ preventScroll: true })
    layer = -2
    wake()
  }

  const close = () => {
    if (open < 0) return
    const from = elements[open]

    open = -1
    returning = true
    root.toggleAttribute('data-cards-open', false)
    carousel?.toggleAttribute('data-open', false)
    caption()
    from?.focus({ preventScroll: true })
    wake()
  }

  const pick = (event: PointerEvent) => {
    const rect = stage.getBoundingClientRect()
    const px = event.clientX - rect.left - rect.width / 2
    const py = event.clientY - rect.top - rect.height / 2
    let best = -1
    let distance = Infinity

    slots.forEach((slot, i) => {
      const gap = Math.abs(px - slot.x)

      if (gap < distance) {
        distance = gap
        best = i
      }
    })

    const half = size / 2

    if (
      best < 0 ||
      Math.abs(py - slots[best]!.y) > half + 12 ||
      distance > half + 12
    ) {
      return -1
    }

    // hysteresis: keep the current card until the pointer is clearly nearer another
    if (
      hovered >= 0 &&
      hovered !== best &&
      Math.abs(px - slots[hovered]!.x) - distance < 6
    ) {
      return hovered
    }

    return best
  }

  const onMove = (event: PointerEvent) => {
    if (open >= 0 || returning) return

    if (drag && event.pointerId === drag.id) {
      const dx = event.clientX - drag.x
      const dt = Math.max(1, event.timeStamp - drag.at) / 1000

      offset += dx
      // follow the finger, and remember its speed (capped) for the release
      speed = Math.max(-3000, Math.min(3000, -dx / dt))
      drag = {
        ...drag,
        x: event.clientX,
        at: event.timeStamp,
        moved: drag.moved + Math.abs(dx),
      }
      place()
      wake()

      return
    }

    if (event.pointerType === 'touch') return
    const next = pick(event)

    if (next !== hovered) {
      hovered = next
      wake()
    }
  }

  const onLeave = (event: PointerEvent) => {
    if (event.pointerType === 'touch' || hovered === -1) return
    hovered = -1
    wake()
  }

  const onDown = (event: PointerEvent) => {
    suppress = false

    if (open >= 0) {
      swipeFrom = { id: event.pointerId, x: event.clientX }

      return
    }

    const index = pick(event)

    if (marquee) {
      // decide tap or drag on release
      drag = {
        id: event.pointerId,
        x: event.clientX,
        at: event.timeStamp,
        moved: 0,
      }
      speed = 0
      wake()

      return
    }

    squash(index)
    wake()
  }

  // the click squash from BounceCards
  const squash = (index: number) => {
    if (index >= 0 && bodies[index] && !prefersReducedMotion())
      bodies[index].vs -= 2.2
  }

  const onUp = (event: PointerEvent) => {
    if (swipeFrom && event.pointerId === swipeFrom.id) {
      const dx = event.clientX - swipeFrom.x

      swipeFrom = null

      // a swipe moves the row; the click that follows it must not
      if (Math.abs(dx) > swipe) {
        suppress = true
        goTo(open + (dx < 0 ? 1 : -1))
      }

      return
    }

    if (!drag || event.pointerId !== drag.id) return
    const tapped = drag.moved < 6

    // a release long after the last move is a stop, not a flick
    if (event.timeStamp - drag.at > 80) speed = 0
    drag = null

    if (tapped) squash(pick(event))
    else suppress = true

    wake()
  }

  // the browser took the gesture (a vertical page scroll): neither tap nor flick
  const onCancel = (event: PointerEvent) => {
    swipeFrom = null

    if (!drag || event.pointerId !== drag.id) return
    drag = null
    wake()
  }

  const onClick = (event: MouseEvent) => {
    if (!(event.target instanceof Element)) return

    const target = event.target

    if (suppress) {
      suppress = false

      return
    }

    const card = target.closest<HTMLElement>('[data-card]')

    if (card) {
      const index = elements.indexOf(card)

      if (open < 0) openAt(index)
      else if (index === open) close()
      else goTo(index)

      return
    }

    const step = target.closest<HTMLElement>('[data-step]')

    if (step) goTo(open + Number(step.dataset.step))
    else if (target.closest('[data-close], [data-backdrop]')) close()
  }

  const onKey = (event: KeyboardEvent) => {
    if (open < 0 || event.defaultPrevented) return

    if (event.key === 'Escape') close()
    else if (event.key === 'ArrowRight') goTo(open + 1)
    else if (event.key === 'ArrowLeft') goTo(open - 1)
    else return
    event.preventDefault()
  }

  // a horizontal trackpad swipe moves one card per gesture
  const onWheel = (event: WheelEvent) => {
    if (open < 0 || Math.abs(event.deltaX) < 24) return

    if (Math.abs(event.deltaX) < Math.abs(event.deltaY)) return

    if (event.timeStamp - lastWheel < 500) return
    lastWheel = event.timeStamp
    goTo(open + (event.deltaX > 0 ? 1 : -1))
  }

  // keyboard focus lifts a card the way hover does
  const onFocus = (event: FocusEvent) => {
    if (open >= 0 || !(event.target instanceof HTMLElement)) return

    if (!event.target.matches(':focus-visible')) return
    hovered = elements.indexOf(event.target)
    wake()
  }

  const onBlur = () => {
    if (open >= 0 || hovered < 0) return
    hovered = -1
    wake()
  }

  const replay = () => {
    if (open >= 0) return
    entrance = replayDelay
    bodies = []
    hovered = -1
    wake()
  }

  const resize = new ResizeObserver(layout)
  const stopReplay = onReplayCards(replay)

  resize.observe(stage)
  stage.addEventListener('pointermove', onMove)
  stage.addEventListener('pointerleave', onLeave)
  stage.addEventListener('pointerdown', onDown)
  stage.addEventListener('click', onClick)
  stage.addEventListener('focusin', onFocus)
  stage.addEventListener('focusout', onBlur)
  window.addEventListener('pointerup', onUp)
  window.addEventListener('pointercancel', onCancel)
  window.addEventListener('wheel', onWheel, { passive: true })
  document.addEventListener('keydown', onKey)
  layout()
  caption()

  return () => {
    cancelAnimationFrame(raf)
    resize.disconnect()
    stopReplay()
    stage.removeEventListener('pointermove', onMove)
    stage.removeEventListener('pointerleave', onLeave)
    stage.removeEventListener('pointerdown', onDown)
    stage.removeEventListener('click', onClick)
    stage.removeEventListener('focusin', onFocus)
    stage.removeEventListener('focusout', onBlur)
    window.removeEventListener('pointerup', onUp)
    window.removeEventListener('pointercancel', onCancel)
    window.removeEventListener('wheel', onWheel)
    document.removeEventListener('keydown', onKey)
    root.toggleAttribute('data-cards-open', false)
  }
}

const chevron = (d: string) => (
  <svg
    aria-hidden='true'
    fill='none'
    height='18'
    stroke='currentColor'
    strokeLinecap='round'
    strokeLinejoin='round'
    strokeWidth='2'
    viewBox='0 0 24 24'
    width='18'
  >
    <path d={d} />
  </svg>
)

export function BounceCards() {
  return (
    <div
      className='spaceman-cards relative mt-18 min-h-0 flex-1 touch-pan-y select-none'
      ref={mountCards}
    >
      {products.map((product) => (
        <button
          aria-label={`Open ${product.name}`}
          className='spaceman-card'
          data-card
          key={product.id}
          type='button'
        >
          <span aria-hidden='true' className='spaceman-card-well' />
        </button>
      ))}

      <div className='spaceman-carousel' data-carousel>
        <div
          aria-hidden='true'
          className='spaceman-carousel-backdrop'
          data-backdrop
        />
        <button
          aria-label='Previous product'
          className='spaceman-carousel-arrow'
          data-step='-1'
          type='button'
        >
          {chevron('m15 18-6-6 6-6')}
        </button>
        <button
          aria-label='Next product'
          className='spaceman-carousel-arrow'
          data-step='1'
          type='button'
        >
          {chevron('m9 18 6-6-6-6')}
        </button>
        <section
          aria-label='Spaceman products'
          className='spaceman-carousel-captions'
        >
          {products.map((product, i) => (
            <div
              className='spaceman-carousel-caption'
              data-caption
              inert
              key={product.id}
            >
              <p className='text-muted-foreground font-mono text-sm'>
                {String(i + 1).padStart(2, '0')} /{' '}
                {String(products.length).padStart(2, '0')} · {product.domain}
              </p>
              <h2 className='spaceman-carousel-name'>{product.name}</h2>
              <p className='spaceman-tour-lead'>{product.description}</p>
              <div className='spaceman-tour-actions justify-center'>
                <a className='spaceman-tour-visit' href={product.href}>
                  <span>
                    Visit
                    <span className='max-sm:sr-only'> {product.name}</span>
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
                <button className='spaceman-tour-next' data-close type='button'>
                  <span>Back to all</span>
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
