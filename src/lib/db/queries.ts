import { eq, and, desc } from 'drizzle-orm';
import { db } from './index';
import { 
  users, 
  evaluations, 
  userUsage, 
  usageAnalytics,
  type NewUser,
  type NewEvaluation,
  type NewUserUsage,
  type NewUsageAnalytic
} from './schema';

// User operations
export const createUser = async (userData: NewUser) => {
  const [user] = await db.insert(users).values(userData).returning();
  return user;
};

export const getUserByEmail = async (email: string) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
};

export const getUserById = async (id: string) => {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
};

export const updateUserSubscription = async (
  userId: string, 
  subscriptionData: {
    subscriptionTier?: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    subscriptionStatus?: string;
    subscriptionCurrentPeriodEnd?: Date;
  }
) => {
  const [user] = await db
    .update(users)
    .set({ ...subscriptionData, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();
  return user;
};

// Evaluation operations
export const createEvaluation = async (evaluationData: NewEvaluation) => {
  const [evaluation] = await db.insert(evaluations).values(evaluationData).returning();
  return evaluation;
};

export const getUserEvaluations = async (userId: string, limit = 10) => {
  return await db
    .select()
    .from(evaluations)
    .where(eq(evaluations.userId, userId))
    .orderBy(desc(evaluations.createdAt))
    .limit(limit);
};

export const getEvaluationById = async (id: string) => {
  const [evaluation] = await db.select().from(evaluations).where(eq(evaluations.id, id));
  return evaluation;
};

// Usage tracking operations
export const getUserUsageForMonth = async (userId: string, monthYear: string) => {
  const [usage] = await db
    .select()
    .from(userUsage)
    .where(and(eq(userUsage.userId, userId), eq(userUsage.monthYear, monthYear)));
  return usage;
};

export const createOrUpdateUserUsage = async (usageData: NewUserUsage) => {
  const existing = await getUserUsageForMonth(usageData.userId, usageData.monthYear);
  
  if (existing) {
    const [updated] = await db
      .update(userUsage)
      .set({ ...usageData, updatedAt: new Date() })
      .where(and(
        eq(userUsage.userId, usageData.userId),
        eq(userUsage.monthYear, usageData.monthYear)
      ))
      .returning();
    return updated;
  } else {
    const [created] = await db.insert(userUsage).values(usageData).returning();
    return created;
  }
};

export const incrementUserEvaluationCount = async (userId: string) => {
  const now = new Date();
  const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const existing = await getUserUsageForMonth(userId, monthYear);
  
  if (existing) {
    const [updated] = await db
      .update(userUsage)
      .set({ 
        evaluationsUsed: existing.evaluationsUsed + 1,
        updatedAt: new Date()
      })
      .where(and(
        eq(userUsage.userId, userId),
        eq(userUsage.monthYear, monthYear)
      ))
      .returning();
    return updated;
  } else {
    // Create new usage record
    const [created] = await db.insert(userUsage).values({
      userId,
      monthYear,
      evaluationsUsed: 1,
      evaluationsLimit: 1, // Default free tier limit
    }).returning();
    return created;
  }
};

export const canUserEvaluate = async (userId: string): Promise<boolean> => {
  const now = new Date();
  const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const usage = await getUserUsageForMonth(userId, monthYear);
  
  if (!usage) {
    return true; // First evaluation of the month
  }
  
  return usage.evaluationsUsed < usage.evaluationsLimit;
};

// Analytics operations
export const logUserAction = async (analyticsData: NewUsageAnalytic) => {
  const [analytic] = await db.insert(usageAnalytics).values(analyticsData).returning();
  return analytic;
};

export const getUserAnalytics = async (userId: string, limit = 50) => {
  return await db
    .select()
    .from(usageAnalytics)
    .where(eq(usageAnalytics.userId, userId))
    .orderBy(desc(usageAnalytics.createdAt))
    .limit(limit);
};

// Platform statistics
export const getPlatformStats = async (userId?: string) => {
  let query = db
    .select({
      platform: evaluations.platform,
      count: db.$count(evaluations),
      avgScore: db.avg(evaluations.overallScore)
    })
    .from(evaluations)
    .groupBy(evaluations.platform);
    
  if (userId) {
    query = query.where(eq(evaluations.userId, userId));
  }
  
  return await query;
};

export const getUserStats = async (userId: string) => {
  const [totalEvaluations] = await db
    .select({ count: db.$count() })
    .from(evaluations)
    .where(eq(evaluations.userId, userId));
    
  const [avgScore] = await db
    .select({ avg: db.avg(evaluations.overallScore) })
    .from(evaluations)
    .where(eq(evaluations.userId, userId));
    
  const now = new Date();
  const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const currentUsage = await getUserUsageForMonth(userId, monthYear);
  
  return {
    totalEvaluations: totalEvaluations.count,
    averageScore: avgScore.avg ? Number(avgScore.avg) : 0,
    currentMonthUsage: currentUsage?.evaluationsUsed || 0,
    currentMonthLimit: currentUsage?.evaluationsLimit || 1,
  };
};