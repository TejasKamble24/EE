import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    // String replacement for environment variables during bundling.
    // Replace literals in the code with the actual values.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false
  },
  server: {
    port: 3000,
    strictPort: true
  }
});