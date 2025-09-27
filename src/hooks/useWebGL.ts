import { useState, useEffect, useCallback } from 'react';

interface WebGLStatus {
  supported: boolean;
  contextLost: boolean;
  error: Error | null;
}

export function useWebGL() {
  const [status, setStatus] = useState<WebGLStatus>({
    supported: true,
    contextLost: false,
    error: null
  });

  const checkWebGLSupport = useCallback(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        throw new Error('WebGL not supported');
      }

      // Test basic WebGL functionality
      const program = gl.createProgram();
      if (!program) {
        throw new Error('WebGL program creation failed');
      }
      gl.deleteProgram(program);

      setStatus(prev => ({ ...prev, supported: true, error: null }));
      return true;
    } catch (error) {
      setStatus(prev => ({ 
        ...prev, 
        supported: false, 
        error: error as Error 
      }));
      return false;
    }
  }, []);

  const handleContextLoss = useCallback((event: Event) => {
    event.preventDefault();
    setStatus(prev => ({ ...prev, contextLost: true }));
    console.warn('WebGL context lost, attempting recovery...');
  }, []);

  const handleContextRestore = useCallback(() => {
    setStatus(prev => ({ ...prev, contextLost: false }));
    console.log('WebGL context restored');
  }, []);

  const setupContextLossHandling = useCallback((canvas: HTMLCanvasElement) => {
    canvas.addEventListener('webglcontextlost', handleContextLoss);
    canvas.addEventListener('webglcontextrestored', handleContextRestore);
    
    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLoss);
      canvas.removeEventListener('webglcontextrestored', handleContextRestore);
    };
  }, [handleContextLoss, handleContextRestore]);

  useEffect(() => {
    checkWebGLSupport();
  }, [checkWebGLSupport]);

  return {
    ...status,
    checkWebGLSupport,
    setupContextLossHandling,
    isReady: status.supported && !status.contextLost
  };
}
