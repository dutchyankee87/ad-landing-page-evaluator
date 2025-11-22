-- Run this in your Supabase SQL Editor to enable Clerk authentication
-- This changes the users table to work with Clerk user IDs instead of Supabase UUIDs

-- Step 1: Drop existing foreign key constraints
ALTER TABLE IF EXISTS public.evaluations DROP CONSTRAINT IF EXISTS evaluations_user_id_fkey;
ALTER TABLE IF EXISTS public.user_usage DROP CONSTRAINT IF EXISTS user_usage_user_id_fkey;
ALTER TABLE IF EXISTS public.usage_analytics DROP CONSTRAINT IF EXISTS usage_analytics_user_id_fkey;
ALTER TABLE IF EXISTS public.evaluation_comparisons DROP CONSTRAINT IF EXISTS evaluation_comparisons_user_id_fkey;
ALTER TABLE IF EXISTS public.comparison_groups DROP CONSTRAINT IF EXISTS comparison_groups_user_id_fkey;

-- Step 2: Drop the auth.users foreign key constraint
ALTER TABLE IF EXISTS public.users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Step 3: Change users.id from UUID to TEXT for Clerk IDs
ALTER TABLE public.users ALTER COLUMN id TYPE TEXT;

-- Step 4: Change all user_id columns to TEXT
ALTER TABLE IF EXISTS public.evaluations ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE IF EXISTS public.user_usage ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE IF EXISTS public.usage_analytics ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE IF EXISTS public.evaluation_comparisons ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE IF EXISTS public.comparison_groups ALTER COLUMN user_id TYPE TEXT;

-- Step 5: Recreate foreign key constraints
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