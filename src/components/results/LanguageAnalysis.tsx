import React from 'react';
import { Globe, Users, MessageSquare, Languages } from 'lucide-react';
import { motion } from 'framer-motion';

interface LanguageAnalysisProps {
  detectedLanguage: string;
  culturalContext: string;
}

const LanguageAnalysis: React.FC<LanguageAnalysisProps> = ({ 
  detectedLanguage, 
  culturalContext 
}) => {
  const getLanguageFlag = (langCode: string) => {
    const flags = {
      'en': '🇺🇸',
      'es': '🇪🇸',
      'fr': '🇫🇷',
      'de': '🇩🇪',
      'it': '🇮🇹',
      'pt': '🇧🇷',
      'nl': '🇳🇱'
    };
    return flags[langCode as keyof typeof flags] || '🌐';
  };

  const getLanguageName = (langCode: string) => {
    const names = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'nl': 'Dutch'
    };
    return names[langCode as keyof typeof names] || 'Unknown';
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section 
      className="mb-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-blue-200/50 shadow-lg relative overflow-hidden"
        variants={itemVariants}
      >
        <motion.div
          className="absolute top-4 right-4 w-20 h-20 bg-blue-200/30 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
        
        <motion.div 
          className="flex items-center gap-4 mb-8"
          variants={itemVariants}
        >
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <Languages className="h-8 w-8 text-white" />
            </div>
          </motion.div>
          <div>
            <motion.h3 
              className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              🌍 Language & Cultural Analysis
            </motion.h3>
          </div>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8 relative z-10">
          <motion.div 
            className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md"
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="text-5xl"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            >
              {getLanguageFlag(detectedLanguage)}
            </motion.div>
            <div>
              <div className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-1">Detected Language</div>
              <div className="text-2xl text-blue-600 font-bold">
                {getLanguageName(detectedLanguage)} ({detectedLanguage.toUpperCase()})
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex items-start gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md"
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Users className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
            </motion.div>
            <div>
              <div className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-2">Cultural Context</div>
              <div className="text-gray-800 font-medium leading-relaxed">{culturalContext}</div>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-8 p-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-md relative z-10"
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="flex items-center gap-3 mb-3"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <MessageSquare className="h-5 w-5 text-indigo-600" />
            </motion.div>
            <span className="font-bold text-gray-900 text-lg">Culturally-Optimized Recommendations</span>
          </motion.div>
          <motion.p 
            className="text-gray-700 leading-relaxed"
            variants={itemVariants}
          >
            Our analysis includes language-specific CTA preferences, cultural trust signals, and 
            region-appropriate communication styles to maximize conversion rates for your target audience.
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default LanguageAnalysis;