#!/usr/bin/env node

/**
 * Check what evaluation data exists in the database
 */

const postgres = require('postgres');

// Database connection using environment variables
let databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL or DIRECT_URL environment variable is required');
  process.exit(1);
}

// Fix URL encoding for special characters in password
databaseUrl = databaseUrl.replace('kpPu4363e.RjY#.', 'kpPu4363e.RjY%23.');

async function checkEvaluationData() {
  const sql = postgres(databaseUrl);
  
  try {
    console.log('🔍 Checking evaluation data in database...\n');
    
    // Check total evaluations
    const totalCount = await sql`
      SELECT COUNT(*) as count 
      FROM public.evaluations;
    `;
    console.log(`📊 Total Evaluations: ${totalCount[0].count}`);
    
    // Check recent evaluations (last 30 days)
    const recentCount = await sql`
      SELECT COUNT(*) as count 
      FROM public.evaluations 
      WHERE created_at >= NOW() - INTERVAL '30 days';
    `;
    console.log(`📅 Last 30 Days: ${recentCount[0].count}`);
    
    // Check by platform
    const platformBreakdown = await sql`
      SELECT 
        platform,
        COUNT(*) as count,
        MAX(created_at) as latest
      FROM public.evaluations 
      GROUP BY platform 
      ORDER BY count DESC;
    `;
    
    console.log('\n🌐 By Platform:');
    platformBreakdown.forEach(row => {
      const latest = row.latest ? new Date(row.latest).toLocaleDateString() : 'Never';
      console.log(`  ${row.platform || 'Unknown'}: ${row.count} (Latest: ${latest})`);
    });
    
    // Check evaluation timeline (last 60 days by week)
    const timeline = await sql`
      SELECT 
        DATE_TRUNC('week', created_at) as week,
        COUNT(*) as count
      FROM public.evaluations 
      WHERE created_at >= NOW() - INTERVAL '60 days'
      GROUP BY DATE_TRUNC('week', created_at)
      ORDER BY week DESC;
    `;
    
    console.log('\n📈 Recent Timeline (by week):');
    if (timeline.length === 0) {
      console.log('  No evaluations in last 60 days');
    } else {
      timeline.forEach(row => {
        const week = new Date(row.week).toLocaleDateString();
        console.log(`  Week of ${week}: ${row.count} evaluations`);
      });
    }
    
    // Check most recent evaluations
    const recent = await sql`
      SELECT 
        title,
        platform,
        overall_score,
        created_at,
        user_id IS NOT NULL as authenticated
      FROM public.evaluations 
      ORDER BY created_at DESC 
      LIMIT 10;
    `;
    
    console.log('\n🕒 Most Recent Evaluations:');
    if (recent.length === 0) {
      console.log('  No evaluations found');
    } else {
      recent.forEach(row => {
        const date = new Date(row.created_at).toLocaleString();
        const auth = row.authenticated ? '👤' : '🌐';
        console.log(`  ${auth} ${date} - ${row.platform || 'Unknown'} (Score: ${row.overall_score})`);
      });
    }
    
    // Check if any have element_comparisons data
    const withElementComparisons = await sql`
      SELECT COUNT(*) as count 
      FROM public.evaluations 
      WHERE element_comparisons IS NOT NULL;
    `;
    console.log(`\n🔬 With Element Analysis: ${withElementComparisons[0].count}`);
    
    // Check storage sizes if any screenshots exist
    const withScreenshots = await sql`
      SELECT COUNT(*) as count 
      FROM public.evaluations 
      WHERE ad_image_url IS NOT NULL 
      AND ad_image_url LIKE 'data:image%';
    `;
    console.log(`📸 With Screenshot Data: ${withScreenshots[0].count}`);
    
    // Check the actual column structure
    const columns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'evaluations' 
      AND table_schema = 'public'
      AND column_name LIKE '%image%'
      ORDER BY column_name;
    `;
    
    console.log('\n🗃️ Image-related columns found:', columns.map(c => c.column_name));
    
  } catch (error) {
    console.error('💥 Check failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Run check
checkEvaluationData();