import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft, Mail } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const SubscriptionCanceled: React.FC = () => {
  return (
    <>
      <SEOHead 
        title="Subscription Canceled | ADalign.io"
        description="Your subscription process was canceled. You can try again anytime or contact support if you need help."
        url="/subscription/canceled"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            {/* Canceled Icon */}
            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <XCircle className="h-12 w-12 text-gray-600" />
            </div>
            
            {/* Canceled Message */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Subscription Canceled
            </h1>
            <p className="text-gray-600 mb-6">
              No worries! Your subscription process was canceled and no payment was made. 
              You can try again anytime.
            </p>
            
            {/* Reassurance */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>No charges were made</strong> to your payment method. 
                Your free account remains active.
              </p>
            </div>
            
            {/* Help Section */}
            <div className="text-left mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Still have questions about our plans?</li>
                <li>• Want to speak with someone before subscribing?</li>
                <li>• Having technical issues with checkout?</li>
              </ul>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                to="/pricing"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-semibold shadow-lg"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Pricing
              </Link>
              
              <Link
                to="/evaluate"
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue with Free Plan
              </Link>
              
              <a
                href="mailto:support@adalign.io"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors text-sm"
              >
                <Mail className="h-4 w-4" />
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionCanceled;