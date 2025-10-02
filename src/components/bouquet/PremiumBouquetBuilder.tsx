import React, { useState, useReducer, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { BouquetBuilderProps, BouquetState, SelectedFlower, Flower, PreDesignedBouquet } from '@/types/bouquet';
import { flowers, preDesignedBouquets } from '@/data/flowers';
import Premium2DBouquetCanvas from './Premium2DBouquetCanvas';
import PremiumFlowerSelector from './PremiumFlowerSelector';
import PremiumBouquetSummary from './PremiumBouquetSummary';
import PreDesignedBouquets from './PreDesignedBouquets';
import PremiumProgressBar from './PremiumProgressBar';

// Action types for reducer
type BouquetAction =
  | { type: 'ADD_FLOWER'; payload: { flower: Flower; position?: SelectedFlower['position'] } }
  | { type: 'REMOVE_FLOWER'; payload: { flowerId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { flowerId: string; quantity: number } }
  | { type: 'CLEAR_ALL' }
  | { type: 'LOAD_PREDESIGNED'; payload: { bouquet: PreDesignedBouquet } }
  | { type: 'UPDATE_FLOWER_POSITION'; payload: { flowerId: string; position: SelectedFlower['position'] } };

// Reducer for bouquet state management
const bouquetReducer = (state: BouquetState, action: BouquetAction): BouquetState => {
  switch (action.type) {
    case 'ADD_FLOWER': {
      const { flower, position } = action.payload;
      const existingFlower = state.selectedFlowers[flower.id];
      
      if (existingFlower) {
        // Update quantity if flower already exists
        const updatedFlower = {
          ...existingFlower,
          quantity: existingFlower.quantity + 1
        };
        return {
          ...state,
          selectedFlowers: {
            ...state.selectedFlowers,
            [flower.id]: updatedFlower
          },
          totalPrice: Object.values({
            ...state.selectedFlowers,
            [flower.id]: updatedFlower
          }).reduce((sum, item) => sum + (item.flower.price * item.quantity), 0)
        };
      } else {
        // Add new flower with 2D pixel positioning
        const newFlower: SelectedFlower = {
          flower,
          quantity: 1,
          position: position || {
            x: Math.random() * (state.canvasSize.width - 80) + 40, // Pixel coordinates
            y: Math.random() * (state.canvasSize.height - 120) + 60, // Pixel coordinates
            rotation: (Math.random() - 0.5) * 30,
            scale: 0.8 + Math.random() * 0.4
          }
        };
        
        const updatedFlowers = {
          ...state.selectedFlowers,
          [flower.id]: newFlower
        };
        
        return {
          ...state,
          selectedFlowers: updatedFlowers,
          totalPrice: Object.values(updatedFlowers).reduce((sum, item) => sum + (item.flower.price * item.quantity), 0)
        };
      }
    }
    
    case 'REMOVE_FLOWER': {
      const { flowerId } = action.payload;
      const updatedFlowers = { ...state.selectedFlowers };
      delete updatedFlowers[flowerId];
      
      return {
        ...state,
        selectedFlowers: updatedFlowers,
        totalPrice: Object.values(updatedFlowers).reduce((sum, item) => sum + (item.flower.price * item.quantity), 0)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { flowerId, quantity } = action.payload;
      if (quantity <= 0) {
        return bouquetReducer(state, { type: 'REMOVE_FLOWER', payload: { flowerId } });
      }
      
      const updatedFlower = {
        ...state.selectedFlowers[flowerId],
        quantity
      };
      
      const updatedFlowers = {
        ...state.selectedFlowers,
        [flowerId]: updatedFlower
      };
      
      return {
        ...state,
        selectedFlowers: updatedFlowers,
        totalPrice: Object.values(updatedFlowers).reduce((sum, item) => sum + (item.flower.price * item.quantity), 0)
      };
    }
    
    case 'CLEAR_ALL': {
      return {
        ...state,
        selectedFlowers: {},
        totalPrice: 0
      };
    }
    
    case 'LOAD_PREDESIGNED': {
      const { bouquet } = action.payload;
      const selectedFlowers: Record<string, SelectedFlower> = {};
      
      bouquet.flowers.forEach(flowerItem => {
        const flower = flowers.find(f => f.id === flowerItem.flowerId);
        if (flower) {
          selectedFlowers[flower.id] = {
            flower,
            quantity: flowerItem.quantity,
            position: flowerItem.position || {
              x: Math.random() * (state.canvasSize.width - 80) + 40, // Pixel coordinates
              y: Math.random() * (state.canvasSize.height - 120) + 60, // Pixel coordinates
              rotation: (Math.random() - 0.5) * 30,
              scale: 0.8 + Math.random() * 0.4
            }
          };
        }
      });
      
      return {
        ...state,
        selectedFlowers,
        totalPrice: Object.values(selectedFlowers).reduce((sum, item) => sum + (item.flower.price * item.quantity), 0)
      };
    }
    
    case 'UPDATE_FLOWER_POSITION': {
      const { flowerId, position } = action.payload;
      if (state.selectedFlowers[flowerId]) {
        return {
          ...state,
          selectedFlowers: {
            ...state.selectedFlowers,
            [flowerId]: {
              ...state.selectedFlowers[flowerId],
              position
            }
          }
        };
      }
      return state;
    }
    
    default:
      return state;
  }
};

const PremiumBouquetBuilder: React.FC<BouquetBuilderProps> = ({
  onOrder,
  initialBouquet
}) => {
  const [activeTab, setActiveTab] = useState<'flowers' | 'premade'>('flowers');
  const [currentStep, setCurrentStep] = useState(1);
  
  // Initial state
  const initialState: BouquetState = {
    selectedFlowers: initialBouquet?.selectedFlowers || {},
    totalPrice: initialBouquet?.totalPrice || 0,
    canvasSize: initialBouquet?.canvasSize || { width: 400, height: 500 }
  };
  
  const [state, dispatch] = useReducer(bouquetReducer, initialState);

  // Update step based on state
  React.useEffect(() => {
    if (Object.keys(state.selectedFlowers).length > 0) {
      setCurrentStep(2); // Customize step
    } else {
      setCurrentStep(1); // Choose flowers step
    }
  }, [state.selectedFlowers]);

  // Event handlers
  const handleFlowerSelect = useCallback((flower: Flower) => {
    dispatch({ type: 'ADD_FLOWER', payload: { flower } });
    toast.success(`${flower.name} added to bouquet!`);
  }, []);

  const handleQuantityChange = useCallback((flowerId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { flowerId, quantity } });
  }, []);

  const handleFlowerRemove = useCallback((flowerId: string) => {
    const flower = state.selectedFlowers[flowerId];
    dispatch({ type: 'REMOVE_FLOWER', payload: { flowerId } });
    if (flower) {
      toast.success(`${flower.flower.name} removed from bouquet`);
    }
  }, [state.selectedFlowers]);

  const handleClearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
    toast.success('Bouquet cleared!');
  }, []);

  const handlePreDesignedSelect = useCallback((bouquet: PreDesignedBouquet) => {
    dispatch({ type: 'LOAD_PREDESIGNED', payload: { bouquet } });
    toast.success(`${bouquet.name} loaded! You can now customize it.`);
    setActiveTab('flowers'); // Switch to flowers tab after loading
  }, []);

  const handleFlowerPositionChange = useCallback((flowerId: string, position: SelectedFlower['position']) => {
    dispatch({ type: 'UPDATE_FLOWER_POSITION', payload: { flowerId, position } });
  }, []);

  const handleOrder = useCallback(() => {
    if (Object.keys(state.selectedFlowers).length === 0) {
      toast.error('Please add some flowers to your bouquet first!');
      return;
    }
    
    setCurrentStep(3); // Checkout step
    onOrder?.(state);
    toast.success('Order placed successfully! 🎉');
  }, [state, onOrder]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 text-sm font-semibold mb-6 shadow-lg">
            <span>✨</span>
            <span>Premium Bouquet Designer</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent mb-6 leading-tight">
            Create Your Perfect
            <br />
            <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Floral Arrangement
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Design a custom bouquet with our premium collection of handpicked flowers. 
            Every arrangement is crafted with love and attention to detail.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <PremiumProgressBar currentStep={currentStep} />

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Section - 3D Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Premium2DBouquetCanvas
              selectedFlowers={state.selectedFlowers}
              canvasSize={state.canvasSize}
              onFlowerPositionChange={handleFlowerPositionChange}
            />
          </motion.div>

          {/* Right Section - Controls */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'flowers' | 'premade')}>
              <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-1 shadow-lg">
                <TabsTrigger 
                  value="flowers" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold"
                >
                  Choose Flowers
                </TabsTrigger>
                <TabsTrigger 
                  value="premade"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold"
                >
                  Pre-Designed
                </TabsTrigger>
              </TabsList>

              <TabsContent value="flowers" className="mt-8">
                <PremiumFlowerSelector
                  flowers={flowers}
                  onFlowerSelect={handleFlowerSelect}
                  selectedCount={Object.keys(state.selectedFlowers).length}
                />
              </TabsContent>

              <TabsContent value="premade" className="mt-8">
                <PreDesignedBouquets
                  bouquets={preDesignedBouquets}
                  onBouquetSelect={handlePreDesignedSelect}
                />
              </TabsContent>
            </Tabs>

            {/* Summary Panel */}
            <PremiumBouquetSummary
              selectedFlowers={state.selectedFlowers}
              totalPrice={state.totalPrice}
              onQuantityChange={handleQuantityChange}
              onFlowerRemove={handleFlowerRemove}
              onOrder={handleOrder}
              onClearAll={handleClearAll}
            />
          </motion.div>
        </div>

        {/* Luxury Stats */}
        <motion.div
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="text-center p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-slate-200/50 shadow-lg">
            <div className="text-4xl mb-4">🌸</div>
            <div className="text-3xl font-bold text-slate-800 mb-2">
              {Object.values(state.selectedFlowers).reduce((sum, item) => sum + item.quantity, 0)}
            </div>
            <div className="text-slate-600 font-medium">Total Flowers</div>
          </div>
          
          <div className="text-center p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-slate-200/50 shadow-lg">
            <div className="text-4xl mb-4">🌹</div>
            <div className="text-3xl font-bold text-slate-800 mb-2">
              {Object.keys(state.selectedFlowers).length}
            </div>
            <div className="text-slate-600 font-medium">Flower Types</div>
          </div>
          
          <div className="text-center p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-slate-200/50 shadow-lg">
            <div className="text-4xl mb-4">💰</div>
            <div className="text-3xl font-bold text-slate-800 mb-2">
              ${state.totalPrice.toFixed(2)}
            </div>
            <div className="text-slate-600 font-medium">Total Price</div>
          </div>
          
          <div className="text-center p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-slate-200/50 shadow-lg">
            <div className="text-4xl mb-4">🚚</div>
            <div className="text-3xl font-bold text-slate-800 mb-2">Free</div>
            <div className="text-slate-600 font-medium">Delivery</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumBouquetBuilder;
