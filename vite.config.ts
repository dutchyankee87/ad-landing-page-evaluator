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
        // Exclude server-side packages from client build, but allow Supabase client packages
        return (id.includes('postgres') && !id.includes('@supabase')) || 
               (id.includes('pg') && !id.includes('@supabase')) || 
               id.includes('drizzle-orm');
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
