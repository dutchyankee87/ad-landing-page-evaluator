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
               id.includes('drizzle-orm/postgres-js') ||
               id === './src/lib/db/index.ts' ||
               id === './src/lib/db/queries.ts';
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react', 'postgres', 'pg', 'drizzle-orm/postgres-js'],
  },
});
