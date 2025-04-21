import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: ['web-vitals']
    }
  },
  resolve: {
    alias: {
      'web-vitals': '/client/src/utils/web-vitals.ts'
    }
  }
});
 
