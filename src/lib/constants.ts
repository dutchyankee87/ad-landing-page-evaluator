// Business logic constants shared between client and server
export const TIER_LIMITS = {
  free: 1, // 1 base evaluation + 2 bonus on signup = 3 total
  pro: 25, // 25 evaluations per month ($29/month)
  agency: 200, // 200 evaluations per month ($99/month)  
  enterprise: 2000, // 2000 evaluations per month ($299/month)
} as const;

export const SIGNUP_BONUS_EVALUATIONS = 2; // Bonus evaluations when signing up

export const STORAGE_LIMITS_MB = {
  free: 0, // No file storage
  pro: 1000, // 1GB storage
  enterprise: 10000, // 10GB storage
} as const;

// Platform constants
export const PLATFORMS = [
  'meta',
  'tiktok', 
  'linkedin',
  'reddit',
  'google'
] as const;

export type Platform = typeof PLATFORMS[number];

// Industry classification
export const INDUSTRIES = [
  'ecommerce',
  'saas',
  'financial-services',
  'healthcare',
  'education',
  'real-estate',
  'travel',
  'b2b-services',
  'consumer-goods',
  'nonprofit',
  'other'
] as const;

export type Industry = typeof INDUSTRIES[number];

// Audience types
export const AUDIENCE_TYPES = [
  'b2b',
  'b2c',
  'b2b2c',
  'marketplace'
] as const;

export type AudienceType = typeof AUDIENCE_TYPES[number];