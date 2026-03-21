import { Suspense, useState, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import Sun from './Sun'
import Planet from './Planet'
import OrbitPath from './OrbitPath'
// import AsteroidBelt from './AsteroidBelt'
import TimeControls from './TimeControls'
import PlanetInfoPanel from './PlanetInfoPanel'
import AISidebar from './AISidebar'
import planets from '../data/planets'

function LoadingScreen() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white gap-6">
      <div className="loading-orbit">
        <div className="loading-planet" />
      </div>
      <div className="text-xl font-semibold tracking-wide text-white/80">Loading SolarSim...</div>
    </div>
  )
}

const DEFAULT_CAM_POS = new THREE.Vector3(0, 30, 80)
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0)

function CameraController({ selectedPlanet, planetPositions, controlsRef }) {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3())
  const targetCam = useRef(new THREE.Vector3())

  useFrame(() => {
    if (!controlsRef.current) return

    if (!selectedPlanet) {
      // Lerp back to default when deselected
      camera.position.lerp(DEFAULT_CAM_POS, 0.03)
      controlsRef.current.target.lerp(DEFAULT_TARGET, 0.03)
      controlsRef.current.update()
      controlsRef.current.enabled = true
      return
    }

    const pos = planetPositions.current[selectedPlanet.name]
    if (!pos) return

    // Compute camera target: planet position
    targetPos.current.set(pos.x, pos.y, pos.z)

    // Compute camera position: offset from planet based on its size
    const offset = Math.max(selectedPlanet.radius * 5, 6)
    targetCam.current.set(
      pos.x + offset,
      offset * 0.6,
      pos.z + offset
    )

    camera.position.lerp(targetCam.current, 0.05)
    controlsRef.current.target.lerp(targetPos.current, 0.05)
    controlsRef.current.update()

    const distanceToTarget = camera.position.distanceTo(targetCam.current)
    controlsRef.current.enabled = distanceToTarget < 0.1
  })

  return null
}

function InlinePlanet({ distance, radius, color, speed }) {
  const ref = useRef()
  const angleRef = useRef(Math.random() * Math.PI * 2)

  useFrame((state, delta) => {
    angleRef.current += speed * delta * 60
    ref.current.position.x = Math.cos(angleRef.current) * distance
    ref.current.position.z = Math.sin(angleRef.current) * distance
    ref.current.rotation.y += 0.01
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function SceneContent() {
  const controlsRef = useRef()

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={2} />
      {/* Sun */}
      <mesh>
        <sphereGeometry args={[5, 32, 32]} />
        <meshStandardMaterial emissive="#FDB813" emissiveIntensity={2} color="#FDB813" />
      </mesh>
      {/* All 8 planets inline */}
      <InlinePlanet distance={10} radius={0.38} color="#a0a0a0" speed={0.04} />
      <InlinePlanet distance={16} radius={0.95} color="#e8cda0" speed={0.015} />
      <InlinePlanet distance={22} radius={1.0} color="#4fc3f7" speed={0.01} />
      <InlinePlanet distance={28} radius={0.53} color="#c1440e" speed={0.008} />
      <InlinePlanet distance={40} radius={3.5} color="#c88b3a" speed={0.004} />
      <InlinePlanet distance={55} radius={2.9} color="#e8d5a3" speed={0.003} />
      <InlinePlanet distance={70} radius={1.8} color="#7de8e8" speed={0.002} />
      <InlinePlanet distance={85} radius={1.7} color="#3f51b5" speed={0.001} />
      <Stars radius={300} depth={60} count={2000} factor={4} />
      <OrbitControls ref={controlsRef} enableDamping />
    </>
  )
}

export default function Scene() {
  const [timeScale, setTimeScale] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const [selectedPlanet, setSelectedPlanet] = useState(null)
  const [contextLost, setContextLost] = useState(false)
  const planetPositions = useRef({})

  const handleCreated = ({ gl }) => {
    const canvas = gl.domElement
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault()
      setContextLost(true)
    })
    canvas.addEventListener('webglcontextrestored', () => {
      setContextLost(false)
    })
  }

  if (contextLost) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white gap-4">
        <div className="text-xl">WebGL Context Lost</div>
        <button
          className="px-4 py-2 bg-white/10 rounded hover:bg-white/20"
          onClick={() => window.location.reload()}
        >
          Reload Page
        </button>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <Suspense fallback={<LoadingScreen />}>
        <Canvas
          dpr={[1, 1]}
          camera={{ position: [0, 30, 80], fov: 60 }}
          style={{ background: '#000' }}
          gl={{ antialias: false, powerPreference: 'default', alpha: false }}
          onCreated={handleCreated}
          onPointerMissed={() => setSelectedPlanet(null)}
        >
          <SceneContent
            timeScale={timeScale}
            isPaused={isPaused}
            onSelectPlanet={setSelectedPlanet}
            selectedPlanet={selectedPlanet}
            planetPositions={planetPositions}
          />
        </Canvas>
      </Suspense>
      {selectedPlanet && (
        <div className="absolute top-4 right-4 hidden md:flex flex-col gap-3" style={{ maxHeight: 'calc(100% - 2rem)' }}>
          <PlanetInfoPanel
            planet={selectedPlanet}
            onClose={() => setSelectedPlanet(null)}
          />
          <AISidebar planet={selectedPlanet} />
        </div>
      )}
      <TimeControls
        timeScale={timeScale}
        setTimeScale={setTimeScale}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
      />
    </div>
  )
}
