'use client'

import { Children, type CSSProperties, type ReactNode, useMemo } from 'react'

import { cn } from '@workspace/ui/lib/utils'

// BounceWrapper gives any children the BounceCards motion, after React Bits'
// BounceCards: a staggered spring pop-in; a fan on a zig-zag line where the
// hovered item straightens and lifts in place while its neighbours slide just
// clear; an endless, draggable marquee where the fan cannot fit; and a click
// that opens a looping carousel of the items. One file: geometry and the few
// exact values are inline styles the engine sets, so nothing else ships.

export type BounceWrapperProps = {
  children: ReactNode
  /** accessible names for the items, in order */
  labels?: string[]
  /** item edge at full size, in px; it shrinks to fit the stage */
  itemSize?: number
  /** below this edge the fan turns into a marquee */
  minItemSize?: number
  /** 'auto' switches below minItemSize; 'always' and 'never' force it */
  marquee?: 'auto' | 'always' | 'never'
  /** overlap between neighbours in the fan, as a share of the item edge */
  overlap?: number
  /** rest tilt per item in degrees; the pattern repeats */
  tilts?: number[]
  /** vertical stagger per item, as a share of `band`; the pattern repeats */
  lifts?: number[]
  /** px the stagger moves at full size */
  band?: number
  /** scale and lift (share of the edge) of the hovered item */
  hoverScale?: number
  hoverLift?: number
  /** centre distance from the hovered item to its neighbours, in item edges */
  hoverGap?: number
  /** seconds before the pop-in, and between items */
  entranceDelay?: number
  stagger?: number
  /** marquee drift in px/s, and the gap between items as a share of the edge */
  marqueeSpeed?: number
  marqueeGap?: number
  /** clicking an item opens the looping carousel */
  carousel?: boolean
  /** what sits under the centred item in the carousel; an element with
   * `data-bounce-close` inside it closes the carousel */
  renderCaption?: (index: number) => ReactNode
  /** attribute set on <html> while the carousel is open; the page's scroll is
   * locked meanwhile */
  openAttribute?: string
  /** change it to replay the pop-in */
  replayKey?: number | string
  className?: string
  style?: CSSProperties
}

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

type Options = Required<
  Omit<
    BounceWrapperProps,
    | 'children'
    | 'labels'
    | 'renderCaption'
    | 'replayKey'
    | 'className'
    | 'style'
  >
>

// React Bits' springs: scale pops (bounciness 0.6), position settles (ratio
// 0.72), and the carousel row lands on a stiffer, nearly critical spring
const popK = 170

const popD = 2 * (1 - 0.85 * 0.6) * Math.sqrt(popK)

const moveK = 210

const carouselK = 300

const carouselD = 2 * 0.8 * Math.sqrt(carouselK)

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const show = (el: HTMLElement | null, on: boolean) => {
  if (!el) return
  el.style.visibility = on ? 'visible' : 'hidden'
  el.style.opacity = on ? '1' : '0'
  el.style.pointerEvents = on ? 'auto' : 'none'
  el.style.transition = on
    ? 'opacity 240ms ease-out 120ms, visibility 0s'
    : 'opacity 140ms ease-out, visibility 0s linear 140ms'
}

