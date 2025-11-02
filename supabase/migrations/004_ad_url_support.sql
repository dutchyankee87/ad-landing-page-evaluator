-- Migration: Add support for ad library URLs
-- Date: 2025-01-XX
-- Description: Add fields to support ad library URLs as alternative to file uploads

-- Add columns for ad URL support
ALTER TABLE evaluations 
ADD COLUMN ad_url TEXT,
ADD COLUMN ad_source_type TEXT DEFAULT 'upload' CHECK (ad_source_type IN ('upload', 'url'));

-- Add index for ad URLs
CREATE INDEX idx_evaluations_ad_url ON evaluations(ad_url) WHERE ad_url IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN evaluations.ad_url IS 'URL from ad library (Meta, TikTok, Google, LinkedIn, Reddit) when using URL input method';
COMMENT ON COLUMN evaluations.ad_source_type IS 'Source of ad asset: upload (file upload) or url (ad library URL)';

-- Update the updated_at timestamp trigger to include new columns
-- (This ensures updated_at is updated when these fields change)