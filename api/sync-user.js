import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';

// Database schema (copied from analyze-ad.js)
const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').unique().notNull(),
  tier: text('tier').default('free').notNull(),
  monthlyEvaluations: integer('monthly_evaluations').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔄 Sync user request received:', { body: req.body, headers: req.headers });
    
    const { userId, email } = req.body;

    if (!userId || !email) {
      console.log('❌ Missing required fields:', { userId, email });
      return res.status(400).json({ error: 'Missing userId or email' });
    }

    console.log('✅ Valid sync request:', { userId, email });

    // Initialize database connection
    if (!process.env.DATABASE_URL) {
      console.log('❌ Database URL not configured');
      return res.status(500).json({ error: 'Database not configured' });
    }

    const client = postgres(process.env.DATABASE_URL, { prepare: false });
    const db = drizzle(client);

    console.log('🔍 Checking for existing user with ID:', userId);

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    console.log('🔍 Existing user query result:', existingUser);

    if (existingUser.length > 0) {
      console.log('✅ User already exists:', existingUser[0]);
      return res.status(200).json({
        success: true,
        message: 'User already exists',
        user: existingUser[0]
      });
    }

    // Create new user
    const newUser = await db
      .insert(users)
      .values({
        id: userId,
        email: email,
        tier: 'free',
        monthlyEvaluations: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    console.log('✅ User created:', newUser[0]);

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: newUser[0]
    });

  } catch (error) {
    console.error('❌ User sync failed:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to sync user',
      details: error.message
    });
  }
}