import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, Zap, TrendingUp, Eye, MessageSquare, Target, Settings, ShoppingCart, Code } from 'lucide-react';
import { MicroScore, MicroScoringResult } from '../../lib/scoring/MicroScoringEngine';

interface DetailedScoringProps {
  scoringResult: MicroScoringResult;
  platform: string;
}

const CATEGORY_ICONS = {
  visual: Eye,
  content: MessageSquare,
  alignment: Target,
  platform: Settings,
  conversion: ShoppingCart,
  technical: Code
};

const CATEGORY_COLORS = {
  visual: 'bg-blue-50 border-blue-200 text-blue-800',
  content: 'bg-green-50 border-green-200 text-green-800',
  alignment: 'bg-purple-50 border-purple-200 text-purple-800',
  platform: 'bg-orange-50 border-orange-200 text-orange-800',
  conversion: 'bg-red-50 border-red-200 text-red-800',
  technical: 'bg-gray-50 border-gray-200 text-gray-800'
};

export const DetailedScoring: React.FC<DetailedScoringProps> = ({
  scoringResult,
  platform
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showAllFactors, setShowAllFactors] = useState(false);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50';
    if (score >= 6.5) return 'text-yellow-600 bg-yellow-50';
    if (score >= 5) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6.5) return 'Good';
    if (score >= 5) return 'Needs Work';
    return 'Critical';
  };

  const categories = ['visual', 'content', 'alignment', 'platform', 'conversion', 'technical'];

  return (
    <div className="space-y-6">
      {/* Performance Prediction */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center mb-4">
          <TrendingUp className="w-6 h-6 text-blue-600 mr-3" />
          <h3 className="text-xl font-semibold text-blue-900">Performance Prediction</h3>
          <span className="ml-2 text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
            {(scoringResult.performancePrediction.confidenceLevel * 100).toFixed(0)}% confidence
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-sm text-gray-600 mb-1">Expected Engagement Rate</div>
            <div className="text-2xl font-bold text-blue-600">
              {scoringResult.performancePrediction.expectedCTR.toFixed(2)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {scoringResult.performancePrediction.expectedCTR > 2 ? 'Above average' : 
               scoringResult.performancePrediction.expectedCTR > 1 ? 'Average' : 'Below average'}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-sm text-gray-600 mb-1">Expected Conversion Rate</div>
            <div className="text-2xl font-bold text-green-600">
              {scoringResult.performancePrediction.expectedCVR.toFixed(2)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {scoringResult.performancePrediction.expectedCVR > 6 ? 'Above average' : 
               scoringResult.performancePrediction.expectedCVR > 3 ? 'Average' : 'Below average'}
            </div>
          </div>
        </div>
      </div>

      {/* Top Issues */}
      {scoringResult.topIssues.length > 0 && (
        <div className="bg-red-50 rounded-lg p-6 border border-red-200">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-red-900">🚨 Top Issues to Fix</h3>
          </div>
          <div className="space-y-3">
            {scoringResult.topIssues.map((issue, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-red-100">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{issue.name}</h4>
                  <span className={`px-2 py-1 text-sm rounded ${getScoreColor(issue.score)}`}>
                    {issue.score.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                {issue.recommendation && (
                  <div className="bg-red-50 p-3 rounded border border-red-100">
                    <p className="text-sm text-red-800">
                      <strong>Fix:</strong> {issue.recommendation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Wins */}
      {scoringResult.quickWins.length > 0 && (
        <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center mb-4">
            <Zap className="w-5 h-5 text-yellow-600 mr-2" />
            <h3 className="text-lg font-semibold text-yellow-900">⚡ Quick Wins</h3>
          </div>
          <div className="space-y-3">
            {scoringResult.quickWins.map((win, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-yellow-100">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{win.name}</h4>
                  <span className={`px-2 py-1 text-sm rounded ${getScoreColor(win.score)}`}>
                    {win.score.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{win.description}</p>
                {win.recommendation && (
                  <div className="bg-yellow-50 p-3 rounded border border-yellow-100">
                    <p className="text-sm text-yellow-800">
                      <strong>Opportunity:</strong> {win.recommendation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">🔍 Detailed Analysis</h3>
            <button
              onClick={() => setShowAllFactors(!showAllFactors)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showAllFactors ? 'Show Summary' : 'Show All Factors'}
            </button>
          </div>
        </div>

        <div className="divide-y">
          {categories.map((category) => {
            const categoryScores = scoringResult.microScores.filter(score => score.category === category);
            const categoryScore = scoringResult.categoryScores[category] || 0;
            const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS];
            const isExpanded = expandedCategories.has(category);

            if (categoryScores.length === 0) return null;

            return (
              <div key={category} className="p-6">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleCategory(category)}
                >
                  <div className="flex items-center">
                    <Icon className="w-5 h-5 text-gray-600 mr-3" />
                    <div>
                      <h4 className="font-semibold text-gray-900 capitalize">
                        {category === 'platform' ? `${platform} Optimization` : `${category} Analysis`}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {categoryScores.length} factors analyzed
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className={`px-3 py-2 rounded-lg border mr-3 ${CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]}`}>
                      <span className="font-semibold">{categoryScore.toFixed(1)}</span>
                      <span className="text-xs ml-1">{getScoreLabel(categoryScore)}</span>
                    </div>
                    {isExpanded ? 
                      <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    }
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 space-y-3">
                    {categoryScores
                      .filter(score => showAllFactors || score.impact === 'HIGH' || score.score < 7)
                      .map((score, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <h5 className="font-medium text-gray-900 mr-2">{score.name}</h5>
                              <span className={`px-2 py-1 text-xs rounded ${
                                score.impact === 'HIGH' ? 'bg-red-100 text-red-700' :
                                score.impact === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {score.impact}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{score.description}</p>
                          </div>
                          <span className={`px-3 py-2 text-sm font-semibold rounded ml-4 ${getScoreColor(score.score)}`}>
                            {score.score.toFixed(1)}
                          </span>
                        </div>
                        
                        {score.recommendation && score.score < 8 && (
                          <div className="bg-blue-50 p-3 rounded border border-blue-100 mt-2">
                            <p className="text-sm text-blue-800">
                              <strong>Improve:</strong> {score.recommendation}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {!showAllFactors && categoryScores.length > categoryScores.filter(s => s.impact === 'HIGH' || s.score < 7).length && (
                      <button
                        onClick={() => setShowAllFactors(true)}
                        className="text-sm text-gray-500 hover:text-gray-700 mt-2"
                      >
                        Show {categoryScores.length - categoryScores.filter(s => s.impact === 'HIGH' || s.score < 7).length} more factors...
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Overall Summary */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">{scoringResult.microScores.length}</div>
            <div className="text-sm text-gray-600">Factors Analyzed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{scoringResult.topIssues.length}</div>
            <div className="text-sm text-gray-600">Critical Issues</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">{scoringResult.quickWins.length}</div>
            <div className="text-sm text-gray-600">Quick Wins</div>
          </div>
        </div>
      </div>
    </div>
  );
};