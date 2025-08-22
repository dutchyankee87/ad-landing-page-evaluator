-- Migration: Add data flywheel tables for performance tracking and benchmarking
-- Created: 2025-01-22

-- Add new columns to existing evaluations table
ALTER TABLE evaluations 
ADD COLUMN industry TEXT,
ADD COLUMN audience_type TEXT,
ADD COLUMN campaign_objective TEXT,
ADD COLUMN micro_scores JSONB;

-- Add new indexes for evaluations table
CREATE INDEX idx_evaluations_platform ON evaluations(platform);
CREATE INDEX idx_evaluations_industry ON evaluations(industry);

-- Performance feedback table for data flywheel
CREATE TABLE performance_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id UUID NOT NULL REFERENCES evaluations(id),
  user_email TEXT,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('implemented', 'performance_change', 'benchmark', 'recommendation_rating')),
  feedback_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes for performance_feedback
CREATE INDEX idx_performance_feedback_evaluation_id ON performance_feedback(evaluation_id);
CREATE INDEX idx_performance_feedback_type ON performance_feedback(feedback_type);
CREATE INDEX idx_performance_feedback_created_at ON performance_feedback(created_at);

-- Anonymous performance metrics for benchmarking
CREATE TABLE performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_hash TEXT NOT NULL,
  platform TEXT NOT NULL,
  industry TEXT,
  audience_type TEXT,
  pre_score INTEGER,
  post_score INTEGER,
  performance_change JSONB,
  recommendations_implemented TEXT[],
  time_to_implementation INTERVAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes for performance_metrics
CREATE INDEX idx_performance_metrics_platform ON performance_metrics(platform);
CREATE INDEX idx_performance_metrics_industry ON performance_metrics(industry);
CREATE INDEX idx_performance_metrics_hash ON performance_metrics(evaluation_hash);

-- Industry benchmarks
CREATE TABLE industry_benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  industry TEXT NOT NULL,
  score_type TEXT NOT NULL,
  percentile_10 DECIMAL(5,2),
  percentile_25 DECIMAL(5,2),
  percentile_50 DECIMAL(5,2),
  percentile_75 DECIMAL(5,2),
  percentile_90 DECIMAL(5,2),
  sample_size INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes for industry_benchmarks
CREATE INDEX idx_benchmarks_platform_industry ON industry_benchmarks(platform, industry);
CREATE INDEX idx_benchmarks_score_type ON industry_benchmarks(score_type);
CREATE INDEX idx_benchmarks_updated_at ON industry_benchmarks(updated_at);

-- Recommendation tracking
CREATE TABLE recommendation_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id UUID NOT NULL REFERENCES evaluations(id),
  recommendation_type TEXT NOT NULL,
  recommendation_text TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
  implemented BOOLEAN DEFAULT FALSE,
  implemented_at TIMESTAMP WITH TIME ZONE,
  effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes for recommendation_tracking
CREATE INDEX idx_recommendation_tracking_evaluation_id ON recommendation_tracking(evaluation_id);
CREATE INDEX idx_recommendation_tracking_type ON recommendation_tracking(recommendation_type);
CREATE INDEX idx_recommendation_tracking_implemented ON recommendation_tracking(implemented);

-- Insert some initial industry benchmarks (mock data for testing)
INSERT INTO industry_benchmarks (platform, industry, score_type, percentile_10, percentile_25, percentile_50, percentile_75, percentile_90, sample_size) VALUES
('meta', 'ecommerce', 'overall', 4.2, 5.1, 6.3, 7.4, 8.1, 1000),
('meta', 'saas', 'overall', 4.8, 5.7, 6.8, 7.6, 8.3, 800),
('meta', 'financial-services', 'overall', 5.1, 6.0, 7.0, 7.8, 8.5, 600),
('tiktok', 'ecommerce', 'overall', 3.9, 4.8, 6.0, 7.2, 7.9, 750),
('linkedin', 'b2b-services', 'overall', 5.3, 6.2, 7.1, 7.9, 8.6, 500),
('google', 'ecommerce', 'overall', 4.5, 5.4, 6.5, 7.5, 8.2, 1200);

-- Comments for documentation
COMMENT ON TABLE performance_feedback IS 'Stores user feedback on evaluation recommendations and performance changes';
COMMENT ON TABLE performance_metrics IS 'Anonymous performance data for building benchmarks and improving algorithms';
COMMENT ON TABLE industry_benchmarks IS 'Industry-specific performance benchmarks for comparison';
COMMENT ON TABLE recommendation_tracking IS 'Tracks individual recommendations and their implementation status';

COMMENT ON COLUMN evaluations.industry IS 'Auto-detected industry category for benchmarking';
COMMENT ON COLUMN evaluations.audience_type IS 'Target audience type (B2B, B2C, etc.)';
COMMENT ON COLUMN evaluations.campaign_objective IS 'Primary campaign goal (awareness, conversion, etc.)';
COMMENT ON COLUMN evaluations.micro_scores IS 'Detailed scoring breakdown for advanced analytics';