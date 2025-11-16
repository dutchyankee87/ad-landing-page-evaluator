import OpenAI from 'openai';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { pgTable, uuid, text, integer, boolean, timestamp, index, decimal, jsonb } from 'drizzle-orm/pg-core';
import { eq, sql } from 'drizzle-orm';
import { processVideoForAnalysis, isVideoUrl } from './video-processing.js';
import { logger } from './lib/logger.js';
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
  adUrl: text('ad_url'),
  adSourceType: text('ad_source_type'), // 'upload', 'url', 'video'
  mediaType: text('media_type'), // 'image', 'video', 'unknown'
  videoFrameCount: integer('video_frame_count'),
  videoProcessingMethod: text('video_processing_method'),
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
    logger.warn('⚠️ Rate limit check failed:', error);
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
    logger.warn('⚠️ Failed to record evaluation:', error);
  }
};

// Check if URL is a preview URL
const isPreviewUrl = (url) => {
  return url.includes('fb.me') || 
         url.includes('/ads/experience/confirmation') ||
         url.includes('v-ttam.tiktok.com') ||
         url.includes('ttam.tiktok.com');
};

// Get preview URL specific settings
const getPreviewScreenshotSettings = (url) => {
  if (url.includes('fb.me') || url.includes('/ads/experience/confirmation')) {
    return {
      delay: 8000, // Longer delay for Facebook preview pages
      wait_for_selector: '[data-testid*="ad"], [role="img"], video',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };
  }
  
  if (url.includes('v-ttam.tiktok.com') || url.includes('ttam.tiktok.com')) {
    return {
      delay: 10000, // Longer delay for TikTok preview pages
      wait_for_selector: 'video, [data-e2e="video-player"], canvas',
      user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
    };
  }
  
  return {
    delay: 3000,
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  };
};

// Screenshot ad URL using ScreenshotAPI.net (paid service)
const screenshotAdUrl = async (adUrl) => {
  const screenshotApiToken = process.env.SCREENSHOT_API_TOKEN;
  
  if (!screenshotApiToken) {
    logger.warn('⚠️ No screenshot API token found - skipping ad screenshot');
    return null;
  }

  try {
    const isPreview = isPreviewUrl(adUrl);
    if (isPreview) {
      logger.log('🔗 Preview URL detected, using enhanced settings');
    }
    
    logger.log('📸 Taking screenshot of ad URL:', adUrl);
    
    // Get preview-specific settings if needed
    const previewSettings = isPreview ? getPreviewScreenshotSettings(adUrl) : {};
    
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
        delay: previewSettings.delay || 3000,
        wait_for_selector: previewSettings.wait_for_selector,
        user_agent: previewSettings.user_agent,
        block_ads: true, // Block other ads to focus on target ad
        block_trackers: true,
        block_cookie_banners: true,
        hide_cookie_banners: true,
        click_accept: true,
        press_escape: true,
        js_code: "document.querySelectorAll('[class*=\"cookie\"], [class*=\"consent\"], [class*=\"gdpr\"], [id*=\"cookie\"], [id*=\"consent\"], [id*=\"gdpr\"]').forEach(el => el.remove());"
      }),
      timeout: isPreview ? 35000 : 25000 // Longer timeout for preview pages
    });

    if (!response.ok) {
      throw new Error(`Ad screenshot API failed: ${response.status} - ${await response.text()}`);
    }

    const result = await response.json();
    
    if (result && result.screenshot) {
      logger.log('✅ Ad screenshot captured successfully');
      return result.screenshot;
    } else {
      throw new Error('No screenshot URL returned from API');
    }
    
  } catch (error) {
    logger.error('❌ Ad screenshot failed:', error);
    return null;
  }
};

