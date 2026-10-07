'use client'

import { Activity } from 'lucide-react'
import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'spaceman-motion'

const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

const getSnapshot = () => document.documentElement.dataset.motion !== 'reduced'

const getServerSnapshot = () => true

/**
 * Switches site animation on and off. The choice lives on <html> as
 * `data-motion="reduced"`, which globals.css treats like
 * prefers-reduced-motion; the layout restores it before first paint.
 */
export function MotionToggle() {
  const enabled = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  )

  function toggle() {
    const root = document.documentElement

    if (enabled) {
      root.dataset.motion = 'reduced'
    } else {
      delete root.dataset.motion
    }

    try {
      localStorage.setItem(STORAGE_KEY, enabled ? 'reduced' : 'full')
    } catch {
      // Storage can be unavailable (private mode); the switch still applies.
    }

    listeners.forEach((listener) => listener())
  }

  return (
    <button
      aria-label='Animation'
      aria-pressed={enabled}
      className="spaceman-pressable text-muted-foreground hover:bg-muted aria-pressed:text-primary-ink relative grid size-8 cursor-pointer place-items-center rounded-md after:absolute after:-inset-1 after:content-['']"
      onClick={toggle}
      title={enabled ? 'Motion: on' : 'Motion: off'}
      type='button'
    >
      <Activity aria-hidden='true' className='size-[15px]' />
    </button>
  )
}
