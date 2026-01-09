import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';

interface PriceDisplayProps {
  price: number;
  discountPercentage?: number | null;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  showDiscountBadge?: boolean;
  className?: string;
}

/**
 * Beautiful price display component with discount support
 * Shows old price, new price, and discount badge in an elegant way
 */
export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  discountPercentage,
  currency = '€',
  size = 'md',
  showDiscountBadge = true,
  className = '',
}) => {
  const hasDiscount = discountPercentage && discountPercentage > 0;
  const finalPrice = hasDiscount 
    ? price * (1 - discountPercentage / 100)
    : price;

  const sizeClasses = {
    sm: {
      original: 'text-xs',
      final: 'text-sm',
      badge: 'text-[9px] px-1.5 py-0.5',
      savings: 'text-[10px]'
    },
    md: {
      original: 'text-sm',
      final: 'text-lg',
      badge: 'text-xs px-2 py-1',
      savings: 'text-xs'
    },
    lg: {
      original: 'text-base',
      final: 'text-2xl',
      badge: 'text-sm px-2.5 py-1',
      savings: 'text-sm'
    }
  };

  const classes = sizeClasses[size];

  if (!hasDiscount) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className={`${classes.final} font-bold text-foreground`}>
          {currency}{price.toFixed(0)}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {/* Discount Badge */}
      {showDiscountBadge && (
        <div className="flex items-center gap-2">
          <Badge 
            className={`${classes.badge} bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-md border-0`}
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
            }}
          >
            <Tag className="w-3 h-3 mr-1" />
            {discountPercentage}% OFF
          </Badge>
          <span className={`${classes.savings} text-green-600 font-semibold`}>
            Save {currency}{(price - finalPrice).toFixed(0)}
          </span>
        </div>
      )}

      {/* Price Display */}
      <div className="flex items-baseline gap-2">
        {/* New Price - Prominent */}
        <span 
          className={`${classes.final} font-bold text-red-600`}
          style={{
            textShadow: '0 1px 2px rgba(239, 68, 68, 0.1)'
          }}
        >
          {currency}{finalPrice.toFixed(0)}
        </span>
        
        {/* Old Price - Strikethrough with beautiful styling */}
        <span 
          className={`${classes.original} text-gray-400 line-through font-medium`}
          style={{
            opacity: 0.7,
            textDecorationThickness: '1.5px',
            textDecorationColor: '#9ca3af'
          }}
        >
          {currency}{price.toFixed(0)}
        </span>
      </div>

      {/* Savings Message */}
      <p className={`${classes.savings} text-gray-600 italic`}>
        Was {currency}{price.toFixed(0)}, now {currency}{finalPrice.toFixed(0)}
      </p>
    </div>
  );
};

export default PriceDisplay;



