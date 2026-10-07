import type { Metadata } from 'next'
import type * as React from 'react'

import { sampleItems } from '@/components/sample-items'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { installCommand } from '@/lib/site'
import { CopyButton } from '@/registry/spaceman/copy-button/copy-button'
import { PreviewCard as Card1A } from '@/registry/spaceman/preview-card/preview-card-1a'
import { PreviewCard as Card1B } from '@/registry/spaceman/preview-card/preview-card-1b'
import { PreviewCard as Card1C } from '@/registry/spaceman/preview-card/preview-card-1c'
import { PreviewCard as Card1D } from '@/registry/spaceman/preview-card/preview-card-1d'
import { PreviewCard as Card1E } from '@/registry/spaceman/preview-card/preview-card-1e'
import { PreviewCard as Card1F } from '@/registry/spaceman/preview-card/preview-card-1f'
import { PreviewCard as Card1G } from '@/registry/spaceman/preview-card/preview-card-1g'
import { PreviewCard as Card1H } from '@/registry/spaceman/preview-card/preview-card-1h'
import { PreviewCard as Card1I } from '@/registry/spaceman/preview-card/preview-card-1i'
import { PreviewCard as Card1J } from '@/registry/spaceman/preview-card/preview-card-1j'
import { PreviewCard as Card1K } from '@/registry/spaceman/preview-card/preview-card-1k'
import { PreviewCard as Card1L } from '@/registry/spaceman/preview-card/preview-card-1l'
import { PreviewCard as Card1M } from '@/registry/spaceman/preview-card/preview-card-1m'
import { PreviewCard as Card1N } from '@/registry/spaceman/preview-card/preview-card-1n'
import { PreviewCard as Card1O } from '@/registry/spaceman/preview-card/preview-card-1o'
import { PreviewCard as Card1P } from '@/registry/spaceman/preview-card/preview-card-1p'
import { PreviewCard as Card1Q } from '@/registry/spaceman/preview-card/preview-card-1q'
import { PreviewCard as Card1R } from '@/registry/spaceman/preview-card/preview-card-1r'
import { PreviewCard as Card1S } from '@/registry/spaceman/preview-card/preview-card-1s'
import { PreviewCard as Card1T } from '@/registry/spaceman/preview-card/preview-card-1t'
import { PreviewCard as Card1U } from '@/registry/spaceman/preview-card/preview-card-1u'
import { PreviewCard as Card1V } from '@/registry/spaceman/preview-card/preview-card-1v'
import { PreviewCard as Card1W } from '@/registry/spaceman/preview-card/preview-card-1w'
import { PreviewCard as Card1X } from '@/registry/spaceman/preview-card/preview-card-1x'
import { PreviewCard as Card1Y } from '@/registry/spaceman/preview-card/preview-card-1y'
import { PreviewCard as Card1Z } from '@/registry/spaceman/preview-card/preview-card-1z'
import { PreviewCard as Card2A } from '@/registry/spaceman/preview-card/preview-card-2a'
import { PreviewCard as Card2B } from '@/registry/spaceman/preview-card/preview-card-2b'
import { PreviewCard as Card2C } from '@/registry/spaceman/preview-card/preview-card-2c'
import { PreviewCard as Card2G } from '@/registry/spaceman/preview-card/preview-card-2g'
import { PreviewCard as Card2V } from '@/registry/spaceman/preview-card/preview-card-2v'
import { PreviewCard as Card3V } from '@/registry/spaceman/preview-card/preview-card-3v'
import { PreviewCard as Card4V } from '@/registry/spaceman/preview-card/preview-card-4v'

export const metadata: Metadata = {
  title: 'Preview cards · spaceman.sh',
  description: 'Every preview card design in the spaceman.sh registry.',
}

type Design = {
  id: string
  title: string
  description: string
  cards: React.ReactNode[]
}

