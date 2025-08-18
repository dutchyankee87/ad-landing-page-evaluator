# Task: Enhance Current Setup with Drizzle ORM and Database Persistence

## Plan

### Overview
Enhance the existing React + Vite + Supabase architecture by adding Drizzle ORM for type-safe database operations and implementing data persistence for evaluations, user management, and analytics. This approach maintains the current frontend while significantly improving the backend capabilities.

### Goals
1. Add type-safe database operations with Drizzle ORM
2. Implement data persistence for evaluations and user data
3. Add user authentication and evaluation history
4. Create analytics and comparison features
5. Maintain current frontend performance and development experience

### Phase 1: Database Schema Design and Setup

#### 1.1 PostgreSQL Schema Design
```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company TEXT,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Evaluations table
CREATE TABLE public.evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  title TEXT NOT NULL,
  
  -- Ad Data
  ad_headline TEXT NOT NULL,
  ad_description TEXT NOT NULL,
  ad_image_url TEXT NOT NULL,
  
  -- Landing Page Data
  landing_page_url TEXT NOT NULL,
  landing_page_title TEXT,
  landing_page_content TEXT,
  landing_page_cta TEXT,
  
  -- Audience Data
  target_age_range TEXT,
  target_gender TEXT,
  target_location TEXT,
  target_interests TEXT,
  
  -- Results
  overall_score DECIMAL(3,1) NOT NULL,
  visual_match_score DECIMAL(3,1) NOT NULL,
  contextual_match_score DECIMAL(3,1) NOT NULL,
  tone_alignment_score DECIMAL(3,1) NOT NULL,
  
  -- AI Analysis
  visual_suggestions TEXT[],
  contextual_suggestions TEXT[],
  tone_suggestions TEXT[],
  
  -- Metadata
  analysis_model TEXT DEFAULT 'gpt-4-turbo-preview',
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Evaluation comparisons (for A/B testing)
CREATE TABLE public.evaluation_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  name TEXT NOT NULL,
  evaluation_ids UUID[] NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage analytics
CREATE TABLE public.usage_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL, -- 'evaluation_created', 'export_results', 'comparison_created'
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 1.2 Row Level Security (RLS) Policies
```sql
-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_analytics ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view own evaluations" ON public.evaluations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own comparisons" ON public.evaluation_comparisons
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own analytics" ON public.usage_analytics
  FOR ALL USING (auth.uid() = user_id);
