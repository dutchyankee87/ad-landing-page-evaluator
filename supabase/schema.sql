-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
  monthly_evaluations INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Evaluations table  
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  platform TEXT DEFAULT 'meta' NOT NULL,
  ad_screenshot_url TEXT NOT NULL,
  landing_page_url TEXT NOT NULL,
  overall_score INTEGER NOT NULL,
  visual_score INTEGER NOT NULL,
  contextual_score INTEGER NOT NULL,
  tone_score INTEGER NOT NULL,
  used_ai BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to increment user evaluation count
CREATE OR REPLACE FUNCTION increment_user_evaluation(user_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE users 
  SET monthly_evaluations = monthly_evaluations + 1,
      updated_at = NOW()
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- Function to reset monthly evaluations (run monthly via cron)
CREATE OR REPLACE FUNCTION reset_monthly_evaluations()
RETURNS VOID AS $$
BEGIN
  UPDATE users SET monthly_evaluations = 0;
END;
$$ LANGUAGE plpgsql;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_evaluations_user_id ON evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_created_at ON evaluations(created_at);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Policies (adjust as needed for your auth setup)
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (true);

CREATE POLICY "Users can view own evaluations" ON evaluations FOR SELECT USING (true);
CREATE POLICY "Users can insert own evaluations" ON evaluations FOR INSERT WITH CHECK (true);