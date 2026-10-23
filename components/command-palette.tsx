'use client'

import { Search } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'

import { siteLinks } from '@/lib/site'
import { cn } from '@/lib/utils'

type PaletteItem = {
  group: string
  name: string
  meta?: string
  /** Planned items have no destination yet and cannot be opened. */
  href?: string
}

const items: PaletteItem[] = [
  {
    group: 'Themes',
    name: 'Theme picker',
    meta: 'new',
    href: '/#theme-picker',
  },
  { group: 'Themes', name: 'Theme toggle', href: '/#theme-toggle' },
  { group: 'Docs', name: 'Catalogue', href: '/#catalogue' },
  {
    group: 'Docs',
    name: 'Install the namespace',
    href: siteLinks.installGuide,
  },
  { group: 'Motion', name: 'Reveal', meta: 'soon' },
  { group: 'Loaders', name: 'Spinner', meta: 'soon' },
  { group: 'Blocks', name: 'Pricing table', meta: 'soon' },
]

function search(query: string) {
  const q = query.trim().toLowerCase()

  if (!q) return items

  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.group.toLowerCase().includes(q),
  )
}

/**
 * Header search button and the ⌘K / Ctrl+K palette it opens.
 *
 * The palette is a native modal <dialog>, which supplies the focus trap, Esc
 * to close and the inert page behind it. It opens without animation: it is
 * summoned from the keyboard many times a day.
 */
export function CommandPalette() {
  const dialog = useRef<HTMLDialogElement | null>(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const results = search(query)

  function open() {
    setQuery('')
    setActive(0)
    dialog.current?.showModal()
  }

  function close() {
    dialog.current?.close()
  }

  function go(item: PaletteItem | undefined) {
    if (!item?.href) return
    close()
    window.location.assign(item.href)
  }

  // Registers the global shortcut for as long as the dialog is mounted, using
  // the ref-callback cleanup React 19 supports instead of an effect.
  const dialogRef = useCallback((node: HTMLDialogElement | null) => {
    dialog.current = node

    if (!node) return

    function onKeyDown(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k')
        return
      event.preventDefault()

      if (node?.open) {
        node.close()
      } else {
        setQuery('')
        setActive(0)
        node?.showModal()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      <button
        aria-keyshortcuts='Meta+K Control+K'
        aria-label='Search'
        className='spaceman-pressable border-border bg-input text-muted-foreground hover:border-border-strong hover:text-foreground flex h-8 cursor-pointer items-center gap-2 rounded-lg border px-2.5 text-[12.5px] sm:pr-2'
        onClick={open}
        type='button'
      >
        <Search aria-hidden='true' className='size-3.5' />
        <span className='max-sm:hidden'>Search</span>
        <kbd className='border-border bg-background rounded border px-[5px] py-0.5 font-mono text-[10px] font-medium max-sm:hidden'>
          ⌘K
        </kbd>
      </button>

      {/* Closing on a backdrop click is a pointer-only convenience; keyboard
          users close the modal dialog with Esc, which the element handles. */}
      {/* oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <dialog
        aria-label='Search components and docs'
        className='border-border bg-background text-foreground shadow-lift backdrop:bg-background/70 m-0 mx-auto mt-[11vh] w-[calc(100%-40px)] max-w-[520px] overflow-hidden rounded-xl border p-0 backdrop:backdrop-blur-[2px]'
        onClick={(event) => {
          if (event.target === event.currentTarget) close()
        }}
        ref={dialogRef}
      >
        <div className='border-border flex items-center gap-2.5 border-b px-3.5 py-3'>
          <Search
            aria-hidden='true'
            className='text-muted-foreground size-[15px] flex-none'
          />
          <input
            aria-activedescendant={
              results[active] ? `palette-${active}` : undefined
            }
            aria-controls='palette-results'
            autoFocus
            className='text-foreground placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-[13.5px] outline-none'
            onChange={(event) => {
              setQuery(event.target.value)
              setActive(0)
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault()
                setActive((i) => Math.min(i + 1, results.length - 1))
              } else if (event.key === 'ArrowUp') {
                event.preventDefault()
                setActive((i) => Math.max(i - 1, 0))
              } else if (event.key === 'Enter') {
                event.preventDefault()
                go(results[active])
              }
            }}
            placeholder='Search components and docs'
            role='combobox'
            aria-expanded='true'
            value={query}
          />
          <kbd className='border-border text-muted-foreground rounded border px-[5px] py-0.5 font-mono text-[10px] font-medium'>
            esc
          </kbd>
        </div>

        {/* An ARIA combobox popup: native <select> and <datalist> cannot hold
            linked, grouped rows, so the listbox and option roles are deliberate. */}
        <div
          className='max-h-[min(56vh,340px)] overflow-y-auto p-1.5'
          id='palette-results'
          // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
          role='listbox'
        >
          {results.length === 0 ? (
            <p className='text-muted-foreground px-3 py-6 text-center text-[12.5px]'>
              No matches
            </p>
          ) : (
            results.map((item, index) => (
              <a
                aria-disabled={item.href ? undefined : true}
                aria-selected={index === active}
                className={cn(
                  'hover:bg-muted flex items-center gap-3 rounded-lg px-2.5 py-[9px] text-[13.5px]',
                  index === active && 'bg-muted',
                  !item.href && 'cursor-default opacity-55',
                )}
                href={item.href}
                id={`palette-${index}`}
                key={item.name}
                onClick={(event) => {
                  event.preventDefault()
                  go(item)
                }}
                onMouseMove={() => setActive(index)}
                // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
                role='option'
              >
                <span className='text-muted-foreground w-16 flex-none font-mono text-[10.5px] tracking-[0.06em] uppercase'>
                  {item.group}
                </span>
                <span>{item.name}</span>
                {item.meta ? (
                  <span className='text-muted-foreground ml-auto font-mono text-[10.5px]'>
                    {item.meta}
                  </span>
                ) : null}
              </a>
            ))
          )}
        </div>
      </dialog>
    </>
  )
}
