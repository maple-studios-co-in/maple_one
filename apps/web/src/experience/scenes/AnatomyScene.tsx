import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import RealChairParts from '../RealChairParts'
import { useExperience } from '../store'

/** Anatomy section: the real scanned chair splits into its structural parts and assembles. */
export default function AnatomyScene() {
  const group = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    const g = group.current
    if (!g) return
    const { activeScene } = useExperience.getState()
    g.visible = activeScene === 'anatomy'
    if (!g.visible) return
    const t = clock.elapsedTime
    g.rotation.y = -0.5 + t * 0.14 + Math.sin(t * 0.3) * 0.03
    g.position.y = -0.78 + Math.sin(t * 0.7) * 0.02
  })

  return (
    <group ref={group} visible={false} position={[0.55, -0.78, 0]}>
      <RealChairParts
        getProgress={() => useExperience.getState().anatomyProgress}
        scale={1.05}
      />
    </group>
  )
}
