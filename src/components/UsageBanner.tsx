import React, { useState } from 'react';
import { AlertCircle, Crown, Zap } from 'lucide-react';
import PricingModal from './PricingModal';

interface UsageBannerProps {
  usage?: {
    used: number;
    limit: number;
    tier: 'free' | 'pro' | 'enterprise';
  };
}

const UsageBanner: React.FC<UsageBannerProps> = ({ usage }) => {
  const [showPricing, setShowPricing] = useState(false);

  // Mock usage for demo (remove when real auth is implemented)
  const mockUsage = usage || { used: 0, limit: 1, tier: 'free' as const };

  const isNearLimit = mockUsage.used >= mockUsage.limit * 0.8;
  const isOverLimit = mockUsage.used >= mockUsage.limit;

  if (mockUsage.tier !== 'free') return null; // Only show for free tier

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
                  : `Free Plan: ${mockUsage.used}/${mockUsage.limit} evaluations used`
                }
              </h3>
              <p className={`text-sm mt-1 ${
                isOverLimit ? 'text-red-700' : isNearLimit ? 'text-yellow-700' : 'text-blue-700'
              }`}>
                {isOverLimit
                  ? 'Upgrade to continue evaluating your ads with AI-powered insights.'
                  : 'Get unlimited evaluations and advanced features with Professional plan.'
                }
              </p>
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
        currentUsage={mockUsage}
      />
    </>
  );
};

export default UsageBanner;