import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Check, Star, ArrowRight, Zap, TrendingUp, Users, Shield, Clock } from 'lucide-react';
import { SUBSCRIPTION_TIERS, ANNUAL_SUBSCRIPTION_TIERS } from '../lib/subscription';
import { redirectToCheckout } from '../lib/stripe';
import EnhancedPricingCard from '../components/subscription/EnhancedPricingCard';
import SEOHead from '../components/SEOHead';

const Pricing: React.FC = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [isYearly, setIsYearly] = useState(false);
  
  const allTiers = isYearly ? [...SUBSCRIPTION_TIERS.filter(t => t.id === 'free'), ...ANNUAL_SUBSCRIPTION_TIERS] : SUBSCRIPTION_TIERS;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <>
      <SEOHead 
        title="Pricing - ADalign.io | Beat Hotjar & VWO with AI-Powered Ad Analysis"
        description="Finally, an ad optimization tool that costs less than Hotjar ($99/mo) but delivers 10x better insights. Start free, upgrade when you see results."
        keywords="ad analysis pricing, hotjar alternative, vwo alternative, unbounce alternative, conversion optimization"
        url="/pricing"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-blue-50/20 py-16">
        <div className="container mx-auto px-4">
          
          {/* Hero Section */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-block bg-orange-100 text-orange-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">
                🚀 Cheaper than Hotjar, smarter than VWO
              </span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
            >
              Stop Guessing.
              <br />
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 bg-clip-text text-transparent">
                Start Converting.
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed"
            >
              While <strong>Hotjar costs $99/mo</strong> just to see where users click, we tell you exactly <strong>why your ads aren't converting</strong> — starting free.
            </motion.p>

            {/* Social Proof */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-center gap-8 mb-12 text-sm text-gray-600"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span>94% accuracy rate</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <span>Results in 60 seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                <span>500+ agencies trust us</span>
              </div>
            </motion.div>
            
            {/* Billing Toggle */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-center gap-4 mb-12"
            >
              <span className={`text-lg font-medium transition-colors ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsYearly(!isYearly)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-orange-300 ${
                  isYearly ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gray-300'
                }`}
              >
                <motion.span
                  layout
                  className="inline-block h-6 w-6 transform rounded-full bg-white shadow-lg"
                  style={{
                    x: isYearly ? 28 : 2
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </motion.button>
              <span className={`text-lg font-medium transition-colors ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
                Yearly
                <span className="ml-2 bg-green-100 text-green-800 text-sm font-bold px-2 py-1 rounded-full">
                  SAVE 17%
                </span>
              </span>
            </motion.div>
          </motion.div>

          {/* Competitor Comparison */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-16 max-w-5xl mx-auto border border-gray-200 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-center mb-8">How We Compare to The "Big Players"</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Tool</h3>
                <div className="space-y-4 text-sm">
                  <div className="font-bold text-orange-600">ADalign.io</div>
                  <div className="text-gray-600">Hotjar</div>
                  <div className="text-gray-600">VWO</div>
                  <div className="text-gray-600">Unbounce</div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Starting Price</h3>
                <div className="space-y-4 text-sm">
                  <div className="font-bold text-green-600">Free</div>
                  <div className="text-red-600">$39/mo</div>
                  <div className="text-red-600">$99/mo</div>
                  <div className="text-red-600">$79/mo</div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Ad Analysis</h3>
                <div className="space-y-4 text-sm">
                  <div className="font-bold text-green-600">✅ AI-Powered</div>
                  <div className="text-red-600">❌ Manual</div>
                  <div className="text-red-600">❌ Basic</div>
                  <div className="text-red-600">❌ None</div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Time to Insights</h3>
                <div className="space-y-4 text-sm">
                  <div className="font-bold text-green-600">60 seconds</div>
                  <div className="text-red-600">Days/Weeks</div>
                  <div className="text-red-600">Hours/Days</div>
                  <div className="text-red-600">Manual</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pricing Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16"
          >
            {allTiers.map((tier, index) => (
              <EnhancedPricingCard
                key={tier.id}
                tier={tier}
                userEmail={user?.primaryEmailAddress?.emailAddress}
                currentTier="free" // TODO: Get from user data
                isYearly={isYearly}
                index={index}
              />
            ))}
          </motion.div>

          {/* Trust Signals */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto border border-gray-200">
              <h3 className="text-xl font-semibold mb-6">Join 500+ Growth Teams Who've Stopped Overpaying</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">$2,000+</div>
                  <div className="text-gray-600">Average monthly savings vs Hotjar + VWO</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">10x</div>
                  <div className="text-gray-600">Faster insights than manual analysis</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">94%</div>
                  <div className="text-gray-600">Customer satisfaction rate</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Know</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  Is there a free trial?
                </h3>
                <p className="text-gray-600">
                  Better than a trial — you get <strong>3 free evaluations</strong> forever. No credit card required, no time limits.
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  How accurate is the AI?
                </h3>
                <p className="text-gray-600">
                  Our AI achieves <strong>94% accuracy</strong> vs manual expert analysis, but delivers results in 60 seconds instead of days.
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Can I cancel anytime?
                </h3>
                <p className="text-gray-600">
                  Absolutely. Cancel with one click, no questions asked. Plus, we offer a <strong>14-day money-back guarantee</strong>.
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-500" />
                  What if I exceed my limit?
                </h3>
                <p className="text-gray-600">
                  No overage fees! We'll simply suggest upgrading to a plan that fits your usage. Limits reset monthly.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Pricing;