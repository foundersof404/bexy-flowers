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
    <section className="py-32 px-4 relative overflow-hidden min-h-screen" style={{ background: 'rgb(211, 211, 209)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, hsl(51 100% 50% / 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, hsl(51 100% 50% / 0.1) 0%, transparent 50%)`
        }} />
      </div>

      <div className="max-w-8xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-20 relative"
          viewport={{ once: true }}
        >
          {/* Modern Floating Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-slate-800/10 to-slate-700/10 backdrop-blur-xl border border-slate-600/20 mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-700 tracking-wider uppercase">Interactive Designer</span>
          </motion.div>

          {/* Luxury Typography with Gold Accent */}
          <motion.h2 
            className="font-luxury text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
              letterSpacing: '0.05em'
            }}
          >
            Design Your Perfect Bouquet
            {/* Animated Gold Underline */}
            <motion.div 
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: '180px' }}
              transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            />
          </motion.h2>

          {/* Enhanced Decorative Elements */}
          <div className="relative mb-8">
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent mx-auto" />
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-amber-500 rotate-45 shadow-lg shadow-amber-500/50" />
          </div>

          {/* Enhanced Description */}
          <motion.p 
            className="font-body text-lg md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Create a custom arrangement in real-time with our interactive 3D bouquet builder. 
            Experience the future of floral design with cutting-edge technology and unlimited creativity.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Enhanced 3D Preview */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative bg-gradient-to-br from-white/95 via-slate-50/90 to-slate-100/95 backdrop-blur-xl border border-slate-200/50 rounded-[25px] shadow-[0_20px_60px_rgba(198,161,81,0.15)] hover:shadow-[0_30px_80px_rgba(198,161,81,0.25)] transition-all duration-700 ease-out overflow-hidden p-8">
              
              {/* Modern Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400/20 to-yellow-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-amber-300/30">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="font-luxury text-2xl font-bold text-slate-800">
                    Live Preview
                  </h3>
                </div>
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 animate-pulse" />
              </div>

              {/* Enhanced 3D Canvas */}
              <div className="relative rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-slate-100/50 to-slate-200/30 border border-slate-300/30">
                <BouquetPreview configuration={configuration} />
                
                {/* Floating Stats Overlay */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xl text-slate-800 px-4 py-2 rounded-xl border border-slate-300/30 shadow-lg">
                  <div className="text-sm font-medium">3D Model</div>
                </div>
                
                <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400/90 to-yellow-500/90 backdrop-blur-xl text-slate-900 px-4 py-2 rounded-xl border border-amber-300/50 shadow-lg">
                  <div className="text-sm font-bold">Interactive</div>
                </div>
              </div>
              
              {/* Modern Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-slate-100/50 to-slate-200/30 backdrop-blur-xl border border-slate-300/30 rounded-2xl p-4">
                  <div className="text-sm text-slate-600 font-medium mb-1">Total Flowers</div>
                  <div className="text-2xl font-luxury font-bold text-slate-800">{configuration.flowers.length}</div>
                </div>
                <div className="bg-gradient-to-br from-amber-100/50 to-yellow-200/30 backdrop-blur-xl border border-amber-300/30 rounded-2xl p-4">
                  <div className="text-sm text-slate-600 font-medium mb-1">Estimated Price</div>
                  <div className="text-2xl font-luxury font-bold text-amber-700">${configuration.totalPrice}</div>
                </div>
              </div>

              {/* Modern Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-6 py-4 rounded-2xl font-medium text-base transition-all duration-500 ease-out hover:from-amber-600 hover:to-yellow-700 hover:shadow-[0_10px_30px_rgba(198,161,81,0.4)] flex items-center justify-center gap-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-5 h-5" />
                  Order Now
                </motion.button>
                <motion.button
                  className="bg-white/90 backdrop-blur-xl border-2 border-slate-300/50 text-slate-700 px-6 py-4 rounded-2xl font-medium text-base transition-all duration-500 ease-out hover:bg-slate-100 hover:border-slate-400/70 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetConfiguration}
                >
                  <RotateCcw className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Luxury Border */}
              <div className="absolute inset-0 rounded-[25px] border border-amber-300/30 pointer-events-none" />
              <div className="absolute inset-[1px] rounded-[25px] bg-gradient-to-br from-amber-100/20 via-transparent to-amber-900/10 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>
          </motion.div>

          {/* Enhanced Configuration Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="relative bg-gradient-to-br from-white/95 via-slate-50/90 to-slate-100/95 backdrop-blur-xl border border-slate-200/50 rounded-[25px] shadow-[0_20px_60px_rgba(198,161,81,0.15)] hover:shadow-[0_30px_80px_rgba(198,161,81,0.25)] transition-all duration-700 ease-out overflow-hidden p-8">
              
              {/* Modern Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400/20 to-yellow-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-amber-300/30">
                    <Palette className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="font-luxury text-2xl font-bold text-slate-800">
                    Customize Your Bouquet
                  </h3>
                </div>
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 animate-pulse" />
              </div>

              {/* Modern Tabs */}
              <div className="flex gap-3 mb-8 p-1 bg-slate-100/50 backdrop-blur-xl border border-slate-300/30 rounded-2xl">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg'
                        : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                    }`}
                    onClick={() => setActiveTab(tab.id as any)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </motion.button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* Enhanced Flowers Tab */}
                {activeTab === 'flowers' && (
                  <motion.div
                    key="flowers"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-6 h-6 bg-gradient-to-br from-pink-400/20 to-rose-500/20 backdrop-blur-xl rounded-lg flex items-center justify-center border border-pink-300/30">
                        <Flower2 className="w-3 h-3 text-pink-600" />
                      </div>
                      <h4 className="font-luxury text-xl font-bold text-slate-800">Available Flowers</h4>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {flowerOptions.map((flower) => (
                        <motion.div
                          key={flower.id}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div 
                            className="relative bg-gradient-to-br from-white/90 to-slate-50/80 backdrop-blur-xl border border-slate-300/30 rounded-2xl p-4 cursor-pointer transition-all duration-500 ease-out hover:border-amber-400/50 hover:shadow-[0_8px_25px_rgba(198,161,81,0.2)] hover:bg-gradient-to-br hover:from-amber-50/50 hover:to-yellow-50/50"
                            onClick={() => addFlower(flower)}
                          >
                            <div className="text-center">
                              <div className="text-3xl mb-3 transform transition-transform duration-300 hover:scale-110">{flower.emoji}</div>
                              <div className="font-luxury font-semibold text-sm text-slate-800 mb-2">{flower.name}</div>
                              <div className="bg-gradient-to-r from-amber-400/20 to-yellow-500/20 backdrop-blur-xl border border-amber-300/30 text-amber-700 px-3 py-1 rounded-xl text-xs font-bold">
                                ${flower.price}
                              </div>
                            </div>
                            
                            {/* Hover Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 via-transparent to-yellow-100/20 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {configuration.flowers.length > 0 && (
                      <motion.div 
                        className="mt-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-6 h-6 bg-gradient-to-br from-emerald-400/20 to-green-500/20 backdrop-blur-xl rounded-lg flex items-center justify-center border border-emerald-300/30">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          </div>
                          <h4 className="font-luxury text-lg font-bold text-slate-800">Selected Flowers</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {configuration.flowers.map((flower, index) => (
                            <motion.div
                              key={flower.id}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <div 
                                className="bg-gradient-to-r from-emerald-400/90 to-green-500/90 backdrop-blur-xl text-white px-4 py-2 rounded-xl text-sm font-medium cursor-pointer hover:from-emerald-500 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                                onClick={() => removeFlower(flower.id)}
                              >
                                <span>{flower.emoji}</span>
                                <span>{flower.name}</span>
                                <span className="opacity-80">(${flower.price})</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Enhanced Wrapper Tab */}
                {activeTab === 'wrapper' && (
                  <motion.div
                    key="wrapper"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-6 h-6 bg-gradient-to-br from-amber-400/20 to-orange-500/20 backdrop-blur-xl rounded-lg flex items-center justify-center border border-amber-300/30">
                        <Package className="w-3 h-3 text-amber-600" />
                      </div>
                      <h4 className="font-luxury text-xl font-bold text-slate-800">Wrapper Options</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {wrapperOptions.map((wrapper) => (
                        <motion.div
                          key={wrapper.id}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div 
                            className={`relative bg-gradient-to-br from-white/90 to-slate-50/80 backdrop-blur-xl border rounded-2xl p-4 cursor-pointer transition-all duration-500 ease-out ${
                              configuration.wrapper === wrapper.id
                                ? 'border-amber-400/50 shadow-[0_8px_25px_rgba(198,161,81,0.2)] bg-gradient-to-br from-amber-50/50 to-yellow-50/50'
                                : 'border-slate-300/30 hover:border-amber-400/50 hover:shadow-[0_8px_25px_rgba(198,161,81,0.2)] hover:bg-gradient-to-br hover:from-amber-50/50 hover:to-yellow-50/50'
                            }`}
                            onClick={() => setConfiguration(prev => ({ ...prev, wrapper: wrapper.id }))}
                          >
                            <div className="text-center">
                              <div 
                                className="w-16 h-16 mx-auto mb-3 rounded-xl border border-slate-300/30 shadow-sm"
                                style={{ backgroundColor: wrapper.color }}
                              />
                              <div className="font-luxury font-semibold text-sm text-slate-800 mb-2">{wrapper.name}</div>
                              <div className="bg-gradient-to-r from-amber-400/20 to-yellow-500/20 backdrop-blur-xl border border-amber-300/30 text-amber-700 px-3 py-1 rounded-xl text-xs font-bold">
                                ${wrapper.price}
                              </div>
                            </div>
                            
                            {/* Selection Indicator */}
                            {configuration.wrapper === wrapper.id && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Enhanced Ribbon Tab */}
                {activeTab === 'ribbon' && (
                  <motion.div
                    key="ribbon"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-400/20 to-pink-500/20 backdrop-blur-xl rounded-lg flex items-center justify-center border border-purple-300/30">
                        <Palette className="w-3 h-3 text-purple-600" />
                      </div>
                      <h4 className="font-luxury text-xl font-bold text-slate-800">Ribbon Options</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {ribbonOptions.map((ribbon) => (
                        <motion.div
                          key={ribbon.id}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div 
                            className={`relative bg-gradient-to-br from-white/90 to-slate-50/80 backdrop-blur-xl border rounded-2xl p-4 cursor-pointer transition-all duration-500 ease-out ${
                              configuration.ribbon === ribbon.id
                                ? 'border-amber-400/50 shadow-[0_8px_25px_rgba(198,161,81,0.2)] bg-gradient-to-br from-amber-50/50 to-yellow-50/50'
                                : 'border-slate-300/30 hover:border-amber-400/50 hover:shadow-[0_8px_25px_rgba(198,161,81,0.2)] hover:bg-gradient-to-br hover:from-amber-50/50 hover:to-yellow-50/50'
                            }`}
                            onClick={() => setConfiguration(prev => ({ ...prev, ribbon: ribbon.id }))}
                          >
                            <div className="text-center">
                              <div 
                                className="w-20 h-6 mx-auto mb-3 rounded-lg border border-slate-300/30 shadow-sm"
                                style={{ backgroundColor: ribbon.color }}
                              />
                              <div className="font-luxury font-semibold text-sm text-slate-800 mb-2">{ribbon.name}</div>
                              <div className="bg-gradient-to-r from-amber-400/20 to-yellow-500/20 backdrop-blur-xl border border-amber-300/30 text-amber-700 px-3 py-1 rounded-xl text-xs font-bold">
                                ${ribbon.price}
                              </div>
                            </div>
                            
                            {/* Selection Indicator */}
                            {configuration.ribbon === ribbon.id && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VirtualBouquetBuilder;