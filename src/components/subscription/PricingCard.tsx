import React from 'react';
import { Check, Star } from 'lucide-react';
import { SubscriptionTier } from '../../lib/subscription';
import { redirectToCheckout } from '../../lib/stripe';
import { logger } from '../../lib/logger';

interface PricingCardProps {
  tier: SubscriptionTier;
  userEmail?: string;
  currentTier?: string;
  isYearly?: boolean;
  onUpgrade?: () => void;
}

export default function PricingCard({ 
  tier, 
  userEmail, 
  currentTier, 
  isYearly = false,
  onUpgrade 
}: PricingCardProps) {
  const isCurrentTier = currentTier === tier.id.replace('_yearly', '');
  const isFree = tier.id === 'free';
  
  const handleUpgrade = async () => {
    if (isFree || isCurrentTier) return;
    
    try {
      await redirectToCheckout(tier.priceId, userEmail);
      onUpgrade?.();
    } catch (error) {
      logger.error('Upgrade error:', error);
      alert('Failed to start upgrade process. Please try again.');
    }
  };

  const getButtonText = () => {
    if (isFree) return 'Current Plan';
    if (isCurrentTier) return 'Current Plan';
    return 'Upgrade Now';
  };

  const getButtonClass = () => {
    if (isFree || isCurrentTier) {
      return 'w-full py-3 px-6 border border-gray-300 text-gray-500 rounded-lg cursor-not-allowed';
    }
    
    if (tier.popular) {
      return 'w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-semibold shadow-lg transform hover:-translate-y-0.5';
    }
    
    return 'w-full py-3 px-6 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold';
  };

  return (
    <div className={`relative rounded-xl p-6 ${
      tier.popular 
        ? 'bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 shadow-lg' 
        : 'bg-white border border-gray-200 shadow-md'
    }`}>
      {tier.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <Star className="h-4 w-4" />
            Most Popular
          </div>
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold text-gray-900">
            ${tier.price}
          </span>
          {!isFree && (
            <span className="text-gray-500">
              /{isYearly ? 'year' : 'month'}
            </span>
          )}
        </div>
        {isYearly && tier.price > 0 && (
          <p className="text-sm text-green-600 font-medium mt-1">
            Save 17% with annual billing
          </p>
        )}
        <p className="text-gray-600 mt-2">
          {tier.evaluationsPerMonth} evaluations/month
        </p>
      </div>

      <ul className="space-y-3 mb-8">
        {tier.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleUpgrade}
        disabled={isFree || isCurrentTier}
        className={getButtonClass()}
      >
        {getButtonText()}
      </button>
    </div>
  );
}