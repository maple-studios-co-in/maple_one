import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import ChairModel from '../ChairModel'
import { Bench, SideTable } from '../FurniturePieces'
import { woodMaple } from '../materials'
import { useExperience } from '../store'

const smooth = (t: number) => t * t * (3 - 2 * t)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

const PIECE_COUNT = 3

export default function TurntableScene() {
  const group = useRef<THREE.Group>(null)
  const pieces = useRef<(THREE.Group | null)[]>([])

  useFrame(({ clock }) => {
    const g = group.current
    if (!g) return
    const { activeScene, turntableProgress } = useExperience.getState()
    g.visible = activeScene === 'turntable'
    if (!g.visible) return
    const t = clock.elapsedTime
    const active = turntableProgress * (PIECE_COUNT - 1)
    pieces.current.forEach((piece, i) => {
      if (!piece) return
      const d = Math.abs(active - i)
      const presence = smooth(clamp01(1 - d))
      piece.visible = presence > 0.01
      piece.scale.setScalar(0.55 + presence * 0.65)
      piece.position.y = (1 - presence) * -0.55
      piece.rotation.y = t * 0.22 + turntableProgress * 3.4 + i * 1.4
    })
    g.rotation.y = Math.sin(t * 0.18) * 0.05
  })

  return (
    <group ref={group} visible={false} position={[0.62, -0.72, 0]}>
      {/* pedestal */}
      <mesh material={woodMaple} position={[0, -0.06, 0]}>
        <cylinderGeometry args={[1.35, 1.45, 0.1, 64]} />
      </mesh>
      <group ref={(el) => { pieces.current[0] = el }}>
        <ChairModel scale={1.05} />
      </group>
      <group ref={(el) => { pieces.current[1] = el }}>
        <SideTable />
      </group>
      <group ref={(el) => { pieces.current[2] = el }}>
        <Bench />
      </group>
    </group>
  )
}
