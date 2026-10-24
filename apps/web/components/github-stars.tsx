'use client'

import { useQuery } from '@tanstack/react-query'

import { cn } from '@workspace/ui/lib/utils'

/** the one field read from GitHub's repository payload */
type Repo = { stargazers_count?: number }

const api = 'https://api.github.com'

// the boundary: GitHub's JSON is read as repository records, and a missing
// or odd star field counts as zero
const getRepos = async (url: string): Promise<Repo[]> => {
  const response = await fetch(url, {
    headers: { Accept: 'application/vnd.github+json' },
  })

  if (!response.ok) throw new Error(`${url} returned ${response.status}`)

  const body: Repo | Repo[] = await response.json()

  return Array.isArray(body) ? body : [body]
}

const starsOf = (repos: Repo[]) =>
  repos.reduce((sum, repo) => sum + (Number(repo.stargazers_count) || 0), 0)

// one repo's stars, or the total across every public repo of an org or user
const fetchStars = async (owner: string, repo?: string) => {
  if (repo) return starsOf(await getRepos(`${api}/repos/${owner}/${repo}`))

  let total = 0

  for (let page = 1; page < 20; page++) {
    const list = await getRepos(
      `${api}/users/${owner}/repos?per_page=100&type=owner&page=${page}`,
    )

    total += starsOf(list)

    if (list.length < 100) break
  }

  return total
}

/** GitHub stars for an org or user, or one of its repos; refetched rarely */
export function useGitHubStars(owner: string, repo?: string) {
  return useQuery({
    queryKey: ['github-stars', owner, repo ?? null],
    queryFn: () => fetchStars(owner, repo),
    staleTime: 6 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  })
}

const compact = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export type GitHubStarsProps = {
  /** the org or user whose stars are counted */
  owner: string
  /** narrows the count to one repo */
  repo?: string
  label?: string
  href?: string
  /** 'label': the name in foreground, the count muted; 'count' flips them */
  emphasis?: 'label' | 'count'
  /** hover cue: a thin underline under the name, a fill, a colour change, or none */
  hover?: 'underline' | 'background' | 'color' | 'none'
  className?: string
}

export function GitHubStars({
  owner,
  repo,
  label = 'GitHub',
  href,
  emphasis = 'label',
  hover = 'underline',
  className,
}: GitHubStarsProps) {
  const { data } = useGitHubStars(owner, repo)
  const count = data === undefined ? '–' : compact.format(data).toLowerCase()
  const muted = 'text-foreground/34'

  return (
    <a
      aria-label={
        data === undefined
          ? `${label}: ${owner}${repo ? `/${repo}` : ''}`
          : `${label}: ${data} stars`
      }
      className={cn(
        'text-nav group inline-flex h-13 items-center gap-2 rounded-full px-4 font-semibold no-underline transition-colors duration-180',
        hover === 'background' && 'hover:bg-muted',
        className,
      )}
      href={href ?? `https://github.com/${owner}${repo ? `/${repo}` : ''}`}
    >
      <span
        className={cn(
          'decoration-transparent decoration-1 underline-offset-4 transition-colors duration-180',
          hover === 'underline' && 'underline group-hover:decoration-current',
          (hover === 'background' || hover === 'color') &&
            'group-hover:text-foreground',
          emphasis === 'label' ? 'text-foreground' : muted,
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          'font-mono text-sm font-medium tabular-nums',
          emphasis === 'count' ? 'text-foreground' : muted,
        )}
      >
        [{count}]
      </span>
    </a>
  )
}
