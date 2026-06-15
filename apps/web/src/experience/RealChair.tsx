import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const MODEL_URL = '/models/chair.glb'
useGLTF.preload(MODEL_URL)

interface RealChairProps {
  /** Reveal/turntable progress (0 → entering, 1 → settled). Ignored when getOpacity is set. */
  getProgress?: () => number
  /** When provided, the chair sits fully assembled and only fades its opacity (hybrid crossfade). */
  getOpacity?: () => number
  targetHeight?: number
  scale?: number
}

/**
 * Photoreal chair generated from the studio photo (image-to-3D, Meshy).
 * Single textured GLB. In the hybrid setup it sits fully assembled and is
 * cross-faded in over the authored parts at the end of the scroll, so the
 * piece *rests* as the real scan while the parts animation does the motion.
 */
export default function RealChair({
  getProgress,
  getOpacity,
  targetHeight = 1.9,
  scale = 1,
}: RealChairProps) {
  const { scene } = useGLTF(MODEL_URL)

  const { model, materials } = useMemo(() => {
    const root = scene.clone(true)
    const box = new THREE.Box3().setFromObject(root)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    const s = targetHeight / size.y
    root.scale.setScalar(s)
    root.position.set(-center.x * s, -box.min.y * s, -center.z * s)

    const materials: THREE.MeshStandardMaterial[] = []
    root.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (!mesh.isMesh) return
      mesh.castShadow = true
      mesh.receiveShadow = true
      // clone material so opacity changes don't leak to other instances
      const src = mesh.material as THREE.MeshStandardMaterial
      const mat = src.clone()
      mat.envMapIntensity = 0.85
      if (getOpacity) {
        mat.transparent = true
        mat.depthWrite = false
      }
      mesh.material = mat
      materials.push(mat)
    })

    return { model: root, materials }
  }, [scene, targetHeight, getOpacity])

  const inner = useRef<THREE.Group>(null)
  const outer = useRef<THREE.Group>(null)

  useFrame(() => {
    if (getOpacity) {
      const o = THREE.MathUtils.clamp(getOpacity(), 0, 1)
      const fading = o < 0.985
      for (const m of materials) {
        m.opacity = o
        m.transparent = fading
        m.depthWrite = !fading
      }
      if (outer.current) outer.current.visible = o > 0.015
      return
    }
    const g = inner.current
    if (!g) return
    const p = getProgress ? getProgress() : 1
    const r = THREE.MathUtils.smoothstep(p, 0, 0.55)
    g.scale.setScalar(0.5 + 0.5 * r)
    g.position.y = (1 - r) * -0.5
    const settle = Math.sin(THREE.MathUtils.clamp((p - 0.55) / 0.25, 0, 1) * Math.PI) * 0.03
    g.position.y += settle
  })

  return (
    <group ref={outer} scale={scale}>
      <group ref={inner}>
        <primitive object={model} />
      </group>
    </group>
  )
}
