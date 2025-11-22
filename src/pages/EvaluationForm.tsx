import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Link, Upload, AlertCircle, CheckCircle, ArrowRight, ArrowLeft, Zap } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { useAdEvaluation } from '../context/AdEvaluationContext';
import { hasUsedAnonymousCheck } from '../lib/usage-tracking';
import AdAssetForm from '../components/forms/AdAssetForm';
import LandingPageForm from '../components/forms/LandingPageForm';
import UsageBanner from '../components/UsageBanner';
import { logger } from '../lib/logger';
import SEOHead from '../components/SEOHead';

type Step = 'adAssets' | 'landingPage' | 'review';

const EvaluationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('adAssets');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { adData, landingPageData, evaluateAd, canPerformEvaluation } = useAdEvaluation();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  // Check if user needs to sign up before evaluating
  const needsSignup = !isSignedIn && hasUsedAnonymousCheck();

  const handleNext = () => {
    if (currentStep === 'adAssets') {
      if (!adData.platform || (!adData.imageUrl && !adData.adUrl)) {
        setError('Please select a platform and either upload an ad screenshot or enter an ad URL before proceeding.');
        return;
      }
      
      // No auth check - allow anonymous users to proceed for first free check
      setCurrentStep('landingPage');
    } else if (currentStep === 'landingPage') {
      if (!landingPageData.url) {
        setError('Please enter a landing page URL before proceeding.');
        return;
      }
      setCurrentStep('review');
    }
    
    setError(null);
  };


  const handleBack = () => {
    if (currentStep === 'landingPage') setCurrentStep('adAssets');
    else if (currentStep === 'review') setCurrentStep('landingPage');
    
    setError(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await evaluateAd();
      navigate('/results');
    } catch (err) {
      // Handle rate limit errors specifically
      if (err instanceof Error && err.message.includes('429')) {
        setError('Monthly evaluation limit reached (5/5). Your limit will reset on December 1st. Please create an account for higher limits.');
      } else {
        setError('An error occurred during evaluation. Please try again.');
      }
      logger.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: 'adAssets', label: 'Ad Assets', icon: Image },
      { id: 'landingPage', label: 'Landing Page', icon: Link },
      { id: 'review', label: 'Review', icon: Upload },
    ];

    return (
      <motion.div 
        className="flex justify-between items-center max-w-2xl mx-auto mb-8 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = step.id === currentStep;
          const isCompleted = getStepIndex(currentStep) > index;
          
          return (
            <React.Fragment key={step.id}>
              {index > 0 && (
                <motion.div 
                  className={`h-1 flex-grow mx-2 rounded overflow-hidden bg-gray-200`}
                  initial={false}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                    initial={{ width: "0%" }}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </motion.div>
              )}
              <motion.div 
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-lg ${
                    isActive
                      ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 text-orange-600'
                      : isCompleted
                        ? 'border-orange-500 bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                  }`}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    boxShadow: isActive ? "0 8px 25px -8px rgba(249, 115, 22, 0.4)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                    >
                      <CheckCircle className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <StepIcon className="h-5 w-5" />
                  )}
                </motion.div>
                <motion.span 
                  className={`text-sm font-medium mt-2 transition-colors ${
                    isActive ? 'text-orange-600' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                  }`}
                  animate={{ 
                    opacity: isActive ? 1 : 0.7,
                    fontWeight: isActive ? 600 : 500
                  }}
                >
                  {step.label}
                </motion.span>
              </motion.div>
            </React.Fragment>
          );
        })}
      </motion.div>
    );
  };

  const getStepIndex = (step: Step): number => {
    const steps: Step[] = ['adAssets', 'landingPage', 'review'];
    return steps.indexOf(step);
  };

  return (
    <>
      <SEOHead 
        title="Analyze Your Ad Campaign - Free AI-Powered Evaluation"
        description="Upload your ad creative and landing page URL for instant AI analysis. Get actionable insights to improve ad-to-page alignment and boost conversions."
        keywords="analyze ad campaign, ad landing page evaluation, free ad analysis, meta ads analyzer, google ads assessment, tiktok ad evaluation, linkedin ad optimization"
        url="/evaluate"
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-blue-50/20 py-16">
      <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
            className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold mb-6"
          >
            <Zap className="h-4 w-4" />
            AI-Powered Analysis
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 bg-clip-text text-transparent"
          >
            Analyze Your Ad Campaign
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-xl text-gray-600 text-center mb-8 max-w-2xl mx-auto"
          >
            Discover exactly what's killing your conversions in under 60 seconds
          </motion.p>
        </motion.div>
        
        {renderStepIndicator()}
        
        <UsageBanner />
        
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 shadow-lg backdrop-blur-sm"
            >
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <AnimatePresence mode="wait">
            {currentStep === 'adAssets' && (
              <motion.div
                key="adAssets"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <AdAssetForm />
              </motion.div>
            )}
            {currentStep === 'landingPage' && (
              <motion.div
                key="landingPage"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <LandingPageForm />
              </motion.div>
            )}
            
            {currentStep === 'review' && (
              <motion.div 
                key="review"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <motion.h2 
                  className="text-2xl font-bold text-gray-900 flex items-center gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  Review Your Information
                </motion.h2>
                
                <motion.div 
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ y: -2, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                >
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Ad Assets
                  </h3>
                  <div className="space-y-4">
                    {adData.platform && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <p className="text-sm font-medium text-gray-700">Platform</p>
                        <p className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border">
                          {adData.platform === 'meta' && 'Meta (Facebook/Instagram)'}
                          {adData.platform === 'tiktok' && 'TikTok'}
                          {adData.platform === 'linkedin' && 'LinkedIn'}
                          {adData.platform === 'google' && 'Google Ads'}
                          {adData.platform === 'reddit' && 'Reddit'}
                        </p>
                      </motion.div>
                    )}
                    {adData.imageUrl && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <p className="text-sm font-medium text-gray-700 mb-2">Ad Screenshot</p>
                        <motion.img 
                          src={adData.imageUrl} 
                          alt="Complete ad screenshot" 
                          className="h-48 object-cover rounded-xl border-2 border-white shadow-lg w-full" 
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ y: -2, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                >
                  <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                    <Link className="h-5 w-5" />
                    Landing Page
                  </h3>
                  <motion.p 
                    className="text-sm text-gray-700 bg-white px-4 py-3 rounded-lg border"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <span className="font-medium">URL: </span>
                    <motion.a 
                      href={landingPageData.url || ''} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800 hover:underline transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      {landingPageData.url}
                    </motion.a>
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div 
            className="flex justify-between mt-8 pt-6 border-t border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            {currentStep !== 'adAssets' ? (
              <motion.button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-medium shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02, x: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </motion.button>
            ) : (
              <div></div>
            )}
            
            {currentStep !== 'review' ? (
              <motion.button
                onClick={handleNext}
                disabled={needsSignup}
                className={`flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold shadow-lg transition-all ${
                  needsSignup 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:from-orange-600 hover:to-red-600 hover:shadow-xl'
                }`}
                whileHover={needsSignup ? {} : { scale: 1.02, x: 4 }}
                whileTap={needsSignup ? {} : { scale: 0.98 }}
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            ) : (
              <motion.button
                onClick={handleSubmit}
                disabled={isSubmitting || needsSignup}
                className={`px-8 py-4 bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 text-white rounded-xl flex items-center gap-3 font-bold shadow-xl text-lg ${
                  isSubmitting || needsSignup 
                    ? 'opacity-70 cursor-not-allowed' 
                    : 'hover:from-orange-600 hover:via-red-600 hover:to-purple-700 hover:shadow-2xl'
                } transition-all`}
                whileHover={isSubmitting || needsSignup ? {} : { 
                  scale: 1.05, 
                  y: -2,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                whileTap={isSubmitting || needsSignup ? {} : { scale: 0.98 }}
              >
                {isSubmitting && (
                  <motion.div 
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                )}
                {needsSignup 
                  ? 'Sign Up Required' 
                  : isSubmitting 
                    ? 'Analyzing Your Ads...' 
                    : 'Get My Congruence Score'
                }
                {!isSubmitting && !needsSignup && <Zap className="h-5 w-5" />}
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      </div>
      </div>
      </div>
    </>
  );
};

export default EvaluationForm;