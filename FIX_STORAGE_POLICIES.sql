-- Fix storage policies for ad-images bucket
-- Run this in your Supabase SQL Editor

-- First, drop existing policies that might be incorrect
DROP POLICY IF EXISTS "Allow public uploads to ad-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to ad-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates to ad-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes from ad-images" ON storage.objects;

-- Create new policies that work for anonymous users
CREATE POLICY "Allow anonymous uploads to ad-images" 
ON storage.objects FOR INSERT 
TO anon 
WITH CHECK (bucket_id = 'ad-images');

CREATE POLICY "Allow anonymous access to ad-images" 
ON storage.objects FOR SELECT 
TO anon, public
USING (bucket_id = 'ad-images');

CREATE POLICY "Allow anonymous updates to ad-images" 
ON storage.objects FOR UPDATE 
TO anon 
USING (bucket_id = 'ad-images');

CREATE POLICY "Allow anonymous deletes from ad-images" 
ON storage.objects FOR DELETE 
TO anon 
USING (bucket_id = 'ad-images');

-- Also allow authenticated users
CREATE POLICY "Allow authenticated uploads to ad-images" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'ad-images');

CREATE POLICY "Allow authenticated access to ad-images" 
ON storage.objects FOR SELECT 
TO authenticated
USING (bucket_id = 'ad-images');

CREATE POLICY "Allow authenticated updates to ad-images" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'ad-images');

CREATE POLICY "Allow authenticated deletes from ad-images" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'ad-images');

-- Verify the bucket and policies
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%ad-images%';