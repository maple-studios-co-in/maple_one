import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const MODEL_URL = '/models/chair.glb'
useGLTF.preload(MODEL_URL)

interface RealChairPartsProps {
  /** 0 = parts apart, 1 = assembled into the whole real chair. */
  getProgress?: () => number
  targetHeight?: number
  explodeDistance?: number
  scale?: number
}

const smooth = (t: number) => t * t * (3 - 2 * t)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const localProgress = (p: number, [a, b]: [number, number]) => smooth(clamp01((p - a) / (b - a)))

interface Part {
  geometry: THREE.BufferGeometry
  home: THREE.Vector3
  explode: THREE.Vector3
  spin: THREE.Vector3
  win: [number, number]
}

/** Pull world-space triangle soup (position/normal/uv) out of the loaded scene. */
function collect(scene: THREE.Object3D) {
  const position: number[] = []
  const normal: number[] = []
  const uv: number[] = []
  let material: THREE.Material = new THREE.MeshStandardMaterial()
  scene.updateWorldMatrix(true, true)
  scene.traverse((o) => {
    const mesh = o as THREE.Mesh
    if (!mesh.isMesh) return
    material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
    const g = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone()
    g.applyMatrix4(mesh.matrixWorld)
    const p = g.getAttribute('position')
    const n = g.getAttribute('normal')
    const t = g.getAttribute('uv')
    for (let i = 0; i < p.count; i++) {
      position.push(p.getX(i), p.getY(i), p.getZ(i))
      if (n) normal.push(n.getX(i), n.getY(i), n.getZ(i))
      if (t) uv.push(t.getX(i), t.getY(i))
    }
  })
  return {
    position: new Float32Array(position),
    normal: normal.length ? new Float32Array(normal) : null,
    uv: uv.length ? new Float32Array(uv) : null,
    material,
  }
}

// structural segmentation → leg×4, seat, arm×2, back. Returns a stable key.
function partKey(xn: number, yn: number, zn: number): string {
  if (yn < 0.42) return `leg_${xn < 0 ? 'L' : 'R'}${zn > 0 ? 'F' : 'B'}`
  if (yn >= 0.58 && Math.abs(xn) > 0.3) return xn < 0 ? 'arm_L' : 'arm_R'
  if (yn >= 0.55) return 'back'
  return 'seat'
}

// disassembly choreography per part group (assemble order: legs → seat → arms → back)
function partMotion(key: string, dir: THREE.Vector3, dist: number) {
  if (key.startsWith('leg')) {
    const order = { leg_LF: 0, leg_RF: 0.04, leg_LB: 0.08, leg_RB: 0.12 }[key] ?? 0
    return {
      explode: new THREE.Vector3(dir.x * dist, -0.45 * dist, dir.z * dist),
      spin: new THREE.Vector3(dir.z * 0.5, 0.3, -dir.x * 0.5),
      win: [order, order + 0.34] as [number, number],
    }
  }
  if (key === 'seat') {
    return {
      explode: new THREE.Vector3(0, 0.32 * dist, 0.55 * dist),
      spin: new THREE.Vector3(0.35, 0, 0),
      win: [0.3, 0.64] as [number, number],
    }
  }
  if (key.startsWith('arm')) {
    const order = key === 'arm_L' ? 0.46 : 0.48
    return {
      explode: new THREE.Vector3(dir.x * dist * 1.15, 0.18 * dist, 0),
      spin: new THREE.Vector3(0, 0, -dir.x * 0.6),
      win: [order, order + 0.3] as [number, number],
    }
  }
  // back
  return {
    explode: new THREE.Vector3(0, 0.5 * dist, -0.95 * dist),
    spin: new THREE.Vector3(-0.5, 0, 0),
    win: [0.6, 0.92] as [number, number],
  }
}

/**
 * The real photoreal scan, split (at load) into its structural parts — four
 * legs, seat, two arms, back — preserving the baked texture. The parts fly
 * apart / together with scroll. Cut interiors render double-sided so the
 * separated parts read as solid rather than hollow shells.
 */
