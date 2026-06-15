import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import MaterialTexture from '../components/MaterialTexture'
import { gsap } from '../lib/scroll'

const PANELS = [
  {
    kind: 'grain',
    title: 'Grain',
    copy: 'Where nature begins the story: raw, real, and rooted in beauty.',
    light: false,
  },
  {
    kind: 'edge',
    title: 'Edge',
    copy: 'Precision that defines perfection. Every line is intentional.',
    light: false,
  },
  {
    kind: 'fabric',
    title: 'Fabric',
    copy: 'Softness selected for rooms that are lived in, hosted in, and remembered.',
    light: true,
  },
  {
    kind: 'polish',
    title: 'Polish',
    copy: 'The quiet glow of craftsmanship, finished by hand for lasting warmth.',
    light: false,
  },
] as const

const BG_STOPS = ['#FFF8ED', '#F3E8D5', '#E9DCC3', '#241310']

export default function Materials() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const trackEl = track.current!
        const sectionEl = section.current!
        const getDistance = () => trackEl.scrollWidth - window.innerWidth

        const bg = gsap.utils.interpolate(BG_STOPS)

        const scrollTween = gsap.to(trackEl, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top top',
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 0.5,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              sectionEl.style.backgroundColor = bg(self.progress)
              const heading = sectionEl.querySelector<HTMLElement>('[data-materials-heading]')
              if (heading) heading.style.color = self.progress > 0.72 ? '#FFF8ED' : '#430F0B'
            },
          },
        })

        // parallax inside each panel
        gsap.utils.toArray<HTMLElement>('[data-panel-media]').forEach((media) => {
          gsap.fromTo(
            media,
            { xPercent: -7 },
            {
              xPercent: 7,
              ease: 'none',
              scrollTrigger: {
                trigger: media,
                containerAnimation: scrollTween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            },
          )
        })
      })
    },
    { scope: section },
  )

  return (
    <section
      ref={section}
      id="materials"
      className="relative overflow-hidden bg-ivory transition-colors"
    >
      <div className="px-6 pt-20 md:px-12 md:pt-28">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-warmGrey">
          Material library
        </p>
        <h2
          data-materials-heading
          className="font-display text-4xl font-normal tracking-[-0.03em] text-charcoal md:text-6xl"
        >
          Four ways we obsess.
        </h2>
      </div>

      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 py-12 md:snap-none md:gap-8 md:overflow-visible md:px-12 md:py-16"
      >
        {PANELS.map((panel, i) => (
          <article
            key={panel.kind}
            className="relative h-[58vh] w-[82vw] shrink-0 snap-center overflow-hidden rounded-[2rem] shadow-[0_24px_80px_rgba(36,19,16,0.18)] md:h-[64vh] md:w-[56vw]"
          >
            <div data-panel-media className="absolute -inset-x-[10%] inset-y-0">
              <MaterialTexture kind={panel.kind} />
            </div>
            <div className="relative z-10 flex h-full flex-col justify-end p-8 md:p-12">
              <p
                className={`mb-3 font-mono text-xs tracking-[0.24em] ${
                  panel.light ? 'text-deepBrown/70' : 'text-ivory/70'
                }`}
              >
                0{i + 1} / 04
              </p>
              <h3
                className={`mb-3 font-display text-6xl font-normal tracking-[-0.03em] md:text-8xl ${
                  panel.light ? 'text-deepBrown' : 'text-ivory'
                }`}
              >
                {panel.title}
              </h3>
              <p
                className={`max-w-md text-sm leading-6 md:text-base ${
                  panel.light ? 'text-deepBrown/80' : 'text-ivory/85'
                }`}
              >
                {panel.copy}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
