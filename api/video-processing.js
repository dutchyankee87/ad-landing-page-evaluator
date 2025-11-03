// Video processing service for extracting frames from ad URLs
// Handles video detection, frame extraction, and optimization for analysis

/**
 * Enhanced video screenshot using ScreenshotAPI.net with video-optimized settings
 * Uses our existing ScreenshotAPI.net service with enhanced parameters for video content
 */
export const extractVideoFrames = async (videoUrl, options = {}) => {
  const {
    quality = 'high',         // Image quality
    format = 'png',          // Output format
    delay = 8000            // Longer delay for video loading
  } = options;

  const screenshotApiToken = process.env.SCREENSHOT_API_TOKEN;
  
  if (!screenshotApiToken) {
    console.warn('⚠️ No SCREENSHOT_API_TOKEN found - cannot process video');
    throw new Error('Video processing service not available');
  }

  try {
    console.log('🎬 Processing video URL with enhanced screenshot settings:', videoUrl);
    
    // Use ScreenshotAPI.net with video-optimized settings
    const response = await fetch('https://shot.screenshotapi.net/screenshot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: screenshotApiToken,
        url: videoUrl,
        width: 1200,
        height: 1200,
        output: 'json',
        file_type: format,
        wait_for_event: 'load',
        delay: delay,                    // Extended delay for video loading
        block_ads: true,
        block_trackers: true,
        block_cookie_banners: true,
        full_page: false,               // Focus on viewport where video plays
        capture_beyond_viewport: false,
        wait_for_selector: 'video, iframe, [data-testid*="video"]', // Wait for video elements
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' // Standard browser UA
      }),
      timeout: 45000 // Longer timeout for video processing
    });

    if (!response.ok) {
      throw new Error(`Video screenshot failed: ${response.status} - ${await response.text()}`);
    }

    const result = await response.json();
    
    if (result.screenshot) {
      console.log('✅ Video screenshot captured successfully');
      
      const frame = {
        timestamp: 0,
        imageUrl: result.screenshot,
        description: 'Video content screenshot'
      };
      
      return {
        success: true,
        frames: [frame],
        primaryFrame: frame,
        extractionMethod: 'video_screenshot',
        totalFrames: 1
      };
    }
    
    throw new Error('No screenshot returned from video processing');
    
  } catch (error) {
    console.error('❌ Video screenshot processing failed:', error);
    
    // Fallback to standard screenshot with shorter delay
    return fallbackVideoScreenshot(videoUrl);
  }
};

/**
 * Fallback video processing using screenshot service
 * Takes a screenshot of the video page as backup
 */
