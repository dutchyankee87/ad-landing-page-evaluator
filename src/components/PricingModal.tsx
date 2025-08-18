import React from 'react';
import { X, Check, Crown, Zap } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsage?: {
    used: number;
    limit: number;
    tier: 'free' | 'pro' | 'enterprise';
  };
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, currentUsage }) => {
  if (!isOpen) return null;

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'month',
      description: 'Perfect for trying out our AI evaluation',
      evaluations: '1',
      features: [
        'Multi-platform support (Meta, TikTok, LinkedIn, Google, Reddit)',
        'GPT-4 Vision analysis',
        'Platform-specific suggestions',
        'Basic evaluation reports'
      ],
      limitations: [
        'Limited to 1 evaluation per month'
      ],
      buttonText: 'Current Plan',
      buttonStyle: 'bg-gray-100 text-gray-600 cursor-not-allowed',
      isCurrentPlan: currentUsage?.tier === 'free'
    },
    {
      id: 'pro',
      name: 'Professional',
      price: '$19',
      period: 'month',
      description: 'Ideal for marketers and small agencies',
      evaluations: '100',
      features: [
        'Everything in Free',
        'Advanced analytics dashboard',
        'Export to PDF/CSV',
        'Email support',
        'Platform benchmarking',
        'A/B testing recommendations'
      ],
      limitations: [],
      buttonText: 'Upgrade to Pro',
      buttonStyle: 'bg-blue-600 text-white hover:bg-blue-700',
      isCurrentPlan: currentUsage?.tier === 'pro',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$99',
      period: 'month', 
      description: 'For large teams and agencies',
      evaluations: '1,000',
      features: [
        'Everything in Pro',
        'Team collaboration tools',
        'Custom branding',
        'Priority support',
        'API access',
        'Custom integrations',
        'Account manager'
      ],
      limitations: [],
      buttonText: 'Contact Sales',
      buttonStyle: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700',
      isCurrentPlan: currentUsage?.tier === 'enterprise'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">Choose Your Plan</h2>
            <p className="text-gray-600 mt-1">Upgrade for unlimited AI-powered ad evaluations</p>
            {currentUsage && (
              <p className="text-sm text-blue-600 mt-2">
                Current usage: {currentUsage.used}/{currentUsage.limit} evaluations this month
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative border rounded-xl p-6 ${
                  plan.popular 
                    ? 'border-blue-500 shadow-lg scale-105' 
                    : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Crown className="h-4 w-4" />
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-500">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">
                        {plan.evaluations} evaluations/month
                      </span>
                    </div>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <X className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{limitation}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  disabled={plan.isCurrentPlan}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${plan.buttonStyle}`}
                  onClick={() => {
                    if (plan.id === 'enterprise') {
                      window.open('mailto:contact@yourdomain.com?subject=Enterprise Plan Inquiry');
                    } else if (plan.id === 'pro') {
                      // TODO: Integrate with Stripe
                      alert('Stripe integration coming soon! Contact us for early access.');
                    }
                  }}
                >
                  {plan.isCurrentPlan ? 'Current Plan' : plan.buttonText}
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              All plans include a 7-day free trial • No setup fees • Cancel anytime
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Questions? <a href="mailto:support@yourdomain.com" className="text-blue-600 hover:underline">Contact our team</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;