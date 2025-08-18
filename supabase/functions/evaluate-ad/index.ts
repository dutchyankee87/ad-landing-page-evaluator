import OpenAI from 'npm:openai@4.28.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AdData {
  headline: string;
  description: string;
  imageUrl: string;
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const { adData, landingPageData, audienceData } = await req.json();

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    const prompt = `You are an expert Meta (Facebook & Instagram) ads analyst. Evaluate the following ad and landing page for congruence and effectiveness:

Ad Details:
- Headline: ${adData.headline}
- Description: ${adData.description}
- Image URL: ${adData.imageUrl}

Landing Page:
- URL: ${landingPageData.url}
- Title: ${landingPageData.title || 'N/A'}
- Main CTA: ${landingPageData.ctaText || 'N/A'}

Target Audience:
- Age Range: ${audienceData.ageRange}
- Gender: ${audienceData.gender}
- Location: ${audienceData.location || 'Global'}
- Interests: ${audienceData.interests}

Evaluate and provide scores (0-10) for:
1. Visual Match: How well the ad visuals align with the landing page
2. Contextual Match: How well the ad message matches the landing page content
3. Tone Alignment: Consistency in voice and messaging

Also provide specific suggestions for improvement in each category.

Format your response as a JSON object with this structure:
{
  "scores": {
    "visualMatch": number,
    "contextualMatch": number,
    "toneAlignment": number
  },
  "suggestions": {
    "visual": string[],
    "contextual": string[],
    "tone": string[]
  }
}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-4-turbo-preview",
      response_format: { type: "json_object" },
    });

    const analysis = JSON.parse(completion.choices[0].message.content);
    
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
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});