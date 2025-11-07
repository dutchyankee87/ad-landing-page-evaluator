import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, AlertTriangle, CheckCircle, DollarSign, Zap, Target, Clock, BarChart3, Users } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import ArticleSection from '../components/ArticleSection';
import PartnerSection from '../components/partners/PartnerSection';

const Home: React.FC = () => {
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

  const fadeInUpVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <>
      <SEOHead 
        title="Optimize Your Ad Performance with AI-Powered Landing Page Analysis"
        description="Analyze ad-to-landing page congruence with AI. Optimize Meta, Google, TikTok & LinkedIn ads for better conversion rates. Free analysis available."
        keywords="ad landing page optimization tool, paid ad performance, ad congruence analysis, meta ads optimization, google ads analyzer, tiktok ad optimization, linkedin ad performance, conversion rate optimization, AI marketing tool"
        url="/"
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
        <div className="max-w-5xl mx-auto text-center">
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-red-200"
          >
            <AlertTriangle className="h-4 w-4" />
            78% of paid ads fail because they don't match their landing pages
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          >
            Does Your Ad Match
            <span className="block bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Your Landing Page?
            </span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto"
          >
            Find out if your ads and landing pages are working together or working against each other. Our AI compares your Meta, TikTok, LinkedIn, Reddit & Google ads to your landing pages and shows you exactly where they don't align.
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
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-orange-300"
              >
                Check My Ad-Page Alignment - Free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              className="flex items-center gap-2 text-green-600 font-medium"
            >
              <CheckCircle className="h-5 w-5" />
              No signup required • Results in 60 seconds
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-600"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>Average 34% reduction in cost per engaged session</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span>Save $2,400/month in ad spend</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>Results in 60 seconds</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Problem/Solution */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Problem */}
            <motion.div 
              className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-2xl border border-red-200 shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -4 }}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 400 }}
                viewport={{ once: true }}
              >
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </motion.div>
              <h2 className="text-2xl font-bold text-red-800 mb-4">Why Ads & Landing Pages Don't Match</h2>
              <ul className="space-y-3 text-red-700">
                {[
                  "Your ad shows one thing, landing page shows another",
                  "Visual styles clash between ad and page", 
                  "Ad tone is urgent, page tone is corporate",
                  "You can't see these mismatches until it's too late"
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <span className="text-red-500 text-xl">×</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            {/* Solution */}
            <motion.div 
              className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-2xl border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -4 }}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 400 }}
                viewport={{ once: true }}
              >
                <CheckCircle className="h-8 w-8 text-green-600" />
              </motion.div>
              <h2 className="text-2xl font-bold text-green-800 mb-4">We Compare Everything Side-by-Side</h2>
              <ul className="space-y-3 text-green-700">
                {[
                  "Visual match score: Does your ad image match your page?",
                  "Content alignment: Do your ad promises match page reality?",
                  "Tone consistency: Does the messaging feel cohesive?", 
                  "Specific fixes to align your ad with your landing page"
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
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

      {/* How It Works */}
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
            Get Your Ad-Landing Page Alignment Score in 3 Steps
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Takes less time than grabbing coffee ☕
          </motion.p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Upload Your Ad",
                description: "Share your ad creative, headline, and copy. We support Meta, TikTok, LinkedIn, Reddit & Google ad formats.",
                color: "bg-blue-600",
                icon: Target
              },
              {
                step: 2, 
                title: "Add Landing Page URL",
                description: "We'll analyze your landing page content, visuals, and messaging to compare against your ad.",
                color: "bg-purple-600",
                icon: Zap
              },
              {
                step: 3,
                title: "See the Alignment Report", 
                description: "Get scores showing how well your ad and landing page work together, plus fixes to improve alignment.",
                color: "bg-green-600",
                icon: BarChart3
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="text-center bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -4 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className={`w-16 h-16 ${item.color} text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg`}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.2, type: "spring", stiffness: 400 }}
                  viewport={{ once: true }}
                >
                  {item.step}
                </motion.div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Results Preview */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            See Where Your Ad and Landing Page Don't Match
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Real ad-to-page comparison analysis
          </motion.p>
          
          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{ y: -4 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Ad-Landing Page Alignment Report</h3>
                <motion.div 
                  className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 400 }}
                  viewport={{ once: true }}
                >
                  <span className="text-sm">Overall Score</span>
                  <div className="text-3xl font-bold">4.2/10</div>
                </motion.div>
              </div>
            </motion.div>
            
            <div className="p-8 grid md:grid-cols-3 gap-6">
              {[
                { score: "2.8", color: "red", title: "Visual Match", description: "Ad shows luxury watch, but landing page shows budget accessories" },
                { score: "5.1", color: "yellow", title: "Content Alignment", description: "Ad promises premium quality, page talks about affordability" },
                { score: "4.7", color: "orange", title: "Tone Consistency", description: "Ad feels urgent and exciting, page feels slow and corporate" }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <motion.div 
                    className={`w-20 h-20 rounded-full bg-${item.color}-100 flex items-center justify-center mx-auto mb-4 shadow-lg`}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, type: "spring", stiffness: 400 }}
                    viewport={{ once: true }}
                  >
                    <span className={`text-2xl font-bold text-${item.color}-600`}>{item.score}</span>
                  </motion.div>
                  <h4 className={`font-semibold text-${item.color}-600 mb-2`}>{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="bg-gray-50/80 backdrop-blur-sm p-6 border-t border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-500" />
                Priority Fixes
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                {[
                  "Match your landing page hero image to your ad's luxury watch visual",
                  "Add urgency to your page headline to match your ad's tone",
                  "Emphasize premium quality on your page to match your ad promises"
                ].map((fix, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    • {fix}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Social Proof */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Join 2,847 Marketers Who Fixed Their Ad-Page Alignment
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                stat: "+73%",
                color: "text-green-600",
                bgColor: "from-green-50 to-emerald-50",
                borderColor: "border-green-200",
                title: "Cost Per Conversion Improvement",
                quote: "Found our TikTok ad and landing page were totally mismatched. Fixed it in one day, cost per conversion dropped 43%",
                author: "Sarah K, E-commerce Director"
              },
              {
                stat: "$4,200", 
                color: "text-blue-600",
                bgColor: "from-blue-50 to-cyan-50",
                borderColor: "border-blue-200",
                title: "Monthly Ad Spend Saved",
                quote: "Discovered our LinkedIn ads promised one thing, landing page delivered another. Fixed the alignment, ROI improved 2.3x",
                author: "Mike T, SaaS Marketing"
              },
              {
                stat: "60 sec",
                color: "text-purple-600", 
                bgColor: "from-purple-50 to-violet-50",
                borderColor: "border-purple-200",
                title: "Average Analysis Time",
                quote: "Compared our Google & Meta ads to our landing pages - found mismatches we never noticed",
                author: "Jennifer L, Agency Owner"
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className={`bg-gradient-to-br ${item.bgColor} backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border ${item.borderColor}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -4, scale: 1.02 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className={`text-4xl font-bold ${item.color} mb-2`}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.2, type: "spring", stiffness: 400 }}
                  viewport={{ once: true }}
                >
                  {item.stat}
                </motion.div>
                <p className="text-gray-700 font-medium mb-3">{item.title}</p>
                <p className="text-sm text-gray-600 mb-3 italic">"{item.quote}"</p>
                <div className="text-sm font-medium text-gray-700">- {item.author}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Articles Section */}
      <ArticleSection />

      {/* Partners Trust Section */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-medium mb-6"
            >
              <Users className="h-4 w-4" />
              Complete Your Marketing Stack
            </motion.div>
            
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Trusted by Leading Marketers
            </motion.h2>
            
            <motion.p 
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Discover powerful tools that extend your ad optimization success across your entire marketing funnel
            </motion.p>
          </motion.div>
          
          <PartnerSection
            showHeader={false}
            compact={true}
            className="max-w-4xl mx-auto"
          />
          
          <motion.div 
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            viewport={{ once: true }}
          >
            <Link 
              to="/partners" 
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              View All Partners
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
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
            className="bg-gradient-to-br from-red-600 via-purple-600 to-blue-600 text-white p-12 rounded-3xl shadow-2xl text-center relative overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ y: -4 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-black/10"></div>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <div className="relative z-10">
              <motion.div 
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/30"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
              >
                <DollarSign className="h-4 w-4" />
                Stop losing $2,400+ monthly to ad-page mismatches
              </motion.div>
              
              <motion.h2 
                className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                viewport={{ once: true }}
              >
                Your Competitors Are Already 
                <span className="block">Aligning Their Ads & Landing Pages</span>
              </motion.h2>
              
              <motion.p 
                className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                viewport={{ once: true }}
              >
                Don't let another day pass with ads and landing pages that don't match. Get your alignment score and fix the disconnect.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                viewport={{ once: true }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/evaluate" 
                    className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 font-bold text-lg px-10 py-5 rounded-2xl transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-white/30"
                  >
                    Check My Ad-Page Alignment - It's Free
                    <ArrowRight className="h-6 w-6" />
                  </Link>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm opacity-80"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.8 }}
                transition={{ delay: 1.2 }}
                viewport={{ once: true }}
              >
                {[
                  "No credit card required",
                  "Results in 60 seconds", 
                  "Used by 2,800+ marketers"
                ].map((text, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 + index * 0.1 }}
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

export default Home;