import React, { useState } from 'react';
import { X, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

interface PerformanceFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: PerformanceFeedbackData) => void;
  evaluationId: string;
  recommendations: string[];
}

interface PerformanceFeedbackData {
  implementedRecommendations: string[];
  performanceChange: {
    ctr?: number;
    cvr?: number;
    roas?: number;
    overall?: 'improved' | 'same' | 'declined';
  };
  timeToImplementation?: number; // in days
  mostHelpfulRecommendation?: string;
  effectiveness: number; // 1-5 rating
  additionalComments?: string;
}

export const PerformanceFeedbackModal: React.FC<PerformanceFeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  evaluationId,
  recommendations
}) => {
  const [feedback, setFeedback] = useState<PerformanceFeedbackData>({
    implementedRecommendations: [],
    performanceChange: {},
    effectiveness: 0
  });

  const [step, setStep] = useState(1);
  const maxSteps = 4;

  const handleRecommendationToggle = (recommendation: string) => {
    setFeedback(prev => ({
      ...prev,
      implementedRecommendations: prev.implementedRecommendations.includes(recommendation)
        ? prev.implementedRecommendations.filter(r => r !== recommendation)
        : [...prev.implementedRecommendations, recommendation]
    }));
  };

  const handlePerformanceChange = (metric: string, value: string) => {
    setFeedback(prev => ({
      ...prev,
      performanceChange: {
        ...prev.performanceChange,
        [metric]: metric === 'overall' ? value : parseFloat(value) || undefined
      }
    }));
  };

  const handleSubmit = () => {
    onSubmit(feedback);
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Help Us Improve</h2>
            <p className="text-sm text-gray-600 mt-1">Step {step} of {maxSteps}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / maxSteps) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Implementation Status */}
          {step === 1 && (
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                Did you implement any recommendations?
              </h3>
              <div className="space-y-2">
                {recommendations.map((rec, index) => (
                  <label key={index} className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={feedback.implementedRecommendations.includes(rec)}
                      onChange={() => handleRecommendationToggle(rec)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 flex-1">{rec}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <button onClick={handleSkip} className="text-gray-500 hover:text-gray-700">
                  Skip Survey
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Performance Impact */}
          {step === 2 && (
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />
                How did your ad perform after changes?
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Overall Performance
                  </label>
                  <select
                    value={feedback.performanceChange.overall || ''}
                    onChange={(e) => handlePerformanceChange('overall', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="improved">Improved</option>
                    <option value="same">About the same</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CTR Change (%) <span className="text-gray-400 text-xs">- optional</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g., 15.5"
                      value={feedback.performanceChange.ctr || ''}
                      onChange={(e) => handlePerformanceChange('ctr', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Conversion Rate Change (%) <span className="text-gray-400 text-xs">- optional</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g., 8.2"
                      value={feedback.performanceChange.cvr || ''}
                      onChange={(e) => handlePerformanceChange('cvr', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-700">
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Most Helpful Recommendation */}
          {step === 3 && feedback.implementedRecommendations.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
                Which recommendation was most helpful?
              </h3>
              
              <div className="space-y-2">
                {feedback.implementedRecommendations.map((rec, index) => (
                  <label key={index} className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="mostHelpful"
                      value={rec}
                      checked={feedback.mostHelpfulRecommendation === rec}
                      onChange={(e) => setFeedback(prev => ({ ...prev, mostHelpfulRecommendation: e.target.value }))}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 flex-1">{rec}</span>
                  </label>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  How long did implementation take? (days)
                </label>
                <input
                  type="number"
                  min="0"
                  max="365"
                  placeholder="e.g., 3"
                  value={feedback.timeToImplementation || ''}
                  onChange={(e) => setFeedback(prev => ({ ...prev, timeToImplementation: parseInt(e.target.value) || undefined }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(2)} className="text-gray-500 hover:text-gray-700">
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Overall Rating & Comments */}
          {(step === 4 || (step === 3 && feedback.implementedRecommendations.length === 0)) && (
            <div>
              <h3 className="text-lg font-medium mb-4">
                Overall, how helpful were our recommendations?
              </h3>
              
              <div className="flex justify-center space-x-2 mb-6">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setFeedback(prev => ({ ...prev, effectiveness: rating }))}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold transition-colors ${
                      feedback.effectiveness >= rating
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-300 text-gray-400 hover:border-blue-300'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
              
              <div className="text-center text-sm text-gray-600 mb-4">
                <span>Not helpful</span>
                <span className="float-right">Very helpful</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional comments (optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us how we can improve our analysis..."
                  value={feedback.additionalComments || ''}
                  onChange={(e) => setFeedback(prev => ({ ...prev, additionalComments: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-between mt-6">
                <button 
                  onClick={() => setStep(feedback.implementedRecommendations.length > 0 ? 3 : 2)} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  Back
                </button>
                <div className="space-x-2">
                  <button onClick={handleSkip} className="text-gray-500 hover:text-gray-700">
                    Skip
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={feedback.effectiveness === 0}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-300"
                  >
                    Submit Feedback
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};