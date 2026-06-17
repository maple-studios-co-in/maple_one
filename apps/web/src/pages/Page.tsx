import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BLOCK_REGISTRY } from '../site/blocks'
import type { SiteConfig } from '../site/types'
import { ScrollTrigger } from '../lib/scroll'

/**
 * Renders one CMS page: its enabled blocks, in order, mapped through the block
 * registry. The persistent chrome (Canvas3D, SiteChrome, Preloader) lives in
 * App and stays mounted across navigation.
 */
export default function Page({ config }: { config: SiteConfig }) {
  const { slug } = useParams()
  const wanted = slug ?? 'home'
  const page =
    config.pages.find((p) => p.slug === wanted) ??
    config.pages.find((p) => p.slug === 'home') ??
    config.pages[0]

  useEffect(() => {
    window.scrollTo(0, 0)
    // Let the new sections mount and register their triggers, then recompute.
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [wanted])

  if (!page) return null

  return (
    <main id="top" className="relative z-10 min-h-screen">
      {page.blocks.map((block, i) => {
        const Component = BLOCK_REGISTRY[block.type]
        if (!Component) return null
        return <Component key={`${block.type}-${i}`} data={block.data} />
      })}
    </main>
  )
}
