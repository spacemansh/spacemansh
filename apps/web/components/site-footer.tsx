import {
  wordmarkBlocks,
  wordmarkShadow,
  wordmarkViewBox,
} from '@/components/wordmark-paths'
import { footerColumns } from '@/lib/site'

import './site-footer.css'

// The sliding footer (after usealia.com): it sits sticky at the bottom of the
// viewport under the page, which lifts away to reveal it.
export function SiteFooter() {
  return (
    <footer
      aria-labelledby='footer-title'
      className='bg-background text-foreground sticky bottom-0 z-0'
      data-footer
    >
      <div className='pt-footer-top @container mx-auto max-w-280 px-5 sm:px-8'>
        <h2 className='m-0' id='footer-title'>
          <span className='sr-only'>spaceman.sh</span>
          <svg
            aria-hidden='true'
            className='block h-auto w-full overflow-visible'
            viewBox={wordmarkViewBox}
          >
            <path
              className='stroke-muted-foreground fill-none'
              d={wordmarkShadow}
              strokeWidth={0.7}
            />
            <path className='fill-foreground' d={wordmarkBlocks} />
          </svg>
        </h2>
        <p className='mt-tagline text-tagline font-mono font-medium uppercase'>
          Open Source Tools for beautiful user interfaces
        </p>
      </div>

      <div className='pt-footer-gap pb-footer-end mx-auto grid max-w-280 grid-cols-2 gap-x-6 gap-y-10 px-5 sm:grid-cols-3 sm:gap-12 sm:px-8'>
        {footerColumns.map((column) => (
          <nav aria-label={column.title} key={column.title}>
            <h3 className='text-overline text-muted-foreground after:bg-border-strong mb-4.5 font-medium uppercase after:mt-3.5 after:block after:h-px after:w-6'>
              {column.title}
            </h3>
            <ul className='m-0 flex list-none flex-col gap-0.5 p-0'>
              {column.links.map((link) => (
                <li key={link.label}>
                  <a
                    className='text-link text-foreground hover:decoration-primary-ink inline-block py-1.25 underline decoration-transparent underline-offset-4 transition-colors duration-160'
                    href={link.href}
                  >
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
