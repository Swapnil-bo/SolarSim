import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import Sun from './Sun'
import Planet from './Planet'
import OrbitPath from './OrbitPath'
import AsteroidBelt from './AsteroidBelt'
import TimeControls from './TimeControls'
import planets from '../data/planets'

function LoadingScreen() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-black text-white">
      <div className="text-2xl font-bold">Loading SolarSim...</div>
    </div>
  )
}

function SceneContent({ timeScale, isPaused }) {
  return (
    <>
      <ambientLight intensity={0.1} />
      <Sun />
      {planets.map((planet) => (
        <group key={planet.name}>
          <Planet config={planet} timeScale={timeScale} isPaused={isPaused} />
          <OrbitPath distance={planet.distance} />
        </group>
      ))}
      <AsteroidBelt timeScale={timeScale} isPaused={isPaused} />
      <Stars radius={300} depth={60} count={5000} factor={4} />
      <OrbitControls enableDamping />
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.5} />
      </EffectComposer>
    </>
  )
}

export default function Scene() {
  const [timeScale, setTimeScale] = useState(1)
  const [isPaused, setIsPaused] = useState(false)

  return (
    <div className="relative w-full h-full">
      <Suspense fallback={<LoadingScreen />}>
        <Canvas
          shadows
          camera={{ position: [0, 30, 80], fov: 60 }}
          style={{ background: '#000' }}
        >
          <SceneContent timeScale={timeScale} isPaused={isPaused} />
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
