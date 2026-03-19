import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 800
const MIN_DISTANCE = 44
const MAX_DISTANCE = 52

export default function AsteroidBelt({ timeScale = 1, isPaused = false }) {
  const meshRef = useRef()

  const { matrices, speeds, angles, distances, yOffsets } = useMemo(() => {
    const dummy = new THREE.Object3D()
    const matrices = []
    const speeds = []
    const angles = []
    const distances = []
    const yOffsets = []

    for (let i = 0; i < COUNT; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = MIN_DISTANCE + Math.random() * (MAX_DISTANCE - MIN_DISTANCE)
      const yOffset = (Math.random() - 0.5) * 1.0
      const scale = 0.05 + Math.random() * 0.15
      const speed = 0.002 + Math.random() * 0.004

      dummy.position.set(
        Math.cos(angle) * distance,
        yOffset,
        Math.sin(angle) * distance
      )
      dummy.scale.set(scale, scale, scale)
      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )
      dummy.updateMatrix()

      matrices.push(dummy.matrix.clone())
      speeds.push(speed)
      angles.push(angle)
      distances.push(distance)
      yOffsets.push(yOffset)
    }

    return { matrices, speeds, angles, distances, yOffsets }
  }, [])

  useEffect(() => {
    if (!meshRef.current) return
    for (let i = 0; i < COUNT; i++) {
      meshRef.current.setMatrixAt(i, matrices[i])
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [matrices])

  useEffect(() => {
    const mesh = meshRef.current
    return () => {
      if (mesh) {
        mesh.geometry.dispose()
        mesh.material.dispose()
      }
    }
  }, [])

  useFrame((state, delta) => {
    if (!meshRef.current || isPaused) return

    const dummy = new THREE.Object3D()

    for (let i = 0; i < COUNT; i++) {
      angles[i] += speeds[i] * timeScale * delta * 60

      dummy.position.set(
        Math.cos(angles[i]) * distances[i],
        yOffsets[i],
        Math.sin(angles[i]) * distances[i]
      )

      meshRef.current.getMatrixAt(i, dummy.matrix)
      dummy.matrix.decompose(new THREE.Vector3(), dummy.quaternion, dummy.scale)
      dummy.updateMatrix()

      meshRef.current.setMatrixAt(i, dummy.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, COUNT]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#888888" roughness={0.8} />
    </instancedMesh>
  )
}
