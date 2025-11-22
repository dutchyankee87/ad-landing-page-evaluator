async function testUsageAPI() {
  const userEmail = 'richardson.dillon@gmail.com';
  
  console.log('🧪 Testing usage API endpoint...');
  
  try {
    const response = await fetch('https://www.adalign.io/api/check-usage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userEmail })
    });
    
    console.log('📡 API Response Status:', response.status);
    console.log('📡 API Response Headers:', Object.fromEntries(response.headers));
    
    const data = await response.json();
    console.log('📊 API Response Data:', JSON.stringify(data, null, 2));
    
    if (data.used !== undefined) {
      console.log('✅ API is working correctly');
      console.log(`   Used: ${data.used}/${data.limit}`);
      console.log(`   Remaining: ${data.remaining}`);
      console.log(`   Tier: ${data.tier}`);
      console.log(`   Can Evaluate: ${data.canEvaluate}`);
    } else {
      console.log('❌ Unexpected API response format');
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

testUsageAPI();