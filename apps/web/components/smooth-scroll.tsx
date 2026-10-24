'use client'

// Eased wheel scrolling after usealia.com (Lenis { lerp: 0.08 }): wheel input
// moves a target and the page closes 8% of the gap per 60fps frame, so the hero
// lifts off the sticky footer smoothly. Keyboard, scrollbar and touch stay
// native; reduced motion turns it off.
const lerp = 0.08

function mountSmoothScroll(node: HTMLDivElement | null) {
  if (!node) return

  let target = window.scrollY
  let current = target
  let raf = 0
  let last = 0

  const step = (now: number) => {
    const dt = Math.min(0.064, (now - last) / 1000)

    last = now
    current += (target - current) * (1 - Math.exp(-lerp * 60 * dt))

    if (Math.abs(target - current) < 0.5) current = target
    window.scrollTo(0, current)
    raf = current === target ? 0 : requestAnimationFrame(step)
  }

  const onWheel = (event: WheelEvent) => {
    if (
      event.ctrlKey ||
      // the Explore tour handles its own wheel input
      document.documentElement.classList.contains('spaceman-tour-open') ||
      document.documentElement.hasAttribute('data-cards-open') ||
      Math.abs(event.deltaX) > Math.abs(event.deltaY) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    const max = document.documentElement.scrollHeight - window.innerHeight

    if (max <= 0) return
    event.preventDefault()

    const scale =
      event.deltaMode === 1
        ? 16
        : event.deltaMode === 2
          ? window.innerHeight
          : 1

    if (!raf) target = current = window.scrollY
    target = Math.max(0, Math.min(max, target + event.deltaY * scale))

    if (raf) return
    last = performance.now()
    raf = requestAnimationFrame(step)
  }

  // a native scroll (keys, scrollbar, touch) resyncs the target
  const onScroll = () => {
    if (!raf) target = current = window.scrollY
  }

  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('scroll', onScroll, { passive: true })

  return () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('wheel', onWheel)
    window.removeEventListener('scroll', onScroll)
  }
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return <div ref={mountSmoothScroll}>{children}</div>
}
