import type { RefObject } from 'react'

// calls onOutside for a click outside every ref; returns the cleanup
export function onOutsideClick(
  refs: RefObject<HTMLElement | null>[],
  onOutside: () => void,
  ignore?: string,
) {
  // the click that activated this can still be bubbling to the document
  const activatedAt = performance.now()

  // click, not pointerdown, so a touch that starts a scroll does not count
  const onClick = (event: MouseEvent) => {
    if (event.timeStamp <= activatedAt) return

    const target = event.target

    if (!(target instanceof Element)) return

    if (ignore && target.closest(ignore)) return

    if (refs.every((ref) => !ref.current?.contains(target))) onOutside()
  }

  document.addEventListener('click', onClick)

  return () => document.removeEventListener('click', onClick)
}
