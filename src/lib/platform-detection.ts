// Platform detection and URL validation for ad library URLs
export type MediaType = 'image' | 'video' | 'unknown';

export interface PlatformConfig {
  id: string;
  name: string;
  patterns: RegExp[];
  videoPatterns?: RegExp[];
  guidance: string;
  screenshotTips: string;
  supportsVideo: boolean;
  videoGuidance?: string;
}

export interface MediaDetectionResult {
  platform: string;
  mediaType: MediaType;
  confidence: 'high' | 'medium' | 'low';
}

export const PLATFORM_CONFIGS: PlatformConfig[] = [
  {
    id: 'meta',
    name: 'Meta (Facebook/Instagram)',
    patterns: [
      /facebook\.com\/ads\/library/i,
      /facebook\.com\/ad_library/i,
      /www\.facebook\.com\/ads\/library/i,
      /m\.facebook\.com\/ads\/library/i,
      // Ad preview URLs
      /fb\.me\/adspreview\/facebook\/[a-zA-Z0-9]+/i,
      /fb\.me\/[a-zA-Z0-9]+/i,
      /facebook\.com\/ads\/experience\/confirmation/i,
      /business\.facebook\.com\/ads\/experience\/confirmation/i
    ],
    videoPatterns: [
      /facebook\.com\/ads\/library.*media_type=video/i,
      /facebook\.com\/ads\/library.*video/i,
      // Preview URLs for video ads
      /fb\.me\/adspreview\/facebook\/[a-zA-Z0-9]+/i,
      /fb\.me\/[a-zA-Z0-9]+/i
    ],
    guidance: 'Paste a URL from Facebook Ad Library (facebook.com/ads/library) or ad preview link (fb.me/adspreview)',
    screenshotTips: 'We\'ll capture a clean screenshot of the ad from Facebook Ad Library or preview link for analysis.',
    supportsVideo: true,
    videoGuidance: 'Video ads will be analyzed using extracted frames for comprehensive visual assessment.'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    patterns: [
      /library\.tiktok\.com\/ads/i,
      /ads\.tiktok\.com\/library/i,
      /library\.tiktok\.com/i,
      // TikTok ad preview URLs
      /v-ttam\.tiktok\.com\/s\/[a-zA-Z0-9]+/i,
      /ttam\.tiktok\.com\/s\/[a-zA-Z0-9]+/i
    ],
    videoPatterns: [
      /library\.tiktok\.com/i, // TikTok ads are primarily video
      // Preview URLs are always video for TikTok
      /v-ttam\.tiktok\.com\/s\/[a-zA-Z0-9]+/i,
      /ttam\.tiktok\.com\/s\/[a-zA-Z0-9]+/i
    ],
    guidance: 'Paste a URL from TikTok Commercial Content Library (library.tiktok.com) or ad preview link (v-ttam.tiktok.com)',
    screenshotTips: 'We\'ll capture the ad content and any video preview frames for comprehensive analysis.',
    supportsVideo: true,
    videoGuidance: 'TikTok video ads will be analyzed using multiple representative frames and audio transcript analysis.'
  },
  {
    id: 'google',
    name: 'Google Ads',
    patterns: [
      /adstransparency\.google\.com/i,
      /ads\.google\.com\/transparency/i,
      /transparencyreport\.google\.com.*ads/i
    ],
    videoPatterns: [
      /youtube\.com\/watch.*ad/i,
      /adstransparency\.google\.com.*video/i,
      /adstransparency\.google\.com.*youtube/i
    ],
    guidance: 'Paste a URL from Google Ads Transparency Center (adstransparency.google.com)',
    screenshotTips: 'We\'ll capture the ad preview and metadata for detailed analysis.',
    supportsVideo: true,
    videoGuidance: 'YouTube video ads will be analyzed using key frames and video context for optimal alignment assessment.'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    patterns: [
      /linkedin\.com\/ad-library/i,
      /linkedin\.com\/ads\/library/i,
      /www\.linkedin\.com\/ad-library/i
    ],
    videoPatterns: [
      /linkedin\.com\/ad-library.*video/i,
      /linkedin\.com\/ads\/library.*video/i
    ],
    guidance: 'Paste a URL from LinkedIn Ad Library (linkedin.com/ad-library)',
    screenshotTips: 'We\'ll capture the professional ad format and targeting information.',
    supportsVideo: true,
    videoGuidance: 'LinkedIn video ads will be analyzed for professional tone and B2B messaging alignment.'
  },
  {
    id: 'reddit',
    name: 'Reddit',
    patterns: [
      /reddit\.com\/promoted/i,
      /reddit\.com\/advertising/i,
      /ads\.reddit\.com/i,
      /reddit\.com\/r\/RedditPoliticalAds/i
    ],
    videoPatterns: [
      /reddit\.com.*\/v\/[a-z0-9]+/i,
      /reddit\.com.*video/i
    ],
    guidance: 'Paste a URL from Reddit advertising or promoted content',
    screenshotTips: 'We\'ll capture the promoted post format and community context.',
    supportsVideo: true,
    videoGuidance: 'Reddit video content will be analyzed for community authenticity and engagement potential.'
  }
];

