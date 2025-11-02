// Test platform detection functionality
import { detectPlatform, validateAdUrl, getPlatformConfig } from './src/lib/platform-detection.js';

const testUrls = [
  'https://facebook.com/ads/library/?id=123456789',
  'https://www.facebook.com/ads/library/123456789',
  'https://library.tiktok.com/ads?region=all&start_time=123',
  'https://adstransparency.google.com/advertiser/AR1234567890',
  'https://linkedin.com/ad-library/advertiser/12345',
  'https://reddit.com/r/RedditPoliticalAds/comments/abc123',
  'https://invalid-site.com/ads',
  'not-a-url',
  'http://localhost/test'
];

console.log('🧪 Testing Platform Detection\n');

testUrls.forEach((url, index) => {
  console.log(`Test ${index + 1}: ${url}`);
  
  const platform = detectPlatform(url);
  const validation = validateAdUrl(url);
  const config = platform ? getPlatformConfig(platform) : null;
  
  console.log(`  Platform: ${platform || 'None'}`);
  console.log(`  Valid: ${validation.isValid ? '✅' : '❌'}`);
  if (validation.error) {
    console.log(`  Error: ${validation.error}`);
  }
  if (config) {
    console.log(`  Name: ${config.name}`);
  }
  console.log('');
});

console.log('🎯 Test Summary:');
const validTests = testUrls.filter(url => validateAdUrl(url).isValid);
console.log(`Valid URLs: ${validTests.length}/${testUrls.length}`);
console.log(`Platforms detected: ${[...new Set(testUrls.map(detectPlatform).filter(Boolean))].join(', ')}`);