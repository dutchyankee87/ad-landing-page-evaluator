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
  interval,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  email: text('email').unique().notNull(),
  tier: text('tier', { enum: ['free', 'pro', 'enterprise'] }).default('free').notNull(),
  monthlyEvaluations: integer('monthly_evaluations').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
}, (table) => {
  return {
    emailIdx: index('idx_users_email').on(table.email),
  };
});

// Evaluations table
export const evaluations = pgTable('evaluations', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').references(() => users.id),
  platform: text('platform').default('meta').notNull(),
  adScreenshotUrl: text('ad_screenshot_url').notNull(),
  landingPageUrl: text('landing_page_url').notNull(),
  overallScore: integer('overall_score').notNull(),
  visualScore: integer('visual_score').notNull(),
  contextualScore: integer('contextual_score').notNull(),
  toneScore: integer('tone_score').notNull(),
  usedAi: boolean('used_ai').default(true).notNull(),
  industry: text('industry'), // Auto-detected industry
  audienceType: text('audience_type'), // B2B, B2C, etc.
  campaignObjective: text('campaign_objective'), // awareness, conversion, traffic
  microScores: jsonb('micro_scores'), // Detailed scoring breakdown
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
}, (table) => {
  return {
    userIdIdx: index('idx_evaluations_user_id').on(table.userId),
    createdAtIdx: index('idx_evaluations_created_at').on(table.createdAt),
    platformIdx: index('idx_evaluations_platform').on(table.platform),
    industryIdx: index('idx_evaluations_industry').on(table.industry),
  };
});

// Performance feedback table for data flywheel
export const performanceFeedback = pgTable('performance_feedback', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  evaluationId: uuid('evaluation_id').references(() => evaluations.id).notNull(),
  userEmail: text('user_email'), // Optional for correlation
  feedbackType: text('feedback_type').notNull(), // 'implemented', 'performance_change', 'benchmark'
  feedbackData: jsonb('feedback_data').notNull(), // Flexible feedback data
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
}, (table) => {
  return {
    evaluationIdIdx: index('idx_performance_feedback_evaluation_id').on(table.evaluationId),
    feedbackTypeIdx: index('idx_performance_feedback_type').on(table.feedbackType),
    createdAtIdx: index('idx_performance_feedback_created_at').on(table.createdAt),
  };
});

// Anonymous performance metrics for benchmarking
export const performanceMetrics = pgTable('performance_metrics', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  evaluationHash: text('evaluation_hash').notNull(), // Anonymized evaluation identifier
  platform: text('platform').notNull(),
  industry: text('industry'),
  audienceType: text('audience_type'),
  preScore: integer('pre_score'),
  postScore: integer('post_score'),
  performanceChange: jsonb('performance_change'), // CTR, CVR, ROAS changes
  recommendationsImplemented: text('recommendations_implemented').array(),
  timeToImplementation: interval('time_to_implementation'),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
}, (table) => {
  return {
    platformIdx: index('idx_performance_metrics_platform').on(table.platform),
    industryIdx: index('idx_performance_metrics_industry').on(table.industry),
    evaluationHashIdx: index('idx_performance_metrics_hash').on(table.evaluationHash),
  };
});

// Industry benchmarks
export const industryBenchmarks = pgTable('industry_benchmarks', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  platform: text('platform').notNull(),
  industry: text('industry').notNull(),
  scoreType: text('score_type').notNull(), // 'overall', 'visual', 'contextual', etc.
  percentile10: decimal('percentile_10', { precision: 5, scale: 2 }),
  percentile25: decimal('percentile_25', { precision: 5, scale: 2 }),
  percentile50: decimal('percentile_50', { precision: 5, scale: 2 }),
  percentile75: decimal('percentile_75', { precision: 5, scale: 2 }),
  percentile90: decimal('percentile_90', { precision: 5, scale: 2 }),
  sampleSize: integer('sample_size').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
}, (table) => {
  return {
    platformIndustryIdx: index('idx_benchmarks_platform_industry').on(table.platform, table.industry),
    scoreTypeIdx: index('idx_benchmarks_score_type').on(table.scoreType),
    updatedAtIdx: index('idx_benchmarks_updated_at').on(table.updatedAt),
  };
});

