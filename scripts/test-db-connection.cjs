const postgres = require('postgres');

// Database connection - handle URL encoding for special characters
let dbUrl = process.env.DATABASE_URL;
if (dbUrl && dbUrl.includes('#.')) {
  // URL encode the # character in the password
  dbUrl = dbUrl.replace('#.', '%23.');
}

async function testConnection() {
  const sql = postgres(dbUrl);
  
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Database connected successfully at:', result[0].current_time);
    
    // Check if columns already exist
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'evaluations' 
      AND column_name IN ('ad_url', 'ad_source_type')
      ORDER BY column_name;
    `;
    
    console.log('📊 Existing ad URL columns:');
    if (columns.length === 0) {
      console.log('  - None found, need to create them');
      
      // Add columns one by one
      console.log('🔨 Adding ad_url column...');
      await sql`ALTER TABLE evaluations ADD COLUMN ad_url TEXT`;
      console.log('✅ ad_url column added');
      
      console.log('🔨 Adding ad_source_type column...');
      await sql`ALTER TABLE evaluations ADD COLUMN ad_source_type TEXT DEFAULT 'upload'`;
      console.log('✅ ad_source_type column added');
      
      console.log('🔨 Adding check constraint...');
      await sql`ALTER TABLE evaluations ADD CONSTRAINT check_ad_source_type CHECK (ad_source_type IN ('upload', 'url'))`;
      console.log('✅ Check constraint added');
      
      console.log('🔨 Adding index...');
      await sql`CREATE INDEX idx_evaluations_ad_url ON evaluations(ad_url) WHERE ad_url IS NOT NULL`;
      console.log('✅ Index added');
      
    } else {
      console.log('  - Columns already exist:');
      columns.forEach(col => {
        console.log(`    - ${col.column_name}: ${col.data_type}`);
      });
    }
    
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Details:', error);
  } finally {
    await sql.end();
  }
}

testConnection();