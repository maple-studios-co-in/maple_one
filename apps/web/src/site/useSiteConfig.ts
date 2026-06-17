import { useEffect, useState } from 'react'
import type { SiteConfig } from './types'
import { DEFAULT_SITE } from './defaultSite'
import { fetchSiteConfig } from './api'

export interface SiteState {
  config: SiteConfig
  loading: boolean
  source: 'cms' | 'default'
}

const FETCH_TIMEOUT_MS = 2500

/**
 * Loads the CMS site config once on mount. Resolves quickly (with a timeout) so
 * the preloader is never left waiting; on any failure it keeps DEFAULT_SITE.
 */
export function useSiteConfig(): SiteState {
  const [state, setState] = useState<SiteState>({
    config: DEFAULT_SITE,
    loading: true,
    source: 'default',
  })

  useEffect(() => {
    const ac = new AbortController()
    const timer = setTimeout(() => ac.abort(), FETCH_TIMEOUT_MS)

    fetchSiteConfig(ac.signal)
      .then((cfg) => {
        if (cfg && cfg.pages.length) {
          setState({
            config: { brand: { ...DEFAULT_SITE.brand, ...cfg.brand }, pages: cfg.pages },
            loading: false,
            source: 'cms',
          })
        } else {
          setState((s) => ({ ...s, loading: false }))
        }
      })
      .finally(() => clearTimeout(timer))

    return () => {
      clearTimeout(timer)
      ac.abort()
    }
  }, [])

  return state
}
