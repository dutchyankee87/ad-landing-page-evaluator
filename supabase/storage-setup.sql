-- Supabase Storage Buckets Setup
-- Run this in the Supabase SQL Editor to create storage buckets

-- Create ad-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ad-images',
  'ad-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- Create landing-page-screenshots bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'landing-page-screenshots',
  'landing-page-screenshots',
  true,
  10485760, -- 10MB limit for screenshots
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Storage policies for ad-images bucket
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads to ad-images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'ad-images');

-- Allow public read access
CREATE POLICY "Allow public access to ad-images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'ad-images');

-- Allow users to update their own uploads
CREATE POLICY "Allow users to update own ad-images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'ad-images' AND owner = auth.uid());

-- Allow users to delete their own uploads
CREATE POLICY "Allow users to delete own ad-images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'ad-images' AND owner = auth.uid());

-- Storage policies for landing-page-screenshots bucket
-- Allow system/service role to upload (for automated screenshots)
CREATE POLICY "Allow service uploads to screenshots" ON storage.objects
  FOR INSERT TO service_role
  WITH CHECK (bucket_id = 'landing-page-screenshots');

-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads to screenshots" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'landing-page-screenshots');

-- Allow public read access
CREATE POLICY "Allow public access to screenshots" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'landing-page-screenshots');

-- Allow users to update their own uploads
CREATE POLICY "Allow users to update own screenshots" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'landing-page-screenshots' AND owner = auth.uid());

-- Allow users to delete their own uploads
CREATE POLICY "Allow users to delete own screenshots" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'landing-page-screenshots' AND owner = auth.uid());