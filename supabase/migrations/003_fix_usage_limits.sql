-- Migration: Fix Usage Limits to Match Frontend
-- Updates database function limits to align with usage-tracking.ts

-- Update the can_user_evaluate function with correct limits
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
  
  -- Get or create usage record for current month with correct limits
  INSERT INTO public.user_usage (user_id, month_year, evaluations_limit)
  VALUES (
    user_id_param, 
    current_month,
    CASE 
      WHEN user_tier = 'free' THEN 3        -- Updated from 1
      WHEN user_tier = 'pro' THEN 50        -- Updated from 1000
      WHEN user_tier = 'agency' THEN 200    -- Added missing tier
      WHEN user_tier = 'enterprise' THEN 1000 -- Updated from 10000
      ELSE 3
    END
  )
  ON CONFLICT (user_id, month_year) 
  DO UPDATE SET 
    evaluations_limit = CASE 
      WHEN user_tier = 'free' THEN 3        -- Updated from 1
      WHEN user_tier = 'pro' THEN 50        -- Updated from 1000
      WHEN user_tier = 'agency' THEN 200    -- Added missing tier
      WHEN user_tier = 'enterprise' THEN 1000 -- Updated from 10000
      ELSE 3
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

-- Add agency tier to subscription_tier constraint if needed
ALTER TABLE public.users 
DROP CONSTRAINT IF EXISTS users_subscription_tier_check;

ALTER TABLE public.users 
ADD CONSTRAINT users_subscription_tier_check 
CHECK (subscription_tier IN ('free', 'pro', 'agency', 'enterprise'));

-- Comment on the migration
COMMENT ON FUNCTION public.can_user_evaluate(UUID) IS 
'Updated usage limits to match frontend usage-tracking.ts: free=3, pro=50, agency=200, enterprise=1000';