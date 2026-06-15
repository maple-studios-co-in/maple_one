import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import type { ReactNode } from 'react'
import { gsap } from '../lib/scroll'
import { useExperience } from '../experience/store'
import type { SceneName } from '../experience/store'
import type { ShowcaseStep } from './types'

export interface Turntable3DConfig {
  id: string
  /** store scene name this section activates (matches a <ProductTurntable scene=…>) */
  scene: Exclude<SceneName, null>
  eyebrow: string
  title: ReactNode
  /** optional lead paragraph under the title */
  lead?: string
  /** optional proof points shown beneath the meter */
  proof?: string[]
  scrollCue?: string
  theme: { ink: string; inkMuted?: string; accent: string }
  steps?: ShowcaseStep[]
  stepThresholds?: number[]
  pin?: { desktop?: string; mobile?: string }
}

/**
 * A scroll-driven 360° turntable section. The section itself is transparent —
 * the actual product GLB spins in the persistent canvas behind the DOM — while
 * this overlay carries the copy and a live degree readout. Config-driven, same
 * spirit as ScrollScrubShowcase but for real 3D geometry.
 */
export default function Turntable3DShowcase({ config }: { config: Turntable3DConfig }) {
  const section = useRef<HTMLElement>(null)
  const target = useRef(0)
  const heading = useRef<HTMLDivElement>(null)
  const degrees = useRef<HTMLSpanElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const cue = useRef<HTMLDivElement>(null)
  const steps = useRef<(HTMLDivElement | null)[]>([])

  const ink = config.theme.ink
  const muted = config.theme.inkMuted ?? ink
  const accent = config.theme.accent
  const thresholds = config.stepThresholds ?? []
  const stepList = config.steps ?? []
  const pinDesktop = config.pin?.desktop ?? '+=360%'
  const pinMobile = config.pin?.mobile ?? '+=220%'

  useGSAP(
    () => {
      const { setActiveScene, setSpinProgress } = useExperience.getState()

      const activeIndex = (p: number) => {
        for (let i = 0; i < thresholds.length; i++) if (p < thresholds[i]) return i
        return thresholds.length
      }

      const paint = (p: number) => {
        if (degrees.current) degrees.current.textContent = String(Math.round(p * 360))
        if (bar.current) bar.current.style.transform = `scaleX(${p})`
        if (cue.current) cue.current.style.opacity = String(Math.max(0, 1 - p * 4))
        // gentle drift on the left column so the spin reads as scroll-linked
        if (heading.current) heading.current.style.transform = `translateY(${-p * 30}px)`
        const active = activeIndex(p)
        steps.current.forEach((el, i) => {
          if (!el) return
          el.style.opacity = i === active ? '1' : '0.32'
          const rail = el.querySelector('[data-rail]') as HTMLElement | null
          if (rail) rail.style.transform = `scaleX(${i < active ? 1 : i === active ? 0.5 : 0})`
        })
      }

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
            gsap.set('[data-turntable-heading] > *', { opacity: 1, y: 0 })
            gsap.set(steps.current, { opacity: 1 })
            ScrollTriggerToggle()
            paint(0.12)
            return
          }

          function ScrollTriggerToggle() {
            gsap.timeline({
              scrollTrigger: {
                trigger: section.current,
                start: 'top bottom',
                end: 'bottom top',
                onToggle: (self) => setActiveScene(self.isActive ? config.scene : null),
              },
            })
          }

          let rafId = 0
          let shown = 0
          const loop = () => {
            shown += (target.current - shown) * 0.16
            if (useExperience.getState().activeScene === config.scene) setSpinProgress(shown)
            paint(shown)
            rafId = requestAnimationFrame(loop)
          }
          rafId = requestAnimationFrame(loop)

          gsap.from('[data-turntable-heading] > *', {
            opacity: 0,
            y: 50,
            duration: 0.9,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: section.current, start: 'top 70%' },
          })

          gsap.timeline({
            scrollTrigger: {
              trigger: section.current,
              start: 'top top',
              end: mobile ? pinMobile : pinDesktop,
              pin: true,
              scrub: 1,
              onUpdate: (self) => {
                target.current = self.progress
              },
              onToggle: (self) => setActiveScene(self.isActive ? config.scene : null),
            },
          })

          return () => cancelAnimationFrame(rafId)
        },
      )
    },
    { scope: section, dependencies: [config.id] },
  )

  return (
    <section
      ref={section}
      id={config.id}
      className="relative h-screen overflow-hidden"
      style={{ color: ink }}
    >
      <div className="relative z-10 mx-auto flex h-full max-w-[1536px] flex-col justify-between px-6 py-16 md:px-12">
        <div ref={heading} data-turntable-heading className="max-w-md pt-6 will-change-transform">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.24em]" style={{ color: muted, opacity: 0.8 }}>
            {config.eyebrow}
          </p>
          <h2 className="font-display text-5xl font-normal leading-[1.02] tracking-[-0.03em] md:text-7xl">
            {config.title}
          </h2>
          {config.lead && (
            <p className="mt-6 max-w-md text-base leading-7 md:text-lg" style={{ color: ink, opacity: 0.78 }}>
              {config.lead}
            </p>
          )}
          {config.scrollCue && (
            <div
              ref={cue}
              className="mt-6 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em]"
              style={{ color: muted, opacity: 0.7 }}
            >
              <span>↻</span> {config.scrollCue}
            </div>
          )}
        </div>

        <div className="max-w-md">
          <div
            className="mb-3 flex items-end justify-between font-mono text-xs uppercase tracking-[0.22em]"
            style={{ color: muted, opacity: 0.7 }}
          >
            <span>0°</span>
            <span>360°</span>
          </div>
          <div className="relative h-px w-full">
            <div className="absolute inset-0" style={{ backgroundColor: accent, opacity: 0.2 }} />
            <div
              ref={bar}
              className="absolute inset-y-0 left-0 w-full origin-left"
              style={{ backgroundColor: accent, transform: 'scaleX(0)' }}
            />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span ref={degrees} className="font-display text-5xl leading-none tabular-nums md:text-6xl">
              0
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: muted, opacity: 0.7 }}>
              degrees turned
            </span>
          </div>

          {config.proof && config.proof.length > 0 && (
            <div
              className="mt-7 flex flex-wrap gap-x-6 gap-y-2 pt-5 font-mono text-[11px] uppercase tracking-[0.18em]"
              style={{ borderTop: `1px solid ${accent}33`, color: muted, opacity: 0.7 }}
            >
              {config.proof.map((p) => (
                <span key={p}>{p}</span>
              ))}
            </div>
          )}

          {stepList.length > 0 && (
            <div className="mt-7 pt-5" style={{ borderTop: `1px solid ${accent}33` }}>
              <div className="space-y-3">
                {stepList.map((s, i) => (
                  <div
                    key={s.num}
                    ref={(el) => {
                      steps.current[i] = el
                    }}
                    className="flex gap-4 transition-opacity duration-300"
                    style={{ opacity: 0.32 }}
                  >
                    <span className="mt-1 font-mono text-xs tracking-[0.2em]" style={{ color: muted, opacity: 0.8 }}>
                      {s.num}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-display text-xl font-normal tracking-[-0.01em] md:text-2xl">{s.title}</h3>
                        <div className="h-px flex-1" style={{ backgroundColor: `${accent}26` }}>
                          <div
                            data-rail
                            className="h-full w-full origin-left"
                            style={{ backgroundColor: accent, opacity: 0.7, transform: 'scaleX(0)' }}
                          />
                        </div>
                      </div>
                      <p className="mt-1 hidden text-sm leading-6 md:block" style={{ color: ink, opacity: 0.78 }}>
                        {s.copy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
