import { tableTurntable } from '../content/turntables'
import Turntable3DShowcase from '../showcase/Turntable3DShowcase'

/** The Aeris table on a scroll-driven 360° turntable (real 3D model). */
export default function Table() {
  return <Turntable3DShowcase config={tableTurntable} />
}
