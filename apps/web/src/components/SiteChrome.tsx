import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { gsap, ScrollTrigger } from '../lib/scroll'

/**
 * Persistent site chrome for the long-scroll experience:
 *  - a slim top progress line tracking whole-page scroll
 *  - a minimal header (wordmark + CTA) that fades in once past the hero
 * The hero keeps its own in-card nav, so this stays hidden over it.
 */
export default function SiteChrome() {
  const bar = useRef<HTMLDivElement>(null)
  const header = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (bar.current) {
      ScrollTrigger.create({
        start: 0,
        end: () => ScrollTrigger.maxScroll(window),
        onUpdate: (self) => {
          if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`
        },
      })
    }

    gsap.set(header.current, { autoAlpha: 0, y: -8 })
    ScrollTrigger.create({
      start: () => window.innerHeight * 0.75,
      end: () => ScrollTrigger.maxScroll(window),
      onToggle: (self) =>
        gsap.to(header.current, {
          autoAlpha: self.isActive ? 1 : 0,
          y: self.isActive ? 0 : -8,
          duration: 0.4,
          ease: 'power2.out',
        }),
    })
  })

  return (
    <>
      {/* whole-page progress line */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] bg-deepBrown/10">
        <div
          ref={bar}
          className="h-full w-full origin-left bg-maple-500"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* persistent header (appears after the hero) */}
      <header
        ref={header}
        className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-4 md:px-10"
        style={{ visibility: 'hidden' }}
      >
        <a
          href="#top"
          className="pointer-events-auto font-display text-2xl tracking-[-0.02em] text-charcoal mix-blend-multiply"
        >
          Maple
        </a>
        <nav className="pointer-events-auto hidden items-center gap-7 font-mono text-[11px] uppercase tracking-[0.2em] text-deepBrown/70 md:flex">
          <a href="#craft" className="transition-opacity hover:opacity-60">Craft</a>
          <a href="#anatomy" className="transition-opacity hover:opacity-60">Anatomy</a>
          <a href="#collection" className="transition-opacity hover:opacity-60">Collection</a>
          <a href="#visit" className="transition-opacity hover:opacity-60">Visit</a>
        </nav>
        <a
          href="#visit"
          className="pointer-events-auto flex items-center gap-2 rounded-full bg-maple-500 py-1.5 pl-3 pr-4 text-xs text-ivory shadow-[0_10px_28px_rgba(116,26,20,0.22)] transition-colors hover:bg-maple-600"
        >
          <span className="font-normal">Book a visit</span>
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </header>
    </>
  )
}
