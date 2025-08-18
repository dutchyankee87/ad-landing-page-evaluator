-- Migration: Platform Support and Usage Limits
-- Updates the schema for multi-platform support and freemium model

-- Add platform support to evaluations table
ALTER TABLE public.evaluations 
ADD COLUMN IF NOT EXISTS platform TEXT DEFAULT 'meta' CHECK (platform IN ('meta', 'tiktok', 'linkedin', 'google', 'reddit'));

-- Update evaluations table for screenshot-only workflow
ALTER TABLE public.evaluations 
DROP COLUMN IF EXISTS ad_headline,
DROP COLUMN IF EXISTS ad_description;

-- Rename ad_image_url to ad_screenshot_url for clarity
ALTER TABLE public.evaluations 
RENAME COLUMN ad_image_url TO ad_screenshot_url;

-- Add usage tracking for freemium model
CREATE TABLE IF NOT EXISTS public.user_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  month_year TEXT NOT NULL, -- Format: 'YYYY-MM'
  evaluations_used INTEGER DEFAULT 0,
  evaluations_limit INTEGER DEFAULT 1, -- Free tier gets 1/month
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, month_year)
);

-- Add updated_at trigger to user_usage table
CREATE TRIGGER update_user_usage_updated_at 
  BEFORE UPDATE ON public.user_usage 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_usage_user_id ON public.user_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_user_usage_month_year ON public.user_usage(month_year);
CREATE INDEX IF NOT EXISTS idx_evaluations_platform ON public.evaluations(platform);

-- Add subscription management fields to users
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'unpaid')),
ADD COLUMN IF NOT EXISTS subscription_current_period_end TIMESTAMP WITH TIME ZONE;

-- Update analysis model field for new GPT-4o (includes vision)
ALTER TABLE public.evaluations 
ALTER COLUMN analysis_model SET DEFAULT 'gpt-4o';

-- Function to check if user can perform evaluation
CREATE OR REPLACE FUNCTION public.can_user_evaluate(user_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_month TEXT;
  user_tier TEXT;
  usage_count INTEGER;
  usage_limit INTEGER;
BEGIN
  -- Get current month in YYYY-MM format
  current_month := to_char(NOW(), 'YYYY-MM');
  
  -- Get user subscription tier
  SELECT subscription_tier INTO user_tier 
  FROM public.users 
  WHERE id = user_id_param;
  
  -- Get or create usage record for current month
  INSERT INTO public.user_usage (user_id, month_year, evaluations_limit)
  VALUES (
    user_id_param, 
    current_month,
    CASE 
      WHEN user_tier = 'pro' THEN 1000
      WHEN user_tier = 'enterprise' THEN 10000
      ELSE 1
    END
  )
  ON CONFLICT (user_id, month_year) 
  DO UPDATE SET 
    evaluations_limit = CASE 
      WHEN user_tier = 'pro' THEN 1000
      WHEN user_tier = 'enterprise' THEN 10000
      ELSE 1
    END;
  
  -- Get current usage
  SELECT evaluations_used, evaluations_limit 
  INTO usage_count, usage_limit
  FROM public.user_usage 
  WHERE user_id = user_id_param AND month_year = current_month;
  
  -- Return true if under limit
  RETURN usage_count < usage_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment user evaluation count
CREATE OR REPLACE FUNCTION public.increment_user_evaluation(user_id_param UUID)
RETURNS VOID AS $$
DECLARE
  current_month TEXT;
BEGIN
  current_month := to_char(NOW(), 'YYYY-MM');
  
  UPDATE public.user_usage 
  SET evaluations_used = evaluations_used + 1
  WHERE user_id = user_id_param AND month_year = current_month;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create view for user evaluation limits
CREATE OR REPLACE VIEW public.user_usage_summary AS
SELECT 
  u.id as user_id,
  u.email,
  u.subscription_tier,
  u.subscription_status,
  uu.month_year,
  uu.evaluations_used,
  uu.evaluations_limit,
  (uu.evaluations_limit - uu.evaluations_used) as evaluations_remaining,
  (uu.evaluations_used >= uu.evaluations_limit) as is_over_limit
FROM public.users u
LEFT JOIN public.user_usage uu ON u.id = uu.user_id 
  AND uu.month_year = to_char(NOW(), 'YYYY-MM');

-- Update the user_evaluation_stats view to include platform breakdown
DROP VIEW IF EXISTS public.user_evaluation_stats;
CREATE OR REPLACE VIEW public.user_evaluation_stats AS
SELECT 
  u.id as user_id,
  u.email,
  u.subscription_tier,
  COUNT(e.id) as total_evaluations,
  COUNT(e.id) FILTER (WHERE e.platform = 'meta') as meta_evaluations,
  COUNT(e.id) FILTER (WHERE e.platform = 'tiktok') as tiktok_evaluations,
  COUNT(e.id) FILTER (WHERE e.platform = 'linkedin') as linkedin_evaluations,
  COUNT(e.id) FILTER (WHERE e.platform = 'google') as google_evaluations,
  COUNT(e.id) FILTER (WHERE e.platform = 'reddit') as reddit_evaluations,
  AVG(e.overall_score) as avg_score,
  MAX(e.created_at) as last_evaluation_date,
  u.created_at as user_created_at
FROM public.users u
LEFT JOIN public.evaluations e ON u.id = e.user_id
GROUP BY u.id, u.email, u.subscription_tier, u.created_at;