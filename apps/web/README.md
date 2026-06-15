# Maple Furnishers — Experience Site

A single-page, scroll-driven **brand showcase** for Maple Furnishers — image- and
video-heavy, artistic and interactive. Furniture pieces are presented as
cinematic "chapters" the visitor scrubs through on scroll.

## Stack
Vite · React 19 · TypeScript · Tailwind v4 · GSAP + ScrollTrigger · Lenis ·
React-Three-Fiber / three · zustand.

## Develop
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

## Structure
```
src/
  showcase/    # ← reusable, config-driven scroll components (the "library")
    ScrollScrubShowcase.tsx
    types.ts
  content/     # site content as config objects (showcases.tsx)
  experience/  # persistent R3F canvas, scenes, chair models
  sections/    # DOM chapters (Hero, Craft, Anatomy, Materials, …)
  lib/         # Lenis + ScrollTrigger setup
public/
  models/  videos/   # 3D + scrubbed assembly clips
```

## Reusable showcase
The scroll-scrub piece showcase is fully driven by a `ScrubShowcaseConfig`
(`src/showcase/types.ts`). To add a piece — or reuse on another site — drop a
clip in `public/videos`, add a config in `src/content/showcases.tsx`, and render
`<ScrollScrubShowcase config={…} />`. No component edits.

See `SITE_PLAN.md` for the chapter narrative and `BRANCHING.md` for git flow.
