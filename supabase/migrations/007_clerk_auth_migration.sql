-- Migration to support Clerk authentication instead of Supabase auth
-- This changes the users table to work with Clerk user IDs (strings) instead of Supabase UUIDs

-- First, drop existing foreign key constraints that reference users.id
ALTER TABLE IF EXISTS public.evaluations DROP CONSTRAINT IF EXISTS evaluations_user_id_fkey;
ALTER TABLE IF EXISTS public.user_usage DROP CONSTRAINT IF EXISTS user_usage_user_id_fkey;
ALTER TABLE IF EXISTS public.usage_analytics DROP CONSTRAINT IF EXISTS usage_analytics_user_id_fkey;
ALTER TABLE IF EXISTS public.evaluation_comparisons DROP CONSTRAINT IF EXISTS evaluation_comparisons_user_id_fkey;
ALTER TABLE IF EXISTS public.comparison_groups DROP CONSTRAINT IF EXISTS comparison_groups_user_id_fkey;

-- Drop the foreign key constraint to auth.users
ALTER TABLE IF EXISTS public.users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Change the users table id column from UUID to TEXT to support Clerk IDs
ALTER TABLE public.users ALTER COLUMN id TYPE TEXT;

-- Also change all user_id columns in related tables to TEXT
ALTER TABLE IF EXISTS public.evaluations ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE IF EXISTS public.user_usage ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE IF EXISTS public.usage_analytics ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE IF EXISTS public.evaluation_comparisons ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE IF EXISTS public.comparison_groups ALTER COLUMN user_id TYPE TEXT;

-- Recreate foreign key constraints with the new TEXT type
ALTER TABLE IF EXISTS public.evaluations ADD CONSTRAINT evaluations_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.user_usage ADD CONSTRAINT user_usage_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.usage_analytics ADD CONSTRAINT usage_analytics_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.evaluation_comparisons ADD CONSTRAINT evaluation_comparisons_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.comparison_groups ADD CONSTRAINT comparison_groups_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Add indexes for performance on the new TEXT columns
CREATE INDEX IF NOT EXISTS idx_users_id ON public.users(id);
CREATE INDEX IF NOT EXISTS idx_evaluations_user_id ON public.evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_usage_user_id ON public.user_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_analytics_user_id ON public.usage_analytics(user_id);