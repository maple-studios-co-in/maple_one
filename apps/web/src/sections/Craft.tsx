import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import { useExperience } from '../experience/store'
import { gsap } from '../lib/scroll'

const BEATS = [
  ['01', 'Grain', 'Every piece begins as raw timber, chosen by hand at our Kirti Nagar workshop.'],
  ['02', 'Joinery', 'Cut, doweled and fitted to a tolerance of a millimetre. No shortcuts, no screws where joints belong.'],
  ['03', 'Finish', 'Hand-rubbed oils and waxes that deepen in character with every passing year.'],
] as const

export default function Craft() {
  const section = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const beats = gsap.utils.toArray<HTMLElement>('[data-beat]')
      const setActiveScene = useExperience.getState().setActiveScene
      const setProgress = useExperience.getState().setAssemblyProgress

      const mm = gsap.matchMedia()

      mm.add(
        {
          desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
          mobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
          reduced: '(prefers-reduced-motion: reduce)',
        },
        (ctx) => {
          const { reduced, mobile } = ctx.conditions as Record<string, boolean>

          if (reduced) {
            setProgress(1)
            gsap.set(beats, { opacity: 1, y: 0 })
            gsap.set('[data-craft-heading]', { opacity: 1, y: 0 })
            // still show the chair while the section is on screen
            gsap.timeline({
              scrollTrigger: {
                trigger: section.current,
                start: 'top bottom',
                end: 'bottom top',
                onToggle: (self) => setActiveScene(self.isActive ? 'assembly' : null),
              },
            })
            return
          }

          gsap.from('[data-craft-heading]', {
            opacity: 0,
            y: 60,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: section.current, start: 'top 70%' },
          })

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section.current,
              start: 'top top',
              end: mobile ? '+=200%' : '+=300%',
              pin: true,
              scrub: 0.6,
              onUpdate: (self) => setProgress(self.progress),
              onToggle: (self) => setActiveScene(self.isActive ? 'assembly' : null),
            },
          })

          beats.forEach((beat, i) => {
            const at = i / BEATS.length
            tl.fromTo(
              beat,
              { opacity: 0, y: 36 },
              { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' },
              at + 0.04,
            )
            if (i < beats.length - 1) {
              tl.to(beat, { opacity: 0, y: -28, duration: 0.1, ease: 'power2.in' }, at + 0.26)
            }
          })
        },
      )
    },
    { scope: section },
  )

  return (
    <section ref={section} id="craft" className="relative h-screen overflow-hidden">
      <div className="relative mx-auto flex h-full max-w-[1536px] flex-col justify-between px-6 py-16 md:px-12">
        <div data-craft-heading className="max-w-xl pt-6">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-warmGrey">
            The workshop
          </p>
          <h2 className="font-display text-5xl font-normal leading-[1.04] tracking-[-0.03em] text-charcoal md:text-7xl">
            Built,
            <br />
            not bought.
          </h2>
        </div>

        <div className="relative mb-10 h-44 max-w-md md:mb-16">
          {BEATS.map(([num, title, copy]) => (
            <div key={num} data-beat className="absolute inset-x-0 bottom-0 opacity-0">
              <p className="mb-2 font-mono text-xs tracking-[0.24em] text-warmGrey">{num} / 03</p>
              <h3 className="mb-2 font-display text-4xl font-normal tracking-[-0.02em] text-deepBrown">
                {title}
              </h3>
              <p className="text-sm leading-6 text-warmGrey md:text-base">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
