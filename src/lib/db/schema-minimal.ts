import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
  decimal,
  jsonb,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

// Minimal evaluations table: Just ad + URL + results
export const evaluations = pgTable('evaluations', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  
  // Input data (not stored, just for analytics)
  platform: text('platform').default('meta').notNull(),
  landingPageUrl: text('landing_page_url').notNull(),
  
  // Results only - no file storage
  overallScore: decimal('overall_score', { precision: 3, scale: 1 }).notNull(),
  analysisResults: jsonb('analysis_results').notNull(), // Full GPT-4 response
  
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
}, (table) => {
  return {
    createdAtIdx: index('idx_evaluations_created_at').on(table.createdAt),
    platformIdx: index('idx_evaluations_platform').on(table.platform),
  };
});

// Zod schemas
export const insertEvaluationSchema = createInsertSchema(evaluations);
export const selectEvaluationSchema = createSelectSchema(evaluations);

// TypeScript types
export type Evaluation = typeof evaluations.$inferSelect;
export type NewEvaluation = typeof evaluations.$inferInsert;

// Platform constants
export const PLATFORMS = ['meta', 'tiktok', 'linkedin', 'reddit', 'google'] as const;
export type Platform = typeof PLATFORMS[number];

// Analysis result structure
export interface AnalysisResults {
  visualScore: number;
  contextualScore: number;
  toneScore: number;
  recommendations: string[];
  persuasionPrinciples: {
    reciprocity: { score: string; analysis: string; };
    commitment: { score: string; analysis: string; };
    socialProof: { score: string; analysis: string; };
    authority: { score: string; analysis: string; };
    liking: { score: string; analysis: string; };
    scarcity: { score: string; analysis: string; };
  };
}