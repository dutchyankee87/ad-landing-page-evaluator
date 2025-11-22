import { nanoid } from 'nanoid';

// Duration constants
export const SHARE_DURATION_HOURS = 72; // 3 days
export const MAX_VIEWS_PER_SHARE = 1000;

/**
 * Generates a secure, URL-safe share token
 */
export function generateShareToken(): string {
  return nanoid(21); // URL-safe, collision-resistant
}

/**
 * Sanitizes evaluation data for safe public sharing
 * Removes sensitive information while preserving insights
 */
export function sanitizeEvaluationData(evaluation: any): Record<string, any> {
  return {
    // Core scores (safe to share)
    overallScore: evaluation.overallScore,
    visualScore: evaluation.visualScore,
    contextualScore: evaluation.contextualScore,
    toneScore: evaluation.toneScore,
    
    // Platform and timing (non-sensitive)
    platform: evaluation.platform,
    createdAt: evaluation.createdAt,
    
    // Sanitized recommendations (remove specific implementation details)
    visualSuggestions: sanitizeRecommendations(evaluation.visualSuggestions),
    contextualSuggestions: sanitizeRecommendations(evaluation.contextualSuggestions),
    toneSuggestions: sanitizeRecommendations(evaluation.toneSuggestions),
    
    // Element comparisons (sanitized)
    elementComparisons: sanitizeElementComparisons(evaluation.elementComparisons),
    
    // Generic landing page info (no personal data - target age removed for privacy)
    landingPageTitle: evaluation.landingPageTitle,
    
    // Analysis metadata
    analysisModel: evaluation.analysisModel,
    
    // Component scores for detailed breakdown
    componentScores: {
      visual: evaluation.visualScore,
      contextual: evaluation.contextualScore,
      tone: evaluation.toneScore
    }
  };
}

/**
 * Sanitizes element comparisons to remove sensitive data while preserving insights
 */
function sanitizeElementComparisons(comparisons: any): any {
  if (!comparisons || !Array.isArray(comparisons)) return comparisons;
  
  return comparisons.map((comparison: any) => {
    if (typeof comparison !== 'object' || comparison === null) return comparison;
    
    return {
      ...comparison,
      // Keep analysis structure but sanitize content
      adContent: comparison.adContent ? '[Ad Content]' : undefined,
      pageContent: comparison.pageContent ? '[Page Content]' : undefined,
      analysis: sanitizeText(comparison.analysis || ''),
      recommendation: sanitizeText(comparison.recommendation || ''),
      // Keep scores and status for insights
      status: comparison.status,
      severity: comparison.severity,
      category: comparison.category,
      element: comparison.element,
      score: comparison.score,
      colorAnalysis: comparison.colorAnalysis
    };
  });
}

/**
 * Sanitizes recommendation arrays to remove sensitive business details
 */
function sanitizeRecommendations(suggestions: any): any {
  if (!suggestions || !Array.isArray(suggestions)) return suggestions;
  
  return suggestions.map((suggestion: any) => {
    if (typeof suggestion === 'string') {
      return sanitizeText(suggestion);
    }
    if (typeof suggestion === 'object' && suggestion !== null) {
      return {
        ...suggestion,
        recommendation: typeof suggestion.recommendation === 'string' 
          ? sanitizeText(suggestion.recommendation) 
          : suggestion.recommendation
      };
    }
    return suggestion;
  });
}

/**
 * Sanitizes text content to remove potentially sensitive information
 */
function sanitizeText(text: string): string {
  return text
    // Remove specific URLs (keep domain patterns)
    .replace(/https?:\/\/[^\s]+/g, '[URL]')
    // Remove email addresses
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]')
    // Remove phone numbers
    .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]')
    // Keep the text readable and actionable
    .trim();
}

/**
 * Generates a shareable URL for a report
 */
export function generateShareUrl(shareToken: string): string {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.VITE_APP_URL || 'https://adalign.io';
  
  return `${baseUrl}/shared/${shareToken}`;
}

/**
 * Calculates expiration date for shared reports
 */
export function calculateExpirationDate(): Date {
  return new Date(Date.now() + SHARE_DURATION_HOURS * 60 * 60 * 1000);
}

/**
 * Checks if a shared report has expired
 */
export function isExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

/**
 * Formats share data for clipboard copying
 */
export function formatShareText(shareUrl: string, title: string, score: number): string {
  return `Check out this ad analysis report: "${title}"
  
Overall Alignment Score: ${score}/10

View the full report: ${shareUrl}

Analyzed with adalign.io - AI-powered ad optimization`;
}

/**
 * Formats data for PDF export (used by print functionality)
 */
export function formatPdfData(evaluation: any) {
  return {
    title: `Ad Analysis Report - ${evaluation.platform || 'Unknown Platform'}`,
    timestamp: new Date().toLocaleDateString(),
    scores: {
      overall: evaluation.overallScore,
      visual: evaluation.visualScore || evaluation.componentScores?.visual,
      contextual: evaluation.contextualScore || evaluation.componentScores?.contextual,
      tone: evaluation.toneScore || evaluation.componentScores?.tone
    },
    recommendations: {
      visual: evaluation.visualSuggestions || [],
      contextual: evaluation.contextualSuggestions || [],
      tone: evaluation.toneSuggestions || []
    },
    metadata: {
      platform: evaluation.platform,
      targetAudience: {
        // Age removed for privacy
        gender: evaluation.targetGender,
        location: evaluation.targetLocation
      },
      analysisModel: evaluation.analysisModel,
      createdAt: evaluation.createdAt
    }
  };
}

/**
 * Validates share token format
 */
export function isValidShareToken(token: string): boolean {
  // nanoid tokens are 21 characters, URL-safe
  return typeof token === 'string' && /^[A-Za-z0-9_-]{21}$/.test(token);
}

/**
 * Creates a title for shared reports
 */
export function createShareTitle(evaluation: any): string {
  const platform = evaluation.platform ? 
    evaluation.platform.charAt(0).toUpperCase() + evaluation.platform.slice(1) : 
    'Platform';
  
  const score = Math.round(evaluation.overallScore || 0);
  const date = new Date().toLocaleDateString();
  
  return `${platform} Ad Analysis - ${score}/10 Score (${date})`;
}

/**
 * Rate limiting check for share creation
 */
export function canCreateShare(lastShareTime: Date | null, minIntervalMinutes = 5): boolean {
  if (!lastShareTime) return true;
  
  const now = new Date();
  const timeDiff = now.getTime() - lastShareTime.getTime();
  const minInterval = minIntervalMinutes * 60 * 1000;
  
  return timeDiff >= minInterval;
}