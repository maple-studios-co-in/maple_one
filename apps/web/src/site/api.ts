import type { SiteConfig } from './types'

/**
 * Where to fetch the CMS payload from. Priority:
 *  1. VITE_SITE_API (explicit override, e.g. in .env.local)
 *  2. localhost dev -> the admin app on :3001
 *  3. production -> admin.<registrable-domain> derived from the current host
 */
function apiBase(): string {
  const env = (import.meta.env.VITE_SITE_API as string | undefined)?.trim()
  if (env) return env.replace(/\/$/, '')

  if (typeof window !== 'undefined') {
    const h = window.location.hostname
    if (h === 'localhost' || h === '127.0.0.1' || h.endsWith('.local')) {
      return 'http://localhost:3001'
    }
    const base = h.replace(/^www\./, '')
    return `${window.location.protocol}//admin.${base}`
  }
  return ''
}

export async function fetchSiteConfig(signal?: AbortSignal): Promise<SiteConfig | null> {
  try {
    const res = await fetch(`${apiBase()}/api/public/site`, { signal, credentials: 'omit' })
    if (!res.ok) return null
    const json = (await res.json()) as SiteConfig
    if (!json || !Array.isArray(json.pages)) return null
    return json
  } catch {
    return null
  }
}
