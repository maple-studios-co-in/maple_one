import { chairHeroTurntable } from '../content/turntables'
import Turntable3DShowcase from '../showcase/Turntable3DShowcase'

/** "Built, not bought" — the black chair on a scroll-driven 360° turntable. */
export default function Ethos() {
  return <Turntable3DShowcase config={chairHeroTurntable} />
}
