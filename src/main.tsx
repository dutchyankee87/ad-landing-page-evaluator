import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Debug environment variables
console.log('🔍 Debug Environment Variables:');
console.log('- VITE_CLERK_PUBLISHABLE_KEY:', PUBLISHABLE_KEY);
console.log('- Has Key:', !!PUBLISHABLE_KEY);
console.log('- Key Length:', PUBLISHABLE_KEY?.length);
console.log('- All VITE_ vars:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')));

if (!PUBLISHABLE_KEY) {
  console.error('❌ VITE_CLERK_PUBLISHABLE_KEY is missing or empty');
  console.warn('🔄 Running without Clerk authentication for testing');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    ) : (
      <App />
    )}
  </StrictMode>
);
