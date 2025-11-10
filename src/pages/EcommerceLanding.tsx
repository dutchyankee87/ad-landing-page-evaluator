import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, AlertTriangle, CheckCircle, DollarSign, ShoppingCart, Package } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const EcommerceLanding: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, duration: 0.6 }
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
        title="E-commerce Ad Optimization - Improve Your Online Store's Ad Performance"
        description="Optimize your e-commerce Facebook, Google & TikTok ads with AI-powered landing page analysis. Increase ROAS and reduce cart abandonment for online stores."
        keywords="ecommerce ad optimization, online store advertising, facebook ads for ecommerce, google shopping ads optimization, ecommerce conversion rate optimization"
        url="/ecommerce"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
        <div className="container mx-auto px-4 py-8">
          
          {/* Hero Section */}
          <motion.section 
            className="mb-16 py-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="max-w-5xl mx-auto text-center">
              <motion.div 
                variants={itemVariants}
                className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-red-200"
              >
                <AlertTriangle className="h-4 w-4" />
                E-commerce stores waste 40% of ad spend on misaligned campaigns
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              >
                Stop Losing Sales to
                <span className="block bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Misaligned Store Ads
                </span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto"
              >
                Your Facebook, Google Shopping, and TikTok ads are driving traffic, but visitors bounce because your product pages don't match what they clicked. Our AI finds the disconnect and shows you exactly how to fix it.
              </motion.p>
              
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/evaluate" 
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  >
                    Analyze My Store's Ads - Free
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </motion.div>
                <motion.div 
                  variants={itemVariants}
                  className="flex items-center gap-2 text-green-600 font-medium"
                >
                  <CheckCircle className="h-5 w-5" />
                  Used by 500+ e-commerce stores • Results in 60 seconds
                </motion.div>
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-600"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>Average 45% ROAS improvement</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span>Reduce cart abandonment by 30%</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-blue-500" />
                  <span>Works with all e-commerce platforms</span>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* E-commerce Specific Problems */}
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div 
                  className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-2xl border border-red-200 shadow-lg"
                  whileHover={{ y: -4 }}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <motion.div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <Package className="h-8 w-8 text-red-600" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-red-800 mb-4">Why E-commerce Ads Fail</h2>
                  <ul className="space-y-3 text-red-700">
                    {[
                      "Facebook ad shows red dress, product page shows blue variation first",
                      "Google Shopping ad promises 'free shipping' but page shows $9.99 fee",
                      "TikTok ad has trendy, fun vibe but store looks corporate and slow",
                      "Ad shows sale price but landing page shows regular pricing"
                    ].map((item, index) => (
                      <motion.li 
                        key={index}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <span className="text-red-500 text-xl">×</span>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-2xl border border-green-200 shadow-lg"
                  whileHover={{ y: -4 }}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <motion.div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-green-800 mb-4">Our E-commerce Solution</h2>
                  <ul className="space-y-3 text-green-700">
                    {[
                      "Product image matching: Ensure ad visuals match page hero products",
                      "Pricing consistency: Verify sale prices and shipping offers align",
                      "Brand voice alignment: Match ad tone with product page messaging",
                      "Mobile optimization: Ensure seamless experience from ad to purchase"
                    ].map((item, index) => (
                      <motion.li 
                        key={index}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <span className="text-green-500 text-xl">✓</span>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* E-commerce Case Studies */}
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="max-w-6xl mx-auto">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Real E-commerce Success Stories
              </motion.h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    store: "Fashion Boutique",
                    problem: "Facebook ads showed summer dresses, but homepage featured winter coats",
                    solution: "Matched seasonal landing pages to ad campaigns",
                    result: "78% increase in conversion rate",
                    metric: "+78% CVR",
                    color: "from-pink-500 to-rose-500"
                  },
                  {
                    store: "Electronics Store",
                    problem: "Google Shopping ads promised price match but policy wasn't on product pages",
                    solution: "Added price match guarantee to all product landing pages",
                    result: "$15,000 monthly revenue increase",
                    metric: "+$15k/month",
                    color: "from-blue-500 to-indigo-500"
                  },
                  {
                    store: "Home & Garden",
                    problem: "TikTok ads targeted Gen Z but website looked dated and corporate",
                    solution: "Modernized product pages to match ad aesthetic and tone",
                    result: "65% reduction in bounce rate",
                    metric: "-65% bounce",
                    color: "from-green-500 to-emerald-500"
                  }
                ].map((story, index) => (
                  <motion.div 
                    key={index}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    viewport={{ once: true }}
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${story.color} text-white font-bold text-lg mb-4`}>
                      {story.metric}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{story.store}</h3>
                    <p className="text-red-600 text-sm mb-2"><strong>Problem:</strong> {story.problem}</p>
                    <p className="text-blue-600 text-sm mb-2"><strong>Solution:</strong> {story.solution}</p>
                    <p className="text-green-600 text-sm font-semibold">{story.result}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Platform Specific Features */}
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="max-w-5xl mx-auto">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold text-center mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Analyze All Your E-commerce Ad Platforms
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-600 text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Works with every major advertising platform
              </motion.p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { platform: "Facebook & Instagram", feature: "Product catalog sync verification", icon: "📘" },
                  { platform: "Google Shopping", feature: "Price and availability matching", icon: "🛍️" },
                  { platform: "TikTok Shop", feature: "Mobile-first experience optimization", icon: "🎵" },
                  { platform: "Pinterest", feature: "Visual consistency analysis", icon: "📌" }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="text-center bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-lg"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                    viewport={{ once: true }}
                  >
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{item.platform}</h3>
                    <p className="text-sm text-gray-600">{item.feature}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Final CTA */}
          <motion.section
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="max-w-5xl mx-auto">
              <motion.div 
                className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white p-12 rounded-3xl shadow-2xl text-center relative overflow-hidden"
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover={{ y: -4 }}
                viewport={{ once: true }}
              >
                <div className="relative z-10">
                  <motion.h2 
                    className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    Ready to Fix Your Store's Ad Alignment?
                  </motion.h2>
                  
                  <motion.p 
                    className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    Stop losing customers to misaligned ads. Get your free analysis and start converting more traffic into sales.
                  </motion.p>
                  
                  <motion.div 
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link 
                        to="/evaluate" 
                        className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-gray-100 font-bold text-lg px-10 py-5 rounded-2xl transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                      >
                        Analyze My E-commerce Ads - Free
                        <ArrowRight className="h-6 w-6" />
                      </Link>
                    </motion.div>
                  </motion.div>
                  
                  <motion.div 
                    className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm opacity-80"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.8 }}
                    transition={{ delay: 1 }}
                    viewport={{ once: true }}
                  >
                    {[
                      "No credit card required",
                      "Shopify, WooCommerce, BigCommerce compatible", 
                      "Trusted by 500+ stores"
                    ].map((text, index) => (
                      <motion.div 
                        key={index}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 + index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <CheckCircle className="h-4 w-4" />
                        {text}
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.section>

        </div>
      </div>
    </>
  );
};

export default EcommerceLanding;