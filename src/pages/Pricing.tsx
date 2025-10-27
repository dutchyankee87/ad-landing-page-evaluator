import React, { useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { SUBSCRIPTION_TIERS, ANNUAL_SUBSCRIPTION_TIERS } from '../lib/subscription';
import PricingCard from '../components/subscription/PricingCard';
import SEOHead from '../components/SEOHead';

const Pricing: React.FC = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [isYearly, setIsYearly] = useState(false);
  
  const tiers = isYearly ? ANNUAL_SUBSCRIPTION_TIERS : SUBSCRIPTION_TIERS;
  const freeTier = SUBSCRIPTION_TIERS[0]; // Always show free tier

  return (
    <>
      <SEOHead 
        title="Pricing - ADalign.io | Affordable Ad Analysis Plans"
        description="Choose the perfect plan for your ad optimization needs. From free analysis to enterprise solutions. Start improving your ad-to-page congruence today."
        keywords="ad analysis pricing, marketing tool pricing, conversion optimization cost, digital marketing budget"
        url="/pricing"
      />
      
      <div className="bg-gradient-to-br from-orange-50 to-red-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-black bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Choose the plan that fits your needs. Upgrade or downgrade at any time.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-sm font-medium ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isYearly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
                Yearly
                <span className="ml-1 text-green-600 font-semibold">(-17%)</span>
              </span>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Always show free tier */}
            <PricingCard
              tier={freeTier}
              userEmail={user?.primaryEmailAddress?.emailAddress}
              currentTier="free" // TODO: Get from user data
              isYearly={false}
            />
            
            {/* Show selected billing cycle tiers */}
            {tiers.map((tier) => (
              <PricingCard
                key={tier.id}
                tier={tier}
                userEmail={user?.primaryEmailAddress?.emailAddress}
                currentTier="free" // TODO: Get from user data
                isYearly={isYearly}
              />
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-2">Can I upgrade or downgrade at any time?</h3>
                <p className="text-gray-600">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately,
                  and we'll prorate the billing accordingly.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-2">What happens if I exceed my evaluation limit?</h3>
                <p className="text-gray-600">
                  If you reach your monthly limit, you'll be prompted to upgrade to a higher tier.
                  Your evaluations reset automatically at the beginning of each billing cycle.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-2">Do you offer refunds?</h3>
                <p className="text-gray-600">
                  We offer a 14-day money-back guarantee on all paid plans. If you're not satisfied,
                  contact our support team for a full refund.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-2">Is my data secure?</h3>
                <p className="text-gray-600">
                  Absolutely. We use enterprise-grade security and never store your ad creatives permanently.
                  All analysis is performed securely and data is encrypted in transit and at rest.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pricing;