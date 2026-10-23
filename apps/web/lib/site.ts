/** Outbound links for the header and footer. */
export const githubUrl = 'https://github.com/spacemansh'

export const footerColumns = [
  {
    title: 'Products',
    links: [
      { label: 'UI Registry', href: 'https://ui.spaceman.sh' },
      { label: 'UI Theme', href: 'https://www.uitheme.dev/' },
      { label: 'Spaceman RTA', href: 'https://spaceman-rta-vite.netlify.app/' },
      {
        label: 'Spaceman Skills',
        href: 'https://github.com/spacemansh/spaceman-skills',
      },
    ],
  },
  {
    title: 'Portfolio',
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

/** The products the hero's text flip cycles through, in order. */
export const heroProducts = ['Portfolio', 'UI Registry', 'Skills', 'Packages']
