# GitHub and Vercel Deployment Plan

## Overview
Deploy the Ad Landing Page Evaluator to GitHub and then to Vercel for public access.

## Plan

### 1. Repository Setup
- Initialize git repository in the project directory
- Create appropriate .gitignore file for React/Node.js project
- Add and commit all project files
- Create GitHub repository (will need user to do this or provide credentials)
- Add remote origin and push code

### 2. Vercel Deployment
- Connect GitHub repository to Vercel
- Configure build settings for Vite React app
- Set up environment variables in Vercel dashboard
- Deploy and verify functionality

### Environment Variables Needed for Vercel
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous public key

### Build Configuration
- Build command: `npm run build`
- Output directory: `dist`
- Node.js version: 18.x (latest stable)

### Considerations
- Ensure all sensitive data is properly handled through environment variables
- Verify that the fallback mock evaluation works for users without Supabase access
- Test the deployed application thoroughly

## Reasoning
This deployment strategy ensures:
1. Version control and collaboration through GitHub
2. Automatic deployments on code changes via Vercel
3. Proper environment variable management
4. Static site optimization for fast loading