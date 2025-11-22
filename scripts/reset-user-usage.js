import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database schema for Clerk users
const clerkUsers = pgTable('clerk_users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  tier: text('tier').default('free').notNull(),
  monthlyEvaluations: integer('monthly_evaluations').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});

const TIER_LIMITS = { free: 3, pro: 50, enterprise: 1000 };

async function resetUserUsage() {
  const userEmail = 'richardson.dillon@gmail.com';
  
  try {
    console.log('🔗 Connecting to database...');
    const client = postgres(process.env.DATABASE_URL, { prepare: false });
    const db = drizzle(client);

    console.log(`🔍 Checking current status for: ${userEmail}`);
    
    // Check current user status
    const userResult = await db
      .select()
      .from(clerkUsers)
      .where(eq(clerkUsers.email, userEmail))
      .limit(1);

    if (userResult.length === 0) {
      console.log('❌ User not found in clerk_users table');
      return;
    }

    const user = userResult[0];
    const limit = TIER_LIMITS[user.tier] || TIER_LIMITS.free;
    
    console.log('📊 Current user status:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Tier: ${user.tier}`);
    console.log(`   Monthly Evaluations Used: ${user.monthlyEvaluations}`);
    console.log(`   Monthly Limit: ${limit}`);
    console.log(`   Remaining: ${Math.max(0, limit - user.monthlyEvaluations)}`);
    console.log(`   Created: ${user.createdAt}`);
    console.log(`   Updated: ${user.updatedAt}`);

    if (user.tier === 'enterprise' && user.monthlyEvaluations > 0) {
      console.log('🔄 Resetting usage count for enterprise user...');
      
      await db
        .update(clerkUsers)
        .set({
          monthlyEvaluations: 0,
          updatedAt: new Date()
        })
        .where(eq(clerkUsers.email, userEmail));
      
      console.log('✅ Usage count reset to 0');
      console.log('✅ Enterprise user now has 1000 evaluations available');
    } else if (user.tier !== 'enterprise') {
      console.log(`ℹ️  User tier is '${user.tier}', not 'enterprise'`);
      console.log('💡 To upgrade tier, run:');
      console.log(`   UPDATE clerk_users SET tier = 'enterprise' WHERE email = '${userEmail}';`);
    } else {
      console.log('✅ Usage count is already 0, no reset needed');
    }

    await client.end();
    console.log('🎉 Complete!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetUserUsage();