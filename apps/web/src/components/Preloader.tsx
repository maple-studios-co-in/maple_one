import { useGSAP } from '@gsap/react'
import { useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/scroll'
import { fireReveal } from '../lib/reveal'

export default function Preloader() {
  const [done, setDone] = useState(false)
  const overlay = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (prefersReducedMotion()) {
      setDone(true)
      fireReveal()
      return
    }

    document.documentElement.style.overflow = 'hidden'

    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.style.overflow = ''
        setDone(true)
        fireReveal()
      },
    })

    tl.fromTo('[data-pre-word]', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
      .fromTo('[data-pre-line]', { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, 0.2)
      .to('[data-pre-word], [data-pre-line]', { opacity: 0, duration: 0.3 }, '+=0.15')
      .to(overlay.current, { yPercent: -100, duration: 0.8, ease: 'power4.inOut' }, '<')
  }, [])

  if (done) return null

  return (
    <div ref={overlay} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ivory">
      <p data-pre-word className="mb-5 font-display text-5xl font-normal tracking-[-0.03em] text-charcoal">
        Maple
      </p>
      <div data-pre-line className="h-px w-40 origin-left bg-maple-500" />
    </div>
  )
}
