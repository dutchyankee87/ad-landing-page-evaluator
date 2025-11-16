import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';
import { logger, shouldShowDetailedLogs } from './lib/logger';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Debug environment variables (only in development)
if (shouldShowDetailedLogs()) {
  logger.debug('🔍 Debug Environment Variables:');
  logger.debug('- Authentication Key Present:', !!PUBLISHABLE_KEY);
  logger.debug('- Key Length:', PUBLISHABLE_KEY?.length);
  logger.debug('- Available Config Keys:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')));
}

if (!PUBLISHABLE_KEY) {
  logger.error('❌ Authentication key is missing or empty');
  logger.warn('🔄 Running without authentication for testing');
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
