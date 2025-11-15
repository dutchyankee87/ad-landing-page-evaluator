import React from 'react';
import { motion } from 'framer-motion';
import { Star, ExternalLink } from 'lucide-react';

const ProductHuntEmbed: React.FC = () => {
  return (
    <motion.div 
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star className="h-4 w-4 fill-current" />
            Live on Product Hunt
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Support AdAlign on Product Hunt
          </h3>
          
          <p className="text-gray-600">
            We're launching today! Help us reach #1 and get early access to premium features.
          </p>
        </div>
        
        {/* Placeholder for Product Hunt embed */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-dashed border-orange-200 rounded-xl p-8 mb-6">
          <div className="text-orange-600 mb-4">
            <Star className="h-12 w-12 mx-auto fill-current" />
          </div>
          <p className="font-medium text-orange-800 mb-2">Product Hunt Embed Placeholder</p>
          <p className="text-sm text-orange-600">
            TODO: Replace with official Product Hunt embed code
          </p>
          <p className="text-xs text-orange-500 mt-2">
            This will display the interactive Product Hunt widget with upvote button
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="https://www.producthunt.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            <Star className="h-4 w-4 fill-current" />
            Upvote on Product Hunt
            <ExternalLink className="h-4 w-4" />
          </a>
          
          <div className="text-sm text-gray-500">
            Your support helps us reach more marketers!
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductHuntEmbed;