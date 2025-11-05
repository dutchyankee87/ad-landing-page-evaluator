import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, ChevronRight, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdEvaluation } from '../context/AdEvaluationContext';
import ScoreGauge from '../components/results/ScoreGauge';
import ComponentScores from '../components/results/ComponentScores';
import Suggestions from '../components/results/Suggestions';
import EnhancedSuggestions from '../components/results/EnhancedSuggestions';
import ComparisonGrid from '../components/results/ComparisonGrid';
import QuickWins from '../components/results/QuickWins';
import LanguageAnalysis from '../components/results/LanguageAnalysis';
import AdSummary from '../components/results/AdSummary';
import { HeatmapOverlay } from '../components/heatmap/HeatmapOverlay';
import { PerformanceFeedbackModal } from '../components/feedback/PerformanceFeedbackModal';
import { IndustryBenchmarks } from '../components/benchmarks/IndustryBenchmarks';
import { DetailedScoring } from '../components/results/DetailedScoring';
import { IndustryInsights } from '../components/insights/IndustryInsights';
import { PersuasionAnalysis } from '../components/psychology/PersuasionAnalysis';
import SEOHead from '../components/SEOHead';

const PLATFORM_NAMES = {
  meta: 'Meta (Facebook/Instagram)',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  google: 'Google Ads',
  reddit: 'Reddit'
} as const;

