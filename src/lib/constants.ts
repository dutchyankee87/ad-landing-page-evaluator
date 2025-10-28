// Shared constants that can be used in both client and server code
// Note: Keep this file free of any Node.js or database imports

// Subscription tier limits (evaluations per month)
export const TIER_LIMITS = {
  free: 1, // 1 base evaluation + 2 bonus on signup = 3 total
  pro: 25, // 25 evaluations per month ($29/month)
  agency: 200, // 200 evaluations per month ($99/month)  
  enterprise: 2000, // 2000 evaluations per month ($299/month)
} as const;

// Bonus evaluations given when signing up
export const SIGNUP_BONUS_EVALUATIONS = 2;

// Storage limits (MB)
export const STORAGE_LIMITS_MB = {
  free: 0, // No file storage
  pro: 1000, // 1GB storage
  agency: 10000, // 10GB storage
  enterprise: 100000, // 100GB storage
} as const;

// Valid subscription tiers
export type SubscriptionTier = keyof typeof TIER_LIMITS;

// Valid subscription statuses
export type SubscriptionStatus = 
  | 'active' 
  | 'canceled' 
  | 'incomplete' 
  | 'incomplete_expired' 
  | 'past_due' 
  | 'paused' 
  | 'trialing' 
  | 'unpaid';

// Platform constants
export const PLATFORMS = ['meta', 'tiktok', 'linkedin', 'google', 'reddit'] as const;
export type Platform = typeof PLATFORMS[number];

// Industry constants  
export const INDUSTRIES = [
  'ecommerce',
  'saas', 
  'education',
  'healthcare',
  'finance',
  'real-estate',
  'automotive',
  'travel',
  'food-beverage',
  'fashion',
  'technology',
  'consulting',
  'fitness',
  'entertainment',
  'other'
] as const;
export type Industry = typeof INDUSTRIES[number];

// Audience type constants
export const AUDIENCE_TYPES = [
  'b2b-decision-makers',
  'b2b-influencers', 
  'b2c-consumers',
  'b2c-parents',
  'b2c-students',
  'entrepreneurs',
  'professionals',
  'other'
] as const;
export type AudienceType = typeof AUDIENCE_TYPES[number];