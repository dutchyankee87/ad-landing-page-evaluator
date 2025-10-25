-- Migration: Add visual asset storage fields to evaluations table
-- Run this in Supabase SQL Editor

-- Add new columns to evaluations table for storing asset URLs and metadata
ALTER TABLE evaluations 
ADD COLUMN IF NOT EXISTS ad_image_file_size INTEGER;

ALTER TABLE evaluations 
ADD COLUMN IF NOT EXISTS landing_page_screenshot_url TEXT;

ALTER TABLE evaluations 
ADD COLUMN IF NOT EXISTS landing_page_screenshot_path TEXT;

ALTER TABLE evaluations 
ADD COLUMN IF NOT EXISTS screenshot_file_size INTEGER;

ALTER TABLE evaluations 
ADD COLUMN IF NOT EXISTS screenshot_captured_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE evaluations 
ADD COLUMN IF NOT EXISTS screenshot_is_placeholder BOOLEAN DEFAULT FALSE;

-- Add comments for documentation
COMMENT ON COLUMN evaluations.ad_image_file_size IS 'Size of the uploaded ad image in bytes';
COMMENT ON COLUMN evaluations.landing_page_screenshot_url IS 'Public URL of the captured landing page screenshot';
COMMENT ON COLUMN evaluations.landing_page_screenshot_path IS 'Storage path for the landing page screenshot';
COMMENT ON COLUMN evaluations.screenshot_file_size IS 'Size of the screenshot file in bytes';
COMMENT ON COLUMN evaluations.screenshot_captured_at IS 'Timestamp when the screenshot was captured';
COMMENT ON COLUMN evaluations.screenshot_is_placeholder IS 'Whether the screenshot is a placeholder (failed capture)';

-- Update the visual analysis score columns for better granularity
ALTER TABLE evaluations 
ADD COLUMN IF NOT EXISTS visual_score DECIMAL(3,1);

ALTER TABLE evaluations 
ADD COLUMN IF NOT EXISTS contextual_score DECIMAL(3,1);

ALTER TABLE evaluations 
ADD COLUMN IF NOT EXISTS tone_score DECIMAL(3,1);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_evaluations_ad_image_url ON evaluations(ad_image_url);
CREATE INDEX IF NOT EXISTS idx_evaluations_screenshot_url ON evaluations(landing_page_screenshot_url);
CREATE INDEX IF NOT EXISTS idx_evaluations_screenshot_captured ON evaluations(screenshot_captured_at);
CREATE INDEX IF NOT EXISTS idx_evaluations_visual_score ON evaluations(visual_score);
CREATE INDEX IF NOT EXISTS idx_evaluations_contextual_score ON evaluations(contextual_score);
CREATE INDEX IF NOT EXISTS idx_evaluations_tone_score ON evaluations(tone_score);

-- Create a view for easy analytics queries
CREATE OR REPLACE VIEW evaluation_analytics AS
SELECT 
  id,
  platform,
  industry,
  overall_score,
  visual_score,
  contextual_score,
  tone_score,
  CASE 
    WHEN ad_image_url IS NOT NULL THEN 'uploaded'
    ELSE 'missing'
  END as ad_image_status,
  CASE 
    WHEN landing_page_screenshot_url IS NOT NULL AND NOT screenshot_is_placeholder THEN 'captured'
    WHEN landing_page_screenshot_url IS NOT NULL AND screenshot_is_placeholder THEN 'placeholder'
    ELSE 'missing'
  END as screenshot_status,
  ad_image_file_size,
  screenshot_file_size,
  created_at
FROM evaluations
WHERE created_at >= NOW() - INTERVAL '30 days';

-- Grant access to the view
GRANT SELECT ON evaluation_analytics TO authenticated;
GRANT SELECT ON evaluation_analytics TO anon;