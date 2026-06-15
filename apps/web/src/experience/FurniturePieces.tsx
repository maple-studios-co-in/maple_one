import { RoundedBox } from '@react-three/drei'
import { brass, fabricIvory, fabricSand, wood, woodDark, woodMaple } from './materials'

/** Round side table with splayed legs */
export function SideTable() {
  const legs: [number, number][] = [
    [0, 0],
    [(Math.PI * 2) / 3, 0],
    [(Math.PI * 4) / 3, 0],
  ]
  return (
    <group>
      <mesh material={wood} position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.46, 0.46, 0.055, 48]} />
      </mesh>
      <mesh material={woodMaple} position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.035, 40]} />
      </mesh>
      {legs.map(([angle]) => {
        const r = 0.34
        return (
          <group key={angle} position={[Math.cos(angle) * r, 0.28, Math.sin(angle) * r]} rotation={[Math.sin(angle) * 0.18, 0, -Math.cos(angle) * 0.18]}>
            <mesh material={woodDark}>
              <cylinderGeometry args={[0.025, 0.04, 0.56, 16]} />
            </mesh>
          </group>
        )
      })}
      <mesh material={brass} position={[0, 0.615, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.46, 0.008, 12, 64]} />
      </mesh>
    </group>
  )
}

/** Upholstered bench with low back rail */
export function Bench() {
  return (
    <group>
      <RoundedBox args={[1.65, 0.16, 0.56]} radius={0.05} smoothness={4} position={[0, 0.46, 0]} material={wood} />
      <RoundedBox args={[0.78, 0.13, 0.5]} radius={0.05} smoothness={4} position={[-0.41, 0.6, 0]} material={fabricSand} />
      <RoundedBox args={[0.78, 0.13, 0.5]} radius={0.05} smoothness={4} position={[0.41, 0.6, 0]} material={fabricIvory} />
      {([
        [-0.72, -0.22],
        [0.72, -0.22],
        [-0.72, 0.22],
        [0.72, 0.22],
      ] as const).map(([x, z]) => (
        <mesh key={`${x}${z}`} material={woodDark} position={[x, 0.19, z]}>
          <cylinderGeometry args={[0.028, 0.042, 0.38, 16]} />
        </mesh>
      ))}
      <mesh material={wood} position={[0, 0.78, -0.26]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 1.6, 16]} />
      </mesh>
      {([-0.6, 0, 0.6] as const).map((x) => (
        <mesh key={x} material={woodDark} position={[x, 0.65, -0.26]}>
          <cylinderGeometry args={[0.02, 0.02, 0.26, 12]} />
        </mesh>
      ))}
    </group>
  )
}
