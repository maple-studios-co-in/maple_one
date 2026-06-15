import type { ScrubShowcaseConfig } from '../showcase/types'

/**
 * Maple Furnishers showcase content. Each piece is one config object consumed by
 * <ScrollScrubShowcase>. To add a piece: drop its scrubbed clip in /public/videos,
 * copy a block below, swap the video + copy + (optionally) theme. Nothing else.
 *
 * Brand voice pulled from shop.maplefurnishers.com — "Quiet luxury", "Built for
 * real living", "Elegance isn't found — at Maple, it is custom-built."
 */

// ── Chair — "Apart, then whole" (live; unchanged behaviour) ────────────────
export const chairShowcase: ScrubShowcaseConfig = {
  id: 'anatomy',
  eyebrow: 'Anatomy of a chair · 13 parts',
  title: (
    <>
      Apart,
      <br />
      then whole.
    </>
  ),
  scrollCue: 'Scroll to assemble',
  video: { src: '/videos/chair_assemble.mp4', poster: '/videos/chair_assemble_poster.jpg' },
  theme: {
    background: 'linear-gradient(180deg,#A89074 0%,#C2B392 46%,#D3CAAF 100%)',
    ink: '#241310',
    inkMuted: '#241310',
    accent: '#241310',
  },
  meter: { startLabel: 'Disassembled', endLabel: 'Assembled', unitLabel: '% assembled' },
  steps: [
    { num: '01', title: 'The frame', copy: 'Four splayed legs, two rails, the seat frame — the walnut A-frame finds its footing.' },
    { num: '02', title: 'The cushions', copy: 'Sage leather lowers onto the seat; the back panel floats into place.' },
    { num: '03', title: 'Whole', copy: 'Bound at the joints, the parts resolve into a single, quiet silhouette.' },
  ],
  stepThresholds: [0.4, 0.72],
  pin: { desktop: '+=440%', mobile: '+=260%' },
  clip: { objectPosition: '50% 46%', zoom: [0.93, 1], side: 'right' },
}

// ── Upcoming pieces — content scaffolded, awaiting their scrubbed clips ─────
// Drop the clip in /public/videos, then render <ScrollScrubShowcase config={…}>.

export const sofaShowcase: ScrubShowcaseConfig = {
  id: 'sofa',
  eyebrow: 'The Nimbus sofa · the long view',
  title: (
    <>
      Made for the
      <br />
      long afternoon.
    </>
  ),
  scrollCue: 'Scroll the length',
  media: {
    kind: 'image-pan',
    src: '/images/sofa_longview.jpg',
    alt: 'The Maple Nimbus three-seater sofa in profile',
    panFrom: 8,
    panTo: 92,
  },
  pin: { desktop: '+=320%', mobile: '+=220%' },
  theme: {
    background: 'linear-gradient(180deg,#9C8A74 0%,#BCAE97 48%,#D7CDB7 100%)',
    ink: '#241310',
    accent: '#241310',
  },
  meter: { startLabel: 'Left arm', endLabel: 'Right arm', unitLabel: '% along' },
  steps: [
    { num: '01', title: 'Cloud-like comfort', copy: 'Down-wrapped cushions over a hardwood frame — soft presence, strong craftsmanship.' },
    { num: '02', title: 'One clean seam', copy: 'A single run of leather, hand-stitched, the grain reading end to end.' },
    { num: '03', title: 'Built for real living', copy: 'Made not only for photographs, but for everyday comfort and use.' },
  ],
  stepThresholds: [0.4, 0.72],
  clip: { objectPosition: '50% 50%', side: 'right' },
}

export const tableShowcase: ScrubShowcaseConfig = {
  id: 'table',
  eyebrow: 'The Aeris table · a table, set',
  title: (
    <>
      Where the day
      <br />
      gathers.
    </>
  ),
  scrollCue: 'Scroll to set the table',
  video: { src: '/videos/table_set.mp4', poster: '/videos/table_set_poster.jpg' },
  theme: {
    background: 'linear-gradient(180deg,#B9AE9C 0%,#D2C9B6 50%,#E7DECB 100%)',
    ink: '#241310',
    accent: '#241310',
  },
  meter: { startLabel: 'Bare', endLabel: 'Set', unitLabel: '% set' },
  steps: [
    { num: '01', title: 'One stone, one curve', copy: 'A travertine top floats on a single sculpted pedestal — quiet, grounded.' },
    { num: '02', title: 'The setting', copy: 'A vase, a bowl, a candle find their places as the light warms toward evening.' },
    { num: '03', title: 'Ready', copy: 'A surface that asks people to stay a while longer.' },
  ],
  stepThresholds: [0.4, 0.72],
  clip: { objectPosition: '50% 52%', side: 'right' },
}

export const diningSetShowcase: ScrubShowcaseConfig = {
  id: 'dining-set',
  eyebrow: 'The dining set · where we gather',
  title: (
    <>
      Built, then
      <br />
      lived in.
    </>
  ),
  scrollCue: 'Scroll to gather',
  video: { src: '/videos/dining_gather.mp4', poster: '/videos/dining_gather_poster.jpg' },
  theme: {
    background: 'linear-gradient(180deg,#5C463A 0%,#8A6F57 52%,#C2A883 100%)',
    ink: '#FFF8ED',
    inkMuted: '#F3E8D5',
    accent: '#E7DECB',
  },
  meter: { startLabel: 'Empty room', endLabel: 'Gathered', unitLabel: '% gathered' },
  steps: [
    { num: '01', title: 'The table lands', copy: 'The Aeris table settles at the centre of the room.' },
    { num: '02', title: 'Chairs draw in', copy: 'The set arrives around it, each seat finding its place.' },
    { num: '03', title: 'Evening', copy: 'Warm light, set places — this is what it was all built for.' },
  ],
  stepThresholds: [0.4, 0.72],
  clip: { objectPosition: '50% 50%', side: 'right' },
}
