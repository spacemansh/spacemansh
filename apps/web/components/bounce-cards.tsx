'use client'

import { onReplayCards } from '@/lib/replay-cards'
import { products } from '@/lib/site'

// Square frames on a straight line, one per product, with a zig-zag tilt and stagger, moved
// by React Bits' BounceCards physics (reactbits.dev/components/bounce-cards):
// a staggered pop-in, and the hovered card straightens, lifts and scales while
// its neighbours slide aside. Geometry is in 288px card units.
//
// Where the fan no longer fits at a legible size, the same cards run as an
// endless marquee instead: they drift left, follow a drag or flick, and a tap
// holds a card forward and stops the drift until the next tap.
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
  const slots = poses.map(() => ({ x: 0, y: 0, rotate: 0 }))
  let bodies: Body[] = []
  let size = 248
  let push = 0
  let width = 0
  let height = 0
  let time = 0
  let hovered = -1
  let layer = -2
  let touch = false
  let raf = 0
  let last = 0
  let entrance = delay
  let marquee = false
  let pitch = 0
  let offset = 0
  let speed = drift
  let drag: { id: number; x: number; at: number; moved: number } | null = null

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
    let moving = 0

    last = now
    time += dt

    if (marquee) {
      // a held card or a reduced-motion preference stops the drift; a flick
      // eases back to it
      const target = hovered >= 0 || reduce ? 0 : drift

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

      if (hovered >= 0 && appeared) {
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
      if (marquee) {
        body.x = tx
        body.vx = 0
      }

      for (let k = 0; k < substeps; k++) {
        if (!marquee)
          [body.x, body.vx] = step(body.x, body.vx, tx, moveK, moveD)
        ;[body.y, body.vy] = step(body.y, body.vy, ty, moveK, moveD)
        ;[body.r, body.vr] = step(body.r, body.vr, tr, moveK, moveD)

        if (reduce) {
          body.s = ts
          body.vs = 0
        } else {
          ;[body.s, body.vs] = step(body.s, body.vs, ts, popK, popD)
        }
      }

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

    if (layer !== hovered) {
      layer = hovered
      elements.forEach((el, i) => {
        el.style.zIndex = i === hovered ? '99' : String(poses[i]!.layer)
        el.toggleAttribute('data-active', i === hovered)
      })
    }

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

  // Touch has no hover: a tap brings a card forward until the next tap.
  const onDown = (event: PointerEvent) => {
    const index = pick(event)

    if (event.pointerType === 'touch') touch = true

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

    if (event.pointerType === 'touch') hovered = index === hovered ? -1 : index
    squash(index)
    wake()
  }

  // the click squash from BounceCards
  const squash = (index: number) => {
    if (index >= 0 && bodies[index] && !prefersReducedMotion())
      bodies[index].vs -= 2.2
  }

  const onUp = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.id) return
    const tapped = drag.moved < 6

    // a release long after the last move is a stop, not a flick
    if (event.timeStamp - drag.at > 80) speed = 0
    drag = null

    if (tapped) {
      const index = pick(event)

      if (event.pointerType === 'touch')
        hovered = index === hovered ? -1 : index
      squash(index)
    }

    wake()
  }

  // the browser took the gesture (a vertical page scroll): neither tap nor flick
  const onCancel = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.id) return
    drag = null
    wake()
  }

  const onOutside = (event: PointerEvent) => {
    if (
      !touch ||
      hovered === -1 ||
      (event.target instanceof Node && stage.contains(event.target))
    ) {
      return
    }

    hovered = -1
    wake()
  }

  const replay = () => {
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
  window.addEventListener('pointerup', onUp)
  window.addEventListener('pointercancel', onCancel)
  document.addEventListener('pointerdown', onOutside)
  layout()

  return () => {
    cancelAnimationFrame(raf)
    resize.disconnect()
    stopReplay()
    stage.removeEventListener('pointermove', onMove)
    stage.removeEventListener('pointerleave', onLeave)
    stage.removeEventListener('pointerdown', onDown)
    window.removeEventListener('pointerup', onUp)
    window.removeEventListener('pointercancel', onCancel)
    document.removeEventListener('pointerdown', onOutside)
  }
}

export function BounceCards() {
  return (
    <div
      aria-hidden='true'
      className='spaceman-cards relative mt-18 min-h-0 flex-1 touch-pan-y select-none'
      ref={mountCards}
    >
      {cards.map((card) => (
        <div className='spaceman-card' data-card key={card.id}>
          <div className='spaceman-card-well' />
        </div>
      ))}
    </div>
  )
}
