import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { FlyingHeartContainer } from '@/components/FlyingHeartAnimation';

interface FlyingHeartConfig {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface FlyingHeartContextType {
  triggerFlyingHeart: (startX: number, startY: number, endX: number, endY: number) => void;
  navHeartPulse: boolean;
  setNavHeartPulse: (value: boolean) => void;
}

const FlyingHeartContext = createContext<FlyingHeartContextType | undefined>(undefined);

interface FlyingHeartProviderProps {
  children: ReactNode;
}

export const FlyingHeartProvider: React.FC<FlyingHeartProviderProps> = ({ children }) => {
  const [flyingHearts, setFlyingHearts] = useState<FlyingHeartConfig[]>([]);
  const [navHeartPulse, setNavHeartPulse] = useState(false);

  const triggerFlyingHeart = useCallback((startX: number, startY: number, endX: number, endY: number) => {
    // Add the flying heart
    setFlyingHearts(prev => [...prev, { startX, startY, endX, endY }]);

    // Trigger navbar heart pulse after animation completes
    setTimeout(() => {
      setNavHeartPulse(true);
      setTimeout(() => {
        setNavHeartPulse(false);
      }, 600);
    }, 800);

    // Remove the flying heart after animation completes
    setTimeout(() => {
      setFlyingHearts(prev => {
        if (prev.length > 0) {
          return prev.slice(1); // Remove first heart
        }
        return prev;
      });
    }, 1100);
  }, []);

  const removeFlyingHeart = useCallback((index: number) => {
    setFlyingHearts(prev => prev.filter((_, i) => i !== index));
  }, []);

  const value: FlyingHeartContextType = {
    triggerFlyingHeart,
    navHeartPulse,
    setNavHeartPulse
  };

  return (
    <FlyingHeartContext.Provider value={value}>
      {children}
      <FlyingHeartContainer 
        flyingHearts={flyingHearts} 
        onComplete={removeFlyingHeart} 
      />
    </FlyingHeartContext.Provider>
  );
};

export const useFlyingHeart = (): FlyingHeartContextType => {
  const context = useContext(FlyingHeartContext);
  if (context === undefined) {
    throw new Error('useFlyingHeart must be used within a FlyingHeartProvider');
  }
  return context;
};

