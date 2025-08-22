import { eq, and, desc, sql, avg, count, gte, lte } from 'drizzle-orm';
import { db } from './index';
import { 
  users, 
  evaluations, 
  performanceFeedback,
  performanceMetrics,
  industryBenchmarks,
  recommendationTracking,
  TIER_LIMITS, 
  type User, 
  type NewUser, 
  type NewEvaluation,
  type NewPerformanceFeedback,
  type NewPerformanceMetrics,
  type NewRecommendationTracking,
  type Industry,
  type AudienceType
} from './schema';

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

// Performance Feedback Operations
export async function createPerformanceFeedback(feedbackData: NewPerformanceFeedback) {
  const result = await db.insert(performanceFeedback).values(feedbackData).returning();
  return result[0];
}

export async function getPerformanceFeedback(evaluationId: string) {
  return await db
    .select()
    .from(performanceFeedback)
    .where(eq(performanceFeedback.evaluationId, evaluationId))
    .orderBy(desc(performanceFeedback.createdAt));
}

// Performance Metrics Operations (Anonymous)
export async function createPerformanceMetrics(metricsData: NewPerformanceMetrics) {
  const result = await db.insert(performanceMetrics).values(metricsData).returning();
  return result[0];
}

export async function getPerformanceMetricsByPlatform(platform: string, industry?: string) {
  const conditions = [eq(performanceMetrics.platform, platform)];
  if (industry) {
    conditions.push(eq(performanceMetrics.industry, industry));
  }

  return await db
    .select()
    .from(performanceMetrics)
    .where(and(...conditions))
    .orderBy(desc(performanceMetrics.createdAt));
}

// Industry Benchmarks Operations
export async function getIndustryBenchmarks(platform: string, industry: string, scoreType = 'overall') {
  const result = await db
    .select()
    .from(industryBenchmarks)
    .where(
      and(
        eq(industryBenchmarks.platform, platform),
        eq(industryBenchmarks.industry, industry),
        eq(industryBenchmarks.scoreType, scoreType)
      )
    )
    .limit(1);
  
  return result[0] || null;
}

export async function updateIndustryBenchmarks(platform: string, industry: string, scoreType: string) {
  // Calculate new benchmarks from recent evaluations
  const recentEvaluations = await db
    .select({ 
      overallScore: evaluations.overallScore,
      visualScore: evaluations.visualScore,
      contextualScore: evaluations.contextualScore,
      toneScore: evaluations.toneScore
    })
    .from(evaluations)
    .where(
      and(
        eq(evaluations.platform, platform),
        eq(evaluations.industry, industry),
        gte(evaluations.createdAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) // Last 30 days
      )
    );

  if (recentEvaluations.length < 10) {
    return null; // Need at least 10 evaluations for meaningful benchmarks
  }

  const scores = recentEvaluations.map(e => 
    scoreType === 'overall' ? e.overallScore :
    scoreType === 'visual' ? e.visualScore :
    scoreType === 'contextual' ? e.contextualScore :
    scoreType === 'tone' ? e.toneScore : e.overallScore
  ).sort((a, b) => a - b);

  const percentile10 = scores[Math.floor(scores.length * 0.1)];
  const percentile25 = scores[Math.floor(scores.length * 0.25)];
  const percentile50 = scores[Math.floor(scores.length * 0.5)];
  const percentile75 = scores[Math.floor(scores.length * 0.75)];
  const percentile90 = scores[Math.floor(scores.length * 0.9)];

  // Upsert benchmark data
  const result = await db
    .insert(industryBenchmarks)
    .values({
      platform,
      industry,
      scoreType,
      percentile10,
      percentile25,
      percentile50,
      percentile75,
      percentile90,
      sampleSize: scores.length,
      updatedAt: new Date()
    })
    .onConflictDoUpdate({
      target: [industryBenchmarks.platform, industryBenchmarks.industry, industryBenchmarks.scoreType],
      set: {
        percentile10,
        percentile25,
        percentile50,
        percentile75,
        percentile90,
        sampleSize: scores.length,
        updatedAt: new Date()
      }
    })
    .returning();

  return result[0];
}

// Recommendation Tracking Operations
export async function createRecommendationTracking(trackingData: NewRecommendationTracking) {
  const result = await db.insert(recommendationTracking).values(trackingData).returning();
  return result[0];
}

