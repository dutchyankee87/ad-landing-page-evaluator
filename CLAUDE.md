# adalign.io - Claude Development Guide

## Project Overview
A React-based web application that evaluates the congruence between paid media (meta, tiktok, linkedin, reddit, google) ads and their corresponding landing pages. The tool analyzes visual match, contextual alignment, and tone consistency to provide actionable recommendations for improving ad performance.

## Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with Lucide React icons
- **State Management**: React Context API with custom hooks
- **Backend**: Supabase Edge Functions (Deno runtime)
- **AI Integration**: OpenAI GPT-4 for ad analysis
- **Deployment**: Static site compatible (Vite build)

## Environment Variables Needed
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous public key
- `OPENAI_API_KEY` - OpenAI API key (Edge Function only)

## Development Notes
- Uses TypeScript strict mode for type safety
- Implements fallback mock evaluation when Supabase is unavailable
- Context API provides centralized state management for form data and results
- Multi-step form with validation and progress tracking
- Image upload with drag-and-drop functionality using FileReader API
- URL validation with mock scraping simulation
- Responsive design with Tailwind CSS
- Error boundaries recommended but not yet implemented

## Key Components
- `AdEvaluationContext.tsx` - Central state management
- `EvaluationForm.tsx` - Multi-step form orchestration
- `AdAssetForm.tsx` - Ad upload and input handling
- `LandingPageForm.tsx` - URL validation and mock scraping
- `Results.tsx` - Score display and recommendations
- `ScoreGauge.tsx` - Visual score representation

## API Integration
- **Supabase Edge Function**: `/functions/v1/evaluate-ad`
- **OpenAI Integration**: GPT-4 analysis with JSON response format
- **Fallback Mode**: Mock evaluation with realistic score generation
- **CORS Enabled**: Supports cross-origin requests

## Testing
Currently no test framework is configured. Use manual testing and the build command to verify changes.

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Deployment
Configured for static site deployment (Vercel, Netlify, etc.) with Vite build output.

## Known Limitations
- Mock URL validation (no actual web scraping)
- No image analysis (URLs only processed as strings)
- Limited error boundary implementation
- No caching strategy for API requests
- No user authentication or data persistence

## Plan & Review

Before you start working, write a plan to claude/tasks/TASK_NAME.md. The plan should be a detailed description of the changes you will make and the reasoning behind them. Once you have written the plan, stop and ask me to review it. Do not continue until I have reviewed and approved the plan. After I have approved the plan, continue with the work. You may update the plan as you work.

Once you are done with your work, append a review to the same file. The review should be a detailed description of the changes you made and the reasoning behind them. It should also serve to help me perform the final code review.

If I ask you to start working on a new task during our session, then create a separate claude/tasks/TASK_NAME.md file for the new task and repeat the process.

## Project Memory
- We are working on adalign.io that helps marketers optimize ad-to-page congruence
- The application uses a multi-step form to collect ad assets, landing page URLs, and audience data
- AI analysis is performed via OpenAI GPT-4 through Supabase Edge Functions
- The app provides visual, contextual, and tone alignment scores with actionable suggestions
- Fallback mock evaluation ensures the app works even without API access
- The codebase follows modern React patterns with TypeScript and is security-conscious
- Current focus areas for improvement: error boundaries, performance optimization, and input validation