import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const SubscriptionSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [customerEmail, setCustomerEmail] = useState<string>('');

  useEffect(() => {
    // Optionally verify the session with your backend
    if (sessionId) {
      // You could fetch session details here if needed
      console.log('Checkout session completed:', sessionId);
    }
  }, [sessionId]);

  return (
    <>
      <SEOHead 
        title="Welcome to ADalign Pro! | Subscription Confirmed"
        description="Your subscription has been successfully activated. Start analyzing your ads with advanced AI insights."
        url="/subscription/success"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            {/* Success Icon */}
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            
            {/* Success Message */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              🎉 Welcome to ADalign Pro!
            </h1>
            <p className="text-gray-600 mb-6">
              Your subscription has been successfully activated. You now have access to advanced ad analysis features.
            </p>
            
            {/* Session Info */}
            {sessionId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">
                  <strong>Confirmation:</strong> {sessionId.slice(-8)}
                </p>
              </div>
            )}
            
            {/* Next Steps */}
            <div className="space-y-4 mb-8">
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Check your email for a receipt</li>
                  <li>• Start analyzing your ad campaigns</li>
                  <li>• Access your subscription settings anytime</li>
                </ul>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                to="/evaluate"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-semibold shadow-lg"
              >
                Start Analyzing Ads
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <Link
                to="/pricing"
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Manage Subscription
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionSuccess;