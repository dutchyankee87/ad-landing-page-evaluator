import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  index,
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
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
}, (table) => {
  return {
    userIdIdx: index('idx_evaluations_user_id').on(table.userId),
    createdAtIdx: index('idx_evaluations_created_at').on(table.createdAt),
  };
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertEvaluationSchema = createInsertSchema(evaluations);
export const selectEvaluationSchema = createSelectSchema(evaluations);

// TypeScript types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Evaluation = typeof evaluations.$inferSelect;
export type NewEvaluation = typeof evaluations.$inferInsert;

// Business logic helpers
export const TIER_LIMITS = {
  free: 1,
  pro: 50,
  enterprise: 1000,
} as const;

export type UserTier = keyof typeof TIER_LIMITS;