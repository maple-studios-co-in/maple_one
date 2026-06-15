import type { Turntable3DConfig } from '../showcase/Turntable3DShowcase'

/** Charcoal ink over the warm studio canvas backdrop. */
const INK = { ink: '#11100E', inkMuted: '#241310', accent: '#241310' }

export const chairHeroTurntable: Turntable3DConfig = {
  id: 'ethos',
  scene: 'chair-hero',
  eyebrow: 'The Maple promise',
  title: (
    <>
      Built,
      <br />
      not bought.
    </>
  ),
  lead: 'Elegance isn’t found. At Maple, it is custom-built — every piece hand-finished in our Kirti Nagar workshop, made to last and built to breathe quiet luxury into the rooms you live in.',
  proof: ['In-house crafted in Delhi', '36-month warranty', '20+ cities'],
  scrollCue: 'Scroll to spin',
  theme: INK,
  pin: { desktop: '+=360%', mobile: '+=220%' },
}

export const sofaTurntable: Turntable3DConfig = {
  id: 'sofa',
  scene: 'sofa',
  eyebrow: 'The Nimbus sofa · in the round',
  title: (
    <>
      Seen from
      <br />
      every side.
    </>
  ),
  scrollCue: 'Scroll to spin',
  theme: INK,
  steps: [
    { num: '01', title: 'Cloud-like comfort', copy: 'Down-wrapped cushions over a hardwood frame — soft presence, strong craftsmanship.' },
    { num: '02', title: 'Honest joinery', copy: 'Exposed walnut arms and splayed legs, the grain reading the whole way round.' },
    { num: '03', title: 'Built for real living', copy: 'Made not only for the photograph, but for the long afternoon.' },
  ],
  stepThresholds: [0.4, 0.72],
  pin: { desktop: '+=360%', mobile: '+=220%' },
}

export const tableTurntable: Turntable3DConfig = {
  id: 'table',
  scene: 'table',
  eyebrow: 'The Aeris table · in the round',
  title: (
    <>
      One stone,
      <br />
      every angle.
    </>
  ),
  scrollCue: 'Scroll to spin',
  theme: INK,
  steps: [
    { num: '01', title: 'A floating top', copy: 'A travertine oval rests on a single sculpted pedestal — quiet, grounded.' },
    { num: '02', title: 'One continuous curve', copy: 'The base reads as one gesture, turned and finished by hand.' },
    { num: '03', title: 'Ready to gather', copy: 'A surface that asks people to stay a while longer.' },
  ],
  stepThresholds: [0.4, 0.72],
  pin: { desktop: '+=360%', mobile: '+=220%' },
}
