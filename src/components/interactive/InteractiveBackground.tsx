import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/use-mobile';

type MutableMouse = { x: number; y: number };

const ParticleField: React.FC<{ mouseRef: React.MutableRefObject<MutableMouse> }> = ({ mouseRef }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 60;

  const buffers = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const life = new Float32Array(particleCount);
    const maxLife = 100;

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

      sizes[i] = Math.random() * 0.1 + 0.05;
      life[i] = Math.random() * maxLife;

      colors[i * 3] = 1;
      colors[i * 3 + 1] = 0.84;
      colors[i * 3 + 2] = 0;
    }

    return { positions, velocities, colors, sizes, life, maxLife };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const { positions, velocities, colors, sizes, life, maxLife } = buffers;
    const mouse = mouseRef.current;

    for (let i = 0; i < particleCount; i++) {
      const ix = i * 3;

      // Attraction toward mouse
      const toMouseX = mouse.x * 10 - positions[ix];
      const toMouseY = -mouse.y * 10 - positions[ix + 1];
      velocities[ix] += toMouseX * 0.0001;
      velocities[ix + 1] += toMouseY * 0.0001;
      velocities[ix] *= 0.99;
      velocities[ix + 1] *= 0.99;
      velocities[ix + 2] *= 0.99;

      positions[ix] += velocities[ix];
      positions[ix + 1] += velocities[ix + 1];
      positions[ix + 2] += velocities[ix + 2];

      // Bounds
      if (Math.abs(positions[ix]) > 10) velocities[ix] *= -0.5;
      if (Math.abs(positions[ix + 1]) > 10) velocities[ix + 1] *= -0.5;
      if (Math.abs(positions[ix + 2]) > 10) velocities[ix + 2] *= -0.5;

      // Life fade
      life[i] += 1;
      if (life[i] > maxLife) {
        life[i] = 0;
        positions[ix] = (Math.random() - 0.5) * 20;
        positions[ix + 1] = (Math.random() - 0.5) * 20;
        positions[ix + 2] = (Math.random() - 0.5) * 20;
      }
    }

    const positionAttr = pointsRef.current.geometry.getAttribute('position');
    (positionAttr.array as Float32Array).set(buffers.positions);
    positionAttr.needsUpdate = true;

    const colorAttr = pointsRef.current.geometry.getAttribute('color');
    if (colorAttr) {
      (colorAttr.array as Float32Array).set(buffers.colors);
      colorAttr.needsUpdate = true;
    }
  });

  return (
    <Points ref={pointsRef}>
      <PointMaterial
        transparent
        vertexColors
        size={0.08}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const FloatingPetals: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    groupRef.current.children.forEach((child, index) => {
      child.position.y = Math.sin(clock.getElapsedTime() + index) * 0.5;
      child.rotation.z = clock.getElapsedTime() * 0.2 + index;
    });
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 8 }).map((_, index) => (
        <mesh
          key={index}
          position={[
            Math.cos(index * Math.PI * 2 / 8) * 5,
            Math.random() * 10 - 5,
            Math.sin(index * Math.PI * 2 / 8) * 5
          ]}
        >
          <planeGeometry args={[0.5, 0.8]} />
          <meshBasicMaterial
            color="rgb(198, 161, 81)"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

const InteractiveBackground: React.FC = () => {
  const mouseRef = useRef<MutableMouse>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useMemo(() =>
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  []);

  useEffect(() => {
    let rafId = 0;
    let needsUpdate = false;

    const onMove = (event: MouseEvent) => {
      const next = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      };
      mouseRef.current.x = next.x;
      mouseRef.current.y = next.y;
      if (!needsUpdate) {
        needsUpdate = true;
        rafId = window.requestAnimationFrame(() => {
          needsUpdate = false;
          const el = containerRef.current;
          if (el) {
            el.style.setProperty('--mouse-x', `${(mouseRef.current.x * 50 + 50).toFixed(2)}%`);
            el.style.setProperty('--mouse-y', `${(-mouseRef.current.y * 50 + 50).toFixed(2)}%`);
          }
        });
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove as any);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        background: 'hsl(220 8% 6%)'
      }}
    >
      {!isMobile && !prefersReducedMotion && (
        <Canvas
          camera={{ position: [0, 0, 10], fov: 75 }}
          style={{ background: 'transparent' }}
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          <ParticleField mouseRef={mouseRef} />
        </Canvas>
      )}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
            hsl(var(--primary) / 0.1) 0%, 
            transparent 50%)`
        }}
      />
    </div>
  );
};

export default InteractiveBackground;