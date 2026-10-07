import { Catalogue, type CatalogueEntry } from '@/components/catalogue'
import { Hero } from '@/components/hero'
import { sampleItems } from '@/components/sample-items'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { installCommand } from '@/lib/site'
import { PreviewCard } from '@/registry/spaceman/preview-card/preview-card-2g'

const planned = ['Motion', 'Loaders', 'Blocks'] as const

const entries: CatalogueEntry[] = [
  ...sampleItems.map((item) => ({
    id: item.slug,
    category: 'Themes' as const,
    card: (
      <PreviewCard
        className='scroll-mt-24'
        href={`/r/${item.slug}.json`}
        id={item.slug}
        index={item.index}
        installCommand={installCommand(item.slug)}
        title={item.title}
      >
        {item.preview}
      </PreviewCard>
    ),
  })),
  ...planned.map((category) => ({
    id: category.toLowerCase(),
    category,
    card: <PreviewCard status='soon' title={category} />,
  })),
]

export default function Home() {
  return (
    <div className='bg-background text-foreground min-h-svh'>
      <SiteHeader />
      <main>
        <Hero />
        <Catalogue entries={entries} />
      </main>
      <SiteFooter />
    </div>
  )
}
