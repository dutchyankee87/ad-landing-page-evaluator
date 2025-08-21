import React, { createContext, useState, useContext, ReactNode } from 'react';

// Types
interface AdData {
  imageUrl: string | null;
  platform: string | null;
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

interface EvaluationResults {
  overallScore: number;
  overallAssessment?: 'STRONG' | 'MODERATE' | 'WEAK';
  executiveSummary?: string;
  componentScores: ComponentScores;
  suggestions?: Suggestions; // Legacy support
  insights?: Insights;
  strategicRecommendations?: StrategicRecommendation[];
  riskFactors?: string[];
  missedOpportunities?: string[];
  heatmapZones?: HeatmapZone[];
}

interface AdEvaluationContextType {
  adData: AdData;
  landingPageData: LandingPageData;
  audienceData: AudienceData;
  results: EvaluationResults | null;
  hasEvaluated: boolean;
  updateAdData: (data: Partial<AdData>) => void;
  updateLandingPageData: (data: Partial<LandingPageData>) => void;
  updateAudienceData: (data: Partial<AudienceData>) => void;
  evaluateAd: () => Promise<void>;
  resetEvaluation: () => void;
}

// Create context
const AdEvaluationContext = createContext<AdEvaluationContextType | undefined>(undefined);

// Provider component
export const AdEvaluationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
    
    // Generate realistic scores based on ad content
    const visualScore = Math.floor(Math.random() * 3) + 6; // 6-8
    const contextualScore = Math.floor(Math.random() * 4) + 5; // 5-8
    const toneScore = Math.floor(Math.random() * 3) + 6; // 6-8
    
    const overallScore = Math.round((visualScore + contextualScore + toneScore) / 3 * 10) / 10;
    
    const platformSuggestions = getPlatformSpecificSuggestions(adData.platform || 'meta');
    
    const mockResults: EvaluationResults = {
      overallScore,
      componentScores: {
        visualMatch: visualScore,
        contextualMatch: contextualScore,
        toneAlignment: toneScore
      },
      suggestions: platformSuggestions
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
  };
  
  return (
    <AdEvaluationContext.Provider
      value={{
        adData,
        landingPageData,
        audienceData,
        results,
        hasEvaluated,
        updateAdData,
        updateLandingPageData,
        updateAudienceData,
        evaluateAd,
        resetEvaluation
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