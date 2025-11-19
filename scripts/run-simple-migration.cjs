#!/usr/bin/env node

/**
 * Simple migration to add missing columns to evaluations table
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

async function runSimpleMigration() {
  const sql = postgres(databaseUrl);
  
  try {
    console.log('🚀 Adding missing columns to evaluations table...');
    
    // Add columns one by one with error handling
    const columnsToAdd = [
      { name: 'media_type', definition: 'TEXT' },
      { name: 'video_frame_count', definition: 'INTEGER' },
      { name: 'video_processing_method', definition: 'TEXT' },
      { name: 'comparison_type', definition: "TEXT DEFAULT 'single'" },
      { name: 'comparison_group_id', definition: 'UUID' },
      { name: 'element_comparisons', definition: 'JSONB' },
      { name: 'strategic_recommendations', definition: 'JSONB' },
      { name: 'risk_factors', definition: 'JSONB' },
      { name: 'missed_opportunities', definition: 'JSONB' },
      { name: 'heatmap_zones', definition: 'JSONB' },
      { name: 'insights', definition: 'JSONB' },
      { name: 'brand_coherence_score', definition: 'DECIMAL(3,1)' },
      { name: 'user_journey_alignment_score', definition: 'DECIMAL(3,1)' },
      { name: 'conversion_optimization_score', definition: 'DECIMAL(3,1)' }
    ];
    
    for (const column of columnsToAdd) {
      try {
        await sql`ALTER TABLE public.evaluations ADD COLUMN ${sql(column.name)} ${sql.unsafe(column.definition)}`;
        console.log(`✅ Added column: ${column.name}`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⚠️ Column already exists: ${column.name}`);
        } else {
          console.error(`❌ Failed to add column ${column.name}:`, error.message);
        }
      }
    }
    
    // Create comparison_groups table
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS public.comparison_groups (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          description TEXT,
          status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `;
      console.log('✅ Created comparison_groups table');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️ comparison_groups table already exists');
      } else {
        console.error('❌ Failed to create comparison_groups table:', error.message);
      }
    }
    
    // Add indexes
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_evaluations_comparison_type ON public.evaluations(comparison_type)',
      'CREATE INDEX IF NOT EXISTS idx_evaluations_comparison_group ON public.evaluations(comparison_group_id)',
      'CREATE INDEX IF NOT EXISTS idx_comparison_groups_user_id ON public.comparison_groups(user_id)'
    ];
    
    for (const indexSQL of indexes) {
      try {
        await sql.unsafe(indexSQL);
        console.log('✅ Created index');
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log('⚠️ Index already exists');
        } else {
          console.error('❌ Failed to create index:', error.message);
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
    
    const requiredColumns = [
      'media_type', 'video_frame_count', 'video_processing_method',
      'comparison_type', 'comparison_group_id', 'element_comparisons',
      'strategic_recommendations', 'risk_factors', 'missed_opportunities',
      'heatmap_zones', 'insights', 'brand_coherence_score',
      'user_journey_alignment_score', 'conversion_optimization_score'
    ];
    
    const existingColumns = columnCheck.map(col => col.column_name);
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
    
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
      console.log('✅ comparison_groups table exists');
    } else {
      console.log('❌ comparison_groups table missing');
    }
    
    console.log('\n🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Run migration
runSimpleMigration();