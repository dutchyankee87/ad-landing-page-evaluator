import { supabase } from './storage';

export interface ScreenshotResult {
  success: boolean;
  url?: string;
  path?: string;
  filename?: string;
  size?: number;
  aboveFoldUrl?: string;
  isPlaceholder?: boolean;
  metadata?: {
    originalUrl: string;
    capturedAt: string;
    viewportWidth?: number;
    viewportHeight?: number;
    fullPage?: boolean;
    type?: string;
  };
  error?: string;
  details?: string;
}

export interface ScreenshotOptions {
  waitTime?: number;
  viewportWidth?: number;
  viewportHeight?: number;
  fullPage?: boolean;
  evaluationId?: string;
}

/**
 * Capture a screenshot of a landing page
 */
export const captureScreenshot = async (
  url: string,
  options: ScreenshotOptions = {}
): Promise<ScreenshotResult> => {
  try {
    // Validate URL
    const urlObject = new URL(url);
    
    // Don't screenshot localhost, file:// or other local URLs for security
    if (urlObject.hostname === 'localhost' || 
        urlObject.hostname === '127.0.0.1' || 
        urlObject.protocol === 'file:' ||
        urlObject.hostname.endsWith('.local')) {
      return {
        success: false,
        error: 'Cannot screenshot local or file URLs for security reasons'
      };
    }

    const { data, error } = await supabase.functions.invoke('capture-screenshot', {
      body: {
        url: url,
        waitTime: options.waitTime || 2000,
        viewportWidth: options.viewportWidth || 1920,
        viewportHeight: options.viewportHeight || 1080,
        fullPage: options.fullPage !== false, // Default to true
        evaluationId: options.evaluationId
      }
    });

    if (error) {
      console.error('Screenshot function error:', error);
      return {
        success: false,
        error: 'Screenshot service unavailable',
        details: error.message
      };
    }

    return data as ScreenshotResult;
  } catch (error) {
    console.error('Screenshot capture error:', error);
    return {
      success: false,
      error: 'Failed to capture screenshot',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Fallback: Generate a simple placeholder when screenshot fails
 */
export const generatePlaceholder = (url: string): ScreenshotResult => {
  try {
    const domain = new URL(url).hostname;
    
    // Create a data URL for a simple placeholder
    const svgContent = `
      <svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f8fafc"/>
        <rect x="0" y="0" width="100%" height="80" fill="#e2e8f0"/>
        <rect x="20" y="20" width="120" height="40" fill="#cbd5e1" rx="4"/>
        <rect x="160" y="28" width="80" height="24" fill="#e2e8f0" rx="4"/>
        <rect x="260" y="28" width="80" height="24" fill="#e2e8f0" rx="4"/>
        <rect x="360" y="28" width="80" height="24" fill="#e2e8f0" rx="4"/>
        
        <rect x="20" y="120" width="560" height="60" fill="#cbd5e1" rx="8"/>
        <rect x="20" y="200" width="800" height="24" fill="#e2e8f0" rx="4"/>
        <rect x="20" y="240" width="600" height="20" fill="#f1f5f9" rx="4"/>
        <rect x="20" y="280" width="700" height="20" fill="#f1f5f9" rx="4"/>
        
        <rect x="20" y="340" width="180" height="120" fill="#e2e8f0" rx="8"/>
        <rect x="220" y="340" width="180" height="120" fill="#e2e8f0" rx="8"/>
        <rect x="420" y="340" width="180" height="120" fill="#e2e8f0" rx="8"/>
        
        <text x="600" y="520" font-family="Arial, sans-serif" font-size="16" fill="#64748b" text-anchor="middle">
          Preview for: ${domain}
        </text>
        <text x="600" y="550" font-family="Arial, sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">
          Screenshot could not be captured
        </text>
      </svg>
    `;
    
    const dataUrl = `data:image/svg+xml;base64,${btoa(svgContent)}`;
    
    return {
      success: true,
      url: dataUrl,
      isPlaceholder: true,
      metadata: {
        originalUrl: url,
        capturedAt: new Date().toISOString(),
        type: 'placeholder'
      }
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to generate placeholder',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Smart screenshot capture with fallback
 */
export const captureScreenshotWithFallback = async (
  url: string,
  options: ScreenshotOptions = {}
): Promise<ScreenshotResult> => {
  // First, try the screenshot service
  const result = await captureScreenshot(url, options);
  
  if (result.success) {
    return result;
  }
  
  // If screenshot fails, generate a placeholder
  console.warn('Screenshot failed, generating placeholder:', result.error);
  return generatePlaceholder(url);
};

/**
 * Batch screenshot capture for multiple URLs
 */
export const captureMultipleScreenshots = async (
  urls: string[],
  options: ScreenshotOptions = {}
): Promise<ScreenshotResult[]> => {
  const promises = urls.map(url => captureScreenshotWithFallback(url, options));
  return Promise.all(promises);
};

/**
 * Check if a URL is safe to screenshot
 */
export const isUrlSafeToScreenshot = (url: string): boolean => {
  try {
    const urlObject = new URL(url);
    
    // Block local and private URLs
    const blockedHosts = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      '::1'
    ];
    
    if (blockedHosts.includes(urlObject.hostname)) {
      return false;
    }
    
    // Block file:// and other non-HTTP protocols
    if (!['http:', 'https:'].includes(urlObject.protocol)) {
      return false;
    }
    
    // Block .local domains
    if (urlObject.hostname.endsWith('.local')) {
      return false;
    }
    
    // Block private IP ranges (basic check)
    if (urlObject.hostname.match(/^(10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.)/)) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

/**
 * Get file size in a human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};