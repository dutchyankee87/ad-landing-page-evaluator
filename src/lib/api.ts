// Client-side API wrapper that works in both development and production
// Using direct HTTP calls to avoid Supabase client import issues

import { logger } from './logger';

// Types for API responses
export interface EvaluationRequest {
  adData: {
    imageUrl?: string | null;
    adUrl?: string | null;
    platform: string;
    imageFileSize?: number;
    mediaType?: 'image' | 'video' | 'unknown';
  };
  landingPageData: {
    url: string;
    title?: string;
    mainContent?: string;
    ctaText?: string;
  };
  audienceData: {
    ageRange: string;
    gender: string;
    location?: string;
    interests: string;
  };
  userEmail?: string;
}

export interface ElementComparison {
  element: string;
  adValue: string;
  landingPageValue: string;
  status: 'match' | 'mismatch' | 'partial_match' | 'missing';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation?: string; // Legacy support - general recommendation
  adOptimizationRecommendation?: string; // Recommendation for optimizing the ad
  landingPageOptimizationRecommendation?: string; // Recommendation for optimizing the landing page
  aiPreferredPath?: 'ad' | 'landing'; // Which path AI recommends
  category?: 'content' | 'visual' | 'emotional' | 'trust' | 'mobile';
  colorAnalysis?: {
    adColors: string[];
    pageColors: string[];
    matchScore: number;
  };
  emotionalTone?: {
    adTone: string;
    pageTone: string;
    alignment: number;
  };
  trustSignals?: {
    adSignals: string[];
    pageSignals: string[];
    credibilityGap: string;
  };
  mobileOptimization?: {
    adMobileFriendly: boolean;
    pageMobileFriendly: boolean;
    consistencyScore: number;
  };
  visualAnalysis?: {
    adImageStyle: string;
    pageImageStyle: string;
    styleConsistency: number;
    layoutSimilarity: number;
    brandElementAlignment: number;
  };
  typographyAnalysis?: {
    fontStyleMatch: number;
    hierarchyAlignment: number;
    visualWeightConsistency: number;
  };
}

