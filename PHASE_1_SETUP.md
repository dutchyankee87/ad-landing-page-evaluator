# Phase 1: Visual Asset Storage Implementation Setup

## Overview
This guide walks through setting up the visual asset storage system that transforms ADalign.io into a marketing intelligence platform.

## 1. Supabase Storage Setup

### Create Storage Buckets
Run the following SQL in your Supabase SQL Editor:

```sql
-- Run the storage setup script
\i supabase/storage-setup.sql
```

Or copy and paste the contents of `supabase/storage-setup.sql` into the Supabase SQL Editor.

### Verify Buckets
Check that the following buckets were created:
- `ad-images` (5MB limit, public read)
- `landing-page-screenshots` (10MB limit, public read)

## 2. Database Migration

### Option A: Automatic Migration (Recommended)
```bash
npm install postgres
node scripts/run-migration.js
```

### Option B: Manual Migration
Copy and paste the contents of `supabase/migrations/003_visual_assets_storage.sql` into the Supabase SQL Editor.

### Verify Migration
Check that the `evaluations` table now has these new columns:
- `ad_image_file_size`
- `landing_page_screenshot_url`
- `landing_page_screenshot_path`
- `screenshot_file_size`
- `screenshot_captured_at`
- `screenshot_is_placeholder`
- `visual_score`
- `contextual_score`
- `tone_score`

## 3. Environment Variables

Ensure these are set in your `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
DATABASE_URL=your_database_url
```

For screenshot service (optional, falls back to placeholders):
```env
HTMLCSSTOIMAGE_API_KEY=your_api_key
```

## 4. Deploy Screenshot Function

Deploy the Edge Function to Supabase:
```bash
npx supabase functions deploy capture-screenshot
```

Or if using Supabase CLI:
```bash
supabase functions deploy capture-screenshot
```

## 5. Test the Implementation

### Test Image Upload
1. Go to the ad upload form
2. Upload an image file
3. Verify it appears in Supabase Storage `ad-images` bucket
4. Check the browser network tab for successful upload

### Test Screenshot Capture
1. Enter a URL in the landing page form
2. Click "Validate"
3. Verify screenshot appears in `landing-page-screenshots` bucket
4. Check that validation shows "Screenshot captured for visual analysis"

### Test Evaluation Storage
1. Complete a full evaluation
2. Check the `evaluations` table in Supabase
3. Verify new columns are populated with asset URLs and metadata

## 6. Monitoring and Analytics

### Storage Usage
Monitor storage usage in Supabase dashboard:
- Go to Storage > Settings
- Check usage for both buckets

### Database Analytics
Query the new `evaluation_analytics` view:
```sql
SELECT 
  ad_image_status,
  screenshot_status,
  COUNT(*) as count,
  AVG(overall_score) as avg_score
FROM evaluation_analytics 
GROUP BY ad_image_status, screenshot_status;
```

## 7. Cost Optimization

### Image Compression
Images are automatically compressed to ~85% quality and resized to max 1920px width.

### Storage Cleanup
Implement cleanup for orphaned files (future enhancement):
```sql
-- Find evaluations with missing assets
SELECT id, ad_image_url, landing_page_screenshot_url 
FROM evaluations 
WHERE ad_image_url IS NULL OR landing_page_screenshot_url IS NULL;
```

## 8. Troubleshooting

### Upload Fails
- Check file size (max 5MB for ads)
- Verify file type (JPEG, PNG, GIF, WebP)
- Check browser console for errors
- Verify Supabase storage policies

### Screenshot Fails
- Falls back to placeholder automatically
- Check Edge Function logs in Supabase
- Verify target URL is accessible
- Check for CORS issues

### Database Errors
- Check column names match schema
- Verify migration ran successfully
- Check data types and constraints

## 9. Next Steps (Phase 2)

Once Phase 1 is working:
1. Implement user authentication
2. Add evaluation history dashboard
3. Build industry benchmarking
4. Create premium features

## Success Metrics

✅ **Phase 1 Complete When:**
- All evaluations store visual assets
- Storage costs < $50/month at 1000 evals
- 95%+ successful image uploads
- 90%+ successful screenshot captures (including placeholders)
- Database contains asset URLs and metadata

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify Supabase project settings
3. Test with different file sizes/types
4. Check database migration status