
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    // Vite will replace 'process.env.API_KEY' with the actual value during build.
    // Ensure this is set in your Vercel Project Environment Variables.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: false
  },
  server: {
    port: 3000
  }
});
