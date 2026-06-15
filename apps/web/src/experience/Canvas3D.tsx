import { Backdrop, ContactShadows, Environment } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useRef } from 'react'
import * as THREE from 'three'
import ProductTurntable from './ProductTurntable'
import AssemblyScene from './scenes/AssemblyScene'
import TurntableScene from './scenes/TurntableScene'
import { useExperience } from './store'

function CameraRig() {
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(({ camera }) => {
    const targetX = pointer.current.x * 0.12
    const targetY = 0.85 - pointer.current.y * 0.08
    camera.position.x += (targetX - camera.position.x) * 0.04
    camera.position.y += (targetY - camera.position.y) * 0.04
    camera.lookAt(0.25, 0.05, 0)
  })

  return null
}

/**
 * Single persistent WebGL canvas fixed behind the DOM. Sections with
 * transparent backgrounds reveal it; the store decides which scene renders.
 *
 * Lighting: an HDRI environment provides image-based lighting (soft, realistic
 * reflections on wood + leather) — the main fix for the "toy" plastic look.
 * A warm studio Backdrop gives the rotating furniture a real set to move in.
 */
export default function Canvas3D() {
  const activeScene = useExperience((s) => s.activeScene)

  return (
    <div
      className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-700 ${
        activeScene ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden
    >
      <Canvas
        shadows
        camera={{ position: [0, 0.85, 4.4], fov: 38 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.05
        }}
      >
        {/* Image-based lighting — the realism workhorse. Lighting only, no bg. */}
        <Environment preset="apartment" environmentIntensity={1.15} />

        {/* Soft fills layered on top of the HDRI */}
        <ambientLight intensity={0.16} color="#FFF8ED" />
        <hemisphereLight intensity={0.3} color="#FFF8ED" groundColor="#D8C3A5" />
        <directionalLight
          position={[3.5, 5.5, 2.5]}
          intensity={2.1}
          color="#FFF4E0"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0004}
          shadow-normalBias={0.02}
        >
          <orthographicCamera attach="shadow-camera" args={[-4, 4, 4, -4, 0.1, 22]} />
        </directionalLight>
        <directionalLight position={[-4, 2.5, -3]} intensity={0.45} color="#B76E64" />
        {/* front fill from the camera side — adds highlights so surfaces read as real */}
        <directionalLight position={[1.5, 2, 5]} intensity={0.7} color="#FFF6E8" />

        <CameraRig />

        {/* Warm studio sweep behind the furniture */}
        <Backdrop
          receiveShadow
          floor={2.2}
          segments={24}
          scale={[26, 10, 7]}
          position={[0.4, -0.82, -3.4]}
        >
          <meshStandardMaterial color="#E7DAC4" roughness={0.95} metalness={0} />
        </Backdrop>

        <Suspense fallback={null}>
          <AssemblyScene />
          {/* targetHeight = fit for the largest dimension. Wide pieces sit closer
              to centre so they don't clip; the tall chair can sit further right. */}
          <ProductTurntable url="/models/black_chair.glb" scene="chair-hero" targetHeight={1.95} position={[0.55, -0.9, 0]} />
          <ProductTurntable url="/models/sofa.glb" scene="sofa" targetHeight={2.6} position={[0.25, -0.82, 0]} />
          <ProductTurntable url="/models/table.glb" scene="table" targetHeight={2.4} position={[0.3, -0.82, 0]} />
        </Suspense>
        <TurntableScene />

        <ContactShadows
          position={[0.4, -0.82, 0]}
          opacity={0.55}
          scale={10}
          blur={2.2}
          far={2.6}
          resolution={1024}
          color="#1c0f0c"
        />
      </Canvas>
    </div>
  )
}
