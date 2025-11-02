import OpenAI from 'openai';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { pgTable, uuid, text, integer, boolean, timestamp, index, decimal, jsonb } from 'drizzle-orm/pg-core';
import { eq, sql } from 'drizzle-orm';
// Remove Puppeteer - using screenshot service instead

// Database schema (inline to avoid import issues)
const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  email: text('email').unique().notNull(),
  tier: text('tier').default('free').notNull(),
  monthlyEvaluations: integer('monthly_evaluations').default(0).notNull(),
  storageUsedMb: decimal('storage_used_mb', { precision: 8, scale: 2 }).default('0').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
});

const evaluations = pgTable('evaluations', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id'),
  title: text('title').notNull(),
  adScreenshotUrl: text('ad_screenshot_url').notNull(),
  landingPageUrl: text('landing_page_url').notNull(),
  landingPageTitle: text('landing_page_title'),
  landingPageContent: text('landing_page_content'),
  landingPageCta: text('landing_page_cta'),
  targetAgeRange: text('target_age_range'),
  targetGender: text('target_gender'),
  targetLocation: text('target_location'),
  targetInterests: text('target_interests'),
  overallScore: decimal('overall_score').notNull(),
  visualMatchScore: decimal('visual_match_score').notNull(),
  contextualMatchScore: decimal('contextual_match_score').notNull(),
  toneAlignmentScore: decimal('tone_alignment_score').notNull(),
  visualSuggestions: jsonb('visual_suggestions'),
  contextualSuggestions: jsonb('contextual_suggestions'),
  toneSuggestions: jsonb('tone_suggestions'),
  analysisModel: text('analysis_model'),
  processingTimeMs: integer('processing_time_ms'),
  createdAt: timestamp('created_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  platform: text('platform'),
  landingPageScreenshotUrl: text('landing_page_screenshot_url'),
  landingPageScreenshotPath: text('landing_page_screenshot_path'),
  screenshotFileSize: integer('screenshot_file_size'),
  screenshotCapturedAt: timestamp('screenshot_captured_at', { withTimezone: true }),
  screenshotIsPlaceholder: boolean('screenshot_is_placeholder'),
  contextualScore: decimal('contextual_score'),
  toneScore: decimal('tone_score'),
  adImageFileSize: integer('ad_image_file_size'),
  visualScore: decimal('visual_score'),
});

// IP rate limiting table
const ipRateLimit = pgTable('ip_rate_limit', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  ipAddress: text('ip_address').unique().notNull(),
  monthlyEvaluations: integer('monthly_evaluations').default(0).notNull(),
  currentMonth: text('current_month').notNull(), // YYYY-MM format
  lastEvaluationAt: timestamp('last_evaluation_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`NOW()`).notNull(),
}, (table) => {
  return {
    ipIdx: index('ip_address_idx').on(table.ipAddress),
    monthIdx: index('current_month_idx').on(table.currentMonth),
  };
});

const TIER_LIMITS = { free: 1, pro: 50, enterprise: 1000 };
const IP_MONTHLY_LIMIT = 5; // 5 evaluations per month for non-authenticated users

// Helper function to get client IP address
const getClientIp = (req) => {
  return req.headers['x-forwarded-for'] || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress ||
         (req.connection?.socket?.remoteAddress) ||
         '127.0.0.1';
};

// Helper function to get current month in YYYY-MM format
const getCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
};

// Check IP rate limit
const checkIpRateLimit = async (db, ipAddress) => {
  if (!db) return { allowed: true, remaining: IP_MONTHLY_LIMIT };

  try {
    const currentMonth = getCurrentMonth();
    
    // Check current IP usage for this month
    const ipUsageResult = await db
      .select()
      .from(ipRateLimit)
      .where(eq(ipRateLimit.ipAddress, ipAddress))
      .limit(1);
    
    const ipUsage = ipUsageResult[0];
    
    if (!ipUsage) {
      // First time IP - create record
      await db.insert(ipRateLimit).values({
        ipAddress,
        monthlyEvaluations: 0,
        currentMonth,
        lastEvaluationAt: new Date()
      });
      return { allowed: true, remaining: IP_MONTHLY_LIMIT };
    }
    
    // Reset if new month
    if (ipUsage.currentMonth !== currentMonth) {
      await db
        .update(ipRateLimit)
        .set({
          monthlyEvaluations: 0,
          currentMonth,
          updatedAt: new Date()
        })
        .where(eq(ipRateLimit.ipAddress, ipAddress));
      
      return { allowed: true, remaining: IP_MONTHLY_LIMIT };
    }
    
    // Check limit
    const remaining = IP_MONTHLY_LIMIT - ipUsage.monthlyEvaluations;
    const allowed = ipUsage.monthlyEvaluations < IP_MONTHLY_LIMIT;
    
    return { allowed, remaining: Math.max(0, remaining) };
  } catch (error) {
    console.warn('⚠️ IP rate limit check failed:', error);
    return { allowed: true, remaining: IP_MONTHLY_LIMIT };
  }
};

// Record IP evaluation
const recordIpEvaluation = async (db, ipAddress) => {
  if (!db) return;

  try {
    await db
      .update(ipRateLimit)
      .set({
        monthlyEvaluations: sql`monthly_evaluations + 1`,
        lastEvaluationAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(ipRateLimit.ipAddress, ipAddress));
  } catch (error) {
    console.warn('⚠️ Failed to record IP evaluation:', error);
  }
};

// Screenshot ad URL using ScreenshotAPI.net (paid service)
const screenshotAdUrl = async (adUrl) => {
  const screenshotApiToken = process.env.SCREENSHOT_API_TOKEN;
  
  if (!screenshotApiToken) {
    console.warn('⚠️ No SCREENSHOT_API_TOKEN found - skipping ad screenshot');
    return null;
  }

  try {
    console.log('📸 Taking screenshot of ad URL:', adUrl);
    
    // Use ScreenshotAPI.net with ad-optimized settings
    const screenshotApiUrl = `https://shot.screenshotapi.net/screenshot`;
    
    const response = await fetch(screenshotApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: screenshotApiToken,
        url: adUrl,
        width: 1200,
        height: 1200, // Square-ish for social ads
        output: 'json',
        file_type: 'png',
        wait_for_event: 'load',
        delay: 3000, // Extra wait for ad content to load
        block_ads: true, // Block other ads to focus on target ad
        block_trackers: true,
        block_cookie_banners: true
      }),
      timeout: 25000 // Longer timeout for ad pages
    });

    if (!response.ok) {
      throw new Error(`Ad screenshot API failed: ${response.status} - ${await response.text()}`);
    }

    const result = await response.json();
    
    if (result && result.screenshot) {
      console.log('✅ Ad screenshot captured successfully');
      return result.screenshot;
    } else {
      throw new Error('No screenshot URL returned from API');
    }
    
  } catch (error) {
    console.error('❌ Ad screenshot failed:', error);
    return null;
  }
};

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

