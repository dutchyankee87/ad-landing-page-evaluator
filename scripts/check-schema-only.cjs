#!/usr/bin/env node

const postgres = require('postgres');

let databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;
databaseUrl = databaseUrl.replace('kpPu4363e.RjY#.', 'kpPu4363e.RjY%23.');

async function checkSchema() {
  const sql = postgres(databaseUrl);
  
  try {
    // Check all columns in evaluations table
    const columns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'evaluations' 
      AND table_schema = 'public'
      ORDER BY ordinal_position;
    `;
    
    console.log('🗃️ Evaluations Table Schema:');
    columns.forEach(col => {
      console.log(`  ${col.column_name} (${col.data_type})`);
    });
    
    // Check for image-related data using correct column name
    const imageColumn = columns.find(c => c.column_name.includes('image'));
    if (imageColumn) {
      console.log(`\n📸 Image column found: ${imageColumn.column_name}`);
      
      const withImages = await sql`
        SELECT COUNT(*) as count 
        FROM public.evaluations 
        WHERE ${sql(imageColumn.column_name)} IS NOT NULL;
      `;
      console.log(`Records with images: ${withImages[0].count}`);
    }
    
  } catch (error) {
    console.error('💥 Failed:', error.message);
  } finally {
    await sql.end();
  }
}

checkSchema();