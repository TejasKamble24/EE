
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    // Provide the API_KEY at build time from the environment
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    // Use a valid JS literal for process.env shim to satisfy esbuild
    'process.env': '{}'
  },
  build: {
    target: 'esnext',
    outDir: 'dist'
  },
  server: {
    port: 3000
  }
});