export default function RealChairParts({
  getProgress,
  targetHeight = 1.5,
  explodeDistance = 0.8,
  scale = 1,
}: RealChairPartsProps) {
  const { scene } = useGLTF(MODEL_URL)

  const { parts, material, norm } = useMemo(() => {
    const { position, normal, uv, material } = collect(scene)
    const mat = (material as THREE.MeshStandardMaterial).clone()
    mat.side = THREE.DoubleSide

    const triCount = position.length / 9
    const min = new THREE.Vector3(Infinity, Infinity, Infinity)
    const max = new THREE.Vector3(-Infinity, -Infinity, -Infinity)
    for (let i = 0; i < position.length; i += 3) {
      min.x = Math.min(min.x, position[i]); max.x = Math.max(max.x, position[i])
      min.y = Math.min(min.y, position[i + 1]); max.y = Math.max(max.y, position[i + 1])
      min.z = Math.min(min.z, position[i + 2]); max.z = Math.max(max.z, position[i + 2])
    }
    const center = new THREE.Vector3().addVectors(min, max).multiplyScalar(0.5)
    const size = new THREE.Vector3().subVectors(max, min)
    const H = size.y || 1
    const s = targetHeight / H

    // bucket triangles by structural part
    const buckets = new Map<string, number[]>()
    for (let t = 0; t < triCount; t++) {
      const a = t * 9
      const px = (position[a] + position[a + 3] + position[a + 6]) / 3
      const py = (position[a + 1] + position[a + 4] + position[a + 7]) / 3
      const pz = (position[a + 2] + position[a + 5] + position[a + 8]) / 3
      const xn = (px - center.x) / H
      const yn = (py - min.y) / H
      const zn = (pz - center.z) / H
      const key = partKey(xn, yn, zn)
      const arr = buckets.get(key)
      if (arr) arr.push(t)
      else buckets.set(key, [t])
    }

    const parts: Part[] = []
    for (const [key, tris] of buckets) {
      if (tris.length < 16) continue
      const n = tris.length
      const pos = new Float32Array(n * 9)
      const nrm = normal ? new Float32Array(n * 9) : null
      const uvs = uv ? new Float32Array(n * 6) : null
      const c = new THREE.Vector3()
      for (let k = 0; k < n; k++) {
        const a = tris[k] * 9
        for (let j = 0; j < 9; j++) {
          pos[k * 9 + j] = position[a + j]
          if (nrm && normal) nrm[k * 9 + j] = normal[a + j]
        }
        if (uvs && uv) {
          const b = tris[k] * 6
          for (let j = 0; j < 6; j++) uvs[k * 6 + j] = uv[b + j]
        }
        c.x += (pos[k * 9] + pos[k * 9 + 3] + pos[k * 9 + 6]) / 3
        c.y += (pos[k * 9 + 1] + pos[k * 9 + 4] + pos[k * 9 + 7]) / 3
        c.z += (pos[k * 9 + 2] + pos[k * 9 + 5] + pos[k * 9 + 8]) / 3
      }
      c.multiplyScalar(1 / n)
      // re-origin the part geometry on its own centroid so it rotates about itself
      for (let k = 0; k < n; k++) {
        pos[k * 9] -= c.x; pos[k * 9 + 1] -= c.y; pos[k * 9 + 2] -= c.z
        pos[k * 9 + 3] -= c.x; pos[k * 9 + 4] -= c.y; pos[k * 9 + 5] -= c.z
        pos[k * 9 + 6] -= c.x; pos[k * 9 + 7] -= c.y; pos[k * 9 + 8] -= c.z
      }
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      if (nrm) g.setAttribute('normal', new THREE.BufferAttribute(nrm, 3))
      if (uvs) g.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))

      const dir = new THREE.Vector3(c.x - center.x, 0, c.z - center.z)
      if (dir.lengthSq() < 1e-6) dir.set(0, 0, 1)
      dir.normalize()
      const motion = partMotion(key, dir, explodeDistance)
      parts.push({ geometry: g, home: c.clone(), ...motion })
    }

    const norm = {
      s,
      position: [-s * center.x, -s * min.y, -s * center.z] as [number, number, number],
    }
    return { parts, material: mat, norm }
  }, [scene, targetHeight, explodeDistance])

  const refs = useRef<(THREE.Group | null)[]>([])

  useFrame(() => {
    const p = getProgress ? getProgress() : 1
    for (let i = 0; i < parts.length; i++) {
      const g = refs.current[i]
      if (!g) continue
      const { home, explode, spin, win } = parts[i]
      const move = localProgress(p, win)
      const inv = 1 - move
      g.position.set(home.x + explode.x * inv, home.y + explode.y * inv, home.z + explode.z * inv)
      g.rotation.set(spin.x * inv, spin.y * inv, spin.z * inv)
    }
  })

  return (
    <group scale={scale}>
      <group scale={norm.s} position={norm.position}>
        {parts.map((part, i) => (
          <group key={i} ref={(el) => { refs.current[i] = el }}>
            <mesh geometry={part.geometry} material={material} castShadow receiveShadow />
          </group>
        ))}
      </group>
    </group>
  )
}
