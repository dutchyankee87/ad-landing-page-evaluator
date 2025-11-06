import React from 'react';
import { Globe, Users, MessageSquare, Languages } from 'lucide-react';

interface LanguageAnalysisProps {
  detectedLanguage: string;
  culturalContext: string;
}

const LanguageAnalysis: React.FC<LanguageAnalysisProps> = ({ 
  detectedLanguage, 
  culturalContext 
}) => {
  const getLanguageFlag = (langCode: string) => {
    const flags = {
      'en': '🇺🇸',
      'es': '🇪🇸',
      'fr': '🇫🇷',
      'de': '🇩🇪',
      'it': '🇮🇹',
      'pt': '🇧🇷',
      'nl': '🇳🇱'
    };
    return flags[langCode as keyof typeof flags] || '🌐';
  };

  const getLanguageName = (langCode: string) => {
    const names = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'nl': 'Dutch'
    };
    return names[langCode as keyof typeof names] || 'Unknown';
  };

  return (
    <section className="mb-12">
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Languages className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Language & Cultural Analysis
            </h3>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-blue-200">
            <div className="text-3xl">
              {getLanguageFlag(detectedLanguage)}
            </div>
            <div>
              <div className="font-medium text-gray-700 text-xs uppercase tracking-wide mb-1">Detected Language</div>
              <div className="text-lg text-blue-600 font-semibold">
                {getLanguageName(detectedLanguage)} ({detectedLanguage.toUpperCase()})
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 bg-white rounded-lg p-4 border border-blue-200">
            <Users className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-700 text-xs uppercase tracking-wide mb-2">Cultural Context</div>
              <div className="text-gray-800 text-sm leading-relaxed">{culturalContext}</div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-gray-800">Culturally-Optimized Recommendations</span>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            Our analysis includes language-specific CTA preferences, cultural trust signals, and 
            region-appropriate communication styles to maximize conversion rates for your target audience.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LanguageAnalysis;