-- Initial database schema for Ad Landing Page Evaluator
-- This creates the core tables for user data, evaluations, comparisons, and analytics

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at trigger to users table
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON public.users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Evaluations table
CREATE TABLE IF NOT EXISTS public.evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  
  -- Ad Data
  ad_headline TEXT NOT NULL,
  ad_description TEXT NOT NULL,
  ad_image_url TEXT NOT NULL,
  
  -- Landing Page Data
  landing_page_url TEXT NOT NULL,
  landing_page_title TEXT,
  landing_page_content TEXT,
  landing_page_cta TEXT,
  
  -- Audience Data
  target_age_range TEXT,
  target_gender TEXT,
  target_location TEXT,
  target_interests TEXT,
  
  -- Results
  overall_score DECIMAL(3,1) NOT NULL CHECK (overall_score >= 0 AND overall_score <= 10),
  visual_match_score DECIMAL(3,1) NOT NULL CHECK (visual_match_score >= 0 AND visual_match_score <= 10),
  contextual_match_score DECIMAL(3,1) NOT NULL CHECK (contextual_match_score >= 0 AND contextual_match_score <= 10),
  tone_alignment_score DECIMAL(3,1) NOT NULL CHECK (tone_alignment_score >= 0 AND tone_alignment_score <= 10),
  
  -- AI Analysis (stored as JSONB for flexibility)
  visual_suggestions JSONB,
  contextual_suggestions JSONB,
  tone_suggestions JSONB,
  
  -- Metadata
  analysis_model TEXT DEFAULT 'gpt-4-turbo-preview',
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add updated_at trigger to evaluations table
CREATE TRIGGER update_evaluations_updated_at 
  BEFORE UPDATE ON public.evaluations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_evaluations_user_id ON public.evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_created_at ON public.evaluations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_evaluations_overall_score ON public.evaluations(overall_score DESC);

-- Evaluation comparisons (for A/B testing)
CREATE TABLE IF NOT EXISTS public.evaluation_comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  evaluation_ids UUID[] NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evaluation_comparisons_user_id ON public.evaluation_comparisons(user_id);

-- Usage analytics
CREATE TABLE IF NOT EXISTS public.usage_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('evaluation_created', 'export_results', 'comparison_created', 'dashboard_viewed', 'login', 'signup')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usage_analytics_user_id ON public.usage_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_analytics_action ON public.usage_analytics(action);
CREATE INDEX IF NOT EXISTS idx_usage_analytics_created_at ON public.usage_analytics(created_at DESC);

-- Add some useful views for analytics
CREATE OR REPLACE VIEW public.user_evaluation_stats AS
SELECT 
  u.id as user_id,
  u.email,
  u.subscription_tier,
  COUNT(e.id) as total_evaluations,
  AVG(e.overall_score) as avg_score,
  MAX(e.created_at) as last_evaluation_date,
  u.created_at as user_created_at
FROM public.users u
LEFT JOIN public.evaluations e ON u.id = e.user_id
GROUP BY u.id, u.email, u.subscription_tier, u.created_at;

-- View for recent activity
CREATE OR REPLACE VIEW public.recent_activity AS
SELECT 
  ua.user_id,
  ua.action,
  ua.metadata,
  ua.created_at,
  u.email
FROM public.usage_analytics ua
JOIN public.users u ON ua.user_id = u.id
ORDER BY ua.created_at DESC;