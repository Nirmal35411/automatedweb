import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // Base public path when served in development or production
  base: './',
  
  // Build configuration
  build: {
    // Output directory for production build
    outDir: 'dist',
    // Generate sourcemaps for production build
    sourcemap: false,
    // Minify using esbuild (faster than terser)
    minify: 'esbuild',
    // Target browsers
    target: 'es2015',
    // Disable CSS code splitting for simpler deployment
    cssCodeSplit: true,
    // Rollup options
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: undefined,
        // Asset file names
        assetFileNames: 'assets/[name]-[hash][extname]',
        // Chunk file names
        chunkFileNames: 'assets/[name]-[hash].js',
        // Entry file names
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
  
  // Development server configuration
  server: {
    port: 3000,
    open: true,
    cors: true,
    // Hot module replacement
    hmr: {
      overlay: true,
    },
  },
  
  // Preview server configuration (for testing production build)
  preview: {
    port: 4173,
    open: true,
  },
  
  // Plugin configuration
  plugins: [],
  
  // Dependency optimization
  optimizeDeps: {
    include: [],
  },
});