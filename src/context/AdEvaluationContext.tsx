import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  canEvaluate, 
  getRemainingEvaluations, 
  recordEvaluation, 
  getUsageData,
  getDaysUntilReset,
  type UsageData 
} from '../lib/usage-tracking';

// Types
interface AdData {
  imageUrl: string | null;
  platform: string | null;
  imageFileSize?: number;
  adUrl?: string | null;
  imageStoragePath?: string;
}

interface LandingPageData {
  url: string | null;
  isValidated: boolean;
  title?: string;
  mainContent?: string;
  ctaText?: string;
}

interface AudienceData {
  ageRange: string | null;
  gender: string | null;
  location?: string;
  interests: string | null;
}

interface MicroScore {
  name: string;
  score: number;
  weight: number;
  description: string;
}

interface MicroScores {
  visual: MicroScore[];
  content: MicroScore[];
  alignment: MicroScore[];
  platform: MicroScore[];
}

interface ComponentScores {
  visualMatch?: number; // Legacy support
  contextualMatch?: number; // Legacy support  
  toneAlignment?: number; // Legacy support
  brandCoherence?: number;
  userJourneyAlignment?: number;
  conversionOptimization?: number;
}

interface Suggestions {
  visual?: string[]; // Legacy support
  contextual?: string[]; // Legacy support
  tone?: string[]; // Legacy support
}

interface StrategicRecommendation {
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation: string;
  expectedImpact: string;
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface HeatmapZone {
  location: string;
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  issue: string;
  suggestion: string;
  expectedImpact: string;
}

interface Insights {
  brandCoherence?: string;
  userJourneyAlignment?: string;
  conversionOptimization?: string;
}

interface BenchmarkData {
  percentile10: number;
  percentile25: number;
  percentile50: number;
  percentile75: number;
  percentile90: number;
  sampleSize: number;
  userPercentile?: number;
}

interface PerformancePrediction {
  expectedCTR: number;
  expectedCVR: number;
  confidenceLevel: number;
}

interface PersuasionPrinciple {
  score: 'HIGH' | 'MEDIUM' | 'LOW';
  adAnalysis: string;
  pageAnalysis: string;
  recommendation: string;
  examples: string[];
}

interface PersuasionPrinciples {
  reciprocity: PersuasionPrinciple;
  commitment: PersuasionPrinciple;
  socialProof: PersuasionPrinciple;
  authority: PersuasionPrinciple;
  liking: PersuasionPrinciple;
  scarcity: PersuasionPrinciple;
}

interface EvaluationResults {
  overallScore: number;
  overallAssessment?: 'STRONG' | 'MODERATE' | 'WEAK';
  executiveSummary?: string;
  componentScores: ComponentScores;
  microScores?: MicroScores;
  detailedScoring?: any; // MicroScoringResult from engine
  persuasionPrinciples?: PersuasionPrinciples;
  persuasionScore?: number;
  psychologicalInsights?: string[];
  suggestions?: Suggestions; // Legacy support
  insights?: Insights;
  strategicRecommendations?: StrategicRecommendation[];
  riskFactors?: string[];
  missedOpportunities?: string[];
  heatmapZones?: HeatmapZone[];
  benchmarkData?: BenchmarkData;
  performancePrediction?: PerformancePrediction;
  industry?: string;
  audienceType?: string;
}

interface AdEvaluationContextType {
  adData: AdData;
  landingPageData: LandingPageData;
  audienceData: AudienceData;
  results: EvaluationResults | null;
  hasEvaluated: boolean;
  showFeedbackModal: boolean;
  usageData: UsageData;
  canPerformEvaluation: boolean;
  remainingEvaluations: number;
  daysUntilReset: number;
  showLimitModal: boolean;
  updateAdData: (data: Partial<AdData>) => void;
  updateLandingPageData: (data: Partial<LandingPageData>) => void;
  updateAudienceData: (data: Partial<AudienceData>) => void;
  evaluateAd: () => Promise<void>;
  resetEvaluation: () => void;
  openFeedbackModal: () => void;
  closeFeedbackModal: () => void;
  submitFeedback: (feedback: any) => Promise<void>;
  closeLimitModal: () => void;
}

// Create context
const AdEvaluationContext = createContext<AdEvaluationContextType | undefined>(undefined);

// Provider component
export const AdEvaluationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const userId = user?.id;
  
