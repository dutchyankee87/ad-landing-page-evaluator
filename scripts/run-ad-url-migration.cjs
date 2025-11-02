const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

// Database connection - handle URL encoding for special characters
let dbUrl = process.env.DATABASE_URL;
if (dbUrl && dbUrl.includes('#.')) {
  // URL encode the # character in the password
  dbUrl = dbUrl.replace('#.', '%23.');
}
const sql = postgres(dbUrl);

async function runMigration() {
  try {
    console.log('🚀 Running ad URL support migration...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/004_ad_url_support.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement) {
        console.log(`Executing: ${statement.substring(0, 60)}...`);
        await sql.unsafe(statement);
      }
    }
    
    console.log('✅ Migration completed successfully!');
    
    // Test the new columns
    const testResult = await sql`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns 
      WHERE table_name = 'evaluations' 
      AND column_name IN ('ad_url', 'ad_source_type')
      ORDER BY column_name;
    `;
    
    console.log('📊 New columns added:');
    testResult.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (default: ${row.column_default || 'NULL'})`);
    });
    
    // Test the constraint
    const constraintResult = await sql`
      SELECT conname, consrc 
      FROM pg_constraint 
      WHERE conname LIKE '%ad_source_type%';
    `;
    
    if (constraintResult.length > 0) {
      console.log('✅ Check constraint created successfully:');
      constraintResult.forEach(row => {
        console.log(`  - ${row.conname}: ${row.consrc}`);
      });
    }
    
    // Test the index
    const indexResult = await sql`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE tablename = 'evaluations' 
      AND indexname = 'idx_evaluations_ad_url';
    `;
    
    if (indexResult.length > 0) {
      console.log('✅ Index created successfully:');
      indexResult.forEach(row => {
        console.log(`  - ${row.indexname}`);
      });
    }
    
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