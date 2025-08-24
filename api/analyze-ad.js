const OpenAI = require('openai').default || require('openai');
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const { pgTable, uuid, text, integer, boolean, timestamp, index } = require('drizzle-orm/pg-core');
const { eq, sql } = require('drizzle-orm');
// Remove Puppeteer - using screenshot service instead

// Database schema (inline to avoid import issues)
const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  email: text('email').unique().notNull(),
  tier: text('tier', { enum: ['free', 'pro', 'enterprise'] }).default('free').notNull(),
  monthlyEvaluations: integer('monthly_evaluations').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
});

const evaluations = pgTable('evaluations', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').references(() => users.id),
  platform: text('platform').default('meta').notNull(),
  adScreenshotUrl: text('ad_screenshot_url').notNull(),
  landingPageUrl: text('landing_page_url').notNull(),
  overallScore: integer('overall_score').notNull(),
  visualScore: integer('visual_score').notNull(),
  contextualScore: integer('contextual_score').notNull(),
  toneScore: integer('tone_score').notNull(),
  usedAi: boolean('used_ai').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
});

const TIER_LIMITS = { free: 1, pro: 50, enterprise: 1000 };

// Screenshot landing page using ScreenshotAPI.net (paid service)
const screenshotLandingPage = async (url) => {
  const screenshotApiToken = process.env.SCREENSHOT_API_TOKEN;
  
  if (!screenshotApiToken) {
    console.warn('⚠️ No SCREENSHOT_API_TOKEN found - skipping screenshot');
    return null;
  }

  try {
    console.log('📸 Taking screenshot of landing page:', url);
    
    // Use ScreenshotAPI.net - reliable paid service
    const screenshotApiUrl = `https://shot.screenshotapi.net/screenshot`;
    
    const response = await fetch(screenshotApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: screenshotApiToken,
        url: url,
        width: 1200,
        height: 800,
        output: 'json',
        file_type: 'png',
        wait_for_event: 'load'
      }),
      timeout: 20000
    });

    if (!response.ok) {
      throw new Error(`Screenshot API failed: ${response.status} - ${await response.text()}`);
    }

    const result = await response.json();
    
    if (result.screenshot) {
      console.log('✅ Screenshot captured successfully via ScreenshotAPI');
      return result.screenshot; // Already a data URL
    } else {
      throw new Error('No screenshot in API response');
    }

  } catch (error) {
    console.warn('❌ ScreenshotAPI failed:', error.message);
    
    // Fallback to URLBox.io if available
    const urlboxKey = process.env.URLBOX_API_KEY;
    if (urlboxKey) {
      try {
        console.log('🔄 Trying URLBox fallback...');
        
        const fallbackUrl = `https://api.urlbox.io/v1/${urlboxKey}/png?url=${encodeURIComponent(url)}&width=1200&height=800&delay=2000`;
        
        const fallbackResponse = await fetch(fallbackUrl, { timeout: 15000 });
        
        if (fallbackResponse.ok) {
          const imageBuffer = await fallbackResponse.arrayBuffer();
          const base64Image = Buffer.from(imageBuffer).toString('base64');
          
          console.log('✅ URLBox fallback successful');
          return `data:image/png;base64,${base64Image}`;
        }
      } catch (fallbackError) {
        console.warn('❌ URLBox fallback also failed:', fallbackError.message);
      }
    }
    
    return null;
  }
};

// Helper function for platform-specific prompts
const getPlatformPrompt = (platform) => {
  const prompts = {
    meta: 'Meta (Facebook & Instagram) - focus on social engagement and mobile optimization',
    tiktok: 'TikTok - focus on visual energy, trends, and authentic content',
    linkedin: 'LinkedIn - focus on professional tone and B2B value propositions',
    google: 'Google Ads - focus on search intent alignment and conversion optimization',
    reddit: 'Reddit - focus on community authenticity and non-promotional tone'
  };
  return prompts[platform] || prompts.meta;
};

