import React, { useState } from 'react';
import { AlertCircle, Crown, Zap, Clock, UserPlus, ArrowUpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useAdEvaluation } from '../context/AdEvaluationContext';
import { hasUsedAnonymousCheck } from '../lib/usage-tracking';
import AuthModal from './auth/AuthModal';

interface UsageBannerProps {
  usage?: {
    used: number;
    limit: number;
    tier: 'free' | 'pro' | 'enterprise';
  };
}

const UsageBanner: React.FC<UsageBannerProps> = () => {
  const { usageData, realUsage, remainingEvaluations, daysUntilReset, canPerformEvaluation } = useAdEvaluation();
  const { isSignedIn } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Check for admin mode
  const isAdminMode = remainingEvaluations === 999;
  
  // Prefer real usage data from backend, fallback to localStorage
  const currentUsage = realUsage ? {
    used: realUsage.used,
    limit: realUsage.limit,
    tier: 'free' as const
  } : {
    used: usageData.evaluationsUsed,
    limit: usageData.monthlyLimit,
    tier: 'free' as const
  };
  
  // Use real usage data for evaluation capability if available
  const canActuallyEvaluate = realUsage ? realUsage.canEvaluate : canPerformEvaluation;
  const actualRemainingEvaluations = realUsage ? realUsage.remaining : remainingEvaluations;
  
  // Debug logging
  console.log('UsageBanner Debug:', {
    realUsage,
    canPerformEvaluation,
    canActuallyEvaluate,
    actualRemainingEvaluations,
    currentUsage
  });

  // Simplified logic: if we can't evaluate OR used >= limit, we're over the limit
  const isOverLimit = !canActuallyEvaluate;
  const isNearLimit = !isOverLimit && currentUsage.used >= currentUsage.limit * 0.67;
  
  console.log('UsageBanner Boolean Logic:', {
    isOverLimit,
    isNearLimit,
    canActuallyEvaluate,
    calculation: `!${canActuallyEvaluate} = ${isOverLimit}`
  });

  // For anonymous users who haven't used their free check, show different messaging
  if (!isSignedIn && !hasUsedAnonymousCheck()) {
    return (
      <div className="rounded-lg p-4 mb-6 bg-green-50 border border-green-200">
        <div className="flex items-center gap-3">
          <Zap className="h-5 w-5 text-green-600" />
          <div>
            <h3 className="font-medium text-green-900">Free Analysis Available</h3>
            <p className="text-sm text-green-700">Get your first 3 ad-to-page congruence scores completely free</p>
          </div>
        </div>
      </div>
    );
  }

  // For anonymous users who have used their free check, show signup prompt
  if (!isSignedIn && hasUsedAnonymousCheck()) {
    return (
      <>
        <div className="rounded-lg p-4 mb-6 bg-orange-50 border border-orange-200">
          <div className="flex items-start gap-3">
            <UserPlus className="h-5 w-5 text-orange-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-orange-900">Sign up to analyze more ads</h3>
              <p className="text-sm text-orange-700 mt-1">
                You've used your free analysis! Sign up to get 2 more evaluations this month.
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="mt-3 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
              >
                Sign Up - It's Free
              </button>
            </div>
          </div>
        </div>
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            // The page will refresh and show updated usage limits
          }}
        />
      </>
    );
  }

  // Don't show banner in admin mode
  if (isAdminMode) {
    return (
      <div className="rounded-lg p-4 mb-6 bg-green-50 border border-green-200">
        <div className="flex items-center gap-3">
          <Crown className="h-5 w-5 text-green-600" />
          <div>
            <h3 className="font-medium text-green-900">Admin Mode Active</h3>
            <p className="text-sm text-green-700">Unlimited evaluations enabled</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg p-4 mb-6 ${
      isOverLimit 
        ? 'bg-red-50 border border-red-200' 
        : isNearLimit 
          ? 'bg-yellow-50 border border-yellow-200'
          : 'bg-blue-50 border border-blue-200'
    }`}>
      <div className="flex items-start gap-3">
        {isOverLimit ? (
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
        ) : (
          <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
        )}
        <div className="flex-1">
          <h3 className={`font-medium ${
            isOverLimit ? 'text-red-900' : isNearLimit ? 'text-yellow-900' : 'text-blue-900'
          }`}>
            {isOverLimit 
              ? 'Monthly limit reached' 
              : `Free Plan: ${currentUsage.used}/${currentUsage.limit} evaluations used this month`
            }
          </h3>
          <p className={`text-sm mt-1 ${
            isOverLimit ? 'text-red-700' : isNearLimit ? 'text-yellow-700' : 'text-blue-700'
          }`}>
            {isOverLimit
              ? `Resets in ${daysUntilReset} day${daysUntilReset !== 1 ? 's' : ''}.`
              : `${actualRemainingEvaluations} evaluation${actualRemainingEvaluations !== 1 ? 's' : ''} remaining. Resets in ${daysUntilReset} day${daysUntilReset !== 1 ? 's' : ''}.`
            }
          </p>
          {(isOverLimit || isNearLimit) && (
            <div className="mt-3">
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-medium rounded-lg hover:from-orange-600 hover:to-red-600 transition-all"
              >
                <ArrowUpCircle className="h-4 w-4" />
                Upgrade for More Evaluations
              </Link>
            </div>
          )}
          {isOverLimit && (
            <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
              <Clock className="h-4 w-4" />
              <span>Next reset: {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsageBanner;