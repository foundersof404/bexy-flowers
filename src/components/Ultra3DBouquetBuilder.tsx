import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Cone } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Palette, Sparkles, Heart, Plus, Minus, RotateCcw } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// 3D Flower Component
function Flower({ position, color, scale = 1 }: { position: [number, number, number], color: string, scale?: number }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={position} scale={scale}>
      {/* Flower Petals */}
      {[...Array(6)].map((_, i) => (
        <Sphere
          key={i}
          args={[0.15, 8, 6]}
          position={[
            Math.cos((i * Math.PI * 2) / 6) * 0.3,
            0,
            Math.sin((i * Math.PI * 2) / 6) * 0.3
          ]}
        >
          <meshStandardMaterial color={color} />
        </Sphere>
      ))}
      {/* Flower Center */}
      <Sphere args={[0.1, 8, 6]} position={[0, 0, 0]}>
        <meshStandardMaterial color="rgb(198, 161, 81)" />
      </Sphere>
      {/* Stem */}
      <Box args={[0.02, 0.8, 0.02]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#228B22" />
      </Box>
    </group>
  );
}

// 3D Bouquet Scene
function BouquetScene({ flowers }: { flowers: Array<{ id: number, color: string, position: [number, number, number] }> }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="rgb(198, 161, 81)" />
      
      {/* Base Container */}
      <Cone args={[0.8, 1.5, 8]} position={[0, -1, 0]} rotation={[0, 0, 0]}>
        <meshStandardMaterial color="#E5E4E2" transparent opacity={0.8} />
      </Cone>
      
      {/* Flowers */}
      {flowers.map((flower) => (
        <Flower
          key={flower.id}
          position={flower.position}
          color={flower.color}
          scale={0.8 + Math.random() * 0.4}
        />
      ))}
      
      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <Sphere key={`particle-${i}`} args={[0.02, 4, 4]} position={[
          (Math.random() - 0.5) * 6,
          Math.random() * 4,
          (Math.random() - 0.5) * 6
        ]}>
          <meshStandardMaterial color="rgb(198, 161, 81)" transparent opacity={0.6} />
        </Sphere>
      ))}
    </group>
  );
}

const flowerColors = [
  { name: "Royal Gold", color: "rgb(198, 161, 81)" },
  { name: "Pure White", color: "#FFFFFF" },
  { name: "Deep Red", color: "#DC143C" },
  { name: "Soft Pink", color: "#FFB6C1" },
  { name: "Lavender", color: "#E6E6FA" },
  { name: "Coral", color: "#FF7F50" }
];

