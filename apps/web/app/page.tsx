import { BounceCards } from '@/components/bounce-cards'
import { GitHubStars } from '@/components/github-stars'
import { HeroTitle } from '@/components/hero-title'
import { ProductTour } from '@/components/product-tour'
import { SiteFooter } from '@/components/site-footer'
import { SmoothScroll } from '@/components/smooth-scroll'
import { StructuredData } from '@/components/structured-data'
import { ThemeToggle } from '@/components/theme-toggle'
import { githubUrl } from '@/lib/site'
import { themeTransition } from '@/lib/theme'

export default function Page() {
  return (
    <SmoothScroll>
      <StructuredData />
      <nav
        aria-label='Site'
        className='absolute top-4 right-4 z-40 flex gap-1'
        data-recede
      >
        <GitHubStars emphasis='count' href={githubUrl} owner='spacemansh' />
        <ThemeToggle duration={themeTransition.duration} />
      </nav>

      <main className='bg-background shadow-hairline relative z-10'>
        <div className='flex h-dvh flex-col overflow-hidden'>
          <BounceCards />

          <section
            aria-labelledby='hero-title'
            className='px-gutter flex shrink-0 flex-col gap-10 pt-6 pb-5 md:pb-10 lg:flex-row lg:items-start lg:justify-between'
            data-recede
          >
            <HeroTitle />

            <div className='flex flex-col gap-6 lg:h-31 lg:w-114.75 lg:shrink-0 lg:justify-between lg:gap-0'>
              <p className='text-lead max-w-140 text-pretty lg:max-w-none'>
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
