# 🗄️ Drizzle ORM Setup Guide

## What's Been Configured

✅ **Drizzle ORM with PostgreSQL (Supabase)**  
✅ **Type-safe database schema**  
✅ **Migration system**  
✅ **Database queries and operations**  
✅ **Zod validation schemas**  

## Database Schema

### Tables Created:
1. **users** - User accounts with subscription info
2. **evaluations** - Ad evaluation results 
3. **user_usage** - Monthly usage tracking for freemium
4. **usage_analytics** - User behavior analytics
5. **evaluation_comparisons** - A/B testing comparisons

### Key Features:
- **UUID primary keys**
- **Timestamp tracking (created_at, updated_at)**
- **JSONB for flexible data (suggestions, metadata)**
- **Constraints for data validation**
- **Foreign key relationships**

## Setup Instructions

### 1. Get Your Supabase Database Password

1. Go to your Supabase project dashboard
2. Settings → Database  
3. Copy your database password (you set this when creating the project)

### 2. Update Environment Variables

Edit your `.env` file and replace `[YOUR-PASSWORD]` with your actual password:

```env
DATABASE_URL="postgresql://postgres.fpmlwytpgwtnpjjvclld:YOUR_ACTUAL_PASSWORD@aws-1-eu-west-3.pooler.supabase.com:6543/postgres"
```

### 3. Run Database Setup

```bash
# Setup the database schema
node setup-db.js
```

This will:
- Test your database connection
- Create all tables with proper relationships
- Set up constraints and indexes

### 4. Verify Setup

```bash
# Open Drizzle Studio to view your database
npm run db:studio
```

Visit http://localhost:4983 to see your database tables.

## Available Commands

```bash
# Generate new migrations from schema changes
npm run db:generate

# Push schema changes directly to database  
npm run db:push

# Open database studio
npm run db:studio

# Run migrations (not needed with db:push)
npm run db:migrate
```

## Database Operations

### Creating a User
```typescript
import { createUser } from './src/lib/db/queries';

const user = await createUser({
  id: 'user-uuid',
  email: 'user@example.com',
  fullName: 'John Doe',
  subscriptionTier: 'free'
});
```

### Creating an Evaluation
```typescript
import { createEvaluation } from './src/lib/db/queries';

const evaluation = await createEvaluation({
  userId: 'user-uuid',
  title: 'My Ad Evaluation',
  platform: 'meta',
  adScreenshotUrl: 'https://...',
  landingPageUrl: 'https://...',
  overallScore: '8.5',
  visualMatchScore: '9.0',
  contextualMatchScore: '8.0', 
  toneAlignmentScore: '8.5'
});
```

### Checking Usage Limits
```typescript
import { canUserEvaluate, incrementUserEvaluationCount } from './src/lib/db/queries';

// Check if user can evaluate
const canEvaluate = await canUserEvaluate('user-uuid');

if (canEvaluate) {
  // Process evaluation...
  
  // Increment usage count
  await incrementUserEvaluationCount('user-uuid');
}
```

## Integration with Your App

### Current Status
- ✅ **Schema defined** with all necessary tables
- ✅ **Query functions** for common operations  
- ✅ **Type safety** with TypeScript and Zod
- ✅ **Migration system** for schema changes

### Next Steps (Optional)
1. **Update Context**: Integrate Drizzle queries with React context
2. **Add Auth**: Connect Supabase auth with user table
3. **Real-time**: Add subscriptions for live updates
4. **Analytics**: Build dashboard with usage stats

## Type Safety

All database operations are fully typed:

```typescript
import type { User, Evaluation, UserUsage } from './src/lib/db/schema';

// TypeScript will catch errors at compile time
const user: User = await getUserById('uuid');
const evaluations: Evaluation[] = await getUserEvaluations('uuid');
```

## Error Handling

```typescript
try {
  const user = await createUser(userData);
  console.log('User created:', user);
} catch (error) {
  if (error.message.includes('duplicate key')) {
    console.log('User already exists');
  } else {
    console.error('Database error:', error);
  }
}
```

## Production Considerations

### Connection Pooling
The setup uses connection pooling for optimal performance in serverless environments.

### Migrations
- Use `npm run db:generate` when you change the schema
- Use `npm run db:push` to apply changes to database
- Migrations are stored in `/drizzle` folder

### Security
- All queries use parameterized statements (SQL injection safe)
- Foreign key constraints prevent orphaned data
- Check constraints validate data integrity

Your Drizzle ORM setup is production-ready! 🚀