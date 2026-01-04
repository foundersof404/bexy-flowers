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
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // ⚡ PERFORMANCE: Optimize build for scalability
    target: 'esnext',
    minify: 'esbuild', // Faster than terser
    cssMinify: true,
    sourcemap: false, // Disable in production for smaller bundles
    rollupOptions: {
      output: {
        // ⚡ PERFORMANCE: Manual chunking for better caching and parallel loading
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            // React and React DOM
            if (id.includes('react') || id.includes('react-dom')) {
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
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'framer-motion',
    ],
    exclude: ['@react-three/fiber', '@react-three/drei'], // Exclude heavy 3D libs from pre-bundling
  },
}));
