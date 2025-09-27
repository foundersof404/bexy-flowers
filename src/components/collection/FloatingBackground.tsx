import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

const FloatingParticles = () => {
  const ref = useRef<THREE.Points>(null);
  
  // Generate particle positions
  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    
    // Gold-like colors
    colors[i * 3] = 1; // R
    colors[i * 3 + 1] = 0.8 + Math.random() * 0.2; // G
    colors[i * 3 + 2] = 0.2 + Math.random() * 0.3; // B
  }

  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.getElapsedTime();
      
      // Gentle floating animation
      ref.current.rotation.x = Math.sin(time * 0.1) * 0.1;
      ref.current.rotation.y = Math.sin(time * 0.15) * 0.1;
      
      // Update particle positions for floating effect
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(time * 0.5 + i * 0.1) * 0.002;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors}>
      <PointMaterial
        transparent
        vertexColors
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const FloatingPetals = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Gentle rotation and floating
      groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.2;
      groupRef.current.position.y = Math.sin(time * 0.2) * 0.5;
      
      // Individual petal movements
      groupRef.current.children.forEach((child, index) => {
        child.rotation.z = Math.sin(time * 0.3 + index) * 0.3;
        child.position.y = Math.sin(time * 0.4 + index * 0.5) * 0.3;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 12 }, (_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 12) * Math.PI * 2) * 3,
            (Math.random() - 0.5) * 2,
            Math.sin((i / 12) * Math.PI * 2) * 3
          ]}
          rotation={[
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
          ]}
        >
          <planeGeometry args={[0.3, 0.5]} />
          <meshBasicMaterial
            color={new THREE.Color(1, 0.8, 0.4)}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

export const FloatingBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <FloatingParticles />
        <FloatingPetals />
      </Canvas>
    </div>
  );
};