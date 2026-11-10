'use client'

import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import Link from 'next/link'
import { useCallback, useId, useRef, useState } from 'react'

import { CardFace, type GalleryItem } from '@/components/gallery-card'
import { onOutsideClick } from '@/lib/outside-click'
import { cn } from '@workspace/ui/lib/utils'

// the first three cards fan out like prints dropped on a desk;
// offsets are percentages of the card so the fan fits a 320px column
const fan = [
  { rotate: -12, x: -38, y: 4, zIndex: 10 },
  { rotate: -3, x: -4, y: -6, zIndex: 20 },
  { rotate: 10, x: 31, y: 2, zIndex: 30 },
]

// fewer cards would sit off-centre in the three-card fan
const fanFor = (count: number) =>
  count === 1
    ? [{ rotate: 0, x: 0, y: 0, zIndex: 10 }]
    : count === 2
      ? [
          { rotate: -6, x: -18, y: 2, zIndex: 10 },
          { rotate: 6, x: 18, y: -2, zIndex: 20 },
        ]
      : fan

const spring = { type: 'spring', stiffness: 160, damping: 18, mass: 1 } as const

// the site nav floats over the page, so using it never closes the gallery
const keepOpen = 'nav'

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export type { GalleryItem }

export function ExpandableGallery({
  items,
  title,
  action,
  className,
}: {
  items: GalleryItem[]
  title: React.ReactNode
  action: string
  className?: string
}) {
  const [expanded, setExpanded] = useState(false)
  const layoutGroupId = useId()
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLButtonElement>(null)

  // the grid grows past the fold, so bring its top row and the back button into view
  const bringIntoView = () => {
    const behavior = prefersReducedMotion() ? 'instant' : 'smooth'

    requestAnimationFrame(() =>
      sectionRef.current?.scrollIntoView({ block: 'start', behavior }),
    )
  }

  const open = () => {
    if (expanded) return
    setExpanded(true)
    bringIntoView()
  }

  const close = () => {
    // hold the expanded height so a short page does not clamp the scroll and jump
    const section = sectionRef.current

    if (section) {
      section.style.minHeight = `${section.offsetHeight}px`
      window.setTimeout(() => section.style.removeProperty('min-height'), 700)
    }

    setExpanded(false)
    bringIntoView()
  }

  // escape and an outside click close the grid while it is open
  const mountSection = useCallback(
    (node: HTMLElement | null) => {
      sectionRef.current = node

      if (!node || !expanded) return

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') close()
      }

      const stopOutside = onOutsideClick(
        [containerRef, backRef],
        close,
        keepOpen,
      )

      document.addEventListener('keydown', onKeyDown)

      return () => {
        document.removeEventListener('keydown', onKeyDown)
        stopOutside()
      }
    },
    // close reads only refs and the expanded flag
    [expanded],
  )

  if (items.length === 0) return null

  const poses = fanFor(items.length)

  return (
    <section
      className={cn(
        'relative flex w-full scroll-mt-6 flex-col items-center',
        className,
      )}
      ref={mountSection}
    >
      <LayoutGroup id={layoutGroupId}>
        <div className='flex h-11 w-full items-center'>
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.button
                animate={{ opacity: 1, x: 0 }}
                className='group/back text-muted-foreground hover:text-foreground focus-visible:outline-ring inline-flex min-h-11 cursor-pointer items-center gap-2 pr-2 text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2'
                exit={{ opacity: 0, x: -8, transition: { duration: 0.15 } }}
                initial={{ opacity: 0, x: -8 }}
                key='back'
                onClick={close}
                ref={(node) => {
                  backRef.current = node
                  node?.focus({ preventScroll: true })
                }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                type='button'
              >
                <span className='bg-muted text-foreground group-hover/back:bg-accent grid size-8 place-items-center transition duration-150 group-active/back:scale-96'>
                  <ArrowLeft
                    aria-hidden='true'
                    className='size-4'
                    strokeWidth={1.75}
                  />
                </span>
                Back
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          className={cn(
            'relative w-full',
            expanded
              ? 'grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3'
              : 'flex flex-col items-center',
          )}
          layout
          ref={containerRef}
          transition={spring}
        >
          <div
            className={cn(
              expanded
                ? 'contents'
                : 'relative mb-6 flex h-72 w-full items-center justify-center sm:h-96',
            )}
          >
            {items.map((item, index) => {
              const stacked = index < poses.length

              if (!stacked && !expanded) return null

              const pose = poses[index] ?? {
                rotate: 0,
                x: 0,
                y: 0,
                zIndex: index,
              }

              const face = (
                <CardFace expanded={expanded} index={index} item={item} />
              )

              return (
                <motion.div
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: expanded ? 0 : pose.rotate,
                    x: expanded ? '0%' : `${pose.x}%`,
                    y: expanded ? '0%' : `${pose.y}%`,
                    zIndex: expanded ? 10 : pose.zIndex,
                  }}
                  aria-hidden={expanded ? undefined : true}
                  className={cn(
                    'bg-muted outline-foreground/10 overflow-hidden outline-1 -outline-offset-1',
                    expanded
                      ? 'border-background relative aspect-square rounded-2xl border-4 shadow-md'
                      : 'border-background absolute size-40 cursor-pointer rounded-3xl border-6 sm:size-56',
                  )}
                  data-gallery-card
                  data-stacked={expanded ? undefined : ''}
                  initial={{ opacity: 0, scale: 0.9 }}
                  key={item.id}
                  layout
                  layoutId={`card-${item.id}`}
                  onClick={expanded ? undefined : open}
                  // cards that join the grid fade in one after another
                  transition={{
                    ...spring,
                    opacity: {
                      duration: 0.2,
                      delay: stacked ? 0 : (index - poses.length) * 0.05,
                    },
                  }}
                  whileHover={
                    expanded
                      ? { scale: 1.02 }
                      : {
                          scale: 1.05,
                          y: `${pose.y - 6}%`,
                          rotate: pose.rotate * 0.8,
                          zIndex: 50,
                          transition: {
                            type: 'spring',
                            stiffness: 400,
                            damping: 25,
                          },
                        }
                  }
                  whileTap={expanded ? undefined : { scale: 0.97 }}
                >
                  {expanded && item.href ? (
                    <Link
                      className='focus-visible:outline-ring absolute inset-0 focus-visible:outline-2 focus-visible:-outline-offset-4'
                      href={item.href}
                    >
                      {face}
                      <ArrowUpRight
                        aria-hidden='true'
                        className='text-muted-foreground absolute top-4 right-4 size-4'
                        strokeWidth={1.75}
                      />
                    </Link>
                  ) : (
                    face
                  )}
                </motion.div>
              )
            })}
          </div>

          <AnimatePresence initial={false}>
            {!expanded && (
              <motion.div
                animate={{ opacity: 1 }}
                className='max-w-xl space-y-6 text-center'
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                initial={{ opacity: 0 }}
                key='stack-copy'
              >
                <div className='text-foreground/90 text-xl leading-snug font-medium tracking-tight text-balance sm:text-2xl'>
                  {title}
                </div>
                <button
                  className='group/open bg-foreground text-background focus-visible:outline-ring inline-flex min-h-11 cursor-pointer items-center gap-2 px-6 text-sm font-medium transition duration-150 ease-out hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-96'
                  onClick={open}
                  type='button'
                >
                  {action}
                  <ArrowRight
                    aria-hidden='true'
                    className='size-4 transition-transform duration-150 ease-out group-hover/open:translate-x-0.5'
                    strokeWidth={1.75}
                  />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
    </section>
  )
}
