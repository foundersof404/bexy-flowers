import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Draggable } from 'gsap/Draggable';
import { gsap } from 'gsap';
import { BouquetCanvasProps } from '@/types/bouquet';

// Register GSAP Draggable plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable);
}

const BouquetCanvas: React.FC<BouquetCanvasProps> = ({
  selectedFlowers,
  canvasSize,
  onFlowerPositionChange
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggableInstances, setDraggableInstances] = useState<Draggable[]>([]);
  const [activeFlower, setActiveFlower] = useState<string | null>(null);

  // Cleanup draggable instances on unmount
  useEffect(() => {
    return () => {
      draggableInstances.forEach(instance => instance.kill());
    };
  }, [draggableInstances]);

  // Advanced draggable setup with physics
  useEffect(() => {
    if (!canvasRef.current || typeof window === 'undefined') return;

    // Kill existing instances
    draggableInstances.forEach(instance => instance.kill());

    const newInstances: Draggable[] = [];
    const canvas = canvasRef.current;

    Object.entries(selectedFlowers).forEach(([flowerId, selectedFlower]) => {
      const flowerElement = canvas.querySelector(`[data-flower-id="${flowerId}"]`) as HTMLElement;
      
      if (!flowerElement) return;

      const draggable = Draggable.create(flowerElement, {
        type: "x,y",
        bounds: canvas,
        inertia: true,
        edgeResistance: 0.85,
        throwResistance: 2500,
        dragResistance: 0.2,
        
        onPress: function() {
          setActiveFlower(flowerId);
          // Press feedback with slight scale down
          gsap.to(this.target, {
            scale: (selectedFlower.position?.scale || 1) * 0.92,
            duration: 0.15,
            ease: "power2.out"
          });
          
          // Bring to front
          this.target.style.zIndex = '1000';
        },
        
        onDrag: function() {
          // Calculate velocity-based rotation
          const velocityX = this.getVelocity('x');
          const velocityY = this.getVelocity('y');
          const velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
          
          // Dynamic tilt based on velocity and direction
          const angle = Math.atan2(velocityY, velocityX) * (180 / Math.PI);
          const tiltAmount = Math.min(velocity * 0.02, 15);
          const dynamicRotation = (selectedFlower.position?.rotation || 0) + 
            Math.sin(angle * Math.PI / 180) * tiltAmount;
          
          gsap.to(this.target, {
            rotation: dynamicRotation,
            duration: 0.1,
            ease: "none"
          });
        },
        
        onRelease: function() {
          // Return to normal scale with bounce
          gsap.to(this.target, {
            scale: selectedFlower.position?.scale || 1,
            duration: 0.4,
            ease: "back.out(2)"
          });
        },
        
        onDragEnd: function() {
          setActiveFlower(null);
          
          // Calculate final rotation with momentum
          const velocityX = this.getVelocity('x');
          const velocityY = this.getVelocity('y');
          const momentum = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
          
          // Apply rotation based on throw direction and force
          const throwAngle = Math.atan2(velocityY, velocityX) * (180 / Math.PI);
          const rotationOffset = Math.sin(throwAngle * Math.PI / 180) * 
            Math.min(momentum * 0.05, 20);
          
          const finalRotation = (selectedFlower.position?.rotation || 0) + rotationOffset;
          
          // Smooth settle animation with elastic bounce
          gsap.to(this.target, {
            rotation: finalRotation,
            duration: 0.8,
            ease: "elastic.out(1, 0.4)"
          });
          
          // Reset z-index after delay
          gsap.to(this.target, {
            zIndex: Object.keys(selectedFlowers).indexOf(flowerId) + 10,
            duration: 0,
            delay: 0.3
          });
          
          // Save position with precision
          const position = {
            x: Math.round(this.x * 100) / 100,
            y: Math.round(this.y * 100) / 100,
            rotation: Math.round(finalRotation * 10) / 10,
            scale: selectedFlower.position?.scale || 1
          };
          
          onFlowerPositionChange?.(flowerId, position);
        }
      })[0];

      if (draggable) {
        newInstances.push(draggable);
      }
    });

    setDraggableInstances(newInstances);
  }, [selectedFlowers, onFlowerPositionChange]);

  // Calculate flower style with smart positioning
  const getFlowerStyle = (flowerId: string, selectedFlower: any) => {
    const basePosition = selectedFlower.position;
    
    // Generate deterministic pseudo-random offsets for initial placement
    const seed = flowerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const randomOffsetX = Math.sin(seed * 13.7) * 30;
    const randomOffsetY = Math.cos(seed * 7.3) * 25;
    
    // Calculate center position with spread
    const centerX = canvasSize.width / 2 + randomOffsetX;
    const centerY = canvasSize.height / 2 + randomOffsetY;
    
    return {
      position: 'absolute' as const,
      left: `${basePosition?.x ?? centerX}px`,
      top: `${basePosition?.y ?? centerY}px`,
      transform: `rotate(${basePosition?.rotation || 0}deg) scale(${basePosition?.scale || 1})`,
      zIndex: Object.keys(selectedFlowers).indexOf(flowerId) + 10,
      cursor: 'grab',
      willChange: 'transform',
      touchAction: 'none',
      // user selection is handled via the `select-none` class on the element
    };
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-sky-50 via-blue-50 to-green-50 rounded-2xl overflow-hidden shadow-2xl">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-200 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-20 w-40 h-40 bg-purple-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-yellow-200 rounded-full blur-3xl"></div>
      </div>

      {/* Canvas Container */}
      <div
        ref={canvasRef}
        className="relative w-full h-full"
        style={{ 
          minHeight: `${canvasSize.height}px`,
          background: `
            radial-gradient(circle at 20% 80%, rgba(147, 197, 253, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(251, 207, 232, 0.15) 0%, transparent 50%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(240, 249, 255, 0.5) 100%)
          `
        }}
      >
        {/* Decorative Vase */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-36 h-44">
          {/* Vase Body */}
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900 via-amber-700 to-amber-500 rounded-t-[3rem] shadow-2xl">
              {/* Vase Highlight */}
              <div className="absolute top-6 left-4 w-2 h-20 bg-amber-300 opacity-40 rounded-full blur-sm"></div>
              {/* Vase Shadow */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-black opacity-10 blur-md rounded-full"></div>
            </div>
            
            {/* Vase Rim */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full shadow-lg border-t-2 border-amber-200"></div>
            
            {/* Inner Vase */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-28 h-36 bg-gradient-to-t from-amber-950 via-amber-800 to-amber-600 rounded-t-[2.5rem] shadow-inner"></div>
          </div>
        </div>

        {/* Selected Flowers */}
        <AnimatePresence mode="popLayout">
          {Object.entries(selectedFlowers).map(([flowerId, selectedFlower], index) => (
            <motion.div
              key={flowerId}
              data-flower-id={flowerId}
              className="absolute select-none"
              style={getFlowerStyle(flowerId, selectedFlower)}
              initial={{ 
                opacity: 0, 
                scale: 0.2,
                rotate: -180,
                y: -60,
                filter: "blur(4px)"
              }}
              animate={{ 
                opacity: 1, 
                scale: selectedFlower.position?.scale || 1,
                rotate: selectedFlower.position?.rotation || 0,
                y: 0,
                filter: "blur(0px)"
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.15,
                rotate: 180,
                y: 60,
                filter: "blur(4px)"
              }}
              transition={{ 
                duration: 0.75, 
                delay: index * 0.08,
                type: "spring",
                stiffness: 100,
                damping: 12
              }}
              whileHover={{ 
                scale: (selectedFlower.position?.scale || 1) * 1.15,
                zIndex: 999,
                transition: { 
                  type: "spring",
                  stiffness: 400,
                  damping: 10
                }
              }}
            >
              {/* Flower Glow Effect */}
              <div className="absolute inset-0 bg-white rounded-full opacity-20 blur-xl scale-150"></div>
              
              {/* Flower Image */}
              <div className="relative">
                <img
                  src={selectedFlower.flower.imageUrl}
                  alt={selectedFlower.flower.name}
                  className="w-20 h-20 object-contain pointer-events-none"
                  draggable={false}
                  style={{
                    filter: `
                      drop-shadow(0 4px 8px rgba(0,0,0,0.2)) 
                      drop-shadow(0 2px 4px rgba(0,0,0,0.15))
                      brightness(${activeFlower === flowerId ? 1.1 : 1})
                    `,
                    imageRendering: 'auto'
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const emojiDiv = document.createElement('div');
                    emojiDiv.className = 'w-20 h-20 flex items-center justify-center text-5xl bg-gradient-to-br from-white to-pink-50 rounded-full shadow-xl';
                    emojiDiv.textContent = '🌸';
                    target.parentNode?.appendChild(emojiDiv);
                  }}
                />
              </div>
              
              {/* Quantity Badge */}
              {selectedFlower.quantity > 1 && (
                <motion.div
                  className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg ring-2 ring-white"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: 0.3 + index * 0.1,
                    type: "spring",
                    stiffness: 500,
                    damping: 15
                  }}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                >
                  {selectedFlower.quantity}
                </motion.div>
              )}
              
              {/* Flower Name Tooltip */}
              <motion.div 
                className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-slate-900 to-slate-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl"
                initial={{ y: -5 }}
                whileHover={{ y: 0 }}
              >
                <div className="font-medium">{selectedFlower.flower.name}</div>
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {Object.keys(selectedFlowers).length === 0 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: 0.3,
              duration: 0.6,
              ease: "easeOut"
            }}
          >
            <div className="text-center">
              <motion.div 
                className="text-8xl mb-6"
                animate={{ 
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                🌸
              </motion.div>
              <h3 className="text-2xl font-bold text-slate-700 mb-3 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Create Your Bouquet
              </h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                Select flowers from the collection and drag them to arrange your perfect bouquet
              </p>
            </div>
          </motion.div>
        )}

        {/* Drag Helper */}
        {activeFlower && (
          <motion.div
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-xs font-medium text-slate-600"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            🎯 Drag to position
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BouquetCanvas;