export async function updateRecommendationImplementation(
  evaluationId: string, 
  recommendationType: string,
  implemented: boolean,
  effectivenessRating?: number
) {
  return await db
    .update(recommendationTracking)
    .set({
      implemented,
      implementedAt: implemented ? new Date() : null,
      effectivenessRating
    })
    .where(
      and(
        eq(recommendationTracking.evaluationId, evaluationId),
        eq(recommendationTracking.recommendationType, recommendationType)
      )
    )
    .returning();
}

export async function getRecommendationStats(evaluationId: string) {
  const recommendations = await db
    .select()
    .from(recommendationTracking)
    .where(eq(recommendationTracking.evaluationId, evaluationId));

  const total = recommendations.length;
  const implemented = recommendations.filter(r => r.implemented).length;
  const averageRating = recommendations
    .filter(r => r.effectivenessRating)
    .reduce((sum, r) => sum + (r.effectivenessRating || 0), 0) / 
    recommendations.filter(r => r.effectivenessRating).length || 0;

  return {
    total,
    implemented,
    implementationRate: total > 0 ? implemented / total : 0,
    averageEffectivenessRating: averageRating
  };
}

// Industry Classification Helper
export async function detectIndustry(landingPageUrl: string): Promise<Industry> {
  // Simple keyword-based industry detection
  // In production, this could use AI/ML for better accuracy
  const url = landingPageUrl.toLowerCase();
  
  if (url.includes('shop') || url.includes('store') || url.includes('buy') || url.includes('cart')) {
    return 'ecommerce';
  }
  if (url.includes('saas') || url.includes('software') || url.includes('app') || url.includes('platform')) {
    return 'saas';
  }
  if (url.includes('bank') || url.includes('finance') || url.includes('loan') || url.includes('invest')) {
    return 'financial-services';
  }
  if (url.includes('health') || url.includes('medical') || url.includes('doctor') || url.includes('clinic')) {
    return 'healthcare';
  }
  if (url.includes('edu') || url.includes('school') || url.includes('university') || url.includes('course')) {
    return 'education';
  }
  if (url.includes('real-estate') || url.includes('property') || url.includes('homes') || url.includes('realtor')) {
    return 'real-estate';
  }
  if (url.includes('travel') || url.includes('hotel') || url.includes('flight') || url.includes('booking')) {
    return 'travel';
  }
  if (url.includes('consulting') || url.includes('service') || url.includes('agency') || url.includes('business')) {
    return 'b2b-services';
  }
  if (url.includes('org') || url.includes('nonprofit') || url.includes('charity') || url.includes('foundation')) {
    return 'nonprofit';
  }
  
  return 'other';
}

// Benchmark Comparison Helper
export async function getEvaluationPercentile(
  score: number, 
  platform: string, 
  industry: string, 
  scoreType = 'overall'
): Promise<number | null> {
  const benchmark = await getIndustryBenchmarks(platform, industry, scoreType);
  
  if (!benchmark) return null;
  
  if (score <= benchmark.percentile10!) return 10;
  if (score <= benchmark.percentile25!) return 25;
  if (score <= benchmark.percentile50!) return 50;
  if (score <= benchmark.percentile75!) return 75;
  if (score <= benchmark.percentile90!) return 90;
  return 95;
}

// Data Flywheel Analytics
export async function getDataFlywheelMetrics() {
  const [
    totalEvaluations,
    totalFeedback,
    totalMetrics,
    implementationRate
  ] = await Promise.all([
    db.select({ count: count() }).from(evaluations),
    db.select({ count: count() }).from(performanceFeedback),
    db.select({ count: count() }).from(performanceMetrics),
    db.select({ 
      implemented: count(),
      total: sql`COUNT(*) OVER()`
    })
    .from(recommendationTracking)
    .where(eq(recommendationTracking.implemented, true))
  ]);

  return {
    totalEvaluations: totalEvaluations[0].count,
    totalFeedback: totalFeedback[0].count,
    totalMetrics: totalMetrics[0].count,
    implementationRate: implementationRate[0] ? 
      Number(implementationRate[0].implemented) / Number(implementationRate[0].total) : 0
  };
}