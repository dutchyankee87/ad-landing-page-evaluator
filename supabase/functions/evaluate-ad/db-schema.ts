// Database schema for Drizzle ORM (Edge Function only)
// This code ONLY runs in Deno runtime, never in browser

export interface User {
  id: string;
  email: string;
  tier: 'free' | 'pro' | 'agency' | 'enterprise';
  monthlyEvaluations: number;
  createdAt: Date;
}

export interface Evaluation {
  id: string;
  userId: string | null;
  platform: string;
  adScreenshotUrl: string;
  landingPageUrl: string;
  overallScore: number;
  visualScore: number;
  contextualScore: number;
  toneScore: number;
  usedAi: boolean;
  createdAt: Date;
}

// Helper functions for database operations without importing Drizzle in client
export const TIER_LIMITS = {
  free: 3,
  pro: 50,
  agency: 200,
  enterprise: 1000
} as const;

export const canUserEvaluate = (user: User): boolean => {
  const limit = TIER_LIMITS[user.tier];
  return user.monthlyEvaluations < limit;
};

export const incrementUserEvaluations = (user: User): User => {
  return {
    ...user,
    monthlyEvaluations: user.monthlyEvaluations + 1
  };
};