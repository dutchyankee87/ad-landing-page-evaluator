// Usage tracking utilities for managing monthly evaluation limits
export interface UsageData {
  evaluationsUsed: number;
  monthlyLimit: number;
  currentMonth: string; // YYYY-MM format
  lastEvaluationDate: string;
}

const STORAGE_KEY = 'adalign_usage';
const MONTHLY_LIMIT = 5;

// Get current month in YYYY-MM format
function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
}

// Get usage data from localStorage
export function getUsageData(): UsageData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return initializeUsageData();
    }

    const parsed = JSON.parse(stored) as UsageData;
    const currentMonth = getCurrentMonth();

    // Reset if new month
    if (parsed.currentMonth !== currentMonth) {
      return initializeUsageData();
    }

    return parsed;
  } catch (error) {
    console.warn('Failed to parse usage data:', error);
    return initializeUsageData();
  }
}

// Initialize fresh usage data
function initializeUsageData(): UsageData {
  const data: UsageData = {
    evaluationsUsed: 0,
    monthlyLimit: MONTHLY_LIMIT,
    currentMonth: getCurrentMonth(),
    lastEvaluationDate: ''
  };
  
  saveUsageData(data);
  return data;
}

// Save usage data to localStorage
export function saveUsageData(data: UsageData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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
export function canEvaluate(): boolean {
  // Admin bypass
  if (hasAdminBypass()) {
    return true;
  }
  
  const usage = getUsageData();
  return usage.evaluationsUsed < usage.monthlyLimit;
}

// Get remaining evaluations
export function getRemainingEvaluations(): number {
  // Admin bypass shows unlimited
  if (hasAdminBypass()) {
    return 999;
  }
  
  const usage = getUsageData();
  return Math.max(0, usage.monthlyLimit - usage.evaluationsUsed);
}

// Record a new evaluation
export function recordEvaluation(): boolean {
  // Admin bypass - don't record usage
  if (hasAdminBypass()) {
    return true;
  }
  
  const usage = getUsageData();
  
  if (!canEvaluate()) {
    return false;
  }

  usage.evaluationsUsed += 1;
  usage.lastEvaluationDate = new Date().toISOString();
  
  saveUsageData(usage);
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