function createMount(o: Options) {
  return (stage: HTMLDivElement | null) => {
    if (!stage) return

    const elements = [
      ...stage.querySelectorAll<HTMLElement>('[data-bounce-item]'),
    ]

    const n = elements.length

    if (!n) return

    const controls = [
      ...stage.querySelectorAll<HTMLElement>('[data-bounce-control]'),
    ]

    const arrows = [...stage.querySelectorAll<HTMLElement>('[data-step]')]

    const captionBox = stage.querySelector<HTMLElement>(
      '[data-bounce-captions]',
    )

    const captions = [
      ...stage.querySelectorAll<HTMLElement>('[data-bounce-caption]'),
    ]

    const root = document.documentElement

    // the fan in 1px units at full size; everything scales by size / itemSize
    const unit = o.itemSize
    const middle = (n - 1) / 2

    const poses = elements.map((_, i) => ({
      x: (i - middle) * unit * (1 - o.overlap),
      y: -(o.lifts[i % o.lifts.length] ?? 0) * o.band,
      rotate: o.tilts[i % o.tilts.length] ?? 0,
      layer: (n - Math.abs(2 * i - n + 1)) * n + i,
    }))

    const halfHeights = poses.map(({ rotate }) => {
      const r = (rotate * Math.PI) / 180

      return ((Math.abs(Math.sin(r)) + Math.abs(Math.cos(r))) * unit) / 2
    })

    const top = Math.min(...poses.map((p, i) => p.y - (halfHeights[i] ?? 0)))
    const bottom = Math.max(...poses.map((p, i) => p.y + (halfHeights[i] ?? 0)))
    const centreY = (top + bottom) / 2
    const reach = Math.max(...poses.map((p) => Math.abs(p.x)))
    const fanWidth = reach * 2 + unit
    const fanHeight = bottom - top + 96

    const slots = poses.map(() => ({ x: 0, y: 0, rotate: 0 }))
    const geo = { x: 0, y: 0, scale: 1, pitch: 0 }
    let bodies: Body[] = []
    let size = unit
    let push = 0
    let width = 0
    let height = 0
    let time = 0
    let hovered = -1
    let layer = -2
    let raf = 0
    let last = 0
    let marquee = false
    let pitch = 0
    let offset = 0
    let speed = o.marqueeSpeed
    let drag: { id: number; x: number; at: number; moved: number } | null = null
    let open = -1
    let returning = false
    let suppress = false
    let swipeFrom: { id: number; x: number } | null = null
    let lastWheel = 0

    const rel = (i: number, centre: number) => {
      const d = (((i - centre) % n) + n) % n

      return d > n / 2 ? d - n : d
    }

    // the carousel sits in viewport space; any caption takes the space below
    const measure = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const phone = vw < 640
      const caption = captions.length ? (phone ? 220 : 176) : 0

      const big = Math.min(
        phone ? vw * 0.74 : vw * 0.36,
        vh - caption - 72,
        520,
      )

      const topEdge = Math.max(16, (vh - big - 24 - caption) / 2)
      const rect = stage.getBoundingClientRect()

      geo.x = vw / 2 - rect.left - width / 2
      geo.y = topEdge + big / 2 - rect.top - height / 2
      geo.scale = big / size
      geo.pitch = big * (phone ? 1.1 : 1.22)
      arrows.forEach((el) => {
        el.style.top = `${topEdge + big / 2}px`
      })

      if (captionBox) captionBox.style.top = `${topEdge + big + 24}px`
    }

    const layout = () => {
      width = stage.clientWidth
      height = stage.clientHeight

      // only the width decides the marquee; a short stage shrinks the fan
      const across = (width * unit) / (fanWidth + 64)

      let next = Math.min(
        o.itemSize,
        across,
        height > 0 ? (height * unit) / fanHeight : o.itemSize,
      )

      const wasMarquee = marquee

      marquee =
        o.marquee === 'always' ||
        (o.marquee === 'auto' && across < o.minItemSize)

      if (marquee)
        next = Math.max(
          120,
          Math.min(o.minItemSize + 50, width * 0.42, height * 0.7),
        )

      size = next
      pitch = size * (1 + o.marqueeGap)

      if (marquee && !wasMarquee) offset = pitch * (n / 2 - middle)

      const d = size / unit

      // neighbours slide just clear of the hovered item, kept on the stage
      push = marquee
        ? 0
        : Math.max(
            0,
            Math.min(
              size * o.hoverGap - unit * (1 - o.overlap) * d,
              width / 2 - 16 - size / 2 - reach * d,
            ),
          )
      poses.forEach((pose, i) => {
        slots[i] = {
          x: marquee ? 0 : pose.x * d,
          y: (pose.y - (marquee ? 0 : centreY)) * d,
          rotate: pose.rotate,
        }
      })
      elements.forEach((el) => {
        el.style.width = `${size}px`
        el.style.height = `${size}px`
      })
      place()

      if (open >= 0) measure()
      layer = -2
      wake()
    }

    const frame = (now: number) => {
      raf = 0
      const reduce = prefersReducedMotion()
      const dt = Math.min(1 / 30, Math.max(1 / 240, (now - last) / 1000))
      const substeps = Math.ceil(dt / (1 / 240))
      const h = dt / substeps
      const moveD = 2 * (reduce ? 1 : 0.72) * Math.sqrt(moveK)
      const showing = open >= 0
      const row = showing || returning
      const k = row ? carouselK : moveK
      const damping = row ? carouselD : moveD
      let moving = 0
      let settled = true

      last = now
      time += dt

      if (marquee) {
        const target = hovered >= 0 || reduce || row ? 0 : o.marqueeSpeed

        if (!drag) {
          speed = target + (speed - target) * Math.exp(-dt * 3)
          offset -= speed * dt
        }

        place()
        moving += drag || Math.abs(speed) > 0.5 ? 1 : 0
      }

      const step = (
        v: number,
        vel: number,
        target: number,
        stiffness: number,
        damp: number,
      ) => {
        const next = vel + ((target - v) * stiffness - vel * damp) * h

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

        const appeared =
          reduce || time - body.born >= o.entranceDelay + i * o.stagger

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
            // the hovered item lifts in place, so it stays under the pointer
            ty = slot.y - size * o.hoverLift
            tr = 0
            ts = o.hoverScale
          } else if (!marquee) {
            tx = slot.x + Math.sign(i - hovered) * push
          }
        }

        if (marquee && !row) {
          body.x = tx
          body.vx = 0
        }

        if (reduce && row) {
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

      const focus = showing ? 100 + open : hovered

      if (layer !== focus) {
        layer = focus
        elements.forEach((el, i) => {
          el.style.zIndex = showing
            ? String(70 - Math.abs(rel(i, open)))
            : i === hovered
              ? '99'
              : String(poses[i]?.layer ?? 0)
          el.toggleAttribute(
            'data-active',
            showing ? i === open : i === hovered,
          )
        })
      }

      if (returning) moving += 1

      if (moving > 0.02) raf = requestAnimationFrame(frame)
    }

    // marquee slots: evenly spaced on a loop longer than the stage
    function place() {
      if (!marquee) return
      const loop = pitch * n

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
        const on = i === open

        el.inert = !on
        el.style.opacity = on ? '1' : '0'
        el.style.translate = on ? '0 0' : '0 6px'
        el.style.transition = on
          ? 'opacity 240ms cubic-bezier(0.23, 1, 0.32, 1) 140ms, translate 240ms cubic-bezier(0.23, 1, 0.32, 1) 140ms'
          : 'opacity 160ms ease-out, translate 160ms ease-out'
      })
    }

    const setOpen = (on: boolean) => {
      root.toggleAttribute(o.openAttribute, on)
      root.style.overflow = on ? 'hidden' : ''
      controls.forEach((el) => show(el, on))
    }

    const openAt = (index: number) => {
      if (open >= 0 || index < 0 || !o.carousel) return
      hovered = -1
      drag = null
      open = index
      returning = false
      measure()
      setOpen(true)
      caption()
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

      // an item that wraps round moves a loop's length first, so it slides in
      // from the far side instead of crossing the row
      bodies.forEach((body, i) => {
        const jump = rel(i, target) - rel(i, open) + shift

        if (jump) body.x += jump * geo.pitch
      })

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
      setOpen(false)
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
      const slot = slots[best]

      if (!slot || Math.abs(py - slot.y) > half + 12 || distance > half + 12)
        return -1

      const current = slots[hovered]

      // hysteresis: keep the item until the pointer is clearly nearer another
      if (
        current &&
        hovered !== best &&
        Math.abs(px - current.x) - distance < 6
      )
        return hovered

      return best
    }

    const squash = (index: number) => {
      const body = bodies[index]

      if (body && !prefersReducedMotion()) body.vs -= 2.2
    }

    const onMove = (event: PointerEvent) => {
      if (open >= 0 || returning) return

      if (drag && event.pointerId === drag.id) {
        const dx = event.clientX - drag.x
        const dt = Math.max(1, event.timeStamp - drag.at) / 1000

        offset += dx
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

      if (marquee) {
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

      squash(pick(event))
      wake()
    }

    const onUp = (event: PointerEvent) => {
      if (swipeFrom && event.pointerId === swipeFrom.id) {
        const dx = event.clientX - swipeFrom.x

        swipeFrom = null

        if (Math.abs(dx) > 48) {
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

    const onCancel = (event: PointerEvent) => {
      swipeFrom = null

      if (!drag || event.pointerId !== drag.id) return
      drag = null
      wake()
    }

    // capture: a click on an item opens or moves the carousel before any link
    // inside it navigates
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return
      const target = event.target

      if (suppress) {
        suppress = false
        event.preventDefault()
        event.stopPropagation()

        return
      }

      const item = target.closest<HTMLElement>('[data-bounce-item]')

      if (item && o.carousel) {
        const index = elements.indexOf(item)

        // on the centred item a link does its job; anywhere else folds it back
        if (open >= 0 && index === open) {
          if (!target.closest('a')) close()

          return
        }

        event.preventDefault()
        event.stopPropagation()

        if (open < 0) openAt(index)
        else goTo(index)

        return
      }

      const arrow = target.closest<HTMLElement>('[data-step]')

      if (arrow) goTo(open + Number(arrow.dataset.step))
      else if (target.closest('[data-bounce-close], [data-bounce-backdrop]'))
        close()
    }

    const onKey = (event: KeyboardEvent) => {
      if (open < 0 || event.defaultPrevented) return

      if (event.key === 'Escape') close()
      else if (event.key === 'ArrowRight') goTo(open + 1)
      else if (event.key === 'ArrowLeft') goTo(open - 1)
      else return
      event.preventDefault()
    }

    // a horizontal trackpad swipe moves one item per gesture
    const onWheel = (event: WheelEvent) => {
      if (open < 0 || Math.abs(event.deltaX) < 24) return

      if (Math.abs(event.deltaX) < Math.abs(event.deltaY)) return

      if (event.timeStamp - lastWheel < 500) return
      lastWheel = event.timeStamp
      goTo(open + (event.deltaX > 0 ? 1 : -1))
    }

    // keyboard focus anywhere in an item lifts it the way hover does
    const onFocus = (event: FocusEvent) => {
      if (open >= 0 || !(event.target instanceof HTMLElement)) return

      if (!event.target.matches(':focus-visible')) return
      const item = event.target.closest<HTMLElement>('[data-bounce-item]')

      if (!item) return
      hovered = elements.indexOf(item)
      wake()
    }

    const onBlur = () => {
      if (open >= 0 || hovered < 0) return
      hovered = -1
      wake()
    }

    const resize = new ResizeObserver(layout)

    resize.observe(stage)
    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerleave', onLeave)
    stage.addEventListener('pointerdown', onDown)
    stage.addEventListener('click', onClick, true)
    stage.addEventListener('focusin', onFocus)
    stage.addEventListener('focusout', onBlur)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onCancel)
    window.addEventListener('wheel', onWheel, { passive: true })
    document.addEventListener('keydown', onKey)
    controls.forEach((el) => show(el, false))
    layout()
    caption()

    return () => {
      cancelAnimationFrame(raf)
      resize.disconnect()
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerleave', onLeave)
      stage.removeEventListener('pointerdown', onDown)
      stage.removeEventListener('click', onClick, true)
      stage.removeEventListener('focusin', onFocus)
      stage.removeEventListener('focusout', onBlur)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onCancel)
      window.removeEventListener('wheel', onWheel)
      document.removeEventListener('keydown', onKey)
      root.toggleAttribute(o.openAttribute, false)
      root.style.overflow = ''
    }
  }
}

