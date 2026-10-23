// The Explore button and the cards live in separate client islands; a DOM
// event lets the button replay the cards' entrance without lifting state into
// a shared client parent (which would pull the server-rendered hero with it).
const replayEvent = 'spaceman:replay-cards'

export function replayCards() {
  document.dispatchEvent(new Event(replayEvent))
}

export function onReplayCards(listener: () => void) {
  document.addEventListener(replayEvent, listener)

  return () => document.removeEventListener(replayEvent, listener)
}
