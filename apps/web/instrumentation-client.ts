import posthog from 'posthog-js'

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN

const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

if (
  process.env.NODE_ENV === 'production' &&
  window.location.hostname === 'spaceman.sh' &&
  token &&
  host
) {
  posthog.init(token, {
    api_host: host,
    defaults: '2026-08-30',
    capture_pageview: 'history_change',
  })
}