/**
 * Detect platform from URL
 */
export const detectPlatform = (url: string): string | null => {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    
    for (const config of PLATFORM_CONFIGS) {
      for (const pattern of config.patterns) {
        if (pattern.test(urlObj.href)) {
          return config.id;
        }
      }
    }
    
    return null;
  } catch {
    return null;
  }
};

/**
 * Detect media type (image/video) from URL patterns and content hints
 */
export const detectMediaType = (url: string): MediaType => {
  if (!url) return 'unknown';
  
  try {
    const urlObj = new URL(url);
    const platform = detectPlatform(url);
    
    if (!platform) return 'unknown';
    
    const config = getPlatformConfig(platform);
    if (!config || !config.supportsVideo) return 'image';
    
    // Check for explicit video patterns
    if (config.videoPatterns) {
      for (const pattern of config.videoPatterns) {
        if (pattern.test(urlObj.href)) {
          return 'video';
        }
      }
    }
    
    // Platform-specific heuristics
    switch (platform) {
      case 'tiktok':
        // TikTok is primarily video-based
        return 'video';
      
      case 'meta':
        // Check for video indicators in Facebook Ad Library URLs
        if (urlObj.searchParams.get('media_type') === 'video' ||
            urlObj.href.includes('video') ||
            urlObj.href.includes('VIDEO')) {
          return 'video';
        }
        break;
      
      case 'google':
        // Check for YouTube or video indicators
        if (urlObj.href.includes('youtube') ||
            urlObj.href.includes('video') ||
            urlObj.searchParams.get('format') === 'video') {
          return 'video';
        }
        break;
      
      case 'linkedin':
      case 'reddit':
        // Check for video indicators in URL
        if (urlObj.href.includes('video') ||
            urlObj.href.includes('/v/')) {
          return 'video';
        }
        break;
    }
    
    // Default to image if no video indicators found
    return 'image';
  } catch {
    return 'unknown';
  }
};

/**
 * Comprehensive media detection with confidence scoring
 */
export const detectMediaWithConfidence = (url: string): MediaDetectionResult | null => {
  const platform = detectPlatform(url);
  if (!platform) return null;
  
  const mediaType = detectMediaType(url);
  
  // Calculate confidence based on platform and detection methods
  let confidence: 'high' | 'medium' | 'low' = 'medium';
  
  try {
    const urlObj = new URL(url);
    const config = getPlatformConfig(platform);
    
    if (platform === 'tiktok') {
      // TikTok is almost always video
      confidence = mediaType === 'video' ? 'high' : 'low';
    } else if (config?.videoPatterns) {
      // Check if we matched explicit video patterns
      const hasVideoPattern = config.videoPatterns.some(pattern => 
        pattern.test(urlObj.href)
      );
      
      if (hasVideoPattern) {
        confidence = 'high';
      } else if (mediaType === 'image') {
        confidence = 'medium';
      }
    }
    
    // Check for explicit media type parameters
    const mediaParam = urlObj.searchParams.get('media_type') || 
                      urlObj.searchParams.get('format') ||
                      urlObj.searchParams.get('type');
    
    if (mediaParam) {
      confidence = 'high';
    }
    
  } catch {
    confidence = 'low';
  }
  
  return {
    platform,
    mediaType,
    confidence
  };
};

/**
 * Get platform configuration
 */
export const getPlatformConfig = (platformId: string): PlatformConfig | null => {
  return PLATFORM_CONFIGS.find(config => config.id === platformId) || null;
};

/**
 * Validate if URL is a supported ad library URL
 */
export const isValidAdLibraryUrl = (url: string): boolean => {
  return detectPlatform(url) !== null;
};

/**
 * Enhanced URL validation with media type detection
 */
