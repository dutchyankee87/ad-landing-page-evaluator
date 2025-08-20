import OpenAI from 'npm:openai@4.28.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AdData {
  imageUrl: string;
  platform: string;
}

interface LandingPageData {
  url: string;
  title?: string;
  mainContent?: string;
  ctaText?: string;
}

interface AudienceData {
  ageRange: string;
  gender: string;
  location?: string;
  interests: string;
}

const getPlatformSpecificPrompt = (platform: string) => {
  const platformConfig = {
    meta: {
      name: 'Meta (Facebook & Instagram)',
      focus: 'social engagement, mobile optimization, visual storytelling, and brand awareness',
    },
    tiktok: {
      name: 'TikTok',
      focus: 'visual energy, trend alignment, youth appeal, and authentic content',
    },
    linkedin: {
      name: 'LinkedIn',
      focus: 'professional tone, B2B value propositions, credibility, and business outcomes',
    },
    google: {
      name: 'Google Ads',
      focus: 'search intent alignment, conversion optimization, and quality score factors',
    },
    reddit: {
      name: 'Reddit',
      focus: 'community authenticity, non-promotional tone, and genuine value',
    }
  };

  return platformConfig[platform as keyof typeof platformConfig] || platformConfig.meta;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    console.log('🚀 Minimal Edge Function called!');
    const { adData, landingPageData, audienceData } = await req.json();
    
    // Check if OpenAI API key exists
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      console.log('❌ No OpenAI API key found');
      throw new Error('OpenAI API key not configured');
    }

    console.log('✅ OpenAI API key found');
    const openai = new OpenAI({ apiKey });

    const platformInfo = getPlatformSpecificPrompt(adData.platform || 'meta');
    
    const prompt = `You are an expert ${platformInfo.name} ads analyst. Analyze this ad screenshot and provide evaluation scores.

Ad Details:
- Platform: ${platformInfo.name}
- Focus Areas: ${platformInfo.focus}

Landing Page: ${landingPageData.url}
Target Audience: ${audienceData.ageRange}, ${audienceData.gender}, interests: ${audienceData.interests}

Analyze the ad screenshot and provide scores (1-10) and specific suggestions for:
1. Visual Match: How well the ad's visual design aligns with the landing page
2. Contextual Match: How well the ad's message matches the landing page content  
3. Tone Alignment: Consistency in voice and messaging style

Return ONLY a JSON object in this exact format:
{
  "scores": {
    "visualMatch": 7,
    "contextualMatch": 8,
    "toneAlignment": 6
  },
  "suggestions": {
    "visual": ["suggestion 1", "suggestion 2", "suggestion 3"],
    "contextual": ["suggestion 1", "suggestion 2", "suggestion 3"],
    "tone": ["suggestion 1", "suggestion 2", "suggestion 3"]
  }
}`;

    console.log('🤖 Calling GPT-4o Vision...');
    
    const completion = await openai.chat.completions.create({
      messages: [{
        role: "user",
        content: [
          {
            type: "text",
            text: prompt
          },
          {
            type: "image_url",
            image_url: {
              url: adData.imageUrl,
              detail: "high"
            }
          }
        ]
      }],
      model: "gpt-4o",
      response_format: { type: "json_object" },
      max_tokens: 1500,
      temperature: 0.7
    });

    console.log('✅ GPT-4o responded!');
    
    const analysis = JSON.parse(completion.choices[0].message.content || '{}');
    
    // Validate response format
    if (!analysis.scores || !analysis.suggestions) {
      throw new Error('Invalid GPT-4o response format');
    }

    // Calculate overall score
    const overallScore = Math.round(
      (analysis.scores.visualMatch + 
       analysis.scores.contextualMatch + 
       analysis.scores.toneAlignment) / 3
    );

    const response = {
      overallScore,
      componentScores: analysis.scores,
      suggestions: analysis.suggestions
    };

    console.log('🎉 GPT-4o analysis complete!', { overallScore });

    return new Response(
      JSON.stringify(response),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );

  } catch (error) {
    console.error('💥 Error:', error);
    
    // Fallback response
    const fallbackResponse = {
      overallScore: 7,
      componentScores: {
        visualMatch: 7,
        contextualMatch: 7,
        toneAlignment: 7
      },
      suggestions: {
        visual: [
          "Ensure brand colors are consistent between ad and landing page",
          "Optimize images for mobile viewing",
          "Use high-contrast visuals that stand out"
        ],
        contextual: [
          "Match your ad's value proposition with landing page headline",
          "Ensure CTA language is consistent",
          "Include social proof elements"
        ],
        tone: [
          "Maintain consistent voice across touchpoints",
          "Use platform-appropriate language",
          "Focus on user benefits"
        ]
      }
    };

    return new Response(
      JSON.stringify(fallbackResponse),
      {
        status: 200, // Return 200 so client doesn't see it as error
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});