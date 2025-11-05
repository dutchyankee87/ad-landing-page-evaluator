import React from 'react';
import { CheckCircle, XCircle, AlertCircle, MinusCircle, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface ElementComparison {
  element: string;
  adValue: string;
  landingPageValue: string;
  status: 'match' | 'mismatch' | 'partial_match' | 'missing';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation?: string;
}

interface ComparisonGridProps {
  comparisons: ElementComparison[];
}

const ComparisonGrid: React.FC<ComparisonGridProps> = ({ comparisons }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'match':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'mismatch':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'partial_match':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'missing':
        return <MinusCircle className="h-5 w-5 text-gray-400" />;
      default:
        return <MinusCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'match':
        return { style: 'bg-green-100 text-green-800', label: '✅ Perfect Match' };
      case 'mismatch':
        return { style: 'bg-red-100 text-red-800', label: '❌ Mismatch' };
      case 'partial_match':
        return { style: 'bg-yellow-100 text-yellow-800', label: '⚠️ Partial Match' };
      case 'missing':
        return { style: 'bg-gray-100 text-gray-600', label: '➖ Missing' };
      default:
        return { style: 'bg-gray-100 text-gray-600', label: 'Unknown' };
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH': return 'border-l-red-500';
      case 'MEDIUM': return 'border-l-yellow-500';
      case 'LOW': return 'border-l-blue-500';
      default: return 'border-l-gray-500';
    }
  };

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
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  if (!comparisons || comparisons.length === 0) {
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
        variants={headerVariants}
      >
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
            <Target className="h-8 w-8 text-white" />
          </div>
        </motion.div>
        <div>
          <motion.h2 
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            variants={headerVariants}
          >
            🔍 Ad vs Landing Page Comparison
          </motion.h2>
          <motion.p 
            className="text-gray-600 text-lg mt-2"
            variants={headerVariants}
          >
            Side-by-side analysis of key elements to identify exact discrepancies and alignment opportunities
          </motion.p>
        </div>
      </motion.div>
      
      <motion.div 
        className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20"
        variants={itemVariants}
      >
        {/* Header */}
        <motion.div 
          className="grid grid-cols-5 gap-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200/50 font-semibold text-gray-800"
          variants={headerVariants}
        >
          <div className="text-lg">Element</div>
          <div className="text-lg text-blue-600">Your Ad</div>
          <div className="text-lg text-purple-600">Your Landing Page</div>
          <div className="text-lg">Status</div>
          <div className="text-lg">Action Needed</div>
        </motion.div>
        
        {/* Rows */}
        <motion.div 
          className="divide-y divide-gray-100"
          variants={containerVariants}
        >
          {comparisons.map((comparison, index) => {
            const statusBadge = getStatusBadge(comparison.status);
            
            return (
              <motion.div 
                key={index} 
                className={`grid grid-cols-5 gap-6 p-6 hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-blue-50/30 transition-all duration-300 border-l-4 ${getSeverityColor(comparison.severity)} group`}
                variants={itemVariants}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                {/* Element */}
                <motion.div 
                  className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  {comparison.element}
                </motion.div>
                
                {/* Ad Value */}
                <motion.div className="text-sm">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200/50 shadow-sm"
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-blue-800 font-semibold text-xs mb-2 uppercase tracking-wide">AD</div>
                    <div className="text-gray-800 font-medium leading-relaxed">{comparison.adValue || '—'}</div>
                  </motion.div>
                </motion.div>
                
                {/* Landing Page Value */}
                <motion.div className="text-sm">
                  <motion.div 
                    className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200/50 shadow-sm"
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-purple-800 font-semibold text-xs mb-2 uppercase tracking-wide">LANDING PAGE</div>
                    <div className="text-gray-800 font-medium leading-relaxed">{comparison.landingPageValue || '—'}</div>
                  </motion.div>
                </motion.div>
                
                {/* Status */}
                <motion.div 
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {getStatusIcon(comparison.status)}
                  </motion.div>
                  <motion.span 
                    className={`px-4 py-2 rounded-xl text-sm font-semibold ${statusBadge.style} shadow-sm`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {statusBadge.label}
                  </motion.span>
                </motion.div>
                
                {/* Recommendation */}
                <motion.div 
                  className="text-sm"
                  whileHover={{ scale: 1.02 }}
                >
                  {comparison.recommendation ? (
                    <motion.div 
                      className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200/50 shadow-sm"
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-orange-800 font-semibold text-xs mb-2 uppercase tracking-wide">RECOMMENDATION</div>
                      <div className="text-gray-800 font-medium leading-relaxed">{comparison.recommendation}</div>
                    </motion.div>
                  ) : (
                    <div className="text-green-600 font-semibold bg-green-50 p-4 rounded-xl">✅ No action needed</div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
      
      {/* Legend */}
      <motion.div 
        className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200/50"
        variants={itemVariants}
      >
        <motion.h4 
          className="font-bold text-gray-900 mb-4 text-lg"
          variants={itemVariants}
        >
          Priority Legend:
        </motion.h4>
        <div className="flex flex-wrap gap-6">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
            <span className="font-semibold text-gray-700">High Priority Fix</span>
          </motion.div>
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
            <span className="font-semibold text-gray-700">Medium Priority</span>
          </motion.div>
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
            <span className="font-semibold text-gray-700">Low Priority</span>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default ComparisonGrid;