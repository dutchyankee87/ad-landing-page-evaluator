import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, ChevronRight, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdEvaluation } from '../context/AdEvaluationContext';
import ScoreGauge from '../components/results/ScoreGauge';
import ComponentScores from '../components/results/ComponentScores';
import TopRecommendations from '../components/results/TopRecommendations';
import ComparisonGrid from '../components/results/ComparisonGrid';
import LanguageAnalysis from '../components/results/LanguageAnalysis';
import AdSummary from '../components/results/AdSummary';
import PartnerRecommendations from '../components/results/PartnerRecommendations';
import { PerformanceFeedbackModal } from '../components/feedback/PerformanceFeedbackModal';
import { IndustryBenchmarks } from '../components/benchmarks/IndustryBenchmarks';
import { DetailedScoring } from '../components/results/DetailedScoring';
import { IndustryInsights } from '../components/insights/IndustryInsights';
import { PersuasionAnalysis } from '../components/psychology/PersuasionAnalysis';
import RunNewTestButton from '../components/results/RunNewTestButton';
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
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Link
                to="/evaluate"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="font-medium">Back to Evaluation</span>
              </Link>
              
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  onClick={openFeedbackModal}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Feedback</span>
                </button>
                
                <button 
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                  onClick={() => window.print()}
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
        
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="px-6 py-4 border-b border-gray-100">
                <h1 className="text-xl font-semibold text-gray-800 mb-1">
                  Ad Analysis Report
                </h1>
                <p className="text-gray-600 text-sm">
                  Optimization recommendations for your {adData.platform ? PLATFORM_NAMES[adData.platform as keyof typeof PLATFORM_NAMES] : ''} campaign
                </p>
              </div>
          
              <div className="p-6">
                {/* Overall Score */}
                <section className="mb-12">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        Alignment Score
                      </h2>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        This score reveals how well your ad and landing page work together to convert visitors.
                        Higher scores = higher conversion rates.
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="text-4xl font-bold text-blue-600">
                          {results.overallScore}
                        </div>
                        <div className="text-sm text-gray-500">
                          <div className="font-medium">out of 10</div>
                          <div className="font-semibold text-gray-700">
                            {getScoreDescription(results.overallScore)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <ScoreGauge score={results.overallScore} />
                    </div>
                  </div>
                </section>

                {/* Ad Summary - moved here for better context */}
                <div>
                  <AdSummary />
                </div>
            
                {/* Component Scores */}
                <div>
                  <ComponentScores componentScores={results.componentScores} />
                </div>
                
                {/* Ad vs Landing Page Comparison Grid */}
                {results.elementComparisons && (
                  <div>
                    <ComparisonGrid 
                      comparisons={results.elementComparisons} 
                      componentScores={results.componentScores}
                    />
                  </div>
                )}
                
                {/* Language & Cultural Analysis */}
                {results.detectedLanguage && results.culturalContext && (
                  <div>
                    <LanguageAnalysis 
                      detectedLanguage={results.detectedLanguage}
                      culturalContext={results.culturalContext}
                    />
                  </div>
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
            
            
                {/* Top 3 Recommendations based on Comparison Grid */}
                {results.elementComparisons && (
                  <div>
                    <TopRecommendations comparisons={results.elementComparisons} />
                  </div>
                )}

                {/* Run New Test Section - moved above Partner Recommendations */}
                <div className="text-center space-y-4 mb-12">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <RunNewTestButton />
                    <Link
                      to="/evaluate"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-300"
                    >
                      Analyze Different Ad
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Partner Recommendations */}
                <PartnerRecommendations overallScore={results.overallScore} />
              </div>
            </div>
          </div>
        </div>
      </div>

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
  if (score >= 9) return 'Excellent Alignment';
  if (score >= 7) return 'Strong Alignment';
  if (score >= 5) return 'Moderate Alignment';
  if (score >= 3) return 'Weak Alignment';
  return 'Poor Alignment';
};

export default Results;