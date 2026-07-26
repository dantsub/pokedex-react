import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/domain': path.resolve(__dirname, '.src/domain'),
      '@/services': path.resolve(__dirname, '.src/services'),
      '@/data': path.resolve(__dirname, '.src/data'),
      '@/app': path.resolve(__dirname, '.src/app'),
      '@/ui': path.resolve(__dirname, '.src/ui'),
      '@/utils': path.resolve(__dirname, '.src/utils'),
    },
  },
});