export interface UrlValidationResult {
  isValid: boolean;
  error?: string;
  platform?: string;
  mediaType?: MediaType;
  confidence?: 'high' | 'medium' | 'low';
  isVideoAd?: boolean;
  isPreviewUrl?: boolean;
  urlType?: string;
}

/**
 * Validate URL format and security with media detection
 */
export const validateAdUrl = (url: string): UrlValidationResult => {
  if (!url) {
    return { isValid: false, error: 'URL is required' };
  }
  
  // Basic URL format validation
  try {
    const urlObj = new URL(url);
    
    // Security checks
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: 'Only HTTP/HTTPS URLs are supported' };
    }
    
    // Block local/private URLs
    const hostname = urlObj.hostname.toLowerCase();
    if (hostname === 'localhost' || 
        hostname === '127.0.0.1' || 
        hostname.endsWith('.local') ||
        hostname.match(/^(10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.)/)) {
      return { isValid: false, error: 'Local and private URLs are not supported' };
    }
    
    // Check if it's a supported platform with media detection
    const mediaDetection = detectMediaWithConfidence(url);
    if (!mediaDetection) {
      return { 
        isValid: false, 
        error: 'URL is not from a supported ad library. Please use URLs from Meta, TikTok, Google, LinkedIn, or Reddit ad libraries.' 
      };
    }
    
    const isPreview = isPreviewUrl(url);
    
    return { 
      isValid: true, 
      platform: mediaDetection.platform,
      mediaType: mediaDetection.mediaType,
      confidence: mediaDetection.confidence,
      isVideoAd: mediaDetection.mediaType === 'video',
      isPreviewUrl: isPreview,
      urlType: getUrlTypeDescription(url)
    };
    
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }
};

/**
 * Extract ad ID or identifier from URL if possible
 */
export const extractAdId = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const platform = detectPlatform(url);
    
    switch (platform) {
      case 'meta':
        // Facebook ad library URLs often have ad_id parameter
        return urlObj.searchParams.get('ad_id') || 
               urlObj.searchParams.get('id') ||
               urlObj.pathname.split('/').pop() || null;
      
      case 'tiktok':
        // TikTok library URLs may have ad identifiers in path
        const tiktokId = urlObj.pathname.split('/').filter(Boolean).pop();
        return tiktokId && tiktokId !== 'ads' ? tiktokId : null;
      
      case 'google':
        // Google transparency center ad IDs
        return urlObj.searchParams.get('advertiser-id') ||
               urlObj.searchParams.get('creative-id') || null;
      
      case 'linkedin':
        // LinkedIn ad library identifiers
        return urlObj.searchParams.get('ad_id') ||
               urlObj.pathname.split('/').pop() || null;
      
      case 'reddit':
        // Reddit post/ad identifiers
        const redditMatch = urlObj.pathname.match(/\/comments\/([a-z0-9]+)/);
        return redditMatch ? redditMatch[1] : null;
      
      default:
        return null;
    }
  } catch {
    return null;
  }
};

/**
 * Format URL for display (truncate long URLs)
 */
export const formatUrlForDisplay = (url: string, maxLength: number = 50): string => {
  if (url.length <= maxLength) return url;
  
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    const path = urlObj.pathname + urlObj.search;
    
    if (domain.length + path.length <= maxLength) {
      return domain + path;
    }
    
    const availableLength = maxLength - domain.length - 3; // 3 for "..."
    if (availableLength > 0) {
      return domain + path.substring(0, availableLength) + '...';
    }
    
    return domain.substring(0, maxLength - 3) + '...';
  } catch {
    return url.substring(0, maxLength - 3) + '...';
  }
};

/**
 * Detect if URL is an ad preview URL vs library URL
 */
export const isPreviewUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    
    // Meta preview URL patterns
    if (urlObj.hostname.includes('fb.me') ||
        urlObj.pathname.includes('/ads/experience/confirmation')) {
      return true;
    }
    
    // TikTok preview URL patterns
    if (urlObj.hostname.includes('v-ttam.tiktok.com') ||
        urlObj.hostname.includes('ttam.tiktok.com')) {
      return true;
    }
    
    // Add other platforms as needed
    
    return false;
  } catch {
    return false;
  }
};

/**
 * Get URL type description for UI
 */
export const getUrlTypeDescription = (url: string): string => {
  if (isPreviewUrl(url)) {
    return 'Ad Preview Link';
  }
  return 'Ad Library URL';
};