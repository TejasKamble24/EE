import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    // These values are injected as literals during the Vite build process.
    // Make sure to add API_KEY in your Vercel Project Environment Variables.
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