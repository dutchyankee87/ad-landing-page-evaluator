import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  build: {
    rollupOptions: {
      external: (id) => {
        // Exclude server-side packages from client build
        return id.includes('postgres') || 
               id.includes('pg') || 
               id.includes('drizzle-orm/postgres-js');
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
