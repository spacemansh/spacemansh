import { footerColumns, products, siteDescription, siteUrl } from '@/lib/site'

const sameAs =
  footerColumns
    .find((column) => column.title === 'Elsewhere')
    ?.links.filter((link) => link.href.startsWith('https://'))
    .map((link) => link.href) ?? []

// schema.org graph for search engines: the site, its author and the products.
const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'spaceman.sh',
      description: siteDescription,
      author: { '@id': `${siteUrl}/#author` },
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
      name: 'Spaceman products',
      itemListElement: products.map((product, i) => ({
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

// `<` is escaped so the JSON can never close the script element early.
const json = JSON.stringify(graph).replace(/</g, '\\u003c')

export function StructuredData() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: json }}
      type='application/ld+json'
    />
  )
}
