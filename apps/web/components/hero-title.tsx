import { LogoChip, type LogoChipProps } from '@/components/logo-chip'
import { TextFlip } from '@/components/text-flip'
import { heroProducts } from '@/lib/site'

export const heroLogo = {
  logo: '/spaceman.webp',
  label: 'Spaceman’s',
} satisfies LogoChipProps

// the hero line: "The Home Of / [logo] Spaceman's [flip]"; the lab renders the
// same line so the logo is tuned where it actually lives
export function HeroTitle({
  as: Tag = 'h1',
  logo = heroLogo,
}: {
  as?: 'h1' | 'p'
  logo?: LogoChipProps
}) {
  return (
    <Tag
      className='text-hero max-w-215 font-normal text-balance'
      id={Tag === 'h1' ? 'hero-title' : undefined}
    >
      <span className='sr-only'>
        The Home Of Spaceman’s Portfolio, UI Registry, Skills and Packages
      </span>
      <span aria-hidden='true'>
        <span className='block'>The Home Of</span>
        <span className='block'>
          <LogoChip {...logo} /> <TextFlip words={heroProducts} />
        </span>
      </span>
    </Tag>
  )
}
