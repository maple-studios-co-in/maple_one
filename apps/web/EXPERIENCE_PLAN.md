# Maple Furnishers — Experience Website Plan

Goal: turn the current single-hero page into a continuous, scroll-driven experience — GSAP drives the narrative, Three.js (R3F) delivers two signature 3D furniture moments. Reference feel: Apple product pages / awwwards furniture sites, but warm and material-led in the Maple palette.

---

## 1. Stack

Already installed: React 19, Tailwind v4, `motion`, `three`, `@react-three/fiber`.

Add:

| Package | Why |
|---|---|
| `gsap` + `@gsap/react` | ScrollTrigger timelines, pinning, scrubbing. All GSAP plugins (SplitText, ScrollSmoother, etc.) are free since v3.13. |
| `lenis` | Buttery smooth scroll, syncs with ScrollTrigger via `scrollerProxy`/raf. |
| `@react-three/drei` | `useGLTF`, `Environment`, `ContactShadows`, `Center` — saves weeks. |
| `zustand` | Tiny store bridging GSAP scroll progress → R3F scene state. |
| dev: `leva`, `r3f-perf` | Tuning + perf monitoring during build. |

Division of labor: `motion` keeps handling micro-interactions (buttons, badges, hovers). GSAP owns everything scroll-driven. Don't mix both on the same element.

## 2. Architecture

One **persistent fixed `<Canvas>`** behind the DOM content (z-0), not a canvas per section. DOM sections scroll over it; GSAP ScrollTriggers write `progress` values into a zustand store; R3F components read the store in `useFrame` and interpolate (damped lerp) camera, model rotation, and exploded-view offsets.

```
src/
  experience/
    Canvas3D.tsx        // fixed canvas, scene router
    scenes/
      AssemblyScene.tsx // exploded chair
      TurntableScene.tsx// collection showcase
    store.ts            // zustand: { section, progress }
    useScrollScene.ts   // hook: registers ScrollTrigger → store
  components/           // existing + new DOM sections
  sections/
    Hero.tsx (existing, upgraded)
    Craft.tsx, Materials.tsx, Collection.tsx, Process.tsx, Visit.tsx
  lib/lenis.ts          // Lenis + ScrollTrigger sync
```

Why persistent canvas: no WebGL context churn between sections, models stay warm in GPU memory, and the camera can fly continuously between scenes — that continuity is what makes it feel like an "experience" rather than a page with embedded widgets.

## 3. The scroll story (6 sections)

### S1 — Hero (upgrade existing)
Keep the video + shader veil. Add:
- Intro timeline: SplitText line-reveal on the headline, badge/nav fade-stagger (replace the current motion fades with one GSAP timeline for choreography).
- Exit transition: pin hero briefly; on scroll the rounded card scales to ~0.94, corners tighten, veil opacity fades — hands off into S2.
- Scroll cue: subtle animated "scroll" indicator bottom-center.

### S2 — "Built, not bought" (signature 3D moment)
Pinned section, ~300vh scroll distance, scrub: true.
- An armchair GLB floats **exploded** — legs, frame, cushions, armrests separated in space.
- As the user scrolls, parts glide together and the chair **assembles**; camera orbits ~120° simultaneously.
- Copy beats fade in/out at thirds: "Grain" → "Joinery" → "Finish" (reuses the four-card copy, now narrated).
- Implementation: split the GLB into named nodes; store per-part `startOffset` (direction × distance); position = lerp(start, final, easedProgress). Exploded offsets authored in code, not in the model — any GLB works.

### S3 — Materials (horizontal scroll)
Pinned section translating a row horizontally (classic ScrollTrigger `xPercent` scrub).
- 4 panels: Grain / Edge / Fabric / Polish (replaces the current static card grid).
- Each panel: full-bleed texture image with parallax (image moves slower than panel), oversized serif word, short copy.
- Background color tweens ivory → beige → deepBrown across the travel; text color follows.

### S4 — Collection turntable (3D)
Pinned ~250vh. The persistent canvas camera flies from S2's chair to a pedestal scene.
- 2–3 furniture pieces; scroll rotates the active piece (turntable) and crossfades spec callouts (dimensions, wood, fabric) anchored via `Html` from drei or projected screen coords.
- Snap points (`snap: 1/(n-1)`) so each piece settles cleanly.
- Soft `ContactShadows` + neutral `Environment` preset; floor color = sand.

### S5 — Process / studio story
No pinning — rhythm break after two heavy pinned sections.
- Alternating image/text rows; images reveal with `clip-path: inset()` tweens; numbers (years, projects, sq ft of workshop) count up on enter.
- Batch reveals with `ScrollTrigger.batch` for stagger.

### S6 — Visit / CTA + footer
- Full-bleed studio image/video, parallax.
- Big "Book Studio Visit" magnetic button (motion handles the magnet on pointer).
- Footer reveals from beneath the last section (`position: sticky` curtain effect).

## 4. 3D models (free, swappable)

- Sources: **Poly Haven** (CC0 GLBs — armchair, sofa, side table), **Sketchfab CC0 filter**, Khronos glTF samples.
- Pipeline: `npx @gltf-transform/cli optimize in.glb out.glb --compress meshopt --texture-compress webp` — target **< 1.5 MB per model**, < 4 MB total 3D payload.
- Requirement for S2: model with separable parts (or separate meshes we can group). If a chosen GLB is a single mesh, fall back to slicing in Blender once or pick another model.
- Keep models in `public/models/`; `useGLTF.preload()` during hero idle time.

## 5. Performance & accessibility budget

- DPR clamp `[1, 1.75]`; `frameloop="demand"` + invalidate on scroll/lerp activity.
- Lazy-mount scenes with `<Suspense>`; preload during hero.
- Mobile (< 768px): keep S2 assembly (shorter, 200vh), replace S3 horizontal scroll with native swipe carousel, reduce S4 to single piece.
- `prefers-reduced-motion`: kill all scrub/pin triggers, show assembled chair static, plain fade-ins. One utility gates every trigger.
- Targets: LCP < 2.5s (hero video already async), steady 60fps desktop / 30fps+ mid-range mobile, CLS ≈ 0 (pins reserve space).
- Preloader: minimal "Maple" wordmark + progress bar tied to asset loading; prevents janky first scroll.

## 6. Build phases

| Phase | Deliverable | Est. |
|---|---|---|
| 1 | Deps, Lenis + ScrollTrigger sync, hero intro timeline + exit transition, preloader shell | 1 day |
| 2 | Persistent canvas + store, S2 exploded-chair assembly (the centerpiece) | 2–3 days |
| 3 | S3 horizontal materials section, S5 process reveals | 1–2 days |
| 4 | S4 turntable + camera fly-through between scenes | 2 days |
| 5 | S6 CTA/footer, mobile adaptations, reduced-motion, perf pass, QA | 1–2 days |

Each phase ships a working site — stop at any phase and it's still coherent.

## 7. Risks

- **Model quality**: free GLBs vary; pick models early (phase 2, day 1) before building around them.
- **Pin + Lenis on iOS Safari**: test early on a real device; known quirks with `position: fixed` inside transformed parents — keep the canvas outside any transformed wrapper.
- **Two pinned 3D sections back-to-back** can fatigue; S3/S5 are deliberately lighter to pace the scroll.
