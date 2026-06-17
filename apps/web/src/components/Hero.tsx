import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import { gsap, prefersReducedMotion, SplitText } from '../lib/scroll'
import { REVEAL_EVENT, hasRevealed } from '../lib/reveal'
import BottomLeftCard from './BottomLeftCard'
import BottomRightCorner from './BottomRightCorner'
import HeroBadge from './HeroBadge'
import Navbar from './Navbar'
import WebGLVeil from './WebGLVeil'
import type { BlockProps } from '../site/types'
import { str } from '../site/types'

const heroVideo =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260428_193507_4286c423-2fd9-4efd-92bd-91a939453fc1.mp4'

export default function Hero({ data }: BlockProps) {
  const headingText = str(data, 'heading')
  const bodyText = str(data, 'body')
  const wrapper = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const sub = useRef<HTMLParagraphElement>(null)
  const video = useRef<HTMLVideoElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set([heading.current, sub.current, '[data-scroll-cue]'], { opacity: 1 })
        return
      }

      // --- intro, fired when the preloader lifts ---
      gsap.set([heading.current, sub.current], { opacity: 1 })
      const split = new SplitText(heading.current, { type: 'lines,words', mask: 'lines' })
      gsap.set(split.words, { yPercent: 110 })
      gsap.set(sub.current, { opacity: 0, y: 24 })
      gsap.set('[data-scroll-cue]', { opacity: 0 })

      const play = () => {
        gsap
          .timeline()
          .to(split.words, {
            yPercent: 0,
            duration: 1.1,
            stagger: 0.06,
            ease: 'power4.out',
          })
          .to(sub.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.45)
          .to('[data-scroll-cue]', { opacity: 1, duration: 0.6 }, 0.9)
      }
      // The preloader may have already lifted before this section mounted
      // (e.g. a slow config fetch). Play immediately if so, else wait for it.
      if (hasRevealed()) play()
      else window.addEventListener(REVEAL_EVENT, play, { once: true })

      // --- scroll exit: card recedes as S2 takes over ---
      gsap
        .timeline({
          scrollTrigger: {
            trigger: wrapper.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
          },
        })
        .to(card.current, { scale: 0.94, yPercent: -3, ease: 'none' }, 0)
        .to(video.current, { yPercent: 10, scale: 1.06, ease: 'none' }, 0)
        .to('[data-scroll-cue]', { opacity: 0, ease: 'none' }, 0)

      // scroll cue idle pulse
      gsap.to('[data-cue-line]', {
        scaleY: 0.35,
        transformOrigin: 'top',
        repeat: -1,
        yoyo: true,
        duration: 0.9,
        ease: 'power1.inOut',
      })

      return () => {
        window.removeEventListener(REVEAL_EVENT, play)
        split.revert()
      }
    },
    { scope: wrapper },
  )

  return (
    <div ref={wrapper} className="w-full h-screen flex items-center justify-center p-3 md:p-5 bg-ivory">
      <section
        ref={card}
        className="relative w-full max-w-[1536px] h-full rounded-[1.5rem] md:rounded-[3rem] overflow-hidden shadow-[0_28px_90px_rgba(36,19,16,0.14)] flex flex-col items-center bg-beige/30 group"
      >
        <video
          ref={video}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-[65%] lg:object-center z-0"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-ivory/80 via-beige/20 to-deepBrown/30" />
        <WebGLVeil />
        <div className="relative z-10 w-full h-full flex flex-col items-center">
          <Navbar />
          <div className="w-full flex flex-col items-center pt-8 px-6 text-center max-w-4xl">
            <HeroBadge />
            <h1
              ref={heading}
              className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[108px] font-normal text-charcoal mb-2 tracking-[-0.04em] leading-[1.02] opacity-0"
            >
              {headingText ?? (
                <>
                  Luxury Custom-Built
                  <br className="hidden sm:block" /> Interiors
                </>
              )}
            </h1>
            <p
              ref={sub}
              className="text-sm sm:text-base md:text-lg text-deepBrown/75 leading-relaxed max-w-xl font-normal opacity-0"
            >
              {bodyText ??
                'Elegance is not found. At Maple, it is custom-built through refined furniture, material-led detailing, and project-ready craftsmanship from Kirti Nagar.'}
            </p>
          </div>
          <div
            data-scroll-cue
            className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-deepBrown/60">
              Scroll
            </span>
            <span data-cue-line className="block h-10 w-px bg-deepBrown/50" />
          </div>
          <BottomLeftCard />
          <BottomRightCorner />
        </div>
      </section>
    </div>
  )
}
