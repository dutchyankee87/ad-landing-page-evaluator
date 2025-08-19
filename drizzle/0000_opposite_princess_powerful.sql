CREATE TABLE "evaluation_comparisons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"evaluation_ids" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evaluations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"title" text NOT NULL,
	"platform" text DEFAULT 'meta' NOT NULL,
	"ad_screenshot_url" text NOT NULL,
	"landing_page_url" text NOT NULL,
	"landing_page_title" text,
	"landing_page_content" text,
	"landing_page_cta" text,
	"target_age_range" text,
	"target_gender" text,
	"target_location" text,
	"target_interests" text,
	"overall_score" numeric(3, 1) NOT NULL,
	"visual_match_score" numeric(3, 1) NOT NULL,
	"contextual_match_score" numeric(3, 1) NOT NULL,
	"tone_alignment_score" numeric(3, 1) NOT NULL,
	"visual_suggestions" jsonb,
	"contextual_suggestions" jsonb,
	"tone_suggestions" jsonb,
	"analysis_model" text DEFAULT 'gpt-4o',
	"processing_time_ms" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "platform_check" CHECK ("evaluations"."platform" IN ('meta', 'tiktok', 'linkedin', 'google', 'reddit')),
	CONSTRAINT "overall_score_check" CHECK ("evaluations"."overall_score" >= 0 AND "evaluations"."overall_score" <= 10),
	CONSTRAINT "visual_score_check" CHECK ("evaluations"."visual_match_score" >= 0 AND "evaluations"."visual_match_score" <= 10),
	CONSTRAINT "contextual_score_check" CHECK ("evaluations"."contextual_match_score" >= 0 AND "evaluations"."contextual_match_score" <= 10),
	CONSTRAINT "tone_score_check" CHECK ("evaluations"."tone_alignment_score" >= 0 AND "evaluations"."tone_alignment_score" <= 10)
);
--> statement-breakpoint
CREATE TABLE "usage_analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"action" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "action_check" CHECK ("usage_analytics"."action" IN ('evaluation_created', 'export_results', 'comparison_created', 'dashboard_viewed', 'login', 'signup'))
);
--> statement-breakpoint
CREATE TABLE "user_usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"month_year" text NOT NULL,
	"evaluations_used" integer DEFAULT 0 NOT NULL,
	"evaluations_limit" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_usage_user_id_month_year_unique" UNIQUE("user_id","month_year")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"full_name" text,
	"company" text,
	"subscription_tier" text DEFAULT 'free' NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"subscription_status" text DEFAULT 'active',
	"subscription_current_period_end" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "subscription_tier_check" CHECK ("users"."subscription_tier" IN ('free', 'pro', 'enterprise')),
	CONSTRAINT "subscription_status_check" CHECK ("users"."subscription_status" IN ('active', 'canceled', 'past_due', 'unpaid'))
);
--> statement-breakpoint
ALTER TABLE "evaluation_comparisons" ADD CONSTRAINT "evaluation_comparisons_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_analytics" ADD CONSTRAINT "usage_analytics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_usage" ADD CONSTRAINT "user_usage_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;