const arrowClasses =
  'bg-card text-foreground shadow-float hover:bg-muted fixed z-80 inline-flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 p-0 active:scale-94 lg:size-14'

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

const hidden: CSSProperties = { visibility: 'hidden', opacity: 0 }

export function BounceWrapper({
  children,
  labels = [],
  itemSize = 248,
  minItemSize = 150,
  marquee = 'auto',
  overlap = 0.125,
  tilts = [-6, 5, -3, 6, -4],
  lifts = [-0.45, 0.35, -0.2, 0.3, -0.35],
  band = 24,
  hoverScale = 1.06,
  hoverLift = 0.04,
  hoverGap = 1.12,
  entranceDelay = 0.5,
  stagger = 0.06,
  marqueeSpeed = 32,
  marqueeGap = 0.1,
  carousel = true,
  renderCaption,
  openAttribute = 'data-bounce-open',
  replayKey,
  className,
  style,
}: BounceWrapperProps) {
  const items = Children.toArray(children)
  const tiltKey = tilts.join()
  const liftKey = lifts.join()

  // the engine remounts when a setting, the item count or replayKey changes
  const mount = useMemo(
    () =>
      createMount({
        itemSize,
        minItemSize,
        marquee,
        overlap,
        tilts: tiltKey.split(',').map(Number),
        lifts: liftKey.split(',').map(Number),
        band,
        hoverScale,
        hoverLift,
        hoverGap,
        entranceDelay,
        stagger,
        marqueeSpeed,
        marqueeGap,
        carousel,
        openAttribute,
      }),
    // the item count and replayKey remount the engine too
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- they are read from the DOM and by intent
    [
      itemSize,
      minItemSize,
      marquee,
      overlap,
      tiltKey,
      liftKey,
      band,
      hoverScale,
      hoverLift,
      hoverGap,
      entranceDelay,
      stagger,
      marqueeSpeed,
      marqueeGap,
      carousel,
      openAttribute,
      items.length,
      replayKey,
    ],
  )

  return (
    <div
      className={cn('relative min-h-0 touch-pan-y select-none', className)}
      ref={mount}
      style={{ WebkitTapHighlightColor: 'transparent', ...style }}
    >
      {items.map((item, i) => (
        <div
          aria-label={carousel && labels[i] ? `Open ${labels[i]}` : undefined}
          className='absolute top-0 left-0 *:size-full'
          data-bounce-item
          key={i}
          style={{
            width: itemSize,
            height: itemSize,
            transform: 'translate(-50%, -50%) scale(0)',
            willChange: 'transform',
          }}
        >
          {item}
        </div>
      ))}

      {carousel ? (
        <>
          <div
            aria-hidden='true'
            className='fixed inset-0 z-40'
            data-bounce-backdrop
            data-bounce-control
            style={hidden}
          />
          <button
            aria-label='Previous'
            className={cn(arrowClasses, 'left-4 lg:left-8')}
            data-bounce-control
            data-step='-1'
            style={hidden}
            type='button'
          >
            {chevron('m15 18-6-6 6-6')}
          </button>
          <button
            aria-label='Next'
            className={cn(arrowClasses, 'right-4 lg:right-8')}
            data-bounce-control
            data-step='1'
            style={hidden}
            type='button'
          >
            {chevron('m9 18 6-6-6-6')}
          </button>
          {renderCaption ? (
            <section
              aria-label='Item details'
              className='fixed inset-x-5 z-80 mx-auto grid max-w-140'
              data-bounce-captions
              data-bounce-control
              style={hidden}
            >
              {items.map((_, i) => (
                <div
                  className='col-start-1 row-start-1 flex flex-col items-center gap-2.5 text-center'
                  data-bounce-caption
                  inert
                  key={i}
                  style={{ opacity: 0 }}
                >
                  {renderCaption(i)}
                </div>
              ))}
            </section>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
