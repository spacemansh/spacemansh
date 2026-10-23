const label = 'Explore'

const letters = Array.from(label)

// Two stacked copies of the label: on hover each letter of the top copy rolls
// up and out while the bottom copy rolls in, 20ms apart (after usealia.com).
function Face({ className }: { className: string }) {
  return (
    <span aria-hidden='true' className={className}>
      {letters.map((letter, i) => (
        <span key={`${letter}-${i}`} style={{ transitionDelay: `${i * 20}ms` }}>
          {letter}
        </span>
      ))}
    </span>
  )
}

/** The Explore label with its letter roll; the button around it owns the action. */
export function ExploreButtonFace() {
  return (
    <span className='spaceman-roll'>
      <span className='sr-only'>{label}</span>
      <span aria-hidden='true' className='invisible block whitespace-nowrap'>
        {label}
      </span>
      <Face className='spaceman-roll-face' />
      <Face className='spaceman-roll-face spaceman-roll-under' />
    </span>
  )
}
