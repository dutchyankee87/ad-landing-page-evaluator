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
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'auth-vendor': ['@clerk/clerk-react'],
          'payment-vendor': ['@stripe/stripe-js', 'stripe'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'ai-vendor': ['openai'],
          // Split large pages into separate chunks
          'evaluation': ['./src/pages/EvaluationForm.tsx', './src/pages/Results.tsx'],
          'pricing': ['./src/pages/Pricing.tsx'],
          'partners': ['./src/pages/Partners.tsx']
        }
      }
    },
    chunkSizeWarningLimit: 400, // Reduce warning limit to 400KB
    target: 'esnext',
    minify: 'esbuild'
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
