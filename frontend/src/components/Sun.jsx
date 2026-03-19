import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Sun() {
  const meshRef = useRef()

  useFrame((state) => {
    const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.03
    meshRef.current.scale.set(scale, scale, scale)
  })

  return (
    <group>
      <pointLight
        position={[0, 0, 0]}
        intensity={2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <mesh ref={meshRef}>
        <sphereGeometry args={[5, 64, 64]} />
        <meshStandardMaterial
          emissive="#FDB813"
          emissiveIntensity={2}
          color="#FDB813"
        />
      </mesh>
    </group>
  )
}
