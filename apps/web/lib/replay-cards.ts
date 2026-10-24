const replayEvent = 'spaceman:replay-cards'

export function replayCards() {
  document.dispatchEvent(new Event(replayEvent))
}

export function onReplayCards(listener: () => void) {
  document.addEventListener(replayEvent, listener)

  return () => document.removeEventListener(replayEvent, listener)
}
