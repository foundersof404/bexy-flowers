import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // Proxy Netlify Functions in development
      // When running `npm run dev`, try to proxy to Netlify Dev if running
      // Otherwise, this will fail gracefully and show a helpful error
      '/.netlify/functions': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Force React to use a single instance (fixes createContext undefined errors)
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      // Force react-reconciler to use the correct version with ConcurrentRoot export
      "react-reconciler": path.resolve(__dirname, "./node_modules/react-reconciler"),
      // Force scheduler to use the correct version compatible with React 18.3.1
      "scheduler": path.resolve(__dirname, "./node_modules/scheduler"),
    },
    dedupe: ['react', 'react-dom'], // Deduplicate React instances
  },
  build: {
    // ⚡ PERFORMANCE: Optimize build for scalability
    target: 'esnext',
    minify: 'esbuild', // Faster than terser
    cssMinify: true,
    sourcemap: false, // Disable in production for smaller bundles
    // Fix CommonJS module resolution for stats.js used by @react-three/drei
    commonjsOptions: {
      // Transform CommonJS to ES modules for better compatibility
      transformMixedEsModules: true,
      include: [/node_modules\/stats\.js/],
    },
    rollupOptions: {
      output: {
        // ⚡ PERFORMANCE: Manual chunking for better caching and parallel loading
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            // React and React DOM - ensure single instance
            if (id.includes('react') && !id.includes('react-dom') && !id.includes('react-router') && !id.includes('react-')) {
              return 'react-vendor';
            }
            if (id.includes('react-dom')) {
              return 'react-vendor';
            }
            // React Router
            if (id.includes('react-router')) {
              return 'router-vendor';
            }
            // React Query
            if (id.includes('@tanstack/react-query')) {
              return 'query-vendor';
            }
            // Framer Motion
            if (id.includes('framer-motion')) {
              return 'animation-vendor';
            }
            // Three.js and 3D libraries
            if (id.includes('three') || id.includes('@react-three')) {
              return '3d-vendor';
            }
            // GSAP
            if (id.includes('gsap')) {
              return 'gsap-vendor';
            }
            // UI libraries (Radix, etc.)
            if (id.includes('@radix-ui') || id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            // Other large vendors
            return 'vendor';
          }
          // Admin pages chunk (rarely accessed)
          if (id.includes('/admin/')) {
            return 'admin';
          }
        },
        // ⚡ PERFORMANCE: Optimize chunk file names for better caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // ⚡ PERFORMANCE: Increase chunk size warning limit (we're using manual chunks)
    chunkSizeWarningLimit: 1000,
    // ⚡ PERFORMANCE: Enable tree shaking
    treeshake: {
      moduleSideEffects: false,
    },
  },
  // ⚡ PERFORMANCE: Optimize dependencies pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react/jsx-runtime',
      'react-dom',
      'react-dom/client',
      'react-router-dom',
      '@tanstack/react-query',
      'framer-motion',
      'react-reconciler', // Force include to ensure correct version
      'scheduler', // Force include to ensure correct version
    ],
    exclude: ['@react-three/fiber', '@react-three/drei'], // Exclude heavy 3D libs from pre-bundling
    // Note: force: true removed - it's too slow. Use only when dependencies change.
    // If you encounter module resolution issues, temporarily set force: true
    esbuildOptions: {
      // Handle CommonJS modules like stats.js properly
      format: 'esm',
      jsx: 'automatic', // Use automatic JSX runtime
    },
  },
}));
