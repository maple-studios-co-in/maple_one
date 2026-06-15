import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import HybridChair from '../HybridChair'
import { useExperience } from '../store'

/** Craft section: the chair builds up from raw timber blocks into the finished piece. */
export default function AssemblyScene() {
  const group = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    const g = group.current
    if (!g) return
    const { activeScene } = useExperience.getState()
    g.visible = activeScene === 'assembly'
    if (!g.visible) return
    const t = clock.elapsedTime
    g.rotation.y = -0.4 + t * 0.1 + Math.sin(t * 0.3) * 0.03
    g.position.y = -0.78 + Math.sin(t * 0.7) * 0.02
  })

  return (
    <group ref={group} visible={false} position={[0.55, -0.78, 0]}>
      <HybridChair
        mode="build"
        getProgress={() => useExperience.getState().assemblyProgress}
        scale={1.05}
      />
    </group>
  )
}
