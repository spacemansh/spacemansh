export const githubUrl = 'https://github.com/spacemansh'

export const siteUrl = 'https://spaceman.sh'

export const siteDescription =
  'Open-source tools that help developers ship beautiful user interfaces.'

export const products = [
  {
    id: 'website',
    name: 'Personal Website',
    href: 'https://tony.spaceman.sh',
    domain: 'tony.spaceman.sh',
    description: 'Experience, projects, writing and the story behind Spaceman.',
  },
  {
    id: 'registry',
    name: 'Spaceman UI Registry',
    href: 'https://ui.spaceman.sh',
    domain: 'ui.spaceman.sh',
    description:
      'A registry for interfaces that feel considered: themes, motion and blocks you install with the shadcn CLI.',
  },
  {
    id: 'theme',
    name: 'UI Theme',
    href: 'https://www.uitheme.dev/',
    domain: 'uitheme.dev',
    description:
      'A UI-framework-agnostic theming library with built-in support for multiple themes.',
  },
  {
    id: 'rta',
    name: 'Spaceman RTA',
    seoName: 'Spaceman React Theme Animation',
    href: 'https://spaceman-rta-vite.netlify.app/',
    domain: '@space-man/react-theme-animation',
    description: 'Animated theme transitions for React.',
  },
  {
    id: 'skills',
    name: 'Spaceman Skills',
    href: 'https://github.com/spacemansh/spaceman-skills',
    domain: 'spacemansh/spaceman-skills',
    description:
      'Small, composable skills for coding agents that support the Agent Skills format.',
  },
] as const

export const seoLinks = ['registry', 'skills', 'rta', 'theme', 'website'].map(
  (id) => {
    const product = products.find((product) => product.id === id)!

    return {
      ...product,
      name: 'seoName' in product ? product.seoName : product.name,
    }
  },
)

export const footerColumns = [
  {
    title: 'Products',
    links: [
      { label: 'Spaceman UI Registry', href: 'https://ui.spaceman.sh' },
      { label: 'UI Theme', href: 'https://www.uitheme.dev/' },
      {
        label: 'Spaceman RTA',
        href: 'https://spaceman-rta-vite.netlify.app/',
      },
      {
        label: 'Spaceman Skills',
        href: 'https://github.com/spacemansh/spaceman-skills',
      },
    ],
  },
  {
    title: 'Personal website',
    links: [
      { label: 'Experience', href: 'https://tony.spaceman.sh/#content' },
      { label: 'Projects', href: 'https://tony.spaceman.sh/projects#content' },
      { label: 'Blog', href: 'https://tony.spaceman.sh/blog#content' },
      { label: 'Story', href: 'https://tony.spaceman.sh/story#content' },
      { label: 'Get in touch', href: 'mailto:tonyedgal@gmail.com' },
    ],
  },
  {
    title: 'Elsewhere',
    links: [
      { label: 'GitHub', href: 'https://github.com/tonyedgal' },
      { label: 'X', href: 'https://x.com/TonyEdgal' },
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/anthony-edgal-8ba13715b/',
      },
      { label: 'spacemansh on GitHub', href: githubUrl },
    ],
  },
] as const

export const heroProducts = ['Portfolio', 'UI Registry', 'Skills', 'Packages']