module.exports = async function handler(req, res) {
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
    const { adData, landingPageData, audienceData, userEmail } = req.body;

    console.log('🚀 Vercel Function called for platform:', adData.platform);

    // Initialize database connection
    let db = null;
    if (process.env.DATABASE_URL) {
      const client = postgres(process.env.DATABASE_URL, { prepare: false });
      db = drizzle(client);
      console.log('✅ Database connected');
    } else {
      console.log('⚠️ No database connection - proceeding without user tracking');
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    let userId = null;

    // Check user usage limits if email provided and database available
    if (userEmail && db) {
      try {
        const userResult = await db.select().from(users).where(eq(users.email, userEmail)).limit(1);
        const user = userResult[0];

        if (user) {
          const limit = TIER_LIMITS[user.tier];
          
          if (user.monthlyEvaluations >= limit) {
            return res.status(429).json({
              error: `Monthly limit reached (${user.monthlyEvaluations}/${limit}). Please upgrade your plan.`,
              errorCode: 'USAGE_LIMIT_EXCEEDED'
            });
          }
          
          userId = user.id;
        }
      } catch (dbError) {
        console.warn('⚠️ Database query failed:', dbError);
        // Continue without user tracking
      }
    }

    // Capture landing page screenshot
    const landingPageScreenshot = await screenshotLandingPage(landingPageData.url);

    const platformInfo = getPlatformPrompt(adData.platform);
    
    const prompt = `You are an expert ${platformInfo} ads analyst. 

You will analyze TWO images:
1. AD SCREENSHOT: The user's uploaded ad creative
2. LANDING PAGE SCREENSHOT: The destination page (${landingPageData.url})

Compare these images for congruence and effectiveness:

Target Audience: ${audienceData.ageRange}, ${audienceData.gender}, interests: ${audienceData.interests}

Analyze both images and evaluate (1-10 scores):

1. **Visual Match**: 
   - Color schemes, fonts, imagery style consistency
   - Brand visual identity alignment
   - Design aesthetic coherence

2. **Contextual Match**: 
   - Message/offer consistency between ad and landing page
   - Value proposition alignment
   - Call-to-action consistency

3. **Tone Alignment**: 
   - Voice and personality consistency
   - Messaging style coherence
   - Brand tone matching

Provide specific observations about what you see in each image and how they compare.

Return ONLY valid JSON:
{
  "scores": {
    "visualMatch": 8,
    "contextualMatch": 7,
    "toneAlignment": 9
  },
  "suggestions": {
    "visual": ["specific visual improvement based on what you see", "color/design suggestion", "layout recommendation"],
    "contextual": ["message alignment suggestion", "content consistency tip", "offer matching advice"],
    "tone": ["voice consistency suggestion", "messaging tone advice", "brand personality tip"]
  }
}`;

    console.log('🤖 Calling GPT-4o Vision...');

    // Prepare content array with both images
    const content = [
      { type: "text", text: prompt },
      { 
        type: "image_url", 
        image_url: { 
          url: adData.imageUrl,
          detail: "high" 
        } 
      }
    ];

    // Add landing page screenshot if available
    if (landingPageScreenshot) {
      content.push({
        type: "image_url", 
        image_url: { 
          url: landingPageScreenshot,
          detail: "high" 
        } 
      });
      console.log('📸 Both ad and landing page images sent to GPT-4o');
    } else {
      console.log('⚠️ Only ad image sent - landing page screenshot failed');
    }

    // Call GPT-4o Vision with both images
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "user",
        content: content
      }],
      response_format: { type: "json_object" },
      max_tokens: 2000, // Increased for more detailed analysis
      temperature: 0.7
    });

    const rawContent = completion.choices[0].message.content;
    console.log('📝 Raw GPT-4o response:', rawContent);

    let analysis;
    try {
      analysis = JSON.parse(rawContent || '{}');
      console.log('🔍 Parsed analysis:', analysis);
    } catch (jsonError) {
      console.error('❌ JSON parsing failed:', jsonError.message);
      console.error('📝 Raw content that failed to parse:', rawContent);
      throw new Error(`Failed to parse GPT-4o response as JSON: ${jsonError.message}`);
    }

    if (!analysis.scores || !analysis.suggestions) {
      console.error('❌ Invalid GPT-4o response format. Missing scores or suggestions:', analysis);
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
    if (userId && db) {
      try {
        // Increment user usage
        await db
          .update(users)
          .set({ 
            monthlyEvaluations: sql`monthly_evaluations + 1`,
            updatedAt: new Date()
          })
          .where(eq(users.id, userId));
        
        // Store evaluation
        await db.insert(evaluations).values({
          userId: userId,
          platform: adData.platform,
          adScreenshotUrl: adData.imageUrl,
          landingPageUrl: landingPageData.url,
          overallScore: overallScore,
          visualScore: analysis.scores.visualMatch,
          contextualScore: analysis.scores.contextualMatch,
          toneScore: analysis.scores.toneAlignment,
          usedAi: true
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
};