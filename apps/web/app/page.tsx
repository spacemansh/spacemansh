const products = [
  { name: 'UI Registry', href: 'https://ui.spaceman.sh' },
  { name: 'UI Theme', href: 'https://www.uitheme.dev/' },
  { name: 'Spaceman RTA', href: 'https://spaceman-rta-vite.netlify.app/' },
  {
    name: 'Spaceman Skills',
    href: 'https://github.com/spacemansh/spaceman-skills',
  },
  { name: 'Portfolio', href: 'https://tony.spaceman.sh' },
]

// Placeholder until the product family page from plan/ is built.
export default function Page() {
  return (
    <main className='px-page flex min-h-svh flex-col justify-center gap-6 py-16'>
      <h1 className='text-4xl font-medium tracking-tight'>spaceman.sh</h1>
      <p className='text-muted-foreground max-w-prose'>
        Open-source tools for building beautiful user interfaces.
      </p>
      <ul className='flex flex-wrap gap-x-6 gap-y-2'>
        {products.map((product) => (
          <li key={product.name}>
            <a
              className='text-foreground decoration-border hover:decoration-primary-ink underline underline-offset-4'
              href={product.href}
            >
              {product.name}
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}
