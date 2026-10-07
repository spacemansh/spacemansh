import Image from 'next/image'
import Link from 'next/link'

import { CommandPalette } from '@/components/command-palette'
import { GitHubStars } from '@/components/github-stars'
import { MotionToggle } from '@/components/motion-toggle'
import { siteLinks } from '@/lib/site'
import { ThemeToggle } from '@/registry/spaceman/theme-toggle/theme-toggle'

const navItems = [
  { label: 'Components', href: '/#catalogue' },
  { label: 'Themes', href: '/#theme-picker' },
  { label: 'Docs', href: siteLinks.installGuide },
  { label: 'Open Source', href: siteLinks.repoUrl },
]

export function SiteHeader() {
  return (
    <header className='px-page border-border bg-background sticky top-0 z-20 grid h-[65px] grid-cols-[1fr_auto_1fr] items-center gap-6 border-b'>
      <Link
        aria-label='spaceman.sh home'
        className='spaceman-pressable -m-1.5 justify-self-start rounded-md p-1.5'
        href='/'
      >
        <Image
          alt=''
          className='spaceman-brand-logo size-[22px]'
          height={22}
          priority
          src='/figma-assets/spaceman-logo-24.svg'
          width={22}
        />
      </Link>

      <nav
        aria-label='Primary'
        className='text-muted-foreground flex gap-7 font-mono text-[13px] whitespace-nowrap max-md:hidden'
      >
        {navItems.map((item) => (
          <a
            className='hover:text-foreground -mx-1 rounded-sm px-1 py-2 transition-colors duration-150'
            href={item.href}
            key={item.label}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className='col-start-3 flex items-center gap-2.5 justify-self-end'>
        <CommandPalette />
        <MotionToggle />
        <ThemeToggle className="spaceman-pressable hover:bg-muted relative size-8 after:absolute after:-inset-1 after:content-['']" />
        <GitHubStars />
      </div>
    </header>
  )
}