const Ultra3DBouquetBuilder = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [flowers, setFlowers] = useState<Array<{ id: number, color: string, position: [number, number, number] }>>([]);
  const [selectedColor, setSelectedColor] = useState(flowerColors[0]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;

    if (section && canvas) {
      gsap.set(canvas, { scale: 0.8, opacity: 0 });

      ScrollTrigger.create({
        trigger: section,
        start: "top 70%",
        onEnter: () => {
          gsap.to(canvas, {
            duration: 1.5,
            scale: 1,
            opacity: 1,
            ease: "power3.out"
          });
        }
      });

      // Add initial flowers
      const initialFlowers = [
        { id: 1, color: "rgb(198, 161, 81)", position: [0, 0, 0] as [number, number, number] },
        { id: 2, color: "#FFFFFF", position: [0.4, 0.2, 0.2] as [number, number, number] },
        { id: 3, color: "rgb(198, 161, 81)", position: [-0.3, 0.1, -0.2] as [number, number, number] }
      ];
      setFlowers(initialFlowers);
      setTotalPrice(initialFlowers.length * 25);
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const addFlower = () => {
    if (flowers.length >= 12) return;
    
    setIsAnimating(true);
    const newFlower = {
      id: Date.now(),
      color: selectedColor.color,
      position: [
        (Math.random() - 0.5) * 1.2,
        Math.random() * 0.8,
        (Math.random() - 0.5) * 1.2
      ] as [number, number, number]
    };
    
    setFlowers(prev => [...prev, newFlower]);
    setTotalPrice(prev => prev + 25);
    
    setTimeout(() => setIsAnimating(false), 600);
  };

  const removeFlower = () => {
    if (flowers.length <= 1) return;
    
    setFlowers(prev => prev.slice(0, -1));
    setTotalPrice(prev => prev - 25);
  };

  const resetBouquet = () => {
    const initialFlowers = [
      { id: Date.now(), color: "rgb(198, 161, 81)", position: [0, 0, 0] as [number, number, number] }
    ];
    setFlowers(initialFlowers);
    setTotalPrice(25);
  };

  return (
    <section 
      ref={sectionRef}
      className="py-32 px-4 bg-background relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="max-w-8xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="font-luxury text-5xl md:text-7xl font-bold text-foreground mb-6 text-3d">
            3D BOUQUET ARCHITECT
          </h2>
          <div className="w-32 h-px bg-primary mx-auto mb-8" />
          <p className="font-body text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Design your perfect arrangement in real-time 3D. Watch as each flower finds its place 
            in your architectural masterpiece with physics-based positioning and premium visualization.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* 3D Canvas */}
          <motion.div
            ref={canvasRef}
            className="relative aspect-square max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-glass backdrop-blur-sm border border-primary/20 shadow-3d">
              <Canvas
                camera={{ position: [0, 2, 4], fov: 50 }}
                style={{ background: 'transparent' }}
              >
                <BouquetScene flowers={flowers} />
                <OrbitControls
                  enableZoom={true}
                  enablePan={false}
                  autoRotate={true}
                  autoRotateSpeed={0.5}
                  minPolarAngle={Math.PI / 6}
                  maxPolarAngle={Math.PI - Math.PI / 6}
                />
              </Canvas>
            </div>
            
            {/* Price Display */}
            <motion.div
              className="absolute top-6 right-6 bg-primary text-primary-foreground px-6 py-3 font-luxury font-bold text-xl shadow-gold"
              animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              ${totalPrice}
            </motion.div>

            {/* Flower Count */}
            <div className="absolute top-6 left-6 bg-foreground/90 text-background px-4 py-2 font-body font-semibold backdrop-blur-sm">
              {flowers.length} Flowers
            </div>
          </motion.div>

          {/* Builder Controls */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {/* Color Selection */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Palette className="w-8 h-8 text-primary" />
                <h3 className="font-luxury text-2xl font-semibold text-foreground">
                  Premium Flower Selection
                </h3>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {flowerColors.map((colorOption) => (
                  <motion.button
                    key={colorOption.name}
                    className={`p-4 border-2 transition-3d ${
                      selectedColor.name === colorOption.name
                        ? 'border-primary shadow-gold'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedColor(colorOption)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div
                      className="w-full h-8 mb-2 shadow-sharp"
                      style={{ backgroundColor: colorOption.color }}
                    />
                    <span className="font-body text-sm text-foreground">
                      {colorOption.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Sparkles className="w-8 h-8 text-primary" />
                <h3 className="font-luxury text-2xl font-semibold text-foreground">
                  Build Your Masterpiece
                </h3>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <Button
                  onClick={addFlower}
                  disabled={flowers.length >= 12}
                  className="bg-primary hover:bg-primary-dark text-primary-foreground py-6 shadow-sharp hover:shadow-gold transition-3d"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Flower
                </Button>
                
                <Button
                  onClick={removeFlower}
                  disabled={flowers.length <= 1}
                  variant="outline"
                  className="border-2 border-foreground text-foreground hover:bg-foreground hover:text-background py-6 transition-3d"
                >
                  <Minus className="w-5 h-5 mr-2" />
                  Remove
                </Button>
                
                <Button
                  onClick={resetBouquet}
                  variant="outline"
                  className="border-2 border-muted-foreground text-muted-foreground hover:bg-muted-foreground hover:text-background py-6 transition-3d"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Heart className="w-8 h-8 text-primary" />
                <h3 className="font-luxury text-2xl font-semibold text-foreground">
                  Luxury Features
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-card shadow-sharp">
                  <div className="w-3 h-3 bg-primary mt-2" />
                  <div>
                    <h4 className="font-body font-semibold text-card-foreground mb-1">
                      Real-Time 3D Preview
                    </h4>
                    <p className="font-body text-sm text-muted-foreground">
                      See your bouquet come to life with physics-based positioning
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 bg-card shadow-sharp">
                  <div className="w-3 h-3 bg-primary mt-2" />
                  <div>
                    <h4 className="font-body font-semibold text-card-foreground mb-1">
                      Architectural Precision
                    </h4>
                    <p className="font-body text-sm text-muted-foreground">
                      Each flower placed with mathematical perfection
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 bg-card shadow-sharp">
                  <div className="w-3 h-3 bg-primary mt-2" />
                  <div>
                    <h4 className="font-body font-semibold text-card-foreground mb-1">
                      Premium Materials Only
                    </h4>
                    <p className="font-body text-sm text-muted-foreground">
                      Hand-selected flowers from our luxury collection
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Final CTA */}
            <motion.div
              className="pt-8"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                className="w-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground py-8 font-luxury text-xl font-bold shadow-3d hover:shadow-luxury hover:glow-intense transition-3d group"
              >
                <span className="mr-4">CREATE MASTERPIECE</span>
                <motion.div
                  className="group-hover:rotate-90 transition-transform duration-500"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Ultra3DBouquetBuilder;