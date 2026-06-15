import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import MaterialTexture from '../components/MaterialTexture'
import { gsap, prefersReducedMotion, ScrollTrigger } from '../lib/scroll'

const STEPS = [
  {
    kind: 'grain',
    num: '01',
    title: 'Consult & measure',
    copy: 'Every project starts in your space. We measure, listen, and sketch around how you actually live — not around a catalogue.',
  },
  {
    kind: 'edge',
    num: '02',
    title: 'Design & sample',
    copy: 'You approve drawings, woods, and fabric swatches before a single cut. Changes cost a conversation, not a contract.',
  },
  {
    kind: 'polish',
    num: '03',
    title: 'Build & install',
    copy: 'Our Kirti Nagar workshop builds, finishes, and installs. White-glove delivery, zero-dust handover.',
  },
] as const

const STATS = [
  { value: 12, suffix: '', label: 'Years of craft' },
  { value: 480, suffix: '+', label: 'Projects delivered' },
  { value: 26, suffix: '', label: 'Master artisans' },
  { value: 20, suffix: '+', label: 'Cities served' },
] as const

export default function Process() {
  const section = useRef<HTMLElement>(null)
  const feature = useRef<HTMLVideoElement>(null)

  useGSAP(
    () => {
      const v = feature.current
      if (v) {
        v.pause()
        v.muted = true
      }
      if (prefersReducedMotion()) {
        if (v) {
          const settle = () => v.duration && (v.currentTime = v.duration - 0.05)
          v.readyState >= 1 ? settle() : v.addEventListener('loadedmetadata', settle, { once: true })
        }
        return
      }

      // scrub the block-to-chair clip as the feature scrolls through view
      const seekFeature = (p: number) => {
        const el = feature.current
        if (!el || !el.duration || Number.isNaN(el.duration)) return
        const tm = Math.min(el.duration - 0.05, Math.max(0, p) * el.duration)
        if (typeof el.fastSeek === 'function') el.fastSeek(tm)
        else el.currentTime = tm
      }
      // pin the feature and scrub the whole block-to-chair clip across the pin
      ScrollTrigger.create({
        trigger: '[data-studio-feature]',
        start: 'top top',
        end: '+=180%',
        pin: true,
        scrub: true,
        onUpdate: (self) => seekFeature(self.progress),
      })

      gsap.utils.toArray<HTMLElement>('[data-step]').forEach((step) => {
        const media = step.querySelector('[data-step-media]')
        const text = step.querySelector('[data-step-text]')
        const tl = gsap.timeline({
          scrollTrigger: { trigger: step, start: 'top 72%' },
        })
        if (media) {
          tl.fromTo(
            media,
            { clipPath: 'inset(0% 100% 0% 0% round 2rem)' },
            { clipPath: 'inset(0% 0% 0% 0% round 2rem)', duration: 1.1, ease: 'power3.inOut' },
          )
          // gentle scroll-zoom on each step's media
          gsap.fromTo(
            media,
            { scale: 1.12 },
            { scale: 1, ease: 'none', scrollTrigger: { trigger: step, start: 'top bottom', end: 'bottom top', scrub: true } },
          )
        }
        if (text) {
          tl.from(text, { opacity: 0, y: 44, duration: 0.8, ease: 'power3.out' }, 0.25)
        }
      })

      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count)
        const obj = { v: 0 }
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v))
          },
        })
      })
    },
    { scope: section },
  )

  return (
    <section ref={section} id="process" className="relative bg-beige px-6 py-24 md:px-12 md:py-36">
      <div className="mx-auto max-w-[1536px]">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-warmGrey">
          From sketch to install
        </p>
        <h2 className="mb-12 max-w-2xl font-display text-5xl font-normal leading-[1.04] tracking-[-0.03em] text-charcoal md:text-6xl">
          A process you can sit on.
        </h2>

        <div
          data-studio-feature
          className="relative mb-24 h-[70vh] w-full overflow-hidden rounded-[2rem] md:h-[86vh]"
        >
          <video
            ref={feature}
            data-feature-zoom
            src="/videos/woodcut.mp4"
            muted
            playsInline
            preload="auto"
            className="h-full w-full object-cover will-change-transform"
          />
          <span className="absolute bottom-7 left-8 font-mono text-[11px] uppercase tracking-[0.22em] text-deepBrown/70">
            Kirti Nagar · block to chair
          </span>
        </div>

        <div className="flex flex-col gap-24 md:gap-32">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              data-step
              className={`flex flex-col items-center gap-10 md:gap-20 ${
                i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
              }`}
            >
              <div
                data-step-media
                className="relative h-[44vh] w-full overflow-hidden rounded-[2rem] md:h-[56vh] md:w-1/2"
                style={{ clipPath: 'inset(0% 0% 0% 0% round 2rem)' }}
              >
                <MaterialTexture kind={step.kind} />
                <span className="absolute left-8 top-8 font-display text-7xl text-ivory/80 md:text-8xl">
                  {step.num}
                </span>
              </div>
              <div data-step-text className="md:w-1/2 md:max-w-md">
                <h3 className="mb-4 font-display text-4xl font-normal tracking-[-0.02em] text-deepBrown">
                  {step.title}
                </h3>
                <p className="text-base leading-7 text-warmGrey">{step.copy}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-28 grid grid-cols-2 gap-10 border-t border-sand/70 pt-14 md:grid-cols-4 md:gap-6">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-5xl font-normal tracking-[-0.03em] text-charcoal md:text-6xl">
                <span data-count={stat.value}>{stat.value}</span>
                {stat.suffix}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-warmGrey">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
