/**
 * Production-safe logging utility for Vercel Functions
 * Sanitizes logs in production to hide sensitive service information
 */

const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';

// Sensitive terms to filter out in production
const SENSITIVE_TERMS = [
  'gpt-4o',
  'gpt-4', 
  'openai',
  'screenshotapi',
  'urlbox',
  'supabase',
  'claude',
  'anthropic',
  'api key',
  'token',
  'secret'
];

// Sanitize message by removing or replacing sensitive information
const sanitizeMessage = (message) => {
  if (!isProduction) return message;
  
  let sanitized = message;
  
  // Replace specific service mentions
  sanitized = sanitized.replace(/gpt-4o?(-vision)?/gi, 'AI model');
  sanitized = sanitized.replace(/screenshotapi/gi, 'screenshot service');
  sanitized = sanitized.replace(/urlbox/gi, 'backup service');
  sanitized = sanitized.replace(/openai/gi, 'AI service');
  sanitized = sanitized.replace(/supabase/gi, 'database');
  sanitized = sanitized.replace(/claude/gi, 'AI assistant');
  sanitized = sanitized.replace(/anthropic/gi, 'AI provider');
  
  // Remove API endpoints and keys
  sanitized = sanitized.replace(/https:\/\/[a-zA-Z0-9.-]+\/[^\s]*/g, '[API_ENDPOINT]');
  sanitized = sanitized.replace(/[a-z0-9]{20,}/gi, '[REDACTED]');
  
  return sanitized;
};

// Safe logger that filters sensitive information in production
export const logger = {
  log: (...args) => {
    if (!isProduction) {
      console.log(...args);
      return;
    }
    
    const sanitizedArgs = args.map(arg => 
      typeof arg === 'string' ? sanitizeMessage(arg) : arg
    );
    console.log(...sanitizedArgs);
  },
  
  warn: (...args) => {
    if (!isProduction) {
      console.warn(...args);
      return;
    }
    
    const sanitizedArgs = args.map(arg => 
      typeof arg === 'string' ? sanitizeMessage(arg) : arg
    );
    console.warn(...sanitizedArgs);
  },
  
  error: (...args) => {
    if (!isProduction) {
      console.error(...args);
      return;
    }
    
    const sanitizedArgs = args.map(arg => 
      typeof arg === 'string' ? sanitizeMessage(arg) : arg
    );
    console.error(...sanitizedArgs);
  },
  
  // Development-only logger - completely silent in production
  debug: (...args) => {
    if (!isProduction) {
      console.log('[DEBUG]', ...args);
    }
  }
};

// Helper to check if we should show detailed logs
export const shouldShowDetailedLogs = () => !isProduction;