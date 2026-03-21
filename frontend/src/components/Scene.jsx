import { Suspense, useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// Lazy texture loader — loads in background, doesn't block rendering
const textureLoader = new THREE.TextureLoader()
const textureCache = {}
function useLazyTexture(path) {
  const [texture, setTexture] = useState(null)
  useEffect(() => {
    if (textureCache[path]) {
      setTexture(textureCache[path])
      return
    }
    textureLoader.load(path, (tex) => {
      textureCache[path] = tex
      setTexture(tex)
    })
  }, [path])
  return texture
}
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

function OrbitRing({ distance }) {
  return (
    <mesh rotation-x={Math.PI / 2}>
      <ringGeometry args={[distance - 0.03, distance + 0.03, 128]} />
      <meshBasicMaterial color="white" opacity={0.1} transparent side={THREE.DoubleSide} />
    </mesh>
  )
}

// Saturn rings — color only, no texture
function SaturnRings() {
  const geometry = useMemo(() => {
    const ringGeo = new THREE.RingGeometry(3.5, 6.5, 64)
    const pos = ringGeo.attributes.position
    const uv = ringGeo.attributes.uv
    for (let i = 0; i < pos.count; i++) {
      uv.setXY(i, (pos.getX(i) / 6.5 + 1) / 2, (pos.getY(i) / 6.5 + 1) / 2)
    }
    return ringGeo
  }, [])

  return (
    <mesh rotation-x={Math.PI / 2} geometry={geometry}>
      <meshBasicMaterial color="#e8d5a3" side={THREE.DoubleSide} transparent opacity={0.6} />
    </mesh>
  )
}

// Moon orbiting its parent planet
function Moon({ config, timeScale, isPaused }) {
  const groupRef = useRef()
  const angleRef = useRef(Math.random() * Math.PI * 2)
  const texture = useLazyTexture(`/textures/${config.textureFile}`)

  useFrame((state, delta) => {
    angleRef.current += config.speed * timeScale * delta * 60 * (isPaused ? 0 : 1)
    groupRef.current.position.x = Math.cos(angleRef.current) * config.distance
    groupRef.current.position.z = Math.sin(angleRef.current) * config.distance
  })

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[config.radius, 16, 16]} />
        <meshStandardMaterial color="#aaaaaa" map={texture} />
      </mesh>
    </group>
  )
}

function Planet({ config, timeScale, isPaused, onSelect, positionStore }) {
  const ref = useRef()
  const groupRef = useRef()
  const angleRef = useRef(Math.random() * Math.PI * 2)
  const [hovered, setHovered] = useState(false)
  const baseScale = useRef(1)

  useEffect(() => {
    if (ref.current) {
      ref.current.rotation.z = THREE.MathUtils.degToRad(config.tilt)
    }
  }, [config.tilt])

  useFrame((state, delta) => {
    angleRef.current += config.speed * timeScale * delta * 60 * (isPaused ? 0 : 1)
    groupRef.current.position.x = Math.cos(angleRef.current) * config.distance
    groupRef.current.position.z = Math.sin(angleRef.current) * config.distance
    ref.current.rotation.y += config.rotationSpeed * delta * 60 * (isPaused ? 0 : 1)

    const targetScale = hovered ? 1.15 : 1
    baseScale.current = THREE.MathUtils.lerp(baseScale.current, targetScale, 0.1)
    ref.current.scale.setScalar(baseScale.current)

    if (positionStore) {
      positionStore.current[config.name] = groupRef.current.position
    }
  })

  const handleClick = useCallback((e) => {
    e.stopPropagation()
    if (onSelect) onSelect(config)
  }, [onSelect, config])

  const handlePointerOver = useCallback((e) => {
    e.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }, [])

  const handlePointerOut = useCallback(() => {
    setHovered(false)
    document.body.style.cursor = 'default'
  }, [])

  const texture = useLazyTexture(`/textures/${config.textureFile}`)

  return (
    <group ref={groupRef}>
      <mesh ref={ref} onClick={handleClick} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
        <sphereGeometry args={[config.radius, 16, 16]} />
        <meshStandardMaterial color={config.color} map={texture} />
      </mesh>
      {config.name === "Saturn" && <SaturnRings />}
      {(config.moons || []).map((moon) => (
        <Moon key={moon.name} config={moon} timeScale={timeScale} isPaused={isPaused} />
      ))}
    </group>
  )
}

function CameraController({ selectedPlanet, planetPositions, controlsRef }) {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3())
  const targetCam = useRef(new THREE.Vector3())

  useFrame(() => {
    if (!controlsRef.current) return

    if (!selectedPlanet) {
      camera.position.lerp(DEFAULT_CAM_POS, 0.03)
      controlsRef.current.target.lerp(DEFAULT_TARGET, 0.03)
      controlsRef.current.update()
      controlsRef.current.enabled = true
      return
    }

    const pos = planetPositions.current[selectedPlanet.name]
    if (!pos) return

    targetPos.current.set(pos.x, pos.y, pos.z)
    const offset = Math.max(selectedPlanet.radius * 5, 6)
    targetCam.current.set(pos.x + offset, offset * 0.6, pos.z + offset)

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
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={2} />
      {/* Sun */}
      <mesh>
        <sphereGeometry args={[5, 32, 32]} />
        <meshStandardMaterial emissive="#FDB813" emissiveIntensity={2} color="#FDB813" />
      </mesh>
      {/* All 8 planets + orbit rings */}
      {planets.map((planet) => (
        <group key={planet.name}>
          <Planet
            config={planet}
            timeScale={timeScale}
            isPaused={isPaused}
            onSelect={onSelectPlanet}
            positionStore={planetPositions}
          />
          <OrbitRing distance={planet.distance} />
        </group>
      ))}
      <Stars radius={300} depth={60} count={2000} factor={4} />
      <OrbitControls ref={controlsRef} enableDamping />
      <CameraController
        selectedPlanet={selectedPlanet}
        planetPositions={planetPositions}
        controlsRef={controlsRef}
      />
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
