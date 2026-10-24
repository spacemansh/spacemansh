import { footerColumns, seoLinks, siteDescription, siteUrl } from '@/lib/site'

export const dynamic = 'force-static'

const portfolio = footerColumns.find(
  (column) => column.title === 'Personal website',
)

const elsewhere = footerColumns.find((column) => column.title === 'Elsewhere')

const list = (links: readonly { label: string; href: string }[] = []) =>
  links.map((link) => `- [${link.label}](${link.href})`).join('\n')

const body = `# spaceman.sh

> ${siteDescription}

spaceman.sh is the home of Spaceman, a set of open-source tools for building
user interfaces, made by Tony Edgal.

## Links

${seoLinks.map((product) => `- [${product.name}](${product.href}): ${product.description}`).join('\n')}

## Personal website

${list(portfolio?.links)}

## Elsewhere

${list(elsewhere?.links)}

## Notes

- The @spaceman shadcn registry is served from https://ui.spaceman.sh/r/{name}.json.
  ${siteUrl}/r/{name}.json redirects there permanently.
`

export function GET() {
  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
