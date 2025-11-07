import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight } from 'lucide-react';

interface PartnerCardProps {
  name: string;
  description: string;
  valueProposition: string;
  url: string;
  logo?: string;
  gradient: string;
  delay?: number;
  compact?: boolean;
}

const PartnerCard: React.FC<PartnerCardProps> = ({
  name,
  description,
  valueProposition,
  url,
  gradient,
  delay = 0,
  compact = false
}) => {
  const handlePartnerClick = () => {
    // Track partner click for analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'partner_click', {
        event_category: 'partners',
        event_label: name,
        value: 1
      });
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 ${
        compact ? 'h-auto' : 'h-full'
      }`}
      whileHover={{ y: -4 }}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} shadow-lg`}>
          <ExternalLink className="h-5 w-5 text-white" />
        </div>
        <motion.button
          onClick={handlePartnerClick}
          className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${gradient} text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Visit
          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </motion.button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
          {name}
        </h3>
        
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
        
        {!compact && (
          <div className={`p-4 rounded-lg bg-gradient-to-r ${gradient} bg-opacity-5 border-l-4 border-gradient-to-b ${gradient.replace('to-r', 'to-b')}`}>
            <p className="text-sm font-medium text-gray-700 italic">
              "{valueProposition}"
            </p>
          </div>
        )}
      </div>

      {/* Bottom Call to Action */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <motion.button
          onClick={handlePartnerClick}
          className="w-full flex items-center justify-center gap-2 py-3 text-gray-600 hover:text-gray-900 transition-colors font-medium"
          whileHover={{ x: 4 }}
        >
          Learn more about {name}
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PartnerCard;