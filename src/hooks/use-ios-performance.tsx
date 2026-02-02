import { useState, useEffect } from 'react';
import { getIOSVersion, isOldIOS, needsPerformanceOptimizations } from '@/utils/performance';

/**
 * Hook to detect iOS version and determine if performance optimizations are needed
 * Returns:
 * - iosVersion: The iOS version number (e.g., 18, 19) or null if not iOS
 * - isOldIOS: Whether the device is running iOS 18 or below
 * - needsOptimizations: Whether performance optimizations should be applied
 */
export function useIOSPerformance() {
  const [iosVersion, setIOSVersion] = useState<number | null>(null);
  const [isOldIOSDevice, setIsOldIOSDevice] = useState(false);
  const [needsOptimizations, setNeedsOptimizations] = useState(false);

  useEffect(() => {
    const version = getIOSVersion();
    const isOld = isOldIOS();
    const needsOpt = needsPerformanceOptimizations();

    setIOSVersion(version);
    setIsOldIOSDevice(isOld);
    setNeedsOptimizations(needsOpt);
  }, []);

  return {
    iosVersion,
    isOldIOS: isOldIOSDevice,
    needsOptimizations: needsOptimizations,
  };
}
