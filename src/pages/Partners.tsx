import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Target, TrendingUp, Zap, CheckCircle } from 'lucide-react';
import PartnerSection from '../components/partners/PartnerSection';
import SEOHead from '../components/SEOHead';

const Partners: React.FC = () => {
  const benefits = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Complete Marketing Stack",
      description: "Access a full suite of tools that work seamlessly together to optimize every aspect of your campaigns"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Proven Results",
      description: "Our partners have helped thousands of businesses increase conversion rates and ROI across multiple channels"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI-Powered Insights",
      description: "Leverage cutting-edge AI technology to uncover hidden opportunities and optimize your customer journey"
    }
  ];

  const integrationBenefits = [
    "Cross-platform attribution analysis",
    "Customer engagement optimization", 
    "Revenue discovery and optimization",
    "Complete funnel visibility",
    "AI-driven recommendations",
    "Unified reporting dashboard"
  ];

  return (
    <>
      <SEOHead 
        title="Marketing Partners - Complete Your Marketing Stack"
        description="Discover powerful marketing tools that complement adalign.io. Access AI-powered customer engagement platforms and advanced attribution analysis to maximize your marketing ROI."
        keywords="marketing partners, customer engagement platforms, marketing attribution tools, AI marketing tools, conversion optimization, marketing automation"
        url="/partners"
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-5xl mx-auto">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="font-medium">Back to Home</span>
              </Link>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-medium mb-6"
                >
                  <Users className="h-4 w-4" />
                  Trusted Partners
                </motion.div>
                
                <motion.h1 
                  className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  Complete Your Marketing Success
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  Extend adalign.io's ad optimization insights with our carefully selected partners. 
                  Get the complete picture of your marketing performance and unlock new revenue opportunities.
                </motion.p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            
            {/* Benefits Section */}
            <motion.section 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="mb-16"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Why Choose Our Partner Ecosystem?
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Don't limit yourself to just ad optimization. Our partners extend your success 
                  across the entire customer journey.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl">
                        {benefit.icon}
                      </div>
                      <h3 className="font-bold text-gray-900">{benefit.title}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Partners Section */}
            <motion.section 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="mb-16"
            >
              <PartnerSection
                title="Our Recommended Partners"
                description="Carefully selected tools that complement adalign.io to give you complete marketing optimization"
                showHeader={true}
                compact={false}
              />
            </motion.section>

            {/* Integration Benefits */}
            <motion.section 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.7 }}
              className="mb-16"
            >
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100">
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Unlock Your Complete Marketing Potential
                    </h2>
                    <p className="text-gray-600 text-lg">
                      When you combine adalign.io with our partners, you get:
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {integrationBenefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 + index * 0.1, duration: 0.5 }}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.7 }}
              className="text-center bg-white rounded-3xl p-12 shadow-sm border border-gray-200"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Ready to Optimize Your Ads?
              </h2>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                Start with adalign.io's comprehensive ad analysis, then expand your success 
                with our recommended partners for complete marketing optimization.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/evaluate"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Zap className="h-5 w-5" />
                  Start Ad Analysis
                </Link>
                
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-semibold hover:border-gray-300 hover:shadow-lg transition-all duration-300"
                >
                  View Pricing
                </Link>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Partners;