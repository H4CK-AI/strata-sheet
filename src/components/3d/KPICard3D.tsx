import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Box, Html } from '@react-three/drei'
import { Group } from 'three'

interface KPICard3DProps {
  title: string
  value: string
  change: string
  position: [number, number, number]
}

export const KPICard3D = ({ title, value, change, position }: KPICard3DProps) => {
  const cardRef = useRef<Group>(null)
  const [isHovered, setIsHovered] = useState(false)

  useFrame((state) => {
    if (cardRef.current) {
      cardRef.current.scale.setScalar(isHovered ? 1.05 : 1)
      cardRef.current.rotation.y = Math.sin(state.clock.elapsedTime + position[0]) * 0.02
    }
  })

  const isPositive = change.startsWith('+')

  return (
    <group
      ref={cardRef}
      position={position}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <Box args={[3, 2, 0.2]} castShadow>
        <meshStandardMaterial
          color="#0f0f23"
          transparent
          opacity={0.9}
          emissive="#00d4ff"
          emissiveIntensity={isHovered ? 0.3 : 0.1}
        />
      </Box>
      
      <Text
        position={[0, 0.5, 0.15]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.5}
      >
        {title}
      </Text>
      
      <Text
        position={[0, 0, 0.15]}
        fontSize={0.4}
        color="#00d4ff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {value}
      </Text>
      
      <Text
        position={[0, -0.5, 0.15]}
        fontSize={0.2}
        color={isPositive ? "#06ffa5" : "#ff006e"}
        anchorX="center"
        anchorY="middle"
      >
        {change}
      </Text>

      {/* Glow effect */}
      <Box args={[3.2, 2.2, 0.1]} position={[0, 0, -0.1]}>
        <meshStandardMaterial
          color="#00d4ff"
          transparent
          opacity={isHovered ? 0.3 : 0.1}
          emissive="#00d4ff"
          emissiveIntensity={0.5}
        />
      </Box>
    </group>
  )
}