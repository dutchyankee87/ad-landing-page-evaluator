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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const suggestionVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <motion.section 
      className="mb-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="flex items-center gap-4 mb-8"
        variants={itemVariants}
      >
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg">
            <Lightbulb className="h-8 w-8 text-white" />
          </div>
        </motion.div>
        <div>
          <motion.h2 
            className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            💡 Prioritized Improvement Roadmap
          </motion.h2>
          <motion.p 
            className="text-gray-600 text-lg mt-2"
            variants={itemVariants}
          >
            All recommendations organized by impact priority, with clear action items for your team
          </motion.p>
        </div>
      </motion.div>
      
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
      >
        {priorities.map((priority) => (
          <motion.div 
            key={priority}
            className={`border rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ${getPriorityColor(priority)}`}
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
          >
            <motion.button
              onClick={() => toggleCategory(priority)}
              className={`w-full text-left px-8 py-6 flex items-center justify-between font-semibold transition-all duration-300 hover:bg-opacity-80`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {getPriorityIcon(priority)}
                </motion.div>
                <span className="text-xl font-bold">
                  {priority} Priority ({groupedSuggestions[priority].length} {groupedSuggestions[priority].length === 1 ? 'item' : 'items'})
                </span>
              </div>
              <motion.div
                animate={{ rotate: openCategory === priority ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {openCategory === priority ? (
                  <ChevronUp className="h-6 w-6" />
                ) : (
                  <ChevronDown className="h-6 w-6" />
                )}
              </motion.div>
            </motion.button>
            
            <AnimatePresence>
              {openCategory === priority && (
                <motion.div 
                  className="px-8 pb-8 bg-white/90 backdrop-blur-sm"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <motion.div 
                    className="space-y-6 pt-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {groupedSuggestions[priority].map((suggestion) => {
                    const sourceBadge = getSourceBadge(suggestion.source);
                    
                    return (
                      <motion.div 
                        key={suggestion.id} 
                        className="border border-gray-200/50 rounded-2xl p-6 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 group"
                        variants={suggestionVariants}
                        whileHover={{ scale: 1.02, y: -4 }}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <motion.div 
                              className="w-8 h-8 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg"
                              whileHover={{ rotate: 360, scale: 1.1 }}
                              transition={{ duration: 0.6 }}
                            >
                              <Check className="h-5 w-5 text-white" />
                            </motion.div>
                            <motion.span 
                              className={`px-4 py-2 rounded-xl text-sm font-semibold ${sourceBadge.style} shadow-sm`}
                              whileHover={{ scale: 1.05 }}
                            >
                              {sourceBadge.label}
                            </motion.span>
                            <motion.span 
                              className="px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 shadow-sm"
                              whileHover={{ scale: 1.05 }}
                            >
                              {getCategoryLabel(suggestion.category)}
                            </motion.span>
                          </div>
                          
                          <motion.span 
                            className={`px-4 py-2 rounded-xl text-sm font-semibold ${getEffortBadge(suggestion.effort)} shadow-sm`}
                            whileHover={{ scale: 1.05 }}
                          >
                            {suggestion.effort} effort
                          </motion.span>
                        </div>
                        
                        <p className="text-gray-800 mb-4 leading-relaxed text-lg font-medium">{suggestion.suggestion}</p>
                        
                        <div className="flex items-center justify-between">
                          <motion.div 
                            className="text-green-600 font-semibold bg-green-50 px-4 py-2 rounded-xl"
                            whileHover={{ scale: 1.05 }}
                          >
                            💪 Impact: {suggestion.expectedImpact}
                          </motion.div>
                          {suggestion.confidenceLevel && (
                            <motion.div 
                              className="text-gray-600 bg-gray-50 px-4 py-2 rounded-xl font-medium"
                              whileHover={{ scale: 1.05 }}
                            >
                              Confidence: {Math.round(suggestion.confidenceLevel * 100)}%
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default EnhancedSuggestions;