const designs: Design[] = [
  {
    id: '1a',
    title: 'Tight inset',
    description: 'Current card, with a 5px inset and a shorter preview.',
    cards: sampleItems.map((item) => (
      <Card1A key={item.slug} title={item.title} href={`/r/${item.slug}.json`}>
        {item.preview}
      </Card1A>
    )),
  },
  {
    id: '2a',
    title: 'Inset top, flat bottom, compact footer',
    description:
      'The flat-bottom preview from 2b, with the one-line footer from 1a.',
    cards: sampleItems.map((item) => (
      <Card2A key={item.slug} title={item.title} href={`/r/${item.slug}.json`}>
        {item.preview}
      </Card2A>
    )),
  },
  {
    id: '1b',
    title: 'Flush preview',
    description:
      'No inset. The preview runs edge to edge, with a divider above the footer.',
    cards: sampleItems.map((item) => (
      <Card1B
        key={item.slug}
        title={item.title}
        href={`/r/${item.slug}.json`}
        description={item.description}
      >
        {item.preview}
      </Card1B>
    )),
  },
  {
    id: '2b',
    title: 'Inset top, flat bottom',
    description:
      'The 5px top and side inset from 1a, with the flat divider and footer from 1b.',
    cards: sampleItems.map((item) => (
      <Card2B
        key={item.slug}
        title={item.title}
        href={`/r/${item.slug}.json`}
        description={item.description}
      >
        {item.preview}
      </Card2B>
    )),
  },
  {
    id: '2c',
    title: 'Split panels',
    description:
      'Two stacked inner panels: the preview has a flat bottom and the footer has a flat top. The card is inset 5px on every side, with the 6px gap and footer background from 1c.',
    cards: sampleItems.map((item) => (
      <Card2C key={item.slug} title={item.title} href={`/r/${item.slug}.json`}>
        {item.preview}
      </Card2C>
    )),
  },
  {
    id: '1c',
    title: 'Install footer',
    description: 'Tight inset, with the install command as the footer.',
    cards: sampleItems.map((item) => (
      <Card1C
        key={item.slug}
        title={item.title}
        href={`/r/${item.slug}.json`}
        installCommand={installCommand(item.slug)}
      >
        {item.preview}
      </Card1C>
    )),
  },
  {
    id: '1d',
    title: 'Floating footer',
    description:
      'A single surface, with the footer as a bar inset at the bottom.',
    cards: sampleItems.map((item) => (
      <Card1D
        key={item.slug}
        title={item.title}
        href={`/r/${item.slug}.json`}
        category={item.category}
      >
        {item.preview}
      </Card1D>
    )),
  },
  {
    id: '1e',
    title: 'Index card',
    description:
      'A mono label above a dotted preview, with the name and description below.',
    cards: sampleItems.map((item) => (
      <Card1E
        key={item.slug}
        title={item.title}
        href={`/r/${item.slug}.json`}
        index={item.index}
        category={item.category}
        description={item.description}
      >
        {item.preview}
      </Card1E>
    )),
  },
  {
    id: '1f',
    title: 'Ticket stub',
    description:
      'A dashed tear line with notches cut into both sides, and the install slug on the stub.',
    cards: sampleItems.map((item) => (
      <Card1F
        key={item.slug}
        title={item.title}
        href={`/r/${item.slug}.json`}
        slug={item.slug}
      >
        {item.preview}
      </Card1F>
    )),
  },
  {
    id: '1g',
    title: 'Folder tab',
    description:
      'The name sits on a tab that rises out of the preview. Nothing sits below it.',
    cards: sampleItems.map((item) => (
      <Card1G
        key={item.slug}
        title={item.title}
        href={`/r/${item.slug}.json`}
        index={item.index}
      >
        {item.preview}
      </Card1G>
    )),
  },
  {
    id: '2g',
    title: 'Tinted folder tab',
    description:
      '1g with a blue tab for Themes. The tab tucks behind the card, and the card has all four corners rounded.',
    cards: sampleItems.map((item) => (
      <Card2G
        key={item.slug}
        title={item.title}
        href={`/r/${item.slug}.json`}
        index={item.index}
        installCommand={installCommand(item.slug)}
      >
        {item.preview}
      </Card2G>
    )),
  },
  {
    id: '1h',
    title: 'Crop marks',
    description:
      'Printer’s registration marks at the corners, with a mono spec line along the base.',
    cards: sampleItems.map((item) => (
      <Card1H
        key={item.slug}
        title={item.title}
        href={`/r/${item.slug}.json`}
        index={item.index}
        category={item.category}
        slug={item.slug}
      >
        {item.preview}
      </Card1H>
    )),
  },
  {
    id: '1i',
    title: 'Stacked variants',
    description:
      'Faint card edges peek out behind the card, hinting that there are more variants inside.',
    cards: sampleItems.map((item) => (
      <Card1I
        key={item.slug}
        title={item.title}
        href={`/r/${item.slug}.json`}
        variants={3}
      >
        {item.preview}
      </Card1I>
    )),
  },
  {
    id: '1j',
    title: 'Inverted footer',
    description:
      'The footer is a solid ink bar, which reads as a button. The preview stays neutral.',
    cards: sampleItems.map((item) => (
      <Card1J key={item.slug} title={item.title} href={`/r/${item.slug}.json`}>
        {item.preview}
      </Card1J>
    )),
  },
  {
    id: '1k',
    title: 'Caption inside',
    description:
      'There’s no footer. The name and arrow float in the preview’s top corners.',
    cards: sampleItems.map((item) => (
      <Card1K key={item.slug} title={item.title} href={`/r/${item.slug}.json`}>
        {item.preview}
      </Card1K>
    )),
  },
  {
    id: '1l',
    title: 'Header first',
    description:
      'The name and number sit above the preview, like a document title.',
    cards: sampleItems.map((item) => (
      <Card1L
        key={item.slug}
        title={item.title}
        href={`/r/${item.slug}.json`}
        index={item.index}
      >
        {item.preview}
      </Card1L>
    )),
  },
  {
    id: '1m',
    title: 'Spine',
    description:
      'The name runs vertically along a narrow spine on the left, like the spine of a book.',
    cards: sampleItems.map((item) => (
      <Card1M
        key={item.slug}
        title={item.title}
        href={`/r/${item.slug}.json`}
        index={item.index}
      >
        {item.preview}
      </Card1M>
    )),
  },
  {
    id: '1n',
    title: 'Window chrome',
    description:
      'A title bar with three dots, and the slug set as a file name.',
    cards: sampleItems.map((item) => (
      <Card1N
        key={item.slug}
        title={item.title}
        href={`/r/${item.slug}.json`}
        slug={item.slug}
      >
        {item.preview}
      </Card1N>
    )),
  },
  {
    id: '1o',
    title: 'Big numeral',
    description: 'An oversized index number sits faintly behind the preview.',
    cards: sampleItems.map((item) => (
      <Card1O
        key={item.slug}
        title={item.title}
        href={`/r/${item.slug}.json`}
        index={item.index}
      >
        {item.preview}
      </Card1O>
    )),
  },
  {
    id: '1p',
    title: 'Outline',
    description:
      'The card has no fill, just hairlines and a dashed preview frame. It fills on hover.',
    cards: sampleItems.map((item) => (
      <Card1P key={item.slug} title={item.title} href={`/r/${item.slug}.json`}>
        {item.preview}
      </Card1P>
    )),
  },
  {
    id: '1q',
    title: 'Pill on the seam',
    description:
      'The name sits in a pill that straddles the edge between preview and footer.',
    cards: sampleItems.map((item) => (
      <Card1Q key={item.slug} title={item.title} href={`/r/${item.slug}.json`}>
        {item.preview}
      </Card1Q>
    )),
  },
  {
    id: '1r',
    title: 'Passe-partout',
    description:
      'A mat frame inside the card, like a framed print, with a small-caps caption.',
    cards: sampleItems.map((item) => (
      <Card1R key={item.slug} title={item.title} href={`/r/${item.slug}.json`}>
        {item.preview}
      </Card1R>
    )),
  },
  {
    id: '1s',
    title: 'Side meta',
    description:
      'The preview takes the top. Below it, the name and slug sit on the left and the arrow on the right, split by a hairline.',
    cards: sampleItems.map((item) => (
      <Card1S
        key={item.slug}
        title={item.title}
        href={`/r/${item.slug}.json`}
        slug={item.slug}
      >
        {item.preview}
      </Card1S>
    )),
  },
  {
    id: '1t',
    title: 'Keycap',
    description:
      'A raised card with a hard bottom edge, like a keyboard key. It presses down on hover.',
    cards: sampleItems.map((item) => (
      <Card1T key={item.slug} title={item.title} href={`/r/${item.slug}.json`}>
        {item.preview}
      </Card1T>
    )),
  },
  {
    id: '1u',
    title: 'Polaroid',
    description:
      'Even margins on three sides and a deep bottom margin for a mono caption.',
    cards: sampleItems.map((item) => (
      <Card1U
        key={item.slug}
        title={item.title}
        href={`/r/${item.slug}.json`}
        index={item.index}
        slug={item.slug}
      >
        {item.preview}
      </Card1U>
    )),
  },
  {
    id: '1v',
    title: 'Dog-ear',
    description:
      'The top-right corner is folded over, marking the card as a page you can open.',
    cards: sampleItems.map((item) => (
      <Card1V key={item.slug} title={item.title} href={`/r/${item.slug}.json`}>
        {item.preview}
      </Card1V>
    )),
  },
  {
    id: '2v',
    title: 'Dog-ear, flat bottom',
    description:
      '1v with the flat-bottomed preview and one-line footer from 2a.',
    cards: sampleItems.map((item) => (
      <Card2V key={item.slug} title={item.title} href={`/r/${item.slug}.json`}>
        {item.preview}
      </Card2V>
    )),
  },
  {
    id: '3v',
    title: 'Dog-ear, clear fold',
    description:
      '1v with the preview clipped away from the fold, so nothing shows under the folded corner.',
    cards: sampleItems.map((item) => (
      <Card3V key={item.slug} title={item.title} href={`/r/${item.slug}.json`}>
        {item.preview}
      </Card3V>
    )),
  },
  {
    id: '4v',
    title: 'Dog-ear on the preview',
    description:
      "The outer card stays fully rounded. The fold sits on the inner preview's corner and matches its 10px radius.",
    cards: sampleItems.map((item) => (
      <Card4V key={item.slug} title={item.title} href={`/r/${item.slug}.json`}>
        {item.preview}
      </Card4V>
    )),
  },
  {
    id: '1w',
    title: 'Hard offset',
    description:
      'A flat, solid shadow offset to the bottom right. It slides into place on hover.',
    cards: sampleItems.map((item) => (
      <Card1W key={item.slug} title={item.title} href={`/r/${item.slug}.json`}>
        {item.preview}
      </Card1W>
    )),
  },
  {
    id: '1x',
    title: 'Notch label',
    description:
      'The name sits in a notch cut into the preview’s bottom-left corner. There’s no separate footer.',
    cards: sampleItems.map((item) => (
      <Card1X key={item.slug} title={item.title} href={`/r/${item.slug}.json`}>
        {item.preview}
      </Card1X>
    )),
  },
  {
    id: '1y',
    title: 'Blueprint',
    description:
      'Ruler ticks along two edges and a fine grid in the preview, like a technical drawing.',
    cards: sampleItems.map((item) => (
      <Card1Y
        key={item.slug}
        title={item.title}
        href={`/r/${item.slug}.json`}
        index={item.index}
      >
        {item.preview}
      </Card1Y>
    )),
  },
  {
    id: '1z',
    title: 'No card',
    description:
      'There’s no card at all: a rounded preview tile with the name set beneath it, like an app icon.',
    cards: sampleItems.map((item) => (
      <Card1Z key={item.slug} title={item.title} href={`/r/${item.slug}.json`}>
        {item.preview}
      </Card1Z>
    )),
  },
]

