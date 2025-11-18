import React from 'react';
import { useAdEvaluation } from '../../context/AdEvaluationContext';
import { ExternalLink } from 'lucide-react';

const PLATFORM_NAMES = {
  meta: 'Meta (Facebook/Instagram)',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  google: 'Google Ads',
  reddit: 'Reddit'
} as const;

const AdSummary: React.FC = () => {
  const { adData, landingPageData, results } = useAdEvaluation();
  
  // Extract real CTA data from analysis results instead of dummy data
  const ctaComparison = results?.elementComparisons?.find(comp => 
    comp.element === 'Primary CTA Button' || comp.element.includes('CTA')
  );
  const realCtaText = ctaComparison?.landingPageValue || landingPageData.ctaText;
  
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-2">What We Analyzed</h2>
      <p className="text-gray-600 mb-6">
        Here's a summary of your ad and landing page elements that were evaluated
      </p>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Ad Content */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-medium mb-4">Ad Screenshot</h3>
          
          {adData.imageUrl && (
            <div className="mb-4">
              <img
                src={adData.imageUrl}
                alt="Complete ad screenshot"
                className="w-full h-48 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}
          
          <div className="space-y-3">
            {adData.platform && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Platform</h4>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {PLATFORM_NAMES[adData.platform as keyof typeof PLATFORM_NAMES] || adData.platform}
                  </span>
                </div>
              </div>
            )}
            
          </div>
        </div>
        
        {/* Landing Page */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-medium mb-4">Landing Page</h3>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-500">URL</h4>
              <a 
                href={landingPageData.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
              >
                {landingPageData.url}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            
            {landingPageData.title && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Page Title</h4>
                <p className="text-gray-800">{landingPageData.title}</p>
              </div>
            )}
            
            {realCtaText && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Main CTA</h4>
                <p className="text-gray-800">{realCtaText}</p>
                {ctaComparison && ctaComparison.adValue !== ctaComparison.landingPageValue && (
                  <p className="text-xs text-gray-500 mt-1">
                    Ad CTA: "{ctaComparison.adValue}"
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdSummary;