import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import { useExperience } from '../experience/store'
import { gsap } from '../lib/scroll'

const PIECES = [
  {
    name: 'Aria Lounge Chair',
    material: 'Solid walnut · sand bouclé',
    dims: 'W 84 × D 78 × H 92 cm',
    note: 'Our signature silhouette — the piece that built the studio.',
  },
  {
    name: 'Kirti Side Table',
    material: 'Turned walnut · brass inlay',
    dims: 'Ø 92 × H 58 cm',
    note: 'Three splayed legs, one shelf, zero visible fixings.',
  },
  {
    name: 'Meridian Bench',
    material: 'Oak frame · two-tone linen',
    dims: 'W 165 × D 56 × H 78 cm',
    note: 'Entryways, bay windows, foot of the bed — it earns every spot.',
  },
] as const

export default function Collection() {
  const section = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-piece]')
      const { setActiveScene, setTurntableProgress } = useExperience.getState()

      const mm = gsap.matchMedia()

      mm.add(
        {
          animated: '(prefers-reduced-motion: no-preference)',
          reduced: '(prefers-reduced-motion: reduce)',
        },
        (ctx) => {
          const { reduced } = ctx.conditions as Record<string, boolean>

          if (reduced) {
            gsap.set(cards, { opacity: 1, y: 0 })
            gsap.timeline({
              scrollTrigger: {
                trigger: section.current,
                start: 'top bottom',
                end: 'bottom top',
                onToggle: (self) => setActiveScene(self.isActive ? 'turntable' : null),
              },
            })
            return
          }

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section.current,
              start: 'top top',
              end: '+=250%',
              pin: true,
              scrub: 0.6,
              snap: {
                snapTo: [0, 0.5, 1],
                duration: { min: 0.2, max: 0.6 },
                ease: 'power2.inOut',
              },
              onUpdate: (self) => setTurntableProgress(self.progress),
              onToggle: (self) => setActiveScene(self.isActive ? 'turntable' : null),
            },
          })

          cards.forEach((card, i) => {
            const at = i / PIECES.length
            tl.fromTo(
              card,
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' },
              i === 0 ? 0 : at + 0.08,
            )
            if (i < cards.length - 1) {
              tl.to(card, { opacity: 0, y: -32, duration: 0.08, ease: 'power2.in' }, at + 0.28)
            }
          })
        },
      )
    },
    { scope: section },
  )

  return (
    <section ref={section} id="collection" className="relative h-screen overflow-hidden">
      <div className="relative mx-auto flex h-full max-w-[1536px] flex-col px-6 py-16 md:px-12">
        <div className="max-w-xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-warmGrey">
            The collection
          </p>
          <h2 className="font-display text-5xl font-normal leading-[1.04] tracking-[-0.03em] text-charcoal md:text-6xl">
            Three pieces, endless rooms.
          </h2>
        </div>

        <div className="relative mt-auto h-56 max-w-md pb-8 md:pb-14">
          {PIECES.map((piece) => (
            <div key={piece.name} data-piece className="absolute inset-x-0 bottom-8 opacity-0 md:bottom-14">
              <h3 className="mb-2 font-display text-4xl font-normal tracking-[-0.02em] text-deepBrown">
                {piece.name}
              </h3>
              <p className="mb-1 text-sm text-warmGrey">{piece.material}</p>
              <p className="mb-3 font-mono text-xs tracking-[0.18em] text-warmGrey">{piece.dims}</p>
              <p className="max-w-sm text-sm leading-6 text-warmGrey">{piece.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
