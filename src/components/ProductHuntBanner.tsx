import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, ExternalLink } from 'lucide-react';

interface ProductHuntBannerProps {
  enabled?: boolean;
  linkToProductHunt?: boolean;
}

const ProductHuntBanner: React.FC<ProductHuntBannerProps> = ({ 
  enabled = true,
  linkToProductHunt = false 
}) => {
  const [isVisible, setIsVisible] = useState(enabled);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
  };

  const bannerContent = (
    <div className="flex items-center justify-center gap-3 text-sm font-medium text-white px-4 py-3">
      <Star className="h-4 w-4 fill-current animate-pulse" />
      <span>
        We're live on Product Hunt! 🎉 Come give us your support
      </span>
    </div>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="relative bg-gradient-to-r from-orange-500 to-red-500 shadow-lg z-50"
          initial={{ opacity: 0, y: -48 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -48 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {linkToProductHunt ? (
            <a 
              href="https://www.producthunt.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block hover:bg-black/5 transition-colors"
            >
              <div className="flex items-center justify-center gap-3 text-sm font-medium text-white px-4 py-3">
                <Star className="h-4 w-4 fill-current animate-pulse" />
                <span>
                  We're live on Product Hunt! 🎉 Come give us your support
                </span>
                <ExternalLink className="h-3 w-3 ml-1" />
              </div>
            </a>
          ) : (
            <Link 
              to="/producthunt"
              className="block hover:bg-black/5 transition-colors"
            >
              {bannerContent}
            </Link>
          )}
          
          <button
            onClick={handleClose}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors p-1"
            aria-label="Close banner"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductHuntBanner;