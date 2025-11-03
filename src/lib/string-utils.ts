// String utility functions with safe error handling

/**
 * Safely capitalizes the first letter of a string
 * Returns the original string if it's not a valid string or is empty
 */
export function safeCapitalize(str: string | undefined | null): string {
  if (!str || typeof str !== 'string' || str.length === 0) {
    return str || '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Safely formats a string by capitalizing each word
 * Handles hyphen-separated words (e.g., "real-estate" -> "Real Estate")
 */
export function safeFormatTitle(str: string | undefined | null): string {
  if (!str || typeof str !== 'string') {
    return 'Unknown';
  }
  
  return str.split('-').map(word => safeCapitalize(word)).join(' ');
}

/**
 * Safely truncates a string to a maximum length
 */
export function safeTruncate(str: string | undefined | null, maxLength: number): string {
  if (!str || typeof str !== 'string') {
    return '';
  }
  
  if (str.length <= maxLength) {
    return str;
  }
  
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Safely checks if a string is empty or just whitespace
 */
export function isEmpty(str: string | undefined | null): boolean {
  return !str || typeof str !== 'string' || str.trim().length === 0;
}