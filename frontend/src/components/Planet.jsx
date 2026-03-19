import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { ErrorBoundary } from 'react-error-boundary'
import * as THREE from 'three'
import SaturnRings from './SaturnRings'

function MoonWithTexture({ config, timeScale, isPaused }) {
  const meshRef = useRef()
  const groupRef = useRef()
  const angleRef = useRef(Math.random() * Math.PI * 2)

  const texture = useTexture(`/textures/${config.textureFile}`)

  useFrame((state, delta) => {
    angleRef.current += config.speed * timeScale * delta * 60 * (isPaused ? 0 : 1)
    groupRef.current.position.x = Math.cos(angleRef.current) * config.distance
    groupRef.current.position.z = Math.sin(angleRef.current) * config.distance
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

function MoonFallback({ config, timeScale, isPaused }) {
  const meshRef = useRef()
  const groupRef = useRef()
  const angleRef = useRef(Math.random() * Math.PI * 2)

  useFrame((state, delta) => {
    angleRef.current += config.speed * timeScale * delta * 60 * (isPaused ? 0 : 1)
    groupRef.current.position.x = Math.cos(angleRef.current) * config.distance
    groupRef.current.position.z = Math.sin(angleRef.current) * config.distance
  })

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[config.radius, 32, 32]} />
        <meshStandardMaterial color="#aaaaaa" />
      </mesh>
    </group>
  )
}

function Moon({ config, timeScale, isPaused }) {
  return (
    <ErrorBoundary fallback={<MoonFallback config={config} timeScale={timeScale} isPaused={isPaused} />}>
      <MoonWithTexture config={config} timeScale={timeScale} isPaused={isPaused} />
    </ErrorBoundary>
  )
}

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
      {config.name === "Saturn" && <SaturnRings />}
      {(config.moons || []).map((moon) => (
        <Moon key={moon.name} config={moon} timeScale={timeScale} isPaused={isPaused} />
      ))}
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
      {config.name === "Saturn" && <SaturnRings />}
      {(config.moons || []).map((moon) => (
        <Moon key={moon.name} config={moon} timeScale={timeScale} isPaused={isPaused} />
      ))}
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
