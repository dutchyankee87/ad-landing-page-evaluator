import React from 'react';
import { motion } from 'framer-motion';
import PartnerCard from './PartnerCard';

interface PartnerSectionProps {
  title?: string;
  description?: string;
  showHeader?: boolean;
  compact?: boolean;
  className?: string;
}

const PartnerSection: React.FC<PartnerSectionProps> = ({
  title = "Trusted Partners",
  description = "Expand your marketing success with our recommended partners",
  showHeader = true,
  compact = false,
  className = ""
}) => {
  const partners = [
    {
      name: "WeConnect.chat",
      description: "Transform your ad conversions into meaningful customer relationships with AI-powered engagement that builds lasting connections.",
      valueProposition: "Turn conversations into conversions with intelligent customer engagement",
      url: "https://weconnect.chat/?utm_source=adalign&utm_medium=referral&utm_campaign=partners_page",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Causality Engine", 
      description: "Discover hidden revenue opportunities and optimize your complete customer journey with advanced AI attribution analysis.",
      valueProposition: "Uncover $25K+ in hidden value with intelligent attribution insights",
      url: "https://www.causalityengine.ai/?utm_source=adalign&utm_medium=referral&utm_campaign=partners_page",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section className={`${className}`}>
      {showHeader && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {title}
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {description}
          </motion.p>
        </motion.div>
      )}

      <div className={`grid gap-8 ${compact ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-2'}`}>
        {partners.map((partner, index) => (
          <PartnerCard
            key={partner.name}
            {...partner}
            delay={showHeader ? 0.5 + index * 0.1 : index * 0.1}
            compact={compact}
          />
        ))}
      </div>
    </section>
  );
};

export default PartnerSection;