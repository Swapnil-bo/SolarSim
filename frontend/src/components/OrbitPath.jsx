import { useMemo } from 'react'
import * as THREE from 'three'

export default function OrbitPath({ distance }) {
  const lineLoop = useMemo(() => new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(
      new THREE.EllipseCurve(0, 0, distance, distance, 0, Math.PI * 2).getPoints(128)
    ),
    new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.15, transparent: true })
  ), [distance])

  return <primitive object={lineLoop} rotation-x={Math.PI / 2} />
}
