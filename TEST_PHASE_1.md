# Phase 1 Testing Guide

## Quick Test Checklist

### ✅ Database Setup
- [x] `ip_rate_limit` table created
- [x] Storage buckets created (`ad-images`, `landing-page-screenshots`)
- [x] Database columns added for asset storage

### 🧪 Manual Testing Steps

#### 1. Test Ad Image Upload
1. Go to your deployed app or run `npm run dev`
2. Navigate to the evaluation form
3. Select a platform (e.g., Meta)
4. Upload an ad image (any JPEG/PNG under 5MB)
5. **Expected**: 
   - Progress bar shows during upload
   - Image compresses and uploads to Supabase
   - Preview appears in the form

#### 2. Test Landing Page Validation
1. Enter a landing page URL (e.g., `https://example.com`)
2. Click "Validate"
3. **Expected**:
   - URL validates successfully
   - Green success message appears

#### 3. Test Complete Evaluation
1. Fill in audience data (age, gender, interests)
2. Click "Evaluate Ad"
3. **Expected**:
   - Evaluation runs successfully
   - Results page shows scores and suggestions
   - Data gets stored in database with asset URLs

#### 4. Verify Data Storage
Check Supabase:
1. **Storage**: Go to Storage > ad-images > original folder
   - Should see uploaded image files
2. **Database**: Go to Table Editor > evaluations
   - Should see new row with `ad_screenshot_url` populated
   - Should see `ad_image_file_size` with file size in bytes

### 🔍 Debug Commands

If something isn't working:

```bash
# Check database tables
node -e "const postgres=require('postgres'); const sql=postgres(process.env.DATABASE_URL); sql\`SELECT table_name FROM information_schema.tables WHERE table_schema='public'\`.then(tables => {console.log(tables.map(t=>t.table_name)); sql.end();})"

# Check evaluations table structure  
node -e "const postgres=require('postgres'); const sql=postgres(process.env.DATABASE_URL); sql\`SELECT column_name FROM information_schema.columns WHERE table_name='evaluations'\`.then(cols => {console.log(cols.map(c=>c.column_name)); sql.end();})"

# Check storage buckets
node -e "const postgres=require('postgres'); const sql=postgres(process.env.DATABASE_URL); sql\`SELECT name, public, file_size_limit FROM storage.buckets\`.then(buckets => {console.log(buckets); sql.end();})"

# Test latest evaluation
node -e "const postgres=require('postgres'); const sql=postgres(process.env.DATABASE_URL); sql\`SELECT id, platform, ad_screenshot_url, ad_image_file_size, created_at FROM evaluations ORDER BY created_at DESC LIMIT 5\`.then(evals => {console.log(evals); sql.end();})"
```

### 📊 Success Criteria

**Phase 1 is successful if:**
- ✅ Ad images upload to Supabase storage
- ✅ Image URLs are stored in evaluations table
- ✅ File sizes are tracked in `ad_image_file_size` column
- ✅ Evaluations complete without database errors
- ✅ Storage costs remain reasonable (check Supabase usage)

### 🚨 Common Issues

**Upload fails:**
- Check file size (max 5MB)
- Verify file type (JPEG, PNG, GIF, WebP)
- Check Supabase storage policies
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

**Database errors:**
- Run missing migrations
- Check column names match API code
- Verify `DATABASE_URL` is correct

**API errors:**
- Check Vercel function logs
- Verify all environment variables are set
- Check for schema mismatches between API and database

### 🎯 Next Steps

Once Phase 1 testing passes:
1. **User Accounts** (Phase 2): Authentication and evaluation history
2. **Industry Benchmarks** (Phase 3): Comparative analytics
3. **Premium Features** (Phase 4): Monetization and enterprise tools

### 💾 Data Monetization Value

Every successful evaluation now creates:
- **Visual Asset**: Compressed ad image with metadata
- **Evaluation Data**: Scores, suggestions, and analysis
- **Usage Patterns**: Platform preferences and improvement areas
- **Industry Intelligence**: Ad-to-page alignment insights

This data foundation enables:
- Premium benchmarking features
- Industry trend reports  
- AI training datasets
- Marketing intelligence APIs

**Estimated Value**: $120K-200K ARR potential within 12 months