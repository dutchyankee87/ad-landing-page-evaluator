import React, { useState } from 'react';
import { AlertTriangle, Target, Settings, CheckCircle, TrendingUp } from 'lucide-react';
import OptimizationPathSelector, { OptimizationPath } from '../shared/OptimizationPathSelector';

interface ElementComparison {
  element: string;
  adValue: string;
  landingPageValue: string;
  status: 'match' | 'mismatch' | 'partial_match' | 'missing';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation?: string;
  adOptimizationRecommendation?: string;
  landingPageOptimizationRecommendation?: string;
  aiPreferredPath?: 'ad' | 'landing';
  category?: 'content' | 'visual' | 'emotional' | 'trust' | 'mobile';
}

interface TopRecommendationsProps {
  comparisons: ElementComparison[];
}

const TopRecommendations: React.FC<TopRecommendationsProps> = ({ comparisons }) => {
  const [selectedPath, setSelectedPath] = useState<OptimizationPath>('ad');

  // Filter and prioritize recommendations based on severity, status, and selected path
  const getTopRecommendations = (comparisons: ElementComparison[], path: OptimizationPath) => {
    const severityScore = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    const statusScore = { mismatch: 4, partial_match: 3, missing: 2, match: 0 };
    
    return comparisons
      .filter(comp => {
        // Check if we have a recommendation for the selected path
        const hasRecommendation = path === 'ad' 
          ? comp.adOptimizationRecommendation || comp.recommendation 
          : comp.landingPageOptimizationRecommendation || comp.recommendation;
        
        return hasRecommendation && comp.status !== 'match';
      })
      .map(comp => ({
        ...comp,
        score: (severityScore[comp.severity] || 0) + (statusScore[comp.status] || 0),
        currentRecommendation: path === 'ad' 
          ? comp.adOptimizationRecommendation || comp.recommendation
          : comp.landingPageOptimizationRecommendation || comp.recommendation
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  // Get AI preferred path for the comparisons
  const getAiPreferredPath = (comparisons: ElementComparison[]): OptimizationPath => {
    const pathCounts = comparisons.reduce((acc, comp) => {
      if (comp.aiPreferredPath) {
        acc[comp.aiPreferredPath] = (acc[comp.aiPreferredPath] || 0) + 1;
      }
      return acc;
    }, { ad: 0, landing: 0 });
    
    return pathCounts.landing > pathCounts.ad ? 'landing' : 'ad';
  };

  const getPriorityIcon = (severity: string) => {
    switch (severity) {
      case 'HIGH': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'MEDIUM': return <Target className="h-4 w-4 text-yellow-600" />;
      case 'LOW': return <Settings className="h-4 w-4 text-blue-600" />;
      default: return <Settings className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH': return 'border-l-red-500 bg-red-50';
      case 'MEDIUM': return 'border-l-yellow-500 bg-yellow-50';
      case 'LOW': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'visual': return '🎨';
      case 'content': return '📝';
      case 'emotional': return '💭';
      case 'trust': return '🛡️';
      case 'mobile': return '📱';
      default: return '⚙️';
    }
  };

  const getExpectedImpact = (severity: string, element: string) => {
    const impacts = {
      HIGH: {
        'Primary Headline': '+15-25% conversion rate',
        'Call-to-Action': '+12-20% click-through rate',
        'Primary Colors': '+8-15% brand recognition',
        'Trust Signals': '+10-18% conversion rate',
        default: '+10-20% performance improvement'
      },
      MEDIUM: {
        'Emotional Tone': '+5-12% engagement rate',
        'Mobile Optimization': '+8-15% mobile conversion rate',
        default: '+5-15% performance improvement'
      },
      LOW: {
        default: '+2-8% performance improvement'
      }
    };

    const severityImpacts = impacts[severity as keyof typeof impacts];
    if (severityImpacts && severityImpacts[element as keyof typeof severityImpacts]) {
      return severityImpacts[element as keyof typeof severityImpacts];
    }
    return severityImpacts?.default || '+2-8% performance improvement';
  };

  if (!comparisons || comparisons.length === 0) {
    return null;
  }

  const aiPreferredPath = getAiPreferredPath(comparisons);
  const topRecommendations = getTopRecommendations(comparisons, selectedPath);

  if (topRecommendations.length === 0) {
    return (
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Top 3 Recommendations
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Great news! Your ad and landing page are well aligned. No critical issues found.
            </p>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">Excellent Alignment!</h3>
            <p className="text-green-700">
              Your ad and landing page are working well together. Continue monitoring performance and consider A/B testing minor variations.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Top 3 Recommendations
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Highest-impact optimizations for your selected optimization path
            </p>
          </div>
        </div>
        
        <OptimizationPathSelector
          selectedPath={selectedPath}
          onPathChange={setSelectedPath}
          aiPreferredPath={aiPreferredPath}
          className="flex-shrink-0"
        />
      </div>
      
      <div className="space-y-4">
        {topRecommendations.map((recommendation, index) => (
          <div 
            key={`${recommendation.element}-${index}`}
            className={`border-l-4 ${getSeverityColor(recommendation.severity)} bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg font-bold text-orange-600">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {getCategoryIcon(recommendation.category)} {recommendation.element}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      {getPriorityIcon(recommendation.severity)}
                      <span className="text-sm font-medium text-gray-600">
                        {recommendation.severity} Priority
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium mb-1">
                    Expected Impact
                  </div>
                  <div className="text-sm text-green-600 font-semibold">
                    {getExpectedImpact(recommendation.severity, recommendation.element)}
                  </div>
                </div>
              </div>

              {/* Current State Comparison */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="text-blue-700 font-medium text-xs mb-1 uppercase tracking-wide">YOUR AD</div>
                  <div className="text-gray-800 text-sm">{recommendation.adValue || '—'}</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                  <div className="text-purple-700 font-medium text-xs mb-1 uppercase tracking-wide">LANDING PAGE</div>
                  <div className="text-gray-800 text-sm">{recommendation.landingPageValue || '—'}</div>
                </div>
              </div>

              {/* Recommendation */}
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center">
                      <TrendingUp className="h-3 w-3 text-orange-600" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-orange-800 text-sm">RECOMMENDED ACTION</h4>
                      {recommendation.aiPreferredPath === selectedPath && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">AdAlign Preferred</span>
                      )}
                    </div>
                    <p className="text-gray-800 text-sm leading-relaxed">{recommendation.currentRecommendation}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to action */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <div>
            <h4 className="font-semibold text-blue-800">Ready to Optimize?</h4>
            <p className="text-blue-700 text-sm mt-1">
              Implement these changes in order of priority for maximum impact on your conversion rates.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopRecommendations;