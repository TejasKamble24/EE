
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    // Specifically define individual env variables to avoid overriding the global process object incorrectly
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    'process.env.NODE_ENV': JSON.stringify('production')
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
