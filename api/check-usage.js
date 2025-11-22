import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { pgTable, uuid, text, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';

// Database schema (copied from analyze-ad.js)
const ipRateLimit = pgTable('ip_rate_limit', {
  id: uuid('id').primaryKey(),
  ipAddress: text('ip_address').unique().notNull(),
  monthlyEvaluations: integer('monthly_evaluations').default(0).notNull(),
  currentMonth: text('current_month').notNull(), // YYYY-MM format
  lastEvaluationAt: timestamp('last_evaluation_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
}, (table) => {
  return {
    ipIdx: index('ip_address_idx').on(table.ipAddress),
    monthIdx: index('current_month_idx').on(table.currentMonth),
  };
});

const IP_MONTHLY_LIMIT = 5; // Same as in analyze-ad.js

// Helper function to get client IP address
const getClientIp = (req) => {
  return req.headers['x-forwarded-for'] || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress ||
         (req.connection?.socket?.remoteAddress) ||
         '127.0.0.1';
};

// Helper function to get current month in YYYY-MM format
const getCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
};

// Clerk users table
const clerkUsers = pgTable('clerk_users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  tier: text('tier').default('free').notNull(),
  monthlyEvaluations: integer('monthly_evaluations').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});

const TIER_LIMITS = { free: 3, pro: 50, enterprise: 1000 };

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get client IP address and user email (if provided)
    const clientIp = getClientIp(req);
    const userEmail = req.method === 'POST' ? req.body?.userEmail : req.query?.userEmail;
    
    // Initialize database connection
    if (!process.env.DATABASE_URL) {
      // If no database, return default values
      return res.status(200).json({
        used: 0,
        limit: userEmail ? TIER_LIMITS.free : IP_MONTHLY_LIMIT,
        remaining: userEmail ? TIER_LIMITS.free : IP_MONTHLY_LIMIT,
        canEvaluate: true,
        nextReset: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
      });
    }

    const client = postgres(process.env.DATABASE_URL, { prepare: false });
    const db = drizzle(client);

    const currentMonth = getCurrentMonth();
    
    if (userEmail) {
      // Check user-based usage for authenticated users
      const userResult = await db
        .select()
        .from(clerkUsers)
        .where(eq(clerkUsers.email, userEmail))
        .limit(1);
      
      if (userResult.length === 0) {
        return res.status(404).json({
          error: 'User not found',
          used: 0,
          limit: TIER_LIMITS.free,
          remaining: 0,
          canEvaluate: false,
          nextReset: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
        });
      }
      
      const user = userResult[0];
      const limit = TIER_LIMITS[user.tier] || TIER_LIMITS.free;
      const remaining = Math.max(0, limit - user.monthlyEvaluations);
      const canEvaluate = user.monthlyEvaluations < limit;
      
      return res.status(200).json({
        used: user.monthlyEvaluations,
        limit,
        remaining,
        canEvaluate,
        nextReset: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
        tier: user.tier,
        userEmail: user.email
      });
      
    } else {
      // Check IP-based usage for unauthenticated users
      const ipUsageResult = await db
        .select()
        .from(ipRateLimit)
        .where(eq(ipRateLimit.ipAddress, clientIp))
        .limit(1);
      
      const ipUsage = ipUsageResult[0];
      
      let monthlyEvaluations = 0;
      
      if (ipUsage) {
        // If it's a new month, reset to 0
        if (ipUsage.currentMonth !== currentMonth) {
          monthlyEvaluations = 0;
        } else {
          monthlyEvaluations = ipUsage.monthlyEvaluations;
        }
      }
      
      const remaining = Math.max(0, IP_MONTHLY_LIMIT - monthlyEvaluations);
      const canEvaluate = monthlyEvaluations < IP_MONTHLY_LIMIT;
      const nextReset = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString();
      
      return res.status(200).json({
        used: monthlyEvaluations,
        limit: IP_MONTHLY_LIMIT,
        remaining,
        canEvaluate,
        nextReset,
        ipAddress: clientIp.slice(0, 8) + '***' // Partially hide IP for privacy
      });
    }

  } catch (error) {
    console.error('Usage check failed:', error);
    
    // Return safe defaults on error
    return res.status(200).json({
      used: 0,
      limit: IP_MONTHLY_LIMIT,
      remaining: IP_MONTHLY_LIMIT,
      canEvaluate: true,
      nextReset: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
      error: 'Unable to check usage'
    });
  }
}