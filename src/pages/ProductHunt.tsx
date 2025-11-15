import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Target, Zap, BarChart3, CheckCircle, ExternalLink, Star } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import ProductHuntEmbed from '../components/ProductHuntEmbed';

const ProductHunt: React.FC = () => {
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
        title="AdAlign is Live on Product Hunt! AI-Powered Ad Optimization"
        description="We're launching on Product Hunt today! Get your ad-to-landing page congruence score with AI analysis. Special launch offers available now."
        keywords="product hunt launch, ad optimization, landing page analysis, AI marketing, meta ads, google ads"
        url="/producthunt"
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-blue-50/20">
        <div className="container mx-auto px-4 py-8">
          
          {/* Hero Section */}
          <motion.section 
            className="mb-16 py-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="max-w-4xl mx-auto text-center">
              <motion.div 
                variants={itemVariants}
                className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-6 py-3 rounded-full text-sm font-medium mb-6 border border-orange-200"
              >
                <Star className="h-4 w-4 fill-current" />
                Launched on Product Hunt
                <a 
                  href="https://www.producthunt.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 ml-2 text-orange-600 hover:text-orange-800 underline"
                >
                  Give us your support <ExternalLink className="h-3 w-3" />
                </a>
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              >
                Stop Losing Money on
                <span className="block bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  Misaligned Ads & Pages
                </span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto"
              >
                AI-powered analysis that finds where your ads and landing pages don't match, 
                so performance marketers can fix alignment and boost conversion rates.
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
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Run a Free Ad-Landing Page Audit
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </motion.div>
                <motion.div 
                  variants={itemVariants}
                  className="flex items-center gap-2 text-green-600 font-medium"
                >
                  <CheckCircle className="h-5 w-5" />
                  No signup • Results in 60 seconds
                </motion.div>
              </motion.div>
            </div>
          </motion.section>

          {/* Product Hunt Embed Section */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <ProductHuntEmbed />
          </motion.section>

          {/* How It Works */}
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="max-w-5xl mx-auto">
              <motion.div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">How AdAlign Works</h2>
                <p className="text-xl text-gray-600">Fix ad-page misalignment in 3 simple steps</p>
              </motion.div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    step: 1,
                    title: "Upload Your Ad",
                    description: "Share your ad creative from Meta, TikTok, LinkedIn, Reddit, or Google ads. Include headlines and copy.",
                    icon: Target,
                    color: "bg-blue-600"
                  },
                  {
                    step: 2,
                    title: "Add Landing Page",
                    description: "Provide your landing page URL. Our AI analyzes content, visuals, and messaging automatically.",
                    icon: Zap,
                    color: "bg-purple-600"
                  },
                  {
                    step: 3,
                    title: "Get Alignment Report",
                    description: "See visual, content, and tone scores with specific recommendations to improve conversion rates.",
                    icon: BarChart3,
                    color: "bg-green-600"
                  }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="text-center bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    whileHover={{ y: -4 }}
                    viewport={{ once: true }}
                  >
                    <div className={`w-16 h-16 ${item.color} text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg`}>
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Who It's For */}
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Perfect for Performance Marketers</h2>
                <p className="text-xl text-gray-600">Built specifically for marketing professionals who need results</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Performance Marketers",
                    description: "Optimize ad spend ROI by ensuring ads and landing pages work together seamlessly",
                    benefits: ["Reduce cost per acquisition", "Improve conversion rates", "Scale winning campaigns"]
                  },
                  {
                    title: "Media Buyers",
                    description: "Identify and fix alignment issues before they impact campaign performance",
                    benefits: ["Prevent budget waste", "Faster campaign optimization", "Better client results"]
                  },
                  {
                    title: "Founders & CMOs",
                    description: "Get clear insights into why your paid ads aren't converting as expected",
                    benefits: ["Data-driven decisions", "Marketing team alignment", "Competitive advantage"]
                  }
                ].map((persona, index) => (
                  <motion.div 
                    key={index}
                    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    whileHover={{ y: -4 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-xl font-bold mb-3 text-gray-900">{persona.title}</h3>
                    <p className="text-gray-600 mb-4">{persona.description}</p>
                    <ul className="space-y-2">
                      {persona.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Product Hunt Launch Special */}
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="max-w-4xl mx-auto">
              <motion.div 
                className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-8 rounded-3xl shadow-2xl text-center relative overflow-hidden"
                whileHover={{ y: -4 }}
              >
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                    <Star className="h-4 w-4 fill-current" />
                    Product Hunt Launch Special
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    50% Off Pro Plans Today Only
                  </h2>
                  
                  <p className="text-xl mb-6 opacity-90">
                    To celebrate our Product Hunt launch, get unlimited ad analyses and team features at half price
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                    <Link 
                      to="/pricing" 
                      className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
                    >
                      Claim 50% Discount
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                    <span className="text-white/80 text-sm">Offer expires in 24 hours</span>
                  </div>
                  
                  <div className="flex justify-center items-center gap-6 text-sm opacity-80">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Unlimited analyses
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Team collaboration
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Priority support
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* Screenshot Placeholders */}
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">See AdAlign in Action</h2>
                <p className="text-xl text-gray-600">Real examples of ad vs landing page analysis</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gray-100 rounded-2xl p-8 aspect-video flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p className="font-medium">Ad vs Page Comparison</p>
                    <p className="text-sm">Side-by-side visual analysis</p>
                  </div>
                </div>
                
                <div className="bg-gray-100 rounded-2xl p-8 aspect-video flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center text-gray-500">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                    <p className="font-medium">Alignment Dashboard</p>
                    <p className="text-sm">Scores and recommendations</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-100 rounded-2xl p-8 aspect-[2/1] flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-2" />
                  <p className="font-medium">Detailed Analysis Results</p>
                  <p className="text-sm">Visual, content, and tone alignment scores with actionable insights</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* FAQ */}
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Quick Answers</h2>
                <p className="text-xl text-gray-600">Everything you need to know about AdAlign</p>
              </div>
              
              <div className="space-y-6">
                {[
                  {
                    question: "What platforms does AdAlign support?",
                    answer: "We support all major advertising platforms including Meta (Facebook & Instagram), Google Ads, TikTok, LinkedIn, and Reddit. Simply upload your ad creative and provide your landing page URL."
                  },
                  {
                    question: "How accurate is the AI analysis?",
                    answer: "Our AI achieves 94% accuracy compared to manual expert analysis, based on testing with over 10,000 ad-to-page comparisons across 50+ industries."
                  },
                  {
                    question: "Is my data secure?",
                    answer: "Absolutely. We process your ads temporarily for analysis only. No data is stored permanently, and we never share your content with third parties."
                  },
                  {
                    question: "Can I try it for free?",
                    answer: "Yes! You get 3 free analyses per month with no signup required. Results are delivered in 60 seconds."
                  }
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600">
                      {faq.answer}
                    </p>
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
            <div className="max-w-4xl mx-auto">
              <motion.div 
                className="bg-gradient-to-br from-blue-600 via-purple-600 to-red-600 text-white p-12 rounded-3xl shadow-2xl text-center relative overflow-hidden"
                whileHover={{ y: -4 }}
              >
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Ready to Fix Your Ad-Page Alignment?
                  </h2>
                  
                  <p className="text-xl mb-8 opacity-90">
                    Join thousands of marketers who've improved their conversion rates with AdAlign
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link 
                      to="/evaluate" 
                      className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-bold text-lg px-10 py-5 rounded-2xl transition-all shadow-xl hover:shadow-2xl"
                    >
                      Start Your Free Analysis
                      <ArrowRight className="h-6 w-6" />
                    </Link>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-center gap-6 text-sm opacity-80">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      No signup required
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Results in 60 seconds
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>
        </div>
      </div>
    </>
  );
};

export default ProductHunt;