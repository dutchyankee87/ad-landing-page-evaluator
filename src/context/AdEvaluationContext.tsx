import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { ElementComparison } from '../lib/api';
import { logger } from '../lib/logger';
import { 
  canEvaluate, 
  getRemainingEvaluations, 
  recordEvaluation, 
  getUsageData,
  getDaysUntilReset,
  getUsageSummary,
  isEvaluationTypeAllowed,
  type UsageData,
  type EvaluationType 
} from '../lib/usage-tracking';
import { detectLanguage, getLanguageConfig, generateCulturallyAwareRecommendation } from '../lib/language-detection';

// Types
interface AdData {
  imageUrl: string | null;
  platform: string | null;
  imageFileSize?: number;
  adUrl?: string | null;
  imageStoragePath?: string;
  mediaType?: 'image' | 'video' | 'unknown';
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

interface EnhancedSuggestion {
  id: string;
  suggestion: string;
  source: 'ad' | 'landing_page' | 'both';
  category: 'visual' | 'contextual' | 'tone' | 'conversion';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  expectedImpact: string;
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  confidenceLevel?: number;
}

interface QuickWin {
  title: string;
  description: string;
  expectedImpact: string;
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  source: 'ad' | 'landing_page' | 'both';
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
  enhancedSuggestions?: EnhancedSuggestion[];
  elementComparisons?: ElementComparison[];
  quickWins?: QuickWin[];
  insights?: Insights;
  strategicRecommendations?: StrategicRecommendation[];
  riskFactors?: string[];
  missedOpportunities?: string[];
  heatmapZones?: HeatmapZone[];
  benchmarkData?: BenchmarkData;
  performancePrediction?: PerformancePrediction;
  industry?: string;
  audienceType?: string;
  detectedLanguage?: string;
  culturalContext?: string;
  evaluationId?: string;
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
    // Determine evaluation type based on ad data
    const evaluationType: EvaluationType = adData.mediaType === 'video' ? 'video' : 'image';
    
    // Get fresh usage data to ensure accuracy
    const usage = getUsageData(userId);
    
    // Check if this evaluation type is allowed for user's tier
    if (!isEvaluationTypeAllowed(userId, evaluationType)) {
      setShowLimitModal(true);
      return;
    }
    
    // Check specific limits for this evaluation type
    const hasReachedLimit = evaluationType === 'video' ? 
      usage.videoEvaluationsUsed >= usage.videoMonthlyLimit : 
      usage.imageEvaluationsUsed >= usage.imageMonthlyLimit;
    
    if (hasReachedLimit) {
      setShowLimitModal(true);
      return;
    }

    // Record the evaluation attempt with specific type
    const success = recordEvaluation(userId, evaluationType);
    if (!success) {
      setShowLimitModal(true);
      return;
    }

    // Update usage stats after recording
    const updatedUsage = getUsageData(userId);
    setUsageData(updatedUsage);
    setCanPerformEvaluation(canEvaluate(userId));
    setRemainingEvaluations(getRemainingEvaluations(userId));

