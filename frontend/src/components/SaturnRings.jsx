import { useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import { ErrorBoundary } from 'react-error-boundary'
import * as THREE from 'three'

const innerRadius = 3.5
const outerRadius = 6.5

function SaturnRingsWithTexture() {
  const ringTexture = useTexture('/textures/saturn_ring.png')

  const geometry = useMemo(() => {
    const ringGeo = new THREE.RingGeometry(innerRadius, outerRadius, 64)
    // Fix UVs — default RingGeometry UVs smear the texture radially
    const pos = ringGeo.attributes.position
    const uv = ringGeo.attributes.uv
    for (let i = 0; i < pos.count; i++) {
      uv.setXY(i,
        (pos.getX(i) / outerRadius + 1) / 2,
        (pos.getY(i) / outerRadius + 1) / 2
      )
    }
    return ringGeo
  }, [])

  return (
    <mesh rotation-x={Math.PI / 2}>
      <primitive object={geometry} attach="geometry" />
      <meshBasicMaterial
        map={ringTexture}
        side={THREE.DoubleSide}
        transparent
      />
    </mesh>
  )
}

function SaturnRingsFallback() {
  const geometry = useMemo(() => {
    const ringGeo = new THREE.RingGeometry(innerRadius, outerRadius, 64)
    const pos = ringGeo.attributes.position
    const uv = ringGeo.attributes.uv
    for (let i = 0; i < pos.count; i++) {
      uv.setXY(i,
        (pos.getX(i) / outerRadius + 1) / 2,
        (pos.getY(i) / outerRadius + 1) / 2
      )
    }
    return ringGeo
  }, [])

  return (
    <mesh rotation-x={Math.PI / 2}>
      <primitive object={geometry} attach="geometry" />
      <meshBasicMaterial
        color="#e8d5a3"
        side={THREE.DoubleSide}
        transparent
        opacity={0.6}
      />
    </mesh>
  )
}

export default function SaturnRings() {
  return (
    <ErrorBoundary fallback={<SaturnRingsFallback />}>
      <SaturnRingsWithTexture />
    </ErrorBoundary>
  )
}
