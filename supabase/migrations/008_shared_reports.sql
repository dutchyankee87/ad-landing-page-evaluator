-- Migration: Add Shared Reports functionality
-- Adds shared_reports table for secure report sharing

-- Create shared_reports table
CREATE TABLE IF NOT EXISTS public.shared_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  share_token TEXT UNIQUE NOT NULL,
  evaluation_id UUID REFERENCES public.evaluations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sanitized_data JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  view_count INTEGER DEFAULT 0 NOT NULL,
  last_viewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_shared_reports_token ON public.shared_reports(share_token);
CREATE INDEX IF NOT EXISTS idx_shared_reports_evaluation ON public.shared_reports(evaluation_id);
CREATE INDEX IF NOT EXISTS idx_shared_reports_expires ON public.shared_reports(expires_at);

-- Add updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_shared_reports_view_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_viewed_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add comment for documentation
COMMENT ON TABLE public.shared_reports IS 'Stores sanitized report data for secure public sharing';
COMMENT ON COLUMN public.shared_reports.share_token IS 'URL-safe unique token for accessing shared reports';
COMMENT ON COLUMN public.shared_reports.sanitized_data IS 'Cleaned evaluation data with no personal information';
COMMENT ON COLUMN public.shared_reports.expires_at IS 'Expiration timestamp for automatic cleanup';

-- Create a function to automatically clean up expired shares
CREATE OR REPLACE FUNCTION cleanup_expired_shares()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.shared_reports 
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions for API access
-- Note: In production, these would be more restrictive
GRANT SELECT, INSERT, UPDATE ON public.shared_reports TO postgres;
GRANT SELECT, INSERT, UPDATE ON public.shared_reports TO service_role;

-- Create RLS policies for security
ALTER TABLE public.shared_reports ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to non-expired shares
CREATE POLICY "Allow public read of non-expired shares" ON public.shared_reports
  FOR SELECT
  USING (expires_at > NOW());

-- Policy: Allow service role full access
CREATE POLICY "Service role full access" ON public.shared_reports
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add a view for active (non-expired) shared reports
CREATE OR REPLACE VIEW public.active_shared_reports AS
SELECT 
  id,
  share_token,
  evaluation_id,
  title,
  sanitized_data,
  expires_at,
  view_count,
  last_viewed_at,
  created_at,
  EXTRACT(EPOCH FROM (expires_at - NOW())) / 3600 AS hours_until_expiry
FROM public.shared_reports
WHERE expires_at > NOW()
ORDER BY created_at DESC;