import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, ChevronRight } from 'lucide-react';
import { useAdEvaluation } from '../context/AdEvaluationContext';
import ScoreGauge from '../components/results/ScoreGauge';
import ComponentScores from '../components/results/ComponentScores';
import Suggestions from '../components/results/Suggestions';
import AdSummary from '../components/results/AdSummary';
import { HeatmapOverlay } from '../components/heatmap/HeatmapOverlay';

const PLATFORM_NAMES = {
  meta: 'Meta (Facebook/Instagram)',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  google: 'Google Ads',
  reddit: 'Reddit'
} as const;

const Results: React.FC = () => {
  const { results, hasEvaluated, adData } = useAdEvaluation();
  const navigate = useNavigate();

  // Redirect if results aren't available
  useEffect(() => {
    if (!hasEvaluated) {
      navigate('/evaluate');
    }
  }, [hasEvaluated, navigate]);

  if (!hasEvaluated || !results) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/evaluate"
            className="flex items-center gap-1 text-gray-600 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Evaluation</span>
          </Link>
          
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => window.print()}
          >
            <Download className="h-4 w-4" />
            <span>Export Results</span>
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-black px-6 py-8 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              🎯 Your adalign.io Report
            </h1>
            <p className="opacity-90 text-lg">
              Here's exactly what's killing (or boosting) your conversions
              {adData.platform ? ` on ${PLATFORM_NAMES[adData.platform as keyof typeof PLATFORM_NAMES]}` : ''}
            </p>
          </div>
          
          <div className="p-6">
            {/* Overall Score */}
            <section className="mb-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Congruence Score</h2>
                  <p className="text-gray-600 mb-4">
                    This score reveals how well your ad and landing page work together to convert visitors.
                    Higher scores = higher conversion rates.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="text-5xl font-bold text-orange-500">{results.overallScore}</div>
                    <div className="text-sm text-gray-500">
                      <div className="font-medium">out of 10</div>
                      <div className="font-semibold text-lg text-gray-700">{getScoreDescription(results.overallScore)}</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <ScoreGauge score={results.overallScore} />
                </div>
              </div>
            </section>
            
            {/* Component Scores */}
            <ComponentScores componentScores={results.componentScores} />
            
            {/* Ad Summary */}
            <AdSummary />
            
            {/* Landing Page Heatmap */}
            {(results.heatmapZones && results.heatmapZones.length > 0) || results ? (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">🔍 Landing Page Optimization Zones</h2>
                <p className="text-gray-600 mb-6">
                  Click on the colored zones below to see specific recommendations for each area of your landing page.
                  Red = High Priority, Yellow = Medium Priority, Blue = Low Priority.
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <HeatmapOverlay 
                    imageUrl="/api/placeholder/800/1200" // This should be the actual landing page screenshot
                    zones={results.heatmapZones || [
                      {
                        location: "hero-section",
                        description: "Main headline and primary call-to-action area",
                        severity: "HIGH" as const,
                        issue: "Value proposition clarity and CTA prominence need optimization",
                        suggestion: "Strengthen headline clarity and CTA prominence for better conversion",
                        expectedImpact: "15-25% improvement in engagement rates"
                      },
                      {
                        location: "cta-button",
                        description: "Primary conversion action button",
                        severity: "HIGH" as const,
                        issue: "Call-to-action button needs more visual prominence",
                        suggestion: "Increase button size and contrast to improve conversions",
                        expectedImpact: "12-20% conversion rate improvement"
                      }
                    ]}
                    className="max-w-2xl mx-auto"
                  />
                </div>
              </section>
            )}
            
            {/* Improvement Suggestions */}
            <Suggestions suggestions={results.suggestions} />
          </div>
        </div>
        
        <div className="text-center">
          <Link
            to="/evaluate"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all font-semibold shadow-lg transform hover:-translate-y-0.5"
          >
            Analyze Another Ad
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Helper function to get score description
const getScoreDescription = (score: number): string => {
  if (score >= 9) return '🔥 Conversion Machine';
  if (score >= 7) return '✅ Strong Alignment';
  if (score >= 5) return '⚠️ Room to Improve';
  if (score >= 3) return '🚨 Losing Money';
  return '💸 Conversion Killer';
};

export default Results;