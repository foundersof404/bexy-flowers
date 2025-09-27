import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Particle System with proper memory management
function ParticleField({ count = 100, onError }: { count?: number, onError?: (error: Error) => void }) {
  const pointsRef = useRef<THREE.Points>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Memoize geometry to prevent recreation on every render
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Spread particles in a wider area for navigation
      positions[i * 3] = (Math.random() - 0.5) * 40; // X
      positions[i * 3 + 1] = Math.random() * 20; // Y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // Z
      
      // Gold color variations
      const goldIntensity = 0.7 + Math.random() * 0.3;
      colors[i * 3] = 1; // R
      colors[i * 3 + 1] = 0.84 * goldIntensity; // G
      colors[i * 3 + 2] = 0; // B
    }
    
    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    try {
      if (pointsRef.current && isInitialized) {
        // Gentle rotation
        pointsRef.current.rotation.x = state.clock.elapsedTime * 0.05;
        pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
        
        // Floating animation for particles
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          positions[i3 + 1] = positions[i3 + 1] + Math.sin(state.clock.elapsedTime + i) * 0.01;
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
      }
    } catch (error) {
      onError?.(error as Error);
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialized(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Points ref={pointsRef} positions={positions} colors={colors}>
      <PointMaterial
        transparent
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Floating Gold Elements for Navigation
function FloatingElements({ onError }: { onError?: (error: Error) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const [elements] = useState(() => 
    Array.from({ length: 12 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 30,
        Math.random() * 15,
        (Math.random() - 0.5) * 15
      ] as [number, number, number],
      scale: 0.5 + Math.random() * 0.5,
      rotation: [0, 0, 0] as [number, number, number]
    }))
  );

  useFrame((state) => {
    try {
      if (groupRef.current) {
        // Gentle group rotation
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
        
        // Animate individual elements
        groupRef.current.children.forEach((child, index) => {
          if (child instanceof THREE.Mesh) {
            child.rotation.y = state.clock.elapsedTime * 0.5 + index;
            child.position.y = Math.sin(state.clock.elapsedTime * 2 + index) * 0.5;
          }
        });
      }
    } catch (error) {
      onError?.(error as Error);
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="rgb(198, 161, 81)" />
      
      {elements.map((element, index) => (
        <mesh
          key={index}
          position={element.position}
          scale={element.scale}
          rotation={element.rotation}
        >
          <sphereGeometry args={[0.1, 8, 6]} />
          <meshStandardMaterial
            color="rgb(198, 161, 81)"
            transparent
            opacity={0.6}
            emissive="rgb(198, 161, 81)"
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

// Main Navigation Particles Component
interface NavigationParticlesProps {
  className?: string;
  onError?: (error: Error) => void;
}

export default function NavigationParticles({ className = "", onError }: NavigationParticlesProps) {
  const [hasError, setHasError] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebglSupported(!!gl);
    } catch (error) {
      setWebglSupported(false);
      onError?.(new Error('WebGL not supported'));
    }

    // Delay loading for better performance
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, [onError]);

  const handleError = (error: Error) => {
    console.warn('Navigation Particles Error:', error);
    setHasError(true);
    onError?.(error);
  };

  // Fallback for unsupported WebGL or errors
  if (!webglSupported || hasError || !isLoaded) {
    return (
      <div className={`fixed top-0 left-0 w-full h-20 pointer-events-none z-40 ${className}`}>
        {/* Static fallback particles */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/40 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed top-0 left-0 w-full h-20 pointer-events-none z-40 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          // Optimize WebGL context
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          
          // Handle context loss
          gl.domElement.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
            handleError(new Error('WebGL context lost'));
          });
        }}
      >
        <ParticleField count={80} onError={handleError} />
        <FloatingElements onError={handleError} />
      </Canvas>
    </div>
  );
}