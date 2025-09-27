import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text3D, Center } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LiquidButton } from '@/components/ui/liquid-button';
import { Palette, Flower2, Package, Sparkles, RotateCcw, Download } from 'lucide-react';
import * as THREE from 'three';

interface FlowerOption {
  id: string;
  name: string;
  emoji: string;
  color: string;
  price: number;
  position: [number, number, number];
}

interface BouquetConfiguration {
  flowers: FlowerOption[];
  wrapper: string;
  ribbon: string;
  totalPrice: number;
}

const flowerOptions: FlowerOption[] = [
  { id: 'rose', name: 'Rose', emoji: '🌹', color: '#FF6B6B', price: 15, position: [0, 0, 0] },
  { id: 'tulip', name: 'Tulip', emoji: '🌷', color: '#FF8E8E', price: 12, position: [1, 0, 0] },
  { id: 'sunflower', name: 'Sunflower', emoji: '🌻', color: 'rgb(198, 161, 81)', price: 18, position: [-1, 0, 0] },
  { id: 'lily', name: 'Lily', emoji: '🌺', color: '#FF69B4', price: 20, position: [0, 1, 0] },
  { id: 'orchid', name: 'Orchid', emoji: '🌸', color: '#DDA0DD', price: 25, position: [0, -1, 0] },
  { id: 'carnation', name: 'Carnation', emoji: '🌼', color: '#FFA500', price: 10, position: [0.5, 0.5, 0] }
];

const wrapperOptions = [
  { id: 'kraft', name: 'Kraft Paper', color: '#D2B48C', price: 5 },
  { id: 'silk', name: 'Silk Wrap', color: '#F0F8FF', price: 15 },
  { id: 'cellophane', name: 'Clear Cellophane', color: '#E6E6FA', price: 8 },
  { id: 'burlap', name: 'Rustic Burlap', color: '#DEB887', price: 12 }
];

const ribbonOptions = [
  { id: 'gold', name: 'Gold Satin', color: 'rgb(198, 161, 81)', price: 3 },
  { id: 'silver', name: 'Silver Satin', color: '#C0C0C0', price: 3 },
  { id: 'red', name: 'Red Velvet', color: '#DC143C', price: 4 },
  { id: 'white', name: 'White Silk', color: '#FFFFFF', price: 3 }
];

const Flower3D: React.FC<{ 
  flower: FlowerOption; 
  position: [number, number, number];
  scale?: number;
}> = ({ flower, position, scale = 1 }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color={flower.color} />
      <Center>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.2}
          height={0.02}
          position={[0, 0, 0.4]}
        >
          {flower.emoji}
          <meshStandardMaterial color="white" />
        </Text3D>
      </Center>
    </mesh>
  );
};

const BouquetPreview: React.FC<{ configuration: BouquetConfiguration }> = ({ configuration }) => {
  return (
    <div className="h-96 w-full bg-gradient-to-b from-muted/20 to-background rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <directionalLight position={[-10, -10, -5]} intensity={0.4} />
        
        {configuration.flowers.map((flower, index) => (
          <Flower3D
            key={`${flower.id}-${index}`}
            flower={flower}
            position={[
              (Math.random() - 0.5) * 2,
              (Math.random() - 0.5) * 2,
              (Math.random() - 0.5) * 1
            ]}
            scale={0.8 + Math.random() * 0.4}
          />
        ))}
        
        {/* Wrapper representation */}
        <mesh position={[0, -2, 0]} rotation={[-Math.PI / 6, 0, 0]}>
          <coneGeometry args={[1.5, 3, 8, 1, true]} />
          <meshStandardMaterial 
            color={wrapperOptions.find(w => w.id === configuration.wrapper)?.color || '#D2B48C'}
            transparent
            opacity={0.7}
          />
        </mesh>
        
        <OrbitControls enableZoom={true} enablePan={false} />
      </Canvas>
    </div>
  );
};

