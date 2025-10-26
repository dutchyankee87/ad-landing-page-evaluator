import React, { useEffect } from 'react';
import { SignUp, useUser } from '@clerk/clerk-react';
import { X, CheckCircle, TrendingUp, Users, BarChart3 } from 'lucide-react';

interface PostResultSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  overallScore: number;
}

export default function PostResultSignupModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  overallScore 
}: PostResultSignupModalProps) {
  const { user } = useUser();

  // Call onSuccess when user is authenticated
  useEffect(() => {
    if (user && isOpen) {
      onSuccess();
    }
  }, [user, isOpen, onSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
        
        <div className="p-6">
          {/* Success Header */}
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🎉 Your congruence score: {overallScore}/10
            </h2>
            <p className="text-gray-600">
              Want to unlock the full power of ADalign?
            </p>
          </div>

          {/* Value Props */}
          <div className="mb-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Get 2 more free analyses this month</h4>
                <p className="text-sm text-gray-600">Test more campaigns and optimize performance</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <BarChart3 className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Save all your results in a dashboard</h4>
                <p className="text-sm text-gray-600">Track performance over time and spot trends</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Users className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Compare against industry benchmarks</h4>
                <p className="text-sm text-gray-600">See how you stack against top performers</p>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 text-center">
              "Used by growth teams at <strong>Shopify, Airbnb</strong>, and <strong>500+ agencies</strong>"
            </p>
          </div>
          
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-orange-500 hover:bg-orange-600 text-sm normal-case',
                card: 'shadow-none',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 'border-gray-200 hover:bg-gray-50',
                formFieldInput: 'border-gray-300 focus:border-orange-500 focus:ring-orange-500',
                footerActionLink: 'text-orange-500 hover:text-orange-600',
                socialButtonsBlockButtonText: 'text-gray-700 font-medium',
                dividerLine: 'bg-gray-300',
                dividerText: 'text-gray-500 text-sm'
              },
            }}
            fallbackRedirectUrl="/evaluate"
            forceRedirectUrl="/evaluate"
          />

          <p className="text-xs text-gray-500 text-center mt-4">
            No credit card required. Takes 30 seconds.
          </p>
        </div>
      </div>
    </div>
  );
}