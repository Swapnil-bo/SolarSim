import { Suspense, useState, useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
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

function OrbitRing({ distance }) {
  return (
    <mesh rotation-x={Math.PI / 2}>
      <ringGeometry args={[distance - 0.03, distance + 0.03, 128]} />
      <meshBasicMaterial color="white" opacity={0.1} transparent side={THREE.DoubleSide} />
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
      {/* All 8 planets + orbit rings */}
      <InlinePlanet distance={10} radius={0.38} color="#a0a0a0" speed={0.04} />
      <OrbitRing distance={10} />
      <InlinePlanet distance={16} radius={0.95} color="#e8cda0" speed={0.015} />
      <OrbitRing distance={16} />
      <InlinePlanet distance={22} radius={1.0} color="#4fc3f7" speed={0.01} />
      <OrbitRing distance={22} />
      <InlinePlanet distance={28} radius={0.53} color="#c1440e" speed={0.008} />
      <OrbitRing distance={28} />
      <InlinePlanet distance={40} radius={3.5} color="#c88b3a" speed={0.004} />
      <OrbitRing distance={40} />
      <InlinePlanet distance={55} radius={2.9} color="#e8d5a3" speed={0.003} />
      <OrbitRing distance={55} />
      <InlinePlanet distance={70} radius={1.8} color="#7de8e8" speed={0.002} />
      <OrbitRing distance={70} />
      <InlinePlanet distance={85} radius={1.7} color="#3f51b5" speed={0.001} />
      <OrbitRing distance={85} />
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
          <SceneContent />
        </Canvas>
      </Suspense>
      <TimeControls
        timeScale={timeScale}
        setTimeScale={setTimeScale}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
      />
    </div>
  )
}
