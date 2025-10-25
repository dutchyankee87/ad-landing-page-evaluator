-- Run this in your production Supabase SQL Editor
-- Go to: https://supabase.com/dashboard → Your Project → SQL Editor

-- Create ad-images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ad-images',
  'ad-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policies for ad-images
CREATE POLICY IF NOT EXISTS "Allow public uploads to ad-images" 
ON storage.objects FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'ad-images');

CREATE POLICY IF NOT EXISTS "Allow public access to ad-images" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'ad-images');

CREATE POLICY IF NOT EXISTS "Allow public updates to ad-images" 
ON storage.objects FOR UPDATE 
TO public 
USING (bucket_id = 'ad-images');

CREATE POLICY IF NOT EXISTS "Allow public deletes from ad-images" 
ON storage.objects FOR DELETE 
TO public 
USING (bucket_id = 'ad-images');

-- Verify buckets were created
SELECT id, name, public, file_size_limit FROM storage.buckets WHERE name = 'ad-images';