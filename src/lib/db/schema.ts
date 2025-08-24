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

// Evaluations table - Enhanced with storage architecture
export const evaluations = pgTable('evaluations', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').references(() => users.id),
  
  // Basic evaluation data
  platform: text('platform').default('meta').notNull(),
  landingPageUrl: text('landing_page_url').notNull(),
  overallScore: decimal('overall_score', { precision: 3, scale: 1 }).notNull(),
  
  // File storage references (URLs to R2 storage)
  adImageUrl: text('ad_image_url'), // Original ad image in R2
  adThumbnailUrl: text('ad_thumbnail_url'), // Thumbnail for UI
  adCompressedUrl: text('ad_compressed_url'), // Compressed for display
  landingPageScreenshotUrl: text('landing_page_screenshot_url'), // Auto-captured screenshot
  
  // Analysis results (JSON in database)
  gpt4Analysis: jsonb('gpt4_analysis').notNull(), // Full GPT-4 Vision response
  microScores: jsonb('micro_scores'), // Detailed scoring breakdown
  persuasionPrinciples: jsonb('persuasion_principles'), // Cialdini's principles analysis
  performancePrediction: jsonb('performance_prediction'), // CTR/CVR predictions
  
  // Legacy scores for compatibility
  visualScore: integer('visual_score'),
  contextualScore: integer('contextual_score'),
  toneScore: integer('tone_score'),
  
  // Classification data
  industry: text('industry'), // Auto-detected industry
  audienceType: text('audience_type'), // B2B, B2C, etc.
  campaignObjective: text('campaign_objective'), // awareness, conversion, traffic
  
  // Metadata
  processingTimeMs: integer('processing_time_ms'), // Performance tracking
  aiCost: decimal('ai_cost', { precision: 6, scale: 4 }), // Cost tracking
  usedAi: boolean('used_ai').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
}, (table) => {
  return {
    userIdIdx: index('idx_evaluations_user_id').on(table.userId),
    createdAtIdx: index('idx_evaluations_created_at').on(table.createdAt),
    platformIdx: index('idx_evaluations_platform').on(table.platform),
    industryIdx: index('idx_evaluations_industry').on(table.industry),
  };
});

// Separate table for large text content (avoid row size limits)
export const evaluationContent = pgTable('evaluation_content', {
  evaluationId: uuid('evaluation_id').primaryKey().references(() => evaluations.id),
  executiveSummary: text('executive_summary'),
  strategicRecommendations: jsonb('strategic_recommendations'),
  psychologicalInsights: jsonb('psychological_insights'),
  heatmapZones: jsonb('heatmap_zones'),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
});

// GA4 Connections for ROI validation
export const ga4Connections = pgTable('ga4_connections', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').references(() => users.id).notNull(),
  propertyId: text('property_id').notNull(),
  accessTokenEncrypted: text('access_token_encrypted').notNull(),
  refreshTokenEncrypted: text('refresh_token_encrypted').notNull(),
  connectedAt: timestamp('connected_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
}, (table) => {
  return {
    userIdIdx: index('idx_ga4_connections_user_id').on(table.userId),
    propertyIdIdx: index('idx_ga4_connections_property_id').on(table.propertyId),
  };
});

// Performance baselines for ROI measurement
export const performanceBaselines = pgTable('performance_baselines', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  evaluationId: uuid('evaluation_id').references(() => evaluations.id).notNull(),
  landingPageUrl: text('landing_page_url').notNull(),
  baselineDate: timestamp('baseline_date', { withTimezone: true }).notNull(),
  sessions: integer('sessions'),
  conversionRate: decimal('conversion_rate', { precision: 5, scale: 4 }),
  bounceRate: decimal('bounce_rate', { precision: 5, scale: 4 }),
  avgSessionDuration: interval('avg_session_duration'),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
}, (table) => {
  return {
    evaluationIdIdx: index('idx_baselines_evaluation_id').on(table.evaluationId),
    baselineDateIdx: index('idx_baselines_baseline_date').on(table.baselineDate),
  };
});

// Performance tracking for ROI validation
export const performanceTracking = pgTable('performance_tracking', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  evaluationId: uuid('evaluation_id').references(() => evaluations.id).notNull(),
  measurementDate: timestamp('measurement_date', { withTimezone: true }).notNull(),
  sessions: integer('sessions'),
  conversionRate: decimal('conversion_rate', { precision: 5, scale: 4 }),
  bounceRate: decimal('bounce_rate', { precision: 5, scale: 4 }),
  revenue: decimal('revenue', { precision: 10, scale: 2 }),
  implementedRecommendations: text('implemented_recommendations').array(),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
}, (table) => {
  return {
    evaluationIdIdx: index('idx_tracking_evaluation_id').on(table.evaluationId),
    measurementDateIdx: index('idx_tracking_measurement_date').on(table.measurementDate),
  };
});

// Recommendation effectiveness for ML insights
export const recommendationEffectiveness = pgTable('recommendation_effectiveness', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  recommendationText: text('recommendation_text').notNull(),
  implementationCount: integer('implementation_count').default(0),
  avgConversionImpact: decimal('avg_conversion_impact', { precision: 5, scale: 4 }),
  avgBounceImpact: decimal('avg_bounce_impact', { precision: 5, scale: 4 }),
  avgRevenueImpact: decimal('avg_revenue_impact', { precision: 10, scale: 2 }),
  confidenceScore: decimal('confidence_score', { precision: 3, scale: 2 }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
}, (table) => {
  return {
    recommendationTextIdx: index('idx_effectiveness_text').on(table.recommendationText),
    implementationCountIdx: index('idx_effectiveness_count').on(table.implementationCount),
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
export const insertEvaluationContentSchema = createInsertSchema(evaluationContent);
export const selectEvaluationContentSchema = createSelectSchema(evaluationContent);
export const insertGa4ConnectionSchema = createInsertSchema(ga4Connections);
export const selectGa4ConnectionSchema = createSelectSchema(ga4Connections);
export const insertPerformanceBaselineSchema = createInsertSchema(performanceBaselines);
export const selectPerformanceBaselineSchema = createSelectSchema(performanceBaselines);
export const insertPerformanceTrackingSchema = createInsertSchema(performanceTracking);
export const selectPerformanceTrackingSchema = createSelectSchema(performanceTracking);
export const insertRecommendationEffectivenessSchema = createInsertSchema(recommendationEffectiveness);
export const selectRecommendationEffectivenessSchema = createSelectSchema(recommendationEffectiveness);
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
export type EvaluationContent = typeof evaluationContent.$inferSelect;
export type NewEvaluationContent = typeof evaluationContent.$inferInsert;
export type GA4Connection = typeof ga4Connections.$inferSelect;
export type NewGA4Connection = typeof ga4Connections.$inferInsert;
export type PerformanceBaseline = typeof performanceBaselines.$inferSelect;
export type NewPerformanceBaseline = typeof performanceBaselines.$inferInsert;
export type PerformanceTracking = typeof performanceTracking.$inferSelect;
export type NewPerformanceTracking = typeof performanceTracking.$inferInsert;
export type RecommendationEffectiveness = typeof recommendationEffectiveness.$inferSelect;
export type NewRecommendationEffectiveness = typeof recommendationEffectiveness.$inferInsert;
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