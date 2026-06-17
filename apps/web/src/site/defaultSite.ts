import type { SiteConfig } from './types'

/**
 * Canonical fallback used when the CMS API is unreachable. The block order here
 * is the authored order of the 3D scroll experience — keep it in sync with the
 * seeded "home" page blocks in packages/db/prisma/seed.mjs.
 */
export const DEFAULT_SITE: SiteConfig = {
  brand: { name: 'Maple Furnishers' },
  pages: [
    {
      slug: 'home',
      title: 'Home',
      blocks: [
        { type: 'hero' },
        { type: 'ethos' },
        { type: 'craft' },
        { type: 'anatomy' },
        { type: 'materials' },
        { type: 'collection' },
        { type: 'sofa' },
        { type: 'table' },
        { type: 'process' },
        { type: 'visit' },
      ],
    },
  ],
}
