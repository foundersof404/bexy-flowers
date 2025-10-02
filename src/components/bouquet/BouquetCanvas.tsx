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

  // Clear draggable instances when component unmounts or flowers change
  useEffect(() => {
    return () => {
      draggableInstances.forEach(instance => instance.kill());
    };
  }, [draggableInstances]);

  // Setup draggable functionality for each flower
  useEffect(() => {
    if (!canvasRef.current || typeof window === 'undefined') return;

    const newInstances: Draggable[] = [];

    Object.entries(selectedFlowers).forEach(([flowerId, selectedFlower]) => {
      const flowerElement = canvasRef.current?.querySelector(`[data-flower-id="${flowerId}"]`) as HTMLElement;
      
      if (flowerElement) {
        const draggable = Draggable.create(flowerElement, {
          type: "x,y",
          bounds: canvasRef.current,
          inertia: true,
          onDragEnd: function() {
            const position = {
              x: this.x,
              y: this.y,
              rotation: selectedFlower.position?.rotation || 0,
              scale: selectedFlower.position?.scale || 1
            };
            onFlowerPositionChange?.(flowerId, position);
          }
        })[0];

        if (draggable) {
          newInstances.push(draggable);
        }
      }
    });

    setDraggableInstances(newInstances);
  }, [selectedFlowers, onFlowerPositionChange]);

  const getFlowerStyle = (flowerId: string, selectedFlower: any) => {
    const basePosition = selectedFlower.position || { x: 0, y: 0, rotation: 0, scale: 1 };
    
    return {
      position: 'absolute' as const,
      left: `${basePosition.x}px`,
      top: `${basePosition.y}px`,
      transform: `rotate(${basePosition.rotation || 0}deg) scale(${basePosition.scale || 1})`,
      zIndex: Object.keys(selectedFlowers).indexOf(flowerId) + 10,
      cursor: 'move',
      transition: 'transform 0.2s ease-out'
    };
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-sky-100 to-green-50 rounded-2xl overflow-hidden shadow-inner">
      {/* Canvas Container */}
      <div
        ref={canvasRef}
        className="relative w-full h-full"
        style={{ 
          minHeight: `${canvasSize.height}px`,
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(240, 248, 255, 0.6) 100%)
          `
        }}
      >
        {/* Base Vase/Container */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-40">
          <div className="w-full h-full bg-gradient-to-t from-amber-800 via-amber-600 to-amber-400 rounded-t-3xl shadow-lg border-4 border-amber-200">
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-24 h-32 bg-gradient-to-t from-amber-900 via-amber-700 to-amber-500 rounded-t-2xl"></div>
          </div>
        </div>

        {/* Selected Flowers */}
        <AnimatePresence>
          {Object.entries(selectedFlowers).map(([flowerId, selectedFlower], index) => (
            <motion.div
              key={flowerId}
              data-flower-id={flowerId}
              className="absolute select-none"
              style={getFlowerStyle(flowerId, selectedFlower)}
              initial={{ 
                opacity: 0, 
                scale: 0.5, 
                y: 20 
              }}
              animate={{ 
                opacity: 1, 
                scale: selectedFlower.position?.scale || 1, 
                y: 0 
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.3, 
                y: -20 
              }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "backOut" 
              }}
              whileHover={{ 
                scale: (selectedFlower.position?.scale || 1) * 1.1,
                zIndex: 100 
              }}
              whileTap={{ 
                scale: (selectedFlower.position?.scale || 1) * 0.95 
              }}
            >
              {/* Flower Image */}
              <img
                src={selectedFlower.flower.imageUrl}
                alt={selectedFlower.flower.name}
                className="w-16 h-16 object-contain drop-shadow-lg"
                draggable={false}
                onError={(e) => {
                  // Fallback to emoji if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const emojiDiv = document.createElement('div');
                  emojiDiv.className = 'w-16 h-16 flex items-center justify-center text-4xl bg-white/80 rounded-full shadow-lg';
                  emojiDiv.textContent = '🌸';
                  target.parentNode?.appendChild(emojiDiv);
                }}
              />
              
              {/* Quantity Badge */}
              {selectedFlower.quantity > 1 && (
                <motion.div
                  className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {selectedFlower.quantity}
                </motion.div>
              )}
              
              {/* Flower Name Tooltip */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {selectedFlower.flower.name}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Canvas Instructions */}
        {Object.keys(selectedFlowers).length === 0 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-center text-slate-500">
              <div className="text-6xl mb-4">🌸</div>
              <p className="text-lg font-medium mb-2">Start Building Your Bouquet</p>
              <p className="text-sm">Select flowers from the panel to add them to your canvas</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BouquetCanvas;

