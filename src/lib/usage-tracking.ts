// Usage tracking utilities for managing monthly evaluation limits
export type EvaluationType = 'image' | 'video';

export interface UsageData {
  evaluationsUsed: number; // Legacy - total evaluations
  imageEvaluationsUsed: number;
  videoEvaluationsUsed: number;
  monthlyLimit: number; // Legacy - image limit
  imageMonthlyLimit: number;
  videoMonthlyLimit: number;
  currentMonth: string; // YYYY-MM format
  lastEvaluationDate: string;
  userId?: string;
  tier: 'free' | 'pro' | 'agency' | 'enterprise';
}

// Tier configurations with video caps
const TIER_LIMITS = {
  free: {
    image: 3,
    video: 0 // No video for free tier
  },
  pro: {
    image: 50,
    video: 5
  },
  agency: {
    image: 200,
    video: 50
  },
  enterprise: {
    image: 1000,
    video: 500
  }
};

const STORAGE_KEY = 'adalign_usage';
const ANONYMOUS_STORAGE_KEY = 'adalign_anonymous_usage';
const ANONYMOUS_LIMIT = 1; // 1 free check for anonymous users
const AUTHENTICATED_LIMIT = 3; // 3 total checks for authenticated users (was 2 additional)

// Get current month in YYYY-MM format
function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
}

// Get usage data from localStorage (with optional user ID for authenticated users)
export function getUsageData(userId?: string): UsageData {
  try {
    const storageKey = userId ? `${STORAGE_KEY}_${userId}` : ANONYMOUS_STORAGE_KEY;
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      return initializeUsageData(userId);
    }

    const parsed = JSON.parse(stored) as UsageData;
    const currentMonth = getCurrentMonth();

    // Reset if new month or if tier is missing (data corruption)
    if (parsed.currentMonth !== currentMonth || !parsed.tier) {
      return initializeUsageData(userId);
    }

    // Ensure tier is set (fallback for corrupted data)
    if (!parsed.tier) {
      parsed.tier = getUserTier(userId);
    }

    return parsed;
  } catch (error) {
    console.warn('Failed to parse usage data:', error);
    return initializeUsageData(userId);
  }
}

// Get user tier (simplified for now - in production this would come from auth/database)
function getUserTier(userId?: string): 'free' | 'pro' | 'agency' | 'enterprise' {
  if (!userId) return 'free';
  
  // TODO: Integrate with actual user tier from database/auth
  // For now, return free for all authenticated users
  return 'free';
}

// Initialize fresh usage data
function initializeUsageData(userId?: string): UsageData {
  const tier = getUserTier(userId);
  const limits = TIER_LIMITS[tier];
  
  const data: UsageData = {
    evaluationsUsed: 0, // Legacy
    imageEvaluationsUsed: 0,
    videoEvaluationsUsed: 0,
    monthlyLimit: userId ? AUTHENTICATED_LIMIT : ANONYMOUS_LIMIT, // Legacy
    imageMonthlyLimit: limits.image,
    videoMonthlyLimit: limits.video,
    currentMonth: getCurrentMonth(),
    lastEvaluationDate: '',
    userId,
    tier
  };
  
  saveUsageData(data, userId);
  return data;
}

// Save usage data to localStorage
export function saveUsageData(data: UsageData, userId?: string): void {
  try {
    const storageKey = userId ? `${STORAGE_KEY}_${userId}` : ANONYMOUS_STORAGE_KEY;
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save usage data:', error);
  }
}

// Check for admin bypass
function hasAdminBypass(): boolean {
  try {
    const adminKey = localStorage.getItem('adalign_admin_key');
    return adminKey === 'adalign_dev_2024_unlimited';
  } catch {
    return false;
  }
}

// Check if user can perform another evaluation (specific type)
export function canEvaluate(userId?: string, evaluationType: EvaluationType = 'image'): boolean {
  // Admin bypass
  if (hasAdminBypass()) {
    return true;
  }
  
  const usage = getUsageData(userId);
  
  if (evaluationType === 'video') {
    return usage.videoEvaluationsUsed < usage.videoMonthlyLimit;
  } else {
    return usage.imageEvaluationsUsed < usage.imageMonthlyLimit;
  }
}

// Legacy function - checks image evaluations for backward compatibility
export function canEvaluateImage(userId?: string): boolean {
  return canEvaluate(userId, 'image');
}

