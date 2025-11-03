-- Add video processing support to evaluations table
-- Migration: 005_video_support.sql

-- Add video-related fields to evaluations table
ALTER TABLE evaluations 
ADD COLUMN IF NOT EXISTS media_type TEXT CHECK (media_type IN ('image', 'video', 'unknown')),
ADD COLUMN IF NOT EXISTS video_frame_count INTEGER,
ADD COLUMN IF NOT EXISTS video_processing_method TEXT;

-- Update existing records to have media_type = 'image' by default
UPDATE evaluations 
SET media_type = 'image' 
WHERE media_type IS NULL;

-- Add index for media type queries
CREATE INDEX IF NOT EXISTS idx_evaluations_media_type ON evaluations(media_type);

-- Add index for video processing method
CREATE INDEX IF NOT EXISTS idx_evaluations_video_method ON evaluations(video_processing_method);

-- Update ad_source_type to include 'video' option
-- Note: This field already exists, just documenting the values
-- Possible values: 'upload', 'url', 'video'

-- Add comment for documentation
COMMENT ON COLUMN evaluations.media_type IS 'Type of media analyzed: image, video, or unknown';
COMMENT ON COLUMN evaluations.video_frame_count IS 'Number of frames extracted from video (null for non-video ads)';
COMMENT ON COLUMN evaluations.video_processing_method IS 'Method used for video processing (e.g., video_screenshot, bannerbear, etc.)';
COMMENT ON COLUMN evaluations.ad_source_type IS 'Source of ad asset: upload (user uploaded), url (screenshot from URL), video (processed from video URL)';

-- Create view for video analytics
CREATE OR REPLACE VIEW video_analytics AS
SELECT 
    DATE_TRUNC('month', created_at) as month,
    platform,
    media_type,
    video_processing_method,
    COUNT(*) as evaluation_count,
    AVG(overall_score) as avg_score,
    AVG(video_frame_count) as avg_frame_count
FROM evaluations 
WHERE media_type = 'video'
GROUP BY month, platform, media_type, video_processing_method
ORDER BY month DESC, evaluation_count DESC;