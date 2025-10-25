-- Fix storage policies for ad-images bucket (handles existing policies)
-- Run this in your Supabase SQL Editor

-- Drop ALL existing policies for ad-images bucket
DROP POLICY IF EXISTS "Allow public uploads to ad-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to ad-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates to ad-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes from ad-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to ad-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated access to ad-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to ad-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from ad-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous uploads to ad-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous access to ad-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous updates to ad-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous deletes from ad-images" ON storage.objects;

-- Create simple policies that work for everyone
CREATE POLICY "ad-images-upload" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'ad-images');

CREATE POLICY "ad-images-select" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'ad-images');

CREATE POLICY "ad-images-update" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'ad-images');

CREATE POLICY "ad-images-delete" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'ad-images');

-- Verify the policies were created
SELECT policyname, roles, cmd 
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE 'ad-images%';