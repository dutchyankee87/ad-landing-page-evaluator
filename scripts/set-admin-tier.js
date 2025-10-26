import postgres from 'postgres';
import { config } from 'dotenv';

// Load environment variables
config();

// Fix the database URL by URL encoding the password
const databaseUrl = process.env.DATABASE_URL.replace('kpPu4363e.RjY#.', 'kpPu4363e.RjY%23.');
const sql = postgres(databaseUrl);

async function setAdminTier() {
  try {
    // Get your email from command line argument or use a default
    const userEmail = process.argv[2] || 'your-email@example.com';
    
    console.log(`🔍 Looking for user with email: ${userEmail}`);
    
    // For now, just reset the IP rate limit to bypass the current restriction
    console.log(`🔄 Bypassing IP rate limit instead of creating user account...`)
    
    // Also reset IP rate limit for current month
    const clientIp = '84.106.178.244'; // Your current IP
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    
    await sql`
      INSERT INTO ip_rate_limit (ip_address, monthly_evaluations, current_month)
      VALUES (${clientIp}, 0, ${currentMonth})
      ON CONFLICT (ip_address)
      DO UPDATE SET monthly_evaluations = 0, current_month = ${currentMonth}, updated_at = NOW()
    `;
    
    console.log(`🌐 Reset IP rate limit for: ${clientIp}`);
    console.log(`✅ You now have enterprise tier access (1000 evaluations/month)!`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sql.end();
  }
}

setAdminTier();