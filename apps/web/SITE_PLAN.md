# Maple Furnishers — Single-Page Experience Plan

**Type:** one continuous scroll experience · **Job:** brand showcase (no cart, no prices) · CTAs are *enquire* / *visit the studio*.

The site is one long, cinematic scroll. Each furniture piece is a **chapter** with its own signature motion — but they share one visual language so it reads as a single film, not four widgets. "Apart, then whole" (the chair) is the template and stays exactly as it is now.

---

## 1. The scroll narrative (chapters, top → bottom)

Heavy "piece" chapters are deliberately spaced with lighter story chapters so the scroll breathes.

| # | Chapter | Type | Signature motion |
|---|---|---|---|
| 0 | **Preloader** | — | "Maple" wordmark + load progress |
| 1 | **Hero** | story | Name + opening line, single hero silhouette, scroll cue |
| 2 | **Built, not bought** (ethos) | story | Typographic manifesto; the studio's promise |
| 3 | **The Workshop** (Craft) | piece — chair | Raw timber blocks → finished chair *(existing build sequence)* |
| 4 | **Apart, then whole** (Anatomy) | piece — chair | Exploded parts assemble on scroll *(KEEP AS-IS)* |
| 5 | **Materials** | story | Horizontal pan: wood · leather · stone palette |
| 6 | **The Sofa** | piece — sofa | *"The long view"* — lateral glide down its length |
| 7 | **The Table** | piece — table | *"A table, set"* — the surface comes to life |
| 8 | **The Dining Set** | piece — finale | *"Where we gather"* — the whole scene assembles |
| 9 | **The Studio** | story | Kirti Nagar workshop, the makers, count-up numbers |
| 10 | **Visit / Enquire** | CTA | Showroom, magnetic "Book a visit" button |
| 11 | **Footer** | — | Curtain reveal, contact, credits |

Arc: *philosophy → how it's made → each piece as a chapter → the gathering → the people → the invitation.*

---

## 2. Per-piece showcases — one language, four distinct mechanics

The risk with four pieces is repetition. Each keeps the **scrubbed, scroll-controlled** feel but a different camera/mechanic suited to the object.

### Chair — "Apart, then whole" *(done — the template)*
Parts fly apart / assemble as you scroll, landing on the photoreal chair. Live assembly meter + step legend on the left. **No changes.**

### Sofa — "The long view"
A sofa is long, low, about the afternoon. Mechanic: a slow **lateral camera glide** along its length as you scroll — left arm → seam → cushions → right arm — catching grain, stitching, the leather sheen. Pairs with horizontal-moving copy ("Made for the long afternoon"). Distinct from the chair's explode: it's a *travelling shot*, not an assembly.
*Alt option:* "Layers of comfort" cutaway — frame → webbing → foam → leather build up in cross-section. (More technical; we can A/B.)

### Table — "A table, set"
The oval travertine piece is a *gathering surface*. Mechanic: the bare table **sets itself** as you scroll — a vase, a bowl, books, a candle settle onto the top, the light warms from afternoon to evening. The object stays still; life accretes onto it. Distinct: *additive scene on a static hero*.
*Alt option:* macro push into the stone veining that pulls back to reveal the whole table ("one stone, one curve").

### Dining Set — "Where we gather" *(finale)*
The emotional payoff. Mechanic: the **full scene assembles** — the table lands, chairs glide in around it, place settings appear, warm light blooms, maybe soft silhouettes arrive. It's the only chapter that builds a *room*, not a piece — so it lands as a climax. Closes the "built, not bought" promise: this is what it's all *for*.

---

## 3. Visual & motion language (shared system)

- **Palette:** walnut/maple browns, pale **sage** leather, sand/ivory, travertine stone-grey. Each chapter leans on its piece's own tone; backgrounds tween between chapters so transitions feel continuous.
- **Type:** display serif for headlines, mono for labels/eyebrows and the live readouts (the assembly-meter style from Anatomy becomes a recurring motif — a small "data" layer on each chapter).
- **Motion:** every scrubbed value passes through one eased follower (the rAF-lerp we built) so nothing snaps. Pinned heavy chapters alternate with un-pinned story chapters for rhythm.
- **Navigation:** minimal top bar (Maple wordmark + Craft · Collection · Studio · Visit anchors) + a slim **scroll-progress line** + an optional side **chapter dot-nav**. Same nav, whole page.
- **Continuity:** persistent fixed canvas/stage behind the DOM (already the architecture) so backgrounds and 3D don't churn between chapters.

---

## 4. How each piece chapter is built (proven pipeline)

The chair's "Apart, then whole" established the recipe; we reuse it:

1. Generate a **clean studio frame** + a **second-state frame** (exploded / cutaway / set / gathered) with the image model, matched in camera + light.
2. **Higgsfield** animates between the two frames → photoreal clip.
3. Re-encode **all-intra** (every frame a keyframe) → instant, smooth scroll-scrubbing; ~3 MB each.
4. Feather the clip into the page (mask + matched gradient) so it reads as a floating object, not a video box.
5. GSAP pins the chapter; scroll drives `video.currentTime` through the eased follower; the left column carries the live "data" layer (progress, step legend, specs).

Where a true 3D moment is better (turntable, free orbit) we still have the persistent R3F canvas — but the scrubbed-video path is the workhorse: photoreal, cheap to run, and consistent.

---

## 5. Assets — have / need

| Piece | Have | Need to generate / get |
|---|---|---|
| Chair | ✅ video, 3D, frames | — |
| Sofa | ✅ `sofa.glb`, sofa render | "long view" clip (2 frames → Higgsfield) |
| Table | ✅ `table.glb`, oval-table image | "sets itself" clip; props (vase/bowl/books) via image edits |
| Dining set | partial (table + a dining-chair image) | the "gathering" scene frames → finale clip |
| Studio / Visit | — | a few warm workshop/showroom stills (real photos ideal; can generate placeholders) |

**Decisions for you:**
- The **walnut lounge chair** (image 4) — in scope as a 5th piece, or park it? (Its photo never came through; I'd need it.)
- Dining set chairs: use the **sage A-frame** chairs around the oval table, or the cream dining chairs from your table photo?
- Studio/Visit imagery: do you have **real photos** of the workshop/showroom, or should I generate stand-ins for now?

---

## 6. Build sequence (each phase ships a coherent site)

| Phase | Deliverable |
|---|---|
| **A — Frame** | Nav + scroll-progress + chapter scaffolding + design tokens; Hero & Ethos story chapters; wire existing Craft + Anatomy + Materials into the new flow |
| **B — Sofa** | "The long view" chapter (generate clip, build scrubbed section + data layer) |
| **C — Table** | "A table, set" chapter |
| **D — Dining set** | "Where we gather" finale chapter |
| **E — Story & polish** | Studio + Visit/CTA + footer; mobile, reduced-motion, performance pass, QA |

We can also raise the **chair clip quality** (1080p, wider explode) during Phase A since you flagged it.

---

## 7. Risks & guards
- **Repetition** across four piece-chapters → mitigated by the four distinct mechanics above + lighter story chapters between.
- **Payload** (four ~3 MB clips + 3D) → lazy-load each chapter's clip on approach; never load all at once.
- **Mobile** → each scrubbed chapter gets a shorter pin + a static poster fallback; reduced-motion shows the finished piece, no scrub.
- **Generation consistency** → always derive the second frame *from* the first so camera/light match (the trick that made the chair clip clean).