  const [adData, setAdData] = useState<AdData>({
    imageUrl: null,
    platform: null
  });
  
  const [landingPageData, setLandingPageData] = useState<LandingPageData>({
    url: null,
    isValidated: false
  });

  const [audienceData, setAudienceData] = useState<AudienceData>({
    ageRange: null,
    gender: null,
    location: '',
    interests: null
  });
  
  const [results, setResults] = useState<EvaluationResults | null>(null);
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [usageData, setUsageData] = useState<UsageData>(() => getUsageData(userId));
  const [canPerformEvaluation, setCanPerformEvaluation] = useState(() => canEvaluate(userId));
  const [remainingEvaluations, setRemainingEvaluations] = useState(() => getRemainingEvaluations(userId));
  const [daysUntilReset, setDaysUntilReset] = useState(() => getDaysUntilReset());

  // Update usage stats when component mounts or usage changes
  useEffect(() => {
    const updateUsageStats = () => {
      const usage = getUsageData(userId);
      setUsageData(usage);
      setCanPerformEvaluation(canEvaluate(userId));
      setRemainingEvaluations(getRemainingEvaluations(userId));
      setDaysUntilReset(getDaysUntilReset());
    };

    updateUsageStats();
    
    // Update stats periodically (every minute) to handle month transitions
    const interval = setInterval(updateUsageStats, 60000);
    return () => clearInterval(interval);
  }, [userId]); // Update when userId changes
  
  const updateAdData = (data: Partial<AdData>) => {
    setAdData(prev => ({ ...prev, ...data }));
  };
  
  const updateLandingPageData = (data: Partial<LandingPageData>) => {
    setLandingPageData(prev => ({ ...prev, ...data }));
  };

  const updateAudienceData = (data: Partial<AudienceData>) => {
    setAudienceData(prev => ({ ...prev, ...data }));
  };
  
  const evaluateAd = async () => {
    // For anonymous users, check if they've already used their free evaluation
    if (!userId) {
      const anonymousUsage = getUsageData(); // No userId = anonymous usage
      if (anonymousUsage.evaluationsUsed >= 1) {
        setShowLimitModal(true);
        return;
      }
    } else {
      // For authenticated users, check their limit (2 evaluations)
      if (!canPerformEvaluation) {
        setShowLimitModal(true);
        return;
      }
    }

    // Record the evaluation attempt
    const success = recordEvaluation(userId);
    if (!success) {
      setShowLimitModal(true);
      return;
    }

    // Update usage stats after recording
    const usage = getUsageData(userId);
    setUsageData(usage);
    setCanPerformEvaluation(canEvaluate(userId));
    setRemainingEvaluations(getRemainingEvaluations(userId));

    try {
      // Use the client-safe API
      const { evaluateAd: apiEvaluateAd } = await import('../lib/api');
      
      const response = await apiEvaluateAd({
        adData,
        landingPageData,
        audienceData,
        // TODO: Add user email when auth is implemented
        userEmail: undefined
      });

      setResults({
        overallScore: response.overallScore,
        componentScores: response.componentScores,
        suggestions: response.suggestions
      });
      setHasEvaluated(true);
      
    } catch (error) {
      console.warn('Evaluation failed, using fallback:', error);
      // Fallback to mock evaluation
      await mockEvaluateAd();
    }
  };
  
  const getPlatformSpecificSuggestions = (platform: string) => {
    const platformSuggestions = {
      meta: {
        visual: [
          "Optimize images for mobile viewing as most Meta users browse on mobile devices",
          "Use bright, eye-catching visuals that stand out in social feeds",
          "Ensure your brand colors match your landing page for consistent recognition"
        ],
        contextual: [
          "Include social proof elements like testimonials that appear on your landing page",
          "Match the emotional tone of your ad with your landing page's value proposition",
          "Ensure your CTA button language is consistent between ad and landing page"
        ],
        tone: [
          "Maintain a conversational, social media-friendly tone across touchpoints",
          "Use engaging, scroll-stopping language that matches your landing page personality",
          "Consider the casual browsing context of social media users"
        ]
      },
      tiktok: {
        visual: [
          "Use dynamic, trend-aware visuals that feel native to TikTok",
          "Ensure high contrast and bold text for mobile viewing",
          "Match the energetic visual style with your landing page design"
        ],
        contextual: [
          "Align trending hashtags and concepts with your landing page content",
          "Ensure your value proposition resonates with a younger demographic",
          "Create authentic content that doesn't feel overly promotional"
        ],
        tone: [
          "Use casual, authentic language that feels genuine to TikTok users",
          "Match the creative, playful energy across ad and landing page",
          "Avoid corporate jargon in favor of conversational, relatable messaging"
        ]
      },
      linkedin: {
        visual: [
          "Use professional, clean visuals that convey credibility",
          "Ensure consistent branding with corporate color schemes",
          "Focus on quality imagery that reflects business professionalism"
        ],
        contextual: [
          "Highlight business benefits and ROI in both ad and landing page",
          "Include industry-specific language and pain points",
          "Ensure B2B value propositions are consistently presented"
        ],
        tone: [
          "Maintain professional, authoritative tone across all touchpoints",
          "Use industry expertise and thought leadership language",
          "Focus on business outcomes and professional credibility"
        ]
      },
      google: {
        visual: [
          "Optimize for quick scanning as users often browse search results rapidly",
          "Use clear, high-quality images that support search intent",
          "Ensure visual hierarchy guides users from ad to landing page seamlessly"
        ],
        contextual: [
          "Match ad keywords with prominent landing page content",
          "Ensure search intent aligns with landing page offerings",
          "Create clear conversion paths from ad click to landing page action"
        ],
        tone: [
          "Use direct, solution-focused language that addresses search queries",
          "Maintain consistency in problem-solving approach",
          "Focus on immediate value and clear next steps"
        ]
      },
      reddit: {
        visual: [
          "Use authentic, non-promotional visuals that fit Reddit's community culture",
          "Avoid overly polished imagery in favor of genuine, relatable content",
          "Ensure visuals support community-focused messaging"
        ],
        contextual: [
          "Lead with value and genuine helpfulness rather than direct promotion",
          "Ensure landing page provides real value mentioned in the ad",
          "Focus on community benefit and authentic problem-solving"
        ],
        tone: [
          "Use genuine, community-first language that avoids sales speak",
          "Maintain authentic, helpful tone that respects Reddit culture",
          "Focus on contributing value rather than extracting it"
        ]
      }
    };

    return platformSuggestions[platform as keyof typeof platformSuggestions] || platformSuggestions.meta;
  };

  const mockEvaluateAd = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Import and use the micro-scoring engine
    const { MicroScoringEngine } = await import('../lib/scoring/MicroScoringEngine');
    
    // Get detailed micro-scoring analysis
    const detailedScoring = await MicroScoringEngine.analyzeAd(
      adData.imageUrl || 'https://example.com/ad.jpg',
      landingPageData.url || 'https://example.com',
      adData.platform || 'meta',
      mockIndustry,
      'b2c'
    );

    // Use micro-scoring results for more accurate evaluation
    const overallScore = detailedScoring.overallScore;
    const visualScore = detailedScoring.categoryScores.visual;
    const contextualScore = detailedScoring.categoryScores.content;
    const toneScore = detailedScoring.categoryScores.alignment;
    
    const platformSuggestions = getPlatformSpecificSuggestions(adData.platform || 'meta');
    
