import { BounceCards } from '@/components/bounce-cards'
import { ProductTour } from '@/components/product-tour'
import { SiteFooter } from '@/components/site-footer'
import { SmoothScroll } from '@/components/smooth-scroll'
import { StructuredData } from '@/components/structured-data'
import { TextFlip } from '@/components/text-flip'
import { githubUrl, heroProducts } from '@/lib/site'

export default function Page() {
  return (
    <SmoothScroll>
      <StructuredData />
      <nav
        aria-label='Site'
        className='spaceman-recede absolute top-4 right-4 z-40 flex gap-1'
      >
        <a className='spaceman-nav-link' href={githubUrl}>
          GitHub
        </a>
      </nav>

      <main className='bg-background relative z-10 shadow-[0_1px_0_var(--border)]'>
        <div className='flex h-dvh flex-col overflow-hidden'>
          <BounceCards />

          <section
            aria-labelledby='hero-title'
            className='spaceman-recede flex shrink-0 flex-col gap-10 px-[clamp(20px,2.7vw,40px)] pt-6 pb-5 md:pb-10 lg:flex-row lg:items-start lg:justify-between'
          >
            <h1 className='spaceman-hero-title' id='hero-title'>
              <span className='sr-only'>
                The Home Of Spaceman’s Portfolio, UI Registry, Skills and
                Packages
              </span>
              <span aria-hidden='true'>
                <span className='block'>The Home Of</span>
                <span className='block'>
                  Spaceman’s <TextFlip words={heroProducts} />
                </span>
              </span>
            </h1>

            <div className='flex flex-col gap-6 lg:h-[124px] lg:w-[459px] lg:shrink-0 lg:justify-between lg:gap-0'>
              <p className='spaceman-hero-lead'>
                Open-source tools that help developers ship beautiful user
                interfaces.
              </p>
              <ProductTour />
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </SmoothScroll>
  )
}
