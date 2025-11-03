import React from 'react';
import { X, Crown, Calendar, Clock } from 'lucide-react';
import { useAdEvaluation } from '../context/AdEvaluationContext';

const UsageLimitModal: React.FC = () => {
  const { showLimitModal, closeLimitModal, usageData, daysUntilReset } = useAdEvaluation();

  if (!showLimitModal) return null;

  const nextResetDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
        <button
          onClick={closeLimitModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="h-8 w-8 text-orange-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {usageData.imageEvaluationsUsed >= usageData.imageMonthlyLimit 
              ? "You've Used All Your Free Evaluations" 
              : "Evaluation Limit Reached"}
          </h2>
          
          <p className="text-gray-600">
            You've completed {usageData.imageEvaluationsUsed} of {usageData.imageMonthlyLimit} free evaluations this month.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-700">Next Reset</p>
              <p className="text-sm text-gray-600">{nextResetDate} ({daysUntilReset} day{daysUntilReset !== 1 ? 's' : ''})</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-700">Free Plan Includes</p>
              <p className="text-sm text-gray-600">{usageData.imageMonthlyLimit} evaluation{usageData.imageMonthlyLimit !== 1 ? 's' : ''} per month</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={closeLimitModal}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsageLimitModal;