import { RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import {
  fabricSand as baseFabricSand,
  rawTimber as baseRawTimber,
  sageLeather as baseSageLeather,
  wood as baseWood,
  woodDark as baseWoodDark,
} from './materials'

type Vec3 = [number, number, number]
type Kind = 'wood' | 'leather' | 'rope'

interface PartDef {
  id: string
  kind: Kind
  final: Vec3
  rot?: Vec3
  explode: Vec3
  spin: Vec3
  window: [number, number]
  raw?: Vec3
}

/**
 * The original Maple Furnishers piece — a walnut A-frame armchair with a pale
 * sage leather seat + back and rope-wrapped arm joints — authored as discrete,
 * well-defined parts so it can either (a) assemble cleanly from exploded parts,
 * or (b) build up from raw timber blocks into the finished, upholstered chair.
 *
 * Progress (both modes): 0 = apart / raw, 1 = finished + assembled.
 * getOpacity (optional) fades the whole chair for the hybrid crossfade to the
 * real scanned model — materials are cloned so the fade is instance-local.
 */
const PARTS: PartDef[] = [
  { id: 'legFL', kind: 'wood', final: [-0.4, 0.31, 0.32], rot: [0.16, 0, 0.14], explode: [-0.7, -0.7, 0.5], spin: [0.4, 1.6, 0.3], window: [0.0, 0.3], raw: [0.14, 0.72, 0.14] },
  { id: 'legFR', kind: 'wood', final: [0.4, 0.31, 0.32], rot: [0.16, 0, -0.14], explode: [0.7, -0.7, 0.5], spin: [-0.4, -1.6, 0.3], window: [0.04, 0.34], raw: [0.14, 0.72, 0.14] },
  { id: 'legBL', kind: 'wood', final: [-0.4, 0.31, -0.32], rot: [-0.16, 0, 0.14], explode: [-0.75, -0.6, -0.5], spin: [0.5, 1.3, -0.4], window: [0.08, 0.38], raw: [0.14, 0.72, 0.14] },
  { id: 'legBR', kind: 'wood', final: [0.4, 0.31, -0.32], rot: [-0.16, 0, -0.14], explode: [0.75, -0.6, -0.5], spin: [-0.5, -1.3, -0.4], window: [0.12, 0.42], raw: [0.14, 0.72, 0.14] },
  { id: 'railL', kind: 'wood', final: [-0.4, 0.54, 0], explode: [-1.1, 0.2, 0], spin: [0, 0, 0.9], window: [0.2, 0.5], raw: [0.12, 0.12, 0.82] },
  { id: 'railR', kind: 'wood', final: [0.4, 0.54, 0], explode: [1.1, 0.2, 0], spin: [0, 0, -0.9], window: [0.22, 0.52], raw: [0.12, 0.12, 0.82] },
  { id: 'seatFrame', kind: 'wood', final: [0, 0.6, 0], explode: [0, 0.5, 1.2], spin: [0.5, 0, 0.2], window: [0.28, 0.58], raw: [1.0, 0.16, 0.9] },
  { id: 'armL', kind: 'wood', final: [-0.43, 0.98, -0.02], explode: [-1.3, 0.5, 0], spin: [0, 0, 1.1], window: [0.36, 0.66], raw: [0.12, 0.12, 0.74] },
  { id: 'armR', kind: 'wood', final: [0.43, 0.98, -0.02], explode: [1.3, 0.5, 0], spin: [0, 0, -1.1], window: [0.38, 0.68], raw: [0.12, 0.12, 0.74] },
  { id: 'backPanel', kind: 'leather', final: [0, 1.16, -0.32], rot: [-0.16, 0, 0], explode: [0, 0.9, -1.2], spin: [-0.7, 0, 0.2], window: [0.52, 0.82] },
  { id: 'ropeL', kind: 'rope', final: [-0.4, 0.99, -0.24], explode: [-0.6, 0.4, -0.4], spin: [0.6, 0.6, 0], window: [0.6, 0.86] },
  { id: 'ropeR', kind: 'rope', final: [0.4, 0.99, -0.24], explode: [0.6, 0.4, -0.4], spin: [-0.6, -0.6, 0], window: [0.62, 0.88] },
  { id: 'seatCushion', kind: 'leather', final: [0, 0.74, 0], explode: [0, 1.3, 0.5], spin: [-0.5, 0.4, 0], window: [0.66, 0.94] },
]

const smooth = (t: number) => t * t * (3 - 2 * t)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const localProgress = (p: number, [a, b]: [number, number]) => smooth(clamp01((p - a) / (b - a)))

interface MatSet {
  woodDark: THREE.Material
  wood: THREE.Material
  sageLeather: THREE.Material
  fabricSand: THREE.Material
  rawTimber: THREE.Material
}

function FinishedMesh({ id, mats }: { id: string; mats: MatSet }) {
  switch (id) {
    case 'legFL':
    case 'legFR':
    case 'legBL':
    case 'legBR':
      return (
        <mesh material={mats.woodDark} castShadow>
          <cylinderGeometry args={[0.035, 0.055, 0.62, 20]} />
        </mesh>
      )
    case 'railL':
    case 'railR':
      return <RoundedBox args={[0.07, 0.07, 0.78]} radius={0.03} smoothness={4} material={mats.wood} castShadow />
    case 'seatFrame':
      return <RoundedBox args={[0.94, 0.1, 0.84]} radius={0.035} smoothness={4} material={mats.wood} castShadow />
    case 'armL':
    case 'armR':
      return (
        <>
          <RoundedBox args={[0.07, 0.07, 0.66]} radius={0.03} smoothness={4} material={mats.wood} castShadow />
          <mesh material={mats.woodDark} position={[0, -0.18, 0.31]} castShadow>
            <cylinderGeometry args={[0.028, 0.032, 0.32, 16]} />
          </mesh>
        </>
      )
    case 'backPanel':
      return <RoundedBox args={[0.86, 0.46, 0.12]} radius={0.06} smoothness={5} material={mats.sageLeather} castShadow />
    case 'seatCushion':
      return <RoundedBox args={[0.9, 0.17, 0.8]} radius={0.07} smoothness={5} material={mats.sageLeather} castShadow />
    case 'ropeL':
    case 'ropeR':
      return (
        <mesh material={mats.fabricSand} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.1, 16]} />
        </mesh>
      )
    default:
      return null
  }
}