const Results: React.FC = () => {
  const { 
    results, 
    hasEvaluated, 
    adData, 
    showFeedbackModal, 
    openFeedbackModal, 
    closeFeedbackModal, 
    submitFeedback 
  } = useAdEvaluation();
  const navigate = useNavigate();

  // Redirect if results aren't available
  useEffect(() => {
    if (!hasEvaluated) {
      navigate('/evaluate');
    }
  }, [hasEvaluated, navigate]);


  if (!hasEvaluated || !results) {
    return null; // Will redirect via useEffect
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const scoreVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.3
      }
    }
  };

  return (
    <>
      <SEOHead 
        title="Your Ad Analysis Results - Optimization Recommendations"
        description="View your personalized ad optimization recommendations. Get specific insights on visual, contextual, and tone alignment to improve campaign performance."
        keywords="ad optimization recommendations, ad analysis results, ad performance insights, conversion optimization, ad alignment score, marketing analysis report"
        url="/results"
        noindex={true}
      />
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              className="flex justify-between items-center mb-8"
              variants={headerVariants}
            >
              <motion.div
                whileHover={{ x: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/evaluate"
                  className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-all duration-300 group"
                >
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-medium">Back to Evaluation</span>
                </Link>
              </motion.div>
              
              <div className="flex gap-3">
                <motion.button
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                  onClick={openFeedbackModal}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Share Feedback</span>
                </motion.button>
                
                <motion.button 
                  className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl text-gray-700 hover:bg-white hover:shadow-lg transition-all duration-300 font-medium"
                  onClick={() => window.print()}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="h-4 w-4" />
                  <span>Export Results</span>
                </motion.button>
              </div>
            </motion.div>
        
            <motion.div 
              className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden mb-8 border border-white/20"
              variants={itemVariants}
            >
              <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 px-8 py-10 text-white relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-500/20"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 8,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                />
                <motion.h1 
                  className="text-4xl md:text-5xl font-bold mb-4 relative z-10"
                  variants={itemVariants}
                >
                  🎯 Your ADalign.io Report
                </motion.h1>
                <motion.p 
                  className="text-xl md:text-2xl font-medium opacity-95 relative z-10"
                  variants={itemVariants}
                >
                  Here's exactly what's killing (or boosting) your conversions
                  {adData.platform ? ` on ${PLATFORM_NAMES[adData.platform as keyof typeof PLATFORM_NAMES]}` : ''}
                </motion.p>
                <motion.div
                  className="absolute top-4 right-4 w-24 h-24 bg-white/10 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 6,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                />
              </div>
          
              <div className="p-8">
                {/* Overall Score */}
                <motion.section 
                  className="mb-16"
                  variants={itemVariants}
                >
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div variants={itemVariants}>
                      <motion.h2 
                        className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                        variants={itemVariants}
                      >
                        Congruence Score
                      </motion.h2>
                      <motion.p 
                        className="text-gray-600 mb-6 text-lg leading-relaxed"
                        variants={itemVariants}
                      >
                        This score reveals how well your ad and landing page work together to convert visitors.
                        Higher scores = higher conversion rates.
                      </motion.p>
                      <motion.div 
                        className="flex items-center gap-6"
                        variants={itemVariants}
                      >
                        <motion.div 
                          className="text-6xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"
                          variants={scoreVariants}
                          whileHover={{ scale: 1.05 }}
                        >
                          {results.overallScore}
                        </motion.div>
                        <div className="text-sm text-gray-500">
                          <div className="font-medium text-lg">out of 10</div>
                          <motion.div 
                            className="font-semibold text-xl text-gray-700"
                            variants={itemVariants}
                          >
                            {getScoreDescription(results.overallScore)}
                          </motion.div>
                        </div>
                      </motion.div>
                    </motion.div>
                    <motion.div 
                      className="flex justify-center"
                      variants={scoreVariants}
                    >
                      <ScoreGauge score={results.overallScore} />
                    </motion.div>
                  </div>
                </motion.section>
            
                {/* Component Scores */}
                <motion.div variants={itemVariants}>
                  <ComponentScores componentScores={results.componentScores} />
                </motion.div>
                
                {/* Language & Cultural Analysis */}
                {results.detectedLanguage && results.culturalContext && (
                  <motion.div variants={itemVariants}>
                    <LanguageAnalysis 
                      detectedLanguage={results.detectedLanguage}
                      culturalContext={results.culturalContext}
                    />
                  </motion.div>
                )}
                
                {/* Quick Wins Section */}
                {results.quickWins && (
                  <motion.div variants={itemVariants}>
                    <QuickWins quickWins={results.quickWins} />
                  </motion.div>
                )}
                
                {/* Ad vs Landing Page Comparison Grid */}
                {results.elementComparisons && (
                  <motion.div variants={itemVariants}>
                    <ComparisonGrid comparisons={results.elementComparisons} />
                  </motion.div>
                )}
            
                {/* Industry Benchmarks */}
                <motion.section 
                  className="mb-16"
                  variants={itemVariants}
                >
                  <motion.h2 
                    className="text-3xl font-bold mb-8 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                    variants={itemVariants}
                  >
                    📊 How You Stack Up
                  </motion.h2>
                  <IndustryBenchmarks
                    score={results.overallScore}
                    platform={adData.platform || 'meta'}
                    industry={results.industry || 'other'}
                    benchmarkData={results.benchmarkData}
                    userPercentile={results.benchmarkData?.userPercentile}
                  />
                </motion.section>

                {/* Psychological Persuasion Analysis */}
                {results.persuasionPrinciples && (
                  <motion.section 
                    className="mb-16"
                    variants={itemVariants}
                  >
                    <motion.h2 
                      className="text-3xl font-bold mb-8 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                      variants={itemVariants}
                    >
                      🧠 Psychology & Persuasion Analysis
                    </motion.h2>
                    <PersuasionAnalysis
                      persuasionPrinciples={results.persuasionPrinciples}
                      persuasionScore={results.persuasionScore || 6.5}
                      psychologicalInsights={results.psychologicalInsights || []}
                    />
                  </motion.section>
                )}

                {/* Industry Insights */}
                {results.benchmarkData && results.performancePrediction && (
                  <motion.section 
                    className="mb-16"
                    variants={itemVariants}
                  >
                    <motion.h2 
                      className="text-3xl font-bold mb-8 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                      variants={itemVariants}
                    >
                      📊 Industry Intelligence
                    </motion.h2>
                    <IndustryInsights
                      industry={results.industry || 'ecommerce'}
                      platform={adData.platform || 'meta'}
                      score={results.overallScore}
                      benchmarkData={results.benchmarkData}
                      performancePrediction={results.performancePrediction}
                    />
                  </motion.section>
                )}
            
                {/* Ad Summary */}
                <motion.div variants={itemVariants}>
                  <AdSummary />
                </motion.div>
                
                {/* Detailed Micro-Scoring Analysis */}
                {results.detailedScoring && (
                  <motion.section 
                    className="mb-16"
                    variants={itemVariants}
                  >
                    <motion.h2 
                      className="text-3xl font-bold mb-8 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                      variants={itemVariants}
                    >
                      🎯 Advanced Analysis
                    </motion.h2>
                    <DetailedScoring 
                      scoringResult={results.detailedScoring}
                      platform={adData.platform || 'meta'}
                    />
                  </motion.section>
                )}
            
            {/* Landing Page Heatmap - Hidden for now */}
            {false && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">🔍 Landing Page Optimization Zones</h2>
                <p className="text-gray-600 mb-6">
                  Click on the colored zones below to see specific recommendations for each area of your landing page.
                  Red = High Priority, Yellow = Medium Priority, Blue = Low Priority.
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <HeatmapOverlay 
                    imageUrl="/api/placeholder/800/1200" // This should be the actual landing page screenshot
                    zones={results.heatmapZones || [
                      {
                        location: "hero-section",
                        description: "Main headline and primary call-to-action area",
                        severity: "HIGH" as const,
                        issue: "Value proposition clarity and CTA prominence need optimization",
                        suggestion: "Strengthen headline clarity and CTA prominence for better conversion",
                        expectedImpact: "15-25% improvement in engagement rates"
                      },
                      {
                        location: "cta-button",
                        description: "Primary conversion action button",
                        severity: "HIGH" as const,
                        issue: "Call-to-action button needs more visual prominence",
                        suggestion: "Increase button size and contrast to improve conversions",
                        expectedImpact: "12-20% conversion rate improvement"
                      }
                    ]}
                    className="max-w-2xl mx-auto"
                  />
                </div>
              </section>
            )}
            
                {/* Enhanced Suggestions or Legacy Suggestions */}
                <motion.div variants={itemVariants}>
                  {results.enhancedSuggestions ? (
                    <EnhancedSuggestions suggestions={results.enhancedSuggestions} />
                  ) : (
                    <Suggestions suggestions={results.suggestions} />
                  )}
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              className="text-center"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/evaluate"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white rounded-2xl hover:from-orange-600 hover:via-orange-700 hover:to-red-600 transition-all duration-300 font-semibold shadow-2xl hover:shadow-3xl text-lg group"
                >
                  Analyze Another Ad
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Performance Feedback Modal */}
      <PerformanceFeedbackModal
        isOpen={showFeedbackModal}
        onClose={closeFeedbackModal}
        onSubmit={submitFeedback}
        evaluationId={results?.evaluationId || 'mock-evaluation'}
        recommendations={results?.strategicRecommendations?.map(r => r.recommendation) || []}
      />

    </>
  );
};

// Helper function to get score description
const getScoreDescription = (score: number): string => {
  if (score >= 9) return '🔥 Conversion Machine';
  if (score >= 7) return '✅ Strong Alignment';
  if (score >= 5) return '⚠️ Room to Improve';
  if (score >= 3) return '🚨 Losing Money';
  return '💸 Conversion Killer';
};

export default Results;