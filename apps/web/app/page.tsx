import { FlaskConical } from 'lucide-react'

import { GitHubStars } from '@/components/github-stars'
import { HeroCards } from '@/components/hero-cards'
import { HeroTitle } from '@/components/hero-title'
import { ProductTour } from '@/components/product-tour'
import { SiteFooter } from '@/components/site-footer'
import { SmoothScroll } from '@/components/smooth-scroll'
import { StructuredData } from '@/components/structured-data'
import { ThemeToggle } from '@/components/theme-toggle'
import { StepLink } from '@/components/tour-actions'
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
        <div className='flex min-h-dvh flex-col overflow-hidden'>
          <HeroCards />

          <section
            aria-labelledby='hero-title'
            className='px-gutter flex shrink-0 flex-col gap-10 pt-6 pb-5 md:pb-10 lg:flex-row lg:items-start lg:justify-between'
            data-hero
            data-recede
          >
            <HeroTitle />

            <div className='flex flex-col gap-6 lg:h-31 lg:w-114.75 lg:shrink-0 lg:justify-between lg:gap-0'>
              <p
                className='text-lead max-w-140 text-pretty lg:max-w-none'
                data-hero-lead
              >
                Open-source tools that help developers ship beautiful user
                interfaces.
              </p>
              <div className='flex items-center gap-3'>
                <ProductTour />
                <StepLink
                  href='/lab'
                  icon={<FlaskConical aria-hidden='true' className='size-4' />}
                >
                  Lab
                </StepLink>
              </div>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </SmoothScroll>
  )
}