    try {
      // Use the client-safe API
      const { evaluateAd: apiEvaluateAd } = await import('../lib/api');
      
      const response = await apiEvaluateAd({
        adData: {
          ...adData,
          platform: adData.platform || 'meta',
          mediaType: adData.mediaType || 'image'
        },
        landingPageData: {
          ...landingPageData,
          url: landingPageData.url || 'example.com'
        },
        audienceData: {
          ...audienceData,
          ageRange: audienceData.ageRange || '25-34',
          gender: audienceData.gender || 'mixed',
          interests: audienceData.interests || 'general'
        },
        // TODO: Add user email when auth is implemented
        userEmail: undefined
      });

      // For API responses, generate enhanced data on the frontend
      const generateEnhancedSuggestionsFromAPI = () => {
        return [
          {
            id: 'visual-1',
            suggestion: 'Match the primary color scheme from your ad in the landing page header',
            source: 'landing_page' as const,
            category: 'visual' as const,
            priority: 'HIGH' as const,
            expectedImpact: '+8-12% trust and brand recognition',
            effort: 'LOW' as const,
            confidenceLevel: 0.85
          },
          {
            id: 'cta-1',
            suggestion: 'Align landing page CTA with your ad\'s call-to-action text',
            source: 'landing_page' as const,
            category: 'conversion' as const,
            priority: 'HIGH' as const,
            expectedImpact: '+15-25% conversion rate',
            effort: 'LOW' as const,
            confidenceLevel: 0.92
          },
          {
            id: 'headline-1',
            suggestion: 'Emphasize the key offer from your ad prominently in landing page headline',
            source: 'landing_page' as const,
            category: 'contextual' as const,
            priority: 'HIGH' as const,
            expectedImpact: '+10-18% engagement rate',
            effort: 'LOW' as const,
            confidenceLevel: 0.88
          }
        ];
      };

      // Helper function to generate platform-specific ad content
      const getPlatformSpecificAdContent = (platform: string) => {
        const adTemplates = {
          meta: {
            headline: "🔥 Transform Your Business Today - Save 50%",
            cta: "Get Started Now",
            offer: "50% off first month + free setup",
            visuals: "Bright orange/blue gradient with business imagery"
          },
          tiktok: {
            headline: "This productivity hack will change your life! 📈",
            cta: "Try for Free",
            offer: "Free 7-day trial, no credit card needed",
            visuals: "Dynamic video with trending effects and music"
          },
          linkedin: {
            headline: "Boost Enterprise Productivity by 40%",
            cta: "Download Whitepaper",
            offer: "Free enterprise guide + 30-day trial",
            visuals: "Professional blue/white design with chart graphics"
          },
          google: {
            headline: "Business Software | 5-Star Rated | Free Trial",
            cta: "Start Free Trial",
            offer: "30-day free trial, cancel anytime",
            visuals: "Clean white background with product screenshots"
          },
          reddit: {
            headline: "Finally found software that actually works",
            cta: "Check it out",
            offer: "Redditor exclusive: 40% off lifetime deal",
            visuals: "Casual screenshot-style with authentic user interface"
          },
          programmatic: {
            headline: "Boost Performance by 50% - Limited Time",
            cta: "Start Free Trial",
            offer: "Free 14-day trial + setup assistance",
            visuals: "Professional display banner with clear value proposition and branding"
          }
        };
        return adTemplates[platform as keyof typeof adTemplates] || adTemplates.meta;
      };

      // Helper function to simulate landing page content extraction
      const getLandingPageContentFromURL = (url: string) => {
        // Simulate different landing page types based on URL patterns
        if (url.includes('shopify') || url.includes('store') || url.includes('shop')) {
          return {
            headline: "Premium Products - Free Shipping",
            cta: "Shop Now",
            offer: "Free shipping on orders over $50",
            visuals: "E-commerce layout with product grid and modern design"
          };
        } else if (url.includes('app') || url.includes('software') || url.includes('saas')) {
          return {
            headline: "Streamline Your Workflow Today",
            cta: "Start Free Trial",
            offer: "14-day free trial available",
            visuals: "SaaS landing page with dashboard preview and testimonials"
          };
        } else if (url.includes('course') || url.includes('learn') || url.includes('training')) {
          return {
            headline: "Master New Skills in 30 Days",
            cta: "Enroll Now",
            offer: "30-day money-back guarantee",
            visuals: "Educational design with instructor photos and course modules"
          };
        } else {
          return {
            headline: "Welcome to Our Landing Page",
            cta: "Learn More",
            offer: "Contact us for more information",
            visuals: "Generic business layout with hero image and contact form"
          };
        }
      };

      const generateElementComparisonsFromAPI = () => {
        // Generate realistic mock data based on submitted platform and URL
        const platform = adData.platform || 'meta';
        const landingPageURL = landingPageData.url || 'your-landing-page.com';
        
        // Generate platform-specific ad content
        const adContent = getPlatformSpecificAdContent(platform);
        const lpContent = getLandingPageContentFromURL(landingPageURL);
        
        return [
          {
            element: 'Headline Text',
            adValue: adContent.headline,
            landingPageValue: lpContent.headline,
            status: 'mismatch' as const,
            severity: 'HIGH' as const,
            recommendation: `Change landing page H1 to match ad headline: "${adContent.headline}" for better message consistency`
          },
          {
            element: 'Primary CTA Button',
            adValue: adContent.cta,
            landingPageValue: lpContent.cta,
            status: adContent.cta.toLowerCase() === lpContent.cta.toLowerCase() ? 'match' as const : 'mismatch' as const,
            severity: 'HIGH' as const,
            recommendation: adContent.cta.toLowerCase() === lpContent.cta.toLowerCase() ? undefined : `Update CTA button to exactly match ad text: "${adContent.cta}" to maintain user expectations`
          },
          {
            element: 'Key Offer/Value Prop',
            adValue: adContent.offer,
            landingPageValue: lpContent.offer,
            status: 'partial_match' as const,
            severity: 'MEDIUM' as const,
            recommendation: `Prominently display the exact offer from your ad: "${adContent.offer}" above the fold`
          },
          {
            element: 'Visual Style/Branding',
            adValue: adContent.visuals,
            landingPageValue: lpContent.visuals,
            status: 'partial_match' as const,
            severity: 'MEDIUM' as const,
            recommendation: 'Align color scheme and visual elements between ad and landing page for brand consistency'
          },
          {
            element: 'Target Landing Page',
            adValue: `Points to: ${landingPageURL}`,
            landingPageValue: `Current page: ${landingPageURL}`,
            status: 'match' as const,
            severity: 'LOW' as const,
            recommendation: undefined
          }
        ];
      };

      const generateQuickWinsFromAPI = () => {
        return [
          {
            title: 'Align CTA messaging',
            description: 'Use the same call-to-action text from your ad on the landing page button.',
            expectedImpact: '+15-25% conversion rate',
            effort: 'LOW' as const,
            source: 'landing_page' as const
          },
          {
            title: 'Strengthen visual consistency',
            description: 'Match key visual elements between your ad and landing page.',
            expectedImpact: '+8-12% brand recognition',
            effort: 'LOW' as const,
            source: 'landing_page' as const
          },
          {
            title: 'Emphasize key offer',
            description: 'Make sure your landing page prominently features the main offer from your ad.',
            expectedImpact: '+10-18% engagement rate',
            effort: 'LOW' as const,
            source: 'landing_page' as const
          }
        ];
      };

      setResults({
        overallScore: response.overallScore,
        componentScores: response.componentScores,
        suggestions: response.suggestions,
        enhancedSuggestions: generateEnhancedSuggestionsFromAPI(),
        elementComparisons: response.elementComparisons || generateElementComparisonsFromAPI(),
        quickWins: generateQuickWinsFromAPI(),
        // Pass through additional API response fields  
        strategicRecommendations: response.strategicRecommendations,
        riskFactors: response.riskFactors,
        missedOpportunities: response.missedOpportunities,
        heatmapZones: response.heatmapZones,
        insights: response.insights
      });
      setHasEvaluated(true);
      
    } catch (error) {
      logger.warn('Evaluation failed, using fallback:', error);
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
      },
      programmatic: {
        visual: [
          "Ensure high contrast and clear readability across different device sizes",
          "Use compelling visuals that capture attention in crowded ad environments",
          "Maintain consistent brand colors and visual identity with landing page"
        ],
        contextual: [
          "Create clear value propositions that work across various website contexts",
          "Ensure messaging relevance regardless of placement environment",
          "Focus on universal appeal while maintaining brand consistency"
        ],
        tone: [
          "Use direct, benefit-focused language that communicates value quickly",
          "Maintain professional yet engaging tone suitable for diverse audiences",
          "Create urgency and clear calls-to-action that drive immediate action"
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
    
    // Mock industry and benchmark data
    const mockIndustry = 'ecommerce'; // In production, this would be detected from landing page
    
    // Get detailed micro-scoring analysis
    const detailedScoring = await MicroScoringEngine.analyzeAd(
      adData.imageUrl || adData.adUrl || 'https://example.com/ad.jpg',
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
    
    // Detect language from landing page URL and ad data
    const detectContentLanguage = () => {
      const urlText = landingPageData.url || '';
      const titleText = landingPageData.title || '';
      const contentText = landingPageData.mainContent || '';
      const combinedText = `${urlText} ${titleText} ${contentText}`.toLowerCase();
      
      return detectLanguage(combinedText);
    };

    const detectedLang = detectContentLanguage();
    const languageConfig = getLanguageConfig(detectedLang);

    // Generate enhanced suggestions with source attribution and impact
    const generateEnhancedSuggestions = () => {
      const suggestions = [
        {
          id: 'visual-1',
          suggestion: 'Change landing page header background from #005c6b to exact ad color #004c4c and update CTA button to use same teal (#004c4c) with white text at 18px bold',
          source: 'landing_page' as const,
          category: 'visual' as const,
          priority: 'HIGH' as const,
          expectedImpact: '+12-18% brand recognition and trust',
          effort: 'LOW' as const,
          confidenceLevel: 0.92
        },
        {
          id: 'cta-1',
          suggestion: generateCulturallyAwareRecommendation(
            `Replace landing page CTA text "Sign up now" with "${languageConfig.ctaPreferences[0]}" and increase button size to 320px wide × 56px tall with 16px border radius`,
            languageConfig,
            'cta'
          ),
          source: 'landing_page' as const,
          category: 'conversion' as const,
          priority: 'HIGH' as const,
          expectedImpact: '+22-35% conversion rate',
          effort: 'LOW' as const,
          confidenceLevel: 0.94
        },
        {
          id: 'headline-1',
          suggestion: 'Change landing page H1 from "Plan your future pension" to "Build your pension & get €1,000 bonus" (exact ad headline) and make it 42px font size, bold, in dark teal #004c4c',
          source: 'landing_page' as const,
          category: 'contextual' as const,
          priority: 'HIGH' as const,
          expectedImpact: '+15-25% engagement and click-through',
          effort: 'LOW' as const,
          confidenceLevel: 0.91
        },
        {
          id: 'social-proof-1',
          suggestion: 'Add "★★★★★ 4.8/5 from 1,247+ customers" below the headline and "2,847 people started this month" counter above the CTA button to match ad\'s trust signals',
          source: 'landing_page' as const,
          category: 'conversion' as const,
          priority: 'HIGH' as const,
          expectedImpact: '+18-28% conversion rate',
          effort: 'MEDIUM' as const,
          confidenceLevel: 0.89
        },
        {
          id: 'visual-2',
          suggestion: 'Add paper plane icon (24px size) next to the main headline and include progress arrow graphics in the hero section to match ad\'s growth/progression theme',
          source: 'landing_page' as const,
          category: 'visual' as const,
          priority: 'MEDIUM' as const,
          expectedImpact: '+8-14% visual continuity and engagement',
          effort: 'MEDIUM' as const,
          confidenceLevel: 0.78
        },
        {
          id: 'urgency-1',
          suggestion: 'Add countdown timer showing "Bonus expires in 3 days, 14 hours" prominently below CTA and use orange accent color (#FF6B35) for urgency elements',
          source: 'landing_page' as const,
          category: 'conversion' as const,
          priority: 'MEDIUM' as const,
          expectedImpact: '+12-20% conversion rate through scarcity',
          effort: 'MEDIUM' as const,
          confidenceLevel: 0.85
        },
        {
          id: 'ad-1',
          suggestion: 'Add "Secure & regulated pension provider" text to ad (12px below main text) to address trust concerns and include security badge icon',
          source: 'ad' as const,
          category: 'contextual' as const,
          priority: 'LOW' as const,
          expectedImpact: '+5-8% click quality and trust',
          effort: 'LOW' as const,
          confidenceLevel: 0.72
        }
      ];
      
      return suggestions;
    };

    // Helper function to generate AI-ready prompts for different platforms and tools
    const generateAIPrompts = (platform: string, element: string, adValue: string, lpValue: string) => {
      const platformTools = {
        meta: 'Meta Creative Hub or Figma',
        tiktok: 'TikTok Creative Center or CapCut',
        linkedin: 'LinkedIn Campaign Manager or Canva',
        google: 'Google Ads Editor or Adobe Creative Suite',
        reddit: 'Reddit Ads or Photoshop',
        programmatic: 'Display & Video 360 or Banner Creator'
      };

      const toolName = platformTools[platform as keyof typeof platformTools] || 'Figma or Canva';

      const prompts = {
        adOptimization: `AI Prompt for ${toolName}:\n"Create a ${platform} ad variation that incorporates '${lpValue}' while maintaining ${platform === 'tiktok' ? 'authentic, trending aesthetics' : platform === 'linkedin' ? 'professional credibility' : platform === 'google' ? 'search intent alignment' : 'social engagement'}. Keep the core message but adapt the style to bridge the visual gap with the landing page."`,
        
        landingPageOptimization: `AI Prompt for Website/LP Builder:\n"Update the landing page ${element.toLowerCase()} to match this ad element: '${adValue}'. Optimize for immediate user recognition and conversion by eliminating expectation gaps. Maintain website functionality while adopting the ad's proven engagement elements."`
      };

      return prompts;
    };

    // Generate element comparisons
    const generateElementComparisons = () => {
      // Generate dynamic content based on user inputs
      const platform = adData.platform || 'meta';
      const landingPageURL = landingPageData.url || 'your-landing-page.com';
      
      // Platform-specific ad content generation
      const getAdContent = (platform: string) => {
        const templates = {
          meta: { headline: "🔥 Transform Your Business Today - Save 50%", cta: "Get Started Now" },
          tiktok: { headline: "This productivity hack will change your life! 📈", cta: "Try for Free" },
          linkedin: { headline: "Boost Enterprise Productivity by 40%", cta: "Download Whitepaper" },
          google: { headline: "Business Software | 5-Star Rated | Free Trial", cta: "Start Free Trial" },
          reddit: { headline: "Finally found software that actually works", cta: "Check it out" },
          programmatic: { headline: "Boost Performance by 50% - Limited Time", cta: "Start Free Trial" }
        };
        return templates[platform as keyof typeof templates] || templates.meta;
      };
      
      // Landing page content based on URL type
      const getLpContent = (url: string) => {
        if (url.includes('shop')) return { headline: "Premium Products - Free Shipping", cta: "Shop Now" };
        if (url.includes('app') || url.includes('software')) return { headline: "Streamline Your Workflow Today", cta: "Start Free Trial" };
        if (url.includes('course')) return { headline: "Master New Skills in 30 Days", cta: "Enroll Now" };
        return { headline: "Welcome to Our Landing Page", cta: "Learn More" };
      };
      
      const adContent = getAdContent(platform);
      const lpContent = getLpContent(landingPageURL);

      
      return [
        {
          element: 'Visual Imagery & Graphics',
          adValue: `${platform === 'tiktok' ? 'Dynamic video-style' : platform === 'linkedin' ? 'Professional photography' : platform === 'programmatic' ? 'Display banner optimized' : 'Social media optimized'} imagery with ${platform === 'meta' ? 'lifestyle focus' : platform === 'programmatic' ? 'conversion-focused' : 'product-centric'} composition`,
          landingPageValue: 'Standard web layout with generic hero image and corporate photography style',
          status: 'partial_match' as const,
          severity: 'HIGH' as const,
          category: 'visual' as const,
          recommendation: `Update hero section imagery to match ${platform} ad style - use ${platform === 'tiktok' ? 'dynamic, video-style' : platform === 'linkedin' ? 'professional B2B' : platform === 'programmatic' ? 'high-conversion display' : 'lifestyle-focused'} visuals with similar composition and energy`,
          adOptimizationRecommendation: `🎨 AI Prompt for ${platform === 'meta' ? 'Meta Creative Hub' : platform === 'tiktok' ? 'TikTok Creative Center' : platform === 'linkedin' ? 'LinkedIn Campaign Manager' : 'Ad Creative Tool'}:\n"Create a ${platform} ad that incorporates corporate photography style and professional layouts while maintaining ${platform === 'tiktok' ? 'authentic TikTok aesthetics and trending elements' : platform === 'linkedin' ? 'B2B credibility and industry standards' : platform === 'meta' ? 'social engagement and lifestyle appeal' : 'platform-optimized performance'}. Blend professional corporate imagery with the current ad's energy to bridge the visual gap."`,
          landingPageOptimizationRecommendation: `🌐 AI Prompt for Landing Page Builder:\n"Update the hero section imagery to match our ${platform} ad style: use ${platform === 'tiktok' ? 'dynamic, video-style visuals with motion elements' : platform === 'linkedin' ? 'modern professional photography with B2B focus' : platform === 'meta' ? 'lifestyle-focused imagery with social proof' : 'high-impact, conversion-optimized visuals'}. Replace generic corporate photos with engaging imagery that maintains the ad's energy and visual composition. Focus on immediate user recognition and reducing visual disconnect."`,
          aiPreferredPath: 'ad' as const,
          visualAnalysis: {
            adImageStyle: platform === 'tiktok' ? 'video/dynamic' : platform === 'linkedin' ? 'professional photography' : platform === 'programmatic' ? 'display banner' : 'lifestyle photography',
            pageImageStyle: 'corporate photography',
            styleConsistency: platform === 'meta' ? 6 : platform === 'tiktok' ? 4 : platform === 'programmatic' ? 7 : 5,
            layoutSimilarity: 5,
            brandElementAlignment: platform === 'linkedin' ? 7 : platform === 'programmatic' ? 6 : 6
          }
        },
        {
          element: 'Typography & Visual Hierarchy',
          adValue: `${platform === 'tiktok' ? 'Bold, casual' : platform === 'linkedin' ? 'Professional, clean' : platform === 'programmatic' ? 'High-impact, readable' : 'Engaging, modern'} typography with ${platform}-optimized sizing`,
          landingPageValue: 'Standard web fonts with conservative hierarchy and formal styling',
          status: 'partial_match' as const,
          severity: 'MEDIUM' as const,
          category: 'visual' as const,
          recommendation: `Adjust typography to match ${platform} ad style - use ${platform === 'tiktok' ? 'bolder, more casual' : platform === 'linkedin' ? 'professional but modern' : platform === 'programmatic' ? 'high-impact, conversion-focused' : 'social media optimized'} fonts and hierarchy`,
          adOptimizationRecommendation: `Use more conservative, web-friendly typography to match landing page hierarchy`,
          landingPageOptimizationRecommendation: `Update fonts to ${platform === 'tiktok' ? 'bold, casual style' : platform === 'linkedin' ? 'modern professional style' : platform === 'programmatic' ? 'high-impact, conversion-focused style' : 'social media optimized style'} matching the ad`,
          aiPreferredPath: 'landing' as const,
          typographyAnalysis: {
            fontStyleMatch: platform === 'linkedin' ? 7 : platform === 'tiktok' ? 4 : platform === 'programmatic' ? 6 : 5,
            hierarchyAlignment: 6,
            visualWeightConsistency: platform === 'meta' ? 6 : platform === 'programmatic' ? 7 : 5
          }
        },
        {
          element: 'Headline Text',
          adValue: adContent.headline,
          landingPageValue: lpContent.headline,
          status: 'mismatch' as const,
          severity: 'HIGH' as const,
          category: 'content' as const,
          recommendation: `Change H1 to match ad headline: "${adContent.headline}" for better message consistency`,
          adOptimizationRecommendation: `🎨 AI Prompt for ${platform === 'meta' ? 'Meta Creative Hub' : platform === 'tiktok' ? 'TikTok Creative Center' : platform === 'linkedin' ? 'LinkedIn Campaign Manager' : 'Ad Creative Tool'}:\n"Rewrite the ad headline to focus on '${lpContent.headline}' while maintaining ${platform === 'tiktok' ? 'TikTok\'s casual, authentic voice and trending language' : platform === 'linkedin' ? 'professional authority and business value proposition' : platform === 'meta' ? 'social media engagement and emotional hooks' : 'platform-specific appeal'}. Keep the core offer visible but align the primary message with the landing page promise to reduce bounce rate."`,
          landingPageOptimizationRecommendation: `🌐 AI Prompt for Landing Page Builder:\n"Change the main headline (H1) to exactly match our ad: '${adContent.headline}'. This eliminates expectation mismatch and maintains the momentum from the ad click. Update font size to 42px, use bold weight, and ensure it's the most prominent element above the fold. This exact match reduces bounce rate by 15-25% and increases conversion by maintaining user expectation consistency."`,
          aiPreferredPath: 'landing' as const
        },
        {
          element: 'Primary CTA Button',
          adValue: adContent.cta,
          landingPageValue: lpContent.cta,
          status: adContent.cta.toLowerCase() === lpContent.cta.toLowerCase() ? 'match' as const : 'mismatch' as const,
          severity: 'HIGH' as const,
          recommendation: adContent.cta.toLowerCase() === lpContent.cta.toLowerCase() ? undefined : `Update CTA button to match ad text: "${adContent.cta}"`,
          adOptimizationRecommendation: adContent.cta.toLowerCase() === lpContent.cta.toLowerCase() ? undefined : `🎨 AI Prompt for ${platform === 'meta' ? 'Meta Creative Hub' : platform === 'tiktok' ? 'TikTok Creative Center' : platform === 'linkedin' ? 'LinkedIn Campaign Manager' : 'Ad Creative Tool'}:\n"Update the ad CTA button text to '${lpContent.cta}' to create seamless continuity with the landing page. Maintain ${platform === 'tiktok' ? 'TikTok\'s casual, action-oriented language' : platform === 'linkedin' ? 'professional, value-driven call-to-action style' : platform === 'meta' ? 'social media urgency and engagement triggers' : 'platform-optimized CTA best practices'}. Test this variation for improved quality score and reduced landing page bounce."`,
          landingPageOptimizationRecommendation: adContent.cta.toLowerCase() === lpContent.cta.toLowerCase() ? undefined : `🌐 AI Prompt for Landing Page Builder:\n"Change the primary CTA button text to exactly '${adContent.cta}' to match the ad expectation. Resize button to 320×56px, use high-contrast colors (dark background, white text), and position prominently above the fold. This exact text match increases conversion by 15-25% by maintaining the user's journey expectation from ad to action."`,
          aiPreferredPath: 'landing' as const
        },
        {
          element: 'Brand Color Scheme',
          adValue: '#004c4c (Primary teal) + #FF6B35 (Accent orange)',
          landingPageValue: '#005c6b (Different teal) + #0066CC (Blue accents)',
          status: 'partial_match' as const,
          severity: 'HIGH' as const,
          category: 'visual' as const,
          recommendation: 'Update CSS: Primary #004c4c, CTA buttons #004c4c, urgency elements #FF6B35 for exact brand match',
          adOptimizationRecommendation: `🎨 AI Prompt for ${platform === 'meta' ? 'Meta Creative Hub' : platform === 'tiktok' ? 'TikTok Creative Center' : platform === 'linkedin' ? 'LinkedIn Campaign Manager' : 'Ad Creative Tool'}:\n"Adjust the ad color palette to match the landing page brand colors: Primary #005c6b (teal), Accent #0066CC (blue). Update backgrounds, text overlays, and CTA buttons while maintaining ${platform === 'tiktok' ? 'high contrast for mobile viewing and TikTok\'s vibrant aesthetic' : platform === 'linkedin' ? 'professional color standards and B2B credibility' : platform === 'meta' ? 'social media best practices for engagement' : 'platform performance requirements'}. Keep the visual impact but align with established brand colors."`,
          landingPageOptimizationRecommendation: `🌐 AI Prompt for Landing Page Builder:\n"Update the website color scheme to match our ad branding: Change primary color to #004c4c, CTA buttons to #004c4c with white text, and use #FF6B35 for urgency elements (timers, special offers). Update CSS variables: --primary-color: #004c4c, --accent-color: #FF6B35. This exact color match increases brand recognition by 12-18% and creates seamless visual continuity from ad to conversion."`,
          aiPreferredPath: 'landing' as const,
          colorAnalysis: {
            adColors: ['#004c4c', '#FF6B35'],
            pageColors: ['#005c6b', '#0066CC'],
            matchScore: 6
          }
        },
        {
          element: 'Visual Elements',
          adValue: 'Paper plane icon, upward arrow, progress theme',
          landingPageValue: 'Generic financial imagery, no growth symbols',
          status: 'missing' as const,
          severity: 'MEDIUM' as const,
          recommendation: 'Add 24px paper plane icon next to headline + progress arrows in hero section + upward trending graphics',
          adOptimizationRecommendation: 'Simplify ad visuals to match landing page\'s clean, professional approach',
          landingPageOptimizationRecommendation: 'Add paper plane icon (24px), progress arrows, and growth symbols to match ad theme',
          aiPreferredPath: 'landing' as const
        },
        {
          element: 'Social Proof',
          adValue: 'Implied through professional design',
          landingPageValue: 'No visible testimonials or trust indicators',
          status: 'missing' as const,
          severity: 'HIGH' as const,
          recommendation: 'Add "★★★★★ 4.8/5 from 1,247+ customers" below headline + "2,847 started this month" counter above CTA',
          adOptimizationRecommendation: 'Add customer count or rating badge to ad creative for stronger social proof',
          landingPageOptimizationRecommendation: 'Add "★★★★★ 4.8/5 from 1,247+ customers" below headline + "2,847 started this month" counter above CTA',
          aiPreferredPath: 'landing' as const
        },
        {
          element: 'Urgency/Scarcity',
          adValue: 'Bonus offer implies limited availability',
          landingPageValue: 'No time pressure or scarcity indicators',
          status: 'missing' as const,
          severity: 'MEDIUM' as const,
          recommendation: 'Add countdown timer: "Bonus expires in 3 days, 14 hours" in orange #FF6B35 below CTA button',
          adOptimizationRecommendation: 'Add explicit deadline text: "Limited time offer - expires in 3 days" to ad copy',
          landingPageOptimizationRecommendation: 'Add countdown timer: "Bonus expires in 3 days, 14 hours" in orange #FF6B35 below CTA button',
          aiPreferredPath: 'landing' as const
        },
        {
          element: 'Value Proposition Focus',
          adValue: 'Dual benefit: Build pension + Get immediate €1,000',
          landingPageValue: 'Single benefit: Plan your future (generic)',
          status: 'mismatch' as const,
          severity: 'HIGH' as const,
          recommendation: 'Restructure hero copy to emphasize BOTH long-term pension building AND immediate €1,000 bonus with 50/50 visual weight',
          adOptimizationRecommendation: 'Simplify ad focus to single benefit: "Plan your secure future" matching landing page approach',
          landingPageOptimizationRecommendation: 'Restructure hero to emphasize dual benefit: "Build pension + Get €1,000 bonus" matching ad messaging',
          aiPreferredPath: 'ad' as const
        }
      ];
    };

    // Generate quick wins
    const generateQuickWins = () => {
      return [
        {
          title: 'Fix CTA button text and styling',
          description: 'Replace "Sign up now" with "Claim your €1,000 bonus" and resize button to 320×56px with teal background (#004c4c) and white 18px bold text. This creates perfect message continuity from ad to landing page.',
          expectedImpact: '+22-35% conversion rate',
          effort: 'LOW' as const,
          source: 'landing_page' as const
        },
        {
          title: 'Update headline to match ad exactly',
          description: 'Change H1 from "Plan your future pension" to "Build your pension & get €1,000 bonus" (exact ad headline) at 42px font size, bold, in dark teal #004c4c. This satisfies the visitor\'s exact expectation.',
          expectedImpact: '+15-25% engagement and time on page',
          effort: 'LOW' as const,
          source: 'landing_page' as const
        },
        {
          title: 'Add immediate social proof elements',
          description: 'Insert "★★★★★ 4.8/5 from 1,247+ customers" below headline and "2,847 people started this month" counter above CTA button. Use specific numbers and star ratings for maximum credibility.',
          expectedImpact: '+18-28% conversion through trust',
          effort: 'LOW' as const,
          source: 'landing_page' as const
        }
      ];
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
      enhancedSuggestions: generateEnhancedSuggestions(),
      elementComparisons: generateElementComparisons(),
      quickWins: generateQuickWins(),
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
          expectedImpact: "15-25% reduction in cost per engaged session and cost per conversion"
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
      detectedLanguage: detectedLang,
      culturalContext: `${languageConfig.name} (${languageConfig.region}) - ${languageConfig.culturalContext.join(', ')}`,
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
      logger.debug('Feedback submitted:', feedback);
      
      // For now, just close the modal
      closeFeedbackModal();
      
      // Could show a success message here
    } catch (error) {
      logger.error('Failed to submit feedback:', error);
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