// Recommendation tracking
export const recommendationTracking = pgTable('recommendation_tracking', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  evaluationId: uuid('evaluation_id').references(() => evaluations.id).notNull(),
  recommendationType: text('recommendation_type').notNull(), // 'visual', 'content', 'technical'
  recommendationText: text('recommendation_text').notNull(),
  priority: text('priority').notNull(), // 'HIGH', 'MEDIUM', 'LOW'
  implemented: boolean('implemented').default(false),
  implementedAt: timestamp('implemented_at', { withTimezone: true }),
  effectivenessRating: integer('effectiveness_rating'), // 1-5 user rating
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
}, (table) => {
  return {
    evaluationIdIdx: index('idx_recommendation_tracking_evaluation_id').on(table.evaluationId),
    typeIdx: index('idx_recommendation_tracking_type').on(table.recommendationType),
    implementedIdx: index('idx_recommendation_tracking_implemented').on(table.implemented),
  };
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertEvaluationSchema = createInsertSchema(evaluations);
export const selectEvaluationSchema = createSelectSchema(evaluations);
export const insertPerformanceFeedbackSchema = createInsertSchema(performanceFeedback);
export const selectPerformanceFeedbackSchema = createSelectSchema(performanceFeedback);
export const insertPerformanceMetricsSchema = createInsertSchema(performanceMetrics);
export const selectPerformanceMetricsSchema = createSelectSchema(performanceMetrics);
export const insertIndustryBenchmarksSchema = createInsertSchema(industryBenchmarks);
export const selectIndustryBenchmarksSchema = createSelectSchema(industryBenchmarks);
export const insertRecommendationTrackingSchema = createInsertSchema(recommendationTracking);
export const selectRecommendationTrackingSchema = createSelectSchema(recommendationTracking);

// TypeScript types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Evaluation = typeof evaluations.$inferSelect;
export type NewEvaluation = typeof evaluations.$inferInsert;
export type PerformanceFeedback = typeof performanceFeedback.$inferSelect;
export type NewPerformanceFeedback = typeof performanceFeedback.$inferInsert;
export type PerformanceMetrics = typeof performanceMetrics.$inferSelect;
export type NewPerformanceMetrics = typeof performanceMetrics.$inferInsert;
export type IndustryBenchmarks = typeof industryBenchmarks.$inferSelect;
export type NewIndustryBenchmarks = typeof industryBenchmarks.$inferInsert;
export type RecommendationTracking = typeof recommendationTracking.$inferSelect;
export type NewRecommendationTracking = typeof recommendationTracking.$inferInsert;

// Business logic helpers
export const TIER_LIMITS = {
  free: 1,
  pro: 50,
  enterprise: 1000,
} as const;

export type UserTier = keyof typeof TIER_LIMITS;

// Industry classification constants
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

// Audience type constants
export const AUDIENCE_TYPES = [
  'b2b',
  'b2c',
  'b2b2c',
  'marketplace'
] as const;

export type AudienceType = typeof AUDIENCE_TYPES[number];

// Campaign objective constants
export const CAMPAIGN_OBJECTIVES = [
  'awareness',
  'consideration',
  'conversion',
  'retention',
  'traffic',
  'engagement'
] as const;

export type CampaignObjective = typeof CAMPAIGN_OBJECTIVES[number];

// Feedback type constants
export const FEEDBACK_TYPES = [
  'implemented',
  'performance_change',
  'benchmark',
  'recommendation_rating'
] as const;

export type FeedbackType = typeof FEEDBACK_TYPES[number];