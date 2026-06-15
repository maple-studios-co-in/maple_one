import { RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { fabricIvory, fabricSand, wood, woodDark } from './materials'

type Vec3 = [number, number, number]

interface PartDef {
  id: string
  /** Resting (assembled) position */
  final: Vec3
  /** Added offset when fully exploded */
  explode: Vec3
  /** Extra rotation when exploded (resolves to 0) */
  spin: Vec3
  /** Assembled rotation */
  rot?: Vec3
  /** Portion of overall progress this part animates within */
  window: [number, number]
}

const PARTS: PartDef[] = [
  { id: 'legFL', final: [-0.42, 0.25, 0.35], explode: [-0.55, -0.85, 0.6], spin: [0.4, 2.2, 0.3], window: [0.0, 0.34] },
  { id: 'legFR', final: [0.42, 0.25, 0.35], explode: [0.55, -0.85, 0.6], spin: [-0.4, -2.2, 0.3], window: [0.05, 0.39] },
  { id: 'legBL', final: [-0.42, 0.25, -0.35], explode: [-0.6, -0.8, -0.6], spin: [0.5, 1.8, -0.4], window: [0.1, 0.44] },
  { id: 'legBR', final: [0.42, 0.25, -0.35], explode: [0.6, -0.8, -0.6], spin: [-0.5, -1.8, -0.4], window: [0.15, 0.49] },
  { id: 'seatFrame', final: [0, 0.56, 0], explode: [0, 0.4, 1.25], spin: [0.6, 0, 0.2], window: [0.2, 0.54] },
  { id: 'seatCushion', final: [0, 0.71, 0], explode: [0, 1.35, 0.55], spin: [-0.5, 0.4, 0], window: [0.38, 0.68] },
  { id: 'armL', final: [-0.52, 0, 0], explode: [-1.35, 0.45, 0], spin: [0, 0, 1.1], window: [0.5, 0.78] },
  { id: 'armR', final: [0.52, 0, 0], explode: [1.35, 0.45, 0], spin: [0, 0, -1.1], window: [0.54, 0.82] },
  { id: 'backFrame', final: [0, 1.06, -0.41], explode: [0, 0.95, -1.3], spin: [-0.7, 0, 0], rot: [-0.13, 0, 0], window: [0.6, 0.88] },
  { id: 'backCushion', final: [0, 1.07, -0.3], explode: [0, 0.75, 0.95], spin: [0.8, 0, 0.2], rot: [-0.13, 0, 0], window: [0.74, 1.0] },
]

const smooth = (t: number) => t * t * (3 - 2 * t)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

function partLocalProgress(p: number, [a, b]: [number, number]) {
  return smooth(clamp01((p - a) / (b - a)))
}

function PartMeshes({ id }: { id: string }) {
  switch (id) {
    case 'legFL':
    case 'legFR':
    case 'legBL':
    case 'legBR':
      return (
        <mesh material={woodDark}>
          <cylinderGeometry args={[0.032, 0.05, 0.5, 20]} />
        </mesh>
      )
    case 'seatFrame':
      return (
        <RoundedBox args={[1.04, 0.12, 0.92]} radius={0.035} smoothness={4} material={wood} />
      )
    case 'seatCushion':
      return (
        <RoundedBox args={[1.0, 0.17, 0.88]} radius={0.06} smoothness={4} material={fabricSand} />
      )
    case 'armL':
    case 'armR':
      return (
        <>
          <RoundedBox args={[0.09, 0.07, 0.86]} radius={0.03} smoothness={4} position={[0, 0.86, 0]} material={wood} />
          <mesh material={woodDark} position={[0, 0.7, 0.32]}>
            <cylinderGeometry args={[0.026, 0.032, 0.28, 16]} />
          </mesh>
        </>
      )
    case 'backFrame':
      return (
        <RoundedBox args={[1.04, 0.68, 0.1]} radius={0.045} smoothness={4} material={wood} />
      )
    case 'backCushion':
      return (
        <RoundedBox args={[0.94, 0.58, 0.13]} radius={0.055} smoothness={4} material={fabricIvory} />
      )
    default:
      return null
  }
}

interface ChairModelProps {
  /** Returns assembly progress each frame; omit for a static assembled chair */
  getProgress?: () => number
  scale?: number
}

/**
 * Procedural mid-century armchair built from primitives so every part can be
 * exploded/assembled. Swap for a real GLB later by keeping the same part ids.
 */
export default function ChairModel({ getProgress, scale = 1 }: ChairModelProps) {
  const refs = useRef<Record<string, THREE.Group | null>>({})

  useFrame(({ clock }) => {
    if (!getProgress) return
    const p = getProgress()
    const t = clock.elapsedTime
    for (const part of PARTS) {
      const g = refs.current[part.id]
      if (!g) continue
      const lp = partLocalProgress(p, part.window)
      const inv = 1 - lp
      // gentle drift while a part is still detached
      const drift = inv * 0.03
      g.position.set(
        part.final[0] + part.explode[0] * inv + Math.sin(t * 0.8 + part.final[0] * 5) * drift,
        part.final[1] + part.explode[1] * inv + Math.sin(t * 1.1 + part.final[2] * 7) * drift,
        part.final[2] + part.explode[2] * inv,
      )
      const baseRot = part.rot ?? [0, 0, 0]
      g.rotation.set(
        baseRot[0] + part.spin[0] * inv,
        baseRot[1] + part.spin[1] * inv,
        baseRot[2] + part.spin[2] * inv,
      )
    }
  })

  return (
    <group scale={scale}>
      {PARTS.map((part) => (
        <group
          key={part.id}
          ref={(el) => {
            refs.current[part.id] = el
          }}
          position={part.final}
          rotation={part.rot ?? [0, 0, 0]}
        >
          <PartMeshes id={part.id} />
        </group>
      ))}
    </group>
  )
}
