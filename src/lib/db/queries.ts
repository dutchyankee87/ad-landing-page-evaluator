import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from './index';
import { users, evaluations, TIER_LIMITS, type User, type NewUser, type NewEvaluation } from './schema';

// User operations
export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0] || null;
}

export async function createUser(userData: NewUser): Promise<User> {
  const result = await db.insert(users).values(userData).returning();
  return result[0];
}

export async function incrementUserEvaluations(userId: string): Promise<void> {
  await db
    .update(users)
    .set({ 
      monthlyEvaluations: sql`monthly_evaluations + 1`,
      updatedAt: new Date()
    })
    .where(eq(users.id, userId));
}

// Check if user can perform evaluation
export async function canUserEvaluate(userId: string): Promise<boolean> {
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user[0]) return false;
  
  const limit = TIER_LIMITS[user[0].tier];
  return user[0].monthlyEvaluations < limit;
}

// Evaluation operations
export async function createEvaluation(evaluationData: NewEvaluation): Promise<void> {
  await db.insert(evaluations).values(evaluationData);
}

export async function getUserEvaluations(userId: string, limit = 10) {
  return await db
    .select()
    .from(evaluations)
    .where(eq(evaluations.userId, userId))
    .orderBy(desc(evaluations.createdAt))
    .limit(limit);
}

export async function getEvaluationStats(userId: string) {
  const userEvaluations = await db
    .select()
    .from(evaluations)
    .where(eq(evaluations.userId, userId));

  if (userEvaluations.length === 0) {
    return {
      totalEvaluations: 0,
      averageScore: 0,
      platformBreakdown: {},
    };
  }

  const totalScore = userEvaluations.reduce((sum, eval) => sum + eval.overallScore, 0);
  const averageScore = Math.round(totalScore / userEvaluations.length);

  const platformBreakdown = userEvaluations.reduce((breakdown, eval) => {
    breakdown[eval.platform] = (breakdown[eval.platform] || 0) + 1;
    return breakdown;
  }, {} as Record<string, number>);

  return {
    totalEvaluations: userEvaluations.length,
    averageScore,
    platformBreakdown,
  };
}