    // Mock persuasion principles analysis
    const generateMockPersuasionPrinciples = (): PersuasionPrinciples => {
      const getRandomScore = () => {
        const scores: ('HIGH' | 'MEDIUM' | 'LOW')[] = ['HIGH', 'MEDIUM', 'LOW'];
        const weights = [0.3, 0.5, 0.2]; // More likely to be MEDIUM
        const random = Math.random();
        if (random < weights[0]) return scores[0];
        if (random < weights[0] + weights[1]) return scores[1];
        return scores[2];
      };

      return {
        reciprocity: {
          score: getRandomScore(),
          adAnalysis: "The ad offers a free resource download, creating initial value before asking for contact information.",
          pageAnalysis: "Landing page provides detailed preview of the free content, reinforcing the reciprocity trigger from the ad.",
          recommendation: "Add more free value elements like calculators, templates, or exclusive content to strengthen reciprocity.",
          examples: ["Free PDF download", "No credit card required trial", "Valuable blog content"]
        },
        commitment: {
          score: getRandomScore(),
          adAnalysis: "Ad encourages users to take a small action (sign up), creating initial commitment to the brand.",
          pageAnalysis: "Page builds commitment through progressive engagement but could add more micro-commitments.",
          recommendation: "Add step-by-step onboarding or preference selection to increase commitment consistency.",
          examples: ["Email signup form", "Preference questionnaire", "Goal setting section"]
        },
        socialProof: {
          score: getRandomScore(),
          adAnalysis: "Ad includes customer count or testimonial quote to demonstrate social validation.",
          pageAnalysis: "Landing page displays customer logos, reviews, and usage statistics effectively.",
          recommendation: "Add more specific social proof like 'customers in your industry' or recent customer wins.",
          examples: ["5,000+ happy customers", "Customer testimonials", "Brand logo wall"]
        },
        authority: {
          score: getRandomScore(),
          adAnalysis: "Ad establishes credibility through professional imagery and clear value proposition.",
          pageAnalysis: "Page reinforces authority with team credentials and industry recognition.",
          recommendation: "Highlight more expert credentials, certifications, or media mentions to boost authority.",
          examples: ["Industry certifications", "Expert team profiles", "Media coverage"]
        },
        liking: {
          score: getRandomScore(),
          adAnalysis: "Ad uses relatable imagery and messaging that connects with target audience values.",
          pageAnalysis: "Page maintains friendly, approachable tone that builds connection with visitors.",
          recommendation: "Add more personal elements like founder story or behind-the-scenes content to increase liking.",
          examples: ["Founder photo", "Company values", "Personal testimonials"]
        },
        scarcity: {
          score: getRandomScore(),
          adAnalysis: "Ad creates urgency with limited-time offer or exclusive access messaging.",
          pageAnalysis: "Page reinforces scarcity with countdown timer and limited availability indicators.",
          recommendation: "Add more authentic scarcity elements like limited spots or genuine time constraints.",
          examples: ["Limited time offer", "Only X spots left", "Exclusive beta access"]
        }
      };
    };

    const mockPersuasionPrinciples = generateMockPersuasionPrinciples();
    const mockPersuasionScore = Object.values(mockPersuasionPrinciples).reduce((sum, principle) => {
      const scoreValue = principle.score === 'HIGH' ? 8.5 : principle.score === 'MEDIUM' ? 6.5 : 4;
      return sum + scoreValue;
    }, 0) / 6;

    const mockPsychologicalInsights = [
      `The ad-to-page journey creates ${overallScore >= 7 ? 'strong' : 'moderate'} psychological momentum through effective expectation setting and consistent messaging.`,
      `Social proof elements are ${mockPersuasionPrinciples.socialProof.score === 'HIGH' ? 'well-implemented' : 'underutilized'} and could be a key leverage point for increasing conversions.`,
      `The persuasion flow shows opportunities for stronger reciprocity and commitment triggers to reduce psychological friction.`
    ];
    
    // Mock industry and benchmark data
    const mockIndustry = 'ecommerce'; // In production, this would be detected from landing page
    const mockBenchmarkData = {
      percentile10: 4.2,
      percentile25: 5.1,
      percentile50: 6.3,
      percentile75: 7.4,
      percentile90: 8.1,
      sampleSize: 1000,
      userPercentile: overallScore <= 4.2 ? 10 :
                     overallScore <= 5.1 ? 25 :
                     overallScore <= 6.3 ? 50 :
                     overallScore <= 7.4 ? 75 :
                     overallScore <= 8.1 ? 90 : 95
    };
    
