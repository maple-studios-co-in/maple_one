import { useGSAP } from '@gsap/react'
import { ArrowUpRight } from 'lucide-react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/scroll'
import type { BlockProps } from '../site/types'
import { str } from '../site/types'

function MagneticCTA() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 16 })
  const sy = useSpring(y, { stiffness: 180, damping: 16 })

  return (
    <motion.button
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * 0.32)
        y.set((e.clientY - (r.top + r.height / 2)) * 0.32)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
      whileTap={{ scale: 0.97 }}
      className="group mx-auto flex items-center gap-4 rounded-full bg-ivory py-3 pl-3 pr-8 text-deepBrown shadow-[0_24px_70px_rgba(0,0,0,0.35)] transition-colors hover:bg-sand"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-maple-500">
        <ArrowUpRight className="h-6 w-6 text-ivory transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
      <span className="text-base font-normal md:text-lg">Book a studio visit</span>
    </motion.button>
  )
}

export default function Visit({ data }: BlockProps) {
  const section = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      gsap.from('[data-visit-line]', {
        opacity: 0,
        y: 70,
        stagger: 0.12,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: section.current, start: 'top 65%' },
      })

      gsap.fromTo(
        '[data-wordmark]',
        { yPercent: 28 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-wordmark]',
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 0.5,
          },
        },
      )
    },
    { scope: section },
  )

  return (
    <section ref={section} id="visit" className="relative overflow-hidden bg-deepBrown text-ivory">
      <div className="mx-auto flex min-h-screen max-w-[1536px] flex-col items-center justify-center px-6 py-28 text-center md:px-12">
        <p data-visit-line className="mb-6 font-mono text-xs uppercase tracking-[0.24em] text-sand">
          Kirti Nagar, New Delhi
        </p>
        <h2
          data-visit-line
          className="mb-6 max-w-3xl font-display text-5xl font-normal leading-[1.04] tracking-[-0.03em] md:text-8xl"
        >
          {str(data, 'heading') ?? 'Begin your build.'}
        </h2>
        <p data-visit-line className="mb-12 max-w-lg text-base leading-7 text-ivory/70">
          {str(data, 'body') ??
            'Walk the workshop, touch the timber, sit in the prototypes. Bring a floor plan or just an idea — leave with a design.'}
        </p>
        <div data-visit-line>
          <MagneticCTA />
        </div>
      </div>

      <footer className="relative border-t border-ivory/10 px-6 pb-10 pt-16 md:px-12">
        <div className="mx-auto max-w-[1536px]">
          <div className="mb-14 grid grid-cols-2 gap-10 md:grid-cols-4">
            <div>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-sand">Explore</p>
              <ul className="space-y-2 text-sm text-ivory/60">
                {[
                  ['Ethos', '#ethos'],
                  ['Craft', '#craft'],
                  ['Anatomy', '#anatomy'],
                  ['Collection', '#collection'],
                ].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="transition-colors hover:text-ivory">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-sand">Studio</p>
              <p className="text-sm leading-6 text-ivory/60">
                B3, Timber Block, WHS Block,
                <br />
                Kirti Nagar, New Delhi 110015
              </p>
            </div>
            <div>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-sand">Contact</p>
              <p className="text-sm leading-6 text-ivory/60">
                <a href="tel:+919211819727" className="transition-colors hover:text-ivory">+91 92118 19727</a>
                <br />
                <a href="mailto:contact@maplefurnishers.com" className="transition-colors hover:text-ivory">
                  contact@maplefurnishers.com
                </a>
              </p>
            </div>
            <div>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-sand">Follow</p>
              <p className="text-sm leading-6 text-ivory/60">
                <a
                  href="https://instagram.com/the_maple_experience"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-ivory"
                >
                  @the_maple_experience
                </a>
                <br />
                <span className="text-ivory/40">Luxury furniture, factory prices</span>
              </p>
            </div>
          </div>
          <p className="mb-14 text-xs text-ivory/40">© {new Date().getFullYear()} Maple Furnishers · Crafted in Delhi</p>
          <div className="overflow-hidden">
            <p
              data-wordmark
              className="select-none text-center font-display text-[22vw] font-normal leading-[0.85] tracking-[-0.05em] text-ivory/10"
            >
              Maple
            </p>
          </div>
        </div>
      </footer>
    </section>
  )
}
