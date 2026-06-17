// Shape of the public Website-CMS payload served by admin at /api/public/site.
// The marketing app renders itself from this; if it's unreachable it falls back
// to DEFAULT_SITE so the site always works.

export type BlockData = Record<string, unknown>

export interface SiteBlock {
  type: string
  label?: string
  data?: BlockData
  order?: number
}

export interface SitePage {
  slug: string
  title?: string
  blocks: SiteBlock[]
}

export interface SiteBrand {
  name?: string
  logoUrl?: string | null
  primaryColor?: string | null
}

export interface SiteConfig {
  brand: SiteBrand
  pages: SitePage[]
}

/** Props passed to every block/section component by the registry. */
export interface BlockProps {
  data?: BlockData
}

/** Read a non-empty string field from a block's data, else undefined. */
export function str(data: BlockData | undefined, key: string): string | undefined {
  const v = data?.[key]
  return typeof v === 'string' && v.trim() ? v.trim() : undefined
}
