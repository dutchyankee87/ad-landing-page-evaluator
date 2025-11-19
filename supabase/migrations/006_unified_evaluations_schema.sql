-- Migration: Unified Evaluations Schema
-- Adds missing columns to support comprehensive evaluation data storage
-- Fixes schema mismatches between Edge Function and database

-- Add missing columns to evaluations table for comprehensive analysis
ALTER TABLE public.evaluations 
ADD COLUMN IF NOT EXISTS platform TEXT,
ADD COLUMN IF NOT EXISTS ad_url TEXT,
ADD COLUMN IF NOT EXISTS ad_source_type TEXT CHECK (ad_source_type IN ('upload', 'url', 'video')),
ADD COLUMN IF NOT EXISTS media_type TEXT CHECK (media_type IN ('image', 'video', 'unknown')),
ADD COLUMN IF NOT EXISTS video_frame_count INTEGER,
ADD COLUMN IF NOT EXISTS video_processing_method TEXT,
ADD COLUMN IF NOT EXISTS ad_image_file_size INTEGER,
ADD COLUMN IF NOT EXISTS landing_page_screenshot_url TEXT,
ADD COLUMN IF NOT EXISTS landing_page_screenshot_path TEXT,
ADD COLUMN IF NOT EXISTS screenshot_file_size INTEGER,
ADD COLUMN IF NOT EXISTS screenshot_captured_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS screenshot_is_placeholder BOOLEAN DEFAULT false;

-- Add comparison and advanced analysis support
ALTER TABLE public.evaluations
ADD COLUMN IF NOT EXISTS comparison_type TEXT DEFAULT 'single' CHECK (comparison_type IN ('single', 'a_b_test', 'multi_variant')),
ADD COLUMN IF NOT EXISTS comparison_group_id UUID,
ADD COLUMN IF NOT EXISTS element_comparisons JSONB,
ADD COLUMN IF NOT EXISTS strategic_recommendations JSONB,
ADD COLUMN IF NOT EXISTS risk_factors JSONB,
ADD COLUMN IF NOT EXISTS missed_opportunities JSONB,
ADD COLUMN IF NOT EXISTS heatmap_zones JSONB,
ADD COLUMN IF NOT EXISTS insights JSONB;

-- Add component scores for better granular analysis
ALTER TABLE public.evaluations
ADD COLUMN IF NOT EXISTS brand_coherence_score DECIMAL(3,1) CHECK (brand_coherence_score >= 0 AND brand_coherence_score <= 10),
ADD COLUMN IF NOT EXISTS user_journey_alignment_score DECIMAL(3,1) CHECK (user_journey_alignment_score >= 0 AND user_journey_alignment_score <= 10),
ADD COLUMN IF NOT EXISTS conversion_optimization_score DECIMAL(3,1) CHECK (conversion_optimization_score >= 0 AND conversion_optimization_score <= 10);

-- Create index for comparison groups
CREATE INDEX IF NOT EXISTS idx_evaluations_comparison_group ON public.evaluations(comparison_group_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_comparison_type ON public.evaluations(comparison_type);
CREATE INDEX IF NOT EXISTS idx_evaluations_platform ON public.evaluations(platform);

-- Update the user evaluation stats view to include new data
DROP VIEW IF EXISTS public.user_evaluation_stats;
CREATE OR REPLACE VIEW public.user_evaluation_stats AS
SELECT 
  u.id as user_id,
  u.email,
  u.subscription_tier,
  COUNT(e.id) as total_evaluations,
  COUNT(CASE WHEN e.comparison_type = 'single' THEN 1 END) as single_evaluations,
  COUNT(CASE WHEN e.comparison_type IN ('a_b_test', 'multi_variant') THEN 1 END) as comparison_evaluations,
  AVG(e.overall_score) as avg_score,
  AVG(e.visual_match_score) as avg_visual_score,
  AVG(e.contextual_match_score) as avg_contextual_score,
  AVG(e.tone_alignment_score) as avg_tone_score,
  MAX(e.created_at) as last_evaluation_date,
  u.created_at as user_created_at,
  -- Platform breakdown
  COUNT(CASE WHEN e.platform = 'meta' THEN 1 END) as meta_evaluations,
  COUNT(CASE WHEN e.platform = 'google' THEN 1 END) as google_evaluations,
  COUNT(CASE WHEN e.platform = 'tiktok' THEN 1 END) as tiktok_evaluations,
  COUNT(CASE WHEN e.platform = 'linkedin' THEN 1 END) as linkedin_evaluations,
  COUNT(CASE WHEN e.platform = 'reddit' THEN 1 END) as reddit_evaluations
FROM public.users u
LEFT JOIN public.evaluations e ON u.id = e.user_id
GROUP BY u.id, u.email, u.subscription_tier, u.created_at;

-- Create view for element comparison analytics
CREATE OR REPLACE VIEW public.element_comparison_stats AS
SELECT 
  platform,
  jsonb_array_elements(element_comparisons) ->> 'element' as element_name,
  jsonb_array_elements(element_comparisons) ->> 'status' as status,
  jsonb_array_elements(element_comparisons) ->> 'severity' as severity,
  jsonb_array_elements(element_comparisons) ->> 'category' as category,
  COUNT(*) as occurrence_count,
  AVG((jsonb_array_elements(element_comparisons) ->> 'colorAnalysis' -> 'matchScore')::decimal) as avg_color_match_score
FROM public.evaluations 
WHERE element_comparisons IS NOT NULL
GROUP BY platform, element_name, status, severity, category;

-- Create comparison groups table for better A/B testing support
CREATE TABLE IF NOT EXISTS public.comparison_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add trigger for comparison groups updated_at
CREATE TRIGGER update_comparison_groups_updated_at 
  BEFORE UPDATE ON public.comparison_groups 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add foreign key constraint for comparison_group_id
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'evaluations_comparison_group_fkey'
  ) THEN
    ALTER TABLE public.evaluations 
    ADD CONSTRAINT evaluations_comparison_group_fkey 
    FOREIGN KEY (comparison_group_id) REFERENCES public.comparison_groups(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create indexes for new tables
CREATE INDEX IF NOT EXISTS idx_comparison_groups_user_id ON public.comparison_groups(user_id);
CREATE INDEX IF NOT EXISTS idx_comparison_groups_status ON public.comparison_groups(status);

COMMENT ON TABLE public.evaluations IS 'Unified table storing all evaluation data including single evaluations and A/B test comparisons';
COMMENT ON COLUMN public.evaluations.comparison_type IS 'Type of evaluation: single (individual ad), a_b_test (2 ads), multi_variant (3+ ads)';
COMMENT ON COLUMN public.evaluations.comparison_group_id IS 'Groups related evaluations together for A/B testing';
COMMENT ON COLUMN public.evaluations.element_comparisons IS 'Detailed element-by-element comparison analysis from AI';
COMMENT ON TABLE public.comparison_groups IS 'Groups of evaluations for organized A/B testing and comparison analysis';