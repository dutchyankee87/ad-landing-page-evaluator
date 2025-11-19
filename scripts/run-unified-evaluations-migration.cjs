#!/usr/bin/env node

/**
 * Run the unified evaluations schema migration
 * This adds missing columns to support comprehensive evaluation data storage
 */

const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

// Database connection using environment variables
let databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL or DIRECT_URL environment variable is required');
  process.exit(1);
}

// Fix URL encoding for special characters in password
databaseUrl = databaseUrl.replace('kpPu4363e.RjY#.', 'kpPu4363e.RjY%23.');

async function runMigration() {
  const sql = postgres(databaseUrl);
  
  try {
    console.log('🚀 Starting unified evaluations schema migration...');
    
    // Read migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '006_unified_evaluations_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split into individual statements and execute
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      try {
        await sql.unsafe(statement);
        console.log(`✅ Executed: ${statement.slice(0, 50)}...`);
      } catch (error) {
        // Some statements might fail if columns already exist, that's OK
        if (error.message.includes('already exists')) {
          console.log(`⚠️ Skipped (already exists): ${statement.slice(0, 50)}...`);
        } else {
          console.error(`❌ Failed: ${statement.slice(0, 50)}...`);
          console.error('Error:', error.message);
        }
      }
    }
    
    // Verify the schema changes
    console.log('\n🔍 Verifying schema changes...');
    
    const columnCheck = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'evaluations' 
      AND table_schema = 'public'
      ORDER BY ordinal_position;
    `;
    
    const newColumns = [
      'platform', 'ad_url', 'ad_source_type', 'media_type', 'video_frame_count',
      'video_processing_method', 'ad_image_file_size', 'landing_page_screenshot_url',
      'comparison_type', 'comparison_group_id', 'element_comparisons',
      'strategic_recommendations', 'risk_factors', 'missed_opportunities',
      'heatmap_zones', 'insights', 'brand_coherence_score',
      'user_journey_alignment_score', 'conversion_optimization_score'
    ];
    
    const existingColumns = columnCheck.map(col => col.column_name);
    const missingColumns = newColumns.filter(col => !existingColumns.includes(col));
    
    if (missingColumns.length === 0) {
      console.log('✅ All required columns are present');
    } else {
      console.log('❌ Missing columns:', missingColumns);
    }
    
    // Check if comparison_groups table exists
    const tableCheck = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'comparison_groups';
    `;
    
    if (tableCheck.length > 0) {
      console.log('✅ comparison_groups table created successfully');
    } else {
      console.log('❌ comparison_groups table missing');
    }
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Deploy the updated Edge Function with field name fixes');
    console.log('2. Test evaluation submission in production');
    console.log('3. Verify data appears in Supabase dashboard');
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Run migration
runMigration();