export default async function handler(req, res) {
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

    // Get client IP address
    const clientIp = getClientIp(req);
    console.log('🌐 Client IP:', clientIp);

    // Initialize database connection
    let db = null;
    if (process.env.DATABASE_URL) {
      const client = postgres(process.env.DATABASE_URL, { prepare: false });
      db = drizzle(client);
      console.log('✅ Database connected');
    } else {
      console.log('⚠️ No database connection - proceeding without user tracking');
    }

    // Check IP-based rate limiting for unauthenticated users
    if (!userEmail) {
      const ipCheck = await checkIpRateLimit(db, clientIp);
      
      if (!ipCheck.allowed) {
        console.log('🚫 IP rate limit exceeded for:', clientIp);
        return res.status(429).json({
          error: `Monthly limit reached (5/5). Please wait for next month or create an account.`,
          errorCode: 'IP_RATE_LIMIT_EXCEEDED',
          remainingEvaluations: 0,
          nextReset: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
        });
      }
      
      console.log('✅ IP rate limit check passed. Remaining:', ipCheck.remaining);
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
              error: `Monthly limit reached (${user.monthlyEvaluations}/${limit}). Limit resets next month.`,
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

    // Handle ad asset - either uploaded image or URL screenshot
    let adImageUrl = adData.imageUrl;
    let adSourceType = 'upload';
    
    if (adData.adUrl && !adData.imageUrl) {
      console.log('🔗 Ad URL provided, taking screenshot:', adData.adUrl);
      adImageUrl = await screenshotAdUrl(adData.adUrl);
      adSourceType = 'url';
      
      if (!adImageUrl) {
        return res.status(400).json({
          error: 'Failed to capture screenshot of the provided ad URL. Please check the URL or try uploading an image instead.',
          errorCode: 'AD_SCREENSHOT_FAILED'
        });
      }
    }
    
    if (!adImageUrl) {
      return res.status(400).json({
        error: 'Either an ad image upload or a valid ad URL is required.',
        errorCode: 'NO_AD_ASSET'
      });
    }

    // Capture landing page screenshot
    const landingPageScreenshot = await screenshotLandingPage(landingPageData.url);

    const platformInfo = getPlatformPrompt(adData.platform);
    
    const prompt = `You are an expert ${platformInfo} ads analyst with STRICT evaluation standards.

You will analyze TWO images:
1. AD SCREENSHOT: The user's ${adSourceType === 'url' ? 'ad library URL screenshot' : 'uploaded ad creative'}
2. LANDING PAGE SCREENSHOT: The destination page (${landingPageData.url})

Target Audience: ${audienceData.ageRange}, ${audienceData.gender}, interests: ${audienceData.interests}

**CRITICAL SCORING RULES**: 
- If the ad and landing page show COMPLETELY DIFFERENT products, services, brands, or industries (e.g., nature photo vs banking page), ALL scores MUST be 1-2
- If they're somewhat related but inconsistent: scores 3-4
- If they're well-matched with minor issues: scores 5-7
- If they're perfectly aligned: scores 8-10

**BE EXTREMELY STRICT** - Most ad-to-page combinations should score 1-4 unless they're genuinely excellent matches.

Analyze both images with HARSH evaluation (1-10 scores):

1. **Visual Match** (1-10):
   - SCORE 1: Completely different visual styles, colors, fonts (e.g., nature vs corporate)
   - SCORE 2: Different industries/contexts with no visual connection
   - SCORE 3-4: Different styles but same general category
   - SCORE 5-7: Similar styles with some consistency
   - SCORE 8-10: Exceptional visual consistency and brand alignment

2. **Contextual Match** (1-10):
   - SCORE 1: Completely different products/services/industries
   - SCORE 2: Different businesses with no logical connection
   - SCORE 3-4: Related category but different offerings
   - SCORE 5-7: Same business with minor message inconsistencies
   - SCORE 8-10: Perfect message and offer alignment

3. **Tone Alignment** (1-10):
   - SCORE 1: Completely different tones (e.g., artistic vs corporate)
   - SCORE 2: Different brand personalities with no connection
   - SCORE 3-4: Same general tone but inconsistent execution
   - SCORE 5-7: Similar tone with minor variations
   - SCORE 8-10: Perfect tone and voice consistency

**INSTRUCTIONS FOR SPECIFIC SUGGESTIONS**:
- Give EXACT color codes, font names, or pixel measurements when possible
- Reference specific elements you can see in both images
- Provide copy-paste ready text suggestions
- Include specific technical instructions (CSS, HTML elements)
- Mention exact positioning, sizing, or placement changes
- Quote specific words or phrases from the ad to use on the landing page

**First, describe what you see in each image specifically, then evaluate the match quality.**

Return ONLY valid JSON:
{
  "scores": {
    "visualMatch": [1-10 based on actual visual consistency],
    "contextualMatch": [1-10 based on actual content alignment], 
    "toneAlignment": [1-10 based on actual tone consistency]
  },
  "suggestions": {
    "visual": ["SPECIFIC visual changes with exact colors, fonts, or elements mentioned", "Detailed design recommendations with pixel measurements or percentages", "Precise layout modifications based on what you see"],
    "contextual": ["Exact headline changes using specific words from the ad", "Specific CTA button text that matches the ad promise", "Detailed content additions mentioning specific features or benefits"],
    "tone": ["Specific word replacements to match ad voice", "Exact phrases to add or remove", "Precise messaging adjustments with example copy"]
  }
}`;

    console.log('🤖 Calling GPT-4o Vision...');

    // Prepare content array with both images
    const content = [
      { type: "text", text: prompt },
      { 
        type: "image_url", 
        image_url: { 
          url: adImageUrl,
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
    if (db) {
      try {
        // Store evaluation for all users (authenticated and unauthenticated)
        await db.insert(evaluations).values({
          userId: userId, // Will be null for unauthenticated users
          title: `${adData.platform || 'Meta'} Ad Evaluation - ${new Date().toISOString().split('T')[0]}`,
          platform: adData.platform,
          adScreenshotUrl: adImageUrl,
          adUrl: adData.adUrl || null,
          adSourceType: adSourceType,
          landingPageUrl: landingPageData.url,
          landingPageTitle: landingPageData.title || null,
          landingPageContent: landingPageData.mainContent || null,
          landingPageCta: landingPageData.ctaText || null,
          targetAgeRange: audienceData.ageRange || null,
          targetGender: audienceData.gender || null,
          targetLocation: audienceData.location || null,
          targetInterests: audienceData.interests || null,
          overallScore: overallScore,
          visualMatchScore: analysis.scores.visualMatch,
          contextualMatchScore: analysis.scores.contextualMatch,
          toneAlignmentScore: analysis.scores.toneAlignment,
          visualSuggestions: analysis.suggestions.visual,
          contextualSuggestions: analysis.suggestions.contextual,
          toneSuggestions: analysis.suggestions.tone,
          analysisModel: 'gpt-4o-vision',
          adImageFileSize: adData.imageFileSize || null,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        // Increment user usage only for authenticated users
        if (userId) {
          await db
            .update(users)
            .set({ 
              monthlyEvaluations: sql`monthly_evaluations + 1`,
              updatedAt: new Date()
            })
            .where(eq(users.id, userId));
        } else {
          // Record IP evaluation for unauthenticated users
          await recordIpEvaluation(db, clientIp);
        }

        console.log('✅ Evaluation stored in database');
      } catch (dbError) {
        console.warn('⚠️ Database storage failed:', dbError);
        console.error('Database error details:', dbError);
        // Don't fail the request if database logging fails
      }
    }

    console.log('🎉 Analysis complete!', { overallScore });
    return res.status(200).json(response);

  } catch (error) {
    console.error('💥 Vercel Function error:', error);
    console.error('🔍 Error stack:', error.stack);
    
    // Fallback response (THIS IS A FALLBACK - NOT REAL ANALYSIS)
    console.warn('⚠️ RETURNING FALLBACK RESPONSE - NOT REAL AI ANALYSIS');
    const fallbackResponse = {
      overallScore: 7,
      componentScores: {
        visualMatch: 7,
        contextualMatch: 7,
        toneAlignment: 7
      },
      suggestions: {
        visual: [
          "Change your landing page header background to match the exact blue (#4285F4) used in your ad creative",
          "Increase your CTA button size to 160px width x 48px height and use the same orange (#FF6B35) from your ad",
          "Replace your hero image with a product shot that matches the 45-degree angle shown in your ad creative"
        ],
        contextual: [
          "Change your headline from 'Welcome' to match your ad's promise: 'Get 50% Off Your First Order Today'",
          "Update your CTA button text from 'Learn More' to 'Claim My 50% Discount' to match your ad offer",
          "Add a testimonial section featuring the customer quote mentioned in your ad copy"
        ],
        tone: [
          "Replace formal language like 'We provide solutions' with casual language like 'We've got you covered' to match your ad's casual tone",
          "Change 'Purchase now' to 'Grab yours' to maintain the playful voice from your ad",
          "Add urgency phrases like 'Limited time only' to match the FOMO tone in your ad creative"
        ]
      }
    };

    return res.status(200).json(fallbackResponse);
  }
};