import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['web-vitals'],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  resolve: {
    alias: {
      'web-vitals': '/client/src/utils/web-vitals.ts'
    }
  }
});