const VirtualBouquetBuilder = () => {
  const [configuration, setConfiguration] = useState<BouquetConfiguration>({
    flowers: [],
    wrapper: 'kraft',
    ribbon: 'gold',
    totalPrice: 0
  });

  const [activeTab, setActiveTab] = useState<'flowers' | 'wrapper' | 'ribbon'>('flowers');

  useEffect(() => {
    const basePrice = configuration.flowers.reduce((sum, flower) => sum + flower.price, 0);
    const wrapperPrice = wrapperOptions.find(w => w.id === configuration.wrapper)?.price || 0;
    const ribbonPrice = ribbonOptions.find(r => r.id === configuration.ribbon)?.price || 0;
    
    setConfiguration(prev => ({
      ...prev,
      totalPrice: basePrice + wrapperPrice + ribbonPrice
    }));
  }, [configuration.flowers, configuration.wrapper, configuration.ribbon]);

  const addFlower = (flower: FlowerOption) => {
    setConfiguration(prev => ({
      ...prev,
      flowers: [...prev.flowers, { ...flower, id: `${flower.id}-${Date.now()}` }]
    }));
  };

  const removeFlower = (flowerId: string) => {
    setConfiguration(prev => ({
      ...prev,
      flowers: prev.flowers.filter(f => f.id !== flowerId)
    }));
  };

  const resetConfiguration = () => {
    setConfiguration({
      flowers: [],
      wrapper: 'kraft',
      ribbon: 'gold',
      totalPrice: 0
    });
  };

  const tabs = [
    { id: 'flowers', label: 'Flowers', icon: <Flower2 className="w-4 h-4" /> },
    { id: 'wrapper', label: 'Wrapper', icon: <Package className="w-4 h-4" /> },
    { id: 'ribbon', label: 'Ribbon', icon: <Palette className="w-4 h-4" /> }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 text-primary border-primary/20">
            <Sparkles className="w-4 h-4 mr-2" />
            Virtual Builder
          </Badge>
          <h2 className="font-luxury text-4xl md:text-6xl font-bold text-foreground mb-4">
            Design Your Perfect Bouquet
          </h2>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto">
            Create a custom arrangement in real-time with our interactive 3D bouquet builder
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* 3D Preview */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/10">
              <h3 className="font-luxury text-2xl font-bold text-foreground mb-4">
                Live Preview
              </h3>
              <BouquetPreview configuration={configuration} />
              
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-foreground font-semibold">Total Flowers:</span>
                  <Badge variant="outline">{configuration.flowers.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground font-semibold">Estimated Price:</span>
                  <Badge className="bg-primary/20 text-primary font-bold">
                    ${configuration.totalPrice}
                  </Badge>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <LiquidButton variant="gold" size="lg" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Order Now
                </LiquidButton>
                <LiquidButton variant="glass" onClick={resetConfiguration}>
                  <RotateCcw className="w-4 h-4" />
                </LiquidButton>
              </div>
            </Card>
          </motion.div>

          {/* Configuration Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/10">
              <h3 className="font-luxury text-2xl font-bold text-foreground mb-6">
                Customize Your Bouquet
              </h3>

              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                {tabs.map((tab) => (
                  <LiquidButton
                    key={tab.id}
                    variant={activeTab === tab.id ? "gold" : "glass"}
                    size="sm"
                    onClick={() => setActiveTab(tab.id as any)}
                  >
                    {tab.icon}
                    <span className="ml-2">{tab.label}</span>
                  </LiquidButton>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* Flowers Tab */}
                {activeTab === 'flowers' && (
                  <motion.div
                    key="flowers"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <h4 className="font-semibold text-foreground mb-4">Available Flowers</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {flowerOptions.map((flower) => (
                        <motion.div
                          key={flower.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card 
                            className="p-4 cursor-pointer border-primary/10 hover:border-primary/30 transition-all duration-300"
                            onClick={() => addFlower(flower)}
                          >
                            <div className="text-center">
                              <div className="text-3xl mb-2">{flower.emoji}</div>
                              <div className="font-semibold text-sm text-foreground">{flower.name}</div>
                              <Badge variant="outline" className="mt-2">${flower.price}</Badge>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    {configuration.flowers.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-foreground mb-3">Selected Flowers</h4>
                        <div className="flex flex-wrap gap-2">
                          {configuration.flowers.map((flower, index) => (
                            <Badge
                              key={flower.id}
                              variant="secondary"
                              className="cursor-pointer hover:bg-destructive/20"
                              onClick={() => removeFlower(flower.id)}
                            >
                              {flower.emoji} {flower.name} (${flower.price})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Wrapper Tab */}
                {activeTab === 'wrapper' && (
                  <motion.div
                    key="wrapper"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <h4 className="font-semibold text-foreground mb-4">Wrapper Options</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {wrapperOptions.map((wrapper) => (
                        <motion.div
                          key={wrapper.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className={`p-4 cursor-pointer transition-all duration-300 ${
                              configuration.wrapper === wrapper.id
                                ? 'border-primary/50 bg-primary/10'
                                : 'border-primary/10 hover:border-primary/30'
                            }`}
                            onClick={() => setConfiguration(prev => ({ ...prev, wrapper: wrapper.id }))}
                          >
                            <div className="text-center">
                              <div 
                                className="w-12 h-12 mx-auto mb-2 rounded-lg"
                                style={{ backgroundColor: wrapper.color }}
                              />
                              <div className="font-semibold text-sm text-foreground">{wrapper.name}</div>
                              <Badge variant="outline" className="mt-2">${wrapper.price}</Badge>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Ribbon Tab */}
                {activeTab === 'ribbon' && (
                  <motion.div
                    key="ribbon"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <h4 className="font-semibold text-foreground mb-4">Ribbon Options</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {ribbonOptions.map((ribbon) => (
                        <motion.div
                          key={ribbon.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className={`p-4 cursor-pointer transition-all duration-300 ${
                              configuration.ribbon === ribbon.id
                                ? 'border-primary/50 bg-primary/10'
                                : 'border-primary/10 hover:border-primary/30'
                            }`}
                            onClick={() => setConfiguration(prev => ({ ...prev, ribbon: ribbon.id }))}
                          >
                            <div className="text-center">
                              <div 
                                className="w-12 h-3 mx-auto mb-2 rounded-sm"
                                style={{ backgroundColor: ribbon.color }}
                              />
                              <div className="font-semibold text-sm text-foreground">{ribbon.name}</div>
                              <Badge variant="outline" className="mt-2">${ribbon.price}</Badge>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VirtualBouquetBuilder;