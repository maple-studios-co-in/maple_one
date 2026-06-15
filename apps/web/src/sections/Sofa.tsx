import { sofaTurntable } from '../content/turntables'
import Turntable3DShowcase from '../showcase/Turntable3DShowcase'

/** The Nimbus sofa on a scroll-driven 360° turntable (real 3D model). */
export default function Sofa() {
  return <Turntable3DShowcase config={sofaTurntable} />
}
