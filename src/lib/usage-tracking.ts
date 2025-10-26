// Usage tracking utilities for managing monthly evaluation limits
export interface UsageData {
  evaluationsUsed: number;
  monthlyLimit: number;
  currentMonth: string; // YYYY-MM format
  lastEvaluationDate: string;
  userId?: string; // Add user ID for authenticated tracking
}

const STORAGE_KEY = 'adalign_usage';
const ANONYMOUS_STORAGE_KEY = 'adalign_anonymous_usage';
const ANONYMOUS_LIMIT = 1; // 1 free check for anonymous users
const AUTHENTICATED_LIMIT = 2; // 2 additional checks for authenticated users

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

    // Reset if new month
    if (parsed.currentMonth !== currentMonth) {
      return initializeUsageData(userId);
    }

    return parsed;
  } catch (error) {
    console.warn('Failed to parse usage data:', error);
    return initializeUsageData(userId);
  }
}

// Initialize fresh usage data
function initializeUsageData(userId?: string): UsageData {
  const data: UsageData = {
    evaluationsUsed: 0,
    monthlyLimit: userId ? AUTHENTICATED_LIMIT : ANONYMOUS_LIMIT,
    currentMonth: getCurrentMonth(),
    lastEvaluationDate: '',
    userId
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

// Check if user can perform another evaluation
export function canEvaluate(userId?: string): boolean {
  // Admin bypass
  if (hasAdminBypass()) {
    return true;
  }
  
  const usage = getUsageData(userId);
  return usage.evaluationsUsed < usage.monthlyLimit;
}

// Get remaining evaluations
export function getRemainingEvaluations(userId?: string): number {
  // Admin bypass shows unlimited
  if (hasAdminBypass()) {
    return 999;
  }
  
  const usage = getUsageData(userId);
  return Math.max(0, usage.monthlyLimit - usage.evaluationsUsed);
}

// Record a new evaluation
export function recordEvaluation(userId?: string): boolean {
  // Admin bypass - don't record usage
  if (hasAdminBypass()) {
    return true;
  }
  
  const usage = getUsageData(userId);
  
  if (!canEvaluate(userId)) {
    return false;
  }

  usage.evaluationsUsed += 1;
  usage.lastEvaluationDate = new Date().toISOString();
  usage.userId = userId; // Ensure userId is set
  
  saveUsageData(usage, userId);
  return true;
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

// Get total evaluations available (anonymous + authenticated combined)
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