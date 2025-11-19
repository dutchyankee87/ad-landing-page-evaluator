# Database Storage Fix Plan

## Issues Identified

### Primary Issue: Missing Supabase Configuration
- The `.env` file contains placeholder values for Supabase connection
- `VITE_SUPABASE_URL=your_supabase_project_url` (not real URL)
- `VITE_SUPABASE_ANON_KEY=your_supabase_anon_key` (not real key)
- **Result**: All API calls fall back to mock evaluation mode, no real data storage

### Secondary Issue: Database Schema Mismatch  
- The Edge Function (`api/analyze-ad.js:764-793`) expects certain fields in the `evaluations` table
- The actual schema (`001_initial_schema.sql:33-71`) has different field names
- **Field Mismatches**:
  - Function expects: `adScreenshotUrl` → Schema has: `ad_image_url` 
  - Function expects: `visualMatchScore` → Schema has: `visual_match_score`
  - Function expects: `contextualMatchScore` → Schema has: `contextual_match_score`
  - Function expects: `toneAlignmentScore` → Schema has: `tone_alignment_score`

### Database Architecture Questions
1. Current schema has `evaluations` table and `evaluation_comparisons` table
2. You mentioned a "comparison evaluations" table - this doesn't exist, only `evaluation_comparisons` for A/B testing
3. The question is whether to store all evaluation data in one unified table vs separate tables

## Recommended Solutions

### 1. Fix Supabase Configuration (Immediate)
- Update `.env` with real Supabase URL and anon key
- This will enable actual API calls instead of fallback mode

### 2. Unified Database Schema (Recommended)
Instead of separate tables, create one comprehensive `evaluations` table that handles:
- Regular evaluations (individual ad analysis)
- Comparison evaluations (A/B testing between ads)
- Element-level comparisons (detailed breakdown)

**Benefits**:
- Single source of truth for all evaluation data
- Simpler queries and maintenance
- Better performance for analytics
- Easier to add new evaluation types

### 3. Database Schema Migration
Update the schema to match what the Edge Function expects and add comparison capabilities:

```sql
-- New unified evaluations table structure
ALTER TABLE evaluations ADD COLUMN IF NOT EXISTS:
- comparison_type TEXT DEFAULT 'single' -- 'single', 'a_b_test', 'multi_variant'
- comparison_group_id UUID -- Groups related evaluations together
- element_comparisons JSONB -- Detailed element-by-element analysis
- strategic_recommendations JSONB
- risk_factors JSONB
- missed_opportunities JSONB
- heatmap_zones JSONB
- insights JSONB
```

### 4. Edge Function Updates
- Fix field name mismatches in the database insertion code
- Add support for storing element comparisons and advanced analysis data
- Add comparison grouping logic for A/B tests

## Implementation Steps

1. **Get Real Supabase Credentials** - ✅ COMPLETED (production has real credentials)
2. **Run Database Migration** - ✅ COMPLETED (ran scripts/run-simple-migration.cjs)
3. **Update Edge Function** - ✅ COMPLETED (fixed field name mismatches)
4. **Test End-to-End** - 🔄 READY TO TEST (deploy and verify)
5. **Migrate Existing Data** - ❌ NOT NEEDED (old data compatible)

## What Was Fixed

### Database Schema Updates ✅
- Added 14 missing columns to `evaluations` table:
  - `media_type`, `video_frame_count`, `video_processing_method`
  - `comparison_type`, `comparison_group_id`
  - `element_comparisons`, `strategic_recommendations`, `risk_factors`
  - `missed_opportunities`, `heatmap_zones`, `insights`
  - `brand_coherence_score`, `user_journey_alignment_score`, `conversion_optimization_score`
- Created `comparison_groups` table for organized A/B testing
- Added proper indexes for performance

### Edge Function Fixes ✅
- Fixed field name mismatch: `adScreenshotUrl` → `adImageUrl` 
- Updated schema definition to match database structure
- Added support for storing all enhanced analysis data
- Fixed database insertion to use correct column names

### Unified Architecture ✅
- Single `evaluations` table handles all evaluation types
- A/B testing supported via `comparison_type` and `comparison_group_id`
- Element-level comparisons stored in `element_comparisons` JSONB
- Ready for advanced analytics and reporting

## Quick Fix for Immediate Testing
If you want to test right now with mock data storage:
- Update the Edge Function to log when database writes succeed/fail
- Add better error handling for schema mismatches
- Add fallback storage to JSON files during development

## Long-term Architecture
The unified table approach is better because:
- All evaluation data in one place
- Easier to build analytics dashboards
- Better query performance
- Simpler to add new evaluation features
- Consistent data model across the app