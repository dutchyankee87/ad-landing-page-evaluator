import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, ArrowRight, Zap, Crown, Sparkles } from 'lucide-react';
import { SubscriptionTier } from '../../lib/subscription';
import { redirectToCheckout } from '../../lib/stripe';

interface EnhancedPricingCardProps {
  tier: SubscriptionTier;
  userEmail?: string;
  currentTier?: string;
  isYearly?: boolean;
  index: number;
}

export default function EnhancedPricingCard({ 
  tier, 
  userEmail, 
  currentTier, 
  isYearly = false,
  index 
}: EnhancedPricingCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isCurrentTier = currentTier === tier.id.replace('_yearly', '');
  const isFree = tier.id === 'free';
  const isEnterprise = tier.id.includes('enterprise');
  
  const handleUpgrade = async () => {
    if (isFree || isCurrentTier || isLoading) return;
    
    setIsLoading(true);
    try {
      await redirectToCheckout(tier.priceId, userEmail);
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Failed to start upgrade process. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) return 'Loading...';
    if (isFree) return 'Start Free';
    if (isCurrentTier) return 'Current Plan';
    return 'Upgrade';
  };

  const getButtonClass = () => {
    if (isLoading || isCurrentTier) {
      return 'w-full py-4 px-6 border border-gray-300 text-gray-500 rounded-xl cursor-not-allowed transition-all font-semibold';
    }
    
    if (isFree) {
      return 'w-full py-4 px-6 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all font-semibold shadow-lg transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-300';
    }
    
    if (tier.popular) {
      return 'w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all font-semibold shadow-lg transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-300';
    }
    
    return 'w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300';
  };

  const getTierIcon = () => {
    if (isFree) return <Zap className="h-6 w-6 text-gray-600" />;
    if (isEnterprise) return <Crown className="h-6 w-6 text-purple-600" />;
    if (tier.popular) return <Star className="h-6 w-6 text-orange-600" />;
    return <Sparkles className="h-6 w-6 text-blue-600" />;
  };

  const containerVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        delay: index * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const hoverVariants = {
    hover: { 
      y: -8,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`relative rounded-2xl p-8 backdrop-blur-sm border-2 transition-all duration-300 ${
        tier.popular 
          ? 'bg-gradient-to-br from-orange-50 via-white to-red-50 border-orange-200 shadow-xl shadow-orange-100' 
          : isEnterprise
            ? 'bg-gradient-to-br from-purple-50 via-white to-blue-50 border-purple-200 shadow-xl shadow-purple-100'
            : 'bg-white/80 border-gray-200 shadow-lg hover:shadow-xl hover:border-gray-300'
      }`}
    >
      {tier.popular && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 500 }}
          className="absolute -top-5 left-1/2 transform -translate-x-1/2"
        >
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
            <Star className="h-4 w-4" />
            Most Popular
          </div>
        </motion.div>
      )}
      
      <div className="text-center mb-8">
        {/* Icon */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 400 }}
          className="flex justify-center mb-4"
        >
          {getTierIcon()}
        </motion.div>
        
        {/* Tier Name */}
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{tier.name}</h3>
        
        {/* Price */}
        <div className="flex items-baseline justify-center gap-2 mb-2">
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.4 }}
            className="text-5xl font-bold text-gray-900"
          >
            ${tier.price}
          </motion.span>
          {!isFree && (
            <span className="text-lg text-gray-600">
              /{isYearly ? 'year' : 'month'}
            </span>
          )}
        </div>
        
        {/* Yearly Savings */}
        {isYearly && tier.price > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.5 }}
          >
            <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
              Save 17% annually
            </span>
          </motion.div>
        )}
        
        {/* Evaluations */}
        <p className="text-gray-600 mt-3 text-lg font-medium">
          {tier.evaluationsPerMonth === 3 ? '3 evaluations total' : `${tier.evaluationsPerMonth} evaluations/month`}
        </p>
      </div>

      {/* Features */}
      <ul className="space-y-4 mb-8">
        {tier.features.map((feature, featureIndex) => (
          <motion.li 
            key={featureIndex}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.6 + featureIndex * 0.1 }}
            className="flex items-start gap-3"
          >
            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{feature}</span>
          </motion.li>
        ))}
      </ul>

      {/* CTA Button */}
      <motion.button
        onClick={handleUpgrade}
        disabled={isLoading || isCurrentTier}
        className={getButtonClass()}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.8 }}
      >
        <span className="flex items-center justify-center gap-2">
          {getButtonText()}
          {!isCurrentTier && !isLoading && <ArrowRight className="h-5 w-5" />}
        </span>
      </motion.button>
      
      {/* Money back guarantee */}
      {!isFree && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 1 }}
          className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-1"
        >
          <Shield className="h-3 w-3" />
          14-day money-back guarantee
        </motion.p>
      )}
    </motion.div>
  );
}