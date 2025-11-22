-- Simple approach: Create a new table for Clerk users
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.clerk_users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
  monthly_evaluations INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add an index for performance
CREATE INDEX IF NOT EXISTS idx_clerk_users_email ON public.clerk_users(email);
CREATE INDEX IF NOT EXISTS idx_clerk_users_tier ON public.clerk_users(tier);

-- Insert your user manually for testing
INSERT INTO public.clerk_users (id, email, tier, monthly_evaluations) 
VALUES ('user_35WLuc9lKmsiqlBdEw3EM0wRpWm', 'richardson.dillon@gmail.com', 'free', 0)
ON CONFLICT (id) DO NOTHING;