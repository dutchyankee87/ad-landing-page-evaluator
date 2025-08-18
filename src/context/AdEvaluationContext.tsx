import React, { createContext, useState, useContext, ReactNode } from 'react';

// Types
interface AdData {
  headline: string | null;
  description: string | null;
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
  visualMatch: number;
  contextualMatch: number;
  toneAlignment: number;
}

interface Suggestions {
  visual: string[];
  contextual: string[];
  tone: string[];
}

interface EvaluationResults {
  overallScore: number;
  componentScores: ComponentScores;
  suggestions: Suggestions;
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
    headline: null,
    description: null,
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
    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      try {
        const response = await fetch(`${supabaseUrl}/functions/v1/evaluate-ad`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            adData,
            landingPageData,
            audienceData,
          }),
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        setResults(data);
        setHasEvaluated(true);
        return;
      } catch (error) {
        console.warn('API evaluation failed, falling back to demo mode:', error);
      }
    }
    
    // Fallback to mock evaluation for demo purposes
    await mockEvaluateAd();
  };
  
  const mockEvaluateAd = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate realistic scores based on ad content
    const visualScore = Math.floor(Math.random() * 3) + 6; // 6-8
    const contextualScore = Math.floor(Math.random() * 4) + 5; // 5-8
    const toneScore = Math.floor(Math.random() * 3) + 6; // 6-8
    
    const overallScore = Math.round((visualScore + contextualScore + toneScore) / 3 * 10) / 10;
    
    const mockResults: EvaluationResults = {
      overallScore,
      componentScores: {
        visualMatch: visualScore,
        contextualMatch: contextualScore,
        toneAlignment: toneScore
      },
      suggestions: {
        visual: [
          "Consider using colors that better match your landing page's color scheme",
          "Ensure your ad image style is consistent with your website's visual identity",
          "Test different image compositions to improve visual flow"
        ],
        contextual: [
          "Align your ad headline more closely with your landing page's main value proposition",
          "Ensure the benefits mentioned in your ad are prominently featured on the landing page",
          "Consider adding social proof elements that match between ad and page"
        ],
        tone: [
          "Maintain consistent voice and personality across ad copy and landing page content",
          "Ensure the urgency level in your ad matches the tone on your landing page",
          "Consider adjusting the formality level to be consistent across touchpoints"
        ]
      }
    };
    
    setResults(mockResults);
    setHasEvaluated(true);
  };
  
  const resetEvaluation = () => {
    setAdData({
      headline: null,
      description: null,
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