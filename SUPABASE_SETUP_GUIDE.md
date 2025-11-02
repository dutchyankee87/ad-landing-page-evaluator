# Supabase Setup Guide

## Current Status
The application is configured to work with **fallback mode** when Supabase is not properly configured. This means:

- ✅ **File uploads work** using base64 encoding (fallback)
- ✅ **Ad URL screenshots work** via ScreenshotAPI.net 
- ⚠️ **Database features require** proper Supabase configuration

## To Enable Full Supabase Features

1. **Get Supabase Credentials**:
   - Visit [supabase.com](https://supabase.com)
   - Create a new project
   - Get your Project URL and anon key from Settings > API

2. **Update Environment Variables**:
   Replace in `.env`:
   ```bash
   VITE_SUPABASE_URL=your_actual_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
   ```

3. **Run Database Migrations**:
   ```bash
   # Make sure DATABASE_URL is properly set in .env
   node scripts/test-db-connection.cjs
   ```

## Current Fallback Behavior

When Supabase is not configured:
- **File uploads**: Use base64 encoding (works but limited to ~5MB)
- **Database operations**: Skip gracefully with console warnings
- **Screenshots**: Work normally via ScreenshotAPI.net
- **Analysis**: Works with both uploaded files and ad URLs

## Testing Without Supabase

The app is designed to work without Supabase for basic functionality:
1. Ad URL screenshot capture ✅
2. File upload with base64 ✅  
3. OpenAI analysis ✅
4. Results display ✅

Missing features without Supabase:
- User account management
- Usage tracking and limits
- Persistent storage of analysis results
- Team collaboration features

## Recommendation

For development and testing, the current fallback mode is sufficient. For production, proper Supabase configuration is recommended for full feature support.