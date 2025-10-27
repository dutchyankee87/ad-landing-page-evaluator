// Subscription and usage management with Stripe integration
import { TIER_LIMITS, SIGNUP_BONUS_EVALUATIONS } from './constants';

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  priceId: string; // Stripe price ID
  evaluationsPerMonth: number;
  features: string[];
  popular?: boolean;
}

// Stripe price IDs (these will be created in Stripe dashboard)
export const STRIPE_PRICE_IDS = {
  pro_monthly: 'price_pro_monthly_29',
  pro_yearly: 'price_pro_yearly_290', 
  agency_monthly: 'price_agency_monthly_99',
  agency_yearly: 'price_agency_yearly_990',
  enterprise_monthly: 'price_enterprise_monthly_299',
  enterprise_yearly: 'price_enterprise_yearly_2990',
} as const;

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: '',
    evaluationsPerMonth: TIER_LIMITS.free + SIGNUP_BONUS_EVALUATIONS,
    features: [
      '3 evaluations/month (1 + 2 bonus on signup)',
      'Basic AI analysis',
      'Ad-to-page scoring',
      'Essential recommendations'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    priceId: STRIPE_PRICE_IDS.pro_monthly,
    evaluationsPerMonth: TIER_LIMITS.pro,
    features: [
      '25 evaluations/month',
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
    evaluationsPerMonth: TIER_LIMITS.agency,
    popular: true,
    features: [
      '200 evaluations/month',
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
    evaluationsPerMonth: TIER_LIMITS.enterprise,
    features: [
      'Up to 2,000 evaluations/month',
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
    evaluationsPerMonth: TIER_LIMITS.pro,
    features: [
      ...SUBSCRIPTION_TIERS[1].features,
      '💰 Save $58/year (2 months free)'
    ]
  },
  {
    id: 'agency_yearly',
    name: 'Agency (Annual)',
    price: 990, // $99 x 10 months (2 months free)
    priceId: STRIPE_PRICE_IDS.agency_yearly,
    evaluationsPerMonth: TIER_LIMITS.agency,
    features: [
      ...SUBSCRIPTION_TIERS[2].features,
      '💰 Save $198/year (2 months free)'
    ]
  },
  {
    id: 'enterprise_yearly',
    name: 'Enterprise (Annual)',
    price: 2990, // $299 x 10 months (2 months free)
    priceId: STRIPE_PRICE_IDS.enterprise_yearly,
    evaluationsPerMonth: TIER_LIMITS.enterprise,
    features: [
      ...SUBSCRIPTION_TIERS[3].features,
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