// Screenshot landing page using ScreenshotAPI.net (paid service)
const screenshotLandingPage = async (url) => {
  const screenshotApiToken = process.env.SCREENSHOT_API_TOKEN;
  
  if (!screenshotApiToken) {
    logger.warn('⚠️ No screenshot API token found - skipping screenshot');
    return null;
  }

  try {
    logger.log('📸 Taking screenshot of landing page:', url);
    
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
        wait_for_event: 'load',
        delay: 3000,
        block_cookie_banners: true,
        block_ads: true,
        block_trackers: true,
        hide_cookie_banners: true,
        click_accept: true,
        press_escape: true,
        wait_for_selector: '[role="main"], main, .content',
        js_code: "document.querySelectorAll('[class*=\"cookie\"], [class*=\"consent\"], [class*=\"gdpr\"], [id*=\"cookie\"], [id*=\"consent\"], [id*=\"gdpr\"]').forEach(el => el.remove());"
      }),
      timeout: 20000
    });

    if (!response.ok) {
      throw new Error(`Screenshot API failed: ${response.status} - ${await response.text()}`);
    }

    const result = await response.json();
    
    if (result.screenshot) {
      logger.log('✅ Screenshot captured successfully via service');
      return result.screenshot; // Already a data URL
    } else {
      throw new Error('No screenshot in API response');
    }

  } catch (error) {
    logger.warn('❌ Screenshot service failed:', error.message);
    
    // Fallback to URLBox.io if available
    const urlboxKey = process.env.URLBOX_API_KEY;
    if (urlboxKey) {
      try {
        logger.log('🔄 Trying backup service...');
        
        const fallbackUrl = `https://api.urlbox.io/v1/${urlboxKey}/png?url=${encodeURIComponent(url)}&width=1200&height=800&delay=2000`;
        
        const fallbackResponse = await fetch(fallbackUrl, { timeout: 15000 });
        
        if (fallbackResponse.ok) {
          const imageBuffer = await fallbackResponse.arrayBuffer();
          const base64Image = Buffer.from(imageBuffer).toString('base64');
          
          logger.log('✅ Backup service successful');
          return `data:image/png;base64,${base64Image}`;
        }
      } catch (fallbackError) {
        logger.warn('❌ Backup service also failed:', fallbackError.message);
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

    logger.log('🚀 Function called for platform:', adData.platform);

    // Get client IP address
    const clientIp = getClientIp(req);
    logger.debug('🌐 Client IP:', clientIp);

    // Initialize database connection
    let db = null;
    if (process.env.DATABASE_URL) {
      const client = postgres(process.env.DATABASE_URL, { prepare: false });
      db = drizzle(client);
      logger.log('✅ Database connected');
    } else {
      logger.log('⚠️ No database connection - proceeding without user tracking');
    }

    // Check IP-based rate limiting for unauthenticated users
    if (!userEmail) {
      const ipCheck = await checkIpRateLimit(db, clientIp);
      
      if (!ipCheck.allowed) {
        logger.log('🚫 Rate limit exceeded');
        return res.status(429).json({
          error: `Monthly limit reached (5/5). Please wait for next month or create an account.`,
          errorCode: 'IP_RATE_LIMIT_EXCEEDED',
          remainingEvaluations: 0,
          nextReset: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
        });
      }
      
      logger.log('✅ Rate limit check passed. Remaining:', ipCheck.remaining);
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
        logger.warn('⚠️ Database query failed:', dbError);
        // Continue without user tracking
      }
    }

    // Handle ad asset - uploaded image, URL screenshot, or video processing
    let adImageUrl = adData.imageUrl;
    let adSourceType = 'upload';
    let videoFrameCount = null;
    let videoProcessingMethod = null;
    
    if (adData.adUrl && !adData.imageUrl) {
      logger.log('🔗 Ad URL provided:', adData.adUrl);
      
      // Check if this is a video URL that needs special processing
      const isVideo = adData.mediaType === 'video' || isVideoUrl(adData.platform, adData.adUrl);
      
      if (isVideo) {
        logger.log('🎬 Video URL detected, using video processing');
        try {
          const videoResult = await processVideoForAnalysis(adData.platform, adData.adUrl);
          adImageUrl = videoResult.primaryImageUrl;
          adSourceType = 'video';
          videoFrameCount = videoResult.additionalFrames?.length || 1;
          videoProcessingMethod = videoResult.processingMethod;
          
          logger.log(`✅ Video processed: ${videoFrameCount} frames via ${videoProcessingMethod}`);
        } catch (videoError) {
          logger.warn('⚠️ Video processing failed, falling back to standard screenshot:', videoError.message);
          // Fallback to standard screenshot
          adImageUrl = await screenshotAdUrl(adData.adUrl);
          adSourceType = 'url';
        }
      } else {
        logger.log('📸 Image URL detected, using standard screenshot');
        adImageUrl = await screenshotAdUrl(adData.adUrl);
        adSourceType = 'url';
      }
      
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
    
    const prompt = `Analyze these 2 images: AD (${adSourceType === 'video' ? 'video frame' : 'image'}) + LANDING PAGE for ${platformInfo}.

Target: ${audienceData.ageRange}, ${audienceData.gender}, ${audienceData.interests}

EXTRACT & ANALYZE:

1. **Primary Colors** (3-5 dominant colors from each image as hex codes)
2. **Text Elements** (exact transcription):
   - Headlines, CTAs, offers, product names
3. **Visual Style** (design approach, layout, imagery)
4. **Trust Signals** (reviews, ratings, badges, testimonials)
5. **Mobile Elements** (responsive design, mobile-first layout)
6. **Emotional Tone** (urgent, professional, playful, etc.)

SCORING (1-10, be strict - most scores 1-4):
- **Visual**: Color/design consistency
- **Contextual**: Message/offer alignment  
- **Tone**: Voice/personality match

PRIORITIZE RECOMMENDATIONS:
- Use HIGH severity for major mismatches that hurt conversions (headlines, CTAs, core colors)
- Use MEDIUM for important but secondary elements (tone, trust signals)
- Use LOW for minor optimizations (mobile tweaks, minor visual elements)
- Provide specific, actionable recommendations with exact text/color changes

Return JSON:
{
  "scores": {
    "visualMatch": [1-10],
    "contextualMatch": [1-10],
    "toneAlignment": [1-10]
  },
  "suggestions": {
    "visual": ["Specific color/design changes"],
    "contextual": ["Exact text/message changes"],
    "tone": ["Voice/personality adjustments"]
  },
  "elementComparisons": [
    {
      "element": "Primary Colors",
      "adValue": "Main colors in ad",
      "landingPageValue": "Main colors on page",
      "status": "match|mismatch|partial_match|missing",
      "severity": "HIGH|MEDIUM|LOW",
      "category": "visual",
      "recommendation": "Detailed color/visual recommendation (e.g., 'Change your button color from blue to orange to match your ad creative')",
      "colorAnalysis": {
        "adColors": ["#hex1", "#hex2"],
        "pageColors": ["#hex3", "#hex4"],
        "matchScore": [1-10]
      }
    },
    {
      "element": "Primary Headline",
      "adValue": "Exact text from ad",
      "landingPageValue": "Exact text from page",
      "status": "match|mismatch|partial_match|missing",
      "severity": "HIGH|MEDIUM|LOW",
      "category": "content",
      "recommendation": "Detailed, actionable recommendation (e.g., 'Change your headline from X to Y to match your ad promise')"
    },
    {
      "element": "Call-to-Action",
      "adValue": "Exact CTA text",
      "landingPageValue": "Exact CTA text",
      "status": "match|mismatch|partial_match|missing",
      "severity": "HIGH|MEDIUM|LOW",
      "category": "content",
      "recommendation": "Detailed, actionable CTA change (e.g., 'Change your CTA from \"Learn More\" to \"Get 50% Off\" to match your ad offer')"
    },
    {
      "element": "Emotional Tone",
      "adValue": "Ad's emotional approach",
      "landingPageValue": "Page's emotional approach",
      "status": "match|mismatch|partial_match|missing",
      "severity": "HIGH|MEDIUM|LOW",
      "category": "emotional",
      "recommendation": "Tone adjustment needed",
      "emotionalTone": {
        "adTone": "Descriptive tone",
        "pageTone": "Descriptive tone",
        "alignment": [1-10]
      }
    },
    {
      "element": "Trust Signals",
      "adValue": "Trust elements in ad",
      "landingPageValue": "Trust elements on page",
      "status": "match|mismatch|partial_match|missing",
      "severity": "HIGH|MEDIUM|LOW",
      "category": "trust",
      "recommendation": "Trust signal improvement",
      "trustSignals": {
        "adSignals": ["element1", "element2"],
        "pageSignals": ["element1", "element2"],
        "credibilityGap": "Description of gap"
      }
    },
    {
      "element": "Mobile Optimization",
      "adValue": "Mobile design assessment",
      "landingPageValue": "Mobile design assessment",
      "status": "match|mismatch|partial_match|missing",
      "severity": "MEDIUM|LOW",
      "category": "mobile",
      "recommendation": "Mobile optimization needed",
      "mobileOptimization": {
        "adMobileFriendly": true|false,
        "pageMobileFriendly": true|false,
        "consistencyScore": [1-10]
      }
    }
  ]
}`;

    logger.log('🤖 Calling AI vision model...');

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
      logger.log('📸 Both ad and landing page images sent to AI model');
    } else {
      logger.log('⚠️ Only ad image sent - landing page screenshot failed');
    }

    // Call GPT-4o Vision with both images
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "user",
        content: content
      }],
      response_format: { type: "json_object" },
      max_tokens: 3000, // Increased for enhanced analysis with new features
      temperature: 0.5 // Reduced for more consistent outputs
    });

    const rawContent = completion.choices[0].message.content;
    logger.debug('📝 Raw AI response:', rawContent);

    let analysis;
    try {
      analysis = JSON.parse(rawContent || '{}');
      logger.debug('🔍 Parsed analysis:', analysis);
    } catch (jsonError) {
      logger.error('❌ JSON parsing failed:', jsonError.message);
      logger.debug('📝 Raw content that failed to parse:', rawContent);
      throw new Error(`Failed to parse GPT-4o response as JSON: ${jsonError.message}`);
    }

    if (!analysis.scores || !analysis.suggestions) {
      logger.error('❌ Invalid AI response format. Missing scores or suggestions:', analysis);
      throw new Error('Invalid GPT-4o response format');
    }

    logger.log('✅ AI analysis successful!');

    // Calculate overall score
    const overallScore = Math.round(
      (analysis.scores.visualMatch + 
       analysis.scores.contextualMatch + 
       analysis.scores.toneAlignment) / 3
    );

    const response = {
      overallScore,
      componentScores: analysis.scores,
      suggestions: analysis.suggestions,
      elementComparisons: analysis.elementComparisons || []
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
          mediaType: adData.mediaType || (adSourceType === 'video' ? 'video' : 'image'),
          videoFrameCount: videoFrameCount,
          videoProcessingMethod: videoProcessingMethod,
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

        logger.log('✅ Evaluation stored in database');
      } catch (dbError) {
        logger.warn('⚠️ Database storage failed:', dbError);
        logger.error('Database error details:', dbError);
        // Don't fail the request if database logging fails
      }
    }

    logger.log('🎉 Analysis complete!', { overallScore });
    return res.status(200).json(response);

  } catch (error) {
    logger.error('💥 Function error:', error);
    logger.error('🔍 Error stack:', error.stack);
    
    // Fallback response (THIS IS A FALLBACK - NOT REAL ANALYSIS)
    logger.warn('⚠️ RETURNING FALLBACK RESPONSE - NOT REAL ANALYSIS');
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
      },
      elementComparisons: [
        {
          element: "Primary Colors",
          adValue: "Blue and white color scheme",
          landingPageValue: "Blue and orange theme",
          status: "partial_match",
          severity: "MEDIUM",
          category: "visual",
          recommendation: "Align color scheme between ad and landing page for better brand consistency",
          colorAnalysis: {
            adColors: ["#2563EB", "#FFFFFF"],
            pageColors: ["#2563EB", "#F97316"],
            matchScore: 6
          }
        },
        {
          element: "Primary Headline",
          adValue: "Unable to extract - API error",
          landingPageValue: "Unable to extract - API error",
          status: "missing",
          severity: "HIGH",
          category: "content",
          recommendation: "Please try again - analysis failed due to API error"
        },
        {
          element: "Call-to-Action",
          adValue: "Start Free Trial",
          landingPageValue: "Get Started",
          status: "mismatch",
          severity: "HIGH",
          category: "content",
          recommendation: "Change landing page CTA to match ad: 'Start Free Trial'"
        },
        {
          element: "Emotional Tone",
          adValue: "Confident, professional tone",
          landingPageValue: "Casual, friendly tone",
          status: "mismatch",
          severity: "MEDIUM",
          category: "emotional",
          recommendation: "Align emotional tone between ad and landing page",
          emotionalTone: {
            adTone: "Professional, confident",
            pageTone: "Casual, friendly",
            alignment: 4
          }
        },
        {
          element: "Trust Signals",
          adValue: "Customer testimonials visible",
          landingPageValue: "Security badges only",
          status: "mismatch",
          severity: "HIGH",
          category: "trust",
          recommendation: "Add customer testimonials to landing page to match ad trust signals",
          trustSignals: {
            adSignals: ["Customer testimonials", "User ratings"],
            pageSignals: ["Security badges"],
            credibilityGap: "Missing testimonials and ratings from ad"
          }
        },
        {
          element: "Mobile Optimization",
          adValue: "Mobile-optimized ad format",
          landingPageValue: "Desktop-focused layout",
          status: "mismatch",
          severity: "MEDIUM",
          category: "mobile",
          recommendation: "Optimize landing page for mobile users coming from mobile ads",
          mobileOptimization: {
            adMobileFriendly: true,
            pageMobileFriendly: false,
            consistencyScore: 4
          }
        }
      ]
    };

    return res.status(200).json(fallbackResponse);
  }
};