import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import { gsap } from '../lib/scroll'
import type { ScrubShowcaseConfig, ScrubShowcaseMedia } from './types'

const DEFAULT_MASK =
  'radial-gradient(120% 86% at 52% 48%, #000 48%, rgba(0,0,0,0.6) 66%, transparent 82%)'

/**
 * Generic, config-driven scroll-scrub showcase.
 *
 * A pinned section that scrubs a (preferably all-intra) video by scroll, with a
 * floating-clip mask, a live assembly meter and a step legend — all themeable
 * and content-free. Reuse it on any site by passing a different {@link ScrubShowcaseConfig}.
 *
 * The only project coupling is the `gsap` instance (with ScrollTrigger
 * registered) imported from '../lib/scroll'; point that at your own GSAP setup
 * to drop this component into another codebase.
 */
export default function ScrollScrubShowcase({ config }: { config: ScrubShowcaseConfig }) {
  const section = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const img = useRef<HTMLImageElement>(null)
  const clipEl = useRef<HTMLDivElement>(null)
  const target = useRef(0)
  const percent = useRef<HTMLSpanElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const cue = useRef<HTMLDivElement>(null)
  const steps = useRef<(HTMLDivElement | null)[]>([])

  const { theme } = config
  const ink = theme.ink
  const muted = theme.inkMuted ?? ink
  const accent = theme.accent
  const clip = config.clip ?? {}
  const side = clip.side ?? 'right'
  const zoomFrom = clip.zoom?.[0] ?? 0.93
  const zoomTo = clip.zoom?.[1] ?? 1
  const thresholds = config.stepThresholds ?? []
  const stepList = config.steps ?? []
  const pinDesktop = config.pin?.desktop ?? '+=440%'
  const pinMobile = config.pin?.mobile ?? '+=260%'

  // resolve media (back-compat: `video` shorthand → {kind:'video'})
  const media: ScrubShowcaseMedia | null =
    config.media ?? (config.video ? { kind: 'video', src: config.video.src, poster: config.video.poster } : null)
  const isPan = media?.kind === 'image-pan'
  const panFrom = media?.kind === 'image-pan' ? media.panFrom ?? 0 : 0
  const panTo = media?.kind === 'image-pan' ? media.panTo ?? 100 : 100
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v))

  useGSAP(
    () => {
      const v = video.current
      if (v) {
        v.pause()
        v.muted = true
      }

      const activeIndex = (p: number) => {
        for (let i = 0; i < thresholds.length; i++) if (p < thresholds[i]) return i
        return thresholds.length
      }

      const paint = (p: number) => {
        if (percent.current) percent.current.textContent = String(Math.round(p * 100)).padStart(2, '0')
        if (bar.current) bar.current.style.transform = `scaleX(${p})`
        if (cue.current) cue.current.style.opacity = String(Math.max(0, 1 - p * 4))
        if (clipEl.current) clipEl.current.style.transform = `scale(${zoomFrom + (zoomTo - zoomFrom) * p})`
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
            if (isPan && img.current) img.current.style.objectPosition = `${panTo}% 50%`
            const el = video.current
            const settle = () => el && el.duration && (el.currentTime = el.duration - 0.05)
            if (el) el.readyState >= 1 ? settle() : el.addEventListener('loadedmetadata', settle, { once: true })
            paint(1)
            return
          }

          let rafId = 0
          let shown = 0
          const loop = () => {
            shown += (target.current - shown) * 0.16
            if (isPan) {
              if (img.current) {
                const x = panFrom + (panTo - panFrom) * clamp01(shown)
                img.current.style.objectPosition = `${x}% 50%`
              }
            } else {
              const el = video.current
              if (el && el.duration && !Number.isNaN(el.duration)) {
                const dur = el.duration - 0.05
                const want = Math.min(dur, Math.max(0, shown) * dur)
                if (Math.abs(want - el.currentTime) > 0.003) {
                  if (typeof el.fastSeek === 'function') el.fastSeek(want)
                  else el.currentTime = want
                }
              }
            }
            paint(shown)
            rafId = requestAnimationFrame(loop)
          }
          rafId = requestAnimationFrame(loop)

          gsap.from('[data-showcase-heading] > *', {
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
            },
          })

          return () => cancelAnimationFrame(rafId)
        },
      )
    },
    { scope: section, dependencies: [config.id] },
  )

  const defaultWidth = !clip.width ? 'w-[64%] md:w-[58%]' : ''

  return (
    <section
      ref={section}
      id={config.id}
      className="relative h-screen overflow-hidden"
      style={{ background: theme.background, color: ink }}
    >
      <div
        ref={clipEl}
        className={`pointer-events-none absolute top-0 h-full will-change-transform ${defaultWidth} ${side === 'right' ? 'right-0' : 'left-0'}`}
        style={{
          width: clip.width,
          WebkitMaskImage: clip.mask ?? DEFAULT_MASK,
          maskImage: clip.mask ?? DEFAULT_MASK,
        }}
      >
        {isPan ? (
          <img
            ref={img}
            className="h-full w-full object-cover"
            style={{ objectPosition: `${panFrom}% 50%` }}
            src={media?.src}
            alt={media?.kind === 'image-pan' ? media.alt ?? '' : ''}
          />
        ) : (
          <video
            ref={video}
            className="h-full w-full object-cover"
            style={{ objectPosition: clip.objectPosition ?? '50% 46%' }}
            src={media?.src}
            poster={media?.kind === 'video' ? media.poster : undefined}
            muted
            playsInline
            preload="auto"
          />
        )}
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-[1536px] flex-col justify-between px-6 py-16 md:px-12">
        <div data-showcase-heading className="max-w-xl pt-6">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.24em]" style={{ color: muted, opacity: 0.8 }}>
            {config.eyebrow}
          </p>
          <h2 className="font-display text-5xl font-normal leading-[1.02] tracking-[-0.03em] md:text-7xl">
            {config.title}
          </h2>
          {config.scrollCue && (
            <div
              ref={cue}
              className="mt-6 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em]"
              style={{ color: muted, opacity: 0.7 }}
            >
              <span className="inline-block">↓</span> {config.scrollCue}
            </div>
          )}
        </div>

        {(config.meter || stepList.length > 0) && (
          <div className="max-w-md">
            {config.meter && (
              <>
                <div
                  className="mb-3 flex items-end justify-between font-mono text-xs uppercase tracking-[0.22em]"
                  style={{ color: muted, opacity: 0.7 }}
                >
                  <span>{config.meter.startLabel}</span>
                  <span>{config.meter.endLabel}</span>
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
                  <span ref={percent} className="font-display text-5xl leading-none tabular-nums md:text-6xl">
                    00
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: muted, opacity: 0.7 }}>
                    {config.meter.unitLabel}
                  </span>
                </div>
              </>
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
        )}
      </div>
    </section>
  )
}
