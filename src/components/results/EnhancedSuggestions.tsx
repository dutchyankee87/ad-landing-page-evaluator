import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, Target, AlertTriangle, Settings } from 'lucide-react';

interface EnhancedSuggestion {
  id: string;
  suggestion: string;
  source: 'ad' | 'landing_page' | 'both';
  category: 'visual' | 'contextual' | 'tone' | 'conversion';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  expectedImpact: string;
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  confidenceLevel?: number;
}

interface EnhancedSuggestionsProps {
  suggestions: EnhancedSuggestion[];
}

const EnhancedSuggestions: React.FC<EnhancedSuggestionsProps> = ({ suggestions }) => {
  const [openCategory, setOpenCategory] = useState<string>('HIGH');
  
  const toggleCategory = (priority: string) => {
    if (openCategory === priority) {
      setOpenCategory('');
    } else {
      setOpenCategory(priority);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'HIGH': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'MEDIUM': return <Target className="h-5 w-5 text-yellow-500" />;
      case 'LOW': return <Settings className="h-5 w-5 text-blue-500" />;
      default: return <Settings className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'border-red-200 bg-red-50';
      case 'MEDIUM': return 'border-yellow-200 bg-yellow-50';
      case 'LOW': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getSourceBadge = (source: string) => {
    const styles = {
      ad: 'bg-blue-100 text-blue-800',
      landing_page: 'bg-purple-100 text-purple-800',
      both: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      ad: 'Fix Ad',
      landing_page: 'Fix Landing Page',
      both: 'Fix Both'
    };
    
    return {
      style: styles[source as keyof typeof styles] || styles.both,
      label: labels[source as keyof typeof labels] || labels.both
    };
  };

  const getEffortBadge = (effort: string) => {
    const styles = {
      LOW: 'bg-green-100 text-green-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-red-100 text-red-800'
    };
    return styles[effort as keyof typeof styles] || styles.MEDIUM;
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      visual: 'Visual',
      contextual: 'Content',
      tone: 'Tone',
      conversion: 'Conversion'
    };
    return labels[category as keyof typeof labels] || category;
  };

  // Group suggestions by priority
  const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.priority]) {
      acc[suggestion.priority] = [];
    }
    acc[suggestion.priority].push(suggestion);
    return acc;
  }, {} as Record<string, EnhancedSuggestion[]>);

  // Sort priorities
  const priorities = ['HIGH', 'MEDIUM', 'LOW'].filter(p => groupedSuggestions[p]?.length > 0);

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">💡 Prioritized Improvement Roadmap</h2>
      <p className="text-gray-600 mb-6">
        All recommendations organized by impact priority, with clear action items for your team.
      </p>
      
      <div className="space-y-4">
        {priorities.map((priority) => (
          <div 
            key={priority}
            className={`border rounded-lg overflow-hidden shadow-sm ${getPriorityColor(priority)}`}
          >
            <button
              onClick={() => toggleCategory(priority)}
              className={`w-full text-left px-6 py-4 flex items-center justify-between font-medium transition-colors hover:bg-opacity-80`}
            >
              <div className="flex items-center gap-3">
                {getPriorityIcon(priority)}
                <span className="text-lg">
                  {priority} Priority ({groupedSuggestions[priority].length} {groupedSuggestions[priority].length === 1 ? 'item' : 'items'})
                </span>
              </div>
              {openCategory === priority ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            
            {openCategory === priority && (
              <div className="px-6 pb-6 bg-white">
                <div className="space-y-4">
                  {groupedSuggestions[priority].map((suggestion) => {
                    const sourceBadge = getSourceBadge(suggestion.source);
                    
                    return (
                      <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <Check className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${sourceBadge.style}`}>
                              {sourceBadge.label}
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                              {getCategoryLabel(suggestion.category)}
                            </span>
                          </div>
                          
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEffortBadge(suggestion.effort)}`}>
                            {suggestion.effort} effort
                          </span>
                        </div>
                        
                        <p className="text-gray-800 mb-3 leading-relaxed">{suggestion.suggestion}</p>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-green-600 font-medium">
                            💪 Impact: {suggestion.expectedImpact}
                          </div>
                          {suggestion.confidenceLevel && (
                            <div className="text-gray-500">
                              Confidence: {Math.round(suggestion.confidenceLevel * 100)}%
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default EnhancedSuggestions;