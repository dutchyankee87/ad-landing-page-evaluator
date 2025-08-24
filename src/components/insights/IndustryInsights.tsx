import React from 'react';
import { TrendingUp, Target, AlertCircle, Award, DollarSign, Users } from 'lucide-react';

interface IndustryInsightsProps {
  industry: string;
  platform: string;
  score: number;
  benchmarkData: {
    percentile10: number;
    percentile25: number;
    percentile50: number;
    percentile75: number;
    percentile90: number;
    sampleSize: number;
    userPercentile?: number;
  };
  performancePrediction: {
    expectedCTR: number;
    expectedCVR: number;
    confidenceLevel: number;
  };
}

export const IndustryInsights: React.FC<IndustryInsightsProps> = ({
  industry,
  platform,
  score,
  benchmarkData,
  performancePrediction
}) => {
  
  const formatIndustry = (industry: string) => {
    return industry.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatPlatform = (platform: string) => {
    const platformNames = {
      meta: 'Meta',
      tiktok: 'TikTok', 
      linkedin: 'LinkedIn',
      google: 'Google Ads',
      reddit: 'Reddit'
    };
    return platformNames[platform as keyof typeof platformNames] || platform;
  };

  // Industry-specific insights
  const getIndustryInsights = (industry: string, platform: string) => {
    const insights = {
      ecommerce: {
        meta: {
          avgCTR: 1.04,
          avgCVR: 9.21,
          topPerformers: "Use UGC and social proof heavily",
          commonMistakes: "Generic product images without lifestyle context",
          seasonality: "Q4 performance 40% higher than Q1-Q3 average"
        },
        tiktok: {
          avgCTR: 2.63,
          avgCVR: 6.89,
          topPerformers: "Authentic creator-style content performs best",
          commonMistakes: "Overly polished ads that feel too promotional",
          seasonality: "Back-to-school (Aug-Sep) and holiday season peaks"
        },
        google: {
          avgCTR: 3.17,
          avgCVR: 3.48,
          topPerformers: "Product-specific landing pages with rich snippets",
          commonMistakes: "Generic landing pages for specific product ads",
          seasonality: "Search volume peaks during shopping holidays"
        }
      },
      saas: {
        meta: {
          avgCTR: 1.21,
          avgCVR: 11.04,
          topPerformers: "Free trial offers with clear value demonstration",
          commonMistakes: "Feature-heavy messaging instead of benefit-focused",
          seasonality: "New Year resolution period shows 25% higher conversion"
        },
        linkedin: {
          avgCTR: 0.65,
          avgCVR: 6.25,
          topPerformers: "Thought leadership content that educates",
          commonMistakes: "Direct sales pitches without establishing credibility",
          seasonality: "B2B budgets refresh in January and September"
        },
        google: {
          avgCTR: 2.41,
          avgCVR: 4.81,
          topPerformers: "Solution-focused landing pages addressing specific pain points",
          commonMistakes: "Generic 'try our software' messaging",
          seasonality: "End-of-quarter budget cycles drive higher intent"
        }
      }
    };

    return insights[industry as keyof typeof insights]?.[platform as keyof any] || {
      avgCTR: 1.5,
      avgCVR: 5.5,
      topPerformers: "Focus on clear value proposition and strong social proof",
      commonMistakes: "Misalignment between ad promise and page delivery",
      seasonality: "Performance varies by industry seasonality patterns"
    };
  };

  const industryData = getIndustryInsights(industry, platform);
  const userPercentile = benchmarkData.userPercentile || 50;

  // Calculate potential improvements
  const potentialCTR = userPercentile < 75 ? industryData.avgCTR * 1.5 : industryData.avgCTR * 1.2;
  const potentialCVR = userPercentile < 75 ? industryData.avgCVR * 1.3 : industryData.avgCVR * 1.15;
  const revenueImpact = ((potentialCTR - performancePrediction.expectedCTR) / performancePrediction.expectedCTR) * 100;

  return (
    <div className="space-y-6">
      {/* Industry Overview */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
        <div className="flex items-center mb-4">
          <Target className="w-6 h-6 text-indigo-600 mr-3" />
          <h3 className="text-xl font-semibold text-indigo-900">
            {formatIndustry(industry)} on {formatPlatform(platform)}
          </h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-indigo-600">{industryData.avgCTR}%</div>
            <div className="text-sm text-gray-600">Industry Avg CTR</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">{industryData.avgCVR}%</div>
            <div className="text-sm text-gray-600">Industry Avg CVR</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{userPercentile}th</div>
            <div className="text-sm text-gray-600">Your Percentile</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">{benchmarkData.sampleSize.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Sample Size</div>
          </div>
        </div>
      </div>

      {/* Performance Comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
            <h4 className="font-semibold text-gray-900">Your Performance</h4>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Expected CTR</span>
              <div className="flex items-center">
                <span className="font-semibold text-gray-900">{performancePrediction.expectedCTR.toFixed(2)}%</span>
                <span className={`ml-2 text-xs px-2 py-1 rounded ${
                  performancePrediction.expectedCTR > industryData.avgCTR 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {performancePrediction.expectedCTR > industryData.avgCTR ? 'Above' : 'Below'} Avg
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Expected CVR</span>
              <div className="flex items-center">
                <span className="font-semibold text-gray-900">{performancePrediction.expectedCVR.toFixed(2)}%</span>
                <span className={`ml-2 text-xs px-2 py-1 rounded ${
                  performancePrediction.expectedCVR > industryData.avgCVR 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {performancePrediction.expectedCVR > industryData.avgCVR ? 'Above' : 'Below'} Avg
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Confidence</span>
              <span className="font-semibold text-gray-900">
                {(performancePrediction.confidenceLevel * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border">
          <div className="flex items-center mb-4">
            <DollarSign className="w-5 h-5 text-green-500 mr-2" />
            <h4 className="font-semibold text-gray-900">Improvement Potential</h4>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Potential CTR</span>
              <span className="font-semibold text-green-600">{potentialCTR.toFixed(2)}%</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Potential CVR</span>
              <span className="font-semibold text-green-600">{potentialCVR.toFixed(2)}%</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Revenue Impact</span>
              <span className="font-semibold text-green-600">+{revenueImpact.toFixed(0)}%</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
            <p className="text-sm text-green-800">
              <strong>Opportunity:</strong> Optimizing to top 25% performance could increase revenue by {revenueImpact.toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      {/* Industry Intelligence */}
      <div className="bg-white rounded-lg p-6 border">
        <div className="flex items-center mb-4">
          <Award className="w-5 h-5 text-blue-500 mr-2" />
          <h4 className="font-semibold text-gray-900">Industry Intelligence</h4>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-green-800 mb-2 flex items-center">
              <Users className="w-4 h-4 mr-1" />
              What Top Performers Do
            </h5>
            <p className="text-sm text-gray-700 bg-green-50 p-3 rounded border border-green-200">
              {industryData.topPerformers}
            </p>
          </div>
          
          <div>
            <h5 className="font-medium text-red-800 mb-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              Common Mistakes to Avoid
            </h5>
            <p className="text-sm text-gray-700 bg-red-50 p-3 rounded border border-red-200">
              {industryData.commonMistakes}
            </p>
          </div>
        </div>
        
        <div className="mt-4">
          <h5 className="font-medium text-blue-800 mb-2">Seasonality Insights</h5>
          <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded border border-blue-200">
            {industryData.seasonality}
          </p>
        </div>
      </div>

      {/* Competitive Analysis */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
        <h4 className="font-semibold text-orange-900 mb-4">🎯 Competitive Positioning</h4>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{Math.round(100 - userPercentile)}%</div>
            <div className="text-sm text-gray-600">of competitors score lower than you</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {benchmarkData.percentile75 - score > 0 ? (benchmarkData.percentile75 - score).toFixed(1) : '0'}
            </div>
            <div className="text-sm text-gray-600">points to reach top 25%</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {score > benchmarkData.percentile50 ? '+' : ''}{(score - benchmarkData.percentile50).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">vs industry median</div>
          </div>
        </div>
        
        {userPercentile < 75 && (
          <div className="mt-4 p-3 bg-orange-100 rounded border border-orange-200">
            <p className="text-sm text-orange-800">
              <strong>Strategic Insight:</strong> You're competing against {benchmarkData.sampleSize.toLocaleString()} other {formatIndustry(industry).toLowerCase()} brands on {formatPlatform(platform)}. 
              Reaching the top 25% would put you ahead of {Math.round(benchmarkData.sampleSize * 0.75).toLocaleString()} competitors.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};