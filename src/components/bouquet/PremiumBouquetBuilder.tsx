import React, { useState, useReducer, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { BouquetBuilderProps, BouquetState } from '@/types/bouquet';
import PremiumProgressBar from './PremiumProgressBar';

// Action types for reducer
type BouquetAction =
  | { type: 'CLEAR_ALL' }
  | { type: 'UPDATE_FLOWER_POSITION'; payload: { flowerId: string; position: any } };

// Reducer for bouquet state management
const bouquetReducer = (state: BouquetState, action: BouquetAction): BouquetState => {
  switch (action.type) {
    case 'CLEAR_ALL': {
      return {
        ...state,
        selectedFlowers: {},
        totalPrice: 0
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
  const [currentStep, setCurrentStep] = useState(1);
  
  // Initial state
  const initialState: BouquetState = {
    selectedFlowers: initialBouquet?.selectedFlowers || {},
    totalPrice: initialBouquet?.totalPrice || 0,
    canvasSize: initialBouquet?.canvasSize || { width: 400, height: 400 }
  };
  
  const [state, dispatch] = useReducer(bouquetReducer, initialState);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-amber-50 to-yellow-50 py-8 px-4 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 text-sm font-semibold mb-6 shadow-lg">
            <span>✨</span>
            <span>Premium Bouquet Designer</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent mb-6 leading-tight">
            Create Your Perfect
            <br />
            <span className="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
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
      </div>
    </div>
  );
};

export default PremiumBouquetBuilder;