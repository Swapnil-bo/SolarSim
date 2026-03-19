import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'

function LoadingScreen() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-black text-white">
      <div className="text-2xl font-bold">Loading SolarSim...</div>
    </div>
  )
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 0]} intensity={2} />
      <Stars radius={300} depth={60} count={5000} factor={4} />
      <OrbitControls enableDamping />
    </>
  )
}

export default function Scene() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Canvas
        shadows
        camera={{ position: [0, 30, 80], fov: 60 }}
        style={{ background: '#000' }}
      >
        <SceneContent />
      </Canvas>
    </Suspense>
  )
}
