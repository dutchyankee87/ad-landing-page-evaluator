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

// Simplified evaluations table for Option 1: In-memory processing + URL analytics
export const evaluations = pgTable('evaluations', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  
  // Core evaluation data
  platform: text('platform').default('meta').notNull(),
  landingPageUrl: text('landing_page_url').notNull(),
  overallScore: decimal('overall_score', { precision: 3, scale: 1 }).notNull(),
  
  // Analysis results stored as JSON (no file storage needed)
  gpt4Analysis: jsonb('gpt4_analysis').notNull(), // Full GPT-4 Vision response
  persuasionPrinciples: jsonb('persuasion_principles'), // Cialdini's principles
  recommendations: jsonb('recommendations'), // Actionable recommendations
  
  // Auto-detected classification for basic analytics
  industry: text('industry'), // Auto-detected industry
  audienceType: text('audience_type'), // B2B, B2C, etc.
  
  // Performance metadata
  processingTimeMs: integer('processing_time_ms'),
  aiCost: decimal('ai_cost', { precision: 6, scale: 4 }),
  usedAi: boolean('used_ai').default(true).notNull(),
  
  // Anonymous usage analytics (privacy-friendly)
  userAgent: text('user_agent'), // Browser/device info
  referrer: text('referrer'), // Traffic source
  ipHash: text('ip_hash'), // Anonymized IP for basic geo analytics
  
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
}, (table) => {
  return {
    createdAtIdx: index('idx_evaluations_created_at').on(table.createdAt),
    platformIdx: index('idx_evaluations_platform').on(table.platform),
    industryIdx: index('idx_evaluations_industry').on(table.industry),
    landingPageUrlIdx: index('idx_evaluations_landing_page_url').on(table.landingPageUrl),
  };
});

// Optional: Simple analytics table for popular landing pages
export const landingPageAnalytics = pgTable('landing_page_analytics', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  landingPageUrl: text('landing_page_url').unique().notNull(),
  evaluationCount: integer('evaluation_count').default(1).notNull(),
  avgScore: decimal('avg_score', { precision: 3, scale: 1 }),
  lastEvaluated: timestamp('last_evaluated', { withTimezone: true }).default(sql`NOW()`).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
}, (table) => {
  return {
    urlIdx: index('idx_landing_page_url').on(table.landingPageUrl),
    lastEvaluatedIdx: index('idx_last_evaluated').on(table.lastEvaluated),
  };
});

// Zod schemas for validation
export const insertEvaluationSchema = createInsertSchema(evaluations);
export const selectEvaluationSchema = createSelectSchema(evaluations);
export const insertLandingPageAnalyticsSchema = createInsertSchema(landingPageAnalytics);
export const selectLandingPageAnalyticsSchema = createSelectSchema(landingPageAnalytics);

// TypeScript types
export type Evaluation = typeof evaluations.$inferSelect;
export type NewEvaluation = typeof evaluations.$inferInsert;
export type LandingPageAnalytics = typeof landingPageAnalytics.$inferSelect;
export type NewLandingPageAnalytics = typeof landingPageAnalytics.$inferInsert;

// Platform constants
export const PLATFORMS = [
  'meta',
  'tiktok', 
  'linkedin',
  'reddit',
  'google'
] as const;

export type Platform = typeof PLATFORMS[number];

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

// Persuasion principles interface
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