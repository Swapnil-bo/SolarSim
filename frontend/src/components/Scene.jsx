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

function SceneContent({ timeScale, isPaused, onSelectPlanet, selectedPlanet, planetPositions }) {
  const controlsRef = useRef()

  return (
    <>
      <ambientLight intensity={0.1} />
      <Sun />
      {planets.map((planet) => (
        <group key={planet.name}>
          <Planet
            config={planet}
            timeScale={timeScale}
            isPaused={isPaused}
            onSelect={onSelectPlanet}
            positionStore={planetPositions}
          />
          <OrbitPath distance={planet.distance} />
        </group>
      ))}
      {/* <AsteroidBelt timeScale={timeScale} isPaused={isPaused} /> */}
      <Stars radius={300} depth={60} count={2000} factor={4} />
      <OrbitControls ref={controlsRef} enableDamping />
      <CameraController
        selectedPlanet={selectedPlanet}
        planetPositions={planetPositions}
        controlsRef={controlsRef}
      />
      {/* <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.5} />
      </EffectComposer> */}
    </>
  )
}

export default function Scene() {
  const [timeScale, setTimeScale] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const [selectedPlanet, setSelectedPlanet] = useState(null)
  const planetPositions = useRef({})

  return (
    <div className="relative w-full h-full">
      <Suspense fallback={<LoadingScreen />}>
        <Canvas
          dpr={[1, 1]}
          camera={{ position: [0, 30, 80], fov: 60 }}
          style={{ background: '#000' }}
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
