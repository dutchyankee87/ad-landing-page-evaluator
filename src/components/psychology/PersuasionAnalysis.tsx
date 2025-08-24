import React, { useState } from 'react';
import { Brain, Gift, CheckCircle, Users, Award, Heart, Clock, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

interface PersuasionPrinciple {
  score: 'HIGH' | 'MEDIUM' | 'LOW';
  adAnalysis: string;
  pageAnalysis: string;
  recommendation: string;
  examples: string[];
}

interface PersuasionAnalysisProps {
  persuasionPrinciples: {
    reciprocity: PersuasionPrinciple;
    commitment: PersuasionPrinciple;
    socialProof: PersuasionPrinciple;
    authority: PersuasionPrinciple;
    liking: PersuasionPrinciple;
    scarcity: PersuasionPrinciple;
  };
  persuasionScore: number;
  psychologicalInsights: string[];
}

const PRINCIPLE_CONFIG = {
  reciprocity: {
    icon: Gift,
    name: 'Reciprocity',
    description: 'People feel obligated to return favors and give back when they receive something',
    color: 'blue',
    examples: 'Free samples, useful content, trials, valuable resources'
  },
  commitment: {
    icon: CheckCircle,
    name: 'Commitment & Consistency',
    description: 'People want to be consistent with previous commitments and actions',
    color: 'green',
    examples: 'Small initial commitments, progressive engagement, public pledges'
  },
  socialProof: {
    icon: Users,
    name: 'Social Proof',
    description: 'People look to others\' actions and opinions to guide their own behavior',
    color: 'purple',
    examples: 'Customer reviews, testimonials, user counts, "others like you"'
  },
  authority: {
    icon: Award,
    name: 'Authority',
    description: 'People defer to recognized experts and authoritative sources',
    color: 'indigo',
    examples: 'Expert credentials, certifications, media mentions, awards'
  },
  liking: {
    icon: Heart,
    name: 'Liking',
    description: 'People are more easily influenced by those they like and find similar',
    color: 'pink',
    examples: 'Shared values, similarity, attractiveness, familiarity'
  },
  scarcity: {
    icon: Clock,
    name: 'Scarcity',
    description: 'People value things more when they appear rare or time-limited',
    color: 'orange',
    examples: 'Limited time offers, exclusive access, countdown timers, stock levels'
  }
};

export const PersuasionAnalysis: React.FC<PersuasionAnalysisProps> = ({
  persuasionPrinciples,
  persuasionScore,
  psychologicalInsights
}) => {
  const [expandedPrinciples, setExpandedPrinciples] = useState<Set<string>>(new Set());

  const togglePrinciple = (principle: string) => {
    const newExpanded = new Set(expandedPrinciples);
    if (newExpanded.has(principle)) {
      newExpanded.delete(principle);
    } else {
      newExpanded.add(principle);
    }
    setExpandedPrinciples(newExpanded);
  };

  const getScoreColor = (score: string) => {
    switch (score) {
      case 'HIGH': return 'text-green-600 bg-green-50 border-green-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800',
      pink: 'bg-pink-50 border-pink-200 text-pink-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const calculateOverallPersuasionScore = () => {
    const scores = Object.values(persuasionPrinciples).map(p => {
      switch (p.score) {
        case 'HIGH': return 8.5;
        case 'MEDIUM': return 6.5;
        case 'LOW': return 4;
        default: return 5;
      }
    });
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  };

  const overallScore = calculateOverallPersuasionScore();

  return (
    <div className="space-y-6">
      {/* Overall Persuasion Score */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Brain className="w-6 h-6 text-purple-600 mr-3" />
            <div>
              <h3 className="text-xl font-semibold text-purple-900">Psychology Score</h3>
              <p className="text-sm text-purple-700">Based on Cialdini's 6 Principles of Influence</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-purple-600">
              {overallScore.toFixed(1)}<span className="text-lg text-purple-400">/10</span>
            </div>
            <div className="text-sm text-purple-600">
              {overallScore >= 7.5 ? 'Highly Persuasive' :
               overallScore >= 6 ? 'Moderately Persuasive' :
               overallScore >= 4.5 ? 'Somewhat Persuasive' :
               'Low Persuasion Power'}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {Object.entries(persuasionPrinciples).map(([key, principle]) => {
            const config = PRINCIPLE_CONFIG[key as keyof typeof PRINCIPLE_CONFIG];
            const Icon = config.icon;
            
            return (
              <div key={key} className="text-center">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-2 ${getColorClasses(config.color)}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-xs text-gray-600 mb-1">{config.name}</div>
                <div className={`text-sm font-semibold px-2 py-1 rounded border ${getScoreColor(principle.score)}`}>
                  {principle.score}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Psychological Insights */}
      {psychologicalInsights && psychologicalInsights.length > 0 && (
        <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
          <div className="flex items-center mb-4">
            <Lightbulb className="w-5 h-5 text-indigo-600 mr-2" />
            <h4 className="font-semibold text-indigo-900">🧠 Key Psychological Insights</h4>
          </div>
          <div className="space-y-3">
            {psychologicalInsights.map((insight, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-indigo-100">
                <p className="text-sm text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Principles Analysis */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h4 className="text-xl font-semibold text-gray-900">🎯 Cialdini's 6 Principles Analysis</h4>
          <p className="text-sm text-gray-600 mt-1">Deep dive into psychological persuasion effectiveness</p>
        </div>

        <div className="divide-y">
          {Object.entries(persuasionPrinciples).map(([key, principle]) => {
            const config = PRINCIPLE_CONFIG[key as keyof typeof PRINCIPLE_CONFIG];
            const Icon = config.icon;
            const isExpanded = expandedPrinciples.has(key);

            return (
              <div key={key} className="p-6">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => togglePrinciple(key)}
                >
                  <div className="flex items-center">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mr-4 ${getColorClasses(config.color)}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">{config.name}</h5>
                      <p className="text-sm text-gray-600 mt-1">{config.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Examples: {config.examples}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className={`px-3 py-2 rounded-lg border mr-3 ${getScoreColor(principle.score)}`}>
                      <span className="font-semibold">{principle.score}</span>
                    </div>
                    {isExpanded ? 
                      <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    }
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-6 space-y-4">
                    {/* Ad Analysis */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h6 className="font-medium text-blue-900 mb-2">📱 Ad Analysis</h6>
                      <p className="text-sm text-blue-800">{principle.adAnalysis}</p>
                    </div>

                    {/* Landing Page Analysis */}
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h6 className="font-medium text-green-900 mb-2">🌐 Landing Page Analysis</h6>
                      <p className="text-sm text-green-800">{principle.pageAnalysis}</p>
                    </div>

                    {/* Examples Found */}
                    {principle.examples && principle.examples.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h6 className="font-medium text-gray-900 mb-2">🔍 Elements Identified</h6>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {principle.examples.map((example, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-gray-400 mr-2">•</span>
                              <span>{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommendation */}
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <h6 className="font-medium text-orange-900 mb-2">💡 Improvement Recommendation</h6>
                      <p className="text-sm text-orange-800">{principle.recommendation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Implementation Priority */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
        <h4 className="font-semibold text-green-900 mb-4">🚀 Quick Wins for Persuasion</h4>
        <div className="space-y-3">
          {Object.entries(persuasionPrinciples)
            .filter(([_, principle]) => principle.score === 'MEDIUM' || principle.score === 'LOW')
            .sort((a, b) => {
              const scoreValue = { HIGH: 3, MEDIUM: 2, LOW: 1 };
              return scoreValue[a[1].score as keyof typeof scoreValue] - scoreValue[b[1].score as keyof typeof scoreValue];
            })
            .slice(0, 3)
            .map(([key, principle]) => {
              const config = PRINCIPLE_CONFIG[key as keyof typeof PRINCIPLE_CONFIG];
              const Icon = config.icon;
              
              return (
                <div key={key} className="bg-white rounded-lg p-4 border border-green-100">
                  <div className="flex items-start">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 mt-0.5 ${getColorClasses(config.color)}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{config.name}</h5>
                      <p className="text-sm text-gray-600 mt-1">{principle.recommendation}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded border ml-2 ${getScoreColor(principle.score)}`}>
                      {principle.score}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
        
        {Object.values(persuasionPrinciples).every(p => p.score === 'HIGH') && (
          <div className="bg-white rounded-lg p-4 border border-green-200 text-center">
            <p className="text-green-800 font-medium">🎉 Excellent! All persuasion principles are well implemented.</p>
            <p className="text-sm text-green-600 mt-1">Focus on maintaining this psychological effectiveness.</p>
          </div>
        )}
      </div>
    </div>
  );
};