import {
  wordmarkBlocks,
  wordmarkShadow,
  wordmarkViewBox,
} from '@/components/wordmark-paths'
import { footerColumns } from '@/lib/site'

// The sliding footer (after usealia.com): it sits sticky at the bottom of the
// viewport under the page, which lifts away to reveal it.
export function SiteFooter() {
  return (
    <footer
      aria-labelledby='footer-title'
      className='spaceman-footer bg-background text-foreground sticky bottom-0 z-0'
    >
      <div className='spaceman-footer-top mx-auto max-w-[1120px] px-5 pt-[clamp(48px,7vw,88px)] sm:px-8'>
        <h2 className='m-0' id='footer-title'>
          <span className='sr-only'>spaceman.sh</span>
          <svg
            aria-hidden='true'
            className='block h-auto w-full overflow-visible'
            viewBox={wordmarkViewBox}
          >
            <path className='spaceman-wordmark-shadow' d={wordmarkShadow} />
            <path className='fill-foreground' d={wordmarkBlocks} />
          </svg>
        </h2>
        <p className='spaceman-wordmark-tag'>
          Open Source Tools for beautiful user interfaces
        </p>
      </div>

      <div className='mx-auto grid max-w-[1120px] grid-cols-2 gap-x-6 gap-y-10 px-5 pt-[clamp(40px,5vw,64px)] pb-[clamp(56px,8vw,96px)] sm:grid-cols-3 sm:gap-12 sm:px-8'>
        {footerColumns.map((column) => (
          <nav aria-label={column.title} key={column.title}>
            <h3 className='spaceman-footer-heading'>{column.title}</h3>
            <ul className='m-0 flex list-none flex-col gap-0.5 p-0'>
              {column.links.map((link) => (
                <li key={link.label}>
                  <a className='spaceman-footer-link' href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </footer>
  )
}
