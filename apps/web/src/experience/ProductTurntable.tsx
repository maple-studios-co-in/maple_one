import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useExperience } from './store'
import type { SceneName } from './store'

interface TurntableModelProps {
  url: string
  /** activeScene value that switches this model on */
  scene: SceneName
  targetHeight?: number
  position?: [number, number, number]
}

/**
 * A single product GLB on a 360° turntable. Shown when the store's activeScene
 * matches `scene`; spins a full turn driven by store.spinProgress (0→1 = 0→360°),
 * with a slow idle drift + gentle sway. Real geometry → a clean spin, no
 * hallucinated back faces.
 */
export default function TurntableModel({
  url,
  scene,
  targetHeight = 1.5,
  position = [0.3, -0.85, 0],
}: TurntableModelProps) {
  const { scene: gltf } = useGLTF(url)

  const model = useMemo(() => {
    const root = gltf.clone(true)
    const box = new THREE.Box3().setFromObject(root)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    // fit the LARGEST dimension (not just height) so long, low pieces like the
    // sofa/table don't blow up in width and spill off-frame
    const maxDim = Math.max(size.x, size.y, size.z)
    const s = targetHeight / maxDim
    root.scale.setScalar(s)
    root.position.set(-center.x * s, -box.min.y * s, -center.z * s)
    root.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh) return
      m.castShadow = true
      m.receiveShadow = true
      const mat = m.material as THREE.MeshStandardMaterial | undefined
      if (mat) mat.envMapIntensity = 1.1
    })
    return root
  }, [gltf, targetHeight])

  const group = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    const g = group.current
    if (!g) return
    const { activeScene, spinProgress } = useExperience.getState()
    const on = activeScene === scene
    g.visible = on
    if (!on) return
    const t = clock.elapsedTime
    g.rotation.y = -0.5 + spinProgress * Math.PI * 2 + t * 0.05
    // zoom rises and falls WITHIN the 360° turn (peaks at the half-turn), and
    // drifts toward centre as it zooms so the enlarged piece stays in frame
    const p = THREE.MathUtils.clamp(spinProgress, 0, 1)
    const z = Math.sin(p * Math.PI)
    g.scale.setScalar(1 + 0.7 * z)
    g.position.x = position[0] * (1 - 0.5 * z)
    g.position.y = position[1] - 0.22 * z + Math.sin(t * 0.6) * 0.015
  })

  return (
    <group ref={group} visible={false} position={position}>
      <primitive object={model} />
    </group>
  )
}

useGLTF.preload('/models/sofa.glb')
useGLTF.preload('/models/table.glb')
