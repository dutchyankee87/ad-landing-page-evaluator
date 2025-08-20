-- Initial migration for ad evaluator schema
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"tier" text DEFAULT 'free' NOT NULL,
	"monthly_evaluations" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT NOW() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT NOW() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

CREATE TABLE IF NOT EXISTS "evaluations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"platform" text DEFAULT 'meta' NOT NULL,
	"ad_screenshot_url" text NOT NULL,
	"landing_page_url" text NOT NULL,
	"overall_score" integer NOT NULL,
	"visual_score" integer NOT NULL,
	"contextual_score" integer NOT NULL,
	"tone_score" integer NOT NULL,
	"used_ai" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT NOW() NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users" ("email");
CREATE INDEX IF NOT EXISTS "idx_evaluations_user_id" ON "evaluations" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_evaluations_created_at" ON "evaluations" ("created_at");

-- Add tier constraint
ALTER TABLE "users" ADD CONSTRAINT "users_tier_check" CHECK ("tier" IN ('free', 'pro', 'enterprise'));