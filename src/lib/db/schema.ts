import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  index,
  decimal,
  jsonb,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

// Phase 1: Minimal storage - just analysis results
// Phase 2: Add user accounts and file storage 
// Phase 3: Add performance tracking and benchmarking
export const evaluations = pgTable('evaluations', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id'),
  title: text('title'),
  adScreenshotUrl: text('ad_screenshot_url'),
  landingPageUrl: text('landing_page_url').notNull(),
  landingPageTitle: text('landing_page_title'),
  landingPageContent: text('landing_page_content'),
  landingPageCta: text('landing_page_cta'),
  targetAgeRange: text('target_age_range'),
  targetGender: text('target_gender'),
  targetLocation: text('target_location'),
  targetInterests: text('target_interests'),
  overallScore: decimal('overall_score', { precision: 3, scale: 1 }).notNull(),
  visualMatchScore: decimal('visual_match_score', { precision: 3, scale: 1 }),
  contextualMatchScore: decimal('contextual_match_score', { precision: 3, scale: 1 }),
  toneAlignmentScore: decimal('tone_alignment_score', { precision: 3, scale: 1 }),
  visualSuggestions: jsonb('visual_suggestions'),
  contextualSuggestions: jsonb('contextual_suggestions'),
  toneSuggestions: jsonb('tone_suggestions'),
  analysisModel: text('analysis_model'),
  processingTimeMs: integer('processing_time_ms'),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
  platform: text('platform').default('meta').notNull(),
  landingPageScreenshotUrl: text('landing_page_screenshot_url'),
  landingPageScreenshotPath: text('landing_page_screenshot_path'),
  screenshotFileSize: integer('screenshot_file_size'),
  screenshotCapturedAt: timestamp('screenshot_captured_at', { withTimezone: true }),
  screenshotIsPlaceholder: boolean('screenshot_is_placeholder').default(false),
  contextualScore: decimal('contextual_score', { precision: 3, scale: 1 }),
  toneScore: decimal('tone_score', { precision: 3, scale: 1 }),
  adImageFileSize: integer('ad_image_file_size'),
  visualScore: decimal('visual_score', { precision: 3, scale: 1 }),
}, (table) => {
  return {
    createdAtIdx: index('idx_evaluations_created_at').on(table.createdAt),
    platformIdx: index('idx_evaluations_platform').on(table.platform),
    userIdIdx: index('idx_evaluations_user_id').on(table.userId),
    landingPageUrlIdx: index('idx_evaluations_url').on(table.landingPageUrl),
  };
});

// Phase 2: Users table (ready to implement when needed)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  email: text('email').unique().notNull(),
  tier: text('tier', { enum: ['free', 'pro', 'agency', 'enterprise'] }).default('free').notNull(),
  monthlyEvaluations: integer('monthly_evaluations').default(0).notNull(),
  bonusEvaluations: integer('bonus_evaluations').default(0).notNull(), // For signup bonus
  storageUsedMb: decimal('storage_used_mb', { precision: 8, scale: 2 }).default('0').notNull(),
  
  // Stripe subscription fields
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  subscriptionStatus: text('subscription_status', { 
    enum: ['active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'paused', 'trialing', 'unpaid'] 
  }),
  subscriptionCurrentPeriodEnd: timestamp('subscription_current_period_end', { withTimezone: true }),
  
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
}, (table) => {
  return {
    emailIdx: index('idx_users_email').on(table.email),
    tierIdx: index('idx_users_tier').on(table.tier),
    stripeCustomerIdx: index('idx_users_stripe_customer').on(table.stripeCustomerId),
    stripeSubscriptionIdx: index('idx_users_stripe_subscription').on(table.stripeSubscriptionId),
  };
});

// Phase 3: Performance tracking (enterprise feature)
export const performanceFeedback = pgTable('performance_feedback', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  evaluationId: uuid('evaluation_id').references(() => evaluations.id).notNull(),
  implementedRecommendations: text('implemented_recommendations').array(),
  performanceChange: jsonb('performance_change'), // CTR, CVR, ROAS
  userRating: integer('user_rating'), // 1-5 stars
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
}, (table) => {
  return {
    evaluationIdIdx: index('idx_feedback_evaluation_id').on(table.evaluationId),
  };
});

// Phase 3: Industry benchmarks (data flywheel)
export const industryBenchmarks = pgTable('industry_benchmarks', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  platform: text('platform').notNull(),
  industry: text('industry').notNull(),
  scoreType: text('score_type').notNull(), // 'overall', 'visual', etc.
  percentile50: decimal('percentile_50', { precision: 5, scale: 2 }),
  percentile75: decimal('percentile_75', { precision: 5, scale: 2 }),
  percentile90: decimal('percentile_90', { precision: 5, scale: 2 }),
  sampleSize: integer('sample_size').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
}, (table) => {
  return {
    platformIndustryIdx: index('idx_benchmarks_platform_industry').on(table.platform, table.industry),
  };
});

// IP rate limiting for anonymous users
export const ipRateLimit = pgTable('ip_rate_limit', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  ipAddress: text('ip_address').unique().notNull(),
  monthlyEvaluations: integer('monthly_evaluations').default(0).notNull(),
  currentMonth: text('current_month').notNull(), // YYYY-MM format
  lastEvaluationAt: timestamp('last_evaluation_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
}, (table) => {
  return {
    ipIdx: index('ip_address_idx').on(table.ipAddress),
    monthIdx: index('current_month_idx').on(table.currentMonth),
  };
});

// Zod schemas for validation
export const insertEvaluationSchema = createInsertSchema(evaluations);
export const selectEvaluationSchema = createSelectSchema(evaluations);
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertPerformanceFeedbackSchema = createInsertSchema(performanceFeedback);
export const selectPerformanceFeedbackSchema = createSelectSchema(performanceFeedback);

// TypeScript types
export type Evaluation = typeof evaluations.$inferSelect;
export type NewEvaluation = typeof evaluations.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type PerformanceFeedback = typeof performanceFeedback.$inferSelect;
export type NewPerformanceFeedback = typeof performanceFeedback.$inferInsert;

// Business logic constants - updated pricing strategy
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

// Analysis interfaces for type safety
export interface PersuasionPrinciple {
  score: 'HIGH' | 'MEDIUM' | 'LOW';
  adAnalysis: string;
  pageAnalysis: string;
  recommendation: string;
  examples: string[];
}

export interface PersuasionAnalysis {
  reciprocity: PersuasionPrinciple;
  commitment: PersuasionPrinciple;
  socialProof: PersuasionPrinciple;
  authority: PersuasionPrinciple;
  liking: PersuasionPrinciple;
  scarcity: PersuasionPrinciple;
}

export interface GPT4Analysis {
  overallScore: number;
  visualScore: number;
  contextualScore: number;
  toneScore: number;
  executiveSummary: string;
  keyInsights: string[];
  recommendations: string[];
  persuasionAnalysis: PersuasionAnalysis;
}

// Migration helpers for future phases
export const PHASE_1_COLUMNS = [
  'id',
  'platform', 
  'landingPageUrl',
  'overallScore',
  'gpt4Analysis',
  'usedAi',
  'createdAt'
] as const;

export const PHASE_2_COLUMNS = [
  ...PHASE_1_COLUMNS,
  'userId',
  'adImageUrl',
  'landingPageScreenshotUrl', 
  'industry',
  'audienceType',
  'processingTimeMs',
  'aiCost'
] as const;

export const PHASE_3_COLUMNS = [
  ...PHASE_2_COLUMNS,
  'updatedAt'
] as const;