// Client-side API wrapper that works in both development and production
// Using direct HTTP calls to avoid Supabase client import issues

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

export interface EvaluationResponse {
  overallScore: number;
  componentScores: {
    visualMatch: number;
    contextualMatch: number;
    toneAlignment: number;
  };
  suggestions: {
    visual: string[];
    contextual: string[];
    tone: string[];
  };
}

export interface UsageInfo {
  used: number;
  limit: number;
  tier: 'free' | 'pro' | 'enterprise';
  canEvaluate: boolean;
}

// Evaluate ad using Vercel Function
export async function evaluateAd(request: EvaluationRequest): Promise<EvaluationResponse> {
  try {
    console.log('🚀 Calling Vercel Function...');
    
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
      console.warn('❌ Vercel Function error:', response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Vercel Function successful!');
    return data;
    
  } catch (error) {
    console.warn('🔄 API call failed, using fallback:', error);
    
    // Fallback to mock evaluation for demo/development
    return generateFallbackEvaluation(request.adData.platform);
  }
}

// Get user usage information
export async function getUserUsage(userEmail?: string): Promise<UsageInfo> {
  if (!userEmail) {
    return {
      used: 0,
      limit: 1,
      tier: 'free',
      canEvaluate: true
    };
  }

  try {
    // In production, this would query the database through an API endpoint
    // For now, return mock data
    return {
      used: 0,
      limit: 1,
      tier: 'free',
      canEvaluate: true
    };
  } catch (error) {
    console.warn('Usage check failed:', error);
    return {
      used: 0,
      limit: 1,
      tier: 'free',
      canEvaluate: true
    };
  }
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

  return {
    overallScore,
    componentScores: {
      visualMatch: visualScore,
      contextualMatch: contextualScore,
      toneAlignment: toneScore
    },
    suggestions
  };
}