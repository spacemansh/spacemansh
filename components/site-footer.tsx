import { Globe } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { GitHubIcon, XIcon } from '@/components/brand-icons'
import { siteLinks } from '@/lib/site'

const link =
  'inline-flex items-center gap-[7px] text-[13px] text-muted-foreground transition-colors duration-150 hover:text-foreground'

const heading =
  'font-mono text-[10.5px] tracking-[0.1em] text-muted-foreground uppercase'

export function SiteFooter() {
  return (
    <footer className='px-page border-border flex flex-col gap-13 border-t pt-14 pb-[30px]'>
      <div className='grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4'>
        <div className='col-span-2 flex min-w-0 flex-col gap-3.5'>
          <p className='font-mono text-[clamp(40px,7vw,86px)] leading-[0.92] font-semibold tracking-[-0.045em]'>
            spaceman.sh
          </p>
          <p className='text-muted-foreground max-w-[360px] text-[13px] leading-[1.7]'>
            Open-source tools for building beautiful user interfaces. Installed
            as source you own.
          </p>
        </div>

        <nav aria-labelledby='footer-registry' className='flex flex-col gap-3'>
          <h2 className={heading} id='footer-registry'>
            Registry
          </h2>
          <Link className={link} href='/#catalogue'>
            Components
          </Link>
          <a className={link} href={siteLinks.installGuide}>
            Install guide
          </a>
          <a className={link} href={siteLinks.registryJson}>
            registry.json
          </a>
          <a className={link} href={siteLinks.license}>
            MIT license
          </a>
        </nav>

        <nav aria-labelledby='footer-elsewhere' className='flex flex-col gap-3'>
          <h2 className={heading} id='footer-elsewhere'>
            Elsewhere
          </h2>
          <a className={link} href={siteLinks.portfolio}>
            <Globe aria-hidden='true' className='size-3.5' strokeWidth={1.8} />
            Portfolio
          </a>
          <a className={link} href={siteLinks.repoUrl}>
            <GitHubIcon className='size-3.5' />
            GitHub repo
          </a>
          <a className={link} href={siteLinks.x}>
            <XIcon className='size-[13px]' />X
          </a>
        </nav>
      </div>

      <div className='border-border text-muted-foreground flex flex-wrap items-center gap-4 border-t pt-[22px] font-mono text-[11.5px]'>
        <Image
          alt=''
          className='spaceman-brand-logo size-4 opacity-70'
          height={16}
          src='/figma-assets/spaceman-logo-24.svg'
          width={16}
        />
        <span>© 2026 tony</span>
        <span className='ml-auto'>MIT — no runtime dependency on us</span>
      </div>
    </footer>
  )
}
