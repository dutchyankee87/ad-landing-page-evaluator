import React from 'react';
import { Globe, Users, MessageSquare } from 'lucide-react';

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
    <section className="mb-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">🌍 Language & Cultural Analysis</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{getLanguageFlag(detectedLanguage)}</div>
            <div>
              <div className="font-medium text-gray-900">Detected Language</div>
              <div className="text-lg text-blue-600 font-semibold">
                {getLanguageName(detectedLanguage)} ({detectedLanguage.toUpperCase()})
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900 mb-1">Cultural Context</div>
              <div className="text-sm text-gray-700">{culturalContext}</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-white rounded border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">Culturally-Optimized Recommendations</span>
          </div>
          <p className="text-sm text-gray-600">
            Our analysis includes language-specific CTA preferences, cultural trust signals, and 
            region-appropriate communication styles to maximize conversion rates for your target audience.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LanguageAnalysis;