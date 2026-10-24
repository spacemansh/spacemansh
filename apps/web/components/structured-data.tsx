import { footerColumns, seoLinks, siteDescription, siteUrl } from '@/lib/site'

const sameAs =
  footerColumns
    .find((column) => column.title === 'Elsewhere')
    ?.links.filter((link) => link.href.startsWith('https://'))
    .map((link) => link.href) ?? []

const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'Spaceman',
      alternateName: 'spaceman.sh',
      description: siteDescription,
      author: { '@id': `${siteUrl}/#author` },
    },
    {
      '@type': 'WebPage',
      '@id': `${siteUrl}/#webpage`,
      url: siteUrl,
      name: 'Spaceman — open-source UI tools',
      description: siteDescription,
      isPartOf: { '@id': `${siteUrl}/#website` },
      mainEntity: { '@id': `${siteUrl}/#links` },
    },
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#author`,
      name: 'Tony Edgal',
      url: 'https://tony.spaceman.sh',
      sameAs,
    },
    {
      '@type': 'ItemList',
      '@id': `${siteUrl}/#links`,
      name: 'Spaceman links',
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: seoLinks.map((product, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'CreativeWork',
          name: product.name,
          url: product.href,
          description: product.description,
          author: { '@id': `${siteUrl}/#author` },
        },
      })),
    },
  ],
}

// escape markup so product text cannot close the script element
const json = JSON.stringify(graph).replace(/</g, '\\u003c')

export function StructuredData() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: json }}
      type='application/ld+json'
    />
  )
}