const fallbackVideoScreenshot = async (videoUrl) => {
  console.log('🔄 Using fallback video screenshot method');
  
  const screenshotApiToken = process.env.SCREENSHOT_API_TOKEN;
  
  if (!screenshotApiToken) {
    throw new Error('No video processing service available');
  }

  try {
    // Use enhanced screenshot settings for video pages
    const response = await fetch('https://shot.screenshotapi.net/screenshot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: screenshotApiToken,
        url: videoUrl,
        width: 1200,
        height: 1200,
        output: 'json',
        file_type: 'png',
        wait_for_event: 'load',
        delay: 5000,              // Longer delay for video loading
        block_ads: true,
        block_trackers: true,
        block_cookie_banners: true,
        full_page: false,         // Focus on viewport
        capture_beyond_viewport: false
      }),
      timeout: 35000
    });

    if (!response.ok) {
      throw new Error(`Screenshot fallback failed: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.screenshot) {
      console.log('✅ Fallback video screenshot captured');
      
      return {
        success: true,
        frames: [{
          timestamp: 0,
          imageUrl: result.screenshot,
          description: 'Video page screenshot'
        }],
        primaryFrame: {
          timestamp: 0,
          imageUrl: result.screenshot,
          description: 'Video page screenshot'
        },
        extractionMethod: 'screenshot_fallback',
        totalFrames: 1
      };
    }
    
    throw new Error('No screenshot returned from fallback service');
    
  } catch (error) {
    console.error('❌ Fallback video screenshot failed:', error);
    throw new Error('All video processing methods failed');
  }
};

/**
 * Determine optimal video processing strategy based on platform and URL
 */
export const getVideoProcessingStrategy = (platform, videoUrl) => {
  const strategies = {
    tiktok: {
      frameCount: 3,
      timestamps: [1, 3, 5], // TikTok videos are short
      quality: 'high',
      extractionMethod: 'multiple_frames'
    },
    meta: {
      frameCount: 2,
      timestamps: [2, 6], // Facebook/Instagram video ads
      quality: 'high',
      extractionMethod: 'key_frames'
    },
    google: {
      frameCount: 3,
      timestamps: [3, 8, 15], // YouTube ads can be longer
      quality: 'high',
      extractionMethod: 'representative_frames'
    },
    linkedin: {
      frameCount: 2,
      timestamps: [2, 8], // Professional video content
      quality: 'high',
      extractionMethod: 'business_frames'
    },
    reddit: {
      frameCount: 2,
      timestamps: [1, 5], // Reddit video posts
      quality: 'medium',
      extractionMethod: 'content_frames'
    }
  };

  return strategies[platform] || strategies.meta;
};

/**
 * Validate if URL is likely to be a video based on platform and URL patterns
 */
export const isVideoUrl = (platform, url) => {
  const videoIndicators = {
    tiktok: () => true, // TikTok is primarily video
    meta: (url) => {
      return url.includes('video') || 
             url.includes('media_type=video') ||
             url.includes('VIDEO');
    },
    google: (url) => {
      return url.includes('youtube') || 
             url.includes('video') ||
             url.includes('watch');
    },
    linkedin: (url) => {
      return url.includes('video');
    },
    reddit: (url) => {
      return url.includes('/v/') || url.includes('video');
    }
  };

  const checker = videoIndicators[platform];
  return checker ? checker(url) : false;
};

/**
 * Check if URL is a preview URL (requires special handling)
 */
const isPreviewUrl = (url) => {
  return url.includes('fb.me') || 
         url.includes('/ads/experience/confirmation') ||
         url.includes('v-ttam.tiktok.com') ||
         url.includes('ttam.tiktok.com');
};

/**
 * Get preview URL specific processing options
 */
const getPreviewUrlOptions = (url) => {
  if (url.includes('fb.me') || url.includes('/ads/experience/confirmation')) {
    return {
      delay: 10000, // Longer delay for Facebook preview pages
      wait_for_selector: 'video, [data-testid*="video"], [role="img"]',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };
  }
  
  if (url.includes('v-ttam.tiktok.com') || url.includes('ttam.tiktok.com')) {
    return {
      delay: 12000, // Even longer for TikTok preview pages
      wait_for_selector: 'video, [data-e2e="video-player"]',
      user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
    };
  }
  
  return {
    delay: 8000,
    wait_for_selector: 'video, iframe'
  };
};

/**
 * Process video URL for ad analysis
 * Main entry point for video processing
 */
export const processVideoForAnalysis = async (platform, videoUrl) => {
  try {
    console.log(`🎬 Processing ${platform} video for analysis:`, videoUrl);
    
    // Check if this is a preview URL
    const isPreview = isPreviewUrl(videoUrl);
    if (isPreview) {
      console.log('🔗 Preview URL detected, using enhanced settings');
    }
    
    // Get platform-specific processing strategy
    const strategy = getVideoProcessingStrategy(platform, videoUrl);
    
    // Override with preview URL options if needed
    if (isPreview) {
      const previewOptions = getPreviewUrlOptions(videoUrl);
      Object.assign(strategy, previewOptions);
    }
    
    // Extract frames using optimal strategy
    const result = await extractVideoFrames(videoUrl, strategy);
    
    if (!result.success) {
      throw new Error('Video processing failed');
    }
    
    console.log(`✅ Video processing complete: ${result.totalFrames} frames extracted via ${result.extractionMethod}`);
    
    return {
      success: true,
      primaryImageUrl: result.primaryFrame.imageUrl,
      additionalFrames: result.frames,
      processingMethod: result.extractionMethod,
      platform: platform,
      sourceType: isPreview ? 'preview_video' : 'video',
      isPreviewUrl: isPreview
    };
    
  } catch (error) {
    console.error('❌ Video processing failed:', error);
    throw error;
  }
};