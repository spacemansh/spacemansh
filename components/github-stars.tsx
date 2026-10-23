import { GitHubIcon } from '@/components/brand-icons'
import { siteLinks } from '@/lib/site'

async function getStars(): Promise<number | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${siteLinks.repo}`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'spaceman.sh',
        },
        // Capture the count at build time; no runtime revalidation storage.
        cache: 'force-cache',
      },
    )

    if (!response.ok) return null

    // Parse the one field we use: anything that is not a whole, non-negative
    // number (missing field, changed API shape) counts as unknown.
    const { stargazers_count: raw } = await response.json()

    return Number.isSafeInteger(raw) && raw >= 0 ? raw : null
  } catch {
    return null
  }
}

function formatStars(count: number) {
  if (count < 1000) return String(count)

  return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1).replace(/\.0$/, '')}k`
}

/** Links to the repo with its build-time star count; shows no number if unknown. */
export async function GitHubStars() {
  const stars = await getStars()

  return (
    <a
      aria-label={
        stars === null
          ? `${siteLinks.repo} on GitHub`
          : `Star ${siteLinks.repo} on GitHub, ${stars} stars`
      }
      className='spaceman-pressable border-border text-muted-foreground hover:border-border-strong hover:bg-muted hover:text-foreground inline-flex h-8 items-center gap-2 rounded-lg border pr-3 pl-2.5 font-mono text-[12.5px] font-medium'
      href={siteLinks.repoUrl}
      rel='noopener'
      target='_blank'
    >
      <GitHubIcon className='text-foreground size-4 flex-none' />
      <span className='tabular-nums'>
        {stars === null ? 'Star' : formatStars(stars)}
      </span>
    </a>
  )
}
