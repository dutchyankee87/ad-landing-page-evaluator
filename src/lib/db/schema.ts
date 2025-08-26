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
  
  // Phase 2: User accounts (nullable for backward compatibility)
  userId: uuid('user_id'), // Will reference users table when implemented
  
  // Core evaluation data
  platform: text('platform').default('meta').notNull(),
  landingPageUrl: text('landing_page_url').notNull(),
  overallScore: decimal('overall_score', { precision: 3, scale: 1 }).notNull(),
  
  // Phase 2: File storage URLs (nullable for Phase 1)
  adImageUrl: text('ad_image_url'), // Future: R2/S3 URL
  adThumbnailUrl: text('ad_thumbnail_url'), // Future: optimized thumbnail
  landingPageScreenshotUrl: text('landing_page_screenshot_url'), // Future: auto-capture
  
  // Analysis results (always stored)
  gpt4Analysis: jsonb('gpt4_analysis').notNull(),
  persuasionPrinciples: jsonb('persuasion_principles'),
  recommendations: jsonb('recommendations'),
  
  // Phase 2: Enhanced metadata (nullable for Phase 1)
  industry: text('industry'), // Auto-detected
  audienceType: text('audience_type'), // B2B/B2C
  processingTimeMs: integer('processing_time_ms'),
  aiCost: decimal('ai_cost', { precision: 6, scale: 4 }),
  
  // Usage tracking
  usedAi: boolean('used_ai').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
}, (table) => {
  return {
    createdAtIdx: index('idx_evaluations_created_at').on(table.createdAt),
    platformIdx: index('idx_evaluations_platform').on(table.platform),
    industryIdx: index('idx_evaluations_industry').on(table.industry),
    userIdIdx: index('idx_evaluations_user_id').on(table.userId), // Future use
    landingPageUrlIdx: index('idx_evaluations_url').on(table.landingPageUrl),
  };
});

// Phase 2: Users table (ready to implement when needed)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  email: text('email').unique().notNull(),
  tier: text('tier', { enum: ['free', 'pro', 'enterprise'] }).default('free').notNull(),
  monthlyEvaluations: integer('monthly_evaluations').default(0).notNull(),
  storageUsedMb: decimal('storage_used_mb', { precision: 8, scale: 2 }).default('0').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
}, (table) => {
  return {
    emailIdx: index('idx_users_email').on(table.email),
    tierIdx: index('idx_users_tier').on(table.tier),
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

// Business logic constants
export const TIER_LIMITS = {
  free: 5, // 5 evaluations per month
  pro: 100, // 100 evaluations per month  
  enterprise: 2000, // 2000 evaluations per month
} as const;

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