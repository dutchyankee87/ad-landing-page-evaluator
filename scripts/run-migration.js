const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

// Database connection
const sql = postgres(process.env.DATABASE_URL);

async function runMigration() {
  try {
    console.log('🚀 Running visual assets storage migration...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/003_visual_assets_storage.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        await sql.unsafe(statement);
      }
    }
    
    console.log('✅ Migration completed successfully!');
    
    // Test the new columns
    const testResult = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'evaluations' 
      AND column_name IN (
        'ad_image_file_size',
        'landing_page_screenshot_url',
        'landing_page_screenshot_path',
        'screenshot_file_size',
        'visual_score',
        'contextual_score',
        'tone_score'
      )
      ORDER BY column_name;
    `;
    
    console.log('📊 New columns added:');
    testResult.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Check for required environment variable
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

runMigration();