import React, { useState } from 'react';
import { AlertCircle, Crown, Zap, Clock } from 'lucide-react';
import { useAdEvaluation } from '../context/AdEvaluationContext';
import PricingModal from './PricingModal';

interface UsageBannerProps {
  usage?: {
    used: number;
    limit: number;
    tier: 'free' | 'pro' | 'enterprise';
  };
}

const UsageBanner: React.FC<UsageBannerProps> = () => {
  const [showPricing, setShowPricing] = useState(false);
  const { usageData, remainingEvaluations, daysUntilReset, canPerformEvaluation } = useAdEvaluation();

  // Check for admin mode
  const isAdminMode = remainingEvaluations === 999;
  
  // Use real usage data from context
  const currentUsage = {
    used: usageData.evaluationsUsed,
    limit: usageData.monthlyLimit,
    tier: 'free' as const
  };

  const isNearLimit = currentUsage.used >= currentUsage.limit * 0.67; // Show warning at 2/3 used
  const isOverLimit = !canPerformEvaluation;

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
    <>
      <div className={`rounded-lg p-4 mb-6 ${
        isOverLimit 
          ? 'bg-red-50 border border-red-200' 
          : isNearLimit 
            ? 'bg-yellow-50 border border-yellow-200'
            : 'bg-blue-50 border border-blue-200'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {isOverLimit ? (
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            ) : (
              <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
            )}
            <div>
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
                  ? `Resets in ${daysUntilReset} day${daysUntilReset !== 1 ? 's' : ''}. Upgrade for unlimited access now.`
                  : `${remainingEvaluations} evaluation${remainingEvaluations !== 1 ? 's' : ''} remaining. Resets in ${daysUntilReset} day${daysUntilReset !== 1 ? 's' : ''}.`
                }
              </p>
              {isOverLimit && (
                <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                  <Clock className="h-4 w-4" />
                  <span>Next reset: {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowPricing(true)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
              isOverLimit
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Crown className="h-4 w-4" />
            Upgrade
          </button>
        </div>
      </div>

      <PricingModal 
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
        currentUsage={currentUsage}
      />
    </>
  );
};

export default UsageBanner;