    const mockResults: EvaluationResults = {
      overallScore,
      overallAssessment: overallScore >= 7 ? 'STRONG' : overallScore >= 5 ? 'MODERATE' : 'WEAK',
      executiveSummary: `This ${adData.platform || 'Meta'} ad shows ${overallScore >= 7 ? 'strong' : overallScore >= 5 ? 'moderate' : 'weak'} alignment with the landing page, with key opportunities for optimization in user journey flow and conversion elements.`,
      componentScores: {
        visualMatch: visualScore,
        contextualMatch: contextualScore,
        toneAlignment: toneScore,
        brandCoherence: visualScore,
        userJourneyAlignment: contextualScore,
        conversionOptimization: toneScore
      },
      suggestions: platformSuggestions,
      insights: {
        brandCoherence: "Brand consistency shows promise but could benefit from stronger visual alignment between ad creative and landing page elements.",
        userJourneyAlignment: "The user journey demonstrates reasonable flow, though expectation setting could be enhanced for better conversion rates.",
        conversionOptimization: "Conversion potential is present with strategic optimization opportunities to reduce friction and strengthen persuasion elements."
      },
      strategicRecommendations: [
        {
          priority: "HIGH",
          recommendation: "Strengthen visual consistency between ad creative and landing page design elements",
          expectedImpact: "15-25% improvement in user trust and engagement metrics",
          effort: "MEDIUM"
        },
        {
          priority: "MEDIUM",
          recommendation: "Optimize conversion funnel by reducing cognitive load and clarifying value proposition",
          expectedImpact: "10-18% conversion rate improvement", 
          effort: "MEDIUM"
        }
      ],
      riskFactors: [
        "Potential disconnect between ad promise and landing page delivery could increase bounce rates",
        "Platform-specific optimization gaps may impact algorithm performance and ad costs"
      ],
      missedOpportunities: [
        "Leveraging platform-specific features and user behaviors for enhanced performance",
        "Implementing advanced persuasion techniques to maximize conversion potential"
      ],
      heatmapZones: [
        {
          location: "hero-section",
          description: "Main headline and primary call-to-action area",
          severity: "HIGH",
          issue: "Value proposition may not be immediately clear to visitors from the ad",
          suggestion: "Strengthen headline clarity and CTA prominence to match ad expectations",
          expectedImpact: "15-25% improvement in engagement and click-through rates"
        },
        {
          location: "header",
          description: "Navigation and brand identity area",
          severity: "MEDIUM",
          issue: "Brand consistency could be stronger between ad and landing page header",
          suggestion: "Align navigation styling and brand presentation with ad creative elements",
          expectedImpact: "8-15% reduction in bounce rate"
        },
        {
          location: "cta-button",
          description: "Primary conversion action button",
          severity: "HIGH", 
          issue: "Call-to-action button may lack the visual prominence suggested by the ad",
          suggestion: "Increase button size and contrast to match the expectation set by the ad",
          expectedImpact: "12-20% conversion rate improvement"
        }
      ],
      benchmarkData: mockBenchmarkData,
      detailedScoring: detailedScoring,
      persuasionPrinciples: mockPersuasionPrinciples,
      persuasionScore: mockPersuasionScore,
      psychologicalInsights: mockPsychologicalInsights,
      industry: mockIndustry,
      audienceType: 'b2c',
      performancePrediction: {
        expectedCTR: detailedScoring.performancePrediction.expectedCTR,
        expectedCVR: detailedScoring.performancePrediction.expectedCVR,
        confidenceLevel: detailedScoring.performancePrediction.confidenceLevel
      }
    };
    
    setResults(mockResults);
    setHasEvaluated(true);
  };
  
  const resetEvaluation = () => {
    setAdData({
      imageUrl: null,
      platform: null
    });
    
    setLandingPageData({
      url: null,
      isValidated: false
    });

    setAudienceData({
      ageRange: null,
      gender: null,
      location: '',
      interests: null
    });
    
    setResults(null);
    setHasEvaluated(false);
    setShowFeedbackModal(false);
  };

  const openFeedbackModal = () => {
    setShowFeedbackModal(true);
  };

  const closeFeedbackModal = () => {
    setShowFeedbackModal(false);
  };

  const closeLimitModal = () => {
    setShowLimitModal(false);
  };

  const submitFeedback = async (feedback: any) => {
    try {
      // In a real implementation, this would call an API to store feedback
      console.log('Feedback submitted:', feedback);
      
      // For now, just close the modal
      closeFeedbackModal();
      
      // Could show a success message here
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };
  
  return (
    <AdEvaluationContext.Provider
      value={{
        adData,
        landingPageData,
        audienceData,
        results,
        hasEvaluated,
        showFeedbackModal,
        usageData,
        canPerformEvaluation,
        remainingEvaluations,
        daysUntilReset,
        showLimitModal,
        updateAdData,
        updateLandingPageData,
        updateAudienceData,
        evaluateAd,
        resetEvaluation,
        openFeedbackModal,
        closeFeedbackModal,
        submitFeedback,
        closeLimitModal
      }}
    >
      {children}
    </AdEvaluationContext.Provider>
  );
};

// Custom hook for using the context
export const useAdEvaluation = () => {
  const context = useContext(AdEvaluationContext);
  if (context === undefined) {
    throw new Error('useAdEvaluation must be used within an AdEvaluationProvider');
  }
  return context;
};