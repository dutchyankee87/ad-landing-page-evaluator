import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, Target, AlertTriangle, Settings, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      case 'HIGH': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'MEDIUM': return <Target className="h-4 w-4 text-yellow-600" />;
      case 'LOW': return <Settings className="h-4 w-4 text-blue-600" />;
      default: return <Settings className="h-4 w-4 text-gray-500" />;
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
      ad: 'bg-blue-100 text-blue-700',
      landing_page: 'bg-purple-100 text-purple-700',
      both: 'bg-gray-100 text-gray-700'
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
      LOW: 'bg-green-100 text-green-700',
      MEDIUM: 'bg-yellow-100 text-yellow-700',
      HIGH: 'bg-red-100 text-red-700'
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
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Lightbulb className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Prioritized Recommendations
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            All recommendations organized by impact priority, with clear action items for your team
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        {priorities.map((priority) => (
          <div 
            key={priority}
            className={`border rounded-lg overflow-hidden shadow-sm ${getPriorityColor(priority)}`}
          >
            <button
              onClick={() => toggleCategory(priority)}
              className="w-full text-left px-4 py-3 flex items-center justify-between font-medium transition-colors hover:bg-opacity-70"
            >
              <div className="flex items-center gap-3">
                {getPriorityIcon(priority)}
                <span>
                  {priority} Priority ({groupedSuggestions[priority].length} {groupedSuggestions[priority].length === 1 ? 'item' : 'items'})
                </span>
              </div>
              {openCategory === priority ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            
            <AnimatePresence>
              {openCategory === priority && (
                <motion.div 
                  className="px-4 pb-4 bg-white"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <div className="space-y-3 pt-3">
                    {groupedSuggestions[priority].map((suggestion) => {
                    const sourceBadge = getSourceBadge(suggestion.source);
                    
                    return (
                      <div 
                        key={suggestion.id} 
                        className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                              <Check className="h-3 w-3 text-blue-600" />
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${sourceBadge.style}`}>
                              {sourceBadge.label}
                            </span>
                            <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                              {getCategoryLabel(suggestion.category)}
                            </span>
                          </div>
                          
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getEffortBadge(suggestion.effort)}`}>
                            {suggestion.effort} effort
                          </span>
                        </div>
                        
                        <p className="text-gray-800 mb-3 text-sm leading-relaxed">{suggestion.suggestion}</p>
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                            Impact: {suggestion.expectedImpact}
                          </div>
                          {suggestion.confidenceLevel && (
                            <div className="text-gray-600 bg-gray-50 px-2 py-1 rounded">
                              Confidence: {Math.round(suggestion.confidenceLevel * 100)}%
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EnhancedSuggestions;