// Simple test for platform detection patterns
const testUrls = [
  'https://facebook.com/ads/library/?id=123456789',
  'https://www.facebook.com/ads/library/123456789',
  'https://library.tiktok.com/ads?region=all&start_time=123',
  'https://adstransparency.google.com/advertiser/AR1234567890',
  'https://linkedin.com/ad-library/advertiser/12345',
  'https://reddit.com/r/RedditPoliticalAds/comments/abc123',
  'https://invalid-site.com/ads'
];

// Platform patterns (copied from our TypeScript file)
const platformPatterns = {
  meta: [
    /facebook\.com\/ads\/library/i,
    /facebook\.com\/ad_library/i,
    /www\.facebook\.com\/ads\/library/i,
    /m\.facebook\.com\/ads\/library/i
  ],
  tiktok: [
    /library\.tiktok\.com\/ads/i,
    /ads\.tiktok\.com\/library/i,
    /library\.tiktok\.com/i
  ],
  google: [
    /adstransparency\.google\.com/i,
    /ads\.google\.com\/transparency/i,
    /transparencyreport\.google\.com.*ads/i
  ],
  linkedin: [
    /linkedin\.com\/ad-library/i,
    /linkedin\.com\/ads\/library/i,
    /www\.linkedin\.com\/ad-library/i
  ],
  reddit: [
    /reddit\.com\/promoted/i,
    /reddit\.com\/advertising/i,
    /ads\.reddit\.com/i,
    /reddit\.com\/r\/RedditPoliticalAds/i
  ]
};

function detectPlatform(url) {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    
    for (const [platform, patterns] of Object.entries(platformPatterns)) {
      for (const pattern of patterns) {
        if (pattern.test(urlObj.href)) {
          return platform;
        }
      }
    }
    
    return null;
  } catch {
    return null;
  }
}

console.log('🧪 Testing Platform Detection Patterns\n');

testUrls.forEach((url, index) => {
  console.log(`Test ${index + 1}: ${url}`);
  const platform = detectPlatform(url);
  console.log(`  Platform: ${platform || 'None'} ${platform ? '✅' : '❌'}`);
  console.log('');
});

console.log('🎯 Test Summary:');
const detectedPlatforms = testUrls.map(detectPlatform).filter(Boolean);
console.log(`Detected platforms: ${detectedPlatforms.length}/${testUrls.length}`);
console.log(`Unique platforms: ${[...new Set(detectedPlatforms)].join(', ')}`);