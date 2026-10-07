const repo = 'spacemansh/spacemansh'

const repoUrl = `https://github.com/${repo}`

/** Outbound links shared by the header, footer and command palette. */
export const siteLinks = {
  repo,
  repoUrl,
  installGuide: `${repoUrl}#using-the-registry`,
  registryJson: `${repoUrl}/blob/main/registry.json`,
  license: `${repoUrl}/blob/main/LICENSE`,
  portfolio: 'https://tony.spaceman.sh',
  x: 'https://x.com/TonyEdgal',
} as const

/** The CLI command that installs a registry item. */
export const installCommand = (name: string) =>
  `npx shadcn@latest add @spaceman/${name}`
