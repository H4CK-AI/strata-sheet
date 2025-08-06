import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text, Box, Sphere } from '@react-three/drei'
import { Group, Vector3 } from 'three'

interface ModulePanel3DProps {
  id: string
  name: string
  position: [number, number, number]
  color: string
  isActive: boolean
  isHovered: boolean
  onClick: () => void
  onHover: () => void
  onUnhover: () => void
}

export const ModulePanel3D = ({
  id,
  name,
  position,
  color,
  isActive,
  isHovered,
  onClick,
  onHover,
  onUnhover
}: ModulePanel3DProps) => {
  const groupRef = useRef<Group>(null)
  const sphereRef = useRef<any>(null)
  const { camera } = useThree()

  useFrame((state) => {
    if (groupRef.current) {
      // Floating animation
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1
      
      // Rotation based on activity
      if (isActive) {
        groupRef.current.rotation.y += 0.01
      }
      
      // Scale based on hover
      const targetScale = isHovered ? 1.2 : isActive ? 1.1 : 1
      groupRef.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.1)
    }

    if (sphereRef.current) {
      sphereRef.current.rotation.x += 0.01
      sphereRef.current.rotation.z += 0.005
    }
  })

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1], position[2]]}
      onClick={onClick}
      onPointerEnter={onHover}
      onPointerLeave={onUnhover}
    >
      {/* Main Module Sphere */}
      <Sphere
        ref={sphereRef}
        args={[0.8]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 0.4 : isHovered ? 0.3 : 0.1}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* Outer Ring */}
      <group rotation={[0, 0, Math.PI / 4]}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Sphere
            key={i}
            args={[0.05]}
            position={[
              Math.cos((i / 8) * Math.PI * 2) * 1.5,
              Math.sin((i / 8) * Math.PI * 2) * 1.5,
              0
            ]}
          >
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.5}
            />
          </Sphere>
        ))}
      </group>

      {/* Module Name */}
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {name}
      </Text>

      {/* Active Indicator */}
      {isActive && (
        <Sphere args={[1.2]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.2}
            emissive={color}
            emissiveIntensity={0.3}
          />
        </Sphere>
      )}

      {/* Connection Lines to Central Hub */}
      <Box
        args={[0.02, new Vector3(...position).distanceTo(new Vector3(0, 0, 0)), 0.02]}
        position={[
          -position[0] / 2,
          -position[1] / 2,
          -position[2] / 2
        ]}
        rotation={[
          Math.atan2(position[1], Math.sqrt(position[0] ** 2 + position[2] ** 2)),
          Math.atan2(position[0], position[2]),
          0
        ]}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 0.5 : 0.2}
          transparent
          opacity={isActive ? 0.8 : 0.4}
        />
      </Box>
    </group>
  )
}