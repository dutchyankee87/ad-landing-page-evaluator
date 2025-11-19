#!/usr/bin/env node

const postgres = require('postgres');

let databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;
databaseUrl = databaseUrl.replace('kpPu4363e.RjY#.', 'kpPu4363e.RjY%23.');

async function checkImageData() {
  const sql = postgres(databaseUrl);
  
  try {
    console.log('🔍 Analyzing stored evaluation data...\n');
    
    // Check screenshot URLs to see if they're base64 data URLs or external URLs
    const screenshots = await sql`
      SELECT 
        id,
        platform,
        created_at,
        CASE 
          WHEN ad_screenshot_url LIKE 'data:image%' THEN 'Base64 Data'
          WHEN ad_screenshot_url LIKE 'http%' THEN 'External URL'
          WHEN ad_screenshot_url IS NULL THEN 'No Image'
          ELSE 'Other'
        END as image_type,
        LENGTH(ad_screenshot_url) as url_length,
        ad_source_type,
        media_type
      FROM public.evaluations 
      ORDER BY created_at DESC 
      LIMIT 10;
    `;
    
    console.log('📊 Recent Evaluation Image Data:');
    screenshots.forEach((row, i) => {
      const date = new Date(row.created_at).toLocaleDateString();
      const length = row.url_length ? `${Math.round(row.url_length/1000)}KB` : '0KB';
      console.log(`${i+1}. ${date} - ${row.platform} - ${row.image_type} (${length}) - Source: ${row.ad_source_type || 'N/A'}`);
    });
    
    // Count by image type
    const imageTypeCounts = await sql`
      SELECT 
        CASE 
          WHEN ad_screenshot_url LIKE 'data:image%' THEN 'Base64 Screenshot'
          WHEN ad_screenshot_url LIKE 'http%' THEN 'External URL'
          WHEN ad_screenshot_url IS NULL THEN 'No Image'
          ELSE 'Other'
        END as type,
        COUNT(*) as count
      FROM public.evaluations 
      GROUP BY 1;
    `;
    
    console.log('\n📈 Image Storage Breakdown:');
    imageTypeCounts.forEach(row => {
      console.log(`  ${row.type}: ${row.count}`);
    });
    
    // Check if any have element comparisons (new format)
    const withElements = await sql`
      SELECT COUNT(*) as count 
      FROM public.evaluations 
      WHERE element_comparisons IS NOT NULL;
    `;
    
    console.log(`\n🔬 Evaluations with Element Analysis: ${withElements[0].count}`);
    
    // Check analysis sources
    const analysisSources = await sql`
      SELECT 
        analysis_model,
        COUNT(*) as count,
        MAX(created_at) as latest
      FROM public.evaluations 
      GROUP BY analysis_model;
    `;
    
    console.log('\n🤖 Analysis Sources:');
    analysisSources.forEach(row => {
      const latest = row.latest ? new Date(row.latest).toLocaleDateString() : 'Never';
      console.log(`  ${row.analysis_model || 'Unknown'}: ${row.count} (Latest: ${latest})`);
    });
    
  } catch (error) {
    console.error('💥 Check failed:', error);
  } finally {
    await sql.end();
  }
}

checkImageData();