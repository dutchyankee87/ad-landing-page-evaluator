import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// Types
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

const getPlatformPrompt = (platform: string) => {
  const prompts = {
    meta: 'Meta (Facebook & Instagram) - focus on social engagement and mobile optimization',
    tiktok: 'TikTok - focus on visual energy, trends, and authentic content',
    linkedin: 'LinkedIn - focus on professional tone and B2B value propositions',
    google: 'Google Ads - focus on search intent alignment and conversion optimization',
    reddit: 'Reddit - focus on community authenticity and non-promotional tone'
  };
  return prompts[platform as keyof typeof prompts] || prompts.meta;
};

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { adData, landingPageData, audienceData, userEmail }: {
      adData: AdData;
      landingPageData: LandingPageData;
      audienceData: AudienceData;
      userEmail?: string;
    } = req.body;

    console.log('🚀 Vercel Function called for platform:', adData.platform);

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Initialize Supabase for database operations
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let userId = null;

    // Check user usage limits if email provided
    if (userEmail) {
      const { data: user } = await supabase
        .from('users')
        .select('id, tier, monthly_evaluations')
        .eq('email', userEmail)
        .single();

      if (user) {
        const limits = { free: 1, pro: 50, enterprise: 1000 };
        const limit = limits[user.tier as keyof typeof limits] || 1;
        
        if (user.monthly_evaluations >= limit) {
          return res.status(429).json({
            error: `Monthly limit reached (${user.monthly_evaluations}/${limit}). Please upgrade your plan.`,
            errorCode: 'USAGE_LIMIT_EXCEEDED'
          });
        }
        
        userId = user.id;
      }
    }

    const platformInfo = getPlatformPrompt(adData.platform);
    
    const prompt = `You are an expert ${platformInfo} ads analyst. Analyze this ad screenshot and landing page:

Ad Platform: ${adData.platform}
Landing Page: ${landingPageData.url}
Target Audience: ${audienceData.ageRange}, ${audienceData.gender}, interests: ${audienceData.interests}

Evaluate and provide scores (1-10) for:
1. Visual Match: Ad visual design alignment with landing page
2. Contextual Match: Ad message alignment with landing page content
3. Tone Alignment: Voice and messaging consistency

Return ONLY valid JSON:
{
  "scores": {
    "visualMatch": 8,
    "contextualMatch": 7,
    "toneAlignment": 9
  },
  "suggestions": {
    "visual": ["suggestion 1", "suggestion 2", "suggestion 3"],
    "contextual": ["suggestion 1", "suggestion 2", "suggestion 3"],
    "tone": ["suggestion 1", "suggestion 2", "suggestion 3"]
  }
}`;

    console.log('🤖 Calling GPT-4o Vision...');

    // Call GPT-4o Vision
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "user",
        content: [
          { type: "text", text: prompt },
          { 
            type: "image_url", 
            image_url: { 
              url: adData.imageUrl,
              detail: "high" 
            } 
          }
        ]
      }],
      response_format: { type: "json_object" },
      max_tokens: 1500,
      temperature: 0.7
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');

    if (!analysis.scores || !analysis.suggestions) {
      throw new Error('Invalid GPT-4o response format');
    }

    console.log('✅ GPT-4o analysis successful!');

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

    // Store evaluation in database
    if (userId) {
      try {
        // Increment user usage
        await supabase.rpc('increment_user_evaluation', { user_id_param: userId });
        
        // Store evaluation
        await supabase
          .from('evaluations')
          .insert({
            user_id: userId,
            platform: adData.platform,
            ad_screenshot_url: adData.imageUrl,
            landing_page_url: landingPageData.url,
            overall_score: overallScore,
            visual_score: analysis.scores.visualMatch,
            contextual_score: analysis.scores.contextualMatch,
            tone_score: analysis.scores.toneAlignment,
            used_ai: true
          });

        console.log('✅ Evaluation stored in database');
      } catch (dbError) {
        console.warn('⚠️ Database storage failed:', dbError);
        // Don't fail the request if database logging fails
      }
    }

    console.log('🎉 Analysis complete!', { overallScore });
    return res.status(200).json(response);

  } catch (error) {
    console.error('💥 Vercel Function error:', error);
    
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

    return res.status(200).json(fallbackResponse);
  }
}