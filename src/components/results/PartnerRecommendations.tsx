import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';
import PartnerCard from '../partners/PartnerCard';

interface PartnerRecommendationsProps {
  overallScore: number;
}

const PartnerRecommendations: React.FC<PartnerRecommendationsProps> = ({ overallScore }) => {
  const getRecommendationText = () => {
    if (overallScore >= 80) {
      return "Excellent alignment! Take your success further with these complementary tools:";
    } else if (overallScore >= 60) {
      return "Good foundation! These tools can help optimize your complete marketing funnel:";
    } else {
      return "Optimize your entire customer journey with these powerful complementary tools:";
    }
  };

  const partners = [
    {
      name: "WeConnect.chat",
      description: "Transform your ad conversions into meaningful customer relationships with AI-powered engagement that builds lasting connections.",
      valueProposition: "Turn conversations into conversions with intelligent customer engagement",
      url: "https://weconnect.chat/?utm_source=adalign&utm_medium=referral&utm_campaign=partner_recommendation",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Causality Engine",
      description: "Discover hidden revenue opportunities and optimize your complete customer journey with advanced AI attribution analysis.",
      valueProposition: "Uncover $25K+ in hidden value with intelligent attribution insights",
      url: "https://www.causalityengine.ai/?utm_source=adalign&utm_medium=referral&utm_campaign=partner_recommendation",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.7 }}
      className="mt-12 p-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl border border-gray-200"
    >
      {/* Section Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-medium mb-4"
        >
          <Sparkles className="h-4 w-4" />
          Enhance Your Analysis
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-2xl font-bold text-gray-900 mb-2"
        >
          Complete Your Marketing Success
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-gray-600 max-w-2xl mx-auto leading-relaxed"
        >
          {getRecommendationText()}
        </motion.p>
      </div>

      {/* Partners Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {partners.map((partner, index) => (
          <PartnerCard
            key={partner.name}
            {...partner}
            delay={1.2 + index * 0.1}
            compact={true}
          />
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-8 text-center"
      >
        <div className="inline-flex items-center gap-2 text-sm text-gray-500">
          <TrendingUp className="h-4 w-4" />
          <span>Recommended by adalign.io for complete campaign optimization</span>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default PartnerRecommendations;