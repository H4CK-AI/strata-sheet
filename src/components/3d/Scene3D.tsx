import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Float, Text, Box, Sphere, Plane } from '@react-three/drei'
import { Suspense } from 'react'
import { Vector3 } from 'three'

interface Scene3DProps {
  children: React.ReactNode
}

export const Scene3D = ({ children }: Scene3DProps) => {
  return (
    <div className="w-full h-screen relative">
      <Canvas
        camera={{ position: [0, 5, 10], fov: 60 }}
        shadows
        gl={{ antialias: true, toneMapping: 0 }}
      >
        <Suspense fallback={null}>
          {/* Lighting Setup */}
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-5, 5, 5]} intensity={0.5} />
          
          {/* Environment */}
          <Environment preset="city" />
          
          {/* Floor */}
          <Plane
            args={[50, 50]}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -2, 0]}
            receiveShadow
          >
            <meshStandardMaterial color="#1a1a2e" transparent opacity={0.8} />
          </Plane>
          
          {/* Background Elements */}
          <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
            <Sphere args={[0.5]} position={[-8, 3, -5]}>
              <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.2} />
            </Sphere>
          </Float>
          
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
            <Box args={[0.7, 0.7, 0.7]} position={[8, 4, -6]}>
              <meshStandardMaterial color="#ff006e" emissive="#ff006e" emissiveIntensity={0.2} />
            </Box>
          </Float>
          
          {children}
          
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={20}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}