interface PartHandle {
  group: THREE.Group | null
  raw: THREE.Group | null
  fin: THREE.Group | null
}

interface StudioChairProps {
  getProgress?: () => number
  getOpacity?: () => number
  mode?: 'build' | 'parts'
  scale?: number
}

export default function StudioChair({ getProgress, getOpacity, mode = 'parts', scale = 1 }: StudioChairProps) {
  const handles = useRef<Record<string, PartHandle>>({})

  // Clone materials per instance only when we need to fade them.
  const { mats, fadeList } = useMemo(() => {
    if (!getOpacity) {
      return {
        mats: {
          woodDark: baseWoodDark,
          wood: baseWood,
          sageLeather: baseSageLeather,
          fabricSand: baseFabricSand,
          rawTimber: baseRawTimber,
        } as MatSet,
        fadeList: [] as THREE.Material[],
      }
    }
    const clone = (m: THREE.Material) => {
      const c = m.clone()
      c.transparent = true
      c.depthWrite = false
      return c
    }
    const woodDark = clone(baseWoodDark)
    const wood = clone(baseWood)
    const sageLeather = clone(baseSageLeather)
    const fabricSand = clone(baseFabricSand)
    const rawTimber = clone(baseRawTimber)
    return {
      mats: { woodDark, wood, sageLeather, fabricSand, rawTimber } as MatSet,
      fadeList: [woodDark, wood, sageLeather, fabricSand, rawTimber] as THREE.Material[],
    }
  }, [getOpacity])

  useFrame(() => {
    const p = getProgress ? getProgress() : 1

    if (getOpacity) {
      const o = THREE.MathUtils.clamp(getOpacity(), 0, 1)
      const fading = o < 0.985
      for (const m of fadeList) {
        const ms = m as THREE.MeshStandardMaterial
        ms.opacity = o
        ms.transparent = fading
        ms.depthWrite = !fading
      }
    }

    for (const part of PARTS) {
      const h = handles.current[part.id]
      if (!h || !h.group) continue
      const move = localProgress(p, part.window)
      const inv = 1 - move
      h.group.position.set(
        part.final[0] + part.explode[0] * inv,
        part.final[1] + part.explode[1] * inv,
        part.final[2] + part.explode[2] * inv,
      )
      const baseRot = part.rot ?? [0, 0, 0]
      h.group.rotation.set(
        baseRot[0] + part.spin[0] * inv,
        baseRot[1] + part.spin[1] * inv,
        baseRot[2] + part.spin[2] * inv,
      )

      if (mode === 'build') {
        if (part.kind === 'wood') {
          const formA = part.window[0] + (part.window[1] - part.window[0]) * 0.55
          const form = localProgress(p, [formA, Math.min(1, part.window[1] + 0.05)])
          if (h.raw) {
            h.raw.scale.setScalar(1 - form)
            h.raw.visible = 1 - form > 0.02
          }
          if (h.fin) {
            h.fin.scale.setScalar(form)
            h.fin.visible = form > 0.02
          }
        } else {
          if (h.raw) h.raw.visible = false
          if (h.fin) {
            const ap = localProgress(p, part.window)
            h.fin.scale.setScalar(ap)
            h.fin.visible = ap > 0.02
          }
        }
      } else {
        if (h.raw) h.raw.visible = false
        if (h.fin) {
          h.fin.visible = true
          h.fin.scale.setScalar(1)
        }
      }
    }
  })

  return (
    <group scale={scale}>
      {PARTS.map((part) => (
        <group
          key={part.id}
          ref={(el) => {
            handles.current[part.id] = { ...(handles.current[part.id] ?? { raw: null, fin: null }), group: el }
          }}
          position={part.final}
          rotation={part.rot ?? [0, 0, 0]}
        >
          {part.kind === 'wood' && part.raw && (
            <group
              ref={(el) => {
                handles.current[part.id] = { ...(handles.current[part.id] ?? { group: null, fin: null }), raw: el }
              }}
            >
              <RoundedBox args={part.raw} radius={0.012} smoothness={2} material={mats.rawTimber} castShadow />
            </group>
          )}
          <group
            ref={(el) => {
              handles.current[part.id] = { ...(handles.current[part.id] ?? { group: null, raw: null }), fin: el }
            }}
          >
            <FinishedMesh id={part.id} mats={mats} />
          </group>
        </group>
      ))}
    </group>
  )
}
