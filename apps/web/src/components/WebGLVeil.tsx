import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

function AnimatedSurface() {
  const material = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color('#D8C3A5') },
      uColorB: { value: new THREE.Color('#741A14') },
      uColorC: { value: new THREE.Color('#FFF8ED') },
    }),
    [],
  )

  useFrame(({ clock }) => {
    if (material.current) {
      material.current.uniforms.uTime.value = clock.elapsedTime
    }
  })

  return (
    <mesh rotation={[0, 0, -0.08]} scale={[3.3, 1.8, 1]}>
      <planeGeometry args={[2, 2, 96, 96]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          varying vec2 vUv;
          uniform float uTime;

          void main() {
            vUv = uv;
            vec3 pos = position;
            float wave = sin((pos.x * 3.5 + uTime * 0.5)) * 0.08;
            wave += cos((pos.y * 4.0 - uTime * 0.35)) * 0.06;
            pos.z += wave;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform vec3 uColorC;

          float line(float value, float width) {
            return smoothstep(width, 0.0, abs(value));
          }

          void main() {
            vec2 uv = vUv - 0.5;
            float flow = sin((uv.x * 9.0) + (uv.y * 4.0) + uTime * 0.55);
            float ribbon = line(flow, 0.28);
            float glow = 1.0 - smoothstep(0.0, 0.62, length(uv + vec2(0.18, -0.08)));
            vec3 color = mix(uColorA, uColorB, ribbon * 0.45);
            color = mix(color, uColorC, glow * 0.5);
            float alpha = (ribbon * 0.12 + glow * 0.1) * smoothstep(0.62, 0.18, length(uv));
            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </mesh>
  )
}

export default function WebGLVeil() {
  return (
    <div className="absolute inset-0 z-[1] pointer-events-none opacity-90 mix-blend-screen">
      <Canvas camera={{ position: [0, 0, 2.2], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <AnimatedSurface />
      </Canvas>
    </div>
  )
}