export default function PreviewCardsPage() {
  return (
    <div className='bg-background text-foreground min-h-svh'>
      <SiteHeader />
      <main className='px-page flex flex-col gap-16 pt-16 pb-20'>
        <header className='flex max-w-[640px] flex-col gap-3'>
          <h1 className='text-[clamp(30px,4vw,44px)] leading-[1.05] font-normal tracking-[-0.02em] text-balance'>
            Preview cards
          </h1>
          <p className='text-muted-foreground text-[14.5px] leading-[1.75] text-pretty'>
            Every design is its own registry item and exports the same{' '}
            <code className='font-mono text-[13px]'>PreviewCard</code>, so you
            can switch designs by changing the import path.
          </p>
        </header>

        {designs.map((design) => (
          <section
            aria-labelledby={`design-${design.id}`}
            className='flex scroll-mt-24 flex-col gap-4'
            id={design.id}
            key={design.id}
          >
            <div className='flex flex-wrap items-center gap-x-3 gap-y-2'>
              <span className='bg-foreground text-background rounded-[calc(var(--radius)-3px)] px-[7px] py-[3px] font-mono text-[11px] font-medium'>
                {design.id}
              </span>
              <h2
                className='text-[15px] font-medium'
                id={`design-${design.id}`}
              >
                {design.title}
              </h2>
              <p className='text-muted-foreground text-[13px] text-pretty'>
                {design.description}
              </p>
              <div className='border-border bg-input ml-auto flex h-9 max-w-full min-w-0 items-center gap-2 rounded-[var(--radius)] border pr-1 pl-3'>
                <code className='min-w-0 [scrollbar-width:none] overflow-x-auto font-mono text-[12px] whitespace-nowrap'>
                  {installCommand(`preview-card-${design.id}`)}
                </code>
                <CopyButton
                  className='bg-muted text-muted-foreground hover:bg-muted-strong hover:text-foreground size-7 rounded-[calc(var(--radius)-2px)]'
                  label={`Copy preview-card-${design.id} install command`}
                  value={installCommand(`preview-card-${design.id}`)}
                />
              </div>
            </div>
            <div className='grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-4'>
              {design.cards}
            </div>
          </section>
        ))}
      </main>
      <SiteFooter />
    </div>
  )
}
