'use client'

import { type MouseEvent, useRef, useState } from 'react'
import { useNextUITheme } from 'uitheme-web/react'

import { cn } from '@workspace/ui/lib/utils'

type Mode = 'system' | 'light' | 'dark'

const names: Record<Mode, string> = {
  system: 'System',
  light: 'Light',
  dark: 'Dark',
}

const chars = '!@#$%^&*():{};|,.<>/?'

const cyclesPerLetter = 2

const steadyLetters = 3

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const randomChar = () => chars[Math.floor(Math.random() * chars.length)] ?? ''

export type ThemeToggleProps = {
  system?: boolean

  duration?: number

  shuffle?: number
  className?: string
}

export function ThemeToggle({
  system = false,
  duration = 400,
  shuffle = 50,
  className,
}: ThemeToggleProps) {
  const { theme, resolvedTheme, switchTheme } = useNextUITheme()
  const modes: Mode[] = system ? ['system', 'light', 'dark'] : ['light', 'dark']

  const current: Mode =
    theme === 'light' || theme === 'dark' || (system && theme === 'system')
      ? theme
      : resolvedTheme

  const next = modes[(modes.indexOf(current) + 1) % modes.length] ?? 'light'
  const label = names[current]
  const [text, setText] = useState<string | null>(null)
  const timer = useRef(0)

  const stop = () => {
    window.clearInterval(timer.current)
    setText(null)
  }

  const shimmer = () => {
    window.clearInterval(timer.current)

    if (prefersReducedMotion()) return
    timer.current = window.setInterval(() => {
      setText(
        Array.from(label)
          .map((char, index) => (index < steadyLetters ? char : randomChar()))
          .join(''),
      )
    }, shuffle)
  }

  const scramble = (target: string, from: number, step: number) => {
    window.clearInterval(timer.current)

    if (prefersReducedMotion()) return

    let pos = from * cyclesPerLetter

    timer.current = window.setInterval(() => {
      setText(
        Array.from(target)
          .map((char, index) =>
            index < from || pos / cyclesPerLetter > index ? char : randomChar(),
          )
          .join(''),
      )
      pos++

      if (pos >= target.length * cyclesPerLetter) stop()
    }, step)
  }

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    const target = names[next]
    scramble(
      target,
      0,
      Math.max(16, duration / (target.length * cyclesPerLetter)),
    )
    void switchTheme(next, {
      element: event.currentTarget,
      animationOff: event.detail === 0,
    })
  }

  return (
    <button
      aria-label={`Theme: ${label}. Switch to ${names[next]}`}
      className={cn(
        'text-nav text-foreground/34 hover:text-foreground focus-visible:text-foreground inline-flex h-13 cursor-pointer items-center rounded-full border-0 bg-transparent px-4 font-semibold transition-colors duration-180',
        className,
      )}
      onBlur={stop}
      onClick={onClick}
      onFocus={shimmer}
      onMouseEnter={shimmer}
      onMouseLeave={stop}
      type='button'
    >
      <span aria-hidden='true' className='inline-grid'>
        {modes.map((mode) => (
          <span className='invisible col-start-1 row-start-1' key={mode}>
            {names[mode]}
          </span>
        ))}
        <span className='col-start-1 row-start-1'>{text ?? label}</span>
      </span>
    </button>
  )
}