export interface StrategicRecommendation {
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation: string;
  expectedImpact: string;
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface HeatmapZone {
  location: string;
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  issue: string;
  suggestion: string;
  expectedImpact: string;
}

export interface EvaluationResponse {
  overallScore: number;
  componentScores: {
    visualMatch?: number;
    contextualMatch?: number;
    toneAlignment?: number;
    brandCoherence?: number;
    userJourneyAlignment?: number;
    conversionOptimization?: number;
  };
  suggestions?: {
    visual: string[];
    contextual: string[];
    tone: string[];
  };
  elementComparisons?: ElementComparison[];
  strategicRecommendations?: StrategicRecommendation[];
  riskFactors?: string[];
  missedOpportunities?: string[];
  heatmapZones?: HeatmapZone[];
  insights?: {
    brandCoherence?: string;
    userJourneyAlignment?: string;
    conversionOptimization?: string;
  };
}

export interface UsageInfo {
  used: number;
  limit: number;
  remaining: number;
  canEvaluate: boolean;
  nextReset: string;
  tier?: 'free' | 'pro' | 'enterprise';
  ipAddress?: string;
  error?: string;
}

// Evaluate ad using Vercel Function
export async function evaluateAd(request: EvaluationRequest): Promise<EvaluationResponse> {
  try {
    logger.log('🚀 Calling backend service...');
    
    // Call Vercel Function (deployed at /api/analyze-ad)
    const response = await fetch('/api/analyze-ad', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.warn('❌ Backend service error:', response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    logger.log('✅ Backend service successful!');
    return data;
    
  } catch (error) {
    // Check if this is a rate limit error - don't fallback, throw it
    if (error instanceof Error && error.message.includes('429')) {
      logger.error('🚫 Rate limit exceeded');
      throw error; // Re-throw rate limit errors so UI can handle them
    }
    
    logger.warn('🔄 API call failed, using fallback:', error);
    
    // Fallback to mock evaluation for demo/development (non-rate-limit errors only)
    return generateFallbackEvaluation(request.adData.platform);
  }
}

// Get real usage information from backend
export async function getRealUsage(userEmail?: string): Promise<UsageInfo> {
  try {
    logger.log('🔍 Checking real usage from backend...', { userEmail });
    
    let response;
    
    if (userEmail) {
      // For authenticated users, use POST with email
      response = await fetch('/api/check-usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail })
      });
    } else {
      // For unauthenticated users, use GET for IP-based limiting
      response = await fetch('/api/check-usage', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    logger.log('✅ Real usage data received:', data);
    return data;
    
  } catch (error) {
    logger.warn('❌ Usage check failed, using fallback:', error);
    
    // Fallback to conservative defaults
    return {
      used: 5, // Assume limit reached if we can't check
      limit: 5,
      remaining: 0,
      canEvaluate: false,
      nextReset: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
      tier: 'free',
      error: 'Unable to check usage'
    };
  }
}

// Legacy function - kept for compatibility
export async function getUserUsage(userEmail?: string): Promise<UsageInfo> {
  return getRealUsage(userEmail);
}

// Generate mock evaluation for fallback
function generateFallbackEvaluation(platform: string): EvaluationResponse {
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

  const suggestions = platformSuggestions[platform as keyof typeof platformSuggestions] || platformSuggestions.meta;
  
  // Generate realistic mock scores
  const visualScore = Math.floor(Math.random() * 3) + 6; // 6-8
  const contextualScore = Math.floor(Math.random() * 4) + 5; // 5-8
  const toneScore = Math.floor(Math.random() * 3) + 6; // 6-8
  const overallScore = Math.round(((visualScore + contextualScore + toneScore) / 3) * 10) / 10;

  // Generate enhanced element comparisons with new analysis types
  const elementComparisons: ElementComparison[] = [
    {
      element: 'Primary Headline',
      adValue: 'Get 50% Off Premium Software',
      landingPageValue: 'Save Big on Professional Tools',
      status: 'partial_match',
      severity: 'HIGH',
      category: 'content',
      recommendation: 'Match the exact offer from your ad (50% off) in the landing page headline',
      emotionalTone: {
        adTone: 'Urgent, Deal-focused',
        pageTone: 'Professional, Conservative',
        alignment: 6
      }
    },
    {
      element: 'Color Scheme',
      adValue: 'Blue and Orange accent',
      landingPageValue: 'Blue and White theme',
      status: 'partial_match',
      severity: 'MEDIUM',
      category: 'visual',
      recommendation: 'Add orange accents to landing page CTA and headers to match ad',
      colorAnalysis: {
        adColors: ['#1E40AF', '#F97316'],
        pageColors: ['#1E40AF', '#FFFFFF'],
        matchScore: 7
      }
    },
    {
      element: 'Trust Signals',
      adValue: '5-star reviews, award badge',
      landingPageValue: 'Customer testimonials only',
      status: 'mismatch',
      severity: 'HIGH',
      category: 'trust',
      recommendation: 'Add award badges and star ratings prominently near the CTA',
      trustSignals: {
        adSignals: ['5-star reviews', 'Award badge'],
        pageSignals: ['Testimonials'],
        credibilityGap: 'Missing social proof elements shown in ad'
      }
    },
    {
      element: 'Call-to-Action',
      adValue: 'Start Free Trial',
      landingPageValue: 'Get Started Now',
      status: 'mismatch',
      severity: 'HIGH',
      category: 'content',
      recommendation: 'Change CTA button text to match ad exactly: "Start Free Trial"',
      emotionalTone: {
        adTone: 'Risk-free, trial-focused',
        pageTone: 'Generic, action-focused', 
        alignment: 5
      }
    },
    {
      element: 'Mobile Experience',
      adValue: 'Mobile-optimized ad format',
      landingPageValue: 'Desktop-first design',
      status: 'mismatch',
      severity: 'MEDIUM',
      category: 'mobile',
      recommendation: 'Optimize landing page for mobile users who clicked from mobile ads',
      mobileOptimization: {
        adMobileFriendly: true,
        pageMobileFriendly: false,
        consistencyScore: 4
      }
    }
  ];

  return {
    overallScore,
    componentScores: {
      visualMatch: visualScore,
      contextualMatch: contextualScore,
      toneAlignment: toneScore
    },
    suggestions,
    elementComparisons
  };
}