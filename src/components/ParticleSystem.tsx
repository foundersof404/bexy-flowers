import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Particles({ count = 120 }) {
  const mesh = useRef<THREE.Points>(null);
  const { size } = useThree();
  const isPausedRef = useRef(false);
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      // Gold color variations
      colors[i * 3] = 1; // R
      colors[i * 3 + 1] = 0.84; // G  
      colors[i * 3 + 2] = 0; // B
    }
    
    return [positions, colors];
  }, [count]);

  useEffect(() => {
    const onVisibility = () => {
      isPausedRef.current = document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useFrame((state) => {
    if (isPausedRef.current) return;
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.1;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.15;
      
      const positions = mesh.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] = Math.sin(state.clock.elapsedTime + i) * 2;
      }
      mesh.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={mesh} positions={positions} colors={colors}>
      <PointMaterial
        transparent
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors
        opacity={0.6}
      />
    </Points>
  );
}

interface ParticleSystemProps {
  className?: string;
}

export default function ParticleSystem({ className = "" }: ParticleSystemProps) {
  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <Particles />
      </Canvas>
    </div>
  );
}