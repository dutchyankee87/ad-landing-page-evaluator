// Subscription and usage management with Stripe integration
import { TIER_LIMITS, SIGNUP_BONUS_EVALUATIONS } from './constants';

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  priceId: string; // Stripe price ID
  evaluationsPerMonth: number;
  imageEvaluationsPerMonth: number;
  videoEvaluationsPerMonth: number;
  features: string[];
  popular?: boolean;
}

// Stripe price IDs from Stripe dashboard
export const STRIPE_PRICE_IDS = {
  pro_monthly: 'price_1SN97pFhgriIx8RjiK7LApeS',
  pro_yearly: 'price_1SN9BeFhgriIx8RjSUBZm7rx', 
  agency_monthly: 'price_1SN99FFhgriIx8RjPqiWWOgl',
  agency_yearly: 'price_1SN9DTFhgriIx8RjL6PIx6aX',
  enterprise_monthly: 'price_1SN9EmFhgriIx8Rj2tFxCps4',
  enterprise_yearly: 'price_1SN9GJFhgriIx8RjwFrMKhnx',
} as const;

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: '',
    evaluationsPerMonth: 1,
    imageEvaluationsPerMonth: 1,
    videoEvaluationsPerMonth: 0,
    features: [
      '1 image evaluation/month',
      'Basic AI analysis',
      'Ad-to-page scoring',
      'Essential recommendations',
      '🔒 Video analysis (Pro+)'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    priceId: STRIPE_PRICE_IDS.pro_monthly,
    evaluationsPerMonth: 55,
    imageEvaluationsPerMonth: 50,
    videoEvaluationsPerMonth: 5,
    features: [
      '50 image evaluations/month',
      '🎥 5 video evaluations/month',
      'Advanced AI insights',
      'Export PDF reports',
      'Email support',
      'Performance tracking'
    ]
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 99,
    priceId: STRIPE_PRICE_IDS.agency_monthly,
    evaluationsPerMonth: 250,
    imageEvaluationsPerMonth: 200,
    videoEvaluationsPerMonth: 50,
    popular: true,
    features: [
      '200 image evaluations/month',
      '🎥 50 video evaluations/month',
      'Team collaboration (5 users)',
      'Shared dashboards',
      'Complete audit history',
      'White-label reports',
      'Priority support',
      'Industry benchmarks'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    priceId: STRIPE_PRICE_IDS.enterprise_monthly,
    evaluationsPerMonth: 1500,
    imageEvaluationsPerMonth: 1000,
    videoEvaluationsPerMonth: 500,
    features: [
      '1,000 image evaluations/month',
      '🎥 500 video evaluations/month',
      'Custom branding',
      'API access',
      'Dedicated support',
      'Custom integrations',
      'Advanced analytics'
    ]
  }
];

export const ANNUAL_SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'pro_yearly',
    name: 'Pro (Annual)',
    price: 290, // $29 x 10 months (2 months free)
    priceId: STRIPE_PRICE_IDS.pro_yearly,
    evaluationsPerMonth: 55,
    imageEvaluationsPerMonth: 50,
    videoEvaluationsPerMonth: 5,
    features: [
      '50 image evaluations/month',
      '🎥 5 video evaluations/month',
      'Advanced AI insights',
      'Export PDF reports',
      'Email support',
      'Performance tracking',
      '💰 Save $58/year (2 months free)'
    ]
  },
  {
    id: 'agency_yearly',
    name: 'Agency (Annual)',
    price: 990, // $99 x 10 months (2 months free)
    priceId: STRIPE_PRICE_IDS.agency_yearly,
    evaluationsPerMonth: 250,
    imageEvaluationsPerMonth: 200,
    videoEvaluationsPerMonth: 50,
    features: [
      '200 image evaluations/month',
      '🎥 50 video evaluations/month',
      'Team collaboration (5 users)',
      'Shared dashboards',
      'Complete audit history',
      'White-label reports',
      'Priority support',
      'Industry benchmarks',
      '💰 Save $198/year (2 months free)'
    ]
  },
  {
    id: 'enterprise_yearly',
    name: 'Enterprise (Annual)',
    price: 2990, // $299 x 10 months (2 months free)
    priceId: STRIPE_PRICE_IDS.enterprise_yearly,
    evaluationsPerMonth: 1500,
    imageEvaluationsPerMonth: 1000,
    videoEvaluationsPerMonth: 500,
    features: [
      '1,000 image evaluations/month',
      '🎥 500 video evaluations/month',
      'Custom branding',
      'API access',
      'Dedicated support',
      'Custom integrations',
      'Advanced analytics',
      '💰 Save $598/year (2 months free)'
    ]
  }
];

// Helper function to get tier by ID
export function getTierById(tierId: string): SubscriptionTier | null {
  return [...SUBSCRIPTION_TIERS, ...ANNUAL_SUBSCRIPTION_TIERS].find(tier => tier.id === tierId) || null;
}

// Helper function to determine if user can evaluate based on database
export function canUserEvaluate(
  monthlyEvaluations: number, 
  bonusEvaluations: number, 
  tier: string
): boolean {
  const limit = TIER_LIMITS[tier as keyof typeof TIER_LIMITS] || TIER_LIMITS.free;
  const totalUsed = monthlyEvaluations;
  const totalLimit = limit + bonusEvaluations;
  
  return totalUsed < totalLimit;
}

// Helper function to get remaining evaluations
export function getRemainingEvaluations(
  monthlyEvaluations: number,
  bonusEvaluations: number,
  tier: string
): number {
  const limit = TIER_LIMITS[tier as keyof typeof TIER_LIMITS] || TIER_LIMITS.free;
  const totalUsed = monthlyEvaluations;
  const totalLimit = limit + bonusEvaluations;
  
  return Math.max(0, totalLimit - totalUsed);
}

// Check if user should get signup bonus
export function shouldReceiveSignupBonus(tier: string, bonusEvaluations: number): boolean {
  return tier === 'free' && bonusEvaluations === 0;
}