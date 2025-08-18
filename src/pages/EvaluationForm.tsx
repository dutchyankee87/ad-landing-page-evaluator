import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Link, Upload, AlertCircle } from 'lucide-react';
import { useAdEvaluation } from '../context/AdEvaluationContext';
import AdAssetForm from '../components/forms/AdAssetForm';
import LandingPageForm from '../components/forms/LandingPageForm';
import UsageBanner from '../components/UsageBanner';

type Step = 'adAssets' | 'landingPage' | 'review';

const EvaluationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('adAssets');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { adData, landingPageData, evaluateAd } = useAdEvaluation();
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep === 'adAssets') {
      if (!adData.platform || !adData.imageUrl) {
        setError('Please select a platform and upload an ad screenshot before proceeding.');
        return;
      }
      setCurrentStep('landingPage');
    } else if (currentStep === 'landingPage') {
      if (!landingPageData.url) {
        setError('Please enter a landing page URL before proceeding.');
        return;
      }
      setCurrentStep('review');
    }
    
    setError(null);
  };

  const handleBack = () => {
    if (currentStep === 'landingPage') setCurrentStep('adAssets');
    else if (currentStep === 'review') setCurrentStep('landingPage');
    
    setError(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await evaluateAd();
      navigate('/results');
    } catch (err) {
      setError('An error occurred during evaluation. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: 'adAssets', label: 'Ad Assets', icon: Image },
      { id: 'landingPage', label: 'Landing Page', icon: Link },
      { id: 'review', label: 'Review', icon: Upload },
    ];

    return (
      <div className="flex justify-between items-center max-w-2xl mx-auto mb-8 px-4">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = step.id === currentStep;
          const isCompleted = getStepIndex(currentStep) > index;
          
          return (
            <React.Fragment key={step.id}>
              {index > 0 && (
                <div 
                  className={`h-1 flex-grow mx-2 rounded ${
                    isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
              <div className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    isActive
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : isCompleted
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-gray-300 bg-gray-100 text-gray-400'
                  }`}
                >
                  <StepIcon className="h-5 w-5" />
                </div>
                <span 
                  className={`text-xs font-medium mt-2 ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const getStepIndex = (step: Step): number => {
    const steps: Step[] = ['adAssets', 'landingPage', 'review'];
    return steps.indexOf(step);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Ad Landing Page Evaluation</h1>
        <p className="text-gray-600 text-center mb-8">
          Complete all steps to receive a comprehensive evaluation of your ad and landing page alignment
        </p>
        
        {renderStepIndicator()}
        
        <UsageBanner />
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-md p-6">
          {currentStep === 'adAssets' && <AdAssetForm />}
          {currentStep === 'landingPage' && <LandingPageForm />}
          
          {currentStep === 'review' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Review Your Information</h2>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Ad Assets</h3>
                <div className="space-y-4">
                  {adData.platform && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Platform</p>
                      <p className="text-sm text-gray-600">
                        {adData.platform === 'meta' && 'Meta (Facebook/Instagram)'}
                        {adData.platform === 'tiktok' && 'TikTok'}
                        {adData.platform === 'linkedin' && 'LinkedIn'}
                        {adData.platform === 'google' && 'Google Ads'}
                        {adData.platform === 'reddit' && 'Reddit'}
                      </p>
                    </div>
                  )}
                  {adData.imageUrl && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Ad Screenshot</p>
                      <img 
                        src={adData.imageUrl} 
                        alt="Complete ad screenshot" 
                        className="h-40 object-cover rounded-lg border border-gray-200" 
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Landing Page</h3>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">URL: </span>
                  <a 
                    href={landingPageData.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {landingPageData.url}
                  </a>
                </p>
              </div>
            </div>
          )}
          
          <div className="flex justify-between mt-8">
            {currentStep !== 'adAssets' ? (
              <button
                onClick={handleBack}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}
            
            {currentStep !== 'review' ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                } transition-colors`}
              >
                {isSubmitting ? 'Evaluating...' : 'Submit for Evaluation'}
                {isSubmitting && (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationForm;