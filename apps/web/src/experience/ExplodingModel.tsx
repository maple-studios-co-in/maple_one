import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

interface ExplodingModelProps {
  url: string
  /** 0 = fully disassembled, 1 = fully assembled. */
  getProgress?: () => number
  targetHeight?: number
  explodeDistance?: number
  scale?: number
}

const smooth = (t: number) => t * t * (3 - 2 * t)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

interface Chunk {
  geometry: THREE.BufferGeometry
  /** assembled centroid (world-space units of the source mesh) */
  home: THREE.Vector3
  /** offset added at full disassembly */
  explode: THREE.Vector3
  /** extra rotation at full disassembly (resolves to 0 when assembled) */
  spin: THREE.Vector3
  /** portion of overall progress this chunk travels within */
  win: [number, number]
}

/** Pull world-space position/normal/uv triangle soup out of a loaded scene. */
function collectTriangles(scene: THREE.Object3D) {
  const positions: number[] = []
  const normals: number[] = []
  const uvs: number[] = []
  let material: THREE.Material = new THREE.MeshStandardMaterial()
  scene.updateWorldMatrix(true, true)
  scene.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (!mesh.isMesh) return
    material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
    const geo = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone()
    geo.applyMatrix4(mesh.matrixWorld)
    const p = geo.getAttribute('position')
    const n = geo.getAttribute('normal')
    const uv = geo.getAttribute('uv')
    for (let i = 0; i < p.count; i++) {
      positions.push(p.getX(i), p.getY(i), p.getZ(i))
      if (n) normals.push(n.getX(i), n.getY(i), n.getZ(i))
      if (uv) uvs.push(uv.getX(i), uv.getY(i))
    }
  })
  return {
    position: new Float32Array(positions),
    normal: normals.length ? new Float32Array(normals) : null,
    uv: uvs.length ? new Float32Array(uvs) : null,
    material,
  }
}

/**
 * Splits a single-mesh GLB into region chunks (height bands × angular sectors)
 * and flies them apart / together based on scroll progress. Image-to-3D models
 * are one welded mesh, so this approximates a parts assembly: the lower band
 * reads as legs/base, the middle as the seat/top, the upper as the back.
 */
export default function ExplodingModel({
  url,
  getProgress,
  targetHeight = 1.9,
  explodeDistance = 0.85,
  scale = 1,
}: ExplodingModelProps) {
  const { scene } = useGLTF(url)

  const { chunks, material, norm } = useMemo(() => {
    const { position, normal, uv, material } = collectTriangles(scene)
    const triCount = position.length / 9

    // bounds
    const min = new THREE.Vector3(Infinity, Infinity, Infinity)
    const max = new THREE.Vector3(-Infinity, -Infinity, -Infinity)
    for (let i = 0; i < position.length; i += 3) {
      min.x = Math.min(min.x, position[i]); max.x = Math.max(max.x, position[i])
      min.y = Math.min(min.y, position[i + 1]); max.y = Math.max(max.y, position[i + 1])
      min.z = Math.min(min.z, position[i + 2]); max.z = Math.max(max.z, position[i + 2])
    }
    const center = new THREE.Vector3().addVectors(min, max).multiplyScalar(0.5)
    const size = new THREE.Vector3().subVectors(max, min)
    const s = targetHeight / (size.y || 1)
    const yspan = size.y || 1
    const SECTORS = 4

    // bucket triangle indices by (height band, angular sector)
    const buckets = new Map<number, number[]>()
    for (let t = 0; t < triCount; t++) {
      const a = t * 9
      const px = (position[a] + position[a + 3] + position[a + 6]) / 3
      const py = (position[a + 1] + position[a + 4] + position[a + 7]) / 3
      const pz = (position[a + 2] + position[a + 5] + position[a + 8]) / 3
      const yn = (py - min.y) / yspan
      const band = yn < 0.4 ? 0 : yn < 0.68 ? 1 : 2
      const ang = Math.atan2(pz - center.z, px - center.x)
      const sector = Math.min(SECTORS - 1, Math.floor(((ang + Math.PI) / (2 * Math.PI)) * SECTORS))
      const id = band * SECTORS + sector
      const arr = buckets.get(id)
      if (arr) arr.push(t)
      else buckets.set(id, [t])
    }

    // deterministic per-chunk jitter
    let seed = 1
    const rand = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff
      return seed / 0x7fffffff - 0.5
    }

    const chunks: Chunk[] = []
    for (const [id, tris] of buckets) {
      if (tris.length < 24) continue
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

      // re-origin geometry on its centroid so it rotates about itself
      for (let k = 0; k < n; k++) {
        pos[k * 9] -= c.x; pos[k * 9 + 1] -= c.y; pos[k * 9 + 2] -= c.z
        pos[k * 9 + 3] -= c.x; pos[k * 9 + 4] -= c.y; pos[k * 9 + 5] -= c.z
        pos[k * 9 + 6] -= c.x; pos[k * 9 + 7] -= c.y; pos[k * 9 + 8] -= c.z
      }

      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      if (nrm) g.setAttribute('normal', new THREE.BufferAttribute(nrm, 3))
      if (uvs) g.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))

      const band = Math.floor(id / SECTORS)
      const dir = new THREE.Vector3(c.x - center.x, 0, c.z - center.z)
      if (dir.lengthSq() < 1e-6) dir.set(rand(), 0, rand())
      dir.normalize()
      const vy = band === 0 ? -0.55 : band === 2 ? 0.6 : 0.18
      const explode = new THREE.Vector3(
        dir.x * explodeDistance + rand() * 0.1,
        vy * explodeDistance,
        dir.z * explodeDistance + rand() * 0.1,
      )
      // assemble order: legs (band0) first, then seat, then back
      const start = band * 0.2
      const win: [number, number] = [start, Math.min(1, start + 0.55)]
      const spin = new THREE.Vector3(rand() * 1.6, rand() * 2.2, rand() * 1.6)
      chunks.push({ geometry: g, home: c.clone(), explode, spin, win })
    }

    const norm = {
      s,
      position: [-s * center.x, -s * min.y, -s * center.z] as [number, number, number],
    }
    return { chunks, material, norm }
  }, [scene, targetHeight, explodeDistance])

  const refs = useRef<(THREE.Group | null)[]>([])

  useFrame(() => {
    const p = getProgress ? getProgress() : 1
    for (let i = 0; i < chunks.length; i++) {
      const g = refs.current[i]
      if (!g) continue
      const { home, explode, spin, win } = chunks[i]
      const lp = smooth(clamp01((p - win[0]) / (win[1] - win[0])))
      const inv = 1 - lp
      g.position.set(
        home.x + explode.x * inv,
        home.y + explode.y * inv,
        home.z + explode.z * inv,
      )
      g.rotation.set(spin.x * inv, spin.y * inv, spin.z * inv)
    }
  })

  return (
    <group scale={scale}>
      <group scale={norm.s} position={norm.position}>
        {chunks.map((c, i) => (
          <group
            key={i}
            ref={(el) => {
              refs.current[i] = el
            }}
          >
            <mesh geometry={c.geometry} material={material} castShadow receiveShadow />
          </group>
        ))}
      </group>
    </group>
  )
}
