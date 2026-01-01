import React from 'react';
import { useEnhancedRoutePrefetch } from '@/hooks/useEnhancedRoutePrefetch';
import { useRouteState } from '@/contexts/RouteStateContext';
import type { ReactNode, MouseEvent } from 'react';

interface PrefetchLinkProps {
  to: string;
  children: ReactNode;
  state?: any;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  prefetchDelay?: number;
  replace?: boolean;
  preserveScroll?: boolean;
}

/**
 * Optimized link component with route prefetching and state management
 * Prefetches routes on hover for instant navigation
 */
export const PrefetchLink: React.FC<PrefetchLinkProps> = ({
  to,
  children,
  state,
  className,
  onClick,
  prefetchDelay = 100,
  replace = false,
  preserveScroll = false,
}) => {
  const { handlePrefetch, cancelPrefetch, navigate } = useEnhancedRoutePrefetch();
  const { navigateWithState } = useRouteState();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (onClick) {
      onClick(e);
    }

    if (!e.defaultPrevented) {
      navigateWithState(to, state, { replace, preserveScroll });
    }
  };

  const handleMouseEnter = () => {
    handlePrefetch(to, prefetchDelay);
  };

  const handleMouseLeave = () => {
    cancelPrefetch();
  };

  return (
    <a
      href={to}
      className={className}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // Prefetch hint for browsers
      data-prefetch="true"
    >
      {children}
    </a>
  );
};

