'use client'

import { useCallback, useState } from 'react'

import './text-flip.css'

// After chanhdai.com/components/text-flip: every 2s the old word exits
// (y 40%, fade, 1px blur, 300ms) and then the next one enters from y -20%.
// Every word sits in the same grid cell, so the slot is always as wide as the
// longest word and the line never reflows.
export function TextFlip({ words }: { words: readonly string[] }) {
  const [{ index, previous }, setFlip] = useState({
    index: 0,
    previous: -1,
  })

  const startTimer = useCallback(
    (node: HTMLSpanElement | null) => {
      if (!node) return

      const timer = setInterval(() => {
        if (document.hidden) return
        setFlip((current) => ({
          index: (current.index + 1) % words.length,
          previous: current.index,
        }))
      }, 2000)

      return () => clearInterval(timer)
    },
    [words.length],
  )

  return (
    <span
      className='inline-grid align-baseline whitespace-nowrap'
      ref={startTimer}
    >
      {words.map((word, i) => (
        <span
          className='col-start-1 row-start-1 justify-self-start opacity-0'
          data-flip-word
          data-state={
            i === index
              ? previous === -1
                ? 'on'
                : 'in'
              : i === previous
                ? 'out'
                : undefined
          }
          key={word}
        >
          {word}
        </span>
      ))}
    </span>
  )
}
