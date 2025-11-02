// Platform detection and URL validation for ad library URLs
export interface PlatformConfig {
  id: string;
  name: string;
  patterns: RegExp[];
  guidance: string;
  screenshotTips: string;
}

export const PLATFORM_CONFIGS: PlatformConfig[] = [
  {
    id: 'meta',
    name: 'Meta (Facebook/Instagram)',
    patterns: [
      /facebook\.com\/ads\/library/i,
      /facebook\.com\/ad_library/i,
      /www\.facebook\.com\/ads\/library/i,
      /m\.facebook\.com\/ads\/library/i
    ],
    guidance: 'Paste a URL from Facebook Ad Library (facebook.com/ads/library)',
    screenshotTips: 'We\'ll capture a clean screenshot of the ad from Facebook Ad Library for analysis.'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    patterns: [
      /library\.tiktok\.com\/ads/i,
      /ads\.tiktok\.com\/library/i,
      /library\.tiktok\.com/i
    ],
    guidance: 'Paste a URL from TikTok Commercial Content Library (library.tiktok.com)',
    screenshotTips: 'We\'ll capture the ad content and any video preview frames for comprehensive analysis.'
  },
  {
    id: 'google',
    name: 'Google Ads',
    patterns: [
      /adstransparency\.google\.com/i,
      /ads\.google\.com\/transparency/i,
      /transparencyreport\.google\.com.*ads/i
    ],
    guidance: 'Paste a URL from Google Ads Transparency Center (adstransparency.google.com)',
    screenshotTips: 'We\'ll capture the ad preview and metadata for detailed analysis.'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    patterns: [
      /linkedin\.com\/ad-library/i,
      /linkedin\.com\/ads\/library/i,
      /www\.linkedin\.com\/ad-library/i
    ],
    guidance: 'Paste a URL from LinkedIn Ad Library (linkedin.com/ad-library)',
    screenshotTips: 'We\'ll capture the professional ad format and targeting information.'
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
    guidance: 'Paste a URL from Reddit advertising or promoted content',
    screenshotTips: 'We\'ll capture the promoted post format and community context.'
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
 * Validate URL format and security
 */
export const validateAdUrl = (url: string): { isValid: boolean; error?: string; platform?: string } => {
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
    
    // Check if it's a supported platform
    const platform = detectPlatform(url);
    if (!platform) {
      return { 
        isValid: false, 
        error: 'URL is not from a supported ad library. Please use URLs from Meta, TikTok, Google, LinkedIn, or Reddit ad libraries.' 
      };
    }
    
    return { isValid: true, platform };
    
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