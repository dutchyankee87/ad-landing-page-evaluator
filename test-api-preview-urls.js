// Test actual API calls with preview URLs to verify end-to-end functionality
// This tests the complete workflow: preview URL → screenshot → GPT-4 Vision → analysis

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

console.log('🧪 Testing Real API Calls with Preview URLs\n');

// Test configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const TEST_LANDING_PAGE = 'https://example.com';

const testApiCall = async (testName, adUrl, platform, mediaType) => {
  console.log(`\n📋 ${testName}`);
  console.log('🔗 Ad URL:', adUrl);
  console.log('📱 Platform:', platform);
  console.log('🎬 Media Type:', mediaType);

  const requestData = {
    adData: {
      adUrl: adUrl,
      platform: platform,
      mediaType: mediaType
    },
    landingPageData: {
      url: TEST_LANDING_PAGE,
      title: 'Test Landing Page',
      mainContent: 'This is a test landing page for preview URL testing.'
    },
    audienceData: {
      ageRange: '25-34',
      gender: 'All',
      interests: 'Marketing, Technology, Social Media'
    }
  };

  console.log('\n🚀 Making API Request...');
  
  try {
    const startTime = Date.now();
    
    // Make the API call
    const response = await fetch(`${API_BASE_URL}/api/analyze-ad`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
      timeout: 120000 // 2 minute timeout
    });

    const endTime = Date.now();
    const processingTime = endTime - startTime;

    console.log(`⏱️ Processing Time: ${processingTime}ms (${(processingTime / 1000).toFixed(1)}s)`);

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ API Error: ${response.status} - ${response.statusText}`);
      console.log(`📝 Error Details: ${errorText}`);
      return { success: false, error: `HTTP ${response.status}`, details: errorText };
    }

    const result = await response.json();
    
    console.log('\n✅ API Response Successful!');
    console.log('📊 Analysis Results:');
    console.log(`   Overall Score: ${result.overallScore}/10`);
    
    if (result.componentScores) {
      console.log('   Component Scores:');
      console.log(`     - Visual Match: ${result.componentScores.visualMatch}/10`);
      console.log(`     - Contextual Match: ${result.componentScores.contextualMatch}/10`);
      console.log(`     - Tone Alignment: ${result.componentScores.toneAlignment}/10`);
    }
    
    if (result.suggestions) {
      const totalSuggestions = (result.suggestions.visual?.length || 0) + 
                              (result.suggestions.contextual?.length || 0) + 
                              (result.suggestions.tone?.length || 0);
      console.log(`   📝 Total Suggestions: ${totalSuggestions}`);
      
      if (result.suggestions.visual?.length > 0) {
        console.log(`   🎨 Visual: ${result.suggestions.visual.length} suggestions`);
      }
      if (result.suggestions.contextual?.length > 0) {
        console.log(`   📄 Contextual: ${result.suggestions.contextual.length} suggestions`);
      }
      if (result.suggestions.tone?.length > 0) {
        console.log(`   🗣️ Tone: ${result.suggestions.tone.length} suggestions`);
      }
    }

    // Check if this appears to be a real analysis (not fallback)
    const isRealAnalysis = result.overallScore !== 7 || 
                          !result.suggestions?.visual?.some(s => s.includes('#4285F4'));
    
    console.log(`\n🔍 Analysis Type: ${isRealAnalysis ? 'Real GPT-4 Vision Analysis' : 'Fallback Response'}`);
    
    return { 
      success: true, 
      result, 
      processingTime,
      isRealAnalysis,
      responseSize: JSON.stringify(result).length
    };

  } catch (error) {
    console.log(`❌ API Call Failed: ${error.message}`);
    return { success: false, error: error.message };
  }
};

const runApiTests = async () => {
  console.log('🚀 Starting API Tests with Preview URLs\n');
  console.log(`🌐 Testing against: ${API_BASE_URL}/api/analyze-ad`);
  console.log(`🏠 Landing page: ${TEST_LANDING_PAGE}`);

  const results = [];

  // Test 1: Meta Preview URL
  console.log('\n' + '='.repeat(60));
  const metaResult = await testApiCall(
    'TEST 1: Meta/Facebook Preview URL',
    'https://fb.me/adspreview/facebook/1ZfUugd5CNEonTq',
    'meta',
    'image'
  );
  results.push({ name: 'Meta Preview URL', ...metaResult });

  // Small delay between tests
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 2: TikTok Preview URL
  console.log('\n' + '='.repeat(60));
  const tiktokResult = await testApiCall(
    'TEST 2: TikTok Preview URL',
    'https://v-ttam.tiktok.com/s/ZSy23rPVs/',
    'tiktok',
    'video'
  );
  results.push({ name: 'TikTok Preview URL', ...tiktokResult });

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 FINAL TEST SUMMARY');
  console.log('='.repeat(60));

  let successCount = 0;
  let realAnalysisCount = 0;
  let totalProcessingTime = 0;

  results.forEach((result, index) => {
    console.log(`\n${index + 1}. ${result.name}:`);
    console.log(`   Status: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`);
    
    if (result.success) {
      successCount++;
      console.log(`   Score: ${result.result.overallScore}/10`);
      console.log(`   Time: ${(result.processingTime / 1000).toFixed(1)}s`);
      console.log(`   Analysis: ${result.isRealAnalysis ? 'Real GPT-4 Vision' : 'Fallback'}`);
      console.log(`   Size: ${(result.responseSize / 1024).toFixed(1)}KB`);
      
      if (result.isRealAnalysis) {
        realAnalysisCount++;
      }
      
      totalProcessingTime += result.processingTime;
    } else {
      console.log(`   Error: ${result.error}`);
      if (result.details) {
        console.log(`   Details: ${result.details.substring(0, 100)}...`);
      }
    }
  });

  console.log(`\n📈 Overall Results:`);
  console.log(`   Successful API Calls: ${successCount}/${results.length}`);
  console.log(`   Real GPT-4 Analyses: ${realAnalysisCount}/${successCount}`);
  console.log(`   Average Processing Time: ${successCount > 0 ? (totalProcessingTime / successCount / 1000).toFixed(1) : 0}s`);

  if (successCount === results.length && realAnalysisCount > 0) {
    console.log('\n🎉 PREVIEW URL IMPLEMENTATION VERIFIED!');
    console.log('✅ Preview URLs are successfully processed');
    console.log('✅ Screenshots are captured from preview pages');
    console.log('✅ GPT-4 Vision receives and analyzes the images');
    console.log('✅ Complete workflow functions end-to-end');
  } else if (successCount === results.length) {
    console.log('\n⚠️ API CALLS SUCCESSFUL BUT USING FALLBACK');
    console.log('✅ Preview URL detection working');
    console.log('❌ Screenshot capture or GPT-4 analysis may have issues');
    console.log('💡 Check API keys and screenshot service availability');
  } else {
    console.log('\n❌ SOME TESTS FAILED');
    console.log('🔍 Check API endpoint availability and configuration');
  }

  console.log('\n🔧 Troubleshooting:');
  console.log('1. Ensure API server is running');
  console.log('2. Check OPENAI_API_KEY environment variable');
  console.log('3. Check SCREENSHOT_API_TOKEN environment variable');
  console.log('4. Verify preview URLs are still active/valid');
  console.log('5. Check network connectivity and timeouts');
};

// Run the tests
runApiTests().catch(console.error);