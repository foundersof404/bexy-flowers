import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SelectedFlower } from '@/types/bouquet';

interface Premium2DBouquetCanvasProps {
  selectedFlowers: Record<string, SelectedFlower>;
  canvasSize: {
    width: number;
    height: number;
  };
  onFlowerPositionChange?: (flowerId: string, position: SelectedFlower['position']) => void;
}

const Premium2DBouquetCanvas: React.FC<Premium2DBouquetCanvasProps> = ({
  selectedFlowers,
  canvasSize,
  onFlowerPositionChange
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedFlower, setDraggedFlower] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Handle flower drag start
  const handleMouseDown = (e: React.MouseEvent, flowerId: string) => {
    e.preventDefault();
    const flower = selectedFlowers[flowerId];
    if (!flower) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDraggedFlower(flowerId);
    setDragOffset({
      x: e.clientX - rect.left - (flower.position?.x || 0),
      y: e.clientY - rect.top - (flower.position?.y || 0)
    });
  };

  // Handle flower drag
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedFlower || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;

    // Constrain to canvas bounds
    const constrainedX = Math.max(0, Math.min(newX, canvasSize.width - 80));
    const constrainedY = Math.max(0, Math.min(newY, canvasSize.height - 120));

    onFlowerPositionChange?.(draggedFlower, {
      ...selectedFlowers[draggedFlower].position,
      x: constrainedX,
      y: constrainedY
    });
  };

  // Handle drag end
  const handleMouseUp = () => {
    setDraggedFlower(null);
    setDragOffset({ x: 0, y: 0 });
  };

  // Add global mouse events for dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!draggedFlower || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - dragOffset.x;
      const newY = e.clientY - rect.top - dragOffset.y;

      const constrainedX = Math.max(0, Math.min(newX, canvasSize.width - 80));
      const constrainedY = Math.max(0, Math.min(newY, canvasSize.height - 120));

      onFlowerPositionChange?.(draggedFlower, {
        ...selectedFlowers[draggedFlower].position,
        x: constrainedX,
        y: constrainedY
      });
    };

    const handleGlobalMouseUp = () => {
      setDraggedFlower(null);
      setDragOffset({ x: 0, y: 0 });
    };

    if (draggedFlower) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [draggedFlower, dragOffset, selectedFlowers, canvasSize, onFlowerPositionChange]);

  const selectedFlowersArray = Object.values(selectedFlowers);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-sky-100 to-green-50 rounded-3xl overflow-hidden shadow-2xl">
      {/* Canvas Container */}
      <div
        ref={canvasRef}
        className="relative w-full h-full cursor-crosshair"
        style={{ 
          minHeight: `${canvasSize.height}px`,
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(240, 248, 255, 0.6) 100%)
          `
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Base Vase/Container */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          <div className="w-32 h-40 relative">
            {/* Vase Body */}
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-amber-800 via-amber-600 to-amber-400 rounded-t-3xl shadow-lg border-4 border-amber-200">
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-24 h-28 bg-gradient-to-t from-amber-900 via-amber-700 to-amber-500 rounded-t-2xl"></div>
            </div>
            {/* Vase Neck */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-gradient-to-b from-amber-600 to-amber-400 rounded-t-2xl"></div>
          </div>
        </div>

        {/* Flower Images */}
        <AnimatePresence>
          {selectedFlowersArray.map((selectedFlower, index) => (
            <motion.div
              key={selectedFlower.flower.id}
              className="absolute select-none cursor-move"
              style={{
                left: `${selectedFlower.position?.x || Math.random() * (canvasSize.width - 80)}px`,
                top: `${selectedFlower.position?.y || Math.random() * (canvasSize.height - 120)}px`,
                zIndex: index + 10,
                transform: `rotate(${selectedFlower.position?.rotation || 0}deg) scale(${selectedFlower.position?.scale || 1})`,
              }}
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
              onMouseDown={(e) => handleMouseDown(e, selectedFlower.flower.id)}
              drag={false} // We handle dragging manually
            >
              {/* Flower Image Container */}
              <div className="relative">
                {/* Flower Image */}
                <div className="w-20 h-20 relative">
                  <img
                    src={selectedFlower.flower.imageUrl}
                    alt={selectedFlower.flower.name}
                    className="w-full h-full object-contain drop-shadow-lg filter brightness-110"
                    draggable={false}
                    onError={(e) => {
                      // Fallback to colored circle if image fails
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg" 
                               style="background: linear-gradient(135deg, ${
                                 selectedFlower.flower.name.toLowerCase().includes('red') ? '#ff6b6b, #ff5252' :
                                 selectedFlower.flower.name.toLowerCase().includes('white') ? '#ffffff, #f8f9fa' :
                                 selectedFlower.flower.name.toLowerCase().includes('pink') ? '#ff69b4, #ff1493' :
                                 '#ff8e8e, #ff6b6b'
                               })">
                            ${selectedFlower.flower.name.charAt(0)}
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
                
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

                {/* Drag Indicator */}
                {draggedFlower === selectedFlower.flower.id && (
                  <div className="absolute inset-0 border-2 border-dashed border-amber-400 rounded-lg pointer-events-none"></div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {selectedFlowersArray.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-8xl mb-6">🌸</div>
              <h3 className="text-2xl font-bold text-slate-700 mb-2">Start Building</h3>
              <p className="text-slate-500 max-w-sm">
                Select flowers from the panel to add them to your canvas
              </p>
            </motion.div>
          </div>
        )}
      </div>

      {/* Canvas Info Overlay */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
        <div className="bg-white/90 backdrop-blur-xl px-4 py-2 rounded-2xl shadow-lg">
          <p className="text-sm font-medium text-slate-700">2D Canvas</p>
          <p className="text-xs text-slate-500">Drag flowers to arrange</p>
        </div>
        
        {selectedFlowersArray.length > 0 && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-2xl shadow-lg">
            <p className="text-sm font-bold">
              {selectedFlowersArray.reduce((sum, item) => sum + item.quantity, 0)} Flowers
            </p>
          </div>
        )}
      </div>

      {/* Quality Badge */}
      <div className="absolute bottom-6 left-6">
        <div className="bg-white/90 backdrop-blur-xl px-3 py-2 rounded-xl shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-xs font-medium text-slate-700">Premium Quality</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium2DBouquetCanvas;