```

### Phase 2: Drizzle ORM Integration

#### 2.1 Drizzle Schema Definition
```typescript
// supabase/functions/shared/schema.ts
import { pgTable, uuid, text, decimal, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  company: text('company'),
  subscriptionTier: text('subscription_tier').default('free'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const evaluations = pgTable('evaluations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  title: text('title').notNull(),
  
  // Ad Data
  adHeadline: text('ad_headline').notNull(),
  adDescription: text('ad_description').notNull(),
  adImageUrl: text('ad_image_url').notNull(),
  
  // Landing Page Data
  landingPageUrl: text('landing_page_url').notNull(),
  landingPageTitle: text('landing_page_title'),
  landingPageContent: text('landing_page_content'),
  landingPageCta: text('landing_page_cta'),
  
  // Audience Data
  targetAgeRange: text('target_age_range'),
  targetGender: text('target_gender'),
  targetLocation: text('target_location'),
  targetInterests: text('target_interests'),
  
  // Scores
  overallScore: decimal('overall_score', { precision: 3, scale: 1 }).notNull(),
  visualMatchScore: decimal('visual_match_score', { precision: 3, scale: 1 }).notNull(),
  contextualMatchScore: decimal('contextual_match_score', { precision: 3, scale: 1 }).notNull(),
  toneAlignmentScore: decimal('tone_alignment_score', { precision: 3, scale: 1 }).notNull(),
  
  // Suggestions (JSON arrays)
  visualSuggestions: jsonb('visual_suggestions'),
  contextualSuggestions: jsonb('contextual_suggestions'),
  toneSuggestions: jsonb('tone_suggestions'),
  
  // Metadata
  analysisModel: text('analysis_model').default('gpt-4-turbo-preview'),
  processingTimeMs: integer('processing_time_ms'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const evaluationComparisons = pgTable('evaluation_comparisons', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  name: text('name').notNull(),
  evaluationIds: jsonb('evaluation_ids').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usageAnalytics = pgTable('usage_analytics', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  action: text('action').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

#### 2.2 Database Connection Setup
```typescript
// supabase/functions/shared/db.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.ts';

const connectionString = Deno.env.get('SUPABASE_DB_URL');
if (!connectionString) {
  throw new Error('SUPABASE_DB_URL is required');
}

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
```

### Phase 3: Enhanced Edge Functions

#### 3.1 Enhanced Evaluate Ad Function
```typescript
// supabase/functions/evaluate-ad/index.ts
import { db } from '../shared/db.ts';
import { evaluations, usageAnalytics } from '../shared/schema.ts';
import OpenAI from 'npm:openai@4.28.0';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user from JWT
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);
    
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { adData, landingPageData, audienceData, title } = await req.json();
    
    const startTime = Date.now();
    
    // OpenAI Analysis (existing logic)
    const analysis = await performAIAnalysis(adData, landingPageData, audienceData);
    
    const processingTime = Date.now() - startTime;
    
    // Save evaluation to database
    const [evaluation] = await db.insert(evaluations).values({
      userId: user.id,
      title: title || `Evaluation ${new Date().toLocaleDateString()}`,
      adHeadline: adData.headline,
      adDescription: adData.description,
      adImageUrl: adData.imageUrl,
      landingPageUrl: landingPageData.url,
      landingPageTitle: landingPageData.title,
      landingPageContent: landingPageData.mainContent,
      landingPageCta: landingPageData.ctaText,
      targetAgeRange: audienceData.ageRange,
      targetGender: audienceData.gender,
      targetLocation: audienceData.location,
      targetInterests: audienceData.interests,
      overallScore: analysis.overallScore.toString(),
      visualMatchScore: analysis.scores.visualMatch.toString(),
      contextualMatchScore: analysis.scores.contextualMatch.toString(),
      toneAlignmentScore: analysis.scores.toneAlignment.toString(),
      visualSuggestions: analysis.suggestions.visual,
      contextualSuggestions: analysis.suggestions.contextual,
      toneSuggestions: analysis.suggestions.tone,
      processingTimeMs: processingTime,
    }).returning();

    // Track usage analytics
    await db.insert(usageAnalytics).values({
      userId: user.id,
      action: 'evaluation_created',
      metadata: {
        evaluationId: evaluation.id,
        processingTime,
        model: 'gpt-4-turbo-preview'
      }
    });

    return new Response(JSON.stringify({
      ...analysis,
      evaluationId: evaluation.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
```

#### 3.2 New Edge Functions

**Get Evaluations History**
```typescript
// supabase/functions/get-evaluations/index.ts
import { db } from '../shared/db.ts';
import { evaluations } from '../shared/schema.ts';
import { eq, desc } from 'drizzle-orm';

Deno.serve(async (req) => {
  const { data: { user } } = await supabase.auth.getUser(token);
  
  const userEvaluations = await db
    .select()
    .from(evaluations)
    .where(eq(evaluations.userId, user.id))
    .orderBy(desc(evaluations.createdAt))
    .limit(50);

  return new Response(JSON.stringify(userEvaluations), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});
```

**Create Comparison**
```typescript
// supabase/functions/create-comparison/index.ts
import { db } from '../shared/db.ts';
import { evaluationComparisons, usageAnalytics } from '../shared/schema.ts';

Deno.serve(async (req) => {
  const { name, evaluationIds, notes } = await req.json();
  const { data: { user } } = await supabase.auth.getUser(token);

  const [comparison] = await db.insert(evaluationComparisons).values({
    userId: user.id,
    name,
    evaluationIds,
    notes
  }).returning();

  await db.insert(usageAnalytics).values({
    userId: user.id,
    action: 'comparison_created',
    metadata: { comparisonId: comparison.id, evaluationCount: evaluationIds.length }
  });

  return new Response(JSON.stringify(comparison), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});
```

### Phase 4: Frontend Enhancements

#### 4.1 Supabase Client Setup
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

#### 4.2 Authentication Context
```typescript
// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

#### 4.3 New Pages and Components

**Dashboard Page**
```typescript
// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface Evaluation {
  id: string;
  title: string;
  overallScore: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchEvaluations();
    }
  }, [user]);

  const fetchEvaluations = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-evaluations');
      if (error) throw error;
      setEvaluations(data);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Evaluations</h1>
      
      <div className="grid gap-4">
        {evaluations.map((evaluation) => (
          <div key={evaluation.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold">{evaluation.title}</h3>
            <p className="text-gray-600">Score: {evaluation.overallScore}/10</p>
            <p className="text-sm text-gray-500">
              {new Date(evaluation.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
```

### Phase 5: Migration Strategy

#### 5.1 Database Migration
1. Run SQL schema creation in Supabase dashboard
2. Set up RLS policies
3. Create database connection in Edge Functions
4. Test with sample data

#### 5.2 Edge Function Updates
1. Add Drizzle ORM to existing functions
2. Create new functions for data retrieval
3. Update CORS and error handling
4. Deploy and test

#### 5.3 Frontend Integration
1. Add Supabase auth to existing context
2. Create new dashboard and history pages
3. Update evaluation flow to save data
4. Add authentication routes
5. Test complete flow

### Phase 6: New Features

#### 6.1 Evaluation History & Management
- View past evaluations
- Edit evaluation titles and notes
- Delete evaluations
- Export individual or bulk evaluations

#### 6.2 Comparison Tools
- Side-by-side evaluation comparison
- Trend analysis over time
- Best/worst performing ads
- Improvement tracking

#### 6.3 Analytics Dashboard
- Usage statistics
- Score distribution
- Performance trends
- Time-based analytics

#### 6.4 Enhanced Export Features
- PDF reports with branding
- CSV export for data analysis
- Shareable evaluation links
- White-label reports

### Technical Considerations

#### Performance
- Implement proper indexing on frequently queried columns
- Use connection pooling for database access
- Add caching layer for static data
- Optimize queries with proper joins

#### Security
- Maintain RLS policies for data isolation
- Validate all inputs on both client and server
- Implement rate limiting for API endpoints
- Regular security audits

#### Scalability
- Design schema to handle thousands of evaluations per user
- Consider partitioning for analytics data
- Plan for horizontal scaling of Edge Functions
- Monitor database performance

### Timeline
- **Week 1**: Database schema design and setup
- **Week 2**: Drizzle ORM integration and basic CRUD functions
- **Week 3**: Authentication system and user management
- **Week 4**: Frontend integration and dashboard
- **Week 5**: Advanced features (comparisons, analytics)
- **Week 6**: Testing, optimization, and deployment

### Success Metrics
- All evaluations persistently stored
- User authentication working smoothly
- Dashboard showing evaluation history
- Export features functional
- Performance maintained or improved
- Zero data loss during migration

### Risks and Mitigations
- **Risk**: Data migration complexity
  - **Mitigation**: Thorough testing with sample data first
- **Risk**: Performance degradation
  - **Mitigation**: Proper indexing and query optimization
- **Risk**: Authentication issues
  - **Mitigation**: Gradual rollout with fallback to guest mode
- **Risk**: Edge Function limitations
  - **Mitigation**: Monitor function execution times and optimize

This plan maintains your current high-performing React + Vite frontend while significantly enhancing the backend capabilities with modern, type-safe database operations and comprehensive data persistence.