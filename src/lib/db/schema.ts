import {
  pgTable,
  uuid,
  text,
  timestamp,
  decimal,
  integer,
  jsonb,
  unique,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table (extends Supabase auth.users)
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  company: text('company'),
  subscriptionTier: text('subscription_tier').default('free').notNull(),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  subscriptionStatus: text('subscription_status').default('active'),
  subscriptionCurrentPeriodEnd: timestamp('subscription_current_period_end', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    subscriptionTierCheck: check('subscription_tier_check', 
      sql`${table.subscriptionTier} IN ('free', 'pro', 'enterprise')`),
    subscriptionStatusCheck: check('subscription_status_check',
      sql`${table.subscriptionStatus} IN ('active', 'canceled', 'past_due', 'unpaid')`),
  };
});

// Evaluations table
export const evaluations = pgTable('evaluations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  
  // Ad Data (updated for screenshot-only workflow)
  platform: text('platform').default('meta').notNull(),
  adScreenshotUrl: text('ad_screenshot_url').notNull(),
  
  // Landing Page Data
  landingPageUrl: text('landing_page_url').notNull(),
  landingPageTitle: text('landing_page_title'),
  landingPageContent: text('landing_page_content'),
  landingPageCta: text('landing_page_cta'),
  
  // Audience Data
  targetAgeRange: text('target_age_range'),
  targetGender: text('target_gender'),
  targetLocation: text('target_location'),
  targetInterests: text('target_interests'),
  
  // Results
  overallScore: decimal('overall_score', { precision: 3, scale: 1 }).notNull(),
  visualMatchScore: decimal('visual_match_score', { precision: 3, scale: 1 }).notNull(),
  contextualMatchScore: decimal('contextual_match_score', { precision: 3, scale: 1 }).notNull(),
  toneAlignmentScore: decimal('tone_alignment_score', { precision: 3, scale: 1 }).notNull(),
  
  // AI Analysis (stored as JSONB for flexibility)
  visualSuggestions: jsonb('visual_suggestions'),
  contextualSuggestions: jsonb('contextual_suggestions'),
  toneSuggestions: jsonb('tone_suggestions'),
  
  // Metadata
  analysisModel: text('analysis_model').default('gpt-4o'),
  processingTimeMs: integer('processing_time_ms'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    platformCheck: check('platform_check',
      sql`${table.platform} IN ('meta', 'tiktok', 'linkedin', 'google', 'reddit')`),
    overallScoreCheck: check('overall_score_check',
      sql`${table.overallScore} >= 0 AND ${table.overallScore} <= 10`),
    visualScoreCheck: check('visual_score_check',
      sql`${table.visualMatchScore} >= 0 AND ${table.visualMatchScore} <= 10`),
    contextualScoreCheck: check('contextual_score_check',
      sql`${table.contextualMatchScore} >= 0 AND ${table.contextualMatchScore} <= 10`),
    toneScoreCheck: check('tone_score_check',
      sql`${table.toneAlignmentScore} >= 0 AND ${table.toneAlignmentScore} <= 10`),
  };
});

// User usage tracking for freemium model
export const userUsage = pgTable('user_usage', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  monthYear: text('month_year').notNull(), // Format: 'YYYY-MM'
  evaluationsUsed: integer('evaluations_used').default(0).notNull(),
  evaluationsLimit: integer('evaluations_limit').default(1).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    uniqueUserMonth: unique().on(table.userId, table.monthYear),
  };
});

// Evaluation comparisons (for A/B testing)
export const evaluationComparisons = pgTable('evaluation_comparisons', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  evaluationIds: text('evaluation_ids'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Usage analytics
export const usageAnalytics = pgTable('usage_analytics', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  action: text('action').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    actionCheck: check('action_check',
      sql`${table.action} IN ('evaluation_created', 'export_results', 'comparison_created', 'dashboard_viewed', 'login', 'signup')`),
  };
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertEvaluationSchema = createInsertSchema(evaluations);
export const selectEvaluationSchema = createSelectSchema(evaluations);

export const insertUserUsageSchema = createInsertSchema(userUsage);
export const selectUserUsageSchema = createSelectSchema(userUsage);

export const insertUsageAnalyticsSchema = createInsertSchema(usageAnalytics);
export const selectUsageAnalyticsSchema = createSelectSchema(usageAnalytics);

// Types
export type User = z.infer<typeof selectUserSchema>;
export type NewUser = z.infer<typeof insertUserSchema>;

export type Evaluation = z.infer<typeof selectEvaluationSchema>;
export type NewEvaluation = z.infer<typeof insertEvaluationSchema>;

export type UserUsage = z.infer<typeof selectUserUsageSchema>;
export type NewUserUsage = z.infer<typeof insertUserUsageSchema>;

export type UsageAnalytic = z.infer<typeof selectUsageAnalyticsSchema>;
export type NewUsageAnalytic = z.infer<typeof insertUsageAnalyticsSchema>;