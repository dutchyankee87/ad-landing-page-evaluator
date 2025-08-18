# 🚀 Deployment Guide

## Quick Launch (5 minutes)

### 1. Deploy to Vercel (Easiest)

**Option A: GitHub Integration (Recommended)**
1. Push code to GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign up
3. Click "New Project" → Import from GitHub
4. Select your repository
5. Deploy! ✨

**Option B: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts, then your app is live!
```

### 2. Deploy to Netlify
```bash
# Build the app
npm run build

# Drag and drop the dist/ folder to Netlify deploy
# Or use Netlify CLI:
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### 3. Deploy to GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"deploy": "gh-pages -d dist"

# Deploy
npm run build
npm run deploy
```

## Full Production Setup

### 1. Set up Supabase Project

1. **Create Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose organization and name: "ad-evaluator"
   - Set strong database password

2. **Get Credentials**
   - Go to Settings → API
   - Copy Project URL and anon public key

3. **Set up Database**
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Initialize and link
   supabase init
   supabase link --project-ref YOUR_PROJECT_REF

   # Push database schema
   supabase db push
   ```

4. **Deploy Edge Function**
   ```bash
   # Deploy evaluate-ad function
   supabase functions deploy evaluate-ad --no-verify-jwt

   # Set environment variables in Supabase Dashboard:
   # Go to Edge Functions → evaluate-ad → Settings
   # Add secrets:
   # - OPENAI_API_KEY: your-openai-key
   # - SUPABASE_URL: your-project-url  
   # - SUPABASE_SERVICE_ROLE_KEY: your-service-role-key
   ```

### 2. Configure Production Environment

**In Vercel Dashboard:**
- Settings → Environment Variables
- Add:
  - `VITE_SUPABASE_URL`: your-project-url
  - `VITE_SUPABASE_ANON_KEY`: your-anon-key

**In Netlify Dashboard:**
- Site Settings → Environment Variables
- Add same variables as above

### 3. Enable Authentication (Optional)

**Supabase Dashboard:**
- Authentication → Settings
- Enable email/password authentication
- Configure email templates
- Set site URL to your domain

### 4. Custom Domain (Optional)

**Vercel:**
- Project Settings → Domains
- Add your custom domain
- Configure DNS records

**Netlify:**
- Site Settings → Domain Management
- Add custom domain
- Configure DNS

## Current Status

### ✅ Working Now (Fallback Mode)
- Multi-platform evaluation
- Platform-specific suggestions  
- Professional UI with pricing
- Usage limit indicators
- Ready for users immediately

### ✅ With Supabase Setup
- Real GPT-4o screenshot analysis
- User accounts and authentication
- Usage tracking and limits
- Analytics and insights
- Production-ready freemium model

## Testing Checklist

### Before Launch
- [ ] Test all platform selections
- [ ] Upload different image formats
- [ ] Check mobile responsiveness
- [ ] Test pricing modal
- [ ] Verify error handling

### After Supabase Setup
- [ ] Test real GPT-4o analysis
- [ ] Verify usage limits work
- [ ] Test user registration
- [ ] Check analytics tracking
- [ ] Monitor API costs

## Cost Monitoring

### Current GPT-4o Pricing
- **Input**: $0.005 per 1K tokens (~$0.005 per image)
- **Output**: $0.015 per 1K tokens (~$0.015 per analysis)
- **Total**: ~$0.02-0.04 per evaluation

### Revenue Targets
- **Free tier**: 1 eval/month (loss leader)
- **Pro**: $19/month = $0.19/eval (80%+ margin)
- **Enterprise**: $99/month = $0.10/eval (85%+ margin)

### Monitoring Tools
- OpenAI Usage Dashboard
- Supabase Database insights
- Vercel Analytics
- Custom analytics in app

## Support & Monitoring

### Error Tracking
- Monitor Supabase Edge Function logs
- Set up error alerts
- Check OpenAI API status

### User Feedback
- Add feedback forms
- Monitor support requests
- Track conversion metrics

### Performance
- Monitor load times
- Check mobile performance
- Track user engagement

Your app is ready to serve real users! 🎉