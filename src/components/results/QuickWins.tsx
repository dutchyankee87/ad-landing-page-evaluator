import React from 'react';
import { Zap, ArrowUp, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuickWin {
  title: string;
  description: string;
  expectedImpact: string;
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  source: 'ad' | 'landing_page' | 'both';
}

interface QuickWinsProps {
  quickWins: QuickWin[];
}

const QuickWins: React.FC<QuickWinsProps> = ({ quickWins }) => {
  const getEffortBadge = (effort: string) => {
    const styles = {
      LOW: 'bg-green-100 text-green-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-red-100 text-red-800'
    };
    return styles[effort as keyof typeof styles] || styles.MEDIUM;
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    hidden: { rotate: -180, scale: 0 },
    visible: {
      rotate: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  if (!quickWins || quickWins.length === 0) {
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
          variants={iconVariants}
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg">
            <Zap className="h-8 w-8 text-white" />
          </div>
        </motion.div>
        <div>
          <motion.h2 
            className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            🚀 Top 3 Quick Wins
          </motion.h2>
          <motion.p 
            className="text-gray-600 text-lg mt-2"
            variants={itemVariants}
          >
            Start with these high-impact improvements to see immediate results
          </motion.p>
        </div>
      </motion.div>
      
      <motion.div 
        className="grid gap-6"
        variants={containerVariants}
      >
        {quickWins.slice(0, 3).map((win, index) => {
          const sourceBadge = getSourceBadge(win.source);
          
          return (
            <motion.div 
              key={index}
              className="bg-white/80 backdrop-blur-sm border-l-4 border-orange-500 rounded-2xl shadow-lg hover:shadow-2xl p-8 transition-all duration-300 group relative overflow-hidden"
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-orange-50/50 to-red-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      {index + 1}
                    </motion.div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 group-hover:text-orange-600 transition-colors">{win.title}</h3>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <motion.span 
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${sourceBadge.style} shadow-sm`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {sourceBadge.label}
                    </motion.span>
                    <motion.span 
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${getEffortBadge(win.effort)} shadow-sm`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {win.effort} effort
                    </motion.span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">{win.description}</p>
                
                <div className="flex items-center gap-6">
                  <motion.div 
                    className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl"
                    whileHover={{ scale: 1.05 }}
                  >
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-semibold">Impact: {win.expectedImpact}</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-xl"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Clock className="h-5 w-5" />
                    <span className="font-medium">
                      {win.effort === 'LOW' ? '< 1 day' : win.effort === 'MEDIUM' ? '1-3 days' : '1+ weeks'}
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
};

export default QuickWins;