// Check if user can evaluate videos
export function canEvaluateVideo(userId?: string): boolean {
  return canEvaluate(userId, 'video');
}

// Get remaining evaluations for specific type
export function getRemainingEvaluations(userId?: string, evaluationType: EvaluationType = 'image'): number {
  // Admin bypass shows unlimited
  if (hasAdminBypass()) {
    return 999;
  }
  
  const usage = getUsageData(userId);
  
  if (evaluationType === 'video') {
    return Math.max(0, usage.videoMonthlyLimit - usage.videoEvaluationsUsed);
  } else {
    return Math.max(0, usage.imageMonthlyLimit - usage.imageEvaluationsUsed);
  }
}

// Get remaining image evaluations
export function getRemainingImageEvaluations(userId?: string): number {
  return getRemainingEvaluations(userId, 'image');
}

// Get remaining video evaluations
export function getRemainingVideoEvaluations(userId?: string): number {
  return getRemainingEvaluations(userId, 'video');
}

// Record a new evaluation (specific type)
export function recordEvaluation(userId?: string, evaluationType: EvaluationType = 'image'): boolean {
  // Admin bypass - don't record usage
  if (hasAdminBypass()) {
    return true;
  }
  
  const usage = getUsageData(userId);
  
  if (!canEvaluate(userId, evaluationType)) {
    return false;
  }

  // Update specific counter
  if (evaluationType === 'video') {
    usage.videoEvaluationsUsed += 1;
  } else {
    usage.imageEvaluationsUsed += 1;
  }
  
  // Update legacy counter for backward compatibility
  usage.evaluationsUsed = usage.imageEvaluationsUsed + usage.videoEvaluationsUsed;
  
  usage.lastEvaluationDate = new Date().toISOString();
  usage.userId = userId; // Ensure userId is set
  
  saveUsageData(usage, userId);
  return true;
}

// Legacy function for backward compatibility
export function recordImageEvaluation(userId?: string): boolean {
  return recordEvaluation(userId, 'image');
}

// Record video evaluation
export function recordVideoEvaluation(userId?: string): boolean {
  return recordEvaluation(userId, 'video');
}

// Get days until reset (for display purposes)
export function getDaysUntilReset(): number {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const diffTime = nextMonth.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Get next reset date
export function getNextResetDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}

// Check if anonymous user has used their free check
export function hasUsedAnonymousCheck(): boolean {
  const anonymousUsage = getUsageData(); // No userId = anonymous
  return anonymousUsage.evaluationsUsed >= ANONYMOUS_LIMIT;
}

// Get total evaluations available (anonymous + authenticated combined) - Legacy
export function getTotalEvaluationsAvailable(userId?: string): number {
  if (hasAdminBypass()) return 999;
  
  if (userId) {
    // Authenticated user gets 2 additional checks
    return AUTHENTICATED_LIMIT;
  } else {
    // Anonymous user gets 1 check
    return ANONYMOUS_LIMIT;
  }
}

// Get comprehensive usage summary
export function getUsageSummary(userId?: string) {
  const usage = getUsageData(userId);
  
  return {
    tier: usage.tier,
    currentMonth: usage.currentMonth,
    daysUntilReset: getDaysUntilReset(),
    image: {
      used: usage.imageEvaluationsUsed,
      limit: usage.imageMonthlyLimit,
      remaining: getRemainingImageEvaluations(userId),
      canEvaluate: canEvaluateImage(userId)
    },
    video: {
      used: usage.videoEvaluationsUsed,
      limit: usage.videoMonthlyLimit,
      remaining: getRemainingVideoEvaluations(userId),
      canEvaluate: canEvaluateVideo(userId)
    },
    total: {
      used: usage.evaluationsUsed,
      imageAndVideo: usage.imageEvaluationsUsed + usage.videoEvaluationsUsed
    }
  };
}

// Get tier limits for display
export function getTierLimits(tier: 'free' | 'pro' | 'agency' | 'enterprise') {
  return TIER_LIMITS[tier];
}

// Check if evaluation type is allowed for user's tier
export function isEvaluationTypeAllowed(userId?: string, evaluationType: EvaluationType): boolean {
  if (hasAdminBypass()) return true;
  
  const usage = getUsageData(userId);
  
  if (evaluationType === 'video') {
    return usage.videoMonthlyLimit > 0;
  }
  
  return usage.imageMonthlyLimit > 0;
}