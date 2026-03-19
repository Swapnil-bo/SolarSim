import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { ErrorBoundary } from 'react-error-boundary'
import * as THREE from 'three'

function PlanetWithTexture({ config, timeScale, isPaused }) {
  const meshRef = useRef()
  const groupRef = useRef()
  const angleRef = useRef(Math.random() * Math.PI * 2)

  const texture = useTexture(`/textures/${config.textureFile}`)

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z = THREE.MathUtils.degToRad(config.tilt)
    }
  }, [config.tilt])

  useFrame((state, delta) => {
    angleRef.current += config.speed * timeScale * delta * 60 * (isPaused ? 0 : 1)
    groupRef.current.position.x = Math.cos(angleRef.current) * config.distance
    groupRef.current.position.z = Math.sin(angleRef.current) * config.distance
    meshRef.current.rotation.y += config.rotationSpeed * delta * 60 * (isPaused ? 0 : 1)
  })

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[config.radius, 32, 32]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </group>
  )
}

function PlanetFallback({ config, timeScale, isPaused }) {
  const meshRef = useRef()
  const groupRef = useRef()
  const angleRef = useRef(Math.random() * Math.PI * 2)

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z = THREE.MathUtils.degToRad(config.tilt)
    }
  }, [config.tilt])

  useFrame((state, delta) => {
    angleRef.current += config.speed * timeScale * delta * 60 * (isPaused ? 0 : 1)
    groupRef.current.position.x = Math.cos(angleRef.current) * config.distance
    groupRef.current.position.z = Math.sin(angleRef.current) * config.distance
    meshRef.current.rotation.y += config.rotationSpeed * delta * 60 * (isPaused ? 0 : 1)
  })

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[config.radius, 32, 32]} />
        <meshStandardMaterial color={config.color} />
      </mesh>
    </group>
  )
}

export default function Planet({ config, timeScale = 1, isPaused = false }) {
  return (
    <ErrorBoundary fallback={<PlanetFallback config={config} timeScale={timeScale} isPaused={isPaused} />}>
      <PlanetWithTexture config={config} timeScale={timeScale} isPaused={isPaused} />
    </ErrorBoundary>
  )
}
