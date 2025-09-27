import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, Box, Text3D, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Error Boundary for 3D Components
class ThreeJSErrorBoundary extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ThreeJSErrorBoundary';
  }
}

// 3D Flower Component with proper error handling
function Flower({ position, color, scale = 1, onError }: { 
  position: [number, number, number], 
  color: string, 
  scale?: number,
  onError?: (error: Error) => void 
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useFrame((state) => {
    try {
      if (meshRef.current && isLoaded) {
        // Gentle floating motion
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      }
    } catch (error) {
      onError?.(error as Error);
    }
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <group ref={meshRef} position={position} scale={scale}>
      {/* Flower Petals */}
      {[...Array(8)].map((_, i) => (
        <Sphere
          key={i}
          args={[0.15, 8, 6]}
          position={[
            Math.cos((i * Math.PI * 2) / 8) * 0.4,
            0.1,
            Math.sin((i * Math.PI * 2) / 8) * 0.4
          ]}
          rotation={[0, (i * Math.PI * 2) / 8, 0]}
        >
          <meshStandardMaterial 
            color={color} 
            transparent 
            opacity={0.9}
            roughness={0.3}
            metalness={0.1}
          />
        </Sphere>
      ))}
      
      {/* Flower Center */}
      <Sphere args={[0.12, 16, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="rgb(198, 161, 81)" 
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
      
      {/* Stem */}
      <Box args={[0.03, 0.8, 0.03]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#228B22" />
      </Box>
      
      {/* Leaves */}
      {[...Array(3)].map((_, i) => (
        <Box 
          key={`leaf-${i}`}
          args={[0.15, 0.05, 0.05]} 
          position={[
            Math.cos((i * Math.PI * 2) / 3) * 0.3,
            -0.2 + i * 0.1,
            Math.sin((i * Math.PI * 2) / 3) * 0.3
          ]}
          rotation={[0, (i * Math.PI * 2) / 3, 0]}
        >
          <meshStandardMaterial color="#32CD32" />
        </Box>
      ))}
    </group>
  );
}

// Main 3D Flower Logo Component
function AnimatedFlowerLogo({ onError }: { onError?: (error: Error) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const [isReady, setIsReady] = useState(false);

  useFrame((state) => {
    try {
      if (groupRef.current && isReady) {
        // Gentle rotation
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
        
        // Floating motion
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
      }
    } catch (error) {
      onError?.(error as Error);
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <pointLight position={[2, 2, 2]} intensity={1} color="rgb(198, 161, 81)" />
      <pointLight position={[-2, -2, -2]} intensity={0.5} color="#FF6B35" />
      
      <Flower
        position={[0, 0, 0]}
        color="rgb(198, 161, 81)"
        scale={1}
        onError={onError}
      />
      
      {/* Floating sparkles */}
      {[...Array(6)].map((_, i) => (
        <Sphere
          key={`sparkle-${i}`}
          args={[0.02, 4, 4]}
          position={[
            Math.cos((i * Math.PI * 2) / 6) * 0.8,
            0.2,
            Math.sin((i * Math.PI * 2) / 6) * 0.8
          ]}
        >
          <meshStandardMaterial 
            color="rgb(198, 161, 81)" 
            transparent 
            opacity={0.8}
            emissive="rgb(198, 161, 81)"
            emissiveIntensity={0.2}
          />
        </Sphere>
      ))}
    </group>
  );
}

// Canvas wrapper with error handling
interface AnimatedFlowerLogoProps {
  className?: string;
  onError?: (error: Error) => void;
}

export default function AnimatedFlowerLogoCanvas({ className = "", onError }: AnimatedFlowerLogoProps) {
  const [hasError, setHasError] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebglSupported(!!gl);
    } catch (error) {
      setWebglSupported(false);
      onError?.(new ThreeJSErrorBoundary('WebGL not supported'));
    }
  }, [onError]);

  const handleError = (error: Error) => {
    console.warn('3D Animation Error:', error);
    setHasError(true);
    onError?.(error);
  };

  // Fallback for unsupported WebGL
  if (!webglSupported || hasError) {
    return (
      <div className={`w-16 h-16 flex items-center justify-center ${className}`}>
        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
          <span className="text-primary font-luxury text-lg">🌸</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-16 h-16 relative ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          // Configure WebGL context for better performance
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }}
      >
        <AnimatedFlowerLogo onError={handleError} />
      </Canvas>
      
      {/* Loading indicator */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
