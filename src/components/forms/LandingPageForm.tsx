import React, { useState } from 'react';
import { Globe, AlertCircle, Loader2 } from 'lucide-react';
import { useAdEvaluation } from '../../context/AdEvaluationContext';

const LandingPageForm: React.FC = () => {
  const { landingPageData, updateLandingPageData } = useAdEvaluation();
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    updateLandingPageData({ url: value });
    // Clear any previous validation errors when the user types
    if (validationError) {
      setValidationError(null);
    }
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleValidate = async () => {
    const url = landingPageData.url;
    
    if (!url) {
      setValidationError('Please enter a URL');
      return;
    }
    
    if (!validateUrl(url)) {
      setValidationError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }
    
    setIsValidating(true);
    setValidationError(null);
    
    try {
      // Simple URL validation (mock for now)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockValidationPassed = url.includes('.');
      
      if (!mockValidationPassed) {
        setValidationError('Unable to access this URL. Please check the address and try again.');
      } else {
        updateLandingPageData({ 
          isValidated: true,
          // Mock data that would come from backend scraping
          title: 'Sample Landing Page',
          mainContent: 'This is sample content from the landing page.',
          ctaText: 'Sign Up Now'
        });
      }
    } catch (error) {
      setValidationError('An error occurred while validating the URL. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Landing Page</h2>
        <p className="text-gray-600 mb-6">
          Enter the URL of the landing page where your ad directs users
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            Landing Page URL <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                id="url"
                name="url"
                value={landingPageData.url || ''}
                onChange={handleInputChange}
                placeholder="https://example.com/landing-page"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <button
              type="button"
              onClick={handleValidate}
              disabled={isValidating || !landingPageData.url}
              className={`px-4 py-2 rounded-r-lg flex items-center justify-center ${
                isValidating || !landingPageData.url
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } transition-colors`}
              style={{ minWidth: '100px' }}
            >
              {isValidating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Checking
                </>
              ) : landingPageData.isValidated ? (
                'Validated'
              ) : (
                'Validate'
              )}
            </button>
          </div>
          {validationError && (
            <div className="flex items-start gap-2 text-red-600 text-sm mt-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Enter the full URL including https:// or http://
          </p>
        </div>
        
        {landingPageData.isValidated && (
          <div className="border border-green-200 bg-green-50 rounded-lg p-4">
            <p className="text-green-800 font-medium mb-2">
              URL validated successfully!
            </p>
            <p className="text-sm text-green-700">
              We've analyzed your landing page and extracted the key content for evaluation.
            </p>
          </div>
        )}
        
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Why this matters</h3>
          <p className="text-sm text-gray-600">
            The landing page is where your ad directs users. For effective advertising, your ad and landing page should have strong visual and contextual congruence. This helps users feel they've arrived at the right place, improving conversion rates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPageForm;