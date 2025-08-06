import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Box, Html, Float } from '@react-three/drei'
import { Group, Vector3 } from 'three'
import { KPICard3D } from './KPICard3D'
import { ModulePanel3D } from './ModulePanel3D'

interface Dashboard3DProps {
  activeModule: string
  onModuleChange: (module: string) => void
}

export const Dashboard3D = ({ activeModule, onModuleChange }: Dashboard3DProps) => {
  const groupRef = useRef<Group>(null)
  const [hoveredModule, setHoveredModule] = useState<string | null>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
    }
  })

  const modules = [
    { id: 'dashboard', name: 'Dashboard', position: [-6, 2, 0], color: '#00d4ff' },
    { id: 'clients', name: 'CRM', position: [-2, 2, 0], color: '#ff006e' },
    { id: 'team', name: 'Team', position: [2, 2, 0], color: '#8338ec' },
    { id: 'finance', name: 'Finance', position: [6, 2, 0], color: '#06ffa5' },
    { id: 'tasks', name: 'Tasks', position: [-4, -1, 2], color: '#ffbe0b' },
    { id: 'compliance', name: 'Compliance', position: [0, -1, 2], color: '#fb5607' },
    { id: 'notifications', name: 'Notifications', position: [4, -1, 2], color: '#3a86ff' },
    { id: 'analytics', name: 'Analytics', position: [0, 4, -2], color: '#7209b7' }
  ]

  return (
    <group ref={groupRef}>
      {/* Central Hub */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <Box args={[1, 1, 1]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#1a1a2e"
            emissive="#00d4ff"
            emissiveIntensity={0.3}
            transparent
            opacity={0.8}
          />
        </Box>
        <Text
          position={[0, -1.5, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.woff"
        >
          STRATA
        </Text>
      </Float>

      {/* KPI Cards */}
      <KPICard3D
        title="Total Revenue"
        value="$45,231.89"
        change="+20.1%"
        position={[-8, 0, 3]}
      />
      <KPICard3D
        title="Active Clients"
        value="2,350"
        change="+180.1%"
        position={[-8, -2.5, 3]}
      />
      <KPICard3D
        title="Pending Tasks"
        value="12"
        change="-19%"
        position={[-8, -5, 3]}
      />

      {/* Module Panels */}
      {modules.map((module) => (
        <ModulePanel3D
          key={module.id}
          id={module.id}
          name={module.name}
          position={module.position as [number, number, number]}
          color={module.color}
          isActive={activeModule === module.id}
          isHovered={hoveredModule === module.id}
          onClick={() => onModuleChange(module.id)}
          onHover={() => setHoveredModule(module.id)}
          onUnhover={() => setHoveredModule(null)}
        />
      ))}

      {/* Active Module Content Display */}
      {activeModule !== 'dashboard' && (
        <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>
          <group position={[8, 0, 0]}>
            <Box args={[6, 8, 0.2]} position={[0, 0, 0]}>
              <meshStandardMaterial
                color="#0f0f23"
                transparent
                opacity={0.9}
                emissive="#00d4ff"
                emissiveIntensity={0.1}
              />
            </Box>
            <Html
              transform
              occlude
              position={[0, 0, 0.2]}
              style={{
                width: '400px',
                height: '500px',
                background: 'rgba(15, 15, 35, 0.95)',
                borderRadius: '20px',
                border: '2px solid #00d4ff',
                padding: '20px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 0 50px rgba(0, 212, 255, 0.3)',
              }}
            >
              <div className="text-white text-center">
                <h3 className="text-xl font-bold mb-4 gradient-text">
                  {modules.find(m => m.id === activeModule)?.name} Module
                </h3>
                <p className="text-sm text-muted-foreground">
                  3D interface loading...
                </p>
              </div>
            </Html>
          </group>
        </Float>
      )